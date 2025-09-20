import React from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onStart: (lesson: Lesson) => void;
  isCompleted: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onStart, isCompleted }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vocabulary': return '📚';
      case 'grammar': return '✏️';
      case 'phrases': return '💬';
      case 'pronunciation': return '🎵';
      default: return '📖';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getCategoryIcon(lesson.category)}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
            <p className="text-sm text-gray-600">{lesson.titleAssamese}</p>
          </div>
        </div>
        
        {isCompleted ? (
          <CheckCircle className="h-6 w-6 text-green-500" />
        ) : (
          <Circle className="h-6 w-6 text-gray-300" />
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getLevelColor(lesson.level)}`}>
          {lesson.level}
        </span>
        <span className="text-sm text-gray-500">
          {lesson.words.length} words
        </span>
      </div>

      <button
        onClick={() => onStart(lesson)}
        className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <Play className="h-4 w-4" />
        {isCompleted ? 'Review Lesson' : 'Start Lesson'}
      </button>
    </div>
  );
};