import { ArrowLeft, Headphones, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { PronunciationPractice } from "./PronunciationPractice";
import { VoiceChat } from "./VoiceChat";

interface ChatPageProps {
  onBack?: () => void;
}

type ChatMode = "conversation" | "pronunciation" | "settings";

export const ChatPage: React.FC<ChatPageProps> = ({ onBack }) => {
  const [currentMode, setCurrentMode] = useState<ChatMode>("conversation");
  const [practiceWord, setPracticeWord] = useState<{
    word: string;
    assamese: string;
    pronunciation: string;
  } | null>(null);

  // Sample practice words for demonstration
  const practiceWords = [
    { word: "Hello", assamese: "নমস্কাৰ", pronunciation: "নমস্কাৰ" },
    { word: "Water", assamese: "পানী", pronunciation: "ৱাটাৰ" },
    { word: "Thank you", assamese: "ধন্যবাদ", pronunciation: "থেংক ইউ" },
    { word: "Good morning", assamese: "সুপ্ৰভাত", pronunciation: "গুড মৰ্নিং" },
    {
      word: "How are you?",
      assamese: "আপোনাৰ কেনে?",
      pronunciation: "হাউ আৰ ইউ?",
    },
    { word: "I am fine", assamese: "মই ভালে আছো", pronunciation: "আই এম ফাইন" },
    { word: "Please", assamese: "অনুগ্রহ কৰি", pronunciation: "প্লিজ" },
    { word: "Sorry", assamese: "মাফ কৰিব", pronunciation: "চৰি" },
    { word: "Yes", assamese: "হয়", pronunciation: "য়েছ" },
    { word: "No", assamese: "নহয়", pronunciation: "নো" },
  ];

  const handleStartPronunciationPractice = (
    word: (typeof practiceWords)[0]
  ) => {
    setPracticeWord(word);
    setCurrentMode("pronunciation");
  };

  const handlePronunciationComplete = (accuracy: number) => {
    console.log(`Pronunciation practice completed with ${accuracy}% accuracy`);
    // You could show a success message or move to the next word
  };

  const handleClosePronunciation = () => {
    setPracticeWord(null);
    setCurrentMode("conversation");
  };

  const handleCloseChat = () => {
    setCurrentMode("conversation");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Back to lessons"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="flex items-center gap-2">
                <MessageCircle className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-800">
                  Voice Learning Assistant
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentMode("conversation")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentMode === "conversation"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </button>

              <button
                onClick={() => setCurrentMode("pronunciation")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentMode === "pronunciation"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Headphones className="w-4 h-4" />
                Practice
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentMode === "conversation" && (
          <div className="max-w-4xl mx-auto">
            <VoiceChat onClose={handleCloseChat} />
          </div>
        )}

        {currentMode === "pronunciation" && (
          <div className="max-w-6xl mx-auto">
            {practiceWord ? (
              <PronunciationPractice
                word={practiceWord.word}
                assamese={practiceWord.assamese}
                pronunciation={practiceWord.pronunciation}
                onComplete={handlePronunciationComplete}
                onClose={handleClosePronunciation}
              />
            ) : (
              <div className="space-y-6">
                {/* Header */}
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Pronunciation Practice
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Choose a word to practice your pronunciation
                  </p>
                </div>

                {/* Practice Words Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {practiceWords.map((word, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleStartPronunciationPractice(word)}
                    >
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800 mb-2">
                          {word.word}
                        </div>
                        <div className="text-lg text-gray-600 mb-2">
                          {word.assamese}
                        </div>
                        <div className="text-sm text-blue-600 font-mono mb-4">
                          {word.pronunciation}
                        </div>
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2">
                          <Headphones className="w-4 h-4" />
                          Practice Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    How to Practice
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                    <div>
                      <h4 className="font-medium mb-2">Step 1: Listen</h4>
                      <p>
                        Click "Listen to Word" to hear the correct pronunciation
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Step 2: Practice</h4>
                      <p>Click "Practice Now" and speak the word clearly</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Step 3: Get Feedback</h4>
                      <p>
                        Receive instant feedback on your pronunciation accuracy
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Step 4: Improve</h4>
                      <p>Practice multiple times to improve your accuracy</p>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-yellow-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-3">
                    Pronunciation Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-yellow-700">
                    <li>• Speak clearly and at a moderate pace</li>
                    <li>
                      • Pay attention to the pronunciation guide in Assamese
                      script
                    </li>
                    <li>
                      • Practice in a quiet environment for better recognition
                    </li>
                    <li>
                      • Don't worry about perfect accuracy - focus on
                      improvement
                    </li>
                    <li>
                      • Use the "Listen to Word" feature to compare your
                      pronunciation
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {currentMode === "settings" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Voice Recognition Language
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="en-US">English (US)</option>
                    <option value="hi-IN">Hindi (India)</option>
                    <option value="as-IN">Assamese (India)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text-to-Speech Language
                  </label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg">
                    <option value="en-US">English (US)</option>
                    <option value="hi-IN">Hindi (India)</option>
                    <option value="as-IN">Assamese (India)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="auto-speak" className="rounded" />
                  <label htmlFor="auto-speak" className="text-sm text-gray-700">
                    Auto-speak AI responses
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="continuous-listening"
                    className="rounded"
                  />
                  <label
                    htmlFor="continuous-listening"
                    className="text-sm text-gray-700"
                  >
                    Continuous voice listening
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
