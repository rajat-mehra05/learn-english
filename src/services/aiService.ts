// Enhanced AI service for English learning explanations
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
      const prompt = `Explain the English word/phrase "${word}" for someone learning English. Context: ${context}. 

Please respond in this JSON format:
{
  "explanation": "Simple explanation in English",
  "explanationAssamese": "Same explanation in Assamese",
  "example": "Example sentence in English",
  "exampleAssamese": "Same example in Assamese", 
  "tip": "Learning tip in English",
  "tipAssamese": "Same tip in Assamese"
}`;

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

      console.log("AI Response content:", content);

      try {
        // Try to parse the JSON response
        const parsedResponse = JSON.parse(content);
        console.log("Parsed response:", parsedResponse);

        return {
          explanation: parsedResponse.explanation || content,
          explanationAssamese:
            parsedResponse.explanationAssamese ||
            `"${word}"ৰ অৰ্থ ${context}ৰ সৈতে সম্পৰ্কিত।`,
          example:
            parsedResponse.example || `Example: Use "${word}" in a sentence`,
          exampleAssamese:
            parsedResponse.exampleAssamese ||
            `উদাহৰণ: "${word}" শব্দটো ব্যৱহাৰ কৰক`,
          tip: parsedResponse.tip || `Tip: Practice using "${word}" regularly`,
          tipAssamese:
            parsedResponse.tipAssamese ||
            `টিপ: "${word}" নিয়মিতভাৱে ব্যৱহাৰ কৰাৰ অভ্যাস কৰক`,
        };
      } catch (parseError) {
        console.warn(
          "JSON parsing failed, using content as explanation:",
          parseError
        );
        // If JSON parsing fails, return the content as explanation with fallbacks
        return {
          explanation: content,
          explanationAssamese: `"${word}"ৰ বিষয়ে তথ্য: ${context}ৰ প্ৰসংগত এইটো গুৰুত্বপূৰ্ণ।`,
          example: `Example: Here's how to use "${word}" in context`,
          exampleAssamese: `উদাহৰণ: "${word}" কেনেকৈ প্ৰসংগত ব্যৱহাৰ কৰিব পাৰি`,
          tip: `Tip: Practice using "${word}" in different situations`,
          tipAssamese: `টিপ: "${word}" বিভিন্ন পৰিস্থিতিত ব্যৱহাৰ কৰাৰ অভ্যাস কৰক`,
        };
      }
    } catch (error) {
      console.error("AI Service error:", error);
      return {
        explanation: `"${word}" is related to ${context}. This is an important concept for English learning.`,
        explanationAssamese: `"${word}" ${context}ৰ সৈতে সম্পৰ্কিত। এইটো ইংৰাজী শিকাৰ বাবে গুৰুত্বপূৰ্ণ ধাৰণা।`,
        example: `Example: Use "${word}" when talking about ${context}`,
        exampleAssamese: `উদাহৰণ: ${context}ৰ বিষয়ে কথা কোৱাৰ সময়ত "${word}" ব্যৱহাৰ কৰক`,
        tip: `Tip: Practice using "${word}" in your daily conversations`,
        tipAssamese: `টিপ: আপোনাৰ দৈনন্দিন কথোপকথনত "${word}" ব্যৱহাৰ কৰাৰ অভ্যাস কৰক`,
      };
    }
  }
}

export const aiService = new AIService();
