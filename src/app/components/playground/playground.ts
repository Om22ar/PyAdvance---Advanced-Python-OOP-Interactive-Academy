import { ChangeDetectionStrategy, Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { PythonRunnerService, ExecutionResult } from '../../services/python-runner.service';
import { SyntaxHighlighter } from '../../services/syntax-highlighter';

export interface ParsedPythonError {
  type: string;
  message: string;
  line: number | null;
  codeSnippet: string | null;
  explanation: string;
  remediation: string;
  suggestedFix?: string;
  rawTraceback: string;
}

export interface TerminalEntry {
  type: 'cmd' | 'stdout' | 'stderr' | 'system' | 'repl';
  text: string;
  timestamp: string;
  isError?: boolean;
  highlightedHtml?: string;
}

@Component({
  selector: 'app-playground',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-7xl mx-auto">
      <!-- Top Lab Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            <mat-icon class="text-base leading-none">terminal</mat-icon>
            <span>INTERACTIVE PYTHON OOP LAB</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {{ activeLesson().title }}
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {{ activeLesson().summary }}
          </p>
        </div>

        <!-- Quick Switch Preset Selector -->
        <div class="flex items-center gap-2">
          <label for="topic-select" class="text-xs font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">Topic:</label>
          <select
            id="topic-select"
            [ngModel]="selectedSnippetKey()"
            (ngModelChange)="onSnippetChange($event)"
            class="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#11232B] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-teal-500 shadow-xs max-w-xs truncate">
            <option value="diamond-mro">01. C3 MRO &amp; Diamond Inheritance (super())</option>
            <option value="seek-binary">02. Stream Seek Pointers &amp; tell() in 'rb'</option>
            <option value="composition-suite">03. SecuritySuite Composition (HAS-A)</option>
            <option value="json-custom">04. Custom OOP JSON Serialization (__dict__)</option>
            <option value="regex-named">05. Regex Named Groups (?P&lt;year&gt;...)</option>
            <option value="polymorphism-abc">06. Abstract Base Classes &amp; Duck Typing</option>
            <option value="var-args">07. Positional, *args &amp; **kwargs Combined</option>
            <option value="dunder-rules">08. Dunder Methods (__str__, __repr__, ==)</option>
            <option value="crypto-hash">09. Security Built-ins: hashlib &amp; base64</option>
          </select>
        </div>
      </div>

      <!-- Main Editor & Terminal Split Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Editor Column (7 cols or 6 cols depending on expanded state) -->
        <div [class]="isTerminalMaximized() ? 'lg:col-span-5' : 'lg:col-span-6 xl:col-span-6'" class="flex flex-col gap-6">
          <!-- Python Code Editor Card -->
          <div class="bg-[#0b1419] rounded-2xl border border-slate-800 shadow-md flex flex-col flex-1 overflow-hidden">
            <!-- Editor Toolbar -->
            <div class="px-4 py-2.5 bg-[#080e12] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div class="flex items-center gap-2">
                <span class="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span class="font-mono text-slate-300 font-semibold ml-2 text-[12px] flex items-center gap-1.5">
                  <mat-icon class="text-sm text-teal-400">code</mat-icon>
                  <span>main.py</span>
                </span>

                <!-- Prism Highlighting Pill Indicator -->
                <span class="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-violet-950/70 text-violet-300 border border-violet-500/30">
                  <mat-icon class="text-[12px] leading-none text-violet-400">auto_awesome</mat-icon>
                  <span>Prism.js Highlight</span>
                </span>
              </div>

              <!-- Editor View Mode Controls & Reset -->
              <div class="flex items-center gap-1.5">
                <!-- Mode Switcher: Edit / Highlighted Preview / Split -->
                <div class="flex items-center bg-slate-900/90 rounded-lg p-0.5 border border-slate-800 text-[11px] font-mono">
                  <button
                    type="button"
                    (click)="editorMode.set('edit')"
                    [class]="editorMode() === 'edit'
                      ? 'px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold'
                      : 'px-2 py-0.5 text-slate-400 hover:text-slate-200'"
                    title="Edit Python Code">
                    Edit
                  </button>
                  <button
                    type="button"
                    (click)="editorMode.set('preview')"
                    [class]="editorMode() === 'preview'
                      ? 'px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 font-semibold'
                      : 'px-2 py-0.5 text-slate-400 hover:text-slate-200'"
                    title="Syntax Highlighted View (Prism.js)">
                    Preview
                  </button>
                  <button
                    type="button"
                    (click)="editorMode.set('split')"
                    [class]="editorMode() === 'split'
                      ? 'px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold'
                      : 'px-2 py-0.5 text-slate-400 hover:text-slate-200'"
                    title="Split Editor & Live Syntax Highlighting">
                    Split
                  </button>
                </div>

                <!-- Engine indicator -->
                <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950/80 text-teal-400 border border-teal-500/30 hidden md:inline">
                  {{ runner.isWasmReady() ? 'CPython 3.12' : 'Sandbox' }}
                </span>

                <button
                  type="button"
                  (click)="resetCode()"
                  title="Reset code snippet to default"
                  class="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1">
                  <mat-icon class="text-sm">refresh</mat-icon>
                  <span class="hidden sm:inline">Reset</span>
                </button>
              </div>
            </div>

            <!-- Code Editor Workspace with 3 Modes (Edit, Prism Preview, Split) -->
            <div class="relative flex-1 min-h-[380px] bg-[#0b1419] flex overflow-hidden">
              <!-- MODE 1: Interactive Edit Mode with Line Numbers Gutter -->
              @if (editorMode() === 'edit') {
                <div class="flex-1 flex overflow-hidden">
                  <!-- Line numbers gutter -->
                  <div class="w-10 sm:w-12 bg-[#080e12] text-slate-600 font-mono text-xs text-right pr-2.5 pt-4 select-none border-r border-slate-800/80 space-y-0.5 shrink-0">
                    @for (lineNum of getCodeLineNumbers(); track lineNum) {
                      <div class="leading-relaxed text-[11px]">{{ lineNum }}</div>
                    }
                  </div>

                  <!-- Textarea with Tab indentation & Ctrl+Enter -->
                  <div class="flex-1 relative p-4 font-mono leading-relaxed bg-[#0b1419]">
                    <textarea
                      [(ngModel)]="currentCode"
                      (keydown.control.enter)="executeCode()"
                      (keydown.meta.enter)="executeCode()"
                      (keydown.tab)="handleTabKey($event)"
                      spellcheck="false"
                      [style.font-size.px]="state.editorFontSize()"
                      class="w-full h-full min-h-[360px] bg-transparent text-slate-100 font-mono focus:outline-none resize-none leading-relaxed selection:bg-teal-500/30 font-medium text-xs sm:text-sm"
                      placeholder="# Write your Python code here... (Tab key supported for 4-space indent)"></textarea>
                  </div>
                </div>
              }

              <!-- MODE 2: Full Prism.js Syntax-Highlighted Inspector Mode -->
              @if (editorMode() === 'preview') {
                <div class="flex-1 flex flex-col overflow-hidden bg-[#0b1419]">
                  <!-- Inspector notification bar -->
                  <div class="px-4 py-1.5 bg-violet-950/30 border-b border-violet-500/20 text-[11px] text-violet-300 font-mono flex items-center justify-between">
                    <span class="flex items-center gap-1.5">
                      <mat-icon class="text-xs text-violet-400">palette</mat-icon>
                      <span>Prism.js Syntax Highlight View - Python Grammar Tokenized</span>
                    </span>
                    <button
                      type="button"
                      (click)="editorMode.set('edit')"
                      class="text-teal-400 hover:underline flex items-center gap-1">
                      <mat-icon class="text-xs">edit</mat-icon>
                      <span>Click to Edit</span>
                    </button>
                  </div>

                  <div class="flex-1 overflow-y-auto p-4 flex font-mono text-xs sm:text-sm leading-relaxed">
                    <!-- Line numbers -->
                    <div class="w-10 sm:w-12 text-slate-600 text-right pr-3 select-none border-r border-slate-800/80 space-y-0.5 shrink-0">
                      @for (lineNum of getCodeLineNumbers(); track lineNum) {
                        <div class="leading-relaxed text-[11px]">{{ lineNum }}</div>
                      }
                    </div>

                    <!-- Highlighted Code with Prism tokens -->
                    <div class="flex-1 pl-4 overflow-x-auto">
                      <pre class="m-0 p-0 font-mono bg-transparent text-slate-100"><code class="language-python" [innerHTML]="highlightedFullCode()"></code></pre>
                    </div>
                  </div>
                </div>
              }

              <!-- MODE 3: Split Editor + Live Prism Preview -->
              @if (editorMode() === 'split') {
                <div class="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
                  <!-- Left side: Textarea -->
                  <div class="flex flex-col h-full min-h-[360px] bg-[#0b1419]">
                    <div class="px-3 py-1 bg-[#080e12] border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                      <span>EDIT SOURCE</span>
                      <span class="text-teal-400">Ctrl+Enter to Run</span>
                    </div>
                    <div class="flex-1 flex overflow-hidden">
                      <div class="w-8 bg-[#080e12] text-slate-600 font-mono text-[10px] text-right pr-2 pt-3 select-none border-r border-slate-800/80 space-y-0.5 shrink-0">
                        @for (lineNum of getCodeLineNumbers(); track lineNum) {
                          <div class="leading-relaxed">{{ lineNum }}</div>
                        }
                      </div>
                      <textarea
                        [(ngModel)]="currentCode"
                        (keydown.control.enter)="executeCode()"
                        (keydown.meta.enter)="executeCode()"
                        (keydown.tab)="handleTabKey($event)"
                        spellcheck="false"
                        class="w-full h-full p-3 bg-transparent text-slate-100 font-mono focus:outline-none resize-none leading-relaxed text-xs selection:bg-teal-500/30"
                        placeholder="# Type code here..."></textarea>
                    </div>
                  </div>

                  <!-- Right side: Live Prism Tokenized Preview -->
                  <div class="flex flex-col h-full min-h-[360px] bg-[#070c0f]">
                    <div class="px-3 py-1 bg-[#080e12] border-b border-slate-800 text-[10px] font-mono text-violet-300 flex items-center justify-between">
                      <span>PRISM SYNTAX TOKENS</span>
                      <span class="text-emerald-400">Live</span>
                    </div>
                    <div class="flex-1 p-3 overflow-y-auto font-mono text-xs leading-relaxed text-slate-100">
                      <pre class="m-0 p-0 font-mono bg-transparent"><code class="language-python" [innerHTML]="highlightedFullCode()"></code></pre>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Editor Actions Bar -->
            <div class="p-3 bg-[#080e12] border-t border-slate-800/80 flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs text-slate-400">
                <mat-icon class="text-base text-teal-400">keyboard</mat-icon>
                <span class="hidden sm:inline">Press <kbd class="px-1.5 py-0.5 rounded bg-slate-800 text-teal-300 font-mono text-[10px]">Ctrl+Enter</kbd> to run</span>
              </div>

              <div class="flex items-center gap-2">
                <button
                  type="button"
                  (click)="copyCode()"
                  class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-all">
                  <mat-icon class="text-sm">content_copy</mat-icon>
                  <span>{{ hasCopied() ? 'Copied!' : 'Copy Code' }}</span>
                </button>

                <button
                  type="button"
                  (click)="executeCode()"
                  [disabled]="isRunning()"
                  class="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-teal-500/20 active:scale-95">
                  <mat-icon class="text-base leading-none">{{ isRunning() ? 'hourglass_top' : 'play_arrow' }}</mat-icon>
                  <span>{{ isRunning() ? 'Executing...' : 'Run Code' }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Interactive Lesson Quiz Card -->
          @if (activeLesson().quiz; as q) {
            <div class="bg-white dark:bg-[#11232B] rounded-2xl p-5 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                  <mat-icon class="text-sm">quiz</mat-icon>
                  <span>CONCEPT CHECK</span>
                </div>
                <span class="text-xs font-semibold text-slate-400">1 question</span>
              </div>

              <h4 class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                {{ q.question }}
              </h4>

              <div class="space-y-1.5 pt-1">
                @for (opt of q.options; track opt; let idx = $index) {
                  <button
                    type="button"
                    (click)="submitQuiz(idx)"
                    [class]="selectedQuizAnswer() === idx
                      ? (idx === q.answerIndex
                        ? 'w-full text-left p-2.5 rounded-xl border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 text-xs font-medium transition-all'
                        : 'w-full text-left p-2.5 rounded-xl border border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 text-xs font-medium transition-all')
                      : 'w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 text-xs transition-all'">
                    <span class="font-bold mr-1">{{ ['A', 'B', 'C', 'D'][idx] }}.</span>
                    {{ opt }}
                  </button>
                }
              </div>

              @if (quizFeedback()) {
                <div
                  [class]="isQuizCorrect()
                    ? 'p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-300'
                    : 'p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300'">
                  <div class="font-bold mb-0.5 flex items-center gap-1.5">
                    <mat-icon class="text-sm leading-none">{{ isQuizCorrect() ? 'check_circle' : 'cancel' }}</mat-icon>
                    <span>{{ isQuizCorrect() ? 'Correct!' : 'Incorrect' }}</span>
                  </div>
                  <p class="leading-relaxed">{{ q.explanation }}</p>
                </div>
              }
            </div>
          }
        </div>

        <!-- Dedicated Terminal & Output Column -->
        <div [class]="isTerminalMaximized() ? 'lg:col-span-7' : 'lg:col-span-6 xl:col-span-6'" class="flex flex-col gap-4">
          <!-- Terminal Window Container -->
          <div class="bg-[#05080A] rounded-2xl border border-slate-800/90 shadow-2xl flex flex-col flex-1 overflow-hidden transition-all duration-200">
            <!-- Dedicated Terminal Header Bar -->
            <div class="px-4 py-2.5 bg-[#0A1014] border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-xs">
              <!-- Terminal Window Controls & Session Title -->
              <div class="flex items-center gap-3">
                <div class="flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                  <span class="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                  <span class="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                </div>
                <div class="font-mono text-slate-300 font-semibold text-xs flex items-center gap-1.5">
                  <mat-icon class="text-sm text-teal-400">terminal</mat-icon>
                  <span>bash - python3 main.py</span>
                </div>
              </div>

              <!-- Terminal Status Badges -->
              <div class="flex items-center gap-2">
                @if (isRunning()) {
                  <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-950/80 text-amber-400 border border-amber-500/30 animate-pulse">
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>RUNNING</span>
                  </span>
                } @else if (executionResult(); as res) {
                  @if (res.success) {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      <mat-icon class="text-xs leading-none">check_circle</mat-icon>
                      <span>Exit 0</span>
                    </span>
                  } @else {
                    <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-950/80 text-rose-400 border border-rose-500/30 animate-pulse">
                      <mat-icon class="text-xs leading-none">error</mat-icon>
                      <span>Exit 1</span>
                    </span>
                  }

                  <span class="text-[11px] font-mono text-slate-400 tabular-nums">
                    {{ res.durationMs }}ms
                  </span>
                }
              </div>
            </div>

            <!-- Terminal Tabs & Controls Strip -->
            <div class="px-3 py-1.5 bg-[#070C0F] border-b border-slate-800/80 flex items-center justify-between gap-2 overflow-x-auto text-xs">
              <!-- View Tabs -->
              <div class="flex items-center gap-1">
                <button
                  type="button"
                  (click)="activeTerminalTab.set('terminal')"
                  [class]="activeTerminalTab() === 'terminal'
                    ? 'px-3 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/40 text-xs flex items-center gap-1.5'
                    : 'px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs flex items-center gap-1.5'">
                  <mat-icon class="text-xs">wysiwyg</mat-icon>
                  <span>Terminal</span>
                </button>

                <button
                  type="button"
                  (click)="activeTerminalTab.set('diagnostics')"
                  [class]="activeTerminalTab() === 'diagnostics'
                    ? 'px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40 text-xs flex items-center gap-1.5'
                    : 'px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs flex items-center gap-1.5'">
                  <mat-icon class="text-xs">bug_report</mat-icon>
                  <span>Diagnostics</span>
                  @if (parsedError()) {
                    <span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                  }
                </button>

                <button
                  type="button"
                  (click)="activeTerminalTab.set('raw')"
                  [class]="activeTerminalTab() === 'raw'
                    ? 'px-3 py-1 rounded-lg bg-slate-800 text-slate-200 font-semibold text-xs flex items-center gap-1.5'
                    : 'px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs flex items-center gap-1.5'">
                  <mat-icon class="text-xs">notes</mat-icon>
                  <span>Raw Text</span>
                </button>

                <button
                  type="button"
                  (click)="activeTerminalTab.set('vfs')"
                  [class]="activeTerminalTab() === 'vfs'
                    ? 'px-3 py-1 rounded-lg bg-slate-800 text-teal-300 font-semibold text-xs flex items-center gap-1.5'
                    : 'px-3 py-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs flex items-center gap-1.5'">
                  <mat-icon class="text-xs">folder</mat-icon>
                  <span>VFS Files</span>
                </button>
              </div>

              <!-- Terminal Action Buttons -->
              <div class="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  (click)="toggleLineNumbers()"
                  [title]="showLineNumbers() ? 'Hide line numbers' : 'Show line numbers'"
                  [class]="showLineNumbers() ? 'text-teal-400' : 'text-slate-500'"
                  class="p-1 rounded hover:bg-slate-800 text-xs transition-colors">
                  <mat-icon class="text-base leading-none">format_list_numbered</mat-icon>
                </button>

                <button
                  type="button"
                  (click)="toggleWrap()"
                  [title]="wrapOutput() ? 'Disable word wrap' : 'Enable word wrap'"
                  [class]="wrapOutput() ? 'text-teal-400' : 'text-slate-500'"
                  class="p-1 rounded hover:bg-slate-800 text-xs transition-colors">
                  <mat-icon class="text-base leading-none">wrap_text</mat-icon>
                </button>

                <button
                  type="button"
                  (click)="copyTerminalOutput()"
                  title="Copy terminal output"
                  class="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors text-xs">
                  <mat-icon class="text-base leading-none">{{ hasCopiedTerminal() ? 'check' : 'content_copy' }}</mat-icon>
                </button>

                <button
                  type="button"
                  (click)="clearTerminal()"
                  title="Clear terminal screen"
                  class="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors text-xs">
                  <mat-icon class="text-base leading-none">delete_sweep</mat-icon>
                </button>

                <button
                  type="button"
                  (click)="toggleMaximize()"
                  [title]="isTerminalMaximized() ? 'Shrink terminal' : 'Expand terminal'"
                  class="p-1 text-slate-400 hover:text-teal-400 hover:bg-slate-800 rounded transition-colors text-xs">
                  <mat-icon class="text-base leading-none">{{ isTerminalMaximized() ? 'unfold_less' : 'unfold_more' }}</mat-icon>
                </button>
              </div>
            </div>

            <!-- Tab 1: Dedicated Syntax-Highlighted Terminal View with Prism.js -->
            @if (activeTerminalTab() === 'terminal') {
              <div
                [class]="isTerminalMaximized() ? 'min-h-[500px] max-h-[640px]' : 'min-h-[340px] max-h-[460px]'"
                class="p-4 font-mono text-xs overflow-y-auto space-y-2 selection:bg-teal-500/30 transition-all">
                
                <!-- Welcome Banner when idle and no output yet -->
                @if (!isRunning() && !executionResult() && terminalHistory().length === 0) {
                  <div class="py-4 text-slate-500 space-y-1.5 font-mono text-xs">
                    <div class="text-teal-400 font-bold flex items-center gap-1.5">
                      <span>Python 3.12.0 (PyAdvance Cloud Interactive Engine)</span>
                      <span class="text-[10px] font-mono px-1.5 py-0.2 rounded bg-violet-950/80 text-violet-300 border border-violet-500/30">Prism Powered</span>
                    </div>
                    <div>Type your code in <span class="text-slate-300">main.py</span> and click <span class="text-emerald-400 font-semibold">[Run Code]</span> or press <kbd class="px-1 py-0.5 rounded bg-slate-800 text-teal-300 text-[10px]">Ctrl+Enter</kbd>.</div>
                    <div class="text-slate-400 pt-1 text-[11px]">Features real-time Prism.js syntax tokenization, C3 MRO linearizations, seek/tell byte streams, and intelligent diagnostics.</div>
                  </div>
                }

                <!-- Shell Execution Command Prompt -->
                @if (executionResult() || isRunning() || terminalHistory().length > 0) {
                  <div class="flex items-center gap-2 text-slate-400 text-[11px] pb-1 border-b border-slate-800/60">
                    <span class="text-emerald-400 font-semibold">pyadvance@developer</span>
                    <span class="text-slate-600">:</span>
                    <span class="text-teal-400">~/workspace</span>
                    <span class="text-slate-300 font-bold">$</span>
                    <span class="text-slate-100 font-semibold">python3 -u main.py</span>
                  </div>
                }

                <!-- Running Spinner -->
                @if (isRunning()) {
                  <div class="flex items-center gap-2 text-teal-400 py-3">
                    <span class="animate-spin text-base font-bold">&cir;</span>
                    <span class="font-medium">Executing code on Python runtime...</span>
                  </div>
                }

                <!-- Terminal History Entries (From Previous Runs or REPL) -->
                @for (entry of terminalHistory(); track $index) {
                  <div class="space-y-1">
                    @if (entry.type === 'cmd') {
                      <div class="flex items-center gap-2 text-slate-400 text-[11px] pt-1">
                        <span class="text-teal-400 font-bold">>>></span>
                        <span class="text-slate-200 font-semibold" [innerHTML]="highlighter.highlightPython(entry.text)"></span>
                      </div>
                    } @else if (entry.type === 'repl') {
                      <div [class]="entry.isError ? 'text-rose-400' : 'text-cyan-300'" class="pl-4 whitespace-pre-wrap font-medium">
                        <span [innerHTML]="highlighter.highlightPython(entry.text)"></span>
                      </div>
                    }
                  </div>
                }

                <!-- Formatted Stdout with Prism Syntax Highlighting -->
                @if (executionResult()?.stdout) {
                  <div class="space-y-0.5 pt-1">
                    @for (line of getStdoutLines(); track $index) {
                      <div class="flex items-start gap-2.5 font-mono leading-relaxed group">
                        @if (showLineNumbers()) {
                          <span class="select-none text-slate-600 text-[10px] w-6 text-right tabular-nums pt-0.5">
                            {{ $index + 1 }}
                          </span>
                        }
                        <div
                          [class.whitespace-pre-wrap]="wrapOutput()"
                          [class.whitespace-pre]="!wrapOutput()"
                          class="flex-1 text-slate-100"
                          [innerHTML]="highlightOutputLine(line)"></div>
                      </div>
                    }
                  </div>
                }

                <!-- Dedicated Highlighted Error Block & Traceback if Stderr is present -->
                @if (executionResult()?.stderr; as errText) {
                  <div class="mt-3 p-3.5 rounded-xl bg-rose-950/30 border border-rose-500/40 space-y-2.5 animate-in fade-in">
                    <!-- Error Header Banner -->
                    <div class="flex items-center justify-between pb-1 border-b border-rose-800/40 text-xs">
                      <div class="flex items-center gap-1.5 text-rose-400 font-bold">
                        <mat-icon class="text-base text-rose-400">warning</mat-icon>
                        <span>{{ parsedError()?.type || 'Python Execution Error' }}</span>
                      </div>
                      <button
                        type="button"
                        (click)="activeTerminalTab.set('diagnostics')"
                        class="text-[11px] text-teal-400 hover:text-teal-300 font-semibold underline flex items-center gap-0.5">
                        <span>View Diagnostic Guide</span>
                        <mat-icon class="text-xs">arrow_forward</mat-icon>
                      </button>
                    </div>

                    <!-- Highlighted Traceback Lines with Prism formatting -->
                    <div class="font-mono text-xs space-y-1">
                      @for (tLine of getStderrLines(); track $index) {
                        <div class="flex items-start gap-2">
                          @if (showLineNumbers()) {
                            <span class="select-none text-rose-700 text-[10px] w-5 text-right tabular-nums pt-0.5">
                              !
                            </span>
                          }
                          <div
                            [class.whitespace-pre-wrap]="wrapOutput()"
                            [class.whitespace-pre]="!wrapOutput()"
                            class="flex-1"
                            [innerHTML]="highlightTracebackLine(tLine)"></div>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            }

            <!-- Tab 2: Dedicated Error Diagnostics & Remediation Guide -->
            @if (activeTerminalTab() === 'diagnostics') {
              <div
                [class]="isTerminalMaximized() ? 'min-h-[500px] max-h-[640px]' : 'min-h-[340px] max-h-[460px]'"
                class="p-5 overflow-y-auto space-y-4">
                @if (parsedError(); as err) {
                  <!-- Error Summary Card -->
                  <div class="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 space-y-3">
                    <div class="flex items-center justify-between">
                      <span class="px-2.5 py-0.5 rounded-md bg-rose-500/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/40">
                        {{ err.type }}
                      </span>
                      @if (err.line) {
                        <span class="text-xs font-mono font-semibold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                          main.py : Line {{ err.line }}
                        </span>
                      }
                    </div>

                    <div class="text-sm font-bold text-rose-200">
                      {{ err.message }}
                    </div>

                    <!-- Prism-Highlighted Offending Code Snippet -->
                    @if (err.codeSnippet) {
                      <div class="p-3 rounded-lg bg-black/70 border border-rose-900/60 font-mono text-xs text-rose-300">
                        <div class="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-semibold">Failed Line:</div>
                        <div class="flex items-start gap-2">
                          <span class="text-slate-600 select-none">{{ err.line ? err.line : '1' }} |</span>
                          <span [innerHTML]="highlighter.highlightPython(err.codeSnippet)"></span>
                        </div>
                      </div>
                    }
                  </div>

                  <!-- Diagnostic Insights & Suggested Fix -->
                  <div class="space-y-3 text-xs">
                    <div class="p-3.5 rounded-xl bg-[#091217] border border-slate-800 space-y-1">
                      <div class="font-bold text-teal-400 flex items-center gap-1.5">
                        <mat-icon class="text-sm">lightbulb</mat-icon>
                        <span>Why This Error Occurred</span>
                      </div>
                      <p class="text-slate-300 leading-relaxed">{{ err.explanation }}</p>
                    </div>

                    <div class="p-3.5 rounded-xl bg-[#091217] border border-slate-800 space-y-1">
                      <div class="font-bold text-emerald-400 flex items-center gap-1.5">
                        <mat-icon class="text-sm">build</mat-icon>
                        <span>How to Fix It</span>
                      </div>
                      <p class="text-slate-300 leading-relaxed">{{ err.remediation }}</p>
                    </div>

                    <!-- Recommended Python Fix Snippet with Prism Tokenization -->
                    @if (err.suggestedFix) {
                      <div class="p-3.5 rounded-xl bg-[#091217] border border-teal-500/30 space-y-2">
                        <div class="flex items-center justify-between">
                          <div class="font-bold text-teal-400 flex items-center gap-1.5 text-xs">
                            <mat-icon class="text-sm">auto_fix_high</mat-icon>
                            <span>Recommended Python Fix (Prism Highlighted)</span>
                          </div>
                          <button
                            type="button"
                            (click)="applySuggestedFix(err.suggestedFix)"
                            class="px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-bold text-xs flex items-center gap-1 transition-colors border border-teal-500/40">
                            <mat-icon class="text-xs">content_paste_go</mat-icon>
                            <span>Apply Fix to Editor</span>
                          </button>
                        </div>
                        <div class="p-3 rounded-lg bg-[#05080A] border border-slate-800 font-mono text-xs overflow-x-auto text-slate-100">
                          <pre class="m-0 p-0 leading-relaxed font-mono"><code class="language-python" [innerHTML]="highlighter.highlightPython(err.suggestedFix)"></code></pre>
                        </div>
                      </div>
                    }
                  </div>
                } @else {
                  <!-- No Error State -->
                  <div class="text-center py-8 space-y-3">
                    <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
                      <mat-icon class="text-2xl">check_circle</mat-icon>
                    </div>
                    <div class="text-sm font-bold text-slate-200">No Runtime Errors Detected</div>
                    <p class="text-xs text-slate-400 max-w-sm mx-auto">
                      Your script executed cleanly with exit code 0. If you wish to test error diagnostics, click any test trigger below:
                    </p>
                  </div>
                }

                <!-- Test Error Trigger Presets -->
                <div class="pt-3 border-t border-slate-800 space-y-2">
                  <div class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Test Python Exceptions Hands-on:
                  </div>
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      (click)="loadErrorPreset('syntax')"
                      class="p-2 text-left rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors">
                      <div class="font-bold text-rose-400">SyntaxError</div>
                      <div class="text-[10px] text-slate-400">Missing colon or unclosed paren</div>
                    </button>

                    <button
                      type="button"
                      (click)="loadErrorPreset('zerodiv')"
                      class="p-2 text-left rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors">
                      <div class="font-bold text-rose-400">ZeroDivisionError</div>
                      <div class="text-[10px] text-slate-400">Division / 0 at runtime</div>
                    </button>

                    <button
                      type="button"
                      (click)="loadErrorPreset('name')"
                      class="p-2 text-left rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors">
                      <div class="font-bold text-rose-400">NameError</div>
                      <div class="text-[10px] text-slate-400">Undefined variable access</div>
                    </button>

                    <button
                      type="button"
                      (click)="loadErrorPreset('type')"
                      class="p-2 text-left rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 transition-colors">
                      <div class="font-bold text-rose-400">TypeError</div>
                      <div class="text-[10px] text-slate-400">Concatenating str + int</div>
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- Tab 3: Raw Unprocessed Output -->
            @if (activeTerminalTab() === 'raw') {
              <div
                [class]="isTerminalMaximized() ? 'min-h-[500px] max-h-[640px]' : 'min-h-[340px] max-h-[460px]'"
                class="p-4 font-mono text-xs overflow-y-auto text-slate-300">
                <pre class="whitespace-pre-wrap leading-relaxed">{{ getFullRawOutput() || 'No output recorded yet.' }}</pre>
              </div>
            }

            <!-- Tab 4: Virtual Filesystem (VFS) Inspector -->
            @if (activeTerminalTab() === 'vfs') {
              <div
                [class]="isTerminalMaximized() ? 'min-h-[500px] max-h-[640px]' : 'min-h-[340px] max-h-[460px]'"
                class="p-4 space-y-3 overflow-y-auto text-xs font-mono">
                <div class="text-teal-400 font-bold pb-1 border-b border-slate-800 flex items-center gap-1.5">
                  <mat-icon class="text-sm">folder_open</mat-icon>
                  <span>Virtual Filesystem Tree (/home/pyadvance/workspace)</span>
                </div>

                <div class="space-y-1.5">
                  <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-base text-teal-400">description</mat-icon>
                      <span class="text-slate-200">main.py</span>
                    </div>
                    <span class="text-slate-500 text-[11px]">{{ currentCode.length }} bytes</span>
                  </div>

                  <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-base text-slate-400">description</mat-icon>
                      <span class="text-slate-200">sample.txt</span>
                    </div>
                    <span class="text-slate-500 text-[11px]">42 bytes (File I/O seek/tell demo)</span>
                  </div>

                  <div class="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <mat-icon class="text-base text-amber-400">data_object</mat-icon>
                      <span class="text-slate-200">config.json</span>
                    </div>
                    <span class="text-slate-500 text-[11px]">184 bytes (Security suite schema)</span>
                  </div>
                </div>

                <div class="p-3 rounded-lg bg-[#081116] border border-teal-500/20 text-slate-400 text-[11px] leading-relaxed">
                  Files written via <code class="text-teal-300">open("filename", "w")</code> exist inside this persistent in-browser filesystem sandbox.
                </div>
              </div>
            }

            <!-- Bottom Interactive REPL Command Line Bar -->
            <div class="p-2 bg-[#070C0F] border-t border-slate-800/80 flex items-center gap-2 font-mono text-xs">
              <span class="text-teal-400 font-bold pl-2 select-none">&gt;&gt;&gt;</span>
              <input
                type="text"
                [(ngModel)]="replInput"
                (keydown.enter)="onReplSubmit()"
                placeholder="Evaluate quick Python expression (e.g. 2**10, [x*2 for x in range(5)], len(...))"
                class="flex-1 bg-transparent text-slate-200 focus:outline-none text-xs placeholder:text-slate-600 font-mono" />
              <button
                type="button"
                (click)="onReplSubmit()"
                class="px-2.5 py-1 rounded bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-[11px] transition-colors border border-teal-500/30 flex items-center gap-1">
                <span>Eval</span>
                <mat-icon class="text-xs">keyboard_return</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PlaygroundComponent {
  readonly state = inject(LearningStateService);
  readonly runner = inject(PythonRunnerService);
  readonly highlighter = inject(SyntaxHighlighter);

  readonly selectedSnippetKey = signal<string>('diamond-mro');
  readonly isRunning = signal<boolean>(false);
  readonly executionResult = signal<ExecutionResult | null>(null);
  readonly hasCopied = signal<boolean>(false);
  readonly hasCopiedTerminal = signal<boolean>(false);
  readonly showLineNumbers = signal<boolean>(true);
  readonly wrapOutput = signal<boolean>(true);
  readonly isTerminalMaximized = signal<boolean>(false);
  readonly activeTerminalTab = signal<'terminal' | 'diagnostics' | 'raw' | 'vfs'>('terminal');

  // Editor mode: 'edit' (writable with line numbers), 'preview' (Prism syntax view), 'split' (side by side)
  readonly editorMode = signal<'edit' | 'preview' | 'split'>('edit');

  // Terminal interactive state
  replInput = '';
  readonly terminalHistory = signal<TerminalEntry[]>([]);

  // Quiz state
  readonly selectedQuizAnswer = signal<number | null>(null);
  readonly quizFeedback = signal<string | null>(null);
  readonly isQuizCorrect = signal<boolean>(false);

  currentCode = '';

  readonly activeLesson = this.state.activeLesson;

  /**
   * Real-time Prism.js highlighted full code representation
   */
  readonly highlightedFullCode = computed<string>(() => {
    return this.highlighter.highlightPython(this.currentCode);
  });

  // Computed Parsed Error with actionable suggested fixes
  readonly parsedError = computed<ParsedPythonError | null>(() => {
    const res = this.executionResult();
    if (!res || !res.stderr) return null;

    const stderr = res.stderr;

    // Detect error name & message
    const match = stderr.match(/([A-Z][a-zA-Z]*(?:Error|Exception)): (.*)/);
    const errType = match ? match[1] : 'RuntimeError';
    const errMsg = match ? match[2] : stderr.trim();

    // Detect line number: File "...", line X
    const lineMatch = stderr.match(/line (\d+)/i);
    const lineNum = lineMatch ? parseInt(lineMatch[1], 10) : null;

    // Extract code snippet if present in traceback
    let snippet: string | null = null;
    const lines = stderr.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('line ') && i + 1 < lines.length) {
        snippet = lines[i + 1].trim();
        break;
      }
    }

    const { explanation, remediation, suggestedFix } = this.getRemediationForError(errType);

    return {
      type: errType,
      message: errMsg,
      line: lineNum,
      codeSnippet: snippet,
      explanation,
      remediation,
      suggestedFix,
      rawTraceback: stderr
    };
  });

  private presetMap: Record<string, { code: string; lessonId: string; moduleId: string }> = {
    'diamond-mro': {
      moduleId: 'diamond-problem-mro',
      lessonId: 'c3-mro-linearization',
      code: `# The Diamond Problem & C3 MRO (Sondos Saif's slides 42-46)
class A:
    def say(self):
        print("  -> Execution inside A")

class B(A):
    def say(self):
        print("  -> Execution inside B")
        super().say()

class C(A):
    def say(self):
        print("  -> Execution inside C")
        super().say()

class D(B, C):
    def say(self):
        print("  -> Execution inside D")
        super().say()

print("MRO Resolution Chain for D:")
for cls in D.mro():
    print(f"  {cls.__name__}")

print("\\nCalling d = D(); d.say():")
d = D()
d.say()`
    },
    'seek-binary': {
      moduleId: 'file-handling-modes',
      lessonId: 'file-seek-tell',
      code: `# Byte Pointer Navigation with seek() and tell()
with open("sample.txt", "w") as f:
    f.write("Hello, this is a test file.\\nSecond line.\\n")

# 1. Seek from beginning (whence=0)
with open("sample.txt", "r") as f:
    f.seek(7) # Move to index 7 ("this is...")
    print("Offset 7 output:", f.read(11))
    print("Current pointer tell():", f.tell())

# 2. Binary mode end-relative seek (whence=2)
with open("sample.txt", "rb") as f:
    f.seek(-7, 2) # Move 7 bytes before end
    print("End-relative read (-7, 2):", f.read())`
    },
    'composition-suite': {
      moduleId: 'composition-over-inheritance',
      lessonId: 'security-suite-composition',
      code: `# Composition Over Inheritance: SecuritySuite
class PortScanner:
    def scan(self):
        return "Scanning open ports (80, 443, 22)..."

class MalwareScanner:
    def scan(self):
        return "Scanning filesystem for trojans & malware..."

class VulnerabilityScanner:
    def scan(self):
        return "Scanning CVE database for known vulnerabilities..."

class SecuritySuite:
    def __init__(self, tools):
        self.tools = tools  # HAS-A relationship

    def execute_all(self):
        return [tool.scan() for tool in self.tools]

suite = SecuritySuite([PortScanner(), MalwareScanner()])
print("Default scan:", suite.execute_all())

suite.tools[0] = VulnerabilityScanner()
print("\\nAfter component swap:", suite.execute_all())`
    },
    'json-custom': {
      moduleId: 'file-formats-serialization',
      lessonId: 'json-custom-objects',
      code: `import json

class ServerNode:
    def __init__(self, hostname, ip_addr, ports):
        self.hostname = hostname
        self.ip_addr = ip_addr
        self.ports = ports

# Instantiate custom OOP object
node = ServerNode("edge-proxy-01", "10.0.4.15", [80, 443, 9090])

# Custom JSON Serializer via default parameter
json_output = json.dumps(node, default=lambda o: o.__dict__, indent=2)
print("Serialized JSON payload:")
print(json_output)`
    },
    'regex-named': {
      moduleId: 'regular-expressions-re',
      lessonId: 'regex-groups',
      code: `import re

# ISO Date string extraction
date_string = "Incident logged: Date: 2026-10-15 Status: Resolved"

# Named group pattern (?P<key>)
pattern = r"Date:\\s*(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})"
match = re.search(pattern, date_string)

if match:
    print("Extracted Full Match:", match.group(0))
    print("Year :", match.group("year"))
    print("Month:", match.group("month"))
    print("Day  :", match.group("day"))
    print("Full Dict:", match.groupdict())`
    },
    'polymorphism-abc': {
      moduleId: 'polymorphism-interfaces',
      lessonId: 'polymorphic-security-tools',
      code: `from abc import ABC, abstractmethod

class SecurityTool(ABC):
    @abstractmethod
    def analyze(self):
        pass

class PortScanner(SecurityTool):
    def analyze(self):
        return "PortScanner: Scanning open TCP/UDP ports..."

class MalwareScanner(SecurityTool):
    def analyze(self):
        return "MalwareScanner: Scanning file signatures for malware..."

class PacketSniffer(SecurityTool):
    def analyze(self):
        return "PacketSniffer: Sniffing live network packets..."

tools = [PortScanner(), MalwareScanner(), PacketSniffer()]

print("--- Running Unified Security Pipeline ---")
for tool in tools:
    print(tool.analyze())`
    },
    'var-args': {
      moduleId: 'functions-args-signatures',
      lessonId: 'var-length-args',
      code: `def profile(role, *skills, **metadata):
    print("Role  :", role)
    print("Skills (*args tuple):", skills)
    print("Metadata (**kwargs dict):", metadata)

profile("Security Engineer", "Python", "Networking", "Cryptography",
        level="Senior", remote=True, clearance="Level-3")`
    },
    'dunder-rules': {
      moduleId: 'dunder-magic-methods',
      lessonId: 'dunder-methods-deepdive',
      code: `class FirewallRule:
    def __init__(self, rule_id, port, description):
        self.rule_id = rule_id
        self.port = port
        self.description = description

    def __str__(self):
        return f"Firewall Rule #{self.rule_id}: Port {self.port} ({self.description})"

    def __repr__(self):
        return f"FirewallRule(rule_id={self.rule_id!r}, port={self.port}, description={self.description!r})"

    def __eq__(self, other):
        if not isinstance(other, FirewallRule):
            return False
        return self.port == other.port and self.rule_id == other.rule_id

r1 = FirewallRule(1, 443, "Allow HTTPS")
r2 = FirewallRule(1, 443, "Allow HTTPS")

print("str(r1)  :", str(r1))
print("repr(r1) :", repr(r1))
print("r1 == r2 :", r1 == r2)`
    },
    'crypto-hash': {
      moduleId: 'security-crypto-builtins',
      lessonId: 'crypto-builtins',
      code: `import hashlib
import base64

# 1. SHA-256 Hashing
secret_payload = b"admin_pass_2026"
hash_obj = hashlib.sha256(secret_payload)
print("SHA-256 Digest:", hash_obj.hexdigest())

# 2. Base64 Encoding and Decoding
raw_bytes = b"Cybersecurity Invariant Check OK"
encoded_b64 = base64.b64encode(raw_bytes)
print("Base64 Encoded:", encoded_b64.decode('utf-8'))

decoded_bytes = base64.b64decode(encoded_b64)
print("Decoded String:", decoded_bytes.decode('utf-8'))`
    }
  };

  constructor() {
    effect(() => {
      const activeLes = this.state.activeLesson();
      if (activeLes) {
        this.currentCode = activeLes.codeSnippet;
        this.selectedQuizAnswer.set(null);
        this.quizFeedback.set(null);
      }
    });

    // Default snippet load
    this.currentCode = this.presetMap['diamond-mro'].code;
  }

  getCodeLineNumbers(): number[] {
    const count = (this.currentCode.match(/\n/g) || []).length + 1;
    return Array.from({ length: count }, (_, i) => i + 1);
  }

  handleTabKey(event: Event) {
    event.preventDefault();
    const textarea = event.target as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const spaces = '    ';
    this.currentCode = this.currentCode.substring(0, start) + spaces + this.currentCode.substring(end);
    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + 4;
    }, 0);
  }

  onSnippetChange(key: string) {
    this.selectedSnippetKey.set(key);
    const preset = this.presetMap[key];
    if (preset) {
      this.currentCode = preset.code;
      this.state.selectLesson(preset.moduleId, preset.lessonId);
      this.selectedQuizAnswer.set(null);
      this.quizFeedback.set(null);
      this.executionResult.set(null);
    }
  }

  async executeCode() {
    this.isRunning.set(true);
    try {
      const res = await this.runner.runCode(this.currentCode);
      this.executionResult.set(res);

      // Auto-switch to diagnostics tab if error happened
      if (!res.success && res.stderr) {
        this.activeTerminalTab.set('diagnostics');
      } else {
        this.activeTerminalTab.set('terminal');
      }

      // If active lesson exists, mark completed
      const mod = this.state.activeModule();
      const les = this.state.activeLesson();
      if (mod && les) {
        this.state.markLessonCompleted(mod.id, les.id);
      }
    } finally {
      this.isRunning.set(false);
    }
  }

  resetCode() {
    const les = this.state.activeLesson();
    if (les) {
      this.currentCode = les.codeSnippet;
    } else {
      this.currentCode = this.presetMap[this.selectedSnippetKey()].code;
    }
    this.executionResult.set(null);
  }

  copyCode() {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(this.currentCode);
      this.hasCopied.set(true);
      setTimeout(() => this.hasCopied.set(false), 2000);
    }
  }

  copyTerminalOutput() {
    if (typeof navigator !== 'undefined') {
      const text = this.getFullRawOutput();
      navigator.clipboard.writeText(text);
      this.hasCopiedTerminal.set(true);
      setTimeout(() => this.hasCopiedTerminal.set(false), 2000);
    }
  }

  clearTerminal() {
    this.executionResult.set(null);
    this.terminalHistory.set([]);
  }

  toggleLineNumbers() {
    this.showLineNumbers.update(v => !v);
  }

  toggleWrap() {
    this.wrapOutput.update(v => !v);
  }

  toggleMaximize() {
    this.isTerminalMaximized.update(v => !v);
  }

  async onReplSubmit() {
    const expr = this.replInput.trim();
    if (!expr) return;

    this.terminalHistory.update(hist => [
      ...hist,
      { type: 'cmd', text: expr, timestamp: new Date().toLocaleTimeString() }
    ]);
    this.replInput = '';

    const res = await this.runner.evalQuickExpression(expr);
    this.terminalHistory.update(hist => [
      ...hist,
      {
        type: 'repl',
        text: res.output,
        timestamp: new Date().toLocaleTimeString(),
        isError: res.isError
      }
    ]);
  }

  loadErrorPreset(errorType: 'syntax' | 'zerodiv' | 'name' | 'type') {
    switch (errorType) {
      case 'syntax':
        this.currentCode = `# Intentional SyntaxError Demonstration\ndef validate_system(\n    print("Missing closing parenthesis on def")`;
        break;
      case 'zerodiv':
        this.currentCode = `# Intentional ZeroDivisionError Demonstration\ntotal_requests = 1000\nactive_servers = 0\n\n# This operation fails at runtime:\nload_per_server = total_requests / active_servers\nprint("Load:", load_per_server)`;
        break;
      case 'name':
        this.currentCode = `# Intentional NameError Demonstration\nactive_role = "Security Analyst"\n# Accessing undefined identifier 'unregistered_credential'\nprint("Accessing:", unregistered_credential)`;
        break;
      case 'type':
        this.currentCode = `# Intentional TypeError Demonstration\nport_prefix = "PORT_"\nport_number = 8080\n\n# Adding string directly to integer fails in Python:\nendpoint = port_prefix + port_number\nprint(endpoint)`;
        break;
    }
    this.editorMode.set('edit');
    this.executeCode();
  }

  applySuggestedFix(fixCode: string) {
    if (!fixCode) return;
    this.currentCode = fixCode;
    this.editorMode.set('edit');
    this.executeCode();
  }

  getStdoutLines(): string[] {
    const stdout = this.executionResult()?.stdout;
    if (!stdout) return [];
    return stdout.split('\n');
  }

  getStderrLines(): string[] {
    const stderr = this.executionResult()?.stderr;
    if (!stderr) return [];
    return stderr.split('\n');
  }

  getFullRawOutput(): string {
    const res = this.executionResult();
    if (!res) return '';
    const parts: string[] = [];
    if (res.stdout) parts.push(res.stdout);
    if (res.stderr) parts.push(res.stderr);
    return parts.join('\n');
  }

  /**
   * Dedicated syntax highlighting parser for Python console output lines using Prism.js.
   */
  highlightOutputLine(line: string): string {
    if (!line) return '&nbsp;';

    // 1. Python Section Banners e.g. "--- Running Unified Security Pipeline ---"
    if (/^\s*[-=]{3,}.*?[-=]{3,}\s*$/.test(line)) {
      const escaped = this.highlighter.escapeHtml(line);
      return `<span class="text-teal-300 font-bold bg-teal-950/40 px-2 py-0.5 rounded border border-teal-500/20">${escaped}</span>`;
    }

    // 2. Python Object representations <__main__.Class object at 0x...>
    if (/^<[a-zA-Z0-9_.]+\s+object\s+at\s+0x[0-9a-fA-F]+>$/.test(line.trim())) {
      return `<span class="text-violet-300 font-semibold italic">${this.highlighter.escapeHtml(line)}</span>`;
    }

    // 3. Prism.js Python Tokenization for python data structures, dicts, arrays, values, and printouts
    return this.highlighter.highlightPythonLine(line);
  }

  /**
   * Dedicated syntax highlighting parser for Python tracebacks and error messages.
   */
  highlightTracebackLine(line: string): string {
    if (!line) return '&nbsp;';

    const escaped = this.highlighter.escapeHtml(line);

    // 1. Traceback header
    if (line.includes('Traceback (most recent call last):')) {
      return `<span class="text-amber-400 font-bold flex items-center gap-1.5"><span class="text-rose-400 font-extrabold">✕</span> ${escaped}</span>`;
    }

    // 2. File and Line location
    if (/File &quot;.*?&quot;, line \d+/.test(escaped)) {
      return escaped.replace(
        /File &quot;(.*?)&quot;, line (\d+)(.*)/,
        'File "<span class="text-cyan-300 font-semibold">$1</span>", line <span class="text-amber-300 font-extrabold underline">$2</span><span class="text-slate-400">$3</span>'
      );
    }

    // 3. Error pointer line: ^^^
    if (/^\s*\^+/.test(line)) {
      return `<span class="text-rose-400 font-extrabold text-base leading-none select-none">${escaped}</span>`;
    }

    // 4. Exception Name and Description: SyntaxError: ...
    if (/^([A-Z][a-zA-Z]*(?:Error|Exception)): (.*)/.test(line)) {
      return escaped.replace(
        /^([A-Z][a-zA-Z]*(?:Error|Exception)): (.*)/,
        '<span class="text-rose-400 font-extrabold text-sm">$1:</span> <span class="text-rose-200 font-semibold">$2</span>'
      );
    }

    // Code line inside traceback: highlight with Prism!
    const leadingSpaces = line.match(/^\s*/)?.[0] || '';
    const trimmed = line.trim();
    if (trimmed) {
      const codeHtml = this.highlighter.highlightPython(trimmed);
      return `${leadingSpaces}<span class="pl-2 border-l-2 border-rose-500/40">${codeHtml}</span>`;
    }

    return `<span class="text-slate-300 font-medium pl-2">${escaped}</span>`;
  }

  private getRemediationForError(errorType: string): { explanation: string; remediation: string; suggestedFix?: string } {
    switch (errorType) {
      case 'SyntaxError':
        return {
          explanation: 'Python syntax violation. The parser encountered a token structure that breaks Python grammar rules.',
          remediation: 'Check for unclosed parentheses (), unclosed string quotes, or missing colon (:) after def, class, if, for, while statements.',
          suggestedFix: `# Fixed SyntaxError with matching parenthesis and colon:\ndef validate_system():\n    print("System verified cleanly.")\n\nvalidate_system()`
        };
      case 'IndentationError':
        return {
          explanation: 'Mismatched block indentation. Python uses consistent 4-space whitespace rather than braces to define code blocks.',
          remediation: 'Ensure all lines within your function, loop, or class block share identical 4-space indentations.',
          suggestedFix: `# Fixed 4-space indentation:\ndef secure_endpoint():\n    status = "Active"\n    return status\n\nprint(secure_endpoint())`
        };
      case 'NameError':
        return {
          explanation: 'Referenced identifier not found in the local, enclosing, or global namespace.',
          remediation: 'Verify that the variable or function name is declared before being referenced and check for typos or capitalization errors.',
          suggestedFix: `# Declare identifier before accessing:\nunregistered_credential = "SEC_AUTH_KEY_2026"\nprint("Accessing validated token:", unregistered_credential)`
        };
      case 'TypeError':
        return {
          explanation: 'Incompatible data types used in an operation or argument list.',
          remediation: 'Convert data types explicitly before combining (e.g. use str(number) or f"{text}{number}" instead of direct addition).',
          suggestedFix: `# Explicitly convert integer to string:\nport_prefix = "PORT_"\nport_number = 8080\nendpoint = port_prefix + str(port_number)\nprint("Clean endpoint:", endpoint)`
        };
      case 'ZeroDivisionError':
        return {
          explanation: 'Attempted mathematical division or modulo by zero.',
          remediation: 'Add a check like "if divisor != 0:" before executing division or ensure the divisor variable is properly initialized.',
          suggestedFix: `# Guarded division check:\ntotal_requests = 1000\nactive_servers = 0\nif active_servers > 0:\n    load_per_server = total_requests / active_servers\nelse:\n    load_per_server = 0\nprint("Safe Load calculation:", load_per_server)`
        };
      case 'FileNotFoundError':
        return {
          explanation: 'The requested file does not exist in the virtual filesystem.',
          remediation: 'Inspect the VFS Files tab to verify existing files (sample.txt, config.json) or open in write mode ("w") to create it.',
          suggestedFix: `# Create file in write mode before reading:\nwith open("sample.txt", "w") as f:\n    f.write("Cybersecurity Audit Passed\\n")\nwith open("sample.txt", "r") as f:\n    print(f.read())`
        };
      case 'AttributeError':
        return {
          explanation: 'The object does not have the specified attribute or method.',
          remediation: 'Verify the method name spelling or ensure the class definition includes "def method_name(self):".'
        };
      default:
        return {
          explanation: 'Python encountered an unhandled exception during execution.',
          remediation: 'Review the line number in the traceback above, verify variable states, and ensure valid operations.'
        };
    }
  }

  submitQuiz(index: number) {
    this.selectedQuizAnswer.set(index);
    const q = this.activeLesson().quiz;
    if (q) {
      const correct = index === q.answerIndex;
      this.isQuizCorrect.set(correct);
      this.quizFeedback.set(correct ? 'Excellent! You understood this core principle.' : 'Not quite. Check the explanation below.');
    }
  }
}
