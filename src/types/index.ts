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

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  language?: "assamese" | "english" | "mixed";
  isVoice?: boolean;
  pronunciation?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  pronunciation?: string;
  practice?: {
    word: string;
    assamese: string;
    pronunciation: string;
  };
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
  };
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  language?: string;
}

export interface VoiceSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}
