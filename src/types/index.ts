export interface Lesson {
  id: string;
  title: string;
  titleAssamese: string;
  category: "vocabulary" | "grammar" | "phrases" | "pronunciation";
  level: "beginner" | "intermediate" | "advanced";
  words: Word[];
  completed: boolean;
}

export interface Word {
  id: string;
  english: string;
  assamese: string;
  pronunciation: string;
  description?: string;
  descriptionAssamese?: string;
  example: string;
  exampleAssamese: string;
}

export interface UserProgress {
  completedLessons: string[];
  currentStreak: number;
  totalWordsLearned: number;
  lastStudyDate: string;
}
