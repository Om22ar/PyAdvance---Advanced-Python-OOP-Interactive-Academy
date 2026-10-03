import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import {
  PythonRunnerService,
  LocalPythonInfo,
} from '../../services/python-runner.service';

export interface IdeProject {
  id: string;
  name: string;
  description: string;
  entryFile: string;
  folders: string[];
  files: Record<string, string>;
  updatedAt: string;
}

export interface IdeTerminalLog {
  id: string;
  timestamp: string;
  kind: 'cmd' | 'stdout' | 'stderr' | 'info' | 'repl-in' | 'repl-out';
  text: string;
  exitCode?: number;
  durationMs?: number;
}

export interface CodeSymbol {
  name: string;
  kind: 'class' | 'def';
  line: number;
}

export interface FolderNode {
  path: string;
  name: string;
  depth: number;
  files: { path: string; name: string; size: number }[];
}

const DEFAULT_PROJECTS: IdeProject[] = [
  {
    id: 'cyber-sec-suite',
    name: 'cyber-sec-suite',
    description: 'Multi-module Cybersecurity Port, Packet & Hash Auditor',
    entryFile: 'main.py',
    folders: ['scanners', 'utils', 'logs', 'tests'],
    updatedAt: 'Just now',
    files: {
      'main.py': `"""
Cybersecurity Suite - Multi-File Local Python Project
Run with Ctrl+Enter or click [Run File] in the top bar.
"""
import json
from scanners.port_scanner import PortScanner, VulnerabilityScanner
from scanners.packet_sniffer import PacketSniffer
from utils.crypto_vault import CryptoVault

class SecurityOrchestrator:
    def __init__(self, target_host: str, tools: list):
        self.target_host = target_host
        self.tools = tools  # Composition (HAS-A relationship)
        self.vault = CryptoVault()

    def execute_pipeline(self) -> dict:
        print(f"[*] Starting Security Audit on target: {self.target_host}")
        findings = []
        for tool in self.tools:
            result = tool.analyze(self.target_host)
            print(f"  [+] {tool.__class__.__name__}: {result['summary']}")
            findings.append(result)

        payload_raw = json.dumps(findings, sort_keys=True)
        signature = self.vault.sign_payload(payload_raw)
        print(f"[*] SHA-256 Audit Signature: {signature[:32]}...")

        report = {
            "target": self.target_host,
            "findings_count": len(findings),
            "signature_sha256": signature,
            "results": findings,
        }

        # Persist report to project logs/ folder on disk
        with open("logs/latest_audit.json", "w", encoding="utf-8") as f:
            json.dump(report, f, indent=2)
        print("[*] Saved full JSON report to logs/latest_audit.json")
        return report

if __name__ == "__main__":
    suite = SecurityOrchestrator(
        target_host="10.0.14.88",
        tools=[
            PortScanner([22, 80, 443, 8080]),
            VulnerabilityScanner(),
            PacketSniffer(protocol_filter="TLSv1.3"),
        ],
    )
    suite.execute_pipeline()
`,
      'scanners/__init__.py': `# Scanners package initializer\n`,
      'scanners/port_scanner.py': `from abc import ABC, abstractmethod

class BaseSecurityTool(ABC):
    @abstractmethod
    def analyze(self, target: str) -> dict:
        pass

class PortScanner(BaseSecurityTool):
    def __init__(self, ports: list[int]):
        self.ports = ports

    def analyze(self, target: str) -> dict:
        open_ports = [p for p in self.ports if p in (22, 443)]
        return {
            "tool": "PortScanner",
            "target": target,
            "open_ports": open_ports,
            "summary": f"Scanned {len(self.ports)} ports -> Open: {open_ports}",
        }

class VulnerabilityScanner(BaseSecurityTool):
    def analyze(self, target: str) -> dict:
        return {
            "tool": "VulnerabilityScanner",
            "target": target,
            "cves_checked": 142,
            "summary": "0 critical CVEs detected; TLS headers verified",
        }
`,
      'scanners/packet_sniffer.py': `from scanners.port_scanner import BaseSecurityTool

class PacketSniffer(BaseSecurityTool):
    def __init__(self, protocol_filter: str = "TCP"):
        self.protocol_filter = protocol_filter

    def analyze(self, target: str) -> dict:
        return {
            "tool": "PacketSniffer",
            "target": target,
            "protocol": self.protocol_filter,
            "summary": f"Captured 24 encrypted frames ({self.protocol_filter})",
        }
`,
      'utils/crypto_vault.py': `import hashlib
import base64

class CryptoVault:
    """Provides SHA-256 integrity hashing and Base64 token encoding."""

    def sign_payload(self, text: str) -> str:
        digest = hashlib.sha256(text.encode("utf-8")).hexdigest()
        return digest

    def encode_token(self, raw: str) -> str:
        return base64.b64encode(raw.encode("utf-8")).decode("utf-8")
`,
      'logs/security_events.json': `{\n  "service": "pyadvance-audit",\n  "status": "initialized"\n}\n`,
      'tests/test_suite.py': `import unittest
from utils.crypto_vault import CryptoVault
from scanners.port_scanner import PortScanner

class TestSecuritySuite(unittest.TestCase):
    def test_sha256_length(self):
        vault = CryptoVault()
        sig = vault.sign_payload("test-payload")
        self.assertEqual(len(sig), 64)

    def test_port_scanner(self):
        scanner = PortScanner([22, 80, 443])
        res = scanner.analyze("127.0.0.1")
        self.assertEqual(res["open_ports"], [22, 443])

if __name__ == "__main__":
    print("Running unit tests...")
    unittest.main(verbosity=2)
`,
      'README.md': `# Cybersecurity Suite Project\n\nMulti-file Python OOP project demonstrating:\n- Abstract Base Classes (\`abc.ABC\`)\n- Composition (\`SecurityOrchestrator\`)\n- File I/O & JSON serialization (\`logs/latest_audit.json\`)\n- Cryptographic hashing (\`hashlib\`, \`base64\`)\n`,
    },
  },
  {
    id: 'oop-diamond-ledger',
    name: 'oop-diamond-ledger',
    description: 'C3 MRO Diamond Inheritance & Binary Stream Seek Lab',
    entryFile: 'main.py',
    folders: ['models', 'streams', 'data'],
    updatedAt: 'Today',
    files: {
      'main.py': `"""
C3 Linearization (MRO) & Binary Stream Pointer Seek Project
"""
from models.diamond_nodes import GatewayNode
from streams.binary_reader import inspect_stream_offsets

def main():
    print("=== 1. C3 MRO Resolution Chain ===")
    mro_names = [cls.__name__ for cls in GatewayNode.mro()]
    print("Linearized MRO:", " -> ".join(mro_names))

    node = GatewayNode("edge-gw-01")
    print("\\n=== 2. Cooperative super() Dispatch ===")
    node.process_packet()

    print("\\n=== 3. Binary File Stream seek() & tell() ===")
    inspect_stream_offsets("data/packet_capture.bin")

if __name__ == "__main__":
    main()
`,
      'models/diamond_nodes.py': `class BaseNode:
    def __init__(self, hostname: str):
        self.hostname = hostname

    def process_packet(self):
        print(f"  [BaseNode] Finalizing frame on {self.hostname}")

class FirewallMixin(BaseNode):
    def process_packet(self):
        print("  [FirewallMixin] Checking ACL rules...")
        super().process_packet()

class TelemetryMixin(BaseNode):
    def process_packet(self):
        print("  [TelemetryMixin] Recording latency metrics...")
        super().process_packet()

class GatewayNode(FirewallMixin, TelemetryMixin):
    def process_packet(self):
        print(f"  [GatewayNode] Ingress packet on {self.hostname}")
        super().process_packet()
`,
      'streams/binary_reader.py': `def inspect_stream_offsets(filepath: str):
    payload = b"HDR:PYADVANCE_v2|SEQ:0042|CRC:OK\\n"
    with open(filepath, "wb") as f:
        f.write(payload)

    with open(filepath, "rb") as f:
        f.seek(4, 0)
        header_tag = f.read(12)
        print(f"  Offset 4..16 : {header_tag!r} (tell={f.tell()})")

        f.seek(-7, 2)
        trailer = f.read()
        print(f"  Last 7 bytes : {trailer!r} (tell={f.tell()})")
`,
      'data/packet_capture.bin': `HDR:PYADVANCE_v2|SEQ:0042|CRC:OK\n`,
    },
  },
];

