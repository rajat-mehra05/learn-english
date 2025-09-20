import {
  CheckCircle,
  Headphones,
  Mic,
  MicOff,
  Pause,
  Play,
  RotateCcw,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { VoiceRecognitionResult, voiceService } from "../services/voiceService";

interface PronunciationPracticeProps {
  word: string;
  assamese: string;
  pronunciation: string;
  onComplete?: (accuracy: number) => void;
  onClose?: () => void;
}

interface PracticeAttempt {
  id: string;
  userInput: string;
  accuracy: number;
  timestamp: Date;
  feedback: string;
}

export const PronunciationPractice: React.FC<PronunciationPracticeProps> = ({
  word,
  assamese,
  pronunciation,
  onComplete,
  onClose,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attempts, setAttempts] = useState<PracticeAttempt[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Calculate accuracy between user input and target word
  const calculateAccuracy = (userInput: string, target: string): number => {
    const user = userInput.toLowerCase().trim();
    const targetLower = target.toLowerCase().trim();

    if (user === targetLower) return 100;

    // Simple Levenshtein distance-based accuracy
    const distance = levenshteinDistance(user, targetLower);
    const maxLength = Math.max(user.length, targetLower.length);
    const accuracy = Math.max(0, ((maxLength - distance) / maxLength) * 100);

    return Math.round(accuracy);
  };

  // Levenshtein distance calculation
  const levenshteinDistance = (str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  };

  // Generate feedback based on accuracy
  const generateFeedback = (accuracy: number): string => {
    if (accuracy >= 90) return "Excellent! Perfect pronunciation! 🎉";
    if (accuracy >= 80) return "Very good! Almost perfect! 👏";
    if (accuracy >= 70) return "Good! Keep practicing! 💪";
    if (accuracy >= 60)
      return "Not bad! Try to be more careful with pronunciation.";
    if (accuracy >= 40) return "Keep trying! Focus on the sounds.";
    return "Don't give up! Practice makes perfect! 🌟";
  };

  // Handle voice recognition result
  const handleVoiceResult = (result: VoiceRecognitionResult) => {
    setCurrentAttempt(result.transcript);
    const accuracy = calculateAccuracy(result.transcript, word);
    setCurrentAccuracy(accuracy);

    const attempt: PracticeAttempt = {
      id: Date.now().toString(),
      userInput: result.transcript,
      accuracy,
      timestamp: new Date(),
      feedback: generateFeedback(accuracy),
    };

    setAttempts((prev) => [...prev, attempt]);
    setShowFeedback(true);
    setIsListening(false);

    if (accuracy >= 80 && onComplete) {
      setTimeout(() => onComplete(accuracy), 2000);
    }
  };

  // Handle voice recognition error
  const handleVoiceError = (error: string) => {
    console.error("Voice recognition error:", error);
    setIsListening(false);
  };

  // Start voice recognition
  const startListening = () => {
    if (isListening) return;

    setIsListening(true);
    setCurrentAttempt("");
    setShowFeedback(false);

    voiceService.startListening(handleVoiceResult, handleVoiceError, {
      language: "en-US",
      continuous: false,
      interimResults: false,
    });
  };

  // Stop voice recognition
  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  // Speak the target word
  const speakWord = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      setIsPlaying(false);
      return;
    }

    setIsSpeaking(true);
    setIsPlaying(true);
    voiceService.speak(word, {
      language: "en-US",
      rate: 0.8,
      pitch: 1,
      volume: 0.9,
      onEnd: () => {
        setIsSpeaking(false);
        setIsPlaying(false);
      },
    });
  };

  // Reset practice
  const resetPractice = () => {
    setAttempts([]);
    setCurrentAttempt("");
    setShowFeedback(false);
    setCurrentAccuracy(0);
  };

  // Get average accuracy
  const averageAccuracy =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) /
            attempts.length
        )
      : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Headphones className="w-6 h-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            Pronunciation Practice
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Word Display */}
      <div className="text-center mb-8">
        <div className="text-4xl font-bold text-gray-800 mb-2">{word}</div>
        <div className="text-xl text-gray-600 mb-1">{assamese}</div>
        <div className="text-lg text-blue-600 font-mono">{pronunciation}</div>
      </div>

      {/* Practice Controls */}
      <div className="flex flex-col items-center gap-4 mb-6">
        {/* Listen to word */}
        <button
          onClick={speakWord}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isSpeaking
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          {isSpeaking ? "Stop" : "Listen to Word"}
        </button>

        {/* Practice button */}
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isSpeaking}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            isListening
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-300"
          }`}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
          {isListening ? "Stop Recording" : "Practice Now"}
        </button>

        {/* Reset button */}
        <button
          onClick={resetPractice}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset Practice
        </button>
      </div>

      {/* Current Attempt */}
      {currentAttempt && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Your pronunciation:</div>
          <div className="text-lg font-medium">{currentAttempt}</div>
        </div>
      )}

      {/* Feedback */}
      {showFeedback && (
        <div
          className={`mb-6 p-4 rounded-lg border-l-4 ${
            currentAccuracy >= 80
              ? "bg-green-50 border-green-400"
              : currentAccuracy >= 60
              ? "bg-yellow-50 border-yellow-400"
              : "bg-red-50 border-red-400"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            {currentAccuracy >= 80 ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="font-semibold">Accuracy: {currentAccuracy}%</span>
          </div>
          <div className="text-sm">{generateFeedback(currentAccuracy)}</div>
        </div>
      )}

      {/* Practice History */}
      {attempts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Practice History</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {attempts
              .slice(-5)
              .reverse()
              .map((attempt) => (
                <div
                  key={attempt.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium">{attempt.userInput}</div>
                    <div className="text-sm text-gray-600">
                      {attempt.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                  <div
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      attempt.accuracy >= 80
                        ? "bg-green-100 text-green-800"
                        : attempt.accuracy >= 60
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {attempt.accuracy}%
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Statistics */}
      {attempts.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Statistics</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Attempts:</span>
              <span className="ml-2 font-medium">{attempts.length}</span>
            </div>
            <div>
              <span className="text-gray-600">Average Accuracy:</span>
              <span className="ml-2 font-medium">{averageAccuracy}%</span>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 text-sm text-gray-600">
        <p className="mb-2">
          <strong>Instructions:</strong>
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Click "Listen to Word" to hear the correct pronunciation</li>
          <li>Click "Practice Now" and speak the word clearly</li>
          <li>Try to match the pronunciation as closely as possible</li>
          <li>Practice multiple times to improve your accuracy</li>
        </ul>
      </div>
    </div>
  );
};
