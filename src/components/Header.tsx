import { BookOpen, MessageCircle } from "lucide-react";
import React from "react";
import { UserProgress } from "../types";

interface HeaderProps {
  progress: UserProgress;
  onShowChat?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ progress, onShowChat }) => {
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

          {onShowChat && (
            <button
              onClick={onShowChat}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition-colors"
              title="Voice Chat Assistant"
            >
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Voice Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
