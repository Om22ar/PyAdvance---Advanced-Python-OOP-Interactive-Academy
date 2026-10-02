import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { PythonRunnerService, ExecutionResult } from '../../services/python-runner.service';
import { FirebaseService } from '../../services/firebase.service';
import { SyntaxHighlighter } from '../../services/syntax-highlighter';

export interface VscodeFile {
  name: string;
  path: string;
  content: string;
  isModified?: boolean;
  icon: 'python' | 'text' | 'json' | 'csv';
}

@Component({
  selector: 'app-vscode-editor',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="h-[calc(100vh-8.5rem)] min-h-[640px] flex flex-col bg-[#1E1E1E] text-[#CCCCCC] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl font-sans select-none">
      <!-- 1. VS Code Window Menu & Title Bar -->
      <div class="h-9 bg-[#323233] border-b border-[#252526] px-3 flex items-center justify-between text-xs text-[#CCCCCC] shrink-0">
        <!-- Left: App Icon & Standard Menus -->
        <div class="flex items-center gap-2">
          <!-- Back to Academy Button -->
          <button
            type="button"
            (click)="state.setView('curriculum')"
            title="Return to PyAdvance Curriculum"
            class="px-2 py-0.5 rounded bg-blue-600/80 hover:bg-blue-600 text-white font-medium text-[11px] flex items-center gap-1 transition-colors mr-2">
            <mat-icon class="text-xs leading-none">arrow_back</mat-icon>
            <span class="hidden sm:inline">Academy</span>
          </button>

          <!-- VS Code SVG Logo -->
          <svg class="w-4 h-4 text-blue-400 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .32 8.704l3.633 3.298L.32 15.296a1 1 0 0 0 .007 1.442l1.322 1.202c.38.345.952.37 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.94-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zM18.5 18.5l-6.84-6.5L18.5 5.5v13z"/>
          </svg>

          <!-- Desktop Menu List -->
          <div class="hidden md:flex items-center gap-1 text-[11px] text-[#CCCCCC]">
            <button class="px-2 py-0.5 rounded hover:bg-[#454545] transition-colors">File</button>
            <button class="px-2 py-0.5 rounded hover:bg-[#454545] transition-colors">Edit</button>
            <button class="px-2 py-0.5 rounded hover:bg-[#454545] transition-colors">Selection</button>
            <button class="px-2 py-0.5 rounded hover:bg-[#454545] transition-colors">View</button>
            <button class="px-2 py-0.5 rounded hover:bg-[#454545] transition-colors">Go</button>
            <button (click)="runActiveCode()" class="px-2 py-0.5 rounded hover:bg-[#454545] text-emerald-400 font-semibold transition-colors flex items-center gap-0.5">
              <span>Run</span>
            </button>
            <button (click)="toggleTerminalPanel()" class="px-2 py-0.5 rounded hover:bg-[#454545] text-teal-300 transition-colors">Terminal</button>
            <button class="px-2 py-0.5 rounded hover:bg-[#454545] transition-colors">Help</button>
          </div>
        </div>

        <!-- Center: Search Pill / Command Center -->
        <div class="flex-1 max-w-md mx-4 hidden lg:flex items-center justify-center">
          <div class="w-full max-w-sm px-3 py-1 rounded-md bg-[#252526] border border-[#3C3C3C] text-[11px] text-[#CCCCCC] flex items-center justify-between cursor-pointer hover:border-[#007ACC] transition-colors">
            <div class="flex items-center gap-2 truncate">
              <mat-icon class="text-xs text-[#858585]">search</mat-icon>
              <span class="truncate">pyadvance-workspace [Python 3.12]</span>
            </div>
            <kbd class="text-[9px] text-[#858585] bg-[#333333] px-1.5 py-0.5 rounded font-mono">Ctrl+P</kbd>
          </div>
        </div>

        <!-- Right: Window / Layout Controls -->
        <div class="flex items-center gap-1.5">
          <!-- Toggle Sidebar -->
          <button
            type="button"
            (click)="toggleSidebar()"
            [title]="isSidebarOpen() ? 'Hide Primary Side Bar' : 'Show Primary Side Bar'"
            class="p-1 rounded hover:bg-[#454545] text-[#CCCCCC] transition-colors">
            <mat-icon class="text-base leading-none">{{ isSidebarOpen() ? 'view_sidebar' : 'vertical_split' }}</mat-icon>
          </button>

          <!-- Toggle Bottom Terminal Panel -->
          <button
            type="button"
            (click)="toggleTerminalPanel()"
            [title]="isTerminalOpen() ? 'Hide Bottom Terminal Panel' : 'Show Bottom Terminal Panel'"
            class="p-1 rounded hover:bg-[#454545] text-[#CCCCCC] transition-colors">
            <mat-icon class="text-base leading-none">call_to_action</mat-icon>
          </button>

          <!-- Run Shortcut in Header -->
          <button
            type="button"
            (click)="runActiveCode()"
            [disabled]="isRunning()"
            class="ml-2 px-2.5 py-1 rounded bg-[#007ACC] hover:bg-[#0062a3] text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs transition-colors">
            <mat-icon class="text-xs leading-none">{{ isRunning() ? 'hourglass_top' : 'play_arrow' }}</mat-icon>
            <span class="hidden sm:inline">{{ isRunning() ? 'Running...' : 'Run' }}</span>
          </button>
        </div>
      </div>

      <!-- 2. Main Workbench (Activity Bar + Sidebar + Editor + Terminal) -->
      <div class="flex-1 flex overflow-hidden min-h-0">
        <!-- Activity Bar (Far Left 48px Dark Vertical Strip) -->
        <div class="w-12 bg-[#333333] border-r border-[#252526] flex flex-col items-center justify-between py-2 shrink-0 select-none">
          <!-- Top Icons -->
          <div class="flex flex-col items-center gap-3 w-full">
            <button
              type="button"
              (click)="selectActivity('explorer')"
              [class]="activeActivity() === 'explorer'
                ? 'w-full py-2.5 flex items-center justify-center text-white border-l-2 border-white'
                : 'w-full py-2.5 flex items-center justify-center text-[#858585] hover:text-white transition-colors'">
              <mat-icon class="text-xl">folder</mat-icon>
            </button>

            <button
              type="button"
              (click)="selectActivity('search')"
              [class]="activeActivity() === 'search'
                ? 'w-full py-2.5 flex items-center justify-center text-white border-l-2 border-white'
                : 'w-full py-2.5 flex items-center justify-center text-[#858585] hover:text-white transition-colors'">
              <mat-icon class="text-xl">search</mat-icon>
            </button>

            <button
              type="button"
              (click)="selectActivity('git')"
              [class]="activeActivity() === 'git'
                ? 'w-full py-2.5 flex items-center justify-center text-white border-l-2 border-white relative'
                : 'w-full py-2.5 flex items-center justify-center text-[#858585] hover:text-white transition-colors relative'">
              <mat-icon class="text-xl">fork_right</mat-icon>
              <span class="absolute top-1.5 right-2 w-3.5 h-3.5 rounded-full bg-[#007ACC] text-[9px] text-white font-bold flex items-center justify-center">1</span>
            </button>

            <button
              type="button"
              (click)="runActiveCode()"
              title="Run Python Code (▷)"
              class="w-full py-2.5 flex items-center justify-center text-emerald-400 hover:text-emerald-300 transition-colors">
              <mat-icon class="text-xl">play_circle</mat-icon>
            </button>

            <button
              type="button"
              (click)="selectActivity('extensions')"
              [class]="activeActivity() === 'extensions'
                ? 'w-full py-2.5 flex items-center justify-center text-white border-l-2 border-white'
                : 'w-full py-2.5 flex items-center justify-center text-[#858585] hover:text-white transition-colors'">
              <mat-icon class="text-xl">extension</mat-icon>
            </button>
          </div>

          <!-- Bottom Icons (Account & Settings) -->
          <div class="flex flex-col items-center gap-2 w-full">
            @if (firebase.currentUser(); as user) {
              <div title="Signed in with Google" class="w-7 h-7 rounded-full overflow-hidden ring-1 ring-emerald-500/50">
                @if (user.photoURL) {
                  <img [src]="user.photoURL" alt="User" referrerpolicy="no-referrer" class="w-full h-full object-cover" />
                } @else {
                  <div class="w-full h-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                    {{ user.displayName ? user.displayName[0] : 'U' }}
                  </div>
                }
              </div>
            } @else {
              <button
                type="button"
                (click)="firebase.loginWithGoogle()"
                title="Sign in with Google"
                class="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition-colors">
                <mat-icon class="text-lg">account_circle</mat-icon>
              </button>
            }

            <button
              type="button"
              (click)="state.openSettings()"
              title="Open Settings"
              class="w-full py-2 flex items-center justify-center text-[#858585] hover:text-white transition-colors">
              <mat-icon class="text-lg">settings</mat-icon>
            </button>
          </div>
        </div>

        <!-- Primary Side Bar (EXPLORER - Collapsible 240px) -->
        @if (isSidebarOpen()) {
          <div class="w-60 bg-[#252526] border-r border-[#1E1E1E] flex flex-col shrink-0 text-xs">
            <!-- Sidebar Header -->
            <div class="h-9 px-4 flex items-center justify-between font-semibold tracking-wider text-[11px] text-[#BBBBBB] uppercase">
              <span>Explorer</span>
              <div class="flex items-center gap-1">
                <button (click)="createNewFile()" title="New File" class="p-0.5 hover:bg-[#333333] rounded text-[#CCCCCC]">
                  <mat-icon class="text-sm">note_add</mat-icon>
                </button>
                <button (click)="resetWorkspaceFiles()" title="Reset Workspace" class="p-0.5 hover:bg-[#333333] rounded text-[#CCCCCC]">
                  <mat-icon class="text-sm">refresh</mat-icon>
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-[#333333]">
              <!-- Accordion 1: Open Editors -->
              <div>
                <div class="px-3 py-1.5 font-bold text-[11px] text-[#CCCCCC] flex items-center gap-1 hover:bg-[#2A2D2E] cursor-pointer">
                  <mat-icon class="text-xs">expand_more</mat-icon>
                  <span class="uppercase">Open Editors</span>
                </div>
                <div class="space-y-0.5 py-1">
                  @for (file of openFiles(); track file.name) {
                    <div
                      [class]="activeFile().name === file.name
                        ? 'px-4 py-1 bg-[#37373D] text-white flex items-center justify-between font-medium'
                        : 'px-4 py-1 text-[#CCCCCC] hover:bg-[#2A2D2E] flex items-center justify-between'">
                      <button
                        type="button"
                        (click)="setActiveFile(file)"
                        class="flex items-center gap-1.5 truncate text-left flex-1">
                        <span class="text-blue-400 font-bold text-xs">{{ file.name.endsWith('.py') ? '🐍' : '📄' }}</span>
                        <span class="truncate">{{ file.name }}</span>
                      </button>
                      <button type="button" (click)="closeFile(file, $event)" title="Close" class="text-xs text-[#858585] hover:text-white px-1">✕</button>
                    </div>
                  }
                </div>
              </div>

              <!-- Accordion 2: PyAdvance Workspace Tree -->
              <div>
                <div class="px-3 py-1.5 font-bold text-[11px] text-[#CCCCCC] flex items-center gap-1 hover:bg-[#2A2D2E]">
                  <mat-icon class="text-xs">expand_more</mat-icon>
                  <span class="uppercase">PyAdvance Workspace</span>
                </div>

                <div class="space-y-0.5 py-1">
                  @for (file of workspaceFiles(); track file.path) {
                    <button
                      type="button"
                      (click)="openFileInEditor(file)"
                      [class]="activeFile().name === file.name
                        ? 'w-full px-4 py-1 bg-[#37373D] text-white flex items-center gap-2 cursor-pointer text-left'
                        : 'w-full px-4 py-1 text-[#CCCCCC] hover:bg-[#2A2D2E] flex items-center gap-2 cursor-pointer text-left'">
                      <span class="text-xs">{{ file.name.endsWith('.py') ? '🐍' : (file.name.endsWith('.json') ? '🔧' : '📄') }}</span>
                      <span class="truncate font-mono text-[11px]">{{ file.name }}</span>
                    </button>
                  }
                </div>
              </div>

              <!-- Accordion 3: Code Outline (Functions & Classes parsed live) -->
              <div>
                <div class="px-3 py-1.5 font-bold text-[11px] text-[#CCCCCC] flex items-center gap-1 hover:bg-[#2A2D2E] cursor-pointer">
                  <mat-icon class="text-xs">expand_more</mat-icon>
                  <span class="uppercase">Outline</span>
                </div>
                <div class="px-5 py-1.5 text-[11px] font-mono text-[#858585] space-y-1">
                  @for (item of parsedCodeSymbols(); track item) {
                    <div class="flex items-center gap-1.5 text-slate-300">
                      <span class="text-purple-400 text-xs">{{ item.startsWith('class') ? 'C' : 'm' }}</span>
                      <span class="truncate">{{ item }}</span>
                    </div>
                  }
                  @if (parsedCodeSymbols().length === 0) {
                    <div class="italic text-slate-500 text-[10px]">No classes or methods detected.</div>
                  }
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Center: Editor + Bottom Terminal Panel -->
        <div class="flex-1 flex flex-col min-w-0 bg-[#1E1E1E]">
          <!-- Editor Tabs Bar & Action Buttons (Faithful to Screenshot 2!) -->
          <div class="h-9 bg-[#252526] border-b border-[#1E1E1E] flex items-center justify-between overflow-x-auto text-xs shrink-0 select-none">
            <!-- Open File Tabs -->
            <div class="flex items-center h-full">
              @for (file of openFiles(); track file.name) {
                <div
                  [class]="activeFile().name === file.name
                    ? 'h-full px-3.5 bg-[#1E1E1E] text-white border-t-2 border-[#007ACC] flex items-center gap-2 font-medium shadow-xs'
                    : 'h-full px-3.5 bg-[#2D2D2D] text-[#969696] hover:bg-[#2A2A2A] flex items-center gap-2 border-r border-[#1E1E1E]'">
                  <button
                    type="button"
                    (click)="setActiveFile(file)"
                    class="flex items-center gap-2 text-xs">
                    <span>{{ file.name.endsWith('.py') ? '🐍' : '📄' }}</span>
                    <span class="font-mono text-white">{{ file.name }}</span>
                  </button>
                  <button type="button" (click)="closeFile(file, $event)" title="Close Tab" class="text-xs hover:text-white p-0.5 rounded">✕</button>
                </div>
              }
              <button
                type="button"
                (click)="createNewFile()"
                title="New Untitled Python File"
                class="px-2 py-1 text-[#858585] hover:text-white text-sm">
                +
              </button>
            </div>

            <!-- Editor Action Icons (Top-Right of Editor matching Screenshot 2) -->
            <div class="flex items-center gap-1 px-3">
              <!-- Prism Highlighting Mode Toggle -->
              <button
                type="button"
                (click)="toggleEditorViewMode()"
                [title]="editorViewMode() === 'edit' ? 'Switch to Prism.js Syntax Highlighting View' : 'Switch to Interactive Edit Mode'"
                class="px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 transition-colors border"
                [class]="editorViewMode() === 'highlighted'
                  ? 'bg-violet-600/30 text-violet-300 border-violet-500/50'
                  : 'bg-[#2A2A2A] text-slate-300 border-slate-700 hover:text-white'">
                <mat-icon class="text-xs">{{ editorViewMode() === 'highlighted' ? 'auto_awesome' : 'palette' }}</mat-icon>
                <span>{{ editorViewMode() === 'highlighted' ? 'Prism Active' : 'Prism Highlight' }}</span>
              </button>

              <button
                type="button"
                (click)="runActiveCode()"
                [disabled]="isRunning()"
                title="Run Python File in Dedicated Terminal (▷)"
                class="px-2 py-1 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 font-semibold text-xs flex items-center gap-1 transition-colors">
                <mat-icon class="text-sm leading-none">{{ isRunning() ? 'hourglass_top' : 'play_arrow' }}</mat-icon>
                <span class="hidden sm:inline">Run Python</span>
              </button>

              <button
                type="button"
                (click)="toggleTerminalPanel()"
                title="Toggle Integrated Terminal (Ctrl+~)"
                class="p-1 rounded hover:bg-[#333333] text-[#CCCCCC] transition-colors">
                <mat-icon class="text-base leading-none">terminal</mat-icon>
              </button>

              <button
                type="button"
                (click)="copyActiveCode()"
                title="Copy Code"
                class="p-1 rounded hover:bg-[#333333] text-[#CCCCCC] transition-colors">
                <mat-icon class="text-base leading-none">{{ hasCopiedCode() ? 'check' : 'content_copy' }}</mat-icon>
              </button>
            </div>
          </div>

          <!-- Breadcrumb Path -->
          <div class="h-6 px-4 bg-[#1E1E1E] border-b border-[#252526] text-[11px] font-mono text-[#858585] flex items-center gap-1 shrink-0">
            <span>workspace</span>
            <span>&rsaquo;</span>
            <span class="text-[#CCCCCC] font-semibold">{{ activeFile().name }}</span>
            @if (editorViewMode() === 'highlighted') {
              <span class="ml-2 text-[10px] text-violet-400 bg-violet-950/60 px-1.5 py-0.2 rounded border border-violet-500/30">Prism.js Highlighted</span>
            }
          </div>

          <!-- Main Code Editor Body -->
          <div class="flex-1 flex overflow-hidden min-h-[220px]">
            <!-- Line Numbers Gutter -->
            <div class="w-12 bg-[#1E1E1E] text-[#858585] font-mono text-xs text-right pr-3 pt-3 select-none border-r border-[#2A2A2A] space-y-1">
              @for (lineNum of getCodeLineNumbers(); track lineNum) {
                <div class="leading-relaxed">{{ lineNum }}</div>
              }
            </div>

            <!-- Code Area: Edit vs Highlighted -->
            @if (editorViewMode() === 'edit') {
              <div class="flex-1 relative bg-[#1E1E1E] p-3 font-mono leading-relaxed text-[#D4D4D4]">
                <textarea
                  [(ngModel)]="activeFile().content"
                  (keydown.control.enter)="runActiveCode()"
                  (keydown.meta.enter)="runActiveCode()"
                  (keydown.tab)="handleTabKey($event)"
                  spellcheck="false"
                  class="w-full h-full bg-transparent text-[#D4D4D4] font-mono text-xs sm:text-sm focus:outline-none resize-none leading-relaxed selection:bg-[#264F78]"
                  placeholder="# VS Code Python Editor - Type code here and press (Ctrl + Enter) or click ▷ Run..."></textarea>
              </div>
            } @else {
              <div class="flex-1 overflow-auto bg-[#1E1E1E] p-3 font-mono text-xs sm:text-sm leading-relaxed text-[#D4D4D4]">
                <pre class="m-0 p-0 font-mono bg-transparent"><code class="language-python" [innerHTML]="highlighter.highlightPython(activeFile().content)"></code></pre>
              </div>
            }
          </div>

          <!-- 3. Integrated Bottom Panel (TERMINAL like in Image 2!) -->
          @if (isTerminalOpen()) {
            <div
              [class]="isTerminalMaximized() ? 'h-[460px]' : 'h-[260px]'"
              class="bg-[#181818] border-t border-[#252526] flex flex-col shrink-0 transition-all duration-150">
              <!-- Panel Header (Tabs: PROBLEMS, OUTPUT, DEBUG CONSOLE, TERMINAL) -->
              <div class="h-9 px-4 bg-[#1E1E1E] border-b border-[#252526] flex items-center justify-between text-xs select-none">
                <!-- Left Tabs matching Image 2 -->
                <div class="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-wider">
                  <button
                    type="button"
                    (click)="activePanelTab.set('problems')"
                    [class]="activePanelTab() === 'problems'
                      ? 'text-white border-b-2 border-[#007ACC] pb-1'
                      : 'text-[#858585] hover:text-[#CCCCCC] pb-1'">
                    Problems
                    <span class="ml-1 px-1.5 py-0.2 rounded-full text-[9px] bg-[#333333]">{{ errorCount() }}</span>
                  </button>

                  <button
                    type="button"
                    (click)="activePanelTab.set('output')"
                    [class]="activePanelTab() === 'output'
                      ? 'text-white border-b-2 border-[#007ACC] pb-1'
                      : 'text-[#858585] hover:text-[#CCCCCC] pb-1'">
                    Output
                  </button>

                  <button
                    type="button"
                    (click)="activePanelTab.set('debug')"
                    [class]="activePanelTab() === 'debug'
                      ? 'text-white border-b-2 border-[#007ACC] pb-1'
                      : 'text-[#858585] hover:text-[#CCCCCC] pb-1'">
                    Debug Console
                  </button>

                  <button
                    type="button"
                    (click)="activePanelTab.set('terminal')"
                    [class]="activePanelTab() === 'terminal'
                      ? 'text-white border-b-2 border-[#007ACC] pb-1 flex items-center gap-1'
                      : 'text-[#858585] hover:text-[#CCCCCC] pb-1 flex items-center gap-1'">
                    <span>Terminal</span>
                    @if (isRunning()) {
                      <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                    }
                  </button>
                </div>

                <!-- Right Terminal Controls (match Image 2 icons: powershell + split trash max close) -->
                <div class="flex items-center gap-2 text-xs text-[#858585]">
                  <!-- Terminal Type Dropdown -->
                  <div class="flex items-center gap-1 text-[11px] text-[#CCCCCC] bg-[#2A2A2A] px-2 py-0.5 rounded">
                    <mat-icon class="text-xs text-blue-400">terminal</mat-icon>
                    <span>powershell (python)</span>
                  </div>

                  <!-- New Terminal Plus -->
                  <button (click)="clearTerminalLog()" title="New Clean Terminal" class="hover:text-white p-0.5 rounded">
                    <mat-icon class="text-sm">add</mat-icon>
                  </button>

                  <!-- Clear Terminal Trash -->
                  <button (click)="clearTerminalLog()" title="Kill / Clear Terminal" class="hover:text-white p-0.5 rounded">
                    <mat-icon class="text-sm">delete</mat-icon>
                  </button>

                  <!-- Toggle Maximize -->
                  <button (click)="toggleTerminalMaximize()" [title]="isTerminalMaximized() ? 'Restore Panel' : 'Maximize Panel'" class="hover:text-white p-0.5 rounded">
                    <mat-icon class="text-sm">{{ isTerminalMaximized() ? 'expand_more' : 'expand_less' }}</mat-icon>
                  </button>

                  <!-- Close Panel -->
                  <button (click)="toggleTerminalPanel()" title="Close Panel" class="hover:text-white p-0.5 rounded">
                    <mat-icon class="text-sm">close</mat-icon>
                  </button>
                </div>
              </div>

              <!-- Panel Body: Terminal View -->
              @if (activePanelTab() === 'terminal') {
                <div class="flex-1 p-3 font-mono text-xs text-[#CCCCCC] overflow-y-auto space-y-1.5 leading-relaxed bg-[#181818]">
                  <!-- Shell Welcome / Banner matching Image 2 -->
                  <div class="text-[#858585] text-[11px] pb-1 border-b border-[#252526]">
                    Microsoft Windows [Version 10.0.22631] (PowerShell 7.4 / PyAdvance CPython WASM)
                  </div>

                  <!-- CLI Prompt Entry matching Screenshot 2: "PS C:/Users/PyAdvance> python -u main.py" -->
                  <div class="text-[#858585] flex items-center gap-1.5 pt-1">
                    <span class="text-cyan-400 font-bold">PS C:&#92;Users&#92;PyAdvance&gt;</span>
                    <span class="text-white font-medium">python -u {{ activeFile().name }}</span>
                    @if (lastRunDuration()) {
                      <span class="text-[10px] text-slate-500 font-mono ml-auto">Done in {{ lastRunDuration() }}ms</span>
                    }
                  </div>

                  <!-- Executing state -->
                  @if (isRunning()) {
                    <div class="flex items-center gap-2 text-teal-400 py-1 font-semibold">
                      <span class="animate-spin text-sm">&cir;</span>
                      <span>Running Python interpreter...</span>
                    </div>
                  }

                  <!-- Stdout Log -->
                  @if (terminalStdout()) {
                    <div class="text-emerald-400 whitespace-pre-wrap font-mono pt-1 leading-relaxed select-text" [innerHTML]="formatTerminalOutput(terminalStdout())"></div>
                  }

                  <!-- Stderr / Error Traceback -->
                  @if (terminalStderr()) {
                    <div class="p-2.5 rounded bg-rose-950/40 border border-rose-600/40 text-rose-300 font-mono text-xs whitespace-pre-wrap leading-relaxed select-text">
                      <div class="font-bold text-rose-400 flex items-center gap-1 pb-1">
                        <mat-icon class="text-sm">error</mat-icon>
                        <span>Exception Traceback</span>
                      </div>
                      <div [innerHTML]="formatTerminalTraceback(terminalStderr())"></div>
                    </div>
                  }

                  <!-- Prompt Line with interactive cursor & input -->
                  <div class="flex items-center gap-1.5 pt-1">
                    <span class="text-cyan-400 font-bold">PS C:&#92;Users&#92;PyAdvance&gt;</span>
                    <input
                      type="text"
                      [(ngModel)]="cliCommandInput"
                      (keydown.enter)="executeCliCommand()"
                      placeholder="Type command (e.g. python, dir, cls, or Python expression)..."
                      class="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none placeholder:text-slate-600" />
                  </div>
                </div>
              }

              <!-- Panel Body: Problems View -->
              @if (activePanelTab() === 'problems') {
                <div class="flex-1 p-4 font-mono text-xs text-[#CCCCCC] overflow-y-auto space-y-2">
                  @if (terminalStderr()) {
                    <div class="p-3 rounded bg-[#2D2D2D] border border-rose-500/50 flex items-start gap-2.5">
                      <mat-icon class="text-rose-400 text-sm leading-none mt-0.5">error</mat-icon>
                      <div>
                        <div class="font-bold text-rose-300">{{ activeFile().name }}: Python Runtime Error</div>
                        <div class="text-[11px] text-slate-400 mt-1 whitespace-pre-wrap">{{ terminalStderr() }}</div>
                      </div>
                    </div>
                  } @else {
                    <div class="text-center py-6 text-[#858585]">
                      <mat-icon class="text-2xl text-emerald-400 mb-1">check_circle</mat-icon>
                      <div>No problems have been detected in the workspace.</div>
                    </div>
                  }
                </div>
              }

              <!-- Panel Body: Output View -->
              @if (activePanelTab() === 'output') {
                <div class="flex-1 p-3 font-mono text-xs text-[#D4D4D4] overflow-y-auto whitespace-pre-wrap leading-relaxed select-text">
                  {{ terminalStdout() || '[Python Output Log - Empty]' }}
                </div>
              }

              <!-- Panel Body: Debug Console -->
              @if (activePanelTab() === 'debug') {
                <div class="flex-1 p-3 font-mono text-xs text-[#D4D4D4] overflow-y-auto space-y-2">
                  <div class="text-slate-500 text-[11px]">[Debug Console Ready - Evaluate expressions below]</div>
                  <div class="flex items-center gap-2 pt-2 border-t border-[#252526]">
                    <span class="text-blue-400 font-bold">&gt;</span>
                    <input
                      type="text"
                      [(ngModel)]="cliCommandInput"
                      (keydown.enter)="executeCliCommand()"
                      placeholder="Evaluate variable or expression..."
                      class="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none" />
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>

      <!-- 4. VS Code Status Bar (At bottom matching VS Code blue #007ACC) -->
      <div class="h-6 bg-[#007ACC] text-white text-[11px] px-3 flex items-center justify-between font-mono shrink-0 select-none">
        <!-- Left: Git Branch, Errors, Warnings -->
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-1 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            <mat-icon class="text-xs leading-none">fork_right</mat-icon>
            <span>main*</span>
          </div>

          <div class="flex items-center gap-1.5 hover:bg-white/10 px-1.5 py-0.5 rounded cursor-pointer">
            <span class="flex items-center gap-0.5">✕ {{ errorCount() }}</span>
            <span class="flex items-center gap-0.5">▲ 0</span>
          </div>
        </div>

        <!-- Center: Python Environment Info -->
        <div class="hidden md:flex items-center gap-2">
          <span class="font-bold flex items-center gap-1">
            <span>🐍</span>
            <span>Python 3.12.0 (PyAdvance WASM)</span>
          </span>
          <span>&bull;</span>
          <span>{{ runner.isWasmReady() ? 'WASM Ready' : 'Sandbox Ready' }}</span>
        </div>

        <!-- Right: Line/Col, Encoding, Language -->
        <div class="flex items-center gap-3">
          <span class="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer">Ln {{ getActiveLineCount() }}, Col 1</span>
          <span class="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer">Spaces: 4</span>
          <span class="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer">UTF-8</span>
          <span class="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer">CRLF</span>
          <span class="hover:bg-white/10 px-1 py-0.5 rounded cursor-pointer font-bold">Python</span>
          <mat-icon class="text-xs cursor-pointer hover:bg-white/10 p-0.5 rounded">notifications</mat-icon>
        </div>
      </div>
    </div>
  `
})
export class VscodeEditorComponent {
  readonly state = inject(LearningStateService);
  readonly runner = inject(PythonRunnerService);
  readonly firebase = inject(FirebaseService);
  readonly highlighter = inject(SyntaxHighlighter);

  readonly isSidebarOpen = signal<boolean>(true);
  readonly isTerminalOpen = signal<boolean>(true);
  readonly isTerminalMaximized = signal<boolean>(false);
  readonly editorViewMode = signal<'edit' | 'highlighted'>('edit');
  readonly activeActivity = signal<'explorer' | 'search' | 'git' | 'extensions'>('explorer');
  readonly activePanelTab = signal<'problems' | 'output' | 'debug' | 'terminal'>('terminal');

  readonly isRunning = signal<boolean>(false);
  readonly terminalStdout = signal<string>('');
  readonly terminalStderr = signal<string>('');
  readonly lastRunDuration = signal<number | null>(null);
  readonly hasCopiedCode = signal<boolean>(false);

  cliCommandInput = '';

  // Workspace Files
  readonly workspaceFiles = signal<VscodeFile[]>([
    {
      name: 'main.py',
      path: '/workspace/main.py',
      icon: 'python',
      content: `# =========================================================
# PyAdvance Academy - Advanced Python & OOP (VS Code Coder)
# Based on T\\ Sondos Saif's Lectures
# =========================================================

class SecurityTool:
    """Base class for all security pipeline analyzers."""
    def __init__(self, name: str, version: str = "2.4.0"):
        self.name = name
        self.version = version

    def analyze(self) -> str:
        raise NotImplementedError("Subclasses must implement analyze()")

class PortScanner(SecurityTool):
    def analyze(self) -> str:
        return f"[{self.name} v{self.version}] Scanning open TCP ports: [80, 443, 8080]... OK"

class MalwareScanner(SecurityTool):
    def analyze(self) -> str:
        return f"[{self.name} v{self.version}] Scanning filesystem memory buffers for malware signatures... OK"

class SecurityPipeline:
    def __init__(self, tools):
        self.tools = tools

    def run(self):
        print("=== EXECUTING UNIFIED SECURITY PIPELINE ===")
        for tool in self.tools:
            print(tool.analyze())
        print("=== SCAN COMPLETED SUCCESSFULLY ===")

# Run the pipeline
pipeline = SecurityPipeline([
    PortScanner("Network Auditor"),
    MalwareScanner("Signature Detector")
])
pipeline.run()
`
    },
    {
      name: 'c3_mro.py',
      path: '/workspace/c3_mro.py',
      icon: 'python',
      content: `# Diamond Problem & C3 MRO (Method Resolution Order)
class A:
    def say(self):
        print("  -> Executing inside A")

class B(A):
    def say(self):
        print("  -> Executing inside B")
        super().say()

class C(A):
    def say(self):
        print("  -> Executing inside C")
        super().say()

class D(B, C):
    def say(self):
        print("  -> Executing inside D")
        super().say()

print("C3 MRO Order for D:")
for cls in D.mro():
    print(" ", cls.__name__)

print("\\nInvoking D().say():")
d = D()
d.say()
`
    },
    {
      name: 'seek_tell_buffer.py',
      path: '/workspace/seek_tell_buffer.py',
      icon: 'python',
      content: `# File Stream Seek & Tell Navigation
with open("sample.txt", "w") as f:
    f.write("Hello, this is a test file.\\nSecond line.\\n")

# Seek from beginning (whence=0)
with open("sample.txt", "r") as f:
    f.seek(7)
    print("Offset 7 output:", f.read(11))
    print("Current tell():", f.tell())

# Binary mode seek from end (whence=2)
with open("sample.txt", "rb") as f:
    f.seek(-7, 2)
    print("End-relative read (-7, 2):", f.read())
`
    },
    {
      name: 'sample.txt',
      path: '/workspace/sample.txt',
      icon: 'text',
      content: `Hello, this is a test file.
Second line for testing readlines() and seek() operations.
Third line: Port=8080, Debug=False.
`
    },
    {
      name: 'user.json',
      path: '/workspace/user.json',
      icon: 'json',
      content: `{
  "username": "developer",
  "role": "Security Engineer",
  "level": "Senior",
  "skills": ["Python", "OOP", "Networking", "Cryptography"],
  "active": true
}
`
    }
  ]);

  // Open tabs
  readonly openFiles = signal<VscodeFile[]>([]);
  readonly activeFile = signal<VscodeFile>(this.workspaceFiles()[0]);

  readonly parsedCodeSymbols = computed<string[]>(() => {
    const code = this.activeFile().content;
    const lines = code.split('\n');
    const symbols: string[] = [];

    for (const rawLine of lines) {
      const line = rawLine.trim();
      if (line.startsWith('class ')) {
        const name = line.replace('class ', '').split('(')[0].split(':')[0].trim();
        symbols.push(`class ${name}`);
      } else if (line.startsWith('def ')) {
        const name = line.replace('def ', '').split('(')[0].trim();
        symbols.push(`def ${name}()`);
      }
    }
    return symbols;
  });

  readonly errorCount = computed<number>(() => {
    return this.terminalStderr() ? 1 : 0;
  });

  constructor() {
    // Open default files
    this.openFiles.set([this.workspaceFiles()[0], this.workspaceFiles()[1]]);
    this.activeFile.set(this.workspaceFiles()[0]);

    // Initial default stdout
    this.terminalStdout.set(`=== EXECUTING UNIFIED SECURITY PIPELINE ===
[Network Auditor v2.4.0] Scanning open TCP ports: [80, 443, 8080]... OK
[Signature Detector v2.4.0] Scanning filesystem memory buffers for malware signatures... OK
=== SCAN COMPLETED SUCCESSFULLY ===`);
    this.lastRunDuration.set(22);
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  toggleTerminalPanel() {
    this.isTerminalOpen.update(v => !v);
  }

  toggleTerminalMaximize() {
    this.isTerminalMaximized.update(v => !v);
  }

  selectActivity(activity: 'explorer' | 'search' | 'git' | 'extensions') {
    this.activeActivity.set(activity);
    if (!this.isSidebarOpen()) {
      this.isSidebarOpen.set(true);
    }
  }

  setActiveFile(file: VscodeFile) {
    this.activeFile.set(file);
  }

  openFileInEditor(file: VscodeFile) {
    const currentOpen = this.openFiles();
    if (!currentOpen.some(f => f.name === file.name)) {
      this.openFiles.set([...currentOpen, file]);
    }
    this.activeFile.set(file);
  }

  closeFile(file: VscodeFile, event: MouseEvent) {
    event.stopPropagation();
    const updated = this.openFiles().filter(f => f.name !== file.name);
    this.openFiles.set(updated);
    if (this.activeFile().name === file.name && updated.length > 0) {
      this.activeFile.set(updated[updated.length - 1]);
    }
  }

  createNewFile() {
    const count = this.workspaceFiles().length + 1;
    const newFile: VscodeFile = {
      name: `script_${count}.py`,
      path: `/workspace/script_${count}.py`,
      icon: 'python',
      content: `# New Python Script
def main():
    print("Hello from script_${count}.py!")

if __name__ == "__main__":
    main()
`
    };
    this.workspaceFiles.update(files => [...files, newFile]);
    this.openFileInEditor(newFile);
  }

  resetWorkspaceFiles() {
    this.activeFile().content = `# Python code reset
print("Workspace reset to default.")`;
  }

  async runActiveCode() {
    this.isRunning.set(true);
    this.isTerminalOpen.set(true);
    this.activePanelTab.set('terminal');
    this.terminalStderr.set('');

    try {
      const res: ExecutionResult = await this.runner.runCode(this.activeFile().content);
      this.terminalStdout.set(res.stdout);
      this.terminalStderr.set(res.stderr);
      this.lastRunDuration.set(res.durationMs);

      // If active lesson exists, track progress
      const mod = this.state.activeModule();
      const les = this.state.activeLesson();
      if (mod && les) {
        this.state.markStepCompleted(mod.id, les.id, `Executed in VS Code: ${this.activeFile().name}`);
      }
    } finally {
      this.isRunning.set(false);
    }
  }

  async executeCliCommand() {
    const cmd = this.cliCommandInput.trim();
    if (!cmd) return;

    this.cliCommandInput = '';

    if (cmd === 'cls' || cmd === 'clear') {
      this.clearTerminalLog();
      return;
    }

    if (cmd === 'python' || cmd.startsWith('python ')) {
      await this.runActiveCode();
      return;
    }

    if (cmd === 'dir' || cmd === 'ls') {
      const fileList = this.workspaceFiles().map(f => `  ${f.name.padEnd(20, ' ')} ${f.content.length} bytes`).join('\n');
      this.terminalStdout.set(`Directory of C:\\Users\\PyAdvance\\workspace\n\n${fileList}`);
      return;
    }

    // Evaluate quick one-liner via runner
    const res = await this.runner.evalQuickExpression(cmd);
    if (res.isError) {
      this.terminalStderr.set(res.output);
    } else {
      this.terminalStdout.set(res.output);
    }
  }

  clearTerminalLog() {
    this.terminalStdout.set('');
    this.terminalStderr.set('');
  }

  copyActiveCode() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(this.activeFile().content);
      this.hasCopiedCode.set(true);
      setTimeout(() => this.hasCopiedCode.set(false), 2000);
    }
  }

  handleTabKey(e: Event) {
    e.preventDefault();
    const textarea = e.target as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Set textarea value to: text before caret + 4 spaces + text after caret
    textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
    this.activeFile().content = textarea.value;

    // Put caret at right position again
    textarea.selectionStart = textarea.selectionEnd = start + 4;
  }

  getCodeLineNumbers(): number[] {
    const lines = this.activeFile().content.split('\n');
    return Array.from({ length: Math.max(1, lines.length) }, (_, i) => i + 1);
  }

  getActiveLineCount(): number {
    return this.activeFile().content.split('\n').length;
  }

  toggleEditorViewMode() {
    this.editorViewMode.update(m => m === 'edit' ? 'highlighted' : 'edit');
  }

  formatTerminalOutput(output: string): string {
    if (!output) return '';
    try {
      return this.highlighter.highlightPython(output);
    } catch {
      return output;
    }
  }

  formatTerminalTraceback(stderr: string): string {
    const escaped = stderr
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

    return escaped
      .replace(/File &quot;(.*?)&quot;, line (\d+)(.*)/g, 'File "<span class="text-cyan-300 font-semibold">$1</span>", line <span class="text-amber-300 font-extrabold underline">$2</span><span class="text-slate-400">$3</span>')
      .replace(/([A-Z][a-zA-Z]*(?:Error|Exception)): (.*)/g, '<span class="text-rose-400 font-extrabold text-sm">$1:</span> <span class="text-rose-200 font-semibold">$2</span>');
  }
}
