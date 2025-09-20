// Enhanced AI chat service for Assamese-English learning

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  language?: "assamese" | "english" | "mixed";
  isVoice?: boolean;
  pronunciation?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  pronunciation?: string;
  practice?: {
    word: string;
    assamese: string;
    pronunciation: string;
  };
  correction?: {
    original: string;
    corrected: string;
    explanation: string;
  };
}

// System prompt for conversational AI tutor
const SYSTEM_PROMPT = `You are a friendly person who helps Assamese speakers learn English through natural conversation. You speak both Assamese and English fluently.

CONVERSATION RULES:
- Talk like a real person, not a teacher or textbook
- Ask only 1-2 questions maximum per response
- Keep responses short and natural
- Never use emojis, symbols, or special characters
- Never read out punctuation marks like "comma", "period", "question mark"
- Mix Assamese and English naturally

WHEN USER SPEAKS IN ASSAMESE:
- Respond in a mix of Assamese and English
- Gently help them express the same thing in English
- Ask simple follow-up questions

WHEN USER SPEAKS IN ENGLISH:
- Respond in English
- Help with corrections if needed
- Ask one question to continue the conversation

EXAMPLES OF GOOD RESPONSES:
- "হয়, তুমি ঠিক কৈছা! I am fine বুলি ক'ব পাৰি। আপোনাৰ দিনটো কেনে আছিল?"
- "Great! I understand you perfectly. What did you do today?"
- "অসমীয়াত পানী বুলি কওঁ, ইংৰাজীত water। আপুনি পানী খাইছেনে?"

AVOID:
- Using emojis or symbols
- Reading punctuation marks
- Long responses
- Multiple questions
- Formal teaching format

Remember: You're having a casual chat with a friend!`;

class ChatService {
  private apiKey: string;
  private model: string;
  private conversationHistory: ChatMessage[] = [];

  constructor() {
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY || "";
    this.model =
      import.meta.env.VITE_CLAUDE_MODEL || "claude-sonnet-4-20250514";

    if (!this.apiKey) {
      console.warn("VITE_CLAUDE_API_KEY not found in environment variables");
    }
  }

