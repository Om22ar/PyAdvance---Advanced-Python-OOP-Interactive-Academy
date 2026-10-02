import { Injectable, signal } from '@angular/core';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  getDocFromServer,
  Firestore
} from 'firebase/firestore';
import firebaseConfig from '../../../firebase-applet-config.json';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export interface FirebaseModuleProgress {
  moduleId: string;
  completedLessonIds: string[];
  progressPercent: number;
  completedLessons: number;
  totalLessons: number;
  status: 'in_progress' | 'completed' | 'next_up';
  updatedAt: string;
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db: Firestore = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  readonly currentUser = signal<User | null>(null);
  readonly isAuthReady = signal<boolean>(false);
  readonly isLoggingIn = signal<boolean>(false);
  readonly authError = signal<string | null>(null);

  constructor() {
    this.initAuth();
    this.testConnection();
  }

  private initAuth() {
    if (typeof window === 'undefined') return;

    onAuthStateChanged(auth, async (user) => {
      this.currentUser.set(user);
      this.isAuthReady.set(true);

      if (user) {
        // Sync user profile to Firestore
        await this.syncUserProfile(user);
      }
    });
  }

  private async testConnection() {
    if (typeof window === 'undefined') return;
    try {
      await getDocFromServer(doc(db, 'test', 'connection'));
    } catch (error) {
      if (error instanceof Error && error.message.includes('the client is offline')) {
        console.error('Please check your Firebase configuration.');
      }
    }
  }

  private handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
    const user = auth.currentUser;
    const errInfo: FirestoreErrorInfo = {
      error: error instanceof Error ? error.message : String(error),
      authInfo: {
        userId: user?.uid,
        email: user?.email,
        emailVerified: user?.emailVerified,
        isAnonymous: user?.isAnonymous,
        tenantId: user?.tenantId,
        providerInfo: user?.providerData?.map(provider => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || []
      },
      operationType,
      path
    };
    console.error('Firestore Error: ', JSON.stringify(errInfo));
    throw new Error(JSON.stringify(errInfo));
  }

  async loginWithGoogle(): Promise<User | null> {
    this.isLoggingIn.set(true);
    this.authError.set(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      this.currentUser.set(result.user);
      await this.syncUserProfile(result.user);
      return result.user;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      this.authError.set(msg);
      console.error('Google Sign-In Error:', err);
      return null;
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser.set(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  private async syncUserProfile(user: User) {
    const userDocPath = `users/${user.uid}`;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        userId: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Python Learner',
        photoURL: user.photoURL || '',
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      this.handleFirestoreError(error, OperationType.WRITE, userDocPath);
    }
  }

  async saveModuleProgress(userId: string, progress: FirebaseModuleProgress): Promise<void> {
    const path = `users/${userId}/progress/${progress.moduleId}`;
    try {
      const progressRef = doc(db, 'users', userId, 'progress', progress.moduleId);
      await setDoc(progressRef, {
        userId,
        moduleId: progress.moduleId,
        completedLessonIds: progress.completedLessonIds,
        progressPercent: progress.progressPercent,
        completedLessons: progress.completedLessons,
        totalLessons: progress.totalLessons,
        status: progress.status,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (error) {
      this.handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  async loadAllUserProgress(userId: string): Promise<Record<string, FirebaseModuleProgress>> {
    const path = `users/${userId}/progress`;
    try {
      const progressColl = collection(db, 'users', userId, 'progress');
      const snapshot = await getDocs(progressColl);
      const results: Record<string, FirebaseModuleProgress> = {};
      snapshot.forEach(docSnap => {
        results[docSnap.id] = docSnap.data() as FirebaseModuleProgress;
      });
      return results;
    } catch (error) {
      this.handleFirestoreError(error, OperationType.LIST, path);
    }
  }

  async logActivity(userId: string, activity: { id: string; title: string; type: 'completed' | 'run' | 'earned' | 'saved'; icon: string }): Promise<void> {
    const path = `users/${userId}/activities/${activity.id}`;
    try {
      const actRef = doc(db, 'users', userId, 'activities', activity.id);
      await setDoc(actRef, {
        id: activity.id,
        userId,
        title: activity.title,
        type: activity.type,
        icon: activity.icon,
        timestamp: 'Just now',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      this.handleFirestoreError(error, OperationType.WRITE, path);
    }
  }
}
