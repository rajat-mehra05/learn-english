// Voice recognition and text-to-speech service for Assamese-English learning

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

export interface VoiceRecognitionResult {
  transcript: string;
  confidence: number;
  language?: string;
}

export interface VoiceSettings {
  language: string;
  continuous: boolean;
  interimResults: boolean;
}

export class VoiceService {
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis | null = null;
  private isSupported: boolean = false;

  constructor() {
    this.initializeServices();
  }

  private initializeServices() {
    // Check for speech recognition support
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
    }

    // Check for speech synthesis support
    if ("speechSynthesis" in window) {
      this.synthesis = window.speechSynthesis;
    }
  }

  // Start voice recognition
  startListening(
    onResult: (result: VoiceRecognitionResult) => void,
    onError: (error: string) => void,
    settings: VoiceSettings = {
      language: "en-US",
      continuous: false,
      interimResults: true,
    }
  ): void {
    if (!this.recognition || !this.isSupported) {
      onError("Speech recognition is not supported in this browser");
      return;
    }

    this.recognition.lang = settings.language;
    this.recognition.continuous = settings.continuous;
    this.recognition.interimResults = settings.interimResults;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        onResult({
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          language: settings.language,
        });
      }
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      // Auto-restart if continuous mode
      if (settings.continuous) {
        this.startListening(onResult, onError, settings);
      }
    };

    this.recognition.start();
  }

  // Stop voice recognition
  stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  // Check if voice recognition is currently active
  isListening(): boolean {
    return this.recognition ? this.recognition.continuous : false;
  }

  // Speak text using text-to-speech
  speak(
    text: string,
    options: {
      language?: string;
      rate?: number;
      pitch?: number;
      volume?: number;
      onEnd?: () => void;
    } = {}
  ): void {
    if (!this.synthesis) {
      console.warn("Speech synthesis is not supported in this browser");
      return;
    }

    // Cancel any ongoing speech
    this.synthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.language || "en-US";
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    utterance.onend = () => {
      if (options.onEnd) {
        options.onEnd();
      }
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
    };

    this.synthesis.speak(utterance);
  }

  // Stop current speech
  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }

  // Check if currently speaking
  isSpeaking(): boolean {
    return this.synthesis ? this.synthesis.speaking : false;
  }

  // Get available voices
  getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synthesis) return [];
    return this.synthesis.getVoices();
  }

  // Get voices for specific languages
  getVoicesForLanguage(language: string): SpeechSynthesisVoice[] {
    const voices = this.getAvailableVoices();
    return voices.filter((voice) => voice.lang.startsWith(language));
  }

  // Check if service is supported
  isVoiceSupported(): boolean {
    return this.isSupported && this.synthesis !== null;
  }

  // Get supported languages for speech recognition
  getSupportedLanguages(): string[] {
    // Common languages supported by most browsers
    return [
      "en-US",
      "en-GB",
      "en-AU",
      "en-CA",
      "hi-IN",
      "bn-IN",
      "as-IN", // Indian languages
      "es-ES",
      "fr-FR",
      "de-DE",
      "ja-JP",
      "ko-KR",
      "zh-CN",
      "ar-SA",
    ];
  }

  // Detect language from text (simple heuristic)
  detectLanguage(text: string): string {
    // Check for Assamese script (Unicode range: U+0980-U+09FF)
    const assameseRegex = /[\u0980-\u09FF]/;
    if (assameseRegex.test(text)) {
      return "as-IN";
    }

    // Check for Hindi script (Unicode range: U+0900-U+097F)
    const hindiRegex = /[\u0900-\u097F]/;
    if (hindiRegex.test(text)) {
      return "hi-IN";
    }

    // Default to English
    return "en-US";
  }
}

// Export singleton instance
export const voiceService = new VoiceService();
