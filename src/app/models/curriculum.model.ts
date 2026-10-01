export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  durationMinutes: number;
  concepts: string[];
  slideReference: string;
  summary: string;
  codeSnippet: string;
  expectedOutput: string;
  explanation: string;
  quiz?: {
    question: string;
    options: string[];
    answerIndex: number;
    explanation: string;
  };
}

export interface Module {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  icon: string;
  category: 'core' | 'oop' | 'advanced' | 'data';
  status: 'in_progress' | 'next_up' | 'completed';
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  description: string;
  lessons: Lesson[];
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: 'completed' | 'run' | 'earned' | 'saved';
  icon: string;
  actionUrl?: string;
}

export interface SkillProgress {
  name: string;
  level: string;
  percentage: number;
  color: string;
}
