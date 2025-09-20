import { BookOpen, MessageCircle } from "lucide-react";
import React from "react";
import { UserProgress } from "../types";

interface HeaderProps {
  progress: UserProgress;
  onShowChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  progress: _progress,
  onShowChat,
}) => {
  // progress parameter is kept for future use
  void _progress;

  return (
    <header className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 sm:p-6 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <BookOpen className="h-6 w-6 sm:h-8 sm:w-8" />
            <div>
              <h1 className="text-lg sm:text-2xl font-bold">English Shikha</h1>
              <p className="text-blue-100 text-xs sm:text-sm">
                Learn English with Assamese
              </p>
            </div>
          </div>

          {onShowChat && (
            <button
              onClick={onShowChat}
              className="flex items-center gap-1 sm:gap-2 bg-white/20 hover:bg-white/30 px-2 sm:px-4 py-2 rounded-full transition-colors"
              title="Voice Chat Assistant"
            >
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-medium text-sm sm:text-base hidden xs:inline">
                Voice Chat
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
