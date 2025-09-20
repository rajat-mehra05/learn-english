import React from 'react';
import { BookOpen, Trophy, Flame } from 'lucide-react';
import { UserProgress } from '../types';

interface HeaderProps {
  progress: UserProgress;
}

export const Header: React.FC<HeaderProps> = ({ progress }) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">English Shikha</h1>
              <p className="text-blue-100">Learn English with Assamese</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Flame className="h-5 w-5 text-orange-300" />
              <span className="font-medium">{progress.currentStreak} day streak</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
              <Trophy className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{progress.totalWordsLearned} words</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};