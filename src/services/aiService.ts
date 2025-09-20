// Simple AI service for English learning explanations
export interface AIResponse {
  explanation: string;
  explanationAssamese: string;
  example: string;
  exampleAssamese: string;
  tip: string;
  tipAssamese: string;
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
        explanationAssamese:
          "AI সেৱা উপলব্ধ নহয়। অনুগ্ৰহ কৰি আপোনাৰ .env ফাইলত VITE_CLAUDE_API_KEY যোগ কৰক।",
        example: "Example: " + word + " is used in " + context,
        exampleAssamese:
          "উদাহৰণ: " + word + " ব্যৱহাৰ কৰা হয় " + context + "ত",
        tip: "Tip: Practice using this word in different sentences.",
        tipAssamese: "টিপ: বিভিন্ন বাক্যত এই শব্দটো ব্যৱহাৰ কৰাৰ অভ্যাস কৰক।",
      };
    }

    try {
      const prompt = `Explain the English word "${word}" for someone learning English. Context: ${context}. Keep it simple and helpful.

Please provide your response in the following JSON format:
{
  "explanation": "Simple English explanation of the word",
  "explanationAssamese": "Same explanation in native Assamese language",
  "example": "Example sentence in English using the word",
  "exampleAssamese": "Same example sentence translated to native Assamese",
  "tip": "Helpful tip in English for learning this word",
  "tipAssamese": "Same tip translated to Assamese"
}

Make sure the Assamese translations are accurate and natural.`;

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

      try {
        // Try to parse the JSON response
        const parsedResponse = JSON.parse(content);
        return {
          explanation: parsedResponse.explanation || content,
          explanationAssamese:
            parsedResponse.explanationAssamese ||
            `"${word}"ৰ অসমীয়া অৰ্থ ${context}ৰ সৈতে সম্পৰ্কিত।`,
          example:
            parsedResponse.example || `Example: Use "${word}" in a sentence`,
          exampleAssamese:
            parsedResponse.exampleAssamese ||
            `উদাহৰণ: "${word}" শব্দটো ব্যৱহাৰ কৰক`,
          tip: parsedResponse.tip || `Tip: Practice saying "${word}" out loud`,
          tipAssamese:
            parsedResponse.tipAssamese ||
            `টিপ: "${word}" শব্দটো উচ্চস্বৰে কোৱাৰ অভ্যাস কৰক`,
        };
      } catch {
        // If JSON parsing fails, return the content as explanation and provide Assamese fallbacks
        return {
          explanation: content,
          explanationAssamese: `"${word}"ৰ অসমীয়া অৰ্থ ${context}ৰ সৈতে সম্পৰ্কিত।`,
          example: `Example: Use "${word}" in a sentence`,
          exampleAssamese: `উদাহৰণ: "${word}" শব্দটো ব্যৱহাৰ কৰক`,
          tip: `Tip: Practice saying "${word}" out loud`,
          tipAssamese: `টিপ: "${word}" শব্দটো উচ্চস্বৰে কোৱাৰ অভ্যাস কৰক`,
        };
      }
    } catch (error) {
      console.error("AI Service error:", error);
      return {
        explanation: `"${word}" means something related to ${context}.`,
        explanationAssamese: `"${word}"ৰ অৰ্থ ${context}ৰ সৈতে সম্পৰ্কিত।`,
        example: `Example: I use "${word}" when talking about ${context}`,
        exampleAssamese: `উদাহৰণ: মই "${word}" ব্যৱহাৰ কৰোঁ ${context}ৰ বিষয়ে কথা কোৱাৰ সময়ত`,
        tip: `Tip: Try to use "${word}" in your daily conversations`,
        tipAssamese: `টিপ: আপোনাৰ দৈনন্দিন কথোপকথনত "${word}" ব্যৱহাৰ কৰাৰ চেষ্টা কৰক`,
      };
    }
  }
}

export const aiService = new AIService();
