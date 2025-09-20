import { useState, useEffect } from 'react';
import { UserProgress } from '../types';

const initialProgress: UserProgress = {
  completedLessons: [],
  currentStreak: 0,
  totalWordsLearned: 0,
  lastStudyDate: ''
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(initialProgress);

  useEffect(() => {
    const savedProgress = localStorage.getItem('englishLearningProgress');
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
  }, []);

  const updateProgress = (newProgress: Partial<UserProgress>) => {
    const updatedProgress = { ...progress, ...newProgress };
    setProgress(updatedProgress);
    localStorage.setItem('englishLearningProgress', JSON.stringify(updatedProgress));
  };

  const completeLesson = (lessonId: string, wordsCount: number) => {
    if (!progress.completedLessons.includes(lessonId)) {
      const today = new Date().toISOString().split('T')[0];
      const isConsecutiveDay = progress.lastStudyDate === 
        new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      updateProgress({
        completedLessons: [...progress.completedLessons, lessonId],
        totalWordsLearned: progress.totalWordsLearned + wordsCount,
        currentStreak: isConsecutiveDay ? progress.currentStreak + 1 : 1,
        lastStudyDate: today
      });
    }
  };

  return { progress, updateProgress, completeLesson };
};