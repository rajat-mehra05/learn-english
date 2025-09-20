import React from "react";
import { Lesson } from "../types";
import { LessonCard } from "./LessonCard";

interface LessonGridProps {
  lessons: Lesson[];
  completedLessons: string[];
  onStartLesson: (lesson: Lesson) => void;
}

export const LessonGrid: React.FC<LessonGridProps> = ({
  lessons,
  completedLessons,
  onStartLesson,
}) => {
  const categories = {
    phrases: "Common Phrases - সাধাৰণ বাক্য",
    vocabulary: "Vocabulary - শব্দভাণ্ডাৰ",
    grammar: "Grammar - ব্যাকৰণ",
    pronunciation: "Pronunciation - উচ্চাৰণ",
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Hi Rajarshri, Choose Your Lesson
        </h2>
        <p className="text-gray-600">আপোনাৰ পাঠ বাছনি কৰক</p>
      </div>

      {Object.entries(categories).map(([category, title]) => {
        const categoryLessons = lessons.filter(
          (lesson) => lesson.category === category
        );
        if (categoryLessons.length === 0) return null;

        return (
          <div key={category} className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">
              {title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categoryLessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onStart={onStartLesson}
                  isCompleted={completedLessons.includes(lesson.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
