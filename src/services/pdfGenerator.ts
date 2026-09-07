import { ClassGrade, GeneratedWorksheet, SubjectCategory, SupportedLanguage, WorksheetQuestion } from '../types/models';

export const WORKSHEET_MATRIX_THEMES: Record<ClassGrade, Record<SubjectCategory, { titleHindi: string; titleEnglish: string; theme: string }>> = {
  '1': {
    evs: { titleHindi: 'पर्यावरण (EVS)', titleEnglish: 'Environmental Studies', theme: 'My Family, Animals, Plants, Food (मेरा परिवार, पशु, पौधे, भोजन)' },
    language_ho: { titleHindi: 'हो भाषा (Language - Ho)', titleEnglish: 'Ho Language', theme: 'अक्षर पहचान, चित्र-शब्द, सुनो और बोलो (Warang Chiti / Ho Sounds)' },
    language_santhali: { titleHindi: 'संथाली भाषा (Language - Santhali)', titleEnglish: 'Santhali Language', theme: 'Ol Chiki / basic words, चित्र-शब्द, सुनो और बोलो' },
    language_mundari: { titleHindi: 'मुंडारी भाषा (Language - Mundari)', titleEnglish: 'Mundari Language', theme: 'अक्षर पहचान, चित्र-शब्द, सुनो और बोलो (Mundari Words)' },
    math: { titleHindi: 'गणित (Mathematics)', titleEnglish: 'Mathematics', theme: 'Numbers 1–20, counting, shapes, addition (संख्या ज्ञान 1–20, जोड़)' },
    english: { titleHindi: 'अंग्रेजी (English)', titleEnglish: 'English', theme: 'Alphabet, phonics, colours, numbers, simple words' },
    science: { titleHindi: 'पर्यावरण व विज्ञान (General Science)', titleEnglish: 'General Science', theme: 'Plants, Senses & Animals Around Us' },
    hindi: { titleHindi: 'हिंदी (Hindi)', titleEnglish: 'Hindi Language', theme: 'वर्णमाला, ध्वनि पहचान व सरल शब्द' },
  },
  '2': {
    evs: { titleHindi: 'पर्यावरण (EVS)', titleEnglish: 'Environmental Studies', theme: 'My School, Body Parts, Seasons, Animals (मेरा विद्यालय, शरीर के अंग, ऋतुएँ)' },
    language_ho: { titleHindi: 'हो भाषा (Language - Ho)', titleEnglish: 'Ho Language', theme: 'शब्द बनाना, छोटे वाक्य, matching (Word Formation & Short Sentences)' },
    language_santhali: { titleHindi: 'संथाली भाषा (Language - Santhali)', titleEnglish: 'Santhali Language', theme: 'Basic vocabulary, शब्द बनाना, छोटे वाक्य (Ol Chiki Sentences)' },
    language_mundari: { titleHindi: 'मुंडारी भाषा (Language - Mundari)', titleEnglish: 'Mundari Language', theme: 'Basic vocabulary, शब्द बनाना, छोटे वाक्य' },
    math: { titleHindi: 'गणित (Mathematics)', titleEnglish: 'Mathematics', theme: 'Numbers 1–100, addition, subtraction, patterns (गिनती 1–100, घटाव)' },
    english: { titleHindi: 'अंग्रेजी (English)', titleEnglish: 'English', theme: 'Vocabulary, simple sentences, reading, matching' },
    science: { titleHindi: 'विज्ञान (Science)', titleEnglish: 'Science', theme: 'Living things, Water, Seasons & Senses' },
    hindi: { titleHindi: 'हिंदी (Hindi)', titleEnglish: 'Hindi Language', theme: 'सरल वाक्य, चित्र वर्णन व मिलान' },
  },
  '3': {
    evs: { titleHindi: 'पर्यावरण (EVS)', titleEnglish: 'Environmental Studies', theme: 'Water, Plants, Food, Environment (जल, पेड़-पौधे, प्राकृतिक पर्यावरण)' },
    language_ho: { titleHindi: 'हो भाषा (Language - Ho)', titleEnglish: 'Ho Language', theme: 'Reading, vocabulary, sentence formation (पठन, शब्दावली, वाक्य निर्माण)' },
    language_santhali: { titleHindi: 'संथाली भाषा (Language - Santhali)', titleEnglish: 'Santhali Language', theme: 'Reading, vocabulary, sentence formation (Ol Chiki Comprehension)' },
    language_mundari: { titleHindi: 'मुंडारी भाषा (Language - Mundari)', titleEnglish: 'Mundari Language', theme: 'Reading, vocabulary, sentence formation' },
    math: { titleHindi: 'गणित (Mathematics)', titleEnglish: 'Mathematics', theme: 'Multiplication, division, fractions, measurement (गुणा, भाग, भिन्न, मापन)' },
    english: { titleHindi: 'अंग्रेजी (English)', titleEnglish: 'English', theme: 'Grammar basics, comprehension, vocabulary' },
    science: { titleHindi: 'विज्ञान (Science)', titleEnglish: 'Science', theme: 'Water Cycle, Plant Parts & Daily Nutrition' },
    hindi: { titleHindi: 'हिंदी (Hindi)', titleEnglish: 'Hindi Language', theme: 'कहानी पठन, व्याकरण व प्रश्न-उत्तर' },
  },
  '4': {
    evs: { titleHindi: 'पर्यावरण (EVS)', titleEnglish: 'Environmental Studies', theme: 'Human Body, Environment, Resources, Safety (मानव शरीर, प्राकृतिक संसाधन, सुरक्षा)' },
    language_ho: { titleHindi: 'हो भाषा (Language - Ho)', titleEnglish: 'Ho Language', theme: 'Paragraph reading, grammar, translation (अनुच्छेद पठन, व्याकरण, अनुवाद)' },
    language_santhali: { titleHindi: 'संथाली भाषा (Language - Santhali)', titleEnglish: 'Santhali Language', theme: 'Paragraph reading, grammar, translation (Ol Chiki Translation)' },
    language_mundari: { titleHindi: 'मुंडारी भाषा (Language - Mundari)', titleEnglish: 'Mundari Language', theme: 'Paragraph reading, grammar, translation' },
    math: { titleHindi: 'गणित (Mathematics)', titleEnglish: 'Mathematics', theme: 'Fractions, decimals, geometry, word problems (दशमलव, ज्यामिति, इबारती सवाल)' },
    english: { titleHindi: 'अंग्रेजी (English)', titleEnglish: 'English', theme: 'Tenses, grammar, comprehension, writing' },
    science: { titleHindi: 'विज्ञान (Science)', titleEnglish: 'Science', theme: 'Human Physiology, Matter & Natural Habitats' },
    hindi: { titleHindi: 'हिंदी (Hindi)', titleEnglish: 'Hindi Language', theme: 'व्याकरण, काल, निबंध व मातृभाषा अनुवाद' },
  },
  '5': {
    evs: { titleHindi: 'पर्यावरण (EVS)', titleEnglish: 'Environmental Studies', theme: 'Ecosystem, Health, Natural Resources, Pollution (पारिस्थितिकी, स्वास्थ्य, प्रदूषण)' },
    language_ho: { titleHindi: 'हो भाषा (Language - Ho)', titleEnglish: 'Ho Language', theme: 'Story/paragraph, comprehension, translation (लोककथा पठन, समझ व अनुवाद)' },
    language_santhali: { titleHindi: 'संथाली भाषा (Language - Santhali)', titleEnglish: 'Santhali Language', theme: 'Story/paragraph, comprehension, translation (Tribal Folklore Translation)' },
    language_mundari: { titleHindi: 'मुंडारी भाषा (Language - Mundari)', titleEnglish: 'Mundari Language', theme: 'Story/paragraph, comprehension, translation' },
    math: { titleHindi: 'गणित (Mathematics)', titleEnglish: 'Mathematics', theme: 'Decimals, fractions, geometry, percentages, problem solving (प्रतिशत, ज्यामिति)' },
    english: { titleHindi: 'अंग्रेजी (English)', titleEnglish: 'English', theme: 'Grammar, comprehension, paragraph writing, vocabulary' },
    science: { titleHindi: 'विज्ञान (Science)', titleEnglish: 'Science', theme: 'Ecosystem, Energy, Food Chains & Conservation' },
    hindi: { titleHindi: 'हिंदी (Hindi)', titleEnglish: 'Hindi Language', theme: 'अपठित गद्यांश, रचनात्मक लेखन व द्विभाषी संवाद' },
  },
};