@Component({
  selector: 'app-vscode-editor',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown)': 'onGlobalKeydown($event)',
    '(window:mousemove)': 'onWindowMouseMove($event)',
    '(window:mouseup)': 'onWindowMouseUp()',
  },
  template: `
    <div class="h-screen w-screen overflow-hidden flex flex-col bg-[#080F14] text-slate-100 select-none font-sans">
      <!-- ================= TOP FULL-FOCUS IDE BAR ================= -->
      <header class="h-12 px-3 bg-[#0B151C] border-b border-slate-800/90 flex items-center justify-between gap-2 shrink-0 z-20">
        <!-- Zone 1: Back to Academy + Project Switcher -->
        <div class="flex items-center gap-2 min-w-0">
          <button
            type="button"
            (click)="exitToAcademy()"
            title="Exit Full-Display Practice View and Return to Academy Sidebar"
            class="px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0">
            <mat-icon class="text-sm leading-none text-teal-400">arrow_back</mat-icon>
            <span>Academy</span>
          </button>

          <button
            type="button"
            (click)="toggleSidebar()"
            title="Toggle Project Explorer (Ctrl+B)"
            [class]="isExplorerOpen()
              ? 'p-1.5 rounded-lg bg-teal-500/15 text-teal-400 border border-teal-500/30 transition-colors'
              : 'p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors'">
            <mat-icon class="text-base leading-none">folder_Copy</mat-icon>
          </button>

          <div class="h-4 w-px bg-slate-800 mx-0.5 hidden sm:block"></div>

          <!-- Active Project Selector -->
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="text-[11px] font-semibold text-slate-400 hidden md:inline">Project:</span>
            <select
              aria-label="Select active Python project"
              [value]="activeProjectId()"
              (change)="onSelectProject($event)"
              class="px-2.5 py-1 rounded-lg bg-[#070D12] border border-slate-700/80 text-xs font-semibold text-teal-300 focus:outline-teal-500 max-w-[180px] truncate">
              @for (proj of projects(); track proj.id) {
                <option [value]="proj.id">{{ proj.name }}</option>
              }
            </select>

            <button
              type="button"
              (click)="openNewProjectModal()"
              title="Create a new multi-file Python project"
              class="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/70 text-xs font-medium flex items-center gap-1 transition-colors whitespace-nowrap shrink-0">
              <mat-icon class="text-xs leading-none text-teal-400">add</mat-icon>
              <span class="hidden sm:inline">New Project</span>
            </button>
          </div>
        </div>

        <!-- Zone 2: Local Python Path Configuration Bar -->
        <div class="hidden lg:flex items-center gap-1.5 bg-[#060B0E] px-2.5 py-1 rounded-xl border border-slate-800/90 max-w-xl w-full">
          <mat-icon class="text-sm leading-none text-teal-400 shrink-0">terminal</mat-icon>
          <span class="text-[11px] font-semibold text-slate-400 whitespace-nowrap">Local Python Path:</span>
          <input
            type="text"
            aria-label="Local Python binary path"
            [value]="localPythonPath()"
            (input)="onPythonPathInput($event)"
            (keydown.enter)="verifyLocalPythonPath()"
            placeholder="/usr/bin/python3 or /usr/local/bin/python3"
            class="flex-1 bg-transparent text-xs font-mono text-emerald-300 focus:outline-none px-1.5 min-w-[140px]" />

          @if (pythonPathVerifiedInfo(); as info) {
            <span
              [class]="info.ok
                ? 'text-[11px] font-mono text-emerald-400 whitespace-nowrap px-1.5'
                : 'text-[11px] font-mono text-amber-400 whitespace-nowrap px-1.5'">
              {{ info.ok ? 'v' + info.version : 'Fallback' }}
            </span>
          }

          <button
            type="button"
            (click)="verifyLocalPythonPath()"
            [disabled]="isDetectingPath()"
            title="Verify local Python executable path"
            class="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition-colors whitespace-nowrap shrink-0">
            <mat-icon class="text-xs leading-none text-teal-400">{{ isDetectingPath() ? 'sync' : 'verified' }}</mat-icon>
            <span>{{ isDetectingPath() ? 'Checking...' : 'Verify Path' }}</span>
          </button>

          <button
            type="button"
            (click)="isPathModalOpen.set(true)"
            title="Configure Local Python Path & Desktop Bridge"
            class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors">
            <mat-icon class="text-xs leading-none">tune</mat-icon>
          </button>
        </div>

        <!-- Zone 3: Terminal Middle Toggle Button & Run Action -->
        <div class="flex items-center gap-2 shrink-0">
          <!-- Mobile Python Path Button -->
          <button
            type="button"
            (click)="isPathModalOpen.set(true)"
            title="Configure Local Python Path"
            class="lg:hidden px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1">
            <mat-icon class="text-sm leading-none text-teal-400">settings_ethernet</mat-icon>
            <span class="hidden sm:inline">Python Path</span>
          </button>

          <!-- PROMINENT TERMINAL BUTTON (Toggles Middle-of-Page vs Hidden) -->
          <button
            type="button"
            (click)="toggleTerminalMiddleOrHidden()"
            title="Open Terminal to Middle of Page or Hide (Shortcut: Ctrl+&#96; or Ctrl+J)"
            [class]="isTerminalOpen()
              ? 'px-3 py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap'
              : 'px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/80 text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap'">
            <mat-icon class="text-sm leading-none">{{ isTerminalOpen() ? 'terminal' : 'wysiwyg' }}</mat-icon>
            <span>{{ isTerminalOpen() ? 'Hide Terminal' : 'Terminal (Middle)' }}</span>
            <kbd class="hidden xl:inline-block px-1 py-0.2 text-[10px] font-mono bg-slate-900/90 text-slate-300 rounded border border-slate-700">Ctrl+&#96;</kbd>
          </button>

          <!-- Run Active File Button -->
          <button
            type="button"
            (click)="runActiveFile()"
            [disabled]="isRunning()"
            title="Run active Python file using Local Python Path (Ctrl+Enter or F5)"
            class="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm active:scale-95 whitespace-nowrap">
            <mat-icon class="text-sm leading-none">{{ isRunning() ? 'hourglass_top' : 'play_arrow' }}</mat-icon>
            <span>{{ isRunning() ? 'Running...' : 'Run File' }}</span>
          </button>
        </div>
      </header>

      <!-- ================= MAIN WORKSPACE AREA ================= -->
      <div class="flex-1 flex min-h-0 overflow-hidden">
        <!-- LEFT SIDEBAR: PROJECT FILES & FOLDERS EXPLORER -->
        @if (isExplorerOpen()) {
          <aside class="w-64 sm:w-72 bg-[#0A1319] border-r border-slate-800/90 flex flex-col shrink-0 min-h-0">
            <!-- Explorer Header & File/Folder Creation Actions -->
            <div class="px-3 py-2.5 border-b border-slate-800/80 flex items-center justify-between">
              <div class="flex items-center gap-1.5 min-w-0">
                <mat-icon class="text-sm text-teal-400 leading-none">folder_special</mat-icon>
                <span class="text-xs font-bold text-slate-200 truncate">{{ activeProject().name }}</span>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  (click)="startCreatingItem('file', selectedFolderTarget())"
                  title="New File in selected folder (Alt+N)"
                  class="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-teal-400 transition-colors flex items-center">
                  <mat-icon class="text-base leading-none">note_add</mat-icon>
                </button>
                <button
                  type="button"
                  (click)="startCreatingItem('folder', selectedFolderTarget())"
                  title="New Folder in project (Alt+Shift+N)"
                  class="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-teal-400 transition-colors flex items-center">
                  <mat-icon class="text-base leading-none">create_new_folder</mat-icon>
                </button>
                <button
                  type="button"
                  (click)="downloadProjectBundle()"
                  title="Download active Python script"
                  class="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-teal-400 transition-colors flex items-center">
                  <mat-icon class="text-base leading-none">download</mat-icon>
                </button>
              </div>
            </div>

            <!-- Quick Create File / Folder Action Bar -->
            <div class="px-2.5 py-2 border-b border-slate-800/60 bg-[#081015] flex items-center gap-1.5">
              <button
                type="button"
                (click)="startCreatingItem('file', selectedFolderTarget())"
                class="flex-1 py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap">
                <mat-icon class="text-xs leading-none text-teal-400">add</mat-icon>
                <span>New File</span>
              </button>
              <button
                type="button"
                (click)="startCreatingItem('folder', selectedFolderTarget())"
                class="flex-1 py-1 px-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors whitespace-nowrap">
                <mat-icon class="text-xs leading-none text-amber-400">create_new_folder</mat-icon>
                <span>New Folder</span>
              </button>
            </div>

            <!-- Inline File/Folder Creator Form -->
            @if (creationMode(); as mode) {
              <div class="p-2.5 bg-[#0E1B24] border-b border-teal-500/40 space-y-2">
                <div class="flex items-center justify-between text-[11px]">
                  <span class="font-semibold text-teal-300">
                    New {{ mode === 'file' ? 'File' : 'Folder' }}
                    {{ creationParentFolder() ? 'in ' + creationParentFolder() + '/' : 'in Root /' }}
                  </span>
                  <button
                    type="button"
                    (click)="cancelCreateItem()"
                    class="text-slate-400 hover:text-slate-200">
                    <mat-icon class="text-xs leading-none">close</mat-icon>
                  </button>
                </div>
                <div class="flex items-center gap-1.5">
                  <input
                    type="text"
                    aria-label="New file or folder name"
                    [value]="newItemName()"
                    (input)="onNewItemNameInput($event)"
                    (keydown.enter)="confirmCreateItem()"
                    (keydown.escape)="cancelCreateItem()"
                    [placeholder]="mode === 'file' ? 'e.g. module.py or utils/helper.py' : 'e.g. controllers or services/auth'"
                    class="flex-1 px-2 py-1 rounded bg-[#060B0E] border border-teal-500/50 text-xs font-mono text-white focus:outline-none" />
                  <button
                    type="button"
                    (click)="confirmCreateItem()"
                    class="px-2.5 py-1 rounded bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs">
                    Add
                  </button>
                </div>
                @if (creationError()) {
                  <div class="text-[11px] text-rose-400">{{ creationError() }}</div>
                }
              </div>
            }

            <!-- Hierarchical Folder & File Tree -->
            <div class="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
              <!-- Root Directory Selector Row -->
              <div
                tabindex="0"
                role="button"
                (click)="selectedFolderTarget.set('')"
                (keydown.enter)="selectedFolderTarget.set('')"
                [class]="selectedFolderTarget() === ''
                  ? 'px-2 py-1 rounded-lg bg-slate-800/50 text-slate-200 flex items-center justify-between cursor-pointer'
                  : 'px-2 py-1 rounded-lg text-slate-400 hover:bg-slate-800/30 flex items-center justify-between cursor-pointer'">
                <div class="flex items-center gap-1.5 font-mono text-[11px]">
                  <mat-icon class="text-xs leading-none text-teal-400">home</mat-icon>
                  <span>/ (Project Root)</span>
                </div>
                <span class="text-[10px] text-slate-500 tabular-nums">{{ totalProjectFilesCount() }} files</span>
              </div>

              <!-- Folders and Their Files -->
              @for (folder of folderTree(); track folder.path) {
                <div class="space-y-0.5">
                  <div
                    tabindex="0"
                    role="button"
                    (click)="toggleFolderCollapse(folder.path)"
                    (keydown.enter)="toggleFolderCollapse(folder.path)"
                    [style.padding-left.px]="8 + folder.depth * 12"
                    [class]="selectedFolderTarget() === folder.path
                      ? 'group py-1.5 pr-2 rounded-lg bg-teal-500/15 text-teal-300 border border-teal-500/30 flex items-center justify-between cursor-pointer transition-colors'
                      : 'group py-1.5 pr-2 rounded-lg hover:bg-slate-800/60 text-slate-300 flex items-center justify-between cursor-pointer transition-colors'">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <mat-icon class="text-xs leading-none text-slate-400">
                        {{ isFolderCollapsed(folder.path) ? 'chevron_right' : 'expand_more' }}
                      </mat-icon>
                      <mat-icon class="text-sm leading-none text-amber-400">
                        {{ isFolderCollapsed(folder.path) ? 'folder' : 'folder_open' }}
                      </mat-icon>
                      <span class="font-medium truncate">{{ folder.name }}</span>
                    </div>

                    <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button
                        type="button"
                        (click)="startCreatingItemFromTree($event, 'file', folder.path)"
                        title="Create file inside {{ folder.path }}/"
                        class="p-0.5 rounded hover:bg-slate-700 text-slate-300 hover:text-teal-300">
                        <mat-icon class="text-xs leading-none">note_add</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="startCreatingItemFromTree($event, 'folder', folder.path)"
                        title="Create subfolder inside {{ folder.path }}/"
                        class="p-0.5 rounded hover:bg-slate-700 text-slate-300 hover:text-amber-300">
                        <mat-icon class="text-xs leading-none">create_new_folder</mat-icon>
                      </button>
                      <button
                        type="button"
                        (click)="deleteFolder($event, folder.path)"
                        title="Delete folder {{ folder.path }}/"
                        class="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400">
                        <mat-icon class="text-xs leading-none">delete</mat-icon>
                      </button>
                    </div>
                  </div>

                  <!-- Files inside this folder -->
                  @if (!isFolderCollapsed(folder.path)) {
                    @for (file of folder.files; track file.path) {
                      <div
                        tabindex="0"
                        role="button"
                        (click)="openFile(file.path)"
                        (keydown.enter)="openFile(file.path)"
                        [style.padding-left.px]="24 + folder.depth * 12"
                        [class]="activeFilePath() === file.path
                          ? 'group py-1.5 pr-2 rounded-lg bg-teal-500/20 text-white font-semibold border-l-2 border-teal-400 flex items-center justify-between cursor-pointer transition-colors'
                          : 'group py-1.5 pr-2 rounded-lg hover:bg-slate-800/50 text-slate-300 flex items-center justify-between cursor-pointer transition-colors'">
                        <div class="flex items-center gap-1.5 min-w-0">
                          <mat-icon [class]="getFileIconClass(file.name)" class="text-sm leading-none shrink-0">
                            {{ getFileIcon(file.name) }}
                          </mat-icon>
                          <span class="font-mono text-xs truncate">{{ file.name }}</span>
                        </div>
                        <div class="flex items-center gap-1 shrink-0">
                          <span class="text-[10px] text-slate-500 tabular-nums group-hover:hidden">{{ file.size }}B</span>
                          <div class="hidden group-hover:flex items-center gap-0.5">
                            @if (file.name.endsWith('.py')) {
                              <button
                                type="button"
                                (click)="runSpecificFile($event, file.path)"
                                title="Run {{ file.path }}"
                                class="p-0.5 rounded hover:bg-slate-700 text-emerald-400">
                                <mat-icon class="text-xs leading-none">play_arrow</mat-icon>
                              </button>
                            }
                            <button
                              type="button"
                              (click)="deleteFile($event, file.path)"
                              title="Delete {{ file.path }}"
                              class="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400">
                              <mat-icon class="text-xs leading-none">delete</mat-icon>
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                  }
                </div>
              }

              <!-- Root-Level Files -->
              <div class="pt-1 space-y-0.5">
                @for (file of rootFiles(); track file.path) {
                  <div
                    tabindex="0"
                    role="button"
                    (click)="openFile(file.path)"
                    (keydown.enter)="openFile(file.path)"
                    [class]="activeFilePath() === file.path
                      ? 'group px-2.5 py-1.5 rounded-lg bg-teal-500/20 text-white font-semibold border-l-2 border-teal-400 flex items-center justify-between cursor-pointer transition-colors'
                      : 'group px-2.5 py-1.5 rounded-lg hover:bg-slate-800/50 text-slate-300 flex items-center justify-between cursor-pointer transition-colors'">
                    <div class="flex items-center gap-2 min-w-0">
                      <mat-icon [class]="getFileIconClass(file.name)" class="text-sm leading-none shrink-0">
                        {{ getFileIcon(file.name) }}
                      </mat-icon>
                      <span class="font-mono text-xs truncate">{{ file.name }}</span>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <span class="text-[10px] text-slate-500 tabular-nums group-hover:hidden">{{ file.size }}B</span>
                      <div class="hidden group-hover:flex items-center gap-0.5">
                        @if (file.name.endsWith('.py')) {
                          <button
                            type="button"
                            (click)="runSpecificFile($event, file.path)"
                            title="Run {{ file.path }}"
                            class="p-0.5 rounded hover:bg-slate-700 text-emerald-400">
                            <mat-icon class="text-xs leading-none">play_arrow</mat-icon>
                          </button>
                        }
                        <button
                          type="button"
                          (click)="deleteFile($event, file.path)"
                          title="Delete {{ file.path }}"
                          class="p-0.5 rounded hover:bg-slate-700 text-slate-400 hover:text-rose-400">
                          <mat-icon class="text-xs leading-none">delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Code Outline & Standard Input (stdin) Drawer -->
            <div class="border-t border-slate-800/90 bg-[#081015] p-3 space-y-3">
              <!-- Symbols Outline -->
              <div>
                <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1.5">
                  <span>Code Outline ({{ codeSymbols().length }})</span>
                  <span class="font-mono text-[10px] text-slate-500">{{ activeFilePath() }}</span>
                </div>
                @if (codeSymbols().length > 0) {
                  <div class="max-h-24 overflow-y-auto space-y-0.5 pr-1">
                    @for (sym of codeSymbols(); track sym.line + sym.name) {
                      <button
                        type="button"
                        (click)="jumpToLine(sym.line)"
                        class="w-full text-left px-2 py-1 rounded hover:bg-slate-800/70 text-[11px] font-mono flex items-center justify-between text-slate-300">
                        <span class="truncate">
                          <span [class]="sym.kind === 'class' ? 'text-amber-400 font-bold' : 'text-teal-400'">{{ sym.kind }}</span>
                          {{ sym.name }}
                        </span>
                        <span class="text-[10px] text-slate-500 tabular-nums">Ln {{ sym.line }}</span>
                      </button>
                    }
                  </div>
                } @else {
                  <div class="text-[11px] text-slate-500 italic">No classes or functions in file</div>
                }
              </div>

              <!-- Program stdin input() box -->
              <div class="pt-2 border-t border-slate-800/70">
                <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-1">
                  <span>Program Stdin (for input())</span>
                  <span class="font-mono text-[10px] text-teal-400">UTF-8</span>
                </div>
                <textarea
                  rows="2"
                  aria-label="Program standard input for input() calls"
                  [value]="programStdin()"
                  (input)="onStdinInput($event)"
                  placeholder="Optional lines passed to Python input()..."
                  class="w-full p-2 rounded-lg bg-[#050A0E] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-teal-500 resize-none"></textarea>
              </div>
            </div>
          </aside>
        }

        <!-- CENTER COLUMN: REAL PYTHON EDITOR + MIDDLE-OF-PAGE / HIDDEN TERMINAL -->
        <div class="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <!-- Open File Tabs Bar -->
          <div class="h-10 bg-[#0A1218] border-b border-slate-800/90 flex items-center justify-between px-2 gap-2 shrink-0 overflow-x-auto">
            <div class="flex items-center gap-1 min-w-0 overflow-x-auto">
              @for (tabPath of openTabs(); track tabPath) {
                <div
                  tabindex="0"
                  role="button"
                  (click)="openFile(tabPath)"
                  (keydown.enter)="openFile(tabPath)"
                  [class]="activeFilePath() === tabPath
                    ? 'group px-3 py-1.5 rounded-t-lg bg-[#050A0E] text-teal-300 border-t-2 border-teal-400 text-xs font-mono font-semibold flex items-center gap-2 cursor-pointer whitespace-nowrap'
                    : 'group px-3 py-1.5 rounded-t-lg bg-[#0D171F]/60 hover:bg-[#0D171F] text-slate-400 hover:text-slate-200 text-xs font-mono flex items-center gap-2 cursor-pointer whitespace-nowrap'">
                  <mat-icon [class]="getFileIconClass(tabPath)" class="text-xs leading-none">
                    {{ getFileIcon(tabPath) }}
                  </mat-icon>
                  <span>{{ getFileName(tabPath) }}</span>
                  @if (openTabs().length > 1) {
                    <button
                      type="button"
                      (click)="closeTab($event, tabPath)"
                      title="Close tab"
                      class="p-0.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-200">
                      <mat-icon class="text-xs leading-none">close</mat-icon>
                    </button>
                  }
                </div>
              }
            </div>

            <!-- Editor Quick Utilities (Snippets, Font Size, Terminal Split) -->
            <div class="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                (click)="insertTemplateSnippet('class')"
                title="Insert OOP Class & super() template"
                class="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono hidden sm:inline-flex items-center gap-1">
                <span>+ class</span>
              </button>
              <button
                type="button"
                (click)="insertTemplateSnippet('file')"
                title="Insert File with open() seek/tell template"
                class="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono hidden sm:inline-flex items-center gap-1">
                <span>+ open()</span>
              </button>
              <button
                type="button"
                (click)="insertTemplateSnippet('unittest')"
                title="Insert unittest case template"
                class="px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] font-mono hidden md:inline-flex items-center gap-1">
                <span>+ test</span>
              </button>

              <div class="h-4 w-px bg-slate-800 mx-1"></div>

              <button
                type="button"
                (click)="adjustFontSize(-1)"
                title="Decrease editor font size"
                class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200">
                <mat-icon class="text-sm leading-none">remove</mat-icon>
              </button>
              <span class="text-[11px] font-mono text-slate-400 tabular-nums">{{ state.editorFontSize() }}px</span>
              <button
                type="button"
                (click)="adjustFontSize(1)"
                title="Increase editor font size"
                class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200">
                <mat-icon class="text-sm leading-none">add</mat-icon>
              </button>
            </div>
          </div>

          <!-- Breadcrumb & File Context Bar -->
          <div class="h-7 px-4 bg-[#070D12] border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
            <div class="flex items-center gap-1.5 font-mono truncate">
              <span class="text-teal-400 font-semibold">{{ activeProject().name }}</span>
              <span>/</span>
              <span class="text-slate-200">{{ activeFilePath() }}</span>
              @if (activeFilePath() === activeProject().entryFile) {
                <span class="text-emerald-400 ml-2">· Entry Script</span>
              }
            </div>
            <div class="flex items-center gap-3 font-mono text-[11px] shrink-0">
              @if (activeFilePath() !== activeProject().entryFile && activeFilePath().endsWith('.py')) {
                <button
                  type="button"
                  (click)="setAsEntryFile(activeFilePath())"
                  class="text-teal-400 hover:underline">
                  Set as Project Entry
                </button>
              }
              <span class="tabular-nums">Ln {{ cursorLine() }}, Col {{ cursorCol() }}</span>
              <span class="tabular-nums">{{ editorLines().length }} lines</span>
            </div>
          </div>

          <!-- CODE EDITOR VIEWPORT (Takes 100% height when terminal is hidden, or top 50% when terminal opens to middle of page!) -->
          <div
            [style.height.%]="isTerminalOpen() ? 100 - terminalHeightPercent() : 100"
            class="relative flex min-h-[120px] bg-[#050A0E] overflow-hidden">
            <!-- Line Number Gutter -->
            <div
              #gutterRef
              [style.font-size.px]="state.editorFontSize()"
              class="w-14 py-4 pr-3 bg-[#070D12] border-r border-slate-800/80 text-right font-mono text-slate-600 select-none overflow-hidden shrink-0 leading-[1.65]">
              @for (lineNum of editorLines(); track lineNum) {
                <div
                  [class]="errorLineNumber() === lineNum
                    ? 'text-rose-400 font-bold bg-rose-950/60 pr-1 -mr-1 rounded'
                    : cursorLine() === lineNum
                      ? 'text-teal-400 font-bold'
                      : 'text-slate-600'"
                  class="tabular-nums">
                  {{ lineNum }}
                </div>
              }
            </div>

            <!-- Interactive Code Textarea -->
            <textarea
              #editorTextarea
              aria-label="Python code editor"
              spellcheck="false"
              autocomplete="off"
              autocorrect="off"
              autocapitalize="off"
              [value]="activeFileContent()"
              (input)="onEditorInput($event)"
              (scroll)="onEditorScroll($event)"
              (click)="updateCursorMetrics()"
              (keyup)="updateCursorMetrics()"
              (keydown)="onEditorKeydown($event)"
              [style.font-size.px]="state.editorFontSize()"
              class="flex-1 h-full p-4 bg-transparent text-slate-100 font-mono leading-[1.65] focus:outline-none resize-none overflow-auto selection:bg-teal-500/30 whitespace-pre"
              placeholder="# Write your Python code here..."></textarea>
          </div>

          <!-- ================= TERMINAL DOCK (OPENS TO MIDDLE OF PAGE 50% OR HIDDEN) ================= -->
          @if (isTerminalOpen()) {
            <!-- Draggable Resizer Bar at the Middle of the Page -->
            <div
              (mousedown)="startResizingTerminal($event)"
              title="Drag to resize terminal or double-click to snap to Middle of Page (50%)"
              (dblclick)="snapTerminalToMiddle()"
              class="h-1.5 bg-slate-800 hover:bg-teal-500 cursor-row-resize transition-colors shrink-0 flex items-center justify-center">
              <div class="w-10 h-0.5 rounded bg-slate-500"></div>
            </div>

            <section
              [style.height.%]="terminalHeightPercent()"
              aria-label="Integrated Python Terminal"
              class="bg-[#04080B] border-t border-slate-800 flex flex-col min-h-[140px] shrink-0 z-10">
              <!-- Terminal Header Bar -->
              <div class="h-9 px-3 bg-[#091117] border-b border-slate-800/90 flex items-center justify-between gap-2 text-xs shrink-0">
                <!-- Left: Terminal Tabs -->
                <div class="flex items-center gap-1.5">
                  <button
                    type="button"
                    (click)="activeTerminalTab.set('console')"
                    [class]="activeTerminalTab() === 'console'
                      ? 'px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold flex items-center gap-1.5'
                      : 'px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 flex items-center gap-1.5'">
                    <mat-icon class="text-xs leading-none">terminal</mat-icon>
                    <span>Terminal Shell</span>
                  </button>

                  <button
                    type="button"
                    (click)="activeTerminalTab.set('repl')"
                    [class]="activeTerminalTab() === 'repl'
                      ? 'px-2.5 py-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/40 font-semibold flex items-center gap-1.5'
                      : 'px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 flex items-center gap-1.5'">
                    <mat-icon class="text-xs leading-none">code</mat-icon>
                    <span>Python REPL (&gt;&gt;&gt;)</span>
                  </button>

                  <button
                    type="button"
                    (click)="activeTerminalTab.set('problems')"
                    [class]="activeTerminalTab() === 'problems'
                      ? 'px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-semibold flex items-center gap-1.5'
                      : 'px-2.5 py-1 rounded text-slate-400 hover:text-slate-200 flex items-center gap-1.5'">
                    <mat-icon class="text-xs leading-none">bug_report</mat-icon>
                    <span>Diagnostics</span>
                    @if (errorLineNumber()) {
                      <span class="w-2 h-2 rounded-full bg-rose-500"></span>
                    }
                  </button>
                </div>

                <!-- Center: Active Local Python Path Indicator -->
                <div class="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <span class="text-emerald-400">{{ localPythonPath() }}</span>
                  <span>·</span>
                  <span>cwd: /{{ activeProject().name }}</span>
                  @if (lastExitCode() !== null) {
                    <span>·</span>
                    <span [class]="lastExitCode() === 0 ? 'text-emerald-400' : 'text-rose-400'">
                      Exit {{ lastExitCode() }} ({{ lastDurationMs() }}ms)
                    </span>
                  }
                </div>

                <!-- Right: Position Presets (Middle 50%, Compact, Maximize, Hide) -->
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    (click)="snapTerminalToMiddle()"
                    [class]="terminalHeightPercent() === 50 ? 'text-teal-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'"
                    title="Snap Terminal to Middle of Page (50%)"
                    class="px-2 py-0.5 rounded text-[11px] font-mono hover:bg-slate-800 transition-colors">
                    Middle 50%
                  </button>
                  <button
                    type="button"
                    (click)="setTerminalHeight(30)"
                    [class]="terminalHeightPercent() === 30 ? 'text-teal-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'"
                    title="Compact Terminal (30%)"
                    class="px-2 py-0.5 rounded text-[11px] font-mono hover:bg-slate-800 transition-colors hidden sm:inline-block">
                    30%
                  </button>
                  <button
                    type="button"
                    (click)="setTerminalHeight(75)"
                    [class]="terminalHeightPercent() === 75 ? 'text-teal-400 bg-slate-800' : 'text-slate-400 hover:text-slate-200'"
                    title="Expand Terminal (75%)"
                    class="px-2 py-0.5 rounded text-[11px] font-mono hover:bg-slate-800 transition-colors hidden sm:inline-block">
                    75%
                  </button>
                  <button
                    type="button"
                    (click)="clearTerminalLogs()"
                    title="Clear Terminal Output"
                    class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200">
                    <mat-icon class="text-sm leading-none">delete_sweep</mat-icon>
                  </button>
                  <button
                    type="button"
                    (click)="hideTerminal()"
                    title="Hide Terminal (Ctrl+&#96; or Ctrl+J)"
                    class="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-300">
                    <mat-icon class="text-sm leading-none">keyboard_arrow_down</mat-icon>
                  </button>
                </div>
              </div>

              <!-- TAB 1: INTERACTIVE SHELL & LOCAL PYTHON OUTPUT -->
              @if (activeTerminalTab() === 'console') {
                <div
                  #terminalScrollContainer
                  class="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1.5 select-text">
                  @for (entry of terminalLogs(); track entry.id) {
                    @if (entry.kind === 'info') {
                      <div class="text-slate-400 text-[11px] leading-relaxed">{{ entry.text }}</div>
                    } @else if (entry.kind === 'cmd') {
                      <div class="flex items-center gap-2 pt-1 text-slate-300 font-semibold">
                        <span class="text-emerald-400">coder&#64;local:{{ activeProject().name }}$</span>
                        <span class="text-white">{{ entry.text }}</span>
                      </div>
                    } @else if (entry.kind === 'stdout') {
                      <pre class="text-slate-100 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-teal-500/40 font-mono">{{ entry.text }}</pre>
                    } @else if (entry.kind === 'stderr') {
                      <div class="p-2.5 rounded-lg bg-rose-950/30 border border-rose-500/40 text-rose-300 whitespace-pre-wrap leading-relaxed font-mono">
                        {{ entry.text }}
                      </div>
                    }
                  }

                  @if (isRunning()) {
                    <div class="flex items-center gap-2 text-teal-400 py-1">
                      <mat-icon class="text-sm animate-spin">sync</mat-icon>
                      <span>Executing via {{ localPythonPath() }}...</span>
                    </div>
                  }
                </div>

                <!-- Shell Command Prompt Input -->
                <div class="px-3 py-2 bg-[#070D12] border-t border-slate-800/90 flex items-center gap-2 shrink-0">
                  <span class="font-mono text-xs text-emerald-400 font-semibold shrink-0">
                    coder&#64;local:{{ activeProject().name }}$
                  </span>
                  <input
                    type="text"
                    aria-label="Terminal command input"
                    [value]="shellCommandInput()"
                    (input)="onShellCommandInput($event)"
                    (keydown.enter)="executeShellCommand()"
                    placeholder="Run command (e.g. python3 main.py, python3 tests/test_suite.py, ls, cat README.md, clear)..."
                    class="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder:text-slate-600" />
                  <button
                    type="button"
                    (click)="executeShellCommand()"
                    class="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px] whitespace-nowrap">
                    Execute
                  </button>
                </div>
              }

              <!-- TAB 2: INTERACTIVE PYTHON REPL (>>>) -->
              @if (activeTerminalTab() === 'repl') {
                <div class="flex-1 p-3 font-mono text-xs overflow-y-auto space-y-1.5 select-text">
                  <div class="text-teal-400 text-[11px] pb-1 border-b border-slate-800/70">
                    Interactive Python Expression Evaluator · Using {{ localPythonPath() }}
                  </div>
                  @for (entry of replLogs(); track entry.id) {
                    @if (entry.kind === 'repl-in') {
                      <div class="text-slate-200"><span class="text-teal-400 font-bold">&gt;&gt;&gt;</span> {{ entry.text }}</div>
                    } @else {
                      <div [class]="entry.exitCode ? 'text-rose-400 pl-4 whitespace-pre-wrap' : 'text-emerald-300 pl-4 whitespace-pre-wrap'">{{ entry.text }}</div>
                    }
                  }
                </div>
                <div class="px-3 py-2 bg-[#070D12] border-t border-slate-800/90 flex items-center gap-2 shrink-0">
                  <span class="font-mono text-xs text-teal-400 font-bold">&gt;&gt;&gt;</span>
                  <input
                    type="text"
                    aria-label="Python REPL expression input"
                    [value]="replInput()"
                    (input)="onReplInput($event)"
                    (keydown.enter)="executeReplLine()"
                    placeholder="Evaluate Python expression (e.g. [x**2 for x in range(6)], import sys; print(sys.version))..."
                    class="flex-1 bg-transparent font-mono text-xs text-white focus:outline-none placeholder:text-slate-600" />
                  <button
                    type="button"
                    (click)="executeReplLine()"
                    class="px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-500 text-white font-semibold text-[11px]">
                    Eval
                  </button>
                </div>
              }

              <!-- TAB 3: DIAGNOSTICS & TRACEBACK JUMP -->
              @if (activeTerminalTab() === 'problems') {
                <div class="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
                  @if (lastStderr()) {
                    <div class="p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="font-bold text-rose-300 flex items-center gap-1.5">
                          <mat-icon class="text-sm leading-none">error_outline</mat-icon>
                          <span>Traceback Diagnostic ({{ activeFilePath() }})</span>
                        </span>
                        @if (errorLineNumber(); as ln) {
                          <button
                            type="button"
                            (click)="jumpToLine(ln)"
                            class="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/40 font-mono text-[11px]">
                            Jump to Line {{ ln }}
                          </button>
                        }
                      </div>
                      <pre class="font-mono text-xs text-rose-200 whitespace-pre-wrap">{{ lastStderr() }}</pre>
                    </div>
                  } @else {
                    <div class="py-8 text-center text-slate-400 space-y-1">
                      <mat-icon class="text-2xl text-emerald-400">verified</mat-icon>
                      <div class="font-semibold text-slate-200">Zero Diagnostics or Exceptions</div>
                      <div class="text-[11px]">Your Python workspace executed cleanly with exit code 0.</div>
                    </div>
                  }
                </div>
              }
            </section>
          }
        </div>
      </div>

      <!-- ================= BOTTOM IDE STATUS BAR ================= -->
      <footer class="h-7 px-3 bg-[#071016] border-t border-slate-800/90 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
        <div class="flex items-center gap-3 min-w-0">
          <button
            type="button"
            (click)="isPathModalOpen.set(true)"
            class="flex items-center gap-1.5 text-emerald-400 hover:underline font-mono truncate">
            <mat-icon class="text-xs leading-none">memory</mat-icon>
            <span>{{ localPythonPath() }}</span>
            @if (pythonPathVerifiedInfo(); as info) {
              <span>({{ info.version }})</span>
            }
          </button>
          <span class="hidden sm:inline">·</span>
          <span class="hidden sm:inline font-mono truncate">Project: {{ activeProject().name }} ({{ totalProjectFilesCount() }} files)</span>
        </div>

        <div class="flex items-center gap-3 shrink-0">
          <span class="hidden md:inline font-mono text-[10px] text-slate-500">
            Shortcuts: <kbd class="text-slate-300">Ctrl+Enter</kbd> Run · <kbd class="text-slate-300">Ctrl+&#96;</kbd> or <kbd class="text-slate-300">Ctrl+J</kbd> Terminal Middle/Hide · <kbd class="text-slate-300">Ctrl+B</kbd> Explorer
          </span>
          <button
            type="button"
            (click)="toggleTerminalMiddleOrHidden()"
            class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-300 font-semibold flex items-center gap-1">
            <mat-icon class="text-xs leading-none">terminal</mat-icon>
            <span>{{ isTerminalOpen() ? 'Terminal: Middle (' + terminalHeightPercent() + '%)' : 'Terminal: Hidden' }}</span>
          </button>
        </div>
      </footer>

      <!-- ================= MODAL 1: CREATE NEW PROJECT ================= -->
      @if (isNewProjectModalOpen()) {
        <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-[#0D1821] border border-slate-700 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-teal-400">create_new_folder</mat-icon>
                <h3 class="text-base font-bold text-white">Create New Python Project</h3>
              </div>
              <button type="button" (click)="isNewProjectModalOpen.set(false)" class="text-slate-400 hover:text-white">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label for="new-proj-name" class="block font-semibold text-slate-300 mb-1">Project Folder Name</label>
                <input
                  id="new-proj-name"
                  type="text"
                  [value]="newProjectName()"
                  (input)="onNewProjectNameInput($event)"
                  placeholder="e.g. network-packet-analyzer"
                  class="w-full px-3 py-2 rounded-xl bg-[#060B0E] border border-slate-700 text-white font-mono focus:outline-teal-500" />
              </div>

              <div>
                <label for="new-proj-template" class="block font-semibold text-slate-300 mb-1">Project Starter Structure</label>
                <select
                  id="new-proj-template"
                  [value]="newProjectTemplate()"
                  (change)="onNewProjectTemplateChange($event)"
                  class="w-full px-3 py-2 rounded-xl bg-[#060B0E] border border-slate-700 text-slate-200 focus:outline-teal-500">
                  <option value="oop-starter">Multi-Folder OOP Package (src/, models/, tests/, main.py)</option>
                  <option value="sec-scanner">Cybersecurity Audit Template (scanners/, logs/, main.py)</option>
                  <option value="blank">Minimal Blank Project (main.py, README.md)</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                (click)="isNewProjectModalOpen.set(false)"
                class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold">
                Cancel
              </button>
              <button
                type="button"
                (click)="createNewProject()"
                class="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold">
                Create Project
              </button>
            </div>
          </div>
        </div>
      }

      <!-- ================= MODAL 2: LOCAL PYTHON PATH & BRIDGE SETTINGS ================= -->
      @if (isPathModalOpen()) {
        <div class="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-[#0D1821] border border-slate-700 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div class="flex items-center justify-between border-b border-slate-800 pb-3">
              <div class="flex items-center gap-2">
                <mat-icon class="text-teal-400">terminal</mat-icon>
                <div>
                  <h3 class="text-base font-bold text-white">Local Python Path Configuration</h3>
                  <p class="text-[11px] text-slate-400">Execute multi-file projects with your local Python interpreter</p>
                </div>
              </div>
              <button type="button" (click)="isPathModalOpen.set(false)" class="text-slate-400 hover:text-white">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="space-y-3 text-xs">
              <div>
                <label for="modal-py-path" class="block font-semibold text-slate-300 mb-1">Local Python Binary Path</label>
                <div class="flex items-center gap-2">
                  <input
                    id="modal-py-path"
                    type="text"
                    [value]="localPythonPath()"
                    (input)="onPythonPathInput($event)"
                    placeholder="/usr/bin/python3 or ./venv/bin/python"
                    class="flex-1 px-3 py-2 rounded-xl bg-[#060B0E] border border-slate-700 text-emerald-300 font-mono focus:outline-teal-500" />
                  <button
                    type="button"
                    (click)="verifyLocalPythonPath()"
                    class="px-3 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold whitespace-nowrap">
                    Verify &amp; Save
                  </button>
                </div>
              </div>

              <!-- Detected / Quick Path Presets -->
              <div class="space-y-1.5">
                <div class="text-[11px] font-semibold text-slate-400">Detected &amp; Standard Local Paths (Click to select):</div>
                <div class="flex flex-wrap gap-1.5">
                  @for (preset of commonPythonPaths; track preset) {
                    <button
                      type="button"
                      (click)="selectPythonPathPreset(preset)"
                      [class]="localPythonPath() === preset
                        ? 'px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-500/40 font-mono text-[11px]'
                        : 'px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-[11px]'">
                      {{ preset }}
                    </button>
                  }
                </div>
              </div>

              @if (pythonPathVerifiedInfo(); as info) {
                <div class="p-3 rounded-xl bg-[#071016] border border-slate-800 space-y-1 font-mono text-[11px]">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Status:</span>
                    <span [class]="info.ok ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'">
                      {{ info.ok ? 'Verified Local Interpreter' : 'Using Fallback Sandbox' }}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Executable:</span>
                    <span class="text-slate-200">{{ info.executable || localPythonPath() }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Python Version:</span>
                    <span class="text-teal-300">{{ info.version }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-slate-400">Platform:</span>
                    <span class="text-slate-300 truncate max-w-[260px]">{{ info.platform }}</span>
                  </div>
                </div>
              }

              <!-- Optional Localhost Bridge for Remote Cloud Viewers -->
              <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div class="font-semibold text-slate-200 flex items-center justify-between">
                  <span>Optional: Desktop Localhost Bridge (127.0.0.1:8765)</span>
                  <button
                    type="button"
                    (click)="downloadLocalBridgeScript()"
                    class="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 text-[11px] font-semibold flex items-center gap-1">
                    <mat-icon class="text-xs leading-none">download</mat-icon>
                    <span>Download Bridge.py</span>
                  </button>
                </div>
                <p class="text-[11px] text-slate-400 leading-relaxed">
                  Running on a remote cloud URL and want to execute against a custom virtualenv on your own laptop? Run <code class="text-teal-300">python pyadvance_local_bridge.py</code> locally and set Bridge URL below:
                </p>
                <input
                  type="text"
                  aria-label="Optional localhost bridge URL"
                  [value]="customBridgeUrl()"
                  (input)="onBridgeUrlInput($event)"
                  placeholder="Leave empty for direct host execution, or http://127.0.0.1:8765"
                  class="w-full px-2.5 py-1.5 rounded-lg bg-[#060B0E] border border-slate-700 text-slate-200 font-mono text-[11px]" />
              </div>
            </div>

            <div class="flex justify-end pt-2 border-t border-slate-800">
              <button
                type="button"
                (click)="isPathModalOpen.set(false)"
                class="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs">
                Done
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class VscodeEditorComponent implements OnInit {
  readonly state = inject(LearningStateService);
  readonly runner = inject(PythonRunnerService);

  @ViewChild('editorTextarea') editorTextarea?: ElementRef<HTMLTextAreaElement>;
  @ViewChild('gutterRef') gutterRef?: ElementRef<HTMLDivElement>;
  @ViewChild('terminalScrollContainer') terminalScrollContainer?: ElementRef<HTMLDivElement>;

  // Projects & File/Folder state
  readonly projects = signal<IdeProject[]>(DEFAULT_PROJECTS);
  readonly activeProjectId = signal<string>(DEFAULT_PROJECTS[0].id);
  readonly activeFilePath = signal<string>('main.py');
  readonly openTabs = signal<string[]>(['main.py', 'scanners/port_scanner.py', 'utils/crypto_vault.py']);
  readonly collapsedFolders = signal<string[]>([]);
  readonly selectedFolderTarget = signal<string>('');

  // File/Folder creation UI state
  readonly creationMode = signal<'file' | 'folder' | null>(null);
  readonly creationParentFolder = signal<string>('');
  readonly newItemName = signal<string>('');
  readonly creationError = signal<string>('');

  // New Project Modal state
  readonly isNewProjectModalOpen = signal<boolean>(false);
  readonly newProjectName = signal<string>('');
  readonly newProjectTemplate = signal<'oop-starter' | 'sec-scanner' | 'blank'>('oop-starter');

  // Layout & Terminal state (Middle of page = 50% height, or Hidden)
  readonly isExplorerOpen = signal<boolean>(true);
  readonly isTerminalOpen = signal<boolean>(true);
  readonly terminalHeightPercent = signal<number>(50);
  readonly activeTerminalTab = signal<'console' | 'repl' | 'problems'>('console');
  private isResizingTerminal = false;

  // Local Python Path state
  readonly localPythonPath = this.state.localPythonPath;
  readonly customBridgeUrl = signal<string>('');
  readonly isDetectingPath = signal<boolean>(false);
  readonly pythonPathVerifiedInfo = signal<LocalPythonInfo | null>(null);
  readonly isPathModalOpen = signal<boolean>(false);
  readonly commonPythonPaths = [
    '/usr/bin/python3',
    '/usr/local/bin/python3',
    'python3',
    './venv/bin/python',
    '~/.pyenv/shims/python',
    'C:\\Python312\\python.exe',
  ];

  // Execution & Terminal Logs state
  readonly isRunning = signal<boolean>(false);
  readonly programStdin = signal<string>('');
  readonly shellCommandInput = signal<string>('');
  readonly replInput = signal<string>('');
  readonly lastExitCode = signal<number | null>(null);
  readonly lastDurationMs = signal<number>(0);
  readonly lastStderr = signal<string>('');
  readonly errorLineNumber = signal<number | null>(null);

  readonly terminalLogs = signal<IdeTerminalLog[]>([
    {
      id: 'init-1',
      timestamp: '00:00',
      kind: 'info',
      text: 'Real Python Coder IDE initialized. Terminal is docked to the middle of the page (50%). Press [Ctrl+`] or click [Hide Terminal] anytime to toggle full-screen editor focus.',
    },
  ]);

  readonly replLogs = signal<IdeTerminalLog[]>([]);

  // Editor cursor metrics
  readonly cursorLine = signal<number>(1);
  readonly cursorCol = signal<number>(1);

  readonly activeProject = computed<IdeProject>(() => {
    const id = this.activeProjectId();
    return this.projects().find((p) => p.id === id) || this.projects()[0];
  });

  readonly activeFileContent = computed<string>(() => {
    const proj = this.activeProject();
    const path = this.activeFilePath();
    return proj.files[path] ?? '';
  });

  readonly totalProjectFilesCount = computed<number>(() => {
    return Object.keys(this.activeProject().files).length;
  });

  readonly editorLines = computed<number[]>(() => {
    const content = this.activeFileContent();
    const count = Math.max(1, content.split('\n').length);
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  readonly folderTree = computed<FolderNode[]>(() => {
    const proj = this.activeProject();
    const folderSet = new Set<string>(proj.folders);

    // Ensure any implicit folder from file paths is included
    for (const filePath of Object.keys(proj.files)) {
      const parts = filePath.split('/');
      if (parts.length > 1) {
        let acc = '';
        for (let i = 0; i < parts.length - 1; i++) {
          acc = acc ? `${acc}/${parts[i]}` : parts[i];
          folderSet.add(acc);
        }
      }
    }

    const sortedFolders = Array.from(folderSet).sort((a, b) => a.localeCompare(b));
    return sortedFolders.map((folderPath) => {
      const segments = folderPath.split('/');
      const name = segments[segments.length - 1];
      const depth = segments.length - 1;

      const directFiles = Object.entries(proj.files)
        .filter(([fPath]) => {
          const lastSlash = fPath.lastIndexOf('/');
          if (lastSlash === -1) return false;
          return fPath.slice(0, lastSlash) === folderPath;
        })
        .map(([fPath, content]) => ({
          path: fPath,
          name: fPath.slice(fPath.lastIndexOf('/') + 1),
          size: new TextEncoder().encode(content).length,
        }))
        .sort((a, b) => a.name.localeCompare(b.name));

      return {
        path: folderPath,
        name,
        depth,
        files: directFiles,
      };
    });
  });

  readonly rootFiles = computed<{ path: string; name: string; size: number }[]>(() => {
    const proj = this.activeProject();
    return Object.entries(proj.files)
      .filter(([fPath]) => !fPath.includes('/'))
      .map(([fPath, content]) => ({
        path: fPath,
        name: fPath,
        size: new TextEncoder().encode(content).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  });

  readonly codeSymbols = computed<CodeSymbol[]>(() => {
    const content = this.activeFileContent();
    const lines = content.split('\n');
    const symbols: CodeSymbol[] = [];

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed.startsWith('class ')) {
        const rest = trimmed.slice(6).split(/[:(]/)[0].trim();
        if (rest) symbols.push({ name: rest, kind: 'class', line: i + 1 });
      } else if (trimmed.startsWith('def ')) {
        const rest = trimmed.slice(4).split('(')[0].trim();
        if (rest) symbols.push({ name: rest + '()', kind: 'def', line: i + 1 });
      }
    }
    return symbols;
  });

  ngOnInit() {
    this.loadWorkspaceFromStorage();
    this.verifyLocalPythonPath();
  }

  exitToAcademy() {
    this.state.setView('overview');
  }

  toggleSidebar() {
    this.isExplorerOpen.update((v) => !v);
  }

  /**
   * Toggles the terminal between Open at the Middle of the Page (50% height) and Hidden
   */
  toggleTerminalMiddleOrHidden() {
    if (this.isTerminalOpen()) {
      this.isTerminalOpen.set(false);
    } else {
      this.terminalHeightPercent.set(50);
      this.isTerminalOpen.set(true);
    }
  }

  snapTerminalToMiddle() {
    this.terminalHeightPercent.set(50);
    this.isTerminalOpen.set(true);
  }

  setTerminalHeight(percent: number) {
    this.terminalHeightPercent.set(Math.max(20, Math.min(80, percent)));
    this.isTerminalOpen.set(true);
  }

  hideTerminal() {
    this.isTerminalOpen.set(false);
  }

  onGlobalKeydown(event: KeyboardEvent) {
    // Ctrl+` (Backtick) or Ctrl+J or Alt+T -> Toggle Terminal (Middle of Page / Hidden)
    if (
      ((event.ctrlKey || event.metaKey) && (event.key === '`' || event.key === '~' || event.key.toLowerCase() === 'j')) ||
      (event.altKey && event.key.toLowerCase() === 't')
    ) {
      event.preventDefault();
      this.toggleTerminalMiddleOrHidden();
      return;
    }

    // Ctrl+Enter or F5 -> Run Active Python File
    if (((event.ctrlKey || event.metaKey) && event.key === 'Enter') || event.key === 'F5') {
      event.preventDefault();
      this.runActiveFile();
      return;
    }

    // Ctrl+B -> Toggle Project Explorer Sidebar
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      this.toggleSidebar();
      return;
    }

    // Ctrl+S -> Save workspace to localStorage
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      this.saveWorkspaceToStorage();
      this.appendTerminalLog('info', `[Saved] Workspace "${this.activeProject().name}" synced.`);
      return;
    }

    // Alt+N -> New File
    if (event.altKey && !event.shiftKey && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      this.isExplorerOpen.set(true);
      this.startCreatingItem('file', this.selectedFolderTarget());
      return;
    }

    // Alt+Shift+N -> New Folder
    if (event.altKey && event.shiftKey && event.key.toLowerCase() === 'n') {
      event.preventDefault();
      this.isExplorerOpen.set(true);
      this.startCreatingItem('folder', this.selectedFolderTarget());
    }
  }

  startResizingTerminal(event: MouseEvent) {
    event.preventDefault();
    this.isResizingTerminal = true;
  }

  onWindowMouseMove(event: MouseEvent) {
    if (!this.isResizingTerminal || typeof window === 'undefined') return;
    const viewportHeight = window.innerHeight - 76; // header + statusbar
    const distanceFromBottom = window.innerHeight - event.clientY - 28;
    const rawPercent = Math.round((distanceFromBottom / Math.max(300, viewportHeight)) * 100);
    if (rawPercent < 12) {
      this.isTerminalOpen.set(false);
      this.isResizingTerminal = false;
      return;
    }
    this.terminalHeightPercent.set(Math.max(20, Math.min(82, rawPercent)));
  }

  onWindowMouseUp() {
    this.isResizingTerminal = false;
  }

  onPythonPathInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.localPythonPath.set(val);
    this.saveWorkspaceToStorage();
  }

  onBridgeUrlInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.customBridgeUrl.set(val);
  }

  selectPythonPathPreset(preset: string) {
    this.localPythonPath.set(preset);
    this.verifyLocalPythonPath();
  }

  async verifyLocalPythonPath() {
    this.isDetectingPath.set(true);
    try {
      const info = await this.runner.detectLocalPython(
        this.localPythonPath(),
        this.customBridgeUrl(),
      );
      this.pythonPathVerifiedInfo.set(info);
      if (info.ok && info.activePath && !this.localPythonPath().trim()) {
        this.localPythonPath.set(info.activePath);
      }
    } finally {
      this.isDetectingPath.set(false);
    }
  }

  // ================= PROJECT, FOLDER & FILE MANAGEMENT =================

  onSelectProject(event: Event) {
    const id = (event.target as HTMLSelectElement).value;
    this.switchProject(id);
  }

  switchProject(projectId: string) {
    const target = this.projects().find((p) => p.id === projectId);
    if (!target) return;
    this.activeProjectId.set(target.id);
    const fileKeys = Object.keys(target.files);
    const firstFile = target.files[target.entryFile] !== undefined ? target.entryFile : fileKeys[0] || 'main.py';
    this.activeFilePath.set(firstFile);
    this.openTabs.set(fileKeys.slice(0, 3));
    this.selectedFolderTarget.set('');
    this.errorLineNumber.set(null);
  }

  openNewProjectModal() {
    this.newProjectName.set('');
    this.isNewProjectModalOpen.set(true);
  }

  onNewProjectNameInput(event: Event) {
    this.newProjectName.set((event.target as HTMLInputElement).value);
  }

  onNewProjectTemplateChange(event: Event) {
    const val = (event.target as HTMLSelectElement).value as 'oop-starter' | 'sec-scanner' | 'blank';
    this.newProjectTemplate.set(val);
  }

  createNewProject() {
    const rawName = this.newProjectName().trim() || `python-project-${this.projects().length + 1}`;
    const cleanId = rawName.toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const tpl = this.newProjectTemplate();

    let folders: string[] = ['src', 'models', 'tests'];
    let files: Record<string, string> = {
      'main.py': `"""\nProject: ${rawName}\nExecuted with Local Python Path: ${this.localPythonPath()}\n"""\nfrom models.entity import BaseEntity\n\ndef main():\n    item = BaseEntity("${rawName}")\n    print(item.describe())\n\nif __name__ == "__main__":\n    main()\n`,
      'models/__init__.py': '',
      'models/entity.py': `class BaseEntity:\n    def __init__(self, title: str):\n        self.title = title\n\n    def describe(self) -> str:\n        return f"[BaseEntity] Active project workspace: {self.title}"\n`,
      'tests/test_main.py': `import unittest\nfrom models.entity import BaseEntity\n\nclass TestEntity(unittest.TestCase):\n    def test_describe(self):\n        e = BaseEntity("Demo")\n        self.assertIn("Demo", e.describe())\n\nif __name__ == "__main__":\n    unittest.main()\n`,
      'README.md': `# ${rawName}\n\nCreated in PyAdvance Real Python Coder Studio.\n`,
    };

    if (tpl === 'sec-scanner') {
      folders = ['scanners', 'logs'];
      files = {
        'main.py': `import hashlib\nfrom scanners.auditor import PortAuditor\n\nauditor = PortAuditor("192.168.1.10")\nreport = auditor.scan([22, 80, 443])\nprint("Audit Report:", report)\nprint("Digest:", hashlib.sha256(str(report).encode()).hexdigest()[:24])\n`,
        'scanners/auditor.py': `class PortAuditor:\n    def __init__(self, host: str):\n        self.host = host\n\n    def scan(self, ports: list[int]) -> dict:\n        return {"host": self.host, "checked": ports, "status": "nominal"}\n`,
        'logs/audit.log': 'Audit log initialized.\n',
      };
    } else if (tpl === 'blank') {
      folders = [];
      files = {
        'main.py': `# ${rawName} - Main Script\nimport sys\n\nprint("Running on Python:", sys.version.split()[0])\nprint("Executable path:", sys.executable)\n`,
        'README.md': `# ${rawName}\n`,
      };
    }

    const newProj: IdeProject = {
      id: cleanId + '-' + Date.now().toString().slice(-4),
      name: rawName,
      description: 'Custom multi-file Python project',
      entryFile: 'main.py',
      folders,
      files,
      updatedAt: 'Just now',
    };

    this.projects.update((list) => [newProj, ...list]);
    this.isNewProjectModalOpen.set(false);
    this.switchProject(newProj.id);
    this.saveWorkspaceToStorage();
  }

  startCreatingItem(mode: 'file' | 'folder', parentFolder = '') {
    this.creationMode.set(mode);
    this.creationParentFolder.set(parentFolder);
    this.newItemName.set('');
    this.creationError.set('');
  }

  startCreatingItemFromTree(event: MouseEvent, mode: 'file' | 'folder', folderPath: string) {
    event.stopPropagation();
    this.selectedFolderTarget.set(folderPath);
    // Make sure folder is expanded
    this.collapsedFolders.update((list) => list.filter((p) => p !== folderPath));
    this.startCreatingItem(mode, folderPath);
  }

  cancelCreateItem() {
    this.creationMode.set(null);
    this.newItemName.set('');
    this.creationError.set('');
  }

  onNewItemNameInput(event: Event) {
    this.newItemName.set((event.target as HTMLInputElement).value);
    this.creationError.set('');
  }

  confirmCreateItem() {
    const mode = this.creationMode();
    if (!mode) return;

    const rawInput = this.newItemName().trim().replace(/^\/+|\/+$/g, '');
    if (!rawInput) {
      this.creationError.set('Please enter a valid name.');
      return;
    }

    const parent = this.creationParentFolder();
    const fullPath = parent ? `${parent}/${rawInput}` : rawInput;

    if (mode === 'folder') {
      this.projects.update((projs) =>
        projs.map((p) => {
          if (p.id !== this.activeProjectId()) return p;
          if (p.folders.includes(fullPath)) return p;
          return {
            ...p,
            folders: [...p.folders, fullPath],
          };
        }),
      );
      this.selectedFolderTarget.set(fullPath);
      this.cancelCreateItem();
      this.saveWorkspaceToStorage();
      return;
    }

    // Creating a file
    const finalFilePath = fullPath.includes('.') ? fullPath : `${fullPath}.py`;
    const proj = this.activeProject();
    if (proj.files[finalFilePath] !== undefined) {
      this.creationError.set(`File "${finalFilePath}" already exists.`);
      return;
    }

    const defaultContent = finalFilePath.endsWith('.py')
      ? `"""\nModule: ${finalFilePath}\n"""\n\ndef run():\n    print("Executing ${finalFilePath}")\n\nif __name__ == "__main__":\n    run()\n`
      : finalFilePath.endsWith('.json')
        ? `{\n  "module": "${finalFilePath}"\n}\n`
        : `# ${finalFilePath}\n`;

    // Extract any intermediate folders
    const parts = finalFilePath.split('/');
    const newFoldersToEnsure: string[] = [];
    if (parts.length > 1) {
      let acc = '';
      for (let i = 0; i < parts.length - 1; i++) {
        acc = acc ? `${acc}/${parts[i]}` : parts[i];
        newFoldersToEnsure.push(acc);
      }
    }

    this.projects.update((projs) =>
      projs.map((p) => {
        if (p.id !== this.activeProjectId()) return p;
        const mergedFolders = Array.from(new Set([...p.folders, ...newFoldersToEnsure]));
        return {
          ...p,
          folders: mergedFolders,
          files: {
            ...p.files,
            [finalFilePath]: defaultContent,
          },
        };
      }),
    );

    this.openFile(finalFilePath);
    this.cancelCreateItem();
    this.saveWorkspaceToStorage();
  }

  toggleFolderCollapse(folderPath: string) {
    this.selectedFolderTarget.set(folderPath);
    this.collapsedFolders.update((list) =>
      list.includes(folderPath) ? list.filter((p) => p !== folderPath) : [...list, folderPath],
    );
  }

  isFolderCollapsed(folderPath: string): boolean {
    return this.collapsedFolders().includes(folderPath);
  }

  openFile(filePath: string) {
    this.activeFilePath.set(filePath);
    const lastSlash = filePath.lastIndexOf('/');
    this.selectedFolderTarget.set(lastSlash > -1 ? filePath.slice(0, lastSlash) : '');
    if (!this.openTabs().includes(filePath)) {
      this.openTabs.update((tabs) => [...tabs, filePath]);
    }
    this.errorLineNumber.set(null);
  }

  closeTab(event: MouseEvent, filePath: string) {
    event.stopPropagation();
    const updated = this.openTabs().filter((t) => t !== filePath);
    this.openTabs.set(updated);
    if (this.activeFilePath() === filePath && updated.length > 0) {
      this.activeFilePath.set(updated[updated.length - 1]);
    }
  }

  deleteFile(event: MouseEvent, filePath: string) {
    event.stopPropagation();
    const proj = this.activeProject();
    if (Object.keys(proj.files).length <= 1) return;

    this.projects.update((projs) =>
      projs.map((p) => {
        if (p.id !== this.activeProjectId()) return p;
        const nextFiles = { ...p.files };
        delete nextFiles[filePath];
        return { ...p, files: nextFiles };
      }),
    );

    const nextTabs = this.openTabs().filter((t) => t !== filePath);
    const remainingFiles = Object.keys(this.activeProject().files);
    this.openTabs.set(nextTabs.length > 0 ? nextTabs : [remainingFiles[0]]);
    if (this.activeFilePath() === filePath) {
      this.activeFilePath.set(this.openTabs()[0]);
    }
    this.saveWorkspaceToStorage();
  }

  deleteFolder(event: MouseEvent, folderPath: string) {
    event.stopPropagation();
    this.projects.update((projs) =>
      projs.map((p) => {
        if (p.id !== this.activeProjectId()) return p;
        const nextFolders = p.folders.filter(
          (f) => f !== folderPath && !f.startsWith(folderPath + '/'),
        );
        const nextFiles: Record<string, string> = {};
        for (const [k, v] of Object.entries(p.files)) {
          if (!k.startsWith(folderPath + '/')) {
            nextFiles[k] = v;
          }
        }
        if (Object.keys(nextFiles).length === 0) {
          nextFiles['main.py'] = '# Main entry script\nprint("Ready")\n';
        }
        return {
          ...p,
          folders: nextFolders,
          files: nextFiles,
        };
      }),
    );
    const validFiles = Object.keys(this.activeProject().files);
    if (!validFiles.includes(this.activeFilePath())) {
      this.activeFilePath.set(validFiles[0]);
    }
    this.openTabs.update((tabs) => {
      const filtered = tabs.filter((t) => validFiles.includes(t));
      return filtered.length > 0 ? filtered : [validFiles[0]];
    });
    if (this.selectedFolderTarget() === folderPath) {
      this.selectedFolderTarget.set('');
    }
    this.saveWorkspaceToStorage();
  }

  setAsEntryFile(filePath: string) {
    this.projects.update((projs) =>
      projs.map((p) => (p.id === this.activeProjectId() ? { ...p, entryFile: filePath } : p)),
    );
    this.saveWorkspaceToStorage();
  }

  // ================= REAL CODE EDITOR HANDLERS =================

  onEditorInput(event: Event) {
    const val = (event.target as HTMLTextAreaElement).value;
    this.updateActiveFileContent(val);
    this.updateCursorMetrics();
  }

  updateActiveFileContent(newContent: string) {
    const targetPath = this.activeFilePath();
    this.projects.update((projs) =>
      projs.map((p) => {
        if (p.id !== this.activeProjectId()) return p;
        return {
          ...p,
          files: {
            ...p.files,
            [targetPath]: newContent,
          },
        };
      }),
    );
    this.saveWorkspaceToStorage();
  }

  onEditorScroll(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    if (this.gutterRef?.nativeElement) {
      this.gutterRef.nativeElement.scrollTop = textarea.scrollTop;
    }
  }

  updateCursorMetrics() {
    const el = this.editorTextarea?.nativeElement;
    if (!el) return;
    const pos = el.selectionStart || 0;
    const upToCursor = el.value.slice(0, pos);
    const lines = upToCursor.split('\n');
    this.cursorLine.set(lines.length);
    this.cursorCol.set(lines[lines.length - 1].length + 1);
  }

  onEditorKeydown(event: KeyboardEvent) {
    const el = this.editorTextarea?.nativeElement;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const val = el.value;

    // Tab indentation (4 spaces)
    if (event.key === 'Tab') {
      event.preventDefault();
      const spaces = ' '.repeat(this.state.tabSize() || 4);
      const nextVal = val.substring(0, start) + spaces + val.substring(end);
      this.updateActiveFileContent(nextVal);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + spaces.length;
        this.updateCursorMetrics();
      });
      return;
    }

    // Smart auto-indent on Enter (especially after ':')
    if (event.key === 'Enter' && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      event.preventDefault();
      const before = val.substring(0, start);
      const currentLine = before.split('\n').pop() || '';
      const leadingSpacesMatch = currentLine.match(/^\s*/);
      let indent = leadingSpacesMatch ? leadingSpacesMatch[0] : '';
      if (currentLine.trim().endsWith(':')) {
        indent += ' '.repeat(this.state.tabSize() || 4);
      }
      const insertStr = '\n' + indent;
      const nextVal = val.substring(0, start) + insertStr + val.substring(end);
      this.updateActiveFileContent(nextVal);
      setTimeout(() => {
        el.selectionStart = el.selectionEnd = start + insertStr.length;
        this.updateCursorMetrics();
      });
    }
  }

  jumpToLine(lineNumber: number) {
    const el = this.editorTextarea?.nativeElement;
    if (!el) return;
    const lines = el.value.split('\n');
    let charIndex = 0;
    for (let i = 0; i < Math.min(lineNumber - 1, lines.length); i++) {
      charIndex += lines[i].length + 1;
    }
    el.focus();
    el.setSelectionRange(charIndex, charIndex + (lines[lineNumber - 1]?.length || 0));
    const lineHeight = (this.state.editorFontSize() || 13) * 1.65;
    el.scrollTop = Math.max(0, (lineNumber - 4) * lineHeight);
    this.updateCursorMetrics();
  }

  insertTemplateSnippet(kind: 'class' | 'file' | 'unittest') {
    const snippets: Record<'class' | 'file' | 'unittest', string> = {
      class: `\nclass SecurityNode:\n    def __init__(self, host: str):\n        self.host = host\n\n    def inspect(self) -> str:\n        return f"Inspecting {self.host}"\n`,
      file: `\nwith open("logs/sample.log", "w+", encoding="utf-8") as stream:\n    stream.write("Audit entry OK\\n")\n    stream.seek(0)\n    print("Stream read:", stream.read().strip())\n`,
      unittest: `\nimport unittest\n\nclass SmokeTest(unittest.TestCase):\n    def test_truth(self):\n        self.assertTrue(True)\n`,
    };
    const nextContent = this.activeFileContent() + snippets[kind];
    this.updateActiveFileContent(nextContent);
  }

  adjustFontSize(delta: number) {
    const next = Math.max(11, Math.min(20, this.state.editorFontSize() + delta));
    this.state.editorFontSize.set(next);
  }

  // ================= EXECUTION & TERMINAL COMMANDS =================

  onStdinInput(event: Event) {
    this.programStdin.set((event.target as HTMLTextAreaElement).value);
  }

  onShellCommandInput(event: Event) {
    this.shellCommandInput.set((event.target as HTMLInputElement).value);
  }

  onReplInput(event: Event) {
    this.replInput.set((event.target as HTMLInputElement).value);
  }

  runSpecificFile(event: MouseEvent, filePath: string) {
    event.stopPropagation();
    this.openFile(filePath);
    this.runFileByPath(filePath);
  }

  runActiveFile() {
    const current = this.activeFilePath();
    const targetToRun = current.endsWith('.py') ? current : this.activeProject().entryFile;
    this.runFileByPath(targetToRun);
  }

  async runFileByPath(entryFile: string, customTerminalCommand = '') {
    if (this.isRunning()) return;

    // Ensure terminal opens to the middle of the page if hidden when running
    if (!this.isTerminalOpen()) {
      this.terminalHeightPercent.set(50);
      this.isTerminalOpen.set(true);
    }
    this.activeTerminalTab.set('console');
    this.isRunning.set(true);
    this.errorLineNumber.set(null);

    const proj = this.activeProject();
    const pyBin = this.localPythonPath().trim() || '/usr/bin/python3';
    const displayCmd = customTerminalCommand || `${pyBin} -u ${entryFile}`;

    this.appendTerminalLog('cmd', displayCmd);

    try {
      const res = await this.runner.runProjectWorkspace({
        projectId: proj.id,
        pythonPath: pyBin,
        entryFile,
        files: proj.files,
        folders: proj.folders,
        stdin: this.programStdin(),
        terminalCommand: customTerminalCommand,
        bridgeUrl: this.customBridgeUrl(),
      });

      this.lastExitCode.set(res.exitCode ?? (res.success ? 0 : 1));
      this.lastDurationMs.set(res.durationMs);
      this.lastStderr.set(res.stderr || '');

      if (res.stdout) {
        this.appendTerminalLog('stdout', res.stdout, res.exitCode, res.durationMs);
      }
      if (res.stderr) {
        this.appendTerminalLog('stderr', res.stderr, res.exitCode, res.durationMs);
        const lineMatch = res.stderr.match(/line (\d+)/i);
        if (lineMatch) {
          this.errorLineNumber.set(parseInt(lineMatch[1], 10));
        }
      }
      if (!res.stdout && !res.stderr) {
        this.appendTerminalLog('info', `(Process exited with code 0 in ${res.durationMs}ms)`);
      }

      // If the Python script created or modified files on disk (e.g. logs/latest_audit.json), sync them into the IDE tree!
      if (res.updatedFiles && Object.keys(res.updatedFiles).length > 0) {
        this.projects.update((projs) =>
          projs.map((p) => {
            if (p.id !== proj.id) return p;
            return {
              ...p,
              folders: Array.from(new Set([...p.folders, ...(res.updatedFolders || [])])),
              files: {
                ...p.files,
                ...res.updatedFiles,
              },
            };
          }),
        );
        this.saveWorkspaceToStorage();
      }
    } finally {
      this.isRunning.set(false);
      this.scrollToTerminalBottom();
    }
  }

  async executeShellCommand() {
    const raw = this.shellCommandInput().trim();
    if (!raw) return;
    this.shellCommandInput.set('');

    if (raw === 'clear' || raw === 'cls') {
      this.clearTerminalLogs();
      return;
    }

    if (raw === 'help') {
      this.appendTerminalLog('cmd', 'help');
      this.appendTerminalLog(
        'info',
        'Available commands: python3 <file.py>, python3 -m unittest, ls, cat <file>, pwd, mkdir <dir>, touch <file>, clear',
      );
      return;
    }

    await this.runFileByPath(this.activeProject().entryFile, raw);
  }

  async executeReplLine() {
    const expr = this.replInput().trim();
    if (!expr) return;
    this.replInput.set('');

    this.replLogs.update((logs) => [
      ...logs,
      { id: 'r-' + Date.now(), timestamp: 'now', kind: 'repl-in', text: expr },
    ]);

    const proj = this.activeProject();
    const res = await this.runner.runProjectWorkspace({
      projectId: proj.id,
      pythonPath: this.localPythonPath(),
      entryFile: proj.entryFile,
      files: proj.files,
      folders: proj.folders,
      terminalCommand: `import sys; _res = (${expr}); print(_res if _res is not None else "")`,
      bridgeUrl: this.customBridgeUrl(),
    });

    const outText = (res.stdout || res.stderr || 'None').trim();
    this.replLogs.update((logs) => [
      ...logs,
      {
        id: 'ro-' + Date.now(),
        timestamp: 'now',
        kind: 'repl-out',
        text: outText,
        exitCode: res.stderr ? 1 : 0,
      },
    ]);
  }

  clearTerminalLogs() {
    this.terminalLogs.set([]);
    this.lastStderr.set('');
    this.lastExitCode.set(null);
  }

  private appendTerminalLog(
    kind: IdeTerminalLog['kind'],
    text: string,
    exitCode?: number,
    durationMs?: number,
  ) {
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    this.terminalLogs.update((logs) => [
      ...logs,
      {
        id: 'log-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
        timestamp: ts,
        kind,
        text,
        exitCode,
        durationMs,
      },
    ]);
    this.scrollToTerminalBottom();
  }

  private scrollToTerminalBottom() {
    setTimeout(() => {
      const el = this.terminalScrollContainer?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    }, 30);
  }

  // ================= HELPERS & STORAGE =================

  getFileName(path: string): string {
    const idx = path.lastIndexOf('/');
    return idx === -1 ? path : path.slice(idx + 1);
  }

  getFileIcon(name: string): string {
    if (name.endsWith('.py')) return 'code';
    if (name.endsWith('.json')) return 'data_object';
    if (name.endsWith('.md')) return 'description';
    if (name.endsWith('.bin') || name.endsWith('.log')) return 'memory';
    return 'insert_drive_file';
  }

  getFileIconClass(name: string): string {
    if (name.endsWith('.py')) return 'text-teal-400';
    if (name.endsWith('.json')) return 'text-amber-400';
    if (name.endsWith('.md')) return 'text-sky-400';
    return 'text-slate-400';
  }

  downloadProjectBundle() {
    if (typeof document === 'undefined') return;
    const content = this.activeFileContent();
    const blob = new Blob([content], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.getFileName(this.activeFilePath());
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadLocalBridgeScript() {
    if (typeof document === 'undefined') return;
    const bridgeCode = `#!/usr/bin/env python3
"""
PyAdvance Local Python Bridge Agent (127.0.0.1:8765)
Run this script on your local computer with your preferred Python interpreter:
    python3 pyadvance_local_bridge.py
"""
import json
import subprocess
import sys
import platform
import tempfile
import os
from http.server import BaseHTTPRequestHandler, HTTPServer

PORT = 8765

class BridgeHandler(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(length).decode("utf-8") or "{}")
        if self.path == "/api/python/detect":
            resp = {
                "ok": True,
                "requestedPathValid": True,
                "activePath": sys.executable,
                "executable": sys.executable,
                "version": sys.version.split()[0],
                "platform": platform.platform(),
                "candidates": [{"path": sys.executable, "executable": sys.executable, "version": sys.version.split()[0], "platform": platform.platform()}]
            }
        else:
            work_dir = os.path.join(tempfile.gettempdir(), "pyadvance_bridge_proj")
            os.makedirs(work_dir, exist_ok=True)
            for folder in body.get("folders", []):
                os.makedirs(os.path.join(work_dir, folder), exist_ok=True)
            for rel, content in body.get("files", {}).items():
                full = os.path.join(work_dir, rel)
                os.makedirs(os.path.dirname(full), exist_ok=True)
                with open(full, "w", encoding="utf-8") as f:
                    f.write(content)
            py_bin = body.get("pythonPath") or sys.executable
            entry = body.get("entryFile") or "main.py"
            proc = subprocess.run([py_bin, "-u", entry], cwd=work_dir, input=body.get("stdin", ""), text=True, capture_output=True, timeout=10)
            resp = {"ok": proc.returncode == 0, "stdout": proc.stdout, "stderr": proc.stderr, "exitCode": proc.returncode, "usedPythonPath": py_bin}
        self.send_response(200)
        self._cors()
        self.send_header("Content-Type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(resp).encode("utf-8"))

if __name__ == "__main__":
    print(f"PyAdvance Local Bridge listening on http://127.0.0.1:{PORT} using {sys.executable}")
    HTTPServer(("127.0.0.1", PORT), BridgeHandler).serve_forever()
`;
    const blob = new Blob([bridgeCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pyadvance_local_bridge.py';
    a.click();
    URL.revokeObjectURL(url);
  }

  private saveWorkspaceToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(
        'pyadvance_coder_workspace_v1',
        JSON.stringify({
          projects: this.projects(),
          activeProjectId: this.activeProjectId(),
          localPythonPath: this.localPythonPath(),
        }),
      );
    } catch {
      // Ignore storage quota errors
    }
  }

  private loadWorkspaceFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem('pyadvance_coder_workspace_v1');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
        this.projects.set(parsed.projects);
      }
      if (parsed.activeProjectId) {
        this.activeProjectId.set(parsed.activeProjectId);
      }
      if (parsed.localPythonPath) {
        this.localPythonPath.set(parsed.localPythonPath);
      }
    } catch {
      // Ignore corrupted storage
    }
  }
}
