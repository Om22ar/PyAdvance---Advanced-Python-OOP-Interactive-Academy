import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { SurgeDeployService } from '../../services/surge-deploy.service';

import { FirebaseService } from '../../services/firebase.service';

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

      <!-- Zone 3: Actions (Google Auth, Theme Toggle & Settings with Surge Hosting) -->
      <div class="flex items-center gap-2 sm:gap-3">
        <!-- Google Sign-In Button or User Avatar -->
        @if (firebase.currentUser(); as user) {
          <div class="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
            @if (user.photoURL) {
              <img
                [src]="user.photoURL"
                alt="User avatar"
                referrerpolicy="no-referrer"
                class="w-6 h-6 rounded-full object-cover ring-1 ring-teal-500/40" />
            } @else {
              <div class="w-6 h-6 rounded-full bg-teal-600 text-white font-bold text-[10px] flex items-center justify-center">
                {{ user.displayName ? user.displayName[0] : 'U' }}
              </div>
            }
            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline max-w-[100px] truncate">
              {{ user.displayName || user.email }}
            </span>
            <span class="w-2 h-2 rounded-full bg-emerald-500" title="Cloud Sync Active"></span>
          </div>
        } @else {
          <button
            type="button"
            (click)="firebase.loginWithGoogle()"
            [disabled]="firebase.isLoggingIn()"
            class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all active:scale-95 whitespace-nowrap">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span class="hidden sm:inline">{{ firebase.isLoggingIn() ? 'Connecting...' : 'Sign in with Google' }}</span>
            <span class="sm:hidden">Sign in</span>
          </button>
        }

        <button
          (click)="state.toggleDarkMode()"
          title="Toggle Dark / Light Surface"
          class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <mat-icon class="text-lg leading-none">{{ state.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button
          type="button"
          (click)="state.openSettings()"
          title="Settings &amp; Surge Hosting"
          class="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs">
          <mat-icon class="text-base leading-none text-teal-600 dark:text-teal-400">settings</mat-icon>
          <span>Settings</span>
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
              (click)="navigateAndClose('lec2')"
              [class]="state.activeView() === 'lec2'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/20 text-teal-400'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/40'">
              <mat-icon class="text-amber-400">translate</mat-icon>
              <span>ملخص محاضرة 2 (PDF)</span>
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
              (click)="openSettingsFromDrawer()"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-teal-300 hover:bg-slate-800/40 bg-teal-950/40 border border-teal-500/20">
              <div class="flex items-center gap-3">
                <mat-icon class="text-teal-400">settings</mat-icon>
                <span>Settings &amp; Hosting</span>
              </div>
              <span class="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">Surge</span>
            </button>
          </div>

          <div class="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <div class="font-bold text-white">Advanced Python &amp; OOP</div>
            <div>Lectures by T&#92; Sondos Saif</div>
            <div>Free Surge.sh Hosting in Settings</div>
          </div>
        </div>
      </div>
    }

    <!-- Settings Modal (Houses Environment & Surge.sh Hosting) -->
    @if (state.isSettingsOpen()) {
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
                <p class="text-xs text-slate-500 dark:text-slate-400">Configure Python runtime and Surge.sh hosting</p>
              </div>
            </div>
            <button
              type="button"
              (click)="state.closeSettings()"
              class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
            <!-- Section 0: Google Account & Cloud Sync -->
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-[#0b1419] border border-slate-200 dark:border-slate-800 space-y-3">
              <div class="flex items-center justify-between">
                <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  User Account &amp; Sync
                </div>
                @if (firebase.currentUser()) {
                  <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/20">
                    CLOUD SYNC ON
                  </span>
                }
              </div>

              @if (firebase.currentUser(); as user) {
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    @if (user.photoURL) {
                      <img [src]="user.photoURL" alt="Profile avatar" referrerpolicy="no-referrer" class="w-8 h-8 rounded-full" />
                    } @else {
                      <div class="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                        {{ user.displayName ? user.displayName[0] : 'U' }}
                      </div>
                    }
                    <div>
                      <div class="text-xs font-bold text-slate-900 dark:text-white">{{ user.displayName || 'Google Learner' }}</div>
                      <div class="text-[11px] text-slate-500 truncate max-w-[190px]">{{ user.email }}</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    (click)="firebase.logout()"
                    class="px-2.5 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40 rounded-lg transition-colors">
                    Sign Out
                  </button>
                </div>
              } @else {
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="text-xs text-slate-600 dark:text-slate-300">
                    Sign in to back up your completion progress across devices.
                  </div>
                  <button
                    type="button"
                    (click)="firebase.loginWithGoogle()"
                    [disabled]="firebase.isLoggingIn()"
                    class="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs shrink-0">
                    {{ firebase.isLoggingIn() ? 'Signing in...' : 'Sign in with Google' }}
                  </button>
                </div>
              }
            </div>

            <!-- Section 1: Surge.sh Deployment & Domain Hosting (Moved here) -->
            <div class="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 text-xs font-bold text-emerald-900 dark:text-emerald-200 uppercase tracking-wider">
                  <mat-icon class="text-base text-emerald-600 dark:text-emerald-400">cloud_upload</mat-icon>
                  <span>Surge.sh Domain &amp; Hosting</span>
                </div>
                <span class="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/80 px-2 py-0.5 rounded">
                  FREE HOSTING
                </span>
              </div>

              <p class="text-xs text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
                Publish this academy to your free custom domain or *.surge.sh subdomain with zero configuration.
              </p>

              <div class="flex items-center justify-between text-xs pt-1">
                <span class="text-slate-600 dark:text-slate-400 font-medium">Target URL:</span>
                <span class="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-xs truncate max-w-[210px]">
                  https://{{ surge.getEffectiveDomain() }}
                </span>
              </div>

              <div class="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  (click)="openSurgeHubFromSettings()"
                  class="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all">
                  <mat-icon class="text-sm">open_in_new</mat-icon>
                  <span>Open Surge Hub</span>
                </button>

                <button
                  type="button"
                  (click)="surge.downloadDeployScript()"
                  title="Download deploy-surge.sh bash script"
                  class="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-emerald-300 dark:border-slate-700 text-emerald-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1 transition-all">
                  <mat-icon class="text-sm">download</mat-icon>
                  <span>Deploy Script</span>
                </button>
              </div>
            </div>

            <!-- Section 2: Python Engine -->
            <div class="space-y-3 pt-2">
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

            <!-- Section 3: Editor Formatting -->
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

            <!-- Section 4: Study Target -->
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

            <!-- Section 5: Reset Progress -->
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
              (click)="state.closeSettings()"
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
  readonly firebase = inject(FirebaseService);
  readonly surge = inject(SurgeDeployService);
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly hasReset = signal<boolean>(false);
  readonly searchQuery = signal<string>('');

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }

  openSettingsFromDrawer() {
    this.isMobileMenuOpen.set(false);
    this.state.openSettings();
  }

  openSurgeHubFromSettings() {
    this.state.closeSettings();
    this.state.setView('surge');
  }

  onResetProgress() {
    this.state.resetProgress();
    this.hasReset.set(true);
    setTimeout(() => this.hasReset.set(false), 2500);
  }

  navigateAndClose(view: 'overview' | 'curriculum' | 'playground' | 'simulators' | 'surge' | 'lec2') {
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