export class CanvasPdfGeneratorService {
  public static generateWorksheet(grade: ClassGrade, subject: SubjectCategory, language: SupportedLanguage): GeneratedWorksheet {
    const isJunior = grade === '1' || grade === '2';
    const themeInfo = WORKSHEET_MATRIX_THEMES[grade]?.[subject] || WORKSHEET_MATRIX_THEMES['1']['evs'];

    let questions: WorksheetQuestion[] = [];

    if (isJunior) {
      // CLASS 1-2 QUESTION TYPES: Identify, Picture Matching, Tracing, Listen & Repeat, Match Pairs, Basic Counting
      questions = [
        {
          id: 'q1',
          type: 'identify',
          questionPromptHindi: '1. अक्षर / चित्र पहचानें (Identify the Letter & Animal):',
          questionPromptTribal: {
            ho: 'Mutha ar ol chiti upurumpe',
            santhali: 'Chitor ar ol chiki uprom me',
            mundari: 'Chabi ar varnamala upurum pe',
          },
          options: ['🐄 गाय (Uri / Gai)', '🐕 कुत्ता (Seta)', '🐈 बिल्ली (Pusi / Bili)', '🐘 हाथी (Hati)'],
          correctAnswer: '🐄 गाय (Uri / Gai)',
          points: 3,
        },
        {
          id: 'q2',
          type: 'tracing',
          questionPromptHindi: '2. बिंदुओं पर पेंसिल चलाकर अक्षर लिखें (Trace the Letters / Script):',
          questionPromptTribal: {
            ho: 'Dundul re olpe (Warang Chiti)',
            santhali: 'Bindu re olme (Ol Chiki)',
            mundari: 'Bindu re olpe',
          },
          tracingText: language === 'santhali' ? 'ᱚ ᱛ ᱜ ᱝ ᱞ ᱟ ᱠ ᱡ ᱢ ᱣ' : language === 'ho' ? '𑢹 𑣉 𑢯 𑣁 𑢩 𑣁 𑢜 𑣁' : 'अ  आ  इ  ई  उ  ऊ  ए  ऐ',
          correctAnswer: 'tracing_done',
          points: 4,
        },
        {
          id: 'q3',
          type: 'listenRepeat',
          questionPromptHindi: '3. सुनो और बोलो (Listen & Repeat the Tribal Word):',
          questionPromptTribal: {
            ho: 'Ayunpe ar kajipe: Da (दाः - Water)',
            santhali: 'Anjom me ar rorme: Dah (ᱫᱟᱜ - Water)',
            mundari: 'Ayumpe ar kajipe: Da (दाः - Water)',
          },
          audioSpokenText: language === 'santhali' ? 'ᱫᱟᱜ (Dah)' : 'दाः (Da)',
          correctAnswer: 'audio_repeated',
          points: 3,
        },
        {
          id: 'q4',
          type: 'matching',
          questionPromptHindi: '4. सही चित्र और शब्द के जोड़े मिलाएँ (Match the Pairs):',
          questionPromptTribal: {
            ho: 'Bugi joda misape',
            santhali: 'Sahi joda milao me',
            mundari: 'Sahi joda milao pe',
          },
          leftItems: ['🌳 पेड़ (Tree)', '☀️ सूरज (Sun)', '💧 पानी (Water)', '🏠 घर (House)'],
          rightItems: ['Singi / सिंगी', 'Daru / दारू', 'Orak / ओड़ाः', 'Da / Dah / दाः'],
          correctAnswer: 'matrix_matched',
          points: 4,
        },
        {
          id: 'q5',
          type: 'counting',
          questionPromptHindi: '5. वस्तुओं को गिनकर संख्या लिखें (Count and Write):',
          questionPromptTribal: {
            ho: 'Samanko leka kete olpe',
            santhali: 'Jinish lekha kate olme',
            mundari: 'Saman leka kete olpe',
          },
          tracingText: '🍎 🍎 🍎 🍎 🍎 = _____ (संख्या / Tribal Word)',
          correctAnswer: '5 / Moya / Mone',
          points: 4,
        },
      ];
    } else {
      // CLASS 3-5 QUESTION TYPES: Fill in the Blanks, MCQs, Match/Arrange, Reading Comprehension, Hindi <-> Tribal Translation, Speaking, Written
      questions = [
        {
          id: 'q1',
          type: 'fillBlank',
          questionPromptHindi: '1. उपयुक्त शब्द से रिक्त स्थान भरें (Fill in the Blanks):',
          questionPromptTribal: {
            ho: 'Bugi kaji te khali tha perepe',
            santhali: 'Sahi ror te khali thawe perej me',
            mundari: 'Bugi kaji te khali tha perepe',
          },
          tracingText: language === 'santhali' ? 'ᱯᱮᱲ ᱠᱚ ᱟᱵᱚ ᱥᱟᱱᱛᱷᱟᱞᱤ ᱨᱮ ___________ (Dare) ᱠᱚ ᱢᱮᱛᱟᱜ-ᱟ।' : 'पेड़ को संथाली/हो में __________ (Dare/Daru) कहते हैं।',
          correctAnswer: 'Dare / Daru',
          points: 3,
        },
        {
          id: 'q2',
          type: 'mcq',
          questionPromptHindi: '2. सही विकल्प चुनें (Multiple Choice Question):',
          questionPromptTribal: {
            ho: 'Sahi kaji bachanpe',
            santhali: 'Sahi uttor bhalo kate bachaome',
            mundari: 'Sahi kaji chunao pe',
          },
          options: [
            'क) सरहुल (Sarhul / Baha Parab)',
            'ख) करमा (Karma)',
            'ग) सोहराय (Sohrai)',
            'घ) उपर्युक्त सभी (All of above)',
          ],
          correctAnswer: 'घ) उपर्युक्त सभी (All of above)',
          points: 3,
        },
        {
          id: 'q3',
          type: 'comprehension',
          questionPromptHindi: '3. गद्यांश पढ़कर प्रश्न का उत्तर दें (Reading Comprehension):',
          questionPromptTribal: {
            ho: 'Kani padao kete kajipe',
            santhali: 'Kahni parhao kate uttor emme',
            mundari: 'Kahani padao kete kajipe',
          },
          comprehensionPassage: 'झारखंड के वनों में महुआ, साल (सखुआ) और पलाश के सुंदर पेड़ पाए जाते हैं। वसंत ऋतु में सरहुल पर्व पर सखुआ के फूलों (बाहा) की पूजा की जाती है।',
          tracingText: 'प्रश्न: सरहुल पर्व पर किस वृक्ष के फूलों की पूजा की जाती है?\nउत्तर: __________________________________________________',
          correctAnswer: 'साल / सखुआ (Baha / Sarjom)',
          points: 4,
        },
        {
          id: 'q4',
          type: 'translation',
          questionPromptHindi: '4. हिंदी से मातृभाषा में अनुवाद करें (Hindi ➔ Tribal Translation):',
          questionPromptTribal: {
            ho: 'Hindi kaji Ho kaji re badlipe',
            santhali: 'Hindi katha Santhali te tarjuma me',
            mundari: 'Hindi kaji Mundari re badlipe',
          },
          tracingText: 'वाक्य: "हम सब प्रतिदिन विद्यालय जाते हैं।"\nअनुवाद: __________________________________________________',
          correctAnswer: 'Abu soben din iskul te senotana / Abo dinem asra tebon chalao-a.',
          points: 4,
        },
        {
          id: 'q5',
          type: 'speaking',
          questionPromptHindi: '5. मौखिक अभिव्यक्ति (Speaking Question - Whisper.cpp + Piper TTS):',
          questionPromptTribal: {
            ho: 'Mic dabao kete moko kajipe (Speak into Mic)',
            santhali: 'Mic jote kate rorme (Speak into Mic)',
            mundari: 'Mic dabao kete kajipe (Speak into Mic)',
          },
          audioSpokenText: 'Apu hatu re kichi daruko menah? (आपके गाँव में कौन-कौन से पेड़ हैं?)',
          tracingText: '🎙️ माइक दबाएँ और अपनी मातृभाषा में 2 वाक्य बोलें।',
          correctAnswer: 'spoken_evaluation_verified',
          points: 4,
        },
      ];
    }

    return {
      id: `ws_${grade}_${subject}_${Date.now()}`,
      grade,
      subject,
      subjectTitle: themeInfo.titleHindi,
      themeTitle: themeInfo.theme,
      targetLanguage: language,
      generatedAt: new Date().toLocaleDateString('hi-IN'),
      questions,
    };
  }
}
