import React, { useState } from 'react';
import { Header } from './components/Header';
import { LessonGrid } from './components/LessonGrid';
import { LessonView } from './components/LessonView';
import { lessons } from './data/lessons';
import { useProgress } from './hooks/useProgress';
import { Lesson } from './types';

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const { progress, completeLesson } = useProgress();

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleCompleteLesson = (lessonId: string, wordsCount: number) => {
    completeLesson(lessonId, wordsCount);
    setCurrentLesson(null);
  };

  const handleBackToLessons = () => {
    setCurrentLesson(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header progress={progress} />
      
      <main className="py-8">
        {currentLesson ? (
          <LessonView
            lesson={currentLesson}
            onComplete={handleCompleteLesson}
            onBack={handleBackToLessons}
          />
        ) : (
          <LessonGrid
            lessons={lessons}
            completedLessons={progress.completedLessons}
            onStartLesson={handleStartLesson}
          />
        )}
      </main>

      <footer className="bg-gray-800 text-white text-center py-6">
        <p>&copy; 2025 English Shikha. Made with ❤️ for Assamese learners.</p>
      </footer>
    </div>
  );
}

export default App;