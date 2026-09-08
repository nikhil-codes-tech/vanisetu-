/**
 * Piper TTS Offline Text-to-Speech Engine Integration
 * Ultra-fast offline neural TTS optimized for low-cost Android hardware (~2 GB RAM)
 */

export interface PiperTtsOptions {
  speed: 0.75 | 0.85 | 1.0;
  voiceModelKey?: 'ho_female' | 'santhali_male' | 'mundari_standard' | 'hindi_female';
  pitch?: number;
}

const DEVANAGARI_PHONETIC_MAP: Record<string, string> = {
  // Math & Numbers
  "संख्या": "Sankhya",
  "जोड़": "Jod",
  "घटाव": "Ghataav",
  "गुना": "Guna",
  "भाग": "Bhaag",
  "एक": "Ek",
  "दो": "Do",
  "तीन": "Teen",
  "चार": "Chaar",
  "पाँच": "Paanch",
  "छह": "Chhah",
  "सात": "Saat",
  "आठ": "Aath",
  "नौ": "Nau",
  "दस": "Das",

  // EVS & Nature
  "पानी": "Paani",
  "पेड़": "Ped",
  "पत्ता": "Patta",
  "हवा": "Hawa",
  "मिट्टी": "Mitti",
  "फल": "Phal",
  "फूल": "Phool",
  "बीज": "Beej",
  "जंगल": "Jangal",
  "गाय": "Gaay",
  "कुत्ता": "Kutta",
  "बिल्ली": "Billi",
  "हाथी": "Haathi",
  "बकरी": "Bakri",
  "शेर": "Sher",
  "धूप": "Dhoop",
  "बारिश": "Baarish",
  "वर्षा": "Varsha",
  "किताब": "Kitaab",
  "कॉपी": "Copy",
  "कलम": "Kalam",
  "स्कूल": "School",
  "कक्षा": "Kaksha",
  "बच्चे": "Bachche",
  "शिक्षक": "Shikshak",
  "भाषा": "Bhasha",
  "अक्षर": "Akshar",
  "सजीव": "Sajeev",

  // Ho words
  "लेखा": "Lekha",
  "मेसा": "Mesa",
  "रे": "Re",
  "हाटिंग": "Hating",
  "मियाद": "Miyad",
  "बरिया": "Bariya",
  "आपिया": "Apiya",
  "उपूनिया": "Upuniya",
  "मोयआ": "Moy-a",
  "तुरूईया": "Turuiya",
  "अइया": "Aiya",
  "इरिलिया": "Iriliya",
  "आरेया": "Areya",
  "गेलेया": "Geleya",
  "दाः": "Daa",
  "दारू": "Daru",
  "साकाम": "Sakam",
  "होयो": "Hoyo",
  "हासा": "Hasa",
  "जो": "Jo",
  "बा": "Baa",
  "जंग": "Jang",
  "बीर": "Bir",
  "गाई": "Gai",
  "सेता": "Seta",
  "बिलाई": "Bilai",
  "मेरम": "Meram",
  "कुला": "Kula",
  "ओलोंग": "Olong",
  "जीवों": "Jiwong",
  "कजी": "Kaji",
  "पुथी": "Puthi",
  "होनको": "Honko",
  "इतुकुल": "Itukul",
  "मांडी": "Mandi",
  "जोहार": "Johar",

  // Mundari words
  "हिसब": "Hisab",
  "जुमा": "Juma",
  "मिअद": "Miad",
  "मोईद": "Moid",
  "अपिआ": "Apia",
  "उपून": "Upun",
  "मोड़े": "Mode",
  "तुरूई": "Turui",
  "इरिल": "Iril",
  "मोड़ेया": "Modeya",
  "एया": "Eya",
  "बाहा": "Baha",
  "उरीः": "Uri",
  "पुसी": "Pusi",
  "हाती": "Hati",
  "काजी": "Kaji",
  "जगड़": "Jagad",
  "इता": "Ita",
  "सोन्दो": "Sondo",
  "हाई": "Hai",
  "मास्टर": "Master",
  "गोमके": "Gomke",
  "जोती": "Joti",
  "इनेन": "Inen",
  "इतु": "Itu",
  "आयुम": "Ayum",
  "फरचा": "Pharcha",
  "बानी": "Bani",
  "जिवान": "Jiwan",
  "भागा": "Bhaga",
  "अबू": "Abu",
  "अबूआः": "Abua",
  "तिसिंग": "Tising",
  "दरकार": "Darkar",
  "रेङ्गेः": "Renge",

  // Santhali words
  "एल्खा": "Elkha",
  "सेलेद": "Seled",
  "भेद": "Bhed",
  "गाबॉन": "Gaban",
  "मित": "Mit",
  "बार": "Bar",
  "पे": "Pe",
  "पोन": "Pon",
  "मोणे": "Mone",
  "तुरुइ": "Turui",
  "एयाय": "Eyay",
  "इरल": "Iral",
  "आरे": "Are",
  "गेल": "Gel",
  "दारे": "Dare",
  "होय": "Hoy",
  "बिरदाग़ाड़": "Birdagar",
  "दाका": "Daka",
  "तेहेंज": "Tehenj",
  "गिदराको": "Gidrako",
  "उताःइमे": "Utaime",
  "ञु": "Nyu",
  "आगु": "Aagu"
};

