import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';

import { ActivityItem } from '../../models/curriculum.model';

@Component({
  selector: 'app-overview',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- Greeting Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div class="text-[12px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1 flex items-center gap-2">
            <span>STUDY SPRINT &middot; SEMESTER ADVANCED OOP</span>
            @if (state.isCloudSyncActive()) {
              <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <mat-icon class="text-xs">cloud_done</mat-icon>
                <span>Synced with Google</span>
              </span>
            }
          </div>
          <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Good morning, {{ state.userDisplayName() }}.
          </h1>
          <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 mt-1">
            Keep the loop tight: write a little, run it, then look closer.
          </p>
        </div>

        <!-- Overall Syllabus Progress Pill -->
        <div class="p-3 px-4 rounded-2xl bg-white dark:bg-[#11232B] border border-slate-200 dark:border-slate-800 shadow-xs flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold text-sm">
            {{ state.overallProgress() }}%
          </div>
          <div>
            <div class="text-xs font-bold text-slate-800 dark:text-slate-200">Syllabus Progress</div>
            <div class="text-[11px] text-slate-400">
              {{ state.totalCompletedStepsCount() }} of {{ state.totalStepsCount() }} curriculum steps completed
            </div>
          </div>
        </div>
      </div>

      <!-- Top Row: Continue Card & This Week Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <!-- Continue Banner Card (8 cols) -->
        <div class="lg:col-span-8 relative overflow-hidden rounded-2xl bg-[#11232B] text-white p-7 sm:p-9 shadow-sm border border-teal-900/40 flex flex-col justify-between group">
          <!-- Background geometric glow / accent -->
          <div class="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none"></div>
          <div class="absolute right-0 bottom-0 opacity-15 pointer-events-none">
            <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
              <circle cx="200" cy="120" r="100" stroke="#14B8A6" stroke-width="1.5" stroke-dasharray="4 4" />
              <circle cx="200" cy="120" r="60" stroke="#14B8A6" stroke-width="2" />
              <path d="M120 180L160 120L240 120" stroke="#14B8A6" stroke-width="2" />
            </svg>
          </div>

          <div class="relative z-10 space-y-3">
            <div class="text-[11px] font-bold text-teal-400 uppercase tracking-widest">
              CONTINUE WHERE YOU LEFT OFF &middot; MODULE 08
            </div>
            <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white max-w-xl">
              The Diamond Problem &amp; C3 MRO
            </h2>
            <p class="text-sm text-slate-300 max-w-lg leading-relaxed">
              Trace how Python resolves method orders across multiple inheritance without duplicate calls using C3 linearization and super().
            </p>
          </div>

          <div class="relative z-10 pt-7 flex flex-col sm:flex-row sm:items-center gap-5">
            <button
              (click)="onContinueLesson()"
              class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-md shadow-orange-500/20 active:scale-95 whitespace-nowrap">
              <span>Continue lesson</span>
              <mat-icon class="text-lg leading-none">arrow_forward</mat-icon>
            </button>

            <!-- Progress bar -->
            <div class="flex-1 max-w-xs">
              <div class="flex items-center justify-between text-xs text-slate-300 mb-1.5 font-medium">
                <span>68% complete</span>
                <span class="text-slate-400">14 min left</span>
              </div>
              <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div class="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400" style="width: 68%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- This Week Metric Card (4 cols) -->
        <div class="lg:col-span-4 rounded-2xl bg-white dark:bg-[#11232B] p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div>
            <div class="text-base font-bold text-slate-900 dark:text-white">This week</div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">A small, consistent practice wins.</p>

            <div class="grid grid-cols-3 gap-3 my-6 pt-2">
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {{ state.practiceTimeHours() }}h
                </div>
                <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">practice time</div>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
                  {{ state.totalLessonsCompleted() }}
                </div>
                <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">lessons done</div>
              </div>
              <div>
                <div class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight text-amber-500">
                  {{ state.dayStreak() }}
                </div>
                <div class="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-1">day streak</div>
              </div>
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 mb-2 font-medium">
              <span>Weekly goal</span>
              <span class="font-bold text-teal-700 dark:text-teal-300 tabular-nums">{{ state.practiceTimeHours() }} / {{ state.targetWeeklyHours() }} hrs</span>
            </div>
            <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                class="h-full rounded-full bg-teal-600 transition-all"
                [style.width.%]="(state.practiceTimeHours() / state.targetWeeklyHours()) * 100"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bilingual Lecture 2 Reference Card (pythonfuncbuiltandopplec2.pdf) -->
      <div class="rounded-2xl bg-gradient-to-r from-[#0D1E25] via-[#112730] to-[#0B171D] text-white p-6 border border-teal-500/30 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-5" dir="rtl">
        <div class="space-y-2 max-w-3xl">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-500/15 border border-amber-400/30 text-amber-300 text-[11px] font-bold">
            <mat-icon class="text-xs leading-none">translate</mat-icon>
            <span>مرجع المحاضرة الثانية الكامل · pythonfuncbuiltandopplec2.pdf</span>
          </div>
          <h3 class="text-lg sm:text-xl font-extrabold text-white">
            جدول المصطلحات الإنجليزية وتعاريفها بالعربية (40 مصطلحاً) + جميع الأكواد البرمجية (22 مثالاً)
          </h3>
          <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
            استعرض جدول المصطلحات المترجم بالكامل (*args, **kwargs, Lambda, OOP, Inheritance, Polymorphism, Diamond MRO, ABC, Composition, Dunder) مع إمكانية تشغيل جميع الأكواد مباشرة أو فتحها كمشروع متكامل داخل محرر بايثون.
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            (click)="state.setView('lec2')"
            class="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm">
            <mat-icon class="text-base leading-none">menu_book</mat-icon>
            <span>فتح جدول المصطلحات والأكواد</span>
          </button>
          <button
            type="button"
            (click)="state.openCodeInRealCoder('01_args_kwargs.py', '')"
            class="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all">
            <mat-icon class="text-base leading-none">terminal</mat-icon>
            <span>فتح المشروع في Real Python Coder</span>
          </button>
        </div>
      </div>

      <!-- Bottom Row: Skill Map & Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Skill Map (7 cols) -->
        <div class="lg:col-span-7 rounded-2xl bg-white dark:bg-[#11232B] p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Your skill map</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Confidence across the Python OOP syllabus</p>
            </div>
            <button
              (click)="state.setView('curriculum')"
              class="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 flex items-center gap-1">
              <span>View curriculum</span>
              <mat-icon class="text-sm leading-none">arrow_forward</mat-icon>
            </button>
          </div>

          <div class="space-y-4 pt-1">
            @for (skill of state.skills(); track skill.name) {
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium text-slate-800 dark:text-slate-200">{{ skill.name }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-slate-500 dark:text-slate-400">{{ skill.level }}</span>
                    <span class="font-semibold text-slate-700 dark:text-slate-300 tabular-nums">&middot; {{ skill.percentage }}%</span>
                  </div>
                </div>
                <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800/80 overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all"
                    [style.background-color]="skill.color"
                    [style.width.%]="skill.percentage"></div>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Recent Activity (5 cols) -->
        <div class="lg:col-span-5 rounded-2xl bg-white dark:bg-[#11232B] p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-base font-bold text-slate-900 dark:text-white">Recent activity</h2>
              <p class="text-xs text-slate-500 dark:text-slate-400">Your latest experiments &amp; milestones</p>
            </div>
            <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <mat-icon class="text-base">more_horiz</mat-icon>
            </button>
          </div>

          <div class="divide-y divide-slate-100 dark:divide-slate-800/80">
            @for (act of state.activities(); track act.id) {
              <button
                type="button"
                (click)="onActivityClick(act)"
                class="w-full text-left py-3.5 first:pt-0 last:pb-0 flex items-center justify-between group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-xl transition-colors">
                <div class="flex items-center gap-3">
                  <div
                    [class]="act.type === 'completed'
                      ? 'w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center'
                      : act.type === 'run'
                      ? 'w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center'
                      : act.type === 'earned'
                      ? 'w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center'
                      : 'w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center'">
                    <mat-icon class="text-base">{{ act.icon }}</mat-icon>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {{ act.title }}
                    </div>
                    <div class="text-[11px] text-slate-400 mt-0.5">{{ act.timestamp }}</div>
                  </div>
                </div>
                <mat-icon class="text-slate-400 text-sm opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                  chevron_right
                </mat-icon>
              </button>
            }
          </div>

          <!-- Quick action box for Surge.sh -->
          <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div class="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <mat-icon class="text-emerald-600 dark:text-emerald-400 text-lg">public</mat-icon>
                <div>
                  <div class="text-xs font-bold text-emerald-900 dark:text-emerald-200">Free Surge.sh Hosting</div>
                  <div class="text-[11px] text-emerald-700 dark:text-emerald-400">Deploy this site to your free custom domain</div>
                </div>
              </div>
              <button
                (click)="state.setView('surge')"
                class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-all whitespace-nowrap">
                Host Site
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Actionable Tip Banner (Matching bottom of Screenshot 1) -->
      <div class="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
        <div class="flex items-center gap-2.5">
          <mat-icon class="text-amber-600 dark:text-amber-400 text-lg">lightbulb</mat-icon>
          <p>
            <strong class="font-semibold">Try the visual loop:</strong> Run <code class="px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900/60 font-mono text-[11px]">f.seek(-7, 2)</code> in the byte memory inspector to see how Python points before the end of the file in binary mode.
          </p>
        </div>
        <button
          (click)="state.setView('simulators')"
          class="text-xs font-semibold text-amber-800 dark:text-amber-300 hover:underline shrink-0 ml-4">
          Open Visualizer &rarr;
        </button>
      </div>
    </div>
  `
})
export class OverviewComponent {
  readonly state = inject(LearningStateService);

  onContinueLesson() {
    this.state.selectLesson('diamond-problem-mro', 'c3-mro-linearization');
    this.state.setView('playground');
  }

  onActivityClick(act: ActivityItem) {
    if (act.title.includes('seek')) {
      this.state.setView('simulators');
    } else if (act.title.includes('MRO')) {
      this.state.selectLesson('diamond-problem-mro', 'c3-mro-linearization');
      this.state.setView('playground');
    } else {
      this.state.setView('playground');
    }
  }
}
