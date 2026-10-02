import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule, FormsModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="h-16 px-4 sm:px-8 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0D181E]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between transition-colors">
      <!-- Zone 1: Breadcrumb / Brand Zone -->
      <div class="flex items-center gap-3">
        <!-- Mobile Drawer Toggle -->
        <button
          (click)="toggleMobileMenu()"
          class="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <mat-icon>{{ isMobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>

        <div class="flex items-center gap-2 text-xs sm:text-sm font-semibold">
          <span class="text-teal-600 dark:text-teal-400 font-bold">PyAdvance</span>
          <span class="text-slate-300 dark:text-slate-600">/</span>
          <span class="text-slate-800 dark:text-slate-200 capitalize font-medium">
            {{ state.activeView() }}
          </span>
        </div>
      </div>

      <!-- Zone 2: Search Affordance & Quick Filters -->
      <div class="hidden md:flex items-center gap-3 max-w-sm w-full mx-4">
        <div class="relative w-full flex items-center">
          <mat-icon class="absolute left-3 text-slate-400 text-sm leading-none pointer-events-none">search</mat-icon>
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="onSearchInput($event)"
            placeholder="Search lessons, MRO, seek, regex..."
            class="w-full pl-9 pr-8 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-teal-500 transition-colors" />
          <kbd class="absolute right-2.5 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded">
            /
          </kbd>
        </div>
      </div>

      <!-- Zone 3: Actions (Deploy to Surge, Theme & Profile, Settings) -->
      <div class="flex items-center gap-2 sm:gap-3">
        <button
          (click)="state.setView('surge')"
          class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 whitespace-nowrap">
          <mat-icon class="text-sm leading-none">cloud_upload</mat-icon>
          <span class="hidden sm:inline">Deploy to Surge.sh</span>
          <span class="sm:hidden">Deploy</span>
        </button>

        <button
          (click)="state.toggleDarkMode()"
          title="Toggle Dark / Light Surface"
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <mat-icon class="text-lg leading-none">{{ state.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button
          type="button"
          (click)="openSettings()"
          title="Platform &amp; Environment Settings"
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <mat-icon class="text-lg leading-none">settings</mat-icon>
        </button>
      </div>
    </header>

    <!-- Mobile Drawer Menu -->
    @if (isMobileMenuOpen()) {
      <div class="lg:hidden fixed inset-0 top-16 z-40 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
        <div class="w-72 bg-[#0F1E24] text-slate-200 h-full p-5 space-y-6 shadow-2xl border-r border-slate-800">
          <div class="space-y-1">
            <button
              (click)="navigateAndClose('overview')"
              [class]="state.activeView() === 'overview'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/20 text-teal-400'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40'">
              <mat-icon>dashboard</mat-icon>
              <span>Overview</span>
            </button>

            <button
              (click)="navigateAndClose('curriculum')"
              [class]="state.activeView() === 'curriculum'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/20 text-teal-400'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40'">
              <mat-icon>menu_book</mat-icon>
              <span>Curriculum</span>
            </button>

            <button
              (click)="navigateAndClose('playground')"
              [class]="state.activeView() === 'playground'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/20 text-teal-400'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40'">
              <mat-icon>code</mat-icon>
              <span>Playground</span>
            </button>

            <button
              (click)="navigateAndClose('simulators')"
              [class]="state.activeView() === 'simulators'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/20 text-teal-400'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40'">
              <mat-icon>science</mat-icon>
              <span>Visual Simulators</span>
            </button>

            <button
              (click)="navigateAndClose('surge')"
              [class]="state.activeView() === 'surge'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500/20 text-emerald-400'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40'">
              <mat-icon class="text-emerald-400">cloud_upload</mat-icon>
              <span>Surge.sh Deploy</span>
            </button>

            <button
              (click)="openSettings(); isMobileMenuOpen.set(false)"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
          </div>

          <div class="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div class="font-bold text-white">Advanced Python &amp; OOP</div>
            <div>Lectures by T&#92; Sondos Saif</div>
            <div>Free Surge.sh Hosting Built-in</div>
          </div>
        </div>
      </div>
    }

    <!-- Settings Modal -->
    @if (isSettingsOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
        <div class="bg-white dark:bg-[#11232B] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col">
          <!-- Modal Header -->
          <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/40">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                <mat-icon>settings</mat-icon>
              </div>
              <div>
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Settings &amp; Environment</h3>
                <p class="text-xs text-slate-500 dark:text-slate-400">Customize Python runtime and learning preferences</p>
              </div>
            </div>
            <button
              type="button"
              (click)="closeSettings()"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
            <!-- Section 1: Python Engine -->
            <div class="space-y-3">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Python Runtime Engine
              </div>
              <div class="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  (click)="state.preferredEngine.set('wasm')"
                  [class]="state.preferredEngine() === 'wasm'
                    ? 'p-3 rounded-xl border-2 border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-left transition-all'
                    : 'p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left transition-all'">
                  <div class="text-xs font-bold text-slate-900 dark:text-white">CPython 3.12 (WASM)</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">True Pyodide WebAssembly</div>
                </button>
                <button
                  type="button"
                  (click)="state.preferredEngine.set('instant')"
                  [class]="state.preferredEngine() === 'instant'
                    ? 'p-3 rounded-xl border-2 border-teal-500 bg-teal-50/50 dark:bg-teal-950/30 text-left transition-all'
                    : 'p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 text-left transition-all'">
                  <div class="text-xs font-bold text-slate-900 dark:text-white">Instant Sandbox</div>
                  <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Zero-latency simulator</div>
                </button>
              </div>
            </div>

            <!-- Section 2: Editor Formatting -->
            <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Code Editor Preferences
              </div>
              <div class="flex items-center justify-between">
                <label for="font-size-select" class="text-xs font-medium text-slate-700 dark:text-slate-300">Editor Font Size</label>
                <select
                  id="font-size-select"
                  [ngModel]="state.editorFontSize()"
                  (ngModelChange)="state.editorFontSize.set($event)"
                  class="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                  <option [value]="12">12px (Compact)</option>
                  <option [value]="13">13px (Default)</option>
                  <option [value]="14">14px (Medium)</option>
                  <option [value]="16">16px (Large)</option>
                </select>
              </div>

              <div class="flex items-center justify-between">
                <label for="tab-size-select" class="text-xs font-medium text-slate-700 dark:text-slate-300">Tab Indentation</label>
                <select
                  id="tab-size-select"
                  [ngModel]="state.tabSize()"
                  (ngModelChange)="state.tabSize.set($event)"
                  class="px-3 py-1.5 text-xs rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono">
                  <option [value]="4">4 Spaces (PEP 8 standard)</option>
                  <option [value]="2">2 Spaces</option>
                </select>
              </div>
            </div>

            <!-- Section 3: Study Target -->
            <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Weekly Target
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs font-medium text-slate-700 dark:text-slate-300">Target Hours Per Week</span>
                <span class="text-xs font-bold text-teal-600 dark:text-teal-400 font-mono">{{ state.targetWeeklyHours() }} hrs</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="0.5"
                [ngModel]="state.targetWeeklyHours()"
                (ngModelChange)="state.targetWeeklyHours.set($event)"
                class="w-full accent-teal-500" />
            </div>

            <!-- Section 4: Reset Progress -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <div>
                <div class="text-xs font-semibold text-slate-800 dark:text-slate-200">Reset Local Progress</div>
                <div class="text-[11px] text-slate-400">Restore syllabus milestones and activity</div>
              </div>
              <button
                type="button"
                (click)="onResetProgress()"
                class="px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/50 rounded-xl transition-colors">
                {{ hasReset() ? 'Reset Completed' : 'Reset Progress' }}
              </button>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex justify-end">
            <button
              type="button"
              (click)="closeSettings()"
              class="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-all">
              Done
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class TopbarComponent {
  readonly state = inject(LearningStateService);
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly isSettingsOpen = signal<boolean>(false);
  readonly hasReset = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  openSettings() {
    this.isSettingsOpen.set(true);
    this.hasReset.set(false);
  }

  closeSettings() {
    this.isSettingsOpen.set(false);
  }

  onResetProgress() {
    this.state.resetProgress();
    this.hasReset.set(true);
    setTimeout(() => this.hasReset.set(false), 2500);
  }

  navigateAndClose(view: 'overview' | 'curriculum' | 'playground' | 'simulators' | 'surge') {
    this.state.setView(view);
    this.isMobileMenuOpen.set(false);
  }

  onSearchInput(query: string) {
    this.searchQuery.set(query);
    this.state.searchQuery.set(query);
    if (query.trim().length > 1 && this.state.activeView() !== 'curriculum') {
      this.state.setView('curriculum');
    }
  }
}