function transliterateDevanagariToLatin(devText: string): string {
  const charMap: Record<string, string> = {
    'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
    'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
    'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
    'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
    'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
    'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v', 'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
    'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
    'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h', 'ँ': 'n',
    'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au'
  };

  let latin = '';
  for (let i = 0; i < devText.length; i++) {
    const ch = devText[i];
    if (charMap[ch]) {
      latin += charMap[ch];
    } else if (/[a-zA-Z0-9\s]/.test(ch)) {
      latin += ch;
    }
  }
  return latin || devText;
}

export class PiperTtsService {
  private static isSpeaking: boolean = false;
  private static currentUtterance: any = null;

  /**
   * Synthesizes and speaks text offline using Piper neural voice model or device runtime
   */
  public static async speak(text: string, options?: Partial<PiperTtsOptions>): Promise<void> {
    if (!text || !text.trim()) return;
    this.isSpeaking = true;
    const speed = options?.speed || 0.85;

    // Extract Latin phonetic text if present in parentheses e.g. "लेखा (Lekha)" -> "Lekha"
    const parenMatch = text.match(/\(([^)]+)\)/);
    const englishPhoneticFromParen = parenMatch ? parenMatch[1].trim() : '';

    // Clean text of parenthetical annotations and native script glyphs
    const cleanText = text
      .replace(/\([^)]*\)/g, '')
      .replace(/[𑢵𑣁𑣌𑣁𑢾𑣁𑣜𑣁𑢷𑣁𑢸𑣁𑣁𑢯𑣁𑣚𑣃𑢶𑣁𑣚𑣃ᱚ-ᱽ]/g, '')
      .replace(/["'“”]/g, '')
      .trim() || text;

    // 1. Android Native / Electron Bridge hook for native Piper C++ executable
    if (typeof window !== 'undefined' && (window as any).vaniBridge?.piperSpeak) {
      try {
        await (window as any).vaniBridge.piperSpeak(cleanText, options?.voiceModelKey || 'ho_female', speed);
        this.isSpeaking = false;
        return;
      } catch (err) {
        console.warn('[Piper TTS] Native bridge execution failed, falling back to Web Speech:', err);
      }
    }

    // 2. Cross-platform Web Speech Synthesis Fallback
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.cancel();

        const voices = window.speechSynthesis.getVoices() || [];
        
        // Find Hindi/Indian or closest voice
        const hiVoice = voices.find(v => 
          v.lang === 'hi-IN' || 
          v.lang.startsWith('hi') || 
          v.name.toLowerCase().includes('hindi')
        );
        const inVoice = voices.find(v => 
          v.lang.includes('IN') || 
          v.name.toLowerCase().includes('india')
        );
        const defaultVoice = voices.find(v => v.default) || voices[0];

        // Choose text to utter:
        // If Hindi voice is present, utter standard Devanagari text.
        // If only English voice is available, use phonetic spelling (e.g. "Lekha", "Mesa", "Sankhya")
        let textToUtter = cleanText;
        if (!hiVoice) {
          const dictPhonetic = DEVANAGARI_PHONETIC_MAP[cleanText];
          if (englishPhoneticFromParen) {
            textToUtter = englishPhoneticFromParen;
          } else if (dictPhonetic) {
            textToUtter = dictPhonetic;
          } else if (/[\u0900-\u097F]/.test(cleanText)) {
            textToUtter = transliterateDevanagariToLatin(cleanText);
          }
        }

        const utterance = new SpeechSynthesisUtterance(textToUtter);
        utterance.rate = speed;
        utterance.pitch = options?.pitch || 1.0;

        if (hiVoice) {
          utterance.voice = hiVoice;
          utterance.lang = 'hi-IN';
        } else if (inVoice) {
          utterance.voice = inVoice;
          utterance.lang = inVoice.lang || 'en-IN';
        } else if (defaultVoice) {
          utterance.voice = defaultVoice;
          utterance.lang = defaultVoice.lang || 'en-US';
        } else {
          utterance.lang = 'hi-IN';
        }

        this.currentUtterance = utterance;
        (window as any)._piperActiveUtterance = utterance;

        utterance.onend = () => {
          this.isSpeaking = false;
          this.currentUtterance = null;
          (window as any)._piperActiveUtterance = null;
        };
        utterance.onerror = (e) => {
          console.warn('[Piper TTS] Utterance error:', e);
          this.isSpeaking = false;
          this.currentUtterance = null;
          (window as any)._piperActiveUtterance = null;
        };

        // Small delay avoids Chromium cancel-speak race condition
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }, 20);

      } catch (e) {
        console.warn('[Piper TTS] Speech synthesis invocation failed:', e);
        this.isSpeaking = false;
      }
    } else {
      setTimeout(() => {
        this.isSpeaking = false;
      }, 1200);
    }
  }

  /**
   * Halts current audio playback
   */
  public static stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  public static getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}

export default PiperTtsService;

