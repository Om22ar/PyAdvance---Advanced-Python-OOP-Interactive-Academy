import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import {join, resolve, normalize, dirname, relative} from 'node:path';
import {execFile, spawn} from 'node:child_process';
import {mkdir, writeFile, readdir, readFile, stat} from 'node:fs/promises';
import {tmpdir} from 'node:os';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

app.use(express.json({limit: '5mb'}));

const WORKSPACE_ROOT = join(tmpdir(), 'pyadvance-local-workspaces');

function sanitizeProjectId(id: string): string {
  return (id || 'default-project').replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64);
}

function safeResolve(baseDir: string, targetRel: string): string | null {
  const cleaned = normalize(targetRel).replace(/^(\.\.(\/|\\|$))+/, '');
  const resolvedPath = resolve(baseDir, cleaned);
  if (!resolvedPath.startsWith(resolve(baseDir))) {
    return null;
  }
  return resolvedPath;
}

function runExecFile(
  cmd: string,
  args: string[],
  timeoutMs = 4000,
): Promise<{ok: boolean; stdout: string; stderr: string}> {
  return new Promise((res) => {
    execFile(cmd, args, {timeout: timeoutMs}, (error, stdout, stderr) => {
      if (error) {
        res({
          ok: false,
          stdout: String(stdout || '').trim(),
          stderr: String(stderr || error.message || '').trim(),
        });
      } else {
        res({
          ok: true,
          stdout: String(stdout || '').trim(),
          stderr: String(stderr || '').trim(),
        });
      }
    });
  });
}

async function syncProjectToDisk(
  projectId: string,
  folders: string[],
  files: Record<string, string>,
): Promise<string> {
  const projectDir = join(WORKSPACE_ROOT, sanitizeProjectId(projectId));
  await mkdir(projectDir, {recursive: true});

  for (const folder of folders || []) {
    const folderPath = safeResolve(projectDir, folder);
    if (folderPath) {
      await mkdir(folderPath, {recursive: true});
    }
  }

  for (const [relPath, content] of Object.entries(files || {})) {
    const filePath = safeResolve(projectDir, relPath);
    if (filePath) {
      await mkdir(dirname(filePath), {recursive: true});
      await writeFile(filePath, content ?? '', 'utf-8');
    }
  }

  return projectDir;
}

async function readWorkspaceFiles(
  projectDir: string,
): Promise<{files: Record<string, string>; folders: string[]}> {
  const files: Record<string, string> = {};
  const folders: string[] = [];

  async function walk(currentDir: string) {
    const entries = await readdir(currentDir, {withFileTypes: true});
    for (const entry of entries) {
      if (entry.name === '__pycache__' || entry.name.startsWith('.')) continue;
      const fullPath = join(currentDir, entry.name);
      const relPath = relative(projectDir, fullPath).replace(/\\/g, '/');
      if (entry.isDirectory()) {
        folders.push(relPath);
        await walk(fullPath);
      } else if (entry.isFile()) {
        try {
          const info = await stat(fullPath);
          if (info.size <= 256 * 1024) {
            files[relPath] = await readFile(fullPath, 'utf-8');
          }
        } catch {
          // Ignore binary or unreadable file
        }
      }
    }
  }

  try {
    await walk(projectDir);
  } catch {
    // Ignore walk errors
  }
  return {files, folders};
}

/**
 * Detect and verify local Python installation path
 */
app.post('/api/python/detect', async (req, res) => {
  const customPath =
    typeof req.body?.pythonPath === 'string' ? req.body.pythonPath.trim() : '';
  const candidates = Array.from(
    new Set(
      [
        customPath,
        '/usr/bin/python3',
        '/usr/local/bin/python3',
        'python3',
        'python',
        '/opt/conda/bin/python3',
      ].filter(Boolean),
    ),
  );

  const detectedList: {
    path: string;
    executable: string;
    version: string;
    platform: string;
  }[] = [];

  for (const candidate of candidates) {
    const check = await runExecFile(candidate, [
      '-c',
      'import sys, platform; print(sys.version.split()[0]); print(sys.executable); print(platform.platform())',
    ]);
    if (check.ok && check.stdout) {
      const lines = check.stdout.split(/\r?\n/);
      detectedList.push({
        path: candidate,
        version: lines[0] || '3.x',
        executable: lines[1] || candidate,
        platform: lines[2] || process.platform,
      });
    }
  }

  const requestedResult = customPath
    ? detectedList.find((d) => d.path === customPath)
    : detectedList[0];

  if (requestedResult || detectedList.length > 0) {
    const active = requestedResult || detectedList[0];
    res.json({
      ok: true,
      requestedPathValid: customPath ? Boolean(requestedResult) : true,
      activePath: active.path,
      executable: active.executable,
      version: active.version,
      platform: active.platform,
      candidates: detectedList,
      workspaceBase: WORKSPACE_ROOT,
    });
  } else {
    res.json({
      ok: false,
      requestedPathValid: false,
      activePath: customPath || 'python3',
      executable: '',
      version: '',
      platform: process.platform,
      candidates: [],
      error: `Could not locate Python executable at "${customPath || 'python3'}". Falling back to WebAssembly runtime.`,
    });
  }
});

