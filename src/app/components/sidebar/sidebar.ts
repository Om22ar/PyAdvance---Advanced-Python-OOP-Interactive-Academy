import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Desktop Sidebar -->
    <aside class="w-64 bg-[#0F1E24] text-slate-300 flex flex-col shrink-0 border-r border-slate-800/80 min-h-screen select-none transition-all">
      <!-- Brand Header -->
      <div class="p-6 pb-5 border-b border-slate-800/60">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-950 font-bold text-lg shadow-md shadow-teal-500/20">
            <span class="tracking-tighter font-mono">&#123;&nbsp;&#125;</span>
          </div>
          <div>
            <div class="text-white font-bold text-lg tracking-tight flex items-center gap-1.5">
              PyAdvance
              <span class="text-[10px] uppercase font-semibold text-teal-300 bg-teal-950/80 border border-teal-500/30 px-1.5 py-0.5 rounded">OOP</span>
            </div>
            <p class="text-[11px] font-medium text-slate-400 tracking-wider uppercase">LEARN BY MAKING</p>
          </div>
        </div>
      </div>

      <!-- Navigation Links -->
      <div class="flex-1 px-3 py-6 space-y-7 overflow-y-auto">
        <!-- Section: Workspace -->
        <div>
          <div class="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>
          <nav class="space-y-1">
            <button
              (click)="state.setView('overview')"
              [class]="state.activeView() === 'overview'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/15 border-l-4 border-teal-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl leading-none">dashboard</mat-icon>
              <span>Overview</span>
            </button>

            <button
              (click)="state.setView('curriculum')"
              [class]="state.activeView() === 'curriculum'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/15 border-l-4 border-teal-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl leading-none">menu_book</mat-icon>
              <span>Curriculum</span>
              <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">13</span>
            </button>

            <button
              (click)="state.setView('lec2')"
              [class]="state.activeView() === 'lec2'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/15 border-l-4 border-teal-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl leading-none text-amber-400">translate</mat-icon>
              <span>ملخص محاضرة 2 (PDF)</span>
              <span class="ml-auto text-[10px] font-mono font-semibold text-amber-300">AR/EN</span>
            </button>

            <button
              (click)="state.setView('playground')"
              [class]="state.activeView() === 'playground'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/15 border-l-4 border-teal-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl leading-none">code</mat-icon>
              <span>Playground</span>
              <span class="ml-auto flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
            </button>

            <button
              (click)="state.setView('simulators')"
              [class]="state.activeView() === 'simulators'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/15 border-l-4 border-teal-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl leading-none">science</mat-icon>
              <span>Visual Simulators</span>
            </button>

            <button
              (click)="state.setView('coder')"
              [class]="state.activeView() === 'coder'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-500/15 border-l-4 border-teal-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl leading-none text-teal-400">terminal</mat-icon>
              <span>Real Python Coder</span>
              <span class="ml-auto text-[10px] font-mono font-semibold text-teal-300">IDE</span>
            </button>
          </nav>
        </div>

        <!-- Section: Your Path -->
        <div>
          <div class="px-3 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Deployment &amp; Path
          </div>
          <nav class="space-y-1">
            <button
              (click)="state.setView('surge')"
              [class]="state.activeView() === 'surge'
                ? 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-500/20 border-l-4 border-emerald-400 shadow-sm transition-all'
                : 'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/40 transition-all'">
              <mat-icon class="text-xl text-emerald-400 leading-none">cloud_upload</mat-icon>
              <span>Surge.sh Deploy</span>
              <span class="ml-auto text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-1.5 py-0.5 rounded">FREE</span>
            </button>
          </nav>
        </div>

        <!-- Reference badge: Sondos Saif lectures -->
        <div class="px-3 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div class="flex items-center gap-1.5 font-medium text-slate-300">
            <mat-icon class="text-teal-400 text-base">verified</mat-icon>
            <span>Lectures by T&#92; Sondos Saif</span>
          </div>
          <p class="text-[11px] text-slate-400 leading-relaxed">
            Covers File Streams, OOP Scopes, Inheritance, Polymorphism, C3 MRO, and Regex.
          </p>
        </div>
      </div>

      <!-- Bottom Profile Bar -->
      <div class="p-4 border-t border-slate-800/80 bg-[#0A151A] flex items-center justify-between">
        <div class="flex items-center gap-3 min-w-0">
          @if (state.userPhotoUrl(); as photo) {
            <img
              [src]="photo"
              alt="User avatar"
              referrerpolicy="no-referrer"
              class="w-9 h-9 rounded-full object-cover ring-2 ring-teal-500/40 shrink-0" />
          } @else {
            <div class="w-9 h-9 rounded-full bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center ring-2 ring-amber-400/30 shrink-0">
              {{ state.userDisplayName().slice(0, 2).toUpperCase() }}
            </div>
          }
          <div class="min-w-0">
            <div class="text-xs font-semibold text-white truncate flex items-center gap-1">
              <span>{{ state.userDisplayName() }}</span>
              @if (state.isCloudSyncActive()) {
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Cloud Sync Active"></span>
              }
            </div>
            <div class="text-[11px] text-slate-400 flex items-center gap-1">
              <span class="text-amber-400 font-bold">&#9733;</span>
              <span>{{ state.dayStreak() }} day streak</span>
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1 shrink-0">
          <button
            type="button"
            (click)="state.openSettings()"
            title="Open Settings &amp; Hosting"
            class="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
            <mat-icon class="text-lg leading-none">settings</mat-icon>
          </button>
          <button
            type="button"
            (click)="state.toggleDarkMode()"
            title="Toggle light / dark surface"
            class="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
            <mat-icon class="text-lg leading-none">{{ state.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
        </div>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  readonly state = inject(LearningStateService);
}