  // Clean text to remove emojis and special characters that cause voice issues
  private cleanText(text: string): string {
    // Remove emojis and special Unicode characters
    return text
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "") // Emoticons
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "") // Misc symbols
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "") // Transport
      .replace(/[\u{1F1E0}-\u{1F1FF}]/gu, "") // Flags
      .replace(/[\u{2600}-\u{26FF}]/gu, "") // Misc symbols
      .replace(/[\u{2700}-\u{27BF}]/gu, "") // Dingbats
      .replace(/[^\x20-\x7E\u0980-\u09FF\s]/g, "") // Keep only printable ASCII, Assamese, and spaces
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();
  }

  // Detect language from text
  private detectLanguage(text: string): "assamese" | "english" | "mixed" {
    const assameseRegex = /[\u0980-\u09FF]/;
    const englishRegex = /[a-zA-Z]/;

    const hasAssamese = assameseRegex.test(text);
    const hasEnglish = englishRegex.test(text);

    if (hasAssamese && hasEnglish) return "mixed";
    if (hasAssamese) return "assamese";
    return "english";
  }

  // Generate pronunciation guide for English words
  private generatePronunciation(word: string): string {
    // Simple pronunciation mapping for common English sounds
    const pronunciationMap: { [key: string]: string } = {
      th: "থ",
      sh: "শ",
      ch: "চ",
      ph: "ফ",
      gh: "ঘ",
      ng: "ং",
      ai: "আই",
      ay: "এ",
      ee: "ঈ",
      oo: "উ",
      ou: "আউ",
      ow: "আউ",
      er: "আর",
      ar: "আর",
      or: "অর",
      ur: "আর",
      ir: "আর",
      ea: "ই",
      oa: "ও",
      ue: "ইউ",
      ie: "আই",
      ei: "আই",
      au: "আউ",
      aw: "আ",
      ew: "ইউ",
      ui: "ইউ",
      oi: "অই",
      oy: "অই",
    };

    let pronunciation = word.toLowerCase();

    // Apply pronunciation mappings
    Object.entries(pronunciationMap).forEach(([sound, assamese]) => {
      pronunciation = pronunciation.replace(new RegExp(sound, "g"), assamese);
    });

    return pronunciation;
  }

  // Send message and get AI response
  async sendMessage(
    content: string,
    isVoice: boolean = false
  ): Promise<ChatResponse> {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
      language: this.detectLanguage(content),
      isVoice,
    };

    this.conversationHistory.push(userMessage);

    if (!this.apiKey) {
      const fallbackResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "AI service not available. Please add VITE_CLAUDE_API_KEY to your .env file.",
        timestamp: new Date(),
        language: "english",
      };

      return {
        message: fallbackResponse,
      };
    }

    try {
      // Prepare conversation context - Fixed system message format
      const messages = [
        {
          role: "system" as const,
          content: SYSTEM_PROMPT,
        },
        ...this.conversationHistory.slice(-10).map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        })),
      ];

      console.log("Sending request to Claude API with:", {
        model: this.model,
        messageCount: messages.length,
        hasApiKey: !!this.apiKey,
      });

      // Fixed API call with correct headers and endpoint
      const apiResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
          "x-api-key": this.apiKey,
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 1000,
          messages: messages.filter((msg) => msg.role !== "system"), // Claude API doesn't use system role in messages array
          system: SYSTEM_PROMPT, // System prompt goes here instead
        }),
      });

      console.log("API Response status:", apiResponse.status);

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        console.error("API Error response:", errorText);
        throw new Error(`API error: ${apiResponse.status} - ${errorText}`);
      }

      const data = await apiResponse.json();
      console.log("API Response data:", data);

      // Handle response content safely
      let aiContent = "";
      if (
        data.content &&
        Array.isArray(data.content) &&
        data.content.length > 0
      ) {
        aiContent = data.content[0].text || "No response content";
      } else {
        aiContent = "Received empty response from AI";
      }

      // Clean the content to remove emojis and special characters
      const cleanedContent = this.cleanText(aiContent);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: cleanedContent,
        timestamp: new Date(),
        language: this.detectLanguage(cleanedContent),
      };

      this.conversationHistory.push(assistantMessage);

      // Extract pronunciation and practice suggestions
      const pronunciationMatch = cleanedContent.match(/উচ্চাৰণ: ([^\n]+)/);
      const practiceMatch = cleanedContent.match(/Practice: ([^\n]+)/);
      const correctionMatch = cleanedContent.match(
        /Correct English: "?([^"\n]+)"?/
      );

      const response: ChatResponse = {
        message: assistantMessage,
      };

      if (pronunciationMatch) {
        response.pronunciation = pronunciationMatch[1];
      }

      if (practiceMatch) {
        // Extract practice word if mentioned
        const wordMatch = practiceMatch[1].match(/(\w+)/);
        if (wordMatch) {
          response.practice = {
            word: wordMatch[1],
            assamese: wordMatch[1], // This would need more sophisticated mapping
            pronunciation: this.generatePronunciation(wordMatch[1]),
          };
        }
      }

      if (correctionMatch) {
        response.correction = {
          original: content,
          corrected: correctionMatch[1],
          explanation: "This is the correct English version of what you said.",
        };
      }

      return response;
    } catch (error) {
      console.error("Chat Service error:", error);

      let errorContent = "Sorry, I encountered an error. Please try again.";

      if (error instanceof Error) {
        if (error.message.includes("API error: 401")) {
          errorContent =
            "API key is invalid. Please check your VITE_CLAUDE_API_KEY in the .env file.";
        } else if (error.message.includes("API error: 429")) {
          errorContent =
            "Rate limit exceeded. Please wait a moment and try again.";
        } else if (error.message.includes("API error: 500")) {
          errorContent = "Server error. Please try again in a few moments.";
        } else if (error.message.includes("Failed to fetch")) {
          errorContent =
            "Network error. Please check your internet connection.";
        } else {
          errorContent = `Error: ${error.message}`;
        }
      }

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: errorContent,
        timestamp: new Date(),
        language: "english",
      };

      this.conversationHistory.push(errorMessage);

      return {
        message: errorMessage,
      };
    }
  }

  // Get conversation history
  getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  // Clear conversation history
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get welcome message
  getWelcomeMessage(): ChatMessage {
    return {
      id: "welcome",
      role: "assistant",
      content: `নমস্কাৰ! মই আপোনাৰ ইংৰাজী বন্ধু। Hello! I'm your English friend.

আপুনি অসমীয়াত বা ইংৰাজীত যি ভাল পায় সেইটোতে কথা ক'ব পাৰে। You can talk to me in Assamese or English.

আজি আপোনাৰ কেনে? How are you today?`,
      timestamp: new Date(),
      language: "mixed",
    };
  }

  // Additional utility methods for voice functionality
  async processVoiceInput(audioBlob: Blob): Promise<string> {
    // This would integrate with speech-to-text service
    // For now, return placeholder
    console.log("Processing voice input:", audioBlob);
    return "Voice processing not implemented yet";
  }

  async generateVoiceOutput(text: string): Promise<Blob | null> {
    // This would integrate with text-to-speech service
    // For now, return null
    console.log("Generating voice output for:", text);
    return null;
  }

  // Method to validate API configuration
  validateConfiguration(): { isValid: boolean; issues: string[] } {
    const issues: string[] = [];

    if (!this.apiKey) {
      issues.push("VITE_CLAUDE_API_KEY environment variable is not set");
    } else if (this.apiKey.length < 10) {
      issues.push("API key appears to be too short");
    }

    if (!this.model) {
      issues.push("Model is not specified");
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  // Method to get API usage stats (mock implementation)
  getUsageStats(): { messagesCount: number; lastUsed: Date | null } {
    return {
      messagesCount: this.conversationHistory.length,
      lastUsed:
        this.conversationHistory.length > 0
          ? this.conversationHistory[this.conversationHistory.length - 1]
              .timestamp
          : null,
    };
  }
}

export const chatService = new ChatService();
