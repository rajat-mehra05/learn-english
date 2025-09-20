import { ArrowLeft, ArrowRight, Check, Volume2 } from "lucide-react";
import React, { useState } from "react";
import { Lesson } from "../types";
import { SimpleAIAssistant } from "./SimpleAIAssistant";

interface LessonViewProps {
  lesson: Lesson;
  onComplete: (lessonId: string, wordsCount: number) => void;
  onBack: () => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  lesson,
  onComplete,
  onBack,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [completedWords, setCompletedWords] = useState<Set<string>>(new Set());

  const currentWord = lesson.words[currentWordIndex];
  const isLastWord = currentWordIndex === lesson.words.length - 1;
  const allWordsCompleted = completedWords.size === lesson.words.length;

  const handleNext = () => {
    if (isLastWord) {
      if (allWordsCompleted) {
        onComplete(lesson.id, lesson.words.length);
      }
    } else {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowTranslation(false);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowTranslation(false);
    }
  };

  const markWordCompleted = () => {
    setCompletedWords((prev) => new Set([...prev, currentWord.id]));
  };

  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        {/* Mobile Header Layout */}
        <div className="flex items-center justify-between mb-4 sm:hidden">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden xs:inline">Back to Lessons</span>
          </button>
          <span className="text-sm text-gray-500">
            {currentWordIndex + 1} of {lesson.words.length}
          </span>
        </div>

        {/* Desktop Header Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Lessons
          </button>

          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">{lesson.title}</h2>
            <p className="text-gray-600">{lesson.titleAssamese}</p>
          </div>

          <div className="text-right">
            <span className="text-sm text-gray-500">
              {currentWordIndex + 1} of {lesson.words.length}
            </span>
          </div>
        </div>

        {/* Mobile Title */}
        <div className="text-center sm:hidden">
          <h2 className="text-xl font-bold text-gray-800">{lesson.title}</h2>
          <p className="text-sm text-gray-600">{lesson.titleAssamese}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Main Learning Card */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
              <h3 className="text-2xl sm:text-4xl font-bold text-gray-800">
                {currentWord.english}
              </h3>
              <button
                onClick={() => speakWord(currentWord.english)}
                className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
              >
                <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </button>
            </div>

            <p className="text-base sm:text-lg text-gray-600 mb-4">
              /{currentWord.pronunciation}/
            </p>

            {!showTranslation ? (
              <button
                onClick={() => setShowTranslation(true)}
                className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-sm sm:text-base"
              >
                Show Translation
              </button>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 sm:p-6 rounded-lg border-l-4 border-green-400">
                  <p className="text-xl sm:text-2xl font-semibold text-green-800 mb-2">
                    {currentWord.assamese}
                  </p>

                  {/* Description */}
                  {currentWord.description && (
                    <div className="mb-4">
                      <p className="text-gray-700 mb-2">
                        <strong>Description:</strong> {currentWord.description}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {currentWord.descriptionAssamese}
                      </p>
                    </div>
                  )}

                  {/* Example */}
                  <div className="space-y-2">
                    <p className="text-gray-700">
                      <strong>Example:</strong> {currentWord.example}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {currentWord.exampleAssamese}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  {!completedWords.has(currentWord.id) && (
                    <button
                      onClick={markWordCompleted}
                      className="bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center gap-2 text-sm sm:text-base"
                    >
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="hidden xs:inline">Mark as Learned</span>
                      <span className="xs:hidden">Learned</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Simple AI Assistant */}
        {showTranslation && (
          <div className="lg:col-span-1">
            <SimpleAIAssistant
              word={currentWord.english}
              context={`${lesson.title} - ${lesson.titleAssamese}`}
            />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-8">
        {/* Progress Dots - Mobile */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="flex gap-1 max-w-xs overflow-x-auto pb-2">
            {lesson.words.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors flex-shrink-0 ${
                  index === currentWordIndex
                    ? "bg-blue-500"
                    : index < currentWordIndex
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Progress Dots - Desktop */}
        <div className="hidden sm:flex justify-center mb-6">
          <div className="flex gap-2">
            {lesson.words.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentWordIndex
                    ? "bg-blue-500"
                    : index < currentWordIndex
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-2">
          <button
            onClick={handlePrevious}
            disabled={currentWordIndex === 0}
            className="flex items-center gap-2 px-3 sm:px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={
              !showTranslation ||
              (!completedWords.has(currentWord.id) && !isLastWord)
            }
            className="flex items-center gap-2 px-3 sm:px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg font-medium hover:from-blue-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            <span className="hidden xs:inline">
              {isLastWord && allWordsCompleted ? "Complete Lesson" : "Next"}
            </span>
            <span className="xs:hidden">
              {isLastWord && allWordsCompleted ? "Complete" : "Next"}
            </span>
            <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
