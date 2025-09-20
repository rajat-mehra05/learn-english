import { BookOpen, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { AIResponse, aiService } from "../services/aiService";

interface SimpleAIAssistantProps {
  word: string;
  context: string;
}

export const SimpleAIAssistant: React.FC<SimpleAIAssistantProps> = ({
  word,
  context,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);

  const handleGetExplanation = async () => {
    setIsLoading(true);
    try {
      const result = await aiService.getExplanation(word, context);
      setResponse(result);
      setShowAssistant(true);
    } catch (error) {
      console.error("Error getting explanation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showAssistant) {
    return (
      <div className="mt-6">
        <button
          onClick={handleGetExplanation}
          disabled={isLoading}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <BookOpen className="w-5 h-5" />
          )}
          {isLoading ? "Getting AI Explanation..." : "Get AI Explanation"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-6 h-6 text-purple-600" />
        <h3 className="text-xl font-semibold text-gray-800">
          AI Learning Assistant
        </h3>
      </div>

      {response && (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-blue-800 mb-2">Explanation</h4>
            <p className="text-blue-700">{response.explanation}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
            <h4 className="font-semibold text-green-800 mb-2">Example</h4>
            <p className="text-green-700">{response.example}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800 mb-2">Learning Tip</h4>
            <p className="text-yellow-700">{response.tip}</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setShowAssistant(false)}
        className="mt-4 text-gray-500 hover:text-gray-700 text-sm underline"
      >
        Hide AI Assistant
      </button>
    </div>
  );
};
