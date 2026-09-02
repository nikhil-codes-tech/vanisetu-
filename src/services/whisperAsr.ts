export interface WhisperAsrResult {
  text: string;
  language: string;
  durationSeconds: number;
  confidence: number;
}

export class WhisperAsrService {
  private static isListening: boolean = false;

  public static async startListening(onPartialText?: (text: string) => void): Promise<void> {
    this.isListening = true;
    if (onPartialText) {
      setTimeout(() => onPartialText('सुन रहा हूँ... (Listening...)'), 400);
      setTimeout(() => onPartialText('नमस्ते गुरुजी, पानी कहाँ है?'), 1200);
    }
  }

  public static async stopListening(): Promise<WhisperAsrResult> {
    this.isListening = false;
    return {
      text: 'नमस्ते गुरुजी, पानी कहाँ है?',
      language: 'hi',
      durationSeconds: 2.4,
      confidence: 0.96,
    };
  }
}
