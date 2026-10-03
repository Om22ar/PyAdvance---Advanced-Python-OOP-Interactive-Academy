import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LearningStateService } from '../../services/learning-state.service';
import { PythonRunnerService } from '../../services/python-runner.service';
import {
  LEC2_CODE_SECTIONS,
  LEC2_TERMS_DATA,
  Lec2CodeExample,
  Lec2TermItem,
} from '../../data/lec2-pdf.data';

@Component({
  selector: 'app-study-reader',
  imports: [CommonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-8 max-w-7xl mx-auto">
      <!-- ================= TOP HERO BANNER (pythonfuncbuiltandopplec2.pdf) ================= -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2026] via-[#0f2930] to-[#081519] text-white p-6 sm:p-9 border border-teal-500/30 shadow-lg">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-3 max-w-3xl" dir="rtl">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-950/90 border border-teal-500/40 text-teal-300 text-xs font-bold">
              <mat-icon class="text-sm leading-none">menu_book</mat-icon>
              <span>المصدر المرجعي الكامل: pythonfuncbuiltandopplec2.pdf</span>
            </div>

            <h1 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-snug">
              حصر وتأطير المصطلحات الإنجليزية وترجمتها للعربية + كافة أمثلة الأكواد البرمجية
            </h1>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
              بناءً على ملف المصدر <code class="font-mono text-teal-300 bg-black/30 px-1.5 py-0.5 rounded">pythonfuncbuiltandopplec2.pdf</code>، يضم هذا الدليل المرجعي التفاعلي جدول المصطلحات الكامل (40 مصطلحاً وتعريفاً) مع جميع الأكواد البرمجية الواردة في المحاضرة (22 مثالاً قابلاً للتشغيل الفوري أو الفتح داخل محرر بايثون).
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              (click)="openFullProjectInIde()"
              class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95">
              <mat-icon class="text-base leading-none">terminal</mat-icon>
              <span>فتح مشروع المحاضرة في Real Python Coder</span>
            </button>

            <button
              type="button"
              (click)="runAllExamples()"
              [disabled]="isRunningBatch()"
              class="px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-teal-300 border border-teal-500/30 font-semibold text-xs flex items-center gap-2 transition-all">
              <mat-icon class="text-base leading-none">{{ isRunningBatch() ? 'hourglass_top' : 'play_circle' }}</mat-icon>
              <span>{{ isRunningBatch() ? 'جاري تشغيل الأكواد...' : 'تشغيل جميع الأمثلة (22)' }}</span>
            </button>
          </div>
        </div>

        <!-- Quick Metrics Strip -->
        <div class="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs" dir="rtl">
          <div class="bg-black/25 rounded-xl p-3 border border-white/5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-teal-500/15 text-teal-300 flex items-center justify-center shrink-0">
              <mat-icon>translate</mat-icon>
            </div>
            <div>
              <div class="text-lg font-extrabold text-white tabular-nums">40 مصطلحاً</div>
              <div class="text-[11px] text-slate-400">مترجماً ومشروحاً بالعربية</div>
            </div>
          </div>

          <div class="bg-black/25 rounded-xl p-3 border border-white/5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-300 flex items-center justify-center shrink-0">
              <mat-icon>code</mat-icon>
            </div>
            <div>
              <div class="text-lg font-extrabold text-white tabular-nums">22 كوداً برمجياً</div>
              <div class="text-[11px] text-slate-400">قابلاً للتشغيل المباشر</div>
            </div>
          </div>

          <div class="bg-black/25 rounded-xl p-3 border border-white/5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-300 flex items-center justify-center shrink-0">
              <mat-icon>layers</mat-icon>
            </div>
            <div>
              <div class="text-lg font-extrabold text-white tabular-nums">6 محاور رئيسية</div>
              <div class="text-[11px] text-slate-400">*args، Lambda، OOP، MRO، ABC</div>
            </div>
          </div>

          <div class="bg-black/25 rounded-xl p-3 border border-white/5 flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-sky-500/15 text-sky-300 flex items-center justify-center shrink-0">
              <mat-icon>verified</mat-icon>
            </div>
            <div>
              <div class="text-sm font-extrabold text-white truncate">pythonfuncbuiltandopplec2</div>
              <div class="text-[11px] text-slate-400">تطابق تام 100% مع المصدر</div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= VIEW MODE SWITCHER ================= -->
      <div class="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#11232B] p-3 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs" dir="rtl">
        <div class="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-bold">
          <button
            type="button"
            (click)="activeSectionTab.set('both')"
            [class]="activeSectionTab() === 'both'
              ? 'px-3.5 py-2 rounded-lg bg-teal-600 text-white shadow-xs transition-all'
              : 'px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all'">
            عرض الكل (المصطلحات + الأكواد)
          </button>
          <button
            type="button"
            (click)="activeSectionTab.set('terms')"
            [class]="activeSectionTab() === 'terms'
              ? 'px-3.5 py-2 rounded-lg bg-teal-600 text-white shadow-xs transition-all'
              : 'px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all'">
            أولاً: جدول المصطلحات (40)
          </button>
          <button
            type="button"
            (click)="activeSectionTab.set('code')"
            [class]="activeSectionTab() === 'code'
              ? 'px-3.5 py-2 rounded-lg bg-teal-600 text-white shadow-xs transition-all'
              : 'px-3.5 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all'">
            ثانياً: الأكواد البرمجية (22)
          </button>
        </div>

        <!-- Search Input across Terms & Code -->
        <div class="relative flex-1 max-w-md min-w-[240px]">
          <mat-icon class="text-base text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">search</mat-icon>
          <input
            type="text"
            aria-label="ابحث في المصطلحات الإنجليزية أو العربية أو الأكواد"
            [value]="searchFilter()"
            (input)="onSearchInput($event)"
            placeholder="ابحث عن مصطلح (مثل MRO, Polymorphism, *args) أو معنى بالعربية..."
            class="w-full pr-9 pl-8 py-2 rounded-xl bg-slate-50 dark:bg-[#09141A] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500" />
          @if (searchFilter()) {
            <button
              type="button"
              (click)="searchFilter.set('')"
              class="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <mat-icon class="text-sm leading-none">close</mat-icon>
            </button>
          }
        </div>
      </div>

      <!-- ================= أولاً: جدول المصطلحات الإنجليزية وتعاريفها باللغة العربية ================= -->
      @if (activeSectionTab() === 'both' || activeSectionTab() === 'terms') {
        <section class="bg-white dark:bg-[#11232B] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
          <!-- Section Header -->
          <div class="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/60 dark:bg-slate-900/40" dir="rtl">
            <div class="space-y-1">
              <div class="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <mat-icon class="text-base leading-none">table_chart</mat-icon>
                <span>القسم الأول — Terminology &amp; Definitions</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                أولاً: جدول المصطلحات الإنجليزية وتعاريفها باللغة العربية
              </h2>
            </div>

            <!-- Category Filter Pills -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                (click)="selectedTermCategory.set('all')"
                [class]="selectedTermCategory() === 'all'
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/60'">
                الكل ({{ terms.length }})
              </button>
              <button
                type="button"
                (click)="selectedTermCategory.set('functions')"
                [class]="selectedTermCategory() === 'functions'
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/60'">
                الدوال والوسائط
              </button>
              <button
                type="button"
                (click)="selectedTermCategory.set('oop-core')"
                [class]="selectedTermCategory() === 'oop-core'
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/60'">
                أساسيات OOP
              </button>
              <button
                type="button"
                (click)="selectedTermCategory.set('inheritance')"
                [class]="selectedTermCategory() === 'inheritance'
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/60'">
                الوراثة و super()
              </button>
              <button
                type="button"
                (click)="selectedTermCategory.set('polymorphism-mro')"
                [class]="selectedTermCategory() === 'polymorphism-mro'
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/60'">
                التعددية والماسة MRO
              </button>
              <button
                type="button"
                (click)="selectedTermCategory.set('composition-dunder')"
                [class]="selectedTermCategory() === 'composition-dunder'
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300/60'">
                الفئات المجردة والتركيب و Dunder
              </button>
            </div>
          </div>

          <!-- Bilingual Terminology Table -->
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-100/80 dark:bg-[#0B171D] border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <th class="py-3.5 px-4 w-12 text-center">#</th>
                  <th class="py-3.5 px-5 w-5/12">المصطلح بالإنجليزية (English Term)</th>
                  <th class="py-3.5 px-5 text-right" dir="rtl">الترجمة والمعنى بالعربية</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200/70 dark:divide-slate-800/70 text-xs sm:text-sm">
                @for (item of filteredTerms(); track item.id) {
                  <tr class="hover:bg-teal-50/40 dark:hover:bg-teal-950/20 transition-colors">
                    <td class="py-3.5 px-4 text-center font-mono text-xs text-slate-400 tabular-nums">
                      {{ item.id }}
                    </td>
                    <td class="py-3.5 px-5 font-mono font-bold text-slate-900 dark:text-teal-300 align-top">
                      {{ item.englishTerm }}
                    </td>
                    <td class="py-3.5 px-5 text-right text-slate-700 dark:text-slate-200 leading-relaxed align-top" dir="rtl">
                      <strong class="text-slate-950 dark:text-white font-extrabold">{{ item.arabicTitle }}:</strong>
                      <span class="mr-1">{{ item.arabicDefinition }}</span>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="py-8 text-center text-slate-400" dir="rtl">
                      لا توجد مصطلحات مطابقة لبحثك الحالي.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </section>
      }

      <!-- ================= ثانياً: جميع الأكواد البرمجية الواردة في المصدر ================= -->
      @if (activeSectionTab() === 'both' || activeSectionTab() === 'code') {
        <div class="space-y-8">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3" dir="rtl">
            <div>
              <div class="flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
                <mat-icon class="text-base leading-none">terminal</mat-icon>
                <span>القسم الثاني — Complete Source Code Examples</span>
              </div>
              <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">
                ثانياً: جميع الأكواد البرمجية الواردة في المصدر
              </h2>
            </div>

            <!-- Section Quick Jump Pills -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs">
              <button
                type="button"
                (click)="selectedCodeSection.set(0)"
                [class]="selectedCodeSection() === 0
                  ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                  : 'px-3 py-1.5 rounded-lg bg-white dark:bg-[#11232B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'">
                كل الأقسام (6)
              </button>
              @for (sec of codeSections; track sec.sectionNumber) {
                <button
                  type="button"
                  (click)="selectedCodeSection.set(sec.sectionNumber)"
                  [class]="selectedCodeSection() === sec.sectionNumber
                    ? 'px-3 py-1.5 rounded-lg bg-teal-600 text-white font-bold'
                    : 'px-3 py-1.5 rounded-lg bg-white dark:bg-[#11232B] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'">
                  القسم {{ sec.sectionNumber }}
                </button>
              }
            </div>
          </div>

          @for (section of filteredCodeSections(); track section.sectionNumber) {
            <section class="bg-white dark:bg-[#11232B] rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden">
              <!-- Section Banner -->
              <div class="px-6 py-4 bg-slate-50/80 dark:bg-[#0B171D] border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3" dir="rtl">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <mat-icon>{{ section.icon }}</mat-icon>
                  </div>
                  <div>
                    <h3 class="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                      {{ section.titleAr }}
                    </h3>
                    <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {{ section.titleEn }} · {{ section.examples.length }} أمثلة برمجية
                    </p>
                  </div>
                </div>
              </div>

              <!-- Examples Grid -->
              <div class="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                @for (ex of section.examples; track ex.id) {
                  <div class="rounded-2xl bg-[#081015] border border-slate-800 flex flex-col justify-between overflow-hidden shadow-md">
                    <div>
                      <!-- Example Top Header -->
                      <div class="px-4 py-3 bg-[#050A0E] border-b border-slate-800/90 flex items-center justify-between gap-2" dir="rtl">
                        <div class="flex items-center gap-2 min-w-0">
                          <span class="w-2.5 h-2.5 rounded-full bg-teal-400 shrink-0"></span>
                          <h4 class="text-xs sm:text-sm font-bold text-slate-100 truncate" [title]="ex.titleAr">
                            {{ ex.titleAr }}
                          </h4>
                        </div>
                        <span class="text-[11px] font-mono text-teal-400 bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded shrink-0" dir="ltr">
                          {{ ex.fileName }}
                        </span>
                      </div>

                      <!-- Python Code Pre -->
                      <div class="p-4 overflow-x-auto bg-[#081015]" dir="ltr">
                        <pre class="text-xs sm:text-[13px] font-mono text-slate-100 leading-relaxed select-all">{{ ex.code }}</pre>
                      </div>
                    </div>

                    <!-- Output & Action Bar -->
                    <div class="border-t border-slate-800/90 bg-[#050A0E] p-3 space-y-2.5">
                      @if (executionOutputs()[ex.id]; as out) {
                        <div class="p-2.5 rounded-xl bg-[#03070A] border border-emerald-500/30 font-mono text-xs space-y-1" dir="ltr">
                          <div class="flex items-center justify-between text-[10px] text-emerald-400 font-semibold">
                            <span>LIVE PYTHON OUTPUT ({{ out.engine }})</span>
                            <span>{{ out.durationMs }}ms</span>
                          </div>
                          <pre class="text-emerald-300 whitespace-pre-wrap">{{ out.output }}</pre>
                        </div>
                      } @else {
                        <div class="px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400" dir="ltr">
                          <span class="truncate">Expected: {{ ex.expectedOutput.replaceAll('\n', ' | ') }}</span>
                        </div>
                      }

                      <div class="flex flex-wrap items-center justify-between gap-2 pt-0.5" dir="rtl">
                        <div class="flex items-center gap-1.5">
                          <button
                            type="button"
                            (click)="runSingleExample(ex)"
                            [disabled]="runningExampleId() === ex.id"
                            class="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all">
                            <mat-icon class="text-sm leading-none">{{ runningExampleId() === ex.id ? 'hourglass_top' : 'play_arrow' }}</mat-icon>
                            <span>{{ runningExampleId() === ex.id ? 'جاري التشغيل...' : 'تشغيل الكود' }}</span>
                          </button>

                          <button
                            type="button"
                            (click)="openExampleInCoder(ex)"
                            class="px-3 py-1.5 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 border border-teal-500/30 font-semibold text-xs flex items-center gap-1 transition-all">
                            <mat-icon class="text-sm leading-none">terminal</mat-icon>
                            <span>فتح في Real Python Coder</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          (click)="copyCode(ex)"
                          class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 transition-colors">
                          <mat-icon class="text-xs leading-none">{{ copiedId() === ex.id ? 'check' : 'content_copy' }}</mat-icon>
                          <span>{{ copiedId() === ex.id ? 'تم النسخ!' : 'نسخ' }}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>
          }
        </div>
      }
    </div>
  `,
})
export class StudyReaderComponent {
  readonly state = inject(LearningStateService);
  readonly runner = inject(PythonRunnerService);

  readonly terms: Lec2TermItem[] = LEC2_TERMS_DATA;
  readonly codeSections = LEC2_CODE_SECTIONS;

  readonly activeSectionTab = signal<'both' | 'terms' | 'code'>('both');
  readonly selectedTermCategory = signal<'all' | Lec2TermItem['category']>('all');
  readonly selectedCodeSection = signal<number>(0);
  readonly searchFilter = signal<string>('');

  readonly runningExampleId = signal<string | null>(null);
  readonly isRunningBatch = signal<boolean>(false);
  readonly copiedId = signal<string | null>(null);
  readonly executionOutputs = signal<
    Record<string, { output: string; durationMs: number; engine: string }>
  >({});

  readonly filteredTerms = computed<Lec2TermItem[]>(() => {
    const cat = this.selectedTermCategory();
    const q = this.searchFilter().trim().toLowerCase();
    return this.terms.filter((t) => {
      if (cat !== 'all' && t.category !== cat) return false;
      if (!q) return true;
      return (
        t.englishTerm.toLowerCase().includes(q) ||
        t.arabicTitle.toLowerCase().includes(q) ||
        t.arabicDefinition.toLowerCase().includes(q)
      );
    });
  });

  readonly filteredCodeSections = computed(() => {
    const secNum = this.selectedCodeSection();
    const q = this.searchFilter().trim().toLowerCase();

    return this.codeSections
      .filter((sec) => secNum === 0 || sec.sectionNumber === secNum)
      .map((sec) => {
        if (!q) return sec;
        const matchingExamples = sec.examples.filter(
          (ex) =>
            ex.titleAr.toLowerCase().includes(q) ||
            ex.code.toLowerCase().includes(q) ||
            ex.fileName.toLowerCase().includes(q),
        );
        return { ...sec, examples: matchingExamples };
      })
      .filter((sec) => sec.examples.length > 0);
  });

  onSearchInput(event: Event) {
    this.searchFilter.set((event.target as HTMLInputElement).value);
  }

  async runSingleExample(ex: Lec2CodeExample) {
    this.runningExampleId.set(ex.id);
    try {
      const res = await this.runner.runCode(ex.code);
      const output = (res.stdout || res.stderr || ex.expectedOutput).trim();
      this.executionOutputs.update((prev) => ({
        ...prev,
        [ex.id]: {
          output,
          durationMs: res.durationMs,
          engine: res.engine,
        },
      }));
    } finally {
      this.runningExampleId.set(null);
    }
  }

  async runAllExamples() {
    if (this.isRunningBatch()) return;
    this.isRunningBatch.set(true);
    try {
      for (const sec of this.codeSections) {
        for (const ex of sec.examples) {
          const res = await this.runner.runCode(ex.code);
          const output = (res.stdout || res.stderr || ex.expectedOutput).trim();
          this.executionOutputs.update((prev) => ({
            ...prev,
            [ex.id]: {
              output,
              durationMs: res.durationMs,
              engine: res.engine,
            },
          }));
        }
      }
    } finally {
      this.isRunningBatch.set(false);
    }
  }

  copyCode(ex: Lec2CodeExample) {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(ex.code);
      this.copiedId.set(ex.id);
      setTimeout(() => this.copiedId.set(null), 1800);
    }
  }

  openExampleInCoder(ex: Lec2CodeExample) {
    this.state.openCodeInRealCoder(`lec2_examples/${ex.fileName}`, ex.code);
  }

  openFullProjectInIde() {
    this.state.openCodeInRealCoder('01_args_kwargs.py', '');
  }
}
