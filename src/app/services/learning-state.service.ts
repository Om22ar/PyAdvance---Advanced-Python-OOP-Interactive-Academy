import { Injectable, signal, computed } from '@angular/core';
import { CURRICULUM_DATA, INITIAL_ACTIVITIES, INITIAL_SKILLS } from '../data/curriculum.data';
import { Module, Lesson, ActivityItem } from '../models/curriculum.model';

@Injectable({
  providedIn: 'root'
})
export class LearningStateService {
  readonly modules = signal<Module[]>(CURRICULUM_DATA);
  readonly activeView = signal<'overview' | 'curriculum' | 'playground' | 'simulators' | 'surge'>('overview');
  readonly selectedModuleId = signal<string>('file-handling-modes');
  readonly selectedLessonId = signal<string>('file-modes-intro');
  readonly isDarkMode = signal<boolean>(false);
  readonly searchQuery = signal<string>('');
  readonly selectedCategory = signal<string>('all');
  
  // Stats
  readonly practiceTimeHours = signal<number>(4.2);
  readonly targetWeeklyHours = signal<number>(5.0);
  readonly dayStreak = signal<number>(12);
  readonly activities = signal<ActivityItem[]>(INITIAL_ACTIVITIES);
  readonly skills = signal(INITIAL_SKILLS);

  // User Settings
  readonly editorFontSize = signal<number>(13);
  readonly autoRunCode = signal<boolean>(false);
  readonly tabSize = signal<number>(4);
  readonly preferredEngine = signal<'wasm' | 'instant'>('wasm');

  // Active module & lesson computed
  readonly activeModule = computed(() => {
    const id = this.selectedModuleId();
    return this.modules().find(m => m.id === id) || this.modules()[0];
  });

  readonly activeLesson = computed(() => {
    const currentMod = this.activeModule();
    const lId = this.selectedLessonId();
    return currentMod.lessons.find(l => l.id === lId) || currentMod.lessons[0] || null;
  });

  // Overall completed count
  readonly overallProgress = computed(() => {
    let completed = 0;
    let total = 0;
    for (const m of this.modules()) {
      completed += m.completedLessons;
      total += m.totalLessons;
    }
    return Math.round((completed / total) * 100);
  });

  readonly totalLessonsCompleted = computed(() => {
    return this.modules().reduce((acc, m) => acc + m.completedLessons, 0);
  });

  constructor() {
    this.loadFromStorage();
  }

  setView(view: 'overview' | 'curriculum' | 'playground' | 'simulators' | 'surge') {
    this.activeView.set(view);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  selectLesson(moduleId: string, lessonId: string) {
    this.selectedModuleId.set(moduleId);
    this.selectedLessonId.set(lessonId);
  }

  openLessonInPlayground(lesson: Lesson) {
    this.selectedModuleId.set(lesson.moduleId);
    this.selectedLessonId.set(lesson.id);
    this.setView('playground');
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
  }

  markLessonCompleted(moduleId: string, lessonId: string) {
    this.modules.update(mods => {
      return mods.map(m => {
        if (m.id !== moduleId) return m;
        const newCompleted = Math.min(m.totalLessons, m.completedLessons + 1);
        const percent = Math.round((newCompleted / m.totalLessons) * 100);
        return {
          ...m,
          completedLessons: newCompleted,
          progressPercent: percent,
          status: percent === 100 ? 'completed' : 'in_progress'
        };
      });
    });

    // Add activity
    const mod = this.modules().find(m => m.id === moduleId);
    const les = mod?.lessons.find(l => l.id === lessonId);
    if (les) {
      this.activities.update(acts => [
        {
          id: 'act-' + Date.now(),
          title: `Completed: ${les.title}`,
          timestamp: 'Just now',
          type: 'completed',
          icon: 'check_circle'
        },
        ...acts.slice(0, 5)
      ]);
    }

    this.saveToStorage();
  }

  resetProgress() {
    this.modules.set(CURRICULUM_DATA);
    this.dayStreak.set(1);
    this.practiceTimeHours.set(0.5);
    this.activities.set(INITIAL_ACTIVITIES);
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('pyadvance_progress', JSON.stringify({
        modules: this.modules(),
        streak: this.dayStreak(),
        practiceHours: this.practiceTimeHours()
      }));
    } catch {
      // Storage unavailable or disabled in private browsing
    }
  }

  private loadFromStorage() {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('pyadvance_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.modules) this.modules.set(parsed.modules);
        if (parsed.streak) this.dayStreak.set(parsed.streak);
        if (parsed.practiceHours) this.practiceTimeHours.set(parsed.practiceHours);
      }
    } catch {
      // Storage read fallback
    }
  }
}
