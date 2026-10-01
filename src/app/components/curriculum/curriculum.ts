import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { Module, Lesson } from '../../models/curriculum.model';

@Component({
  selector: 'app-curriculum',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- Header & Filter Bar -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Curriculum
          </h1>
          <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Master Advanced Python concepts, OOP design patterns, and stream memory models.
          </p>
        </div>

        <!-- Filter tabs -->
        <div class="flex items-center gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-xl overflow-x-auto text-xs font-semibold">
          <button
            (click)="setCategory('all')"
            [class]="activeCategory() === 'all'
              ? 'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-all whitespace-nowrap'
              : 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap'">
            All Modules
          </button>
          <button
            (click)="setCategory('oop')"
            [class]="activeCategory() === 'oop'
              ? 'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-all whitespace-nowrap'
              : 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap'">
            OOP &amp; Patterns
          </button>
          <button
            (click)="setCategory('advanced')"
            [class]="activeCategory() === 'advanced'
              ? 'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-all whitespace-nowrap'
              : 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap'">
            Streams &amp; Regex
          </button>
          <button
            (click)="setCategory('core')"
            [class]="activeCategory() === 'core'
              ? 'px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs transition-all whitespace-nowrap'
              : 'px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all whitespace-nowrap'">
            Functions &amp; Data
          </button>
        </div>
      </div>

      <!-- Modules Grid (Faithfully matching Screenshot 2) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        @for (mod of filteredModules(); track mod.id) {
          <button
            type="button"
            (click)="openModule(mod)"
            class="w-full text-left group relative bg-white dark:bg-[#11232B] rounded-2xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-500/50 transition-all cursor-pointer flex flex-col justify-between">
            <div>
              <!-- Top Row: Icon and Status Badge -->
              <div class="flex items-center justify-between mb-4">
                <div class="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-teal-600 dark:text-teal-400 flex items-center justify-center font-mono text-base font-bold group-hover:scale-105 transition-transform">
                  <mat-icon class="text-xl">{{ mod.icon }}</mat-icon>
                </div>

                <!-- Status pill -->
                @if (mod.status === 'in_progress') {
                  <span class="text-[11px] font-semibold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/60 border border-orange-200/60 dark:border-orange-800/40 px-2.5 py-0.5 rounded-full">
                    In progress
                  </span>
                } @else if (mod.status === 'completed') {
                  <span class="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                    Completed
                  </span>
                } @else {
                  <span class="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full">
                    Next up
                  </span>
                }
              </div>

              <!-- Module Title & Subtitle -->
              <h3 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {{ mod.title }}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                {{ mod.subtitle }}
              </p>
            </div>

            <!-- Bottom Progress Track -->
            <div class="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/60 w-full">
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                <span>{{ mod.totalLessons }} lessons</span>
                <span class="font-semibold tabular-nums text-slate-700 dark:text-slate-300">{{ mod.progressPercent }}%</span>
              </div>
              <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  [class]="mod.status === 'completed'
                    ? 'h-full rounded-full bg-emerald-500'
                    : mod.progressPercent > 50
                    ? 'h-full rounded-full bg-teal-500'
                    : 'h-full rounded-full bg-orange-400'"
                  [style.width.%]="mod.progressPercent"></div>
              </div>
            </div>
          </button>
        }
      </div>

      <!-- Selected Module Modal / Detail Drawer -->
      @if (activeModalModule()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div class="bg-white dark:bg-[#11232B] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800">
            <!-- Modal Header -->
            <div class="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-900/40">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <mat-icon class="text-2xl">{{ activeModalModule()?.icon }}</mat-icon>
                </div>
                <div>
                  <div class="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                    MODULE {{ activeModalModule()?.number }}
                  </div>
                  <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">
                    {{ activeModalModule()?.title }}
                  </h2>
                </div>
              </div>
              <button
                (click)="closeModal()"
                class="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <!-- Modal Content: Lessons List -->
            <div class="p-6 overflow-y-auto space-y-4">
              <p class="text-sm text-slate-600 dark:text-slate-300">
                {{ activeModalModule()?.description }}
              </p>

              <div class="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                Available Interactive Lessons
              </div>

              <div class="space-y-3">
                @for (lesson of activeModalModule()?.lessons; track lesson.id) {
                  <div class="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-500/60 dark:hover:border-teal-500/60 bg-slate-50/50 dark:bg-slate-800/30 transition-all space-y-2">
                    <div class="flex items-center justify-between">
                      <div class="font-bold text-sm text-slate-900 dark:text-white">
                        {{ lesson.title }}
                      </div>
                      <span class="text-xs text-slate-400 flex items-center gap-1 font-mono">
                        <mat-icon class="text-sm">schedule</mat-icon>
                        {{ lesson.durationMinutes }}m
                      </span>
                    </div>

                    <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {{ lesson.summary }}
                    </p>

                    <!-- Concept Tags -->
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      @for (c of lesson.concepts; track c) {
                        <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {{ c }}
                        </span>
                      }
                    </div>

                    <div class="pt-3 flex items-center gap-3">
                      <button
                        (click)="startLesson(lesson)"
                        class="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs">
                        <mat-icon class="text-sm">play_arrow</mat-icon>
                        <span>Run in Playground</span>
                      </button>

                      <span class="text-[11px] text-slate-400">
                        Reference: {{ lesson.slideReference }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 flex justify-end">
              <button
                (click)="closeModal()"
                class="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CurriculumComponent {
  readonly state = inject(LearningStateService);
  readonly activeCategory = signal<string>('all');
  readonly activeModalModule = signal<Module | null>(null);

  setCategory(cat: string) {
    this.activeCategory.set(cat);
  }

  filteredModules() {
    const cat = this.activeCategory();
    if (cat === 'all') return this.state.modules();
    return this.state.modules().filter(m => m.category === cat);
  }

  openModule(mod: Module) {
    this.activeModalModule.set(mod);
  }

  closeModal() {
    this.activeModalModule.set(null);
  }

  startLesson(lesson: Lesson) {
    this.closeModal();
    this.state.openLessonInPlayground(lesson);
  }
}
