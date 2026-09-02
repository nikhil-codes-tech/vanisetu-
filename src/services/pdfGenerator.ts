import { ClassGrade, GeneratedWorksheet, SubjectCategory, SupportedLanguage } from '../types/models';

export class CanvasPdfGeneratorService {
  public static generateSampleWorksheet(grade: ClassGrade, subject: SubjectCategory, language: SupportedLanguage): GeneratedWorksheet {
    return {
      id: `ws_${Date.now()}`,
      grade,
      subject,
      chapterTitle: `कक्षा ${grade} - ${subject.toUpperCase()} भाषा कार्यपत्रक`,
      targetLanguage: language,
      generatedAt: new Date().toLocaleDateString('hi-IN'),
      questions: [
        {
          id: 'q1',
          type: 'tracing',
          questionPromptHindi: '1. नीचे दिए गए अक्षरों को बिंदुओं पर हाथ फेरकर लिखें (Trace the letters):',
          questionPromptTribal: {
            ho: 'Ol chiti dundul re olpe',
            santhali: 'Ol chiki bindu re olme',
            mundari: 'Akhor bindu re olpe',
          },
          tracingText: language === 'santhali' ? 'ᱚ ᱞ ᱪ ᱤ ᱠ ᱤ' : language === 'ho' ? '𑢹 𑣉 𑢯 𑣁 𑢩' : 'अ आ इ ई उ ऊ',
          correctAnswer: 'tracing_done',
          points: 5,
        },
        {
          id: 'q2',
          type: 'matching',
          questionPromptHindi: '2. सही जोड़े मिलाएँ (Match the correct pairs):',
          questionPromptTribal: {
            ho: 'Bugi joda misape',
            santhali: 'Sahi joda milao me',
            mundari: 'Sahi joda milao pe',
          },
          leftItems: ['गाय (Cow)', 'सूरज (Sun)', 'पानी (Water)', 'पेड़ (Tree)'],
          rightItems: ['Dah / दाः', 'Uri / उरी', 'Daru / दारू', 'Singi / सिंगी'],
          correctAnswer: 'match_matrix',
          points: 4,
        },
        {
          id: 'q3',
          type: 'counting',
          questionPromptHindi: '3. चित्र गिनकर सही संख्या लिखें (Count and write number):',
          questionPromptTribal: {
            ho: 'Mutha leka kete olpe',
            santhali: 'Chitor lekha kate olme',
            mundari: 'Chabi leka kete olpe',
          },
          tracingText: '⭐⭐⭐ = ___',
          correctAnswer: '3 / Apiya / Pe',
          points: 3,
        },
        {
          id: 'q4',
          type: 'fillBlank',
          questionPromptHindi: "4. रिक्त स्थान भरें: 'गाय' को संथाली में ______ कहते हैं।",
          questionPromptTribal: {
            ho: 'Khali tha perepe: Gai',
            santhali: 'Khali thawe perej me: ᱜᱟᱹᱭ',
            mundari: 'Khali tha perepe: Uri',
          },
          correctAnswer: 'ᱜᱟᱹᱭ / Gai',
          points: 3,
        },
        {
          id: 'q5',
          type: 'translation',
          questionPromptHindi: "5. अपनी मातृभाषा में अपना नाम और विद्यालय का नाम लिखें:",
          questionPromptTribal: {
            ho: 'Apu upurum ar iskul nutum olpe',
            santhali: 'Ama uprom ar asra nutum olme',
            mundari: 'Ama upurum ar iskul nutum olpe',
          },
          tracingText: 'मेरा नाम: _______________  |  विद्यालय: _______________',
          correctAnswer: 'self_intro',
          points: 5,
        },
      ],
    };
  }
}
