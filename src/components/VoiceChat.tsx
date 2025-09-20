import {
  Loader2,
  MessageCircle,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Volume2,
  VolumeX,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ChatMessage, chatService } from "../services/chatService";
import { VoiceRecognitionResult, voiceService } from "../services/voiceService";

interface VoiceChatProps {
  onClose?: () => void;
}

export const VoiceChat: React.FC<VoiceChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentTranscript, setCurrentTranscript] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = chatService.getWelcomeMessage();
    setMessages([welcomeMessage]);
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle voice recognition result
  const handleVoiceResult = (result: VoiceRecognitionResult) => {
    setCurrentTranscript(result.transcript);
    setInputText(result.transcript);
    setIsListening(false);
  };

  // Handle voice recognition error
  const handleVoiceError = (error: string) => {
    console.error("Voice recognition error:", error);
    setIsListening(false);
    setCurrentTranscript("");
  };

  // Start voice recognition
  const startListening = () => {
    if (isListening) return;

    setIsListening(true);
    setCurrentTranscript("");

    voiceService.startListening(handleVoiceResult, handleVoiceError, {
      language: selectedLanguage,
      continuous: false,
      interimResults: true,
    });
  };

  // Stop voice recognition
  const stopListening = () => {
    voiceService.stopListening();
    setIsListening(false);
  };

  // Send message
  const sendMessage = async (content: string, isVoice: boolean = false) => {
    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const response = await chatService.sendMessage(content, isVoice);
      setMessages((prev) => [...prev, response.message]);

      // Auto-speak response if voice is enabled
      if (isVoiceEnabled && response.message.content) {
        const detectedLang = voiceService.detectLanguage(
          response.message.content
        );
        speakText(response.message.content, detectedLang);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Speak text
  const speakText = (text: string, language: string = "en-US") => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    voiceService.speak(text, {
      language,
      rate: 0.9,
      pitch: 1,
      volume: 0.8,
      onEnd: () => setIsSpeaking(false),
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText.trim());
      setInputText("");
      setCurrentTranscript("");
    }
  };

  // Handle voice input
  const handleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    chatService.clearHistory();
    const welcomeMessage = chatService.getWelcomeMessage();
    setMessages([welcomeMessage]);
  };

  // Format message content for display
  const formatMessageContent = (content: string) => {
    // Simple formatting - just display the content as is for natural conversation
    return <span>{content}</span>;
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <h2 className="text-xl font-semibold">Voice Chat Assistant</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={clearConversation}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Clear conversation"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <div className="whitespace-pre-wrap">
                {formatMessageContent(message.content)}
              </div>

              {/* Message metadata */}
              <div
                className={`text-xs mt-2 opacity-70 ${
                  message.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.timestamp.toLocaleTimeString()}
                {message.isVoice && " 🎤"}
                {message.language && ` (${message.language})`}
              </div>

              {/* Voice controls for assistant messages */}
              {message.role === "assistant" && (
                <button
                  onClick={() => speakText(message.content)}
                  className="mt-2 p-1 hover:bg-gray-200 rounded transition-colors"
                  title={isSpeaking ? "Stop speaking" : "Speak message"}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Current transcript */}
        {currentTranscript && (
          <div className="flex justify-end">
            <div className="max-w-[80%] p-3 rounded-lg bg-blue-100 text-blue-800 border-2 border-blue-300">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 animate-pulse" />
                <span className="text-sm font-medium">Listening...</span>
              </div>
              <div className="mt-1">{currentTranscript}</div>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm text-gray-600">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {/* Language selection */}
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="en-US">English (US)</option>
            <option value="hi-IN">Hindi (India)</option>
            <option value="as-IN">Assamese (India)</option>
            <option value="bn-IN">Bengali (India)</option>
          </select>

          <label className="flex items-center gap-1 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={isVoiceEnabled}
              onChange={(e) => setIsVoiceEnabled(e.target.checked)}
              className="rounded"
            />
            Auto-speak
          </label>
        </div>

        {/* Input form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message in Assamese or English..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            onClick={handleVoiceInput}
            disabled={isLoading}
            className={`p-2 rounded-lg transition-colors ${
              isListening
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </button>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send
          </button>
        </form>

        {/* Voice status */}
        {isListening && (
          <div className="mt-2 text-sm text-blue-600 flex items-center gap-1">
            <Mic className="w-4 h-4 animate-pulse" />
            Listening... Speak now
          </div>
        )}

        {isSpeaking && (
          <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
            <Volume2 className="w-4 h-4" />
            Speaking...
          </div>
        )}
      </div>
    </div>
  );
};
