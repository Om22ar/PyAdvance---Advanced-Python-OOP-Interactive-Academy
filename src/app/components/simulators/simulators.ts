import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-simulators',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">
            VISUAL COMPUTATION ENGINES
          </div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Visual Simulators
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Step through memory layouts, C3 MRO diamond graphs, and regular expression tokenizers.
          </p>
        </div>

        <!-- Simulator Tabs -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl text-xs font-semibold overflow-x-auto">
          <button
            (click)="activeTab.set('seek')"
            [class]="activeTab() === 'seek'
              ? 'px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'">
            Byte Seek &amp; Memory Buffer
          </button>
          <button
            (click)="activeTab.set('mro')"
            [class]="activeTab() === 'mro'
              ? 'px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'">
            Diamond MRO Graph
          </button>
          <button
            (click)="activeTab.set('regex')"
            [class]="activeTab() === 'regex'
              ? 'px-3 py-2 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'px-3 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'">
            Regex Lexical Matcher
          </button>
        </div>
      </div>

      <!-- SIMULATOR 1: BYTE SEEK MEMORY MAP (Slides 11-16) -->
      @if (activeTab() === 'seek') {
        <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Memory Buffer &amp; Byte Pointer Inspector</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">Slides 11-18</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Simulate <code class="font-mono text-teal-600 dark:text-teal-400">file.seek(offset, whence)</code> and watch the byte cursor navigate the buffer.
              </p>
            </div>

            <!-- Mode Selector -->
            <div class="flex items-center gap-2 text-xs">
              <span class="font-medium text-slate-600 dark:text-slate-300">File Mode:</span>
              <div class="inline-flex rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
                <button
                  (click)="fileMode.set('r')"
                  [class]="fileMode() === 'r' ? 'px-2.5 py-1 bg-white dark:bg-slate-700 rounded text-slate-900 dark:text-white font-bold shadow-xs' : 'px-2.5 py-1 text-slate-500'">
                  Text ('r')
                </button>
                <button
                  (click)="fileMode.set('rb')"
                  [class]="fileMode() === 'rb' ? 'px-2.5 py-1 bg-teal-600 text-white rounded font-bold shadow-xs' : 'px-2.5 py-1 text-slate-500'">
                  Binary ('rb')
                </button>
              </div>
            </div>
          </div>

          <!-- Quick Slide Presets -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-xs font-semibold text-slate-400">Slide Presets:</span>
            <button
              (click)="applySeekPreset(0, 0)"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-600 transition-colors">
              f.seek(0)
            </button>
            <button
              (click)="applySeekPreset(7, 0)"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-600 transition-colors">
              f.seek(7) [Index 7]
            </button>
            <button
              (click)="applySeekPreset(10, 1)"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-teal-50 dark:hover:bg-teal-950 hover:text-teal-600 transition-colors">
              f.seek(10, 1) [Skip 10 bytes]
            </button>
            <button
              (click)="applySeekPreset(-7, 2, 'rb')"
              class="px-2.5 py-1 rounded-lg text-xs font-mono bg-teal-50 dark:bg-teal-950/80 border border-teal-500/30 text-teal-700 dark:text-teal-300 font-bold hover:bg-teal-100 transition-colors">
              f.seek(-7, 2) ['rb' mode end-seek]
            </button>
          </div>

          <!-- Memory Byte Grid (Matching Slides 11-16) -->
          <div class="space-y-2">
            <div class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Memory Byte Cells (Total Length: {{ fileBytes.length }} bytes)</span>
              <span class="font-mono text-teal-600 dark:text-teal-400 font-semibold">Pointer tell(): {{ currentPointer() }}</span>
            </div>

            <!-- Byte table grid (responsive overflow) -->
            <div class="overflow-x-auto pb-2">
              <div class="inline-flex flex-col border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden font-mono text-xs select-none">
                <!-- Row 1: Line 1 indices 0 to 27 -->
                <div class="flex bg-slate-100 dark:bg-slate-800/80 border-b border-slate-300 dark:border-slate-700">
                  @for (b of fileBytes.slice(0, 28); track b.index) {
                    <button
                      type="button"
                      (click)="setPointer(b.index)"
                      [class]="currentPointer() === b.index
                        ? 'w-7 sm:w-8 h-7 flex items-center justify-center font-bold bg-teal-500 text-slate-950 ring-2 ring-teal-400 cursor-pointer'
                        : 'w-7 sm:w-8 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 last:border-r-0 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer'">
                      {{ b.index }}
                    </button>
                  }
                </div>
                <!-- Row 1 Characters -->
                <div class="flex bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-slate-700">
                  @for (b of fileBytes.slice(0, 28); track b.index) {
                    <button
                      type="button"
                      (click)="setPointer(b.index)"
                      [class]="currentPointer() === b.index
                        ? 'w-7 sm:w-8 h-8 flex items-center justify-center font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 cursor-pointer'
                        : isReadHighlight(b.index)
                        ? 'w-7 sm:w-8 h-8 flex items-center justify-center bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border-r border-slate-200 dark:border-slate-800'
                        : 'w-7 sm:w-8 h-8 flex items-center justify-center text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 last:border-r-0 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'">
                      {{ b.char === '\n' ? '\\n' : b.char }}
                    </button>
                  }
                </div>

                <!-- Row 2: Line 2 indices 28 to 41 -->
                <div class="flex bg-slate-100 dark:bg-slate-800/80 border-b border-slate-300 dark:border-slate-700">
                  @for (b of fileBytes.slice(28, 42); track b.index) {
                    <button
                      type="button"
                      (click)="setPointer(b.index)"
                      [class]="currentPointer() === b.index
                        ? 'w-7 sm:w-8 h-7 flex items-center justify-center font-bold bg-teal-500 text-slate-950 ring-2 ring-teal-400 cursor-pointer'
                        : 'w-7 sm:w-8 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 border-r border-slate-200 dark:border-slate-700 last:border-r-0 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer'">
                      {{ b.index }}
                    </button>
                  }
                </div>
                <!-- Row 2 Characters -->
                <div class="flex bg-white dark:bg-slate-900">
                  @for (b of fileBytes.slice(28, 42); track b.index) {
                    <button
                      type="button"
                      (click)="setPointer(b.index)"
                      [class]="currentPointer() === b.index
                        ? 'w-7 sm:w-8 h-8 flex items-center justify-center font-extrabold bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 cursor-pointer'
                        : isReadHighlight(b.index)
                        ? 'w-7 sm:w-8 h-8 flex items-center justify-center bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold border-r border-slate-200 dark:border-slate-800'
                        : 'w-7 sm:w-8 h-8 flex items-center justify-center text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800 last:border-r-0 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer'">
                      {{ b.char === '\n' ? '\\n' : b.char }}
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Controls: Seek form & simulated output -->
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
            <div class="md:col-span-6 space-y-4">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Control File Pointer
              </div>

              <div class="flex items-center gap-3">
                <div>
                  <label for="seek-offset-input" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Offset (bytes):</label>
                  <input
                    id="seek-offset-input"
                    type="number"
                    [(ngModel)]="seekOffset"
                    class="w-24 px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-teal-500 font-bold" />
                </div>

                <div>
                  <label for="seek-whence-select" class="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Whence Reference:</label>
                  <select
                    id="seek-whence-select"
                    [(ngModel)]="seekWhence"
                    class="px-3 py-2 text-xs font-mono rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 focus:outline-teal-500 font-bold">
                    <option [value]="0">0 = Beginning (SEEK_SET)</option>
                    <option [value]="1">1 = Current Position (SEEK_CUR)</option>
                    <option [value]="2">2 = End of File (SEEK_END)</option>
                  </select>
                </div>

                <div class="pt-5">
                  <button
                    (click)="executeSeek()"
                    class="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs">
                    Execute seek()
                  </button>
                </div>
              </div>

              <!-- Seek Error or Warning Callout -->
              @if (seekError()) {
                <div class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-xs text-rose-800 dark:text-rose-300 flex items-start gap-2">
                  <mat-icon class="text-base text-rose-500 shrink-0">error</mat-icon>
                  <div>
                    <div class="font-bold">io.UnsupportedOperation:</div>
                    <p>{{ seekError() }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Right: Read Output Preview -->
            <div class="md:col-span-6 space-y-2">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Result of f.read() from current tell()</span>
                <button
                  (click)="readAll()"
                  class="text-[11px] text-teal-600 dark:text-teal-400 hover:underline font-medium">
                  Read from pointer
                </button>
              </div>

              <div class="p-4 rounded-xl bg-[#0b1419] border border-slate-800 font-mono text-xs text-emerald-300 min-h-[110px] space-y-1">
                <div class="text-slate-500 text-[11px]"># file.tell() = {{ currentPointer() }}</div>
                <div class="text-white font-semibold">
                  {{ fileMode() === 'rb' ? "b'" + readPreview() + "'" : readPreview() }}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SIMULATOR 2: C3 MRO & DIAMOND INHERITANCE (Slides 42-46) -->
      @if (activeTab() === 'mro') {
        <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>The Diamond Problem &amp; C3 MRO Visualizer</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">Slides 42-47</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Understand how Python avoids calling base class A twice using C3 Superclass Linearization.
              </p>
            </div>

            <button
              (click)="triggerMroAnimation()"
              [disabled]="isMroRunning()"
              class="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all">
              <mat-icon class="text-sm">play_arrow</mat-icon>
              <span>{{ isMroRunning() ? 'Resolving Chain...' : 'Trace MRO Execution Chain' }}</span>
            </button>
          </div>

          <!-- Diamond Architecture SVG Graph & Explanation -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <!-- Left SVG Graphic -->
            <div class="lg:col-span-6 bg-slate-900 rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
              <svg width="340" height="300" viewBox="0 0 340 300" class="select-none">
                <!-- Edges between classes -->
                <!-- A to B and C -->
                <line x1="170" y1="50" x2="80" y2="150" stroke="#334155" stroke-width="3" />
                <line x1="170" y1="50" x2="260" y2="150" stroke="#334155" stroke-width="3" />
                <!-- B and C to D -->
                <line x1="80" y1="150" x2="170" y2="250" stroke="#334155" stroke-width="3" />
                <line x1="260" y1="150" x2="170" y2="250" stroke="#334155" stroke-width="3" />

                <!-- Node A (Top) -->
                <g class="cursor-pointer">
                  <circle
                    cx="170" cy="50" r="32"
                    [attr.fill]="highlightedNode() === 'A' ? '#14B8A6' : '#1E293B'"
                    [attr.stroke]="highlightedNode() === 'A' ? '#5EEAD4' : '#475569'"
                    stroke-width="3" />
                  <text x="170" y="55" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">A</text>
                  <text x="170" y="24" fill="#94A3B8" font-size="10" text-anchor="middle">Base Class</text>
                </g>

                <!-- Node B (Left) -->
                <g class="cursor-pointer">
                  <circle
                    cx="80" cy="150" r="30"
                    [attr.fill]="highlightedNode() === 'B' ? '#14B8A6' : '#1E293B'"
                    [attr.stroke]="highlightedNode() === 'B' ? '#5EEAD4' : '#475569'"
                    stroke-width="3" />
                  <text x="80" y="155" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">B(A)</text>
                </g>

                <!-- Node C (Right) -->
                <g class="cursor-pointer">
                  <circle
                    cx="260" cy="150" r="30"
                    [attr.fill]="highlightedNode() === 'C' ? '#14B8A6' : '#1E293B'"
                    [attr.stroke]="highlightedNode() === 'C' ? '#5EEAD4' : '#475569'"
                    stroke-width="3" />
                  <text x="260" y="155" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">C(A)</text>
                </g>

                <!-- Node D (Bottom Child) -->
                <g class="cursor-pointer">
                  <circle
                    cx="170" cy="250" r="32"
                    [attr.fill]="highlightedNode() === 'D' ? '#F59E0B' : '#1E293B'"
                    [attr.stroke]="highlightedNode() === 'D' ? '#FCD34D' : '#475569'"
                    stroke-width="3" />
                  <text x="170" y="255" fill="white" font-size="16" font-weight="bold" text-anchor="middle" font-family="JetBrains Mono">D(B,C)</text>
                  <text x="170" y="294" fill="#F59E0B" font-size="10" text-anchor="middle">Derived Class</text>
                </g>
              </svg>

              <div class="text-[11px] font-mono text-slate-400 mt-2 text-center">
                MRO: D &rarr; B &rarr; C &rarr; A &rarr; object
              </div>
            </div>

            <!-- Right: MRO Stepper & Explanation -->
            <div class="lg:col-span-6 space-y-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  How C3 Linearization Solves The Problem
                </div>
                <ul class="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                  <li class="flex items-start gap-2">
                    <span class="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                    <span><strong>Left-to-Right Priority:</strong> B is listed before C in <code>class D(B, C)</code>, so B gets priority.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                    <span><strong>No Repeated Calls:</strong> A class appears only once in the MRO list. Shared parent A is deferred until all child branches are searched.</span>
                  </li>
                  <li class="flex items-start gap-2">
                    <span class="w-4 h-4 rounded-full bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">3</span>
                    <span><strong>super() Delegation:</strong> When B executes <code>super().say()</code>, it delegates to C, NOT directly to A!</span>
                  </li>
                </ul>
              </div>

              <!-- Live Execution Log Box -->
              <div class="p-4 rounded-xl bg-[#0b1419] border border-slate-800 font-mono text-xs space-y-1">
                <div class="text-slate-400 text-[11px] font-bold">Execution Output:</div>
                @for (log of mroLogs(); track log) {
                  <div class="text-emerald-400">{{ log }}</div>
                }
                @if (mroLogs().length === 0) {
                  <div class="text-slate-600 italic">Click "Trace MRO Execution Chain" to watch step-by-step resolution.</div>
                }
              </div>
            </div>
          </div>
        </div>
      }

      <!-- SIMULATOR 3: REGEX LIVE MATCHER (Slides 39-46) -->
      @if (activeTab() === 'regex') {
        <div class="bg-white dark:bg-[#11232B] rounded-2xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 class="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Regular Expression Lexical Engine</span>
                <span class="text-xs font-mono px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-300">Slides 39-46</span>
              </h2>
              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Test regex patterns with instant token matching, sub replacements, and named groups.
              </p>
            </div>
          </div>

          <!-- Regex Pattern & Text input -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div class="lg:col-span-6 space-y-4">
              <div>
                <label for="regex-pattern-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Regex Pattern:</label>
                <div class="flex items-center rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 font-mono text-xs">
                  <span class="text-teal-500 font-bold mr-1">r"</span>
                  <input
                    id="regex-pattern-input"
                    type="text"
                    [(ngModel)]="regexPattern"
                    class="bg-transparent text-slate-900 dark:text-white flex-1 focus:outline-none font-bold" />
                  <span class="text-teal-500 font-bold ml-1">"</span>
                </div>
              </div>

              <!-- Pattern presets from slides -->
              <div class="flex flex-wrap gap-1.5 text-xs">
                <span class="text-[11px] text-slate-400 self-center">Presets:</span>
                <button
                  (click)="setRegexPreset(rPhone, textPhone)"
                  class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-600 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  Phone (\\d&#123;3&#125;-\\d&#123;3&#125;-\\d&#123;4&#125;)
                </button>
                <button
                  (click)="setRegexPreset(rEmail, textEmail)"
                  class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-600 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  Email Extractor
                </button>
                <button
                  (click)="setRegexPreset(rDate, textDate)"
                  class="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-teal-50 hover:text-teal-600 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                  Date (?P&lt;year&gt;...)
                </button>
              </div>

              <div>
                <label for="regex-text-input" class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Test String:</label>
                <textarea
                  id="regex-text-input"
                  [(ngModel)]="regexInputText"
                  rows="4"
                  class="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-900 dark:text-white focus:outline-teal-500 resize-none"></textarea>
              </div>
            </div>

            <!-- Matches Breakdown -->
            <div class="lg:col-span-6 space-y-4">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matched Tokens ({{ regexMatches().length }} found)</span>
              </div>

              <div class="p-4 rounded-xl bg-[#0b1419] border border-slate-800 font-mono text-xs min-h-[180px] space-y-3">
                @if (regexMatches().length > 0) {
                  <div class="space-y-2">
                    @for (m of regexMatches(); track m; let i = $index) {
                      <div class="p-2.5 rounded-lg bg-teal-950/60 border border-teal-500/30 text-teal-300 flex items-center justify-between">
                        <span><strong>Match #{{ i + 1 }}:</strong> "{{ m }}"</span>
                        <span class="text-[10px] text-teal-400 font-mono">{{ m.length }} chars</span>
                      </div>
                    }
                  </div>
                } @else {
                  <div class="text-slate-500 italic py-8 text-center">
                    No matches found for current pattern.
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class SimulatorsComponent {
  readonly activeTab = signal<'seek' | 'mro' | 'regex'>('seek');

  // Seek Simulator State
  readonly fileContent = "Hello, this is a test file.\nSecond line.\n";
  readonly fileBytes = Array.from(this.fileContent).map((char, index) => ({ char, index }));
  readonly currentPointer = signal<number>(0);
  readonly fileMode = signal<'r' | 'rb'>('r');
  seekOffset = 0;
  seekWhence = 0;
  readonly seekError = signal<string | null>(null);
  readonly readHighlightRange = signal<{ start: number; end: number } | null>(null);

  // MRO Simulator State
  readonly highlightedNode = signal<'A' | 'B' | 'C' | 'D' | null>(null);
  readonly isMroRunning = signal<boolean>(false);
  readonly mroLogs = signal<string[]>([]);

  // Regex Simulator State
  readonly rPhone = "\\d{3}-\\d{3}-\\d{4}";
  readonly textPhone = "Call me at 987-654-3210 or emergency 800-555-0199.";
  readonly rEmail = "[a-zA-Z0-9._%+-]+@[a-zA-Z]+\\.[a-zA-Z]{2,}";
  readonly textEmail = "Contact team at hello123@gmail.com or admin@python.org.";
  readonly rDate = "Date:\\s*(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})";
  readonly textDate = "Date: 2026-10-15 Incident resolution confirmed.";

  regexPattern = this.rPhone;
  regexInputText = this.textPhone;

  readonly readPreview = computed(() => {
    const ptr = this.currentPointer();
    return this.fileContent.slice(ptr);
  });

  readonly regexMatches = computed(() => {
    try {
      const cleanPat = this.regexPattern.replace(/\(\?P<[^>]+>/g, '(');
      const re = new RegExp(cleanPat, 'g');
      return this.regexInputText.match(re) || [];
    } catch {
      return [];
    }
  });

  setPointer(idx: number) {
    this.currentPointer.set(idx);
    this.seekError.set(null);
  }

  isReadHighlight(index: number): boolean {
    const range = this.readHighlightRange();
    if (!range) return false;
    return index >= range.start && index < range.end;
  }

  applySeekPreset(offset: number, whence: number, mode: 'r' | 'rb' = 'r') {
    this.fileMode.set(mode);
    this.seekOffset = offset;
    this.seekWhence = whence;
    this.executeSeek();
  }

  executeSeek() {
    this.seekError.set(null);
    const mode = this.fileMode();
    const len = this.fileBytes.length; // 42 bytes

    // Check text mode restriction (Slide 14 & 17)
    if (mode === 'r' && this.seekWhence === 2 && this.seekOffset !== 0) {
      this.seekError.set("can't do nonzero end-relative seeks in text mode. Switch to 'rb' mode to enable negative seeks!");
      return;
    }

    let target = 0;
    if (this.seekWhence === 0) {
      target = this.seekOffset;
    } else if (this.seekWhence === 1) {
      target = this.currentPointer() + this.seekOffset;
    } else if (this.seekWhence === 2) {
      target = len + this.seekOffset;
    }

    target = Math.max(0, Math.min(len, target));
    this.currentPointer.set(target);
    this.readHighlightRange.set({ start: target, end: len });
  }

  readAll() {
    const p = this.currentPointer();
    this.readHighlightRange.set({ start: p, end: this.fileBytes.length });
  }

  setRegexPreset(pat: string, text: string) {
    this.regexPattern = pat;
    this.regexInputText = text;
  }

  async triggerMroAnimation() {
    if (this.isMroRunning()) return;
    this.isMroRunning.set(true);
    this.mroLogs.set([]);

    const steps: { node: 'D' | 'B' | 'C' | 'A'; msg: string; delay: number }[] = [
      { node: 'D', msg: '-> 1. Calling d.say(): Execution begins inside D(B, C)', delay: 600 },
      { node: 'D', msg: '   D calls super().say() -> follows MRO to first parent B', delay: 700 },
      { node: 'B', msg: '-> 2. Execution enters B(A).say()', delay: 800 },
      { node: 'B', msg: '   B calls super().say() -> NOTE: MRO of D points to C (not A yet!)', delay: 900 },
      { node: 'C', msg: '-> 3. Execution enters C(A).say()', delay: 800 },
      { node: 'C', msg: '   C calls super().say() -> MRO now points to shared ancestor A', delay: 900 },
      { node: 'A', msg: '-> 4. Execution reaches A.say() [Base Class]', delay: 800 },
      { node: 'A', msg: '   Resolution complete: D -> B -> C -> A -> object. Single call guaranteed!', delay: 600 }
    ];

    for (const step of steps) {
      this.highlightedNode.set(step.node);
      this.mroLogs.update(l => [...l, step.msg]);
      await new Promise(r => setTimeout(r, step.delay));
    }

    this.isMroRunning.set(false);
  }
}
