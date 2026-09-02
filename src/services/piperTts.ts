export interface PiperTtsOptions {
  speed: 0.75 | 1.0;
  voiceModelKey: 'ho_female' | 'santhali_male' | 'mundari_standard';
}

export class PiperTtsService {
  private static isSpeaking: boolean = false;

  public static async speak(text: string, options?: Partial<PiperTtsOptions>): Promise<void> {
    this.isSpeaking = true;
    const speed = options?.speed || 1.0;

    // Use Web SpeechSynthesis API as lightweight cross-platform runtime fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speed;
      utterance.lang = 'hi-IN';
      utterance.onend = () => {
        this.isSpeaking = false;
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        this.isSpeaking = false;
      }, 1500);
    }
  }

  public static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
  }
}