/**
 * Execute multi-file Python project or terminal command using local Python path
 */
app.post('/api/python/execute', async (req, res) => {
  const startTime = Date.now();
  const {
    projectId = 'default-project',
    pythonPath = '/usr/bin/python3',
    entryFile = 'main.py',
    files = {},
    folders = [],
    stdin = '',
    args = [],
    terminalCommand = '',
  } = req.body || {};

  try {
    const projectDir = await syncProjectToDisk(projectId, folders, files);

    let spawnCmd = (pythonPath || '/usr/bin/python3').trim();
    let spawnArgs: string[] = ['-u', entryFile, ...(Array.isArray(args) ? args : [])];

    if (typeof terminalCommand === 'string' && terminalCommand.trim()) {
      const rawCmd = terminalCommand.trim();
      // Parse terminal command safely inside the project workspace
      const tokens =
        rawCmd.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map((t) =>
          t.replace(/^['"]|['"]$/g, ''),
        ) || [];
      if (tokens.length > 0) {
        const first = tokens[0];
        if (first === 'python' || first === 'python3') {
          spawnCmd = spawnCmd || '/usr/bin/python3';
          spawnArgs = ['-u', ...tokens.slice(1)];
        } else if (
          ['ls', 'pwd', 'cat', 'head', 'tail', 'wc', 'find', 'grep', 'echo', 'mkdir', 'touch', 'rm'].includes(
            first,
          )
        ) {
          spawnCmd = first;
          spawnArgs = tokens.slice(1);
        } else {
          // Run arbitrary python expression if not a shell utility
          spawnCmd = spawnCmd || '/usr/bin/python3';
          spawnArgs = ['-u', '-c', rawCmd];
        }
      }
    }

    const execResult = await new Promise<{
      stdout: string;
      stderr: string;
      exitCode: number;
      timedOut: boolean;
      usedBin: string;
    }>((resolveRun) => {
      const attemptSpawn = (binToUse: string, isFallback = false) => {
        let stdoutBuf = '';
        let stderrBuf = '';
        let timedOut = false;

        const child = spawn(binToUse, spawnArgs, {
          cwd: projectDir,
          env: {
            ...process.env,
            PYTHONUNBUFFERED: '1',
            PYTHONDONTWRITEBYTECODE: '1',
            PYTHONPATH: projectDir,
          },
        });

        const timer = setTimeout(() => {
          timedOut = true;
          child.kill('SIGKILL');
        }, 10000);

        if (stdin && child.stdin) {
          child.stdin.write(String(stdin) + '\n');
          child.stdin.end();
        } else if (child.stdin) {
          child.stdin.end();
        }

        child.stdout.on('data', (chunk) => {
          if (stdoutBuf.length < 200_000) {
            stdoutBuf += chunk.toString();
          }
        });

        child.stderr.on('data', (chunk) => {
          if (stderrBuf.length < 200_000) {
            stderrBuf += chunk.toString();
          }
        });

        child.on('error', (err: NodeJS.ErrnoException) => {
          clearTimeout(timer);
          if (!isFallback && binToUse !== '/usr/bin/python3' && spawnCmd !== 'ls') {
            // If user entered a custom path that doesn't exist on server, fallback to /usr/bin/python3 with a notice
            attemptSpawn('/usr/bin/python3', true);
            return;
          }
          resolveRun({
            stdout: stdoutBuf,
            stderr: `Failed to execute "${binToUse}": ${err.message}`,
            exitCode: 127,
            timedOut: false,
            usedBin: binToUse,
          });
        });

        child.on('close', (code) => {
          clearTimeout(timer);
          if (timedOut) {
            stderrBuf += '\n[Execution Terminated: Exceeded 10.0s time limit]';
          }
          resolveRun({
            stdout: stdoutBuf,
            stderr: stderrBuf,
            exitCode: code ?? (timedOut ? 124 : 0),
            timedOut,
            usedBin: binToUse,
          });
        });
      };

      attemptSpawn(spawnCmd, false);
    });

    const syncedWorkspace = await readWorkspaceFiles(projectDir);
    const durationMs = Math.max(4, Date.now() - startTime);

    res.json({
      ok: execResult.exitCode === 0,
      stdout: execResult.stdout,
      stderr: execResult.stderr,
      exitCode: execResult.exitCode,
      durationMs,
      usedPythonPath: execResult.usedBin,
      workspacePath: projectDir,
      updatedFiles: syncedWorkspace.files,
      updatedFolders: syncedWorkspace.folders,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      ok: false,
      stdout: '',
      stderr: `Workspace Execution Error: ${msg}`,
      exitCode: 1,
      durationMs: Date.now() - startTime,
    });
  }
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * Start the server if this module is the main entry point, or it is ran via PM2.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url) || process.env['pm_id']) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
