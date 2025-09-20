// Simple AI service for English learning explanations
export interface AIResponse {
  explanation: string;
  example: string;
  tip: string;
}

class AIService {
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_CLAUDE_API_KEY || "";
    this.model = import.meta.env.VITE_CLAUDE_MODEL || "claude-3-haiku-20240307";

    if (!this.apiKey) {
      console.warn("VITE_CLAUDE_API_KEY not found in environment variables");
    }
  }

  async getExplanation(word: string, context: string): Promise<AIResponse> {
    if (!this.apiKey) {
      return {
        explanation:
          "AI service not available. Please add VITE_CLAUDE_API_KEY to your .env file.",
        example: "Example: " + word + " is used in " + context,
        tip: "Tip: Practice using this word in different sentences.",
      };
    }

    try {
      const prompt = `Explain the English word "${word}" for someone learning English. Context: ${context}. Keep it simple and helpful.`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: this.model,
          max_tokens: 500,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const content = data.content[0].text;

      return {
        explanation: content,
        example: `Example: Use "${word}" in a sentence`,
        tip: `Tip: Practice saying "${word}" out loud`,
      };
    } catch (error) {
      console.error("AI Service error:", error);
      return {
        explanation: `"${word}" is an important English word. It means something related to ${context}.`,
        example: `Example: I use "${word}" when talking about ${context}`,
        tip: `Tip: Try to use "${word}" in your daily conversations`,
      };
    }
  }
}

export const aiService = new AIService();
