import { useState } from "react";
import { ChatPage } from "./components/ChatPage";
import { Header } from "./components/Header";
import { LessonGrid } from "./components/LessonGrid";
import { LessonView } from "./components/LessonView";
import { lessons } from "./data/lessons";
import { useProgress } from "./hooks/useProgress";
import { Lesson } from "./types";

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [showChat, setShowChat] = useState(false);
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

  const handleShowChat = () => {
    setShowChat(true);
  };

  const handleBackFromChat = () => {
    setShowChat(false);
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      <Header progress={progress} onShowChat={handleShowChat} />

      <main className="flex-1 py-8">
        {showChat ? (
          <ChatPage onBack={handleBackFromChat} />
        ) : currentLesson ? (
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

      <footer className="bg-gray-800 text-white text-center py-6 mt-auto">
        <p>&copy; {currentYear} English Shikha. Made with ❤️ for Rajarshri</p>
      </footer>
    </div>
  );
}

export default App;
