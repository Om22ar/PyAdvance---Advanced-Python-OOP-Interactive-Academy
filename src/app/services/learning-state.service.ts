import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { CURRICULUM_DATA, INITIAL_ACTIVITIES, INITIAL_SKILLS } from '../data/curriculum.data';
import { Module, Lesson, ActivityItem } from '../models/curriculum.model';
import { FirebaseService, FirebaseModuleProgress } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class LearningStateService {
  private readonly firebase = inject(FirebaseService);

  readonly modules = signal<Module[]>(CURRICULUM_DATA);
  readonly completedStepIds = signal<string[]>([
    'file-modes-intro',
    'file-reading-methods',
    'file-seek-tell',
    'json-custom-objects',
    'csv-dict-readers',
    'regex-search-findall'
  ]);

  readonly activeView = signal<'overview' | 'curriculum' | 'playground' | 'simulators' | 'surge' | 'vscode' | 'study'>('overview');
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
  readonly isSettingsOpen = signal<boolean>(false);

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

  // Overall calculations based on completed steps
  readonly totalStepsCount = computed(() => {
    return this.modules().reduce((acc, m) => acc + m.totalLessons, 0);
  });

  readonly totalCompletedStepsCount = computed(() => {
    return this.completedStepIds().length;
  });

  readonly overallProgress = computed(() => {
    const total = this.totalStepsCount();
    if (total === 0) return 0;
    const completed = this.totalCompletedStepsCount();
    return Math.min(100, Math.round((completed / total) * 100));
  });

  readonly totalModulesCompleted = computed(() => {
    return this.modules().filter(m => m.status === 'completed').length;
  });

  readonly totalLessonsCompleted = computed(() => {
    return this.totalCompletedStepsCount();
  });

  // User display name from Google Auth or local default
  readonly userDisplayName = computed(() => {
    const user = this.firebase.currentUser();
    if (user?.displayName) return user.displayName.split(' ')[0];
    return 'Omar';
  });

  readonly userEmail = computed(() => {
    return this.firebase.currentUser()?.email || 'Guest Learner';
  });

  readonly userPhotoUrl = computed(() => {
    return this.firebase.currentUser()?.photoURL || null;
  });

  readonly isCloudSyncActive = computed(() => {
    return this.firebase.currentUser() !== null;
  });

  constructor() {
    this.loadFromStorage();

    // Reactively sync with cloud when user signs in with Google
    effect(() => {
      const user = this.firebase.currentUser();
      if (user) {
        this.syncWithCloud(user.uid);
      }
    });
  }

  isStepCompleted(lessonId: string): boolean {
    return this.completedStepIds().includes(lessonId);
  }

  getCompletedStepsForModule(moduleId: string): string[] {
    const mod = this.modules().find(m => m.id === moduleId);
    if (!mod) return [];
    const lessonIds = mod.lessons.map(l => l.id);
    return this.completedStepIds().filter(id => lessonIds.includes(id));
  }

  setView(view: 'overview' | 'curriculum' | 'playground' | 'simulators' | 'surge' | 'vscode' | 'study') {
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

  openSettings() {
    this.isSettingsOpen.set(true);
  }

  closeSettings() {
    this.isSettingsOpen.set(false);
  }

  /**
   * Core Progress Tracking System:
   * Records step completion, updates module percentage, triggers cloud sync, and logs activity.
   */
  async markStepCompleted(moduleId: string, lessonId: string, customTitle?: string) {
    // 1. Add step ID to completed steps
    if (!this.completedStepIds().includes(lessonId)) {
      this.completedStepIds.update(ids => [...ids, lessonId]);
    }

    // 2. Recalculate module progress
    let updatedModuleData: Module | null = null;
    this.modules.update(mods => {
      return mods.map(m => {
        if (m.id !== moduleId) return m;

        const completedForMod = this.getCompletedStepsForModule(m.id);
        const completedCount = completedForMod.length;
        const percent = Math.min(100, Math.round((completedCount / m.totalLessons) * 100));
        const status = percent === 100 ? 'completed' : 'in_progress';

        const updated: Module = {
          ...m,
          completedLessons: completedCount,
          progressPercent: percent,
          status
        };
        updatedModuleData = updated;
        return updated;
      });
    });

    // 3. Log activity
    const mod = this.modules().find(m => m.id === moduleId);
    const les = mod?.lessons.find(l => l.id === lessonId);
    const titleText = customTitle || (les ? `Completed step: ${les.title}` : `Completed ${moduleId}`);

    const newActivity: ActivityItem = {
      id: 'act-' + Date.now(),
      title: titleText,
      timestamp: 'Just now',
      type: 'completed',
      icon: 'check_circle'
    };

    this.activities.update(acts => [newActivity, ...acts.slice(0, 5)]);

    // 4. Save to local storage
    this.saveToStorage();

    // 5. Cloud Firestore synchronization if signed in
    const user = this.firebase.currentUser();
    if (user && updatedModuleData) {
      const fbProgress: FirebaseModuleProgress = {
        moduleId,
        completedLessonIds: this.getCompletedStepsForModule(moduleId),
        progressPercent: (updatedModuleData as Module).progressPercent,
        completedLessons: (updatedModuleData as Module).completedLessons,
        totalLessons: (updatedModuleData as Module).totalLessons,
        status: (updatedModuleData as Module).status,
        updatedAt: new Date().toISOString()
      };

      try {
        await this.firebase.saveModuleProgress(user.uid, fbProgress);
        await this.firebase.logActivity(user.uid, newActivity);
      } catch (err) {
        console.warn('Cloud sync deferred:', err);
      }
    }
  }

  // Alias for backward compatibility
  markLessonCompleted(moduleId: string, lessonId: string) {
    this.markStepCompleted(moduleId, lessonId);
  }

  private async syncWithCloud(userId: string) {
    try {
      const cloudProgress = await this.firebase.loadAllUserProgress(userId);
      if (cloudProgress && Object.keys(cloudProgress).length > 0) {
        // Collect all step IDs from cloud
        const allCloudStepIds: string[] = [];
        for (const p of Object.values(cloudProgress)) {
          if (p.completedLessonIds) {
            allCloudStepIds.push(...p.completedLessonIds);
          }
        }

        // Merge step IDs
        this.completedStepIds.update(local => {
          const merged = new Set([...local, ...allCloudStepIds]);
          return Array.from(merged);
        });

        // Update modules with merged state
        this.modules.update(mods => {
          return mods.map(m => {
            const completedCount = this.getCompletedStepsForModule(m.id).length;
            const percent = Math.min(100, Math.round((completedCount / m.totalLessons) * 100));
            return {
              ...m,
              completedLessons: completedCount,
              progressPercent: percent,
              status: percent === 100 ? 'completed' : percent > 0 ? 'in_progress' : m.status
            };
          });
        });

        this.saveToStorage();
      }
    } catch (err) {
      console.warn('Failed to load cloud progress:', err);
    }
  }

  resetProgress() {
    this.modules.set(CURRICULUM_DATA);
    this.completedStepIds.set([]);
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
        completedStepIds: this.completedStepIds(),
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
        if (parsed.completedStepIds) this.completedStepIds.set(parsed.completedStepIds);
        if (parsed.streak) this.dayStreak.set(parsed.streak);
        if (parsed.practiceHours) this.practiceTimeHours.set(parsed.practiceHours);
      }
    } catch {
      // Storage read fallback
    }
  }
}
