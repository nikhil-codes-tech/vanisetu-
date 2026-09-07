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
    const themeInfo = WORKSHEET_MATRIX_THEMES[grade]?.[subject] || WORKSHEET_MATRIX_THEMES['1']['evs'];

    let questions: WorksheetQuestion[] = [];

    // ==========================================
    // CLASS 1 DEDICATED WORKSHEETS
    // ==========================================
    if (grade === '1') {
      if (subject === 'evs') {
        questions = [
          {
            id: 'c1_evs_1',
            type: 'identify',
            questionPromptHindi: '1. चित्र पहचानें और परिवार/पशु का नाम बताएं (Identify Family & Animals):',
            questionPromptTribal: { ho: 'Apu owa ar jontuko upurumpe', santhali: 'Inyak orak ar jontu uprom me', mundari: 'Aing ora ar jontuko upurum pe' },
            options: ['🐄 गाय (Uri / Gai)', '👨‍👩‍👦 परिवार (Family)', '🌳 पेड़ (Daru / Dare)', '🍚 भात/खाना (Mandi / Daka)'],
            correctAnswer: '🐄 गाय (Uri / Gai)',
            points: 4,
          },
          {
            id: 'c1_evs_2',
            type: 'tracing',
            questionPromptHindi: '2. बिंदुओं पर पेंसिल चलाकर भोजन व जल के नाम लिखें (Trace Food & Water Words):',
            questionPromptTribal: { ho: 'Mandi ar Da dundul re olpe', santhali: 'Daka ar Dah bindu re olme', mundari: 'Mandi ar Da bindu re olpe' },
            tracingText: language === 'santhali' ? 'ᱫ ᱟ ᱠ ᱟ   |   ᱫ ᱟ ᱜ' : language === 'ho' ? '𑢭 𑣁 𑣓 𑣵 𑣂   |   𑢵 𑣁' : 'भोजन  |  पानी  |  पेड़',
            correctAnswer: 'tracing_done',
            points: 4,
          },
          {
            id: 'c1_evs_3',
            type: 'listenRepeat',
            questionPromptHindi: '3. सुनो और बोलो - घरेलू पशु का नाम (Listen & Repeat Animal Names):',
            questionPromptTribal: { ho: 'Ayunpe ar kajipe: Uri (गाय)', santhali: 'Anjom me ar rorme: Gai (ᱜᱟᱹᱭ)', mundari: 'Ayumpe ar kajipe: Uri (गाय)' },
            audioSpokenText: language === 'santhali' ? 'ᱜᱟᱹᱭ (Gai)' : 'उरी (Uri)',
            correctAnswer: 'audio_done',
            points: 4,
          },
          {
            id: 'c1_evs_4',
            type: 'matching',
            questionPromptHindi: '4. सही जोड़े मिलाएँ (Match Plant & Animal Pairs):',
            questionPromptTribal: { ho: 'Bugi joda misape', santhali: 'Sahi joda milao me', mundari: 'Sahi joda milao pe' },
            leftItems: ['🌳 पेड़ (Tree)', '🐄 गाय (Cow)', '🍚 भोजन (Food)', '☀️ सूरज (Sun)'],
            rightItems: ['Uri / Gai (उरी)', 'Daru / Dare (दारू)', 'Singi (सिंगी)', 'Mandi / Daka (भात)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c1_evs_5',
            type: 'counting',
            questionPromptHindi: '5. फल गिनकर संख्या लिखें (Count the Fruits):',
            questionPromptTribal: { ho: 'Joo leka kete olpe', santhali: 'Jo lekha kate olme', mundari: 'Joo leka kete olpe' },
            tracingText: '🍎 🍎 🍎 = _____ (संख्या लिखें / Write Number)',
            correctAnswer: '3 / Apiya / Pe',
            points: 4,
          },
        ];
      } else if (subject === 'language_ho') {
        questions = [
          {
            id: 'c1_ho_1',
            type: 'identify',
            questionPromptHindi: '1. वारंग क्षिति (Warang Chiti) अक्षर पहचानें (Identify Ho Script):',
            questionPromptTribal: { ho: 'Warang Chiti ol upurumpe', santhali: 'Warang Chiti akhor uprom me', mundari: 'Warang Chiti upurum pe' },
            options: ['𑢹 (Ha)', '𑢵 (Da)', '𑢷 (Ba)', '𑢭 (Ma)'],
            correctAnswer: '𑢹 (Ha)',
            points: 4,
          },
          {
            id: 'c1_ho_2',
            type: 'tracing',
            questionPromptHindi: '2. बिंदुओं पर वारंग क्षिति अक्षर लिखें (Trace Warang Chiti Letters):',
            questionPromptTribal: { ho: 'Warang Chiti dundul re olpe', santhali: 'Warang Chiti bindu re olme', mundari: 'Warang Chiti dundul re olpe' },
            tracingText: '𑢹   𑣉   𑢯   𑣁   𑢩   𑣁   𑢜   𑣁',
            correctAnswer: 'tracing_done',
            points: 4,
          },
          {
            id: 'c1_ho_3',
            type: 'listenRepeat',
            questionPromptHindi: '3. सुनो और बोलो (Listen & Repeat in Ho):',
            questionPromptTribal: { ho: 'Ayunpe ar kajipe: Johar (नमस्ते)', santhali: 'Anjom me ar rorme: Johar', mundari: 'Ayumpe ar kajipe: Johar' },
            audioSpokenText: 'जोहार (Johar)',
            correctAnswer: 'audio_done',
            points: 4,
          },
          {
            id: 'c1_ho_4',
            type: 'matching',
            questionPromptHindi: '4. चित्र को हो (Ho) भाषा के सही शब्द से मिलाएँ:',
            questionPromptTribal: { ho: 'Mutha ar Ho kaji joda misape', santhali: 'Chitor ar Ho katha milao me', mundari: 'Chabi ar Ho kaji milao pe' },
            leftItems: ['🐦 चिड़िया', '🐅 बाघ', '🐕 कुत्ता', '🐟 मछली'],
            rightItems: ['Kula (कुला)', 'Chene (चेने)', 'Haku (हाकु)', 'Seta (सेता)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c1_ho_5',
            type: 'counting',
            questionPromptHindi: '5. हो (Ho) भाषा में गिनती लिखें (Count in Ho):',
            questionPromptTribal: { ho: 'Ho te leka kete olpe', santhali: 'Ho te lekha kate olme', mundari: 'Ho te leka kete olpe' },
            tracingText: '⭐ ⭐ = Miyad (१), ____________ (२)',
            correctAnswer: 'Bariya / 𑢷𑣁𑣜𑣂𑣅𑣁',
            points: 4,
          },
        ];
      } else if (subject === 'language_santhali') {
        questions = [
          {
            id: 'c1_san_1',
            type: 'identify',
            questionPromptHindi: '1. ओल चिकी (Ol Chiki) अक्षर पहचानें (Identify Ol Chiki Script):',
            questionPromptTribal: { ho: 'Ol Chiki akhor upurumpe', santhali: 'Ol Chiki akhor uprom me', mundari: 'Ol Chiki akhor upurum pe' },
            options: ['ᱚ (Laa)', 'ᱛ (At)', 'ᱜ (Ag)', 'ᱝ (Ang)'],
            correctAnswer: 'ᱚ (Laa)',
            points: 4,
          },
          {
            id: 'c1_san_2',
            type: 'tracing',
            questionPromptHindi: '2. ओल चिकी अक्षरों पर पेंसिल चलाएँ (Trace Ol Chiki Letters):',
            questionPromptTribal: { ho: 'Ol Chiki dundul re olpe', santhali: 'Ol Chiki bindu re olme', mundari: 'Ol Chiki bindu re olpe' },
            tracingText: 'ᱚ   ᱛ   ᱜ   ᱝ   ᱞ   ᱟ   ᱠ   ᱡ   ᱢ   ᱣ',
            correctAnswer: 'tracing_done',
            points: 4,
          },
          {
            id: 'c1_san_3',
            type: 'listenRepeat',
            questionPromptHindi: '3. सुनो और बोलो (Listen & Repeat in Santhali):',
            questionPromptTribal: { ho: 'Ayunpe ar kajipe: Dah (पानी)', santhali: 'Anjom me ar rorme: Dah (ᱫᱟᱜ)', mundari: 'Ayumpe ar kajipe: Da' },
            audioSpokenText: 'ᱫᱟᱜ (Dah)',
            correctAnswer: 'audio_done',
            points: 4,
          },
          {
            id: 'c1_san_4',
            type: 'matching',
            questionPromptHindi: '4. चित्र को संथाली (Ol Chiki) शब्द से मिलाएँ:',
            questionPromptTribal: { ho: 'Mutha ar Santhali kaji misape', santhali: 'Chitor ar Ol Chiki katha jorao me', mundari: 'Chabi ar Santhali kaji milao pe' },
            leftItems: ['🐱 बिल्ली', '🐕 कुत्ता', '🌳 पेड़', '🐄 गाय'],
            rightItems: ['ᱥᱮᱛᱟ (Seta)', 'ᱯᱩᱥᱤ (Pusi)', 'ᱜᱟᱹᱭ (Gai)', 'ᱫᱟᱨᱮ (Dare)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c1_san_5',
            type: 'counting',
            questionPromptHindi: '5. संथाली में गिनती पूरी करें (Count in Santhali):',
            questionPromptTribal: { ho: 'Santhali te leka perepe', santhali: 'Santhali te lekha perej me', mundari: 'Santhali te leka perepe' },
            tracingText: 'Mit (᱑), Bar (᱒), ____________ (᱓)',
            correctAnswer: 'Pe / ᱯᱮ',
            points: 4,
          },
        ];
      } else if (subject === 'math') {
        questions = [
          {
            id: 'c1_math_1',
            type: 'counting',
            questionPromptHindi: '1. गिनें और सही संख्या लिखें (Count the Objects 1–10):',
            questionPromptTribal: { ho: 'Samanko leka kete olpe', santhali: 'Jinish lekha kate olme', mundari: 'Saman leka kete olpe' },
            tracingText: '⚽ ⚽ ⚽ ⚽ = _____ (संख्या / Number)',
            correctAnswer: '4 / Upuniya / Pone',
            points: 4,
          },
          {
            id: 'c1_math_2',
            type: 'tracing',
            questionPromptHindi: '2. संख्या 1 से 10 तक बिंदुओं पर लिखें (Trace Numbers 1 to 10):',
            questionPromptTribal: { ho: 'Ginti dundul re olpe', santhali: 'Lekha bindu re olme', mundari: 'Ginti bindu re olpe' },
            tracingText: '१   २   ३   ४   ५   ६   ७   ८   ९   १०',
            correctAnswer: 'tracing_done',
            points: 4,
          },
          {
            id: 'c1_math_3',
            type: 'identify',
            questionPromptHindi: '3. गोल आकृति (Circle / Gol) पहचानें (Identify Circle Shape):',
            questionPromptTribal: { ho: 'Gol mutha upurumpe', santhali: 'Gol muthan uprom me', mundari: 'Gol mutha upurum pe' },
            options: ['🔴 गोल / वृत्त (Circle)', '⬛ चौकोर (Square)', '🔺 त्रिकोण (Triangle)', '⭐ सितारा (Star)'],
            correctAnswer: '🔴 गोल / वृत्त (Circle)',
            points: 4,
          },
          {
            id: 'c1_math_4',
            type: 'matching',
            questionPromptHindi: '4. सरल जोड़ का मिलान करें (Match Simple Addition):',
            questionPromptTribal: { ho: 'Misa joda misape', santhali: 'Mesawa jorao me', mundari: 'Juma joda milao pe' },
            leftItems: ['१ + १ =', '२ + १ =', '२ + २ =', '३ + २ ='],
            rightItems: ['४ (चार / Upuniya)', '२ (दो / Bariya)', '५ (पाँच / Moya)', '३ (तीन / Apiya)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c1_math_5',
            type: 'identify',
            questionPromptHindi: '5. कौन सा समूह बड़ा है? (Which group has more items?):',
            questionPromptTribal: { ho: 'Okoni marang menah?', santhali: 'Oka do marang gea?', mundari: 'Okoni marang mena?' },
            options: ['समूह A: 🌳 🌳 🌳 🌳 🌳 (5)', 'समूह B: 🌳 🌳 (2)'],
            correctAnswer: 'समूह A: 🌳 🌳 🌳 🌳 🌳 (5)',
            points: 4,
          },
        ];
      } else if (subject === 'english') {
        questions = [
          {
            id: 'c1_eng_1',
            type: 'tracing',
            questionPromptHindi: '1. Trace Capital and Small Letters (A to E):',
            questionPromptTribal: { ho: 'English akhor dundul re olpe', santhali: 'English akhor bindu re olme', mundari: 'English akhor bindu re olpe' },
            tracingText: 'A a   B b   C c   D d   E e',
            correctAnswer: 'tracing_done',
            points: 4,
          },
          {
            id: 'c1_eng_2',
            type: 'matching',
            questionPromptHindi: '2. Match the Letters with Correct Pictures:',
            questionPromptTribal: { ho: 'Akhor ar mutha joda misape', santhali: 'Akhor ar chitor jorao me', mundari: 'Akhor ar chabi milao pe' },
            leftItems: ['A', 'B', 'C', 'D'],
            rightItems: ['🐕 Dog', '🍎 Apple', '⚽ Ball', '🐱 Cat'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c1_eng_3',
            type: 'listenRepeat',
            questionPromptHindi: '3. Listen and Repeat Phonics Sounds:',
            questionPromptTribal: { ho: 'Ayunpe ar kajipe: Sun (सूरज)', santhali: 'Anjom me ar rorme: Sun', mundari: 'Ayumpe ar kajipe: Sun' },
            audioSpokenText: 'Sun, Tree, Water, School',
            correctAnswer: 'audio_done',
            points: 4,
          },
          {
            id: 'c1_eng_4',
            type: 'identify',
            questionPromptHindi: '4. Identify the Colour of Leaf (हरा / Green):',
            questionPromptTribal: { ho: 'Sakam rong upurumpe', santhali: 'Sakam rong uprom me', mundari: 'Sakam rang upurum pe' },
            options: ['🟢 Green (हरा)', '🔴 Red (लाल)', '🔵 Blue (नीला)', '🟡 Yellow (पीला)'],
            correctAnswer: '🟢 Green (हरा)',
            points: 4,
          },
          {
            id: 'c1_eng_5',
            type: 'counting',
            questionPromptHindi: '5. Write the Number in English:',
            questionPromptTribal: { ho: 'English te number olpe', santhali: 'English te number olme', mundari: 'English te number olpe' },
            tracingText: '⭐ ⭐ ⭐ = O N E,  T W O,  ___________',
            correctAnswer: 'THREE',
            points: 4,
          },
        ];
      } else {
        // Class 1 Mundari & Science / Hindi
        questions = [
          {
            id: 'c1_gen_1',
            type: 'identify',
            questionPromptHindi: '1. चित्र देखकर पहला अक्षर बताएं (Identify Initial Sound):',
            questionPromptTribal: { ho: 'Pahila akhor upurumpe', santhali: 'Pahil akhor uprom me', mundari: 'Pahila akhor upurum pe' },
            options: ['अ (अनार)', 'आ (आम)', 'इ (इमली)', 'उ (उल्लू)'],
            correctAnswer: 'आ (आम)',
            points: 4,
          },
          {
            id: 'c1_gen_2',
            type: 'tracing',
            questionPromptHindi: '2. बिंदुओं पर स्वर वर्ण लिखें (Trace Vowels):',
            questionPromptTribal: { ho: 'Varnamala dundul re olpe', santhali: 'Varnamala bindu re olme', mundari: 'Varnamala bindu re olpe' },
            tracingText: 'अ   आ   इ   ई   उ   ऊ   ऋ   ए   ऐ   ओ   औ',
            correctAnswer: 'tracing_done',
            points: 4,
          },
          {
            id: 'c1_gen_3',
            type: 'listenRepeat',
            questionPromptHindi: '3. सुनो और बोलो - मुंडारी अभिवादन (Listen & Repeat):',
            questionPromptTribal: { ho: 'Ayunpe: Johar', santhali: 'Anjom me: Johar', mundari: 'Ayumpe: Johar (जोहार)' },
            audioSpokenText: 'जोहार (Johar)',
            correctAnswer: 'audio_done',
            points: 4,
          },
          {
            id: 'c1_gen_4',
            type: 'matching',
            questionPromptHindi: '4. पशु और उनकी आवाज का मिलान करें (Match Animals & Sounds):',
            questionPromptTribal: { ho: 'Jontu ar sari joda misape', santhali: 'Jontu ar sari jorao me', mundari: 'Jontu ar sari milao pe' },
            leftItems: ['🐕 कुत्ता (Seta)', '🐄 गाय (Uri)', '🐱 बिल्ली (Bili)', '🐦 चिड़िया (Chene)'],
            rightItems: ['चीं-चीं (Cheen-Cheen)', 'भौंकना (Bhaun-Bhaun)', 'म्याऊँ (Meow)', 'रंभाना (Rambhana)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c1_gen_5',
            type: 'counting',
            questionPromptHindi: '5. मुंडारी में संख्या लिखें (Numbers in Mundari):',
            questionPromptTribal: { ho: 'Mundari te leka olpe', santhali: 'Mundari te lekha olme', mundari: 'Mundari te leka olpe' },
            tracingText: 'Miyad (१), Bariya (२), ____________ (३)',
            correctAnswer: 'Apiya (३)',
            points: 4,
          },
        ];
      }
    }

    // ==========================================
    // CLASS 2 DEDICATED WORKSHEETS
    // ==========================================
    else if (grade === '2') {
      if (subject === 'evs') {
        questions = [
          {
            id: 'c2_evs_1',
            type: 'identify',
            questionPromptHindi: '1. शरीर के अंग पहचानें (Identify Body Parts - Ti, Med, Lutur):',
            questionPromptTribal: { ho: 'Horomo ang upurumpe', santhali: 'Hormo ang uprom me', mundari: 'Hormo ang upurum pe' },
            options: ['👀 आँख (Med / Met)', '👂 कान (Lutur)', '✋ हाथ (Ti)', '👄 मुँह (Macha)'],
            correctAnswer: '👀 आँख (Med / Met)',
            points: 4,
          },
          {
            id: 'c2_evs_2',
            type: 'matching',
            questionPromptHindi: '2. विद्यालय की वस्तुओं का मिलान करें (Match School Items):',
            questionPromptTribal: { ho: 'Iskul saman joda misape', santhali: 'Asra jinish jorao me', mundari: 'Iskul saman milao pe' },
            leftItems: ['📖 किताब (Book)', '✏️ पेंसिल (Pencil)', '🏫 विद्यालय (School)', '👨‍🏫 शिक्षक (Teacher)'],
            rightItems: ['Iskul / Asra (ᱟᱥᱲᱟ)', 'Pothi (ᱯᱩᱛᱷᱤ)', 'Master / Machet (ᱢᱟᱪᱮᱛ)', 'Kalam (ᱠᱚᱞᱚᱢ)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c2_evs_3',
            type: 'matching',
            questionPromptHindi: '3. मौसम व ऋतुओं का मिलान करें (Match Seasons):',
            questionPromptTribal: { ho: 'Rutu joda misape', santhali: 'Rutu jorao me', mundari: 'Rutu milao pe' },
            leftItems: ['🌧️ वर्षा ऋतु (Monsoon)', '☀️ ग्रीष्म ऋतु (Summer)', '❄️ शीत ऋतु (Winter)'],
            rightItems: ['Jeten (गर्मी / धूप)', 'Raban (सर्दी / ठंड)', 'Gama da / Dah jari (बारिश)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c2_evs_4',
            type: 'fillBlank',
            questionPromptHindi: '4. रिक्त स्थान भरें: हम अपनी आँखों से __________ हैं।',
            questionPromptTribal: { ho: 'Med te abu... (देखते हैं / Nela)', santhali: 'Met te abo... (ᱧᱮᱞ)', mundari: 'Med te abu... (Nelea)' },
            tracingText: 'उत्तर: ___________________ (देखते हैं / Nela / ᱧᱮᱞ)',
            correctAnswer: 'देखते हैं / Nela / ᱧᱮᱞ',
            points: 4,
          },
          {
            id: 'c2_evs_5',
            type: 'listenRepeat',
            questionPromptHindi: '5. सुनो और बोलो - विद्यालय का नियम (Listen & Speak):',
            questionPromptTribal: { ho: 'Ayunpe: Soben din iskul senotana', santhali: 'Anjom me: Dinem asra tebon chalao-a', mundari: 'Ayumpe: Soben din iskul sena' },
            audioSpokenText: 'हम प्रतिदिन विद्यालय जाते हैं (Abo dinem asra tebon chalao-a)',
            correctAnswer: 'audio_done',
            points: 4,
          },
        ];
      } else if (subject === 'math') {
        questions = [
          {
            id: 'c2_math_1',
            type: 'counting',
            questionPromptHindi: '1. 2-अंकीय जोड़ हल करें (2-Digit Addition):',
            questionPromptTribal: { ho: 'Misa hisab olpe', santhali: 'Mesawa hisab olme', mundari: 'Juma hisab olpe' },
            tracingText: '  २ ५  +  १ ४  =  __________ (39 / Untalis)',
            correctAnswer: '३९ / 39',
            points: 4,
          },
          {
            id: 'c2_math_2',
            type: 'counting',
            questionPromptHindi: '2. 2-अंकीय घटाव हल करें (2-Digit Subtraction):',
            questionPromptTribal: { ho: 'Hating hisab olpe', santhali: 'Ochoko hisab olme', mundari: 'Ghatav hisab olpe' },
            tracingText: '  ४ ८  -  २ ०  =  __________ (28 / Athais)',
            correctAnswer: '२८ / 28',
            points: 4,
          },
          {
            id: 'c2_math_3',
            type: 'fillBlank',
            questionPromptHindi: '3. संख्या पैटर्न पूरा करें (Complete Number Pattern):',
            questionPromptTribal: { ho: 'Ginti pattern perepe', santhali: 'Lekha pattern perej me', mundari: 'Ginti pattern perepe' },
            tracingText: '१०,  २०,  ३०,  ४०,  _____,  _____ (50, 60)',
            correctAnswer: '५०, ६० / 50, 60',
            points: 4,
          },
          {
            id: 'c2_math_4',
            type: 'identify',
            questionPromptHindi: '4. सही चिन्ह चुनें (<, >, =):  ६५  [  ]  ५६',
            questionPromptTribal: { ho: 'Sahi chinh bachanpe', santhali: 'Sahi chinh bachaome', mundari: 'Sahi chinh chunao pe' },
            options: ['>', '<', '='],
            correctAnswer: '>',
            points: 4,
          },
          {
            id: 'c2_math_5',
            type: 'fillBlank',
            questionPromptHindi: '5. इबारती सवाल: मोहन के पास 12 पेंसिल थी, 5 और मिल गईं। कुल कितनी हुईं?',
            questionPromptTribal: { ho: 'Misa kaji hisab olpe', santhali: 'Mesawa kahni hisab olme', mundari: 'Juma kaji hisab olpe' },
            tracingText: '१२ + ५ = _____ पेंसिल (17 Pencils)',
            correctAnswer: '17 / सत्रह',
            points: 4,
          },
        ];
      } else {
        // Class 2 Languages & English
        questions = [
          {
            id: 'c2_lang_1',
            type: 'fillBlank',
            questionPromptHindi: '1. दो अक्षरों को जोड़कर शब्द बनाएं (Form 2-Letter Words):',
            questionPromptTribal: { ho: 'Akhor misa kete kaji baipe', santhali: 'Akhor mesawa kate katha benaome', mundari: 'Akhor juma kete kaji baipe' },
            tracingText: 'द + र + ू = ____________ (दारू / Daru / Dare)',
            correctAnswer: 'दारू / Daru / ᱫᱟᱨᱮ',
            points: 4,
          },
          {
            id: 'c2_lang_2',
            type: 'matching',
            questionPromptHindi: '2. क्रिया शब्दों का मिलान करें (Match Action Verbs):',
            questionPromptTribal: { ho: 'Kame kaji joda misape', santhali: 'Kami ror jorao me', mundari: 'Kami kaji milao pe' },
            leftItems: ['पढ़ना (Read)', 'लिखना (Write)', 'खेलना (Play)', 'गाना (Sing)'],
            rightItems: ['Ol (ᱚᱞ / 𑢣𑢚)', 'Padao (ᱯᱟᱲᱦᱟᱣ)', 'Durang / Sereng (ᱥᱮᱨᱮᱧ)', 'Inung / Enech (ᱮᱱᱮᱡ)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c2_lang_3',
            type: 'fillBlank',
            questionPromptHindi: '3. वाक्य पूरा करें: "Aing kakhsa 2 re..." (पढ़ता हूँ / Padaotana):',
            questionPromptTribal: { ho: 'Baki perepe', santhali: 'Bakho perej me', mundari: 'Vakya perepe' },
            tracingText: 'उत्तर: ____________________________________',
            correctAnswer: 'padaotana / parhaokanaing',
            points: 4,
          },
          {
            id: 'c2_lang_4',
            type: 'identify',
            questionPromptHindi: '4. बहुवचन रूप चुनें (Select Plural): Cat ➔ ?',
            questionPromptTribal: { ho: 'Soben mutha bachanpe', santhali: 'Besi muthan bachaome', mundari: 'Sanghi mutha chunao pe' },
            options: ['Cats', 'Cates', 'Caties', 'Catss'],
            correctAnswer: 'Cats',
            points: 4,
          },
          {
            id: 'c2_lang_5',
            type: 'listenRepeat',
            questionPromptHindi: '5. मौखिक अभिव्यक्ति (Spoken Voice Activity):',
            questionPromptTribal: { ho: 'Kajipe: Aing nutum...', santhali: 'Rorme: Inyak nutum...', mundari: 'Kajipe: Aing nutum...' },
            audioSpokenText: 'मेरा नाम और मेरी कक्षा (Speak your name and grade in tribal tongue)',
            correctAnswer: 'audio_done',
            points: 4,
          },
        ];
      }
    }

    // ==========================================
    // CLASS 3 DEDICATED WORKSHEETS
    // ==========================================
    else if (grade === '3') {
      if (subject === 'evs') {
        questions = [
          {
            id: 'c3_evs_1',
            type: 'fillBlank',
            questionPromptHindi: '1. जल के प्रमुख स्रोतों के नाम लिखें (Sources of Clean Water):',
            questionPromptTribal: { ho: 'Da reya tha nutum olpe', santhali: 'Dah reyak theka nutum olme', mundari: 'Da reya thav nutum olpe' },
            tracingText: 'गाँव में पानी के 3 स्रोत: १. ____________  २. ____________  ३. ____________',
            correctAnswer: 'कुआं, नदी, झरना / Gada, Kuan, Buru da',
            points: 4,
          },
          {
            id: 'c3_evs_2',
            type: 'mcq',
            questionPromptHindi: '2. पौधों के भोजन बनाने की प्रक्रिया में किसकी आवश्यकता होती है?',
            questionPromptTribal: { ho: 'Daru mandi bainte chikana darkar?', santhali: 'Dare daka benao lagit chet lagtikana?', mundari: 'Daru mandi bainte chikan darkar?' },
            options: ['सूर्य का प्रकाश (Singi / Sun)', 'जल (Da / Dah)', 'हवा (Hoyo)', 'उपर्युक्त सभी (All of above)'],
            correctAnswer: 'उपर्युक्त सभी (All of above)',
            points: 4,
          },
          {
            id: 'c3_evs_3',
            type: 'comprehension',
            questionPromptHindi: '3. पर्यावरण अनुच्छेद पढ़कर उत्तर दें (Reading Comprehension):',
            questionPromptTribal: { ho: 'Kani padao kete kajipe', santhali: 'Kahni parhao kate uttor emme', mundari: 'Kahani padao kete kajipe' },
            comprehensionPassage: 'झारखंड के आदिवासी समाज में सरना स्थल पर सखुआ (साल) के वृक्षों की पूजा की जाती है। वन हमारे जीवन, जल और शुद्ध वायु के आधार हैं।',
            tracingText: 'प्रश्न: आदिवासी समाज में किस वृक्ष की पूजा सरना स्थल पर की जाती है?\nउत्तर: __________________________________________________',
            correctAnswer: 'सखुआ / साल / Sarjom',
            points: 4,
          },
          {
            id: 'c3_evs_4',
            type: 'matching',
            questionPromptHindi: '4. पारंपरिक भोजन व उनके लाभ का मिलान करें (Match Nutrition):',
            questionPromptTribal: { ho: 'Mandi bugi joda misape', santhali: 'Daka bugi jorao me', mundari: 'Mandi bugi milao pe' },
            leftItems: ['मडुआ (Ragi / Mandua)', 'महुआ (Mahua)', 'हरी साग (Green Leaves)', 'दाल (Pulses)'],
            rightItems: ['विटामिन व खनिज (Vitamins)', 'कैल्शियम व ऊर्जा (Calcium)', 'प्रोटीन (Protein)', 'पारंपरिक औषधि (Traditional Energy)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c3_evs_5',
            type: 'speaking',
            questionPromptHindi: '5. मौखिक प्रश्न (Speaking - Whisper.cpp + Piper TTS):',
            questionPromptTribal: { ho: 'Mic dabao kete kajipe', santhali: 'Mic jote kate rorme', mundari: 'Mic dabao kete kajipe' },
            audioSpokenText: 'Apu hatu re da kahan se hiju-a? (आपके गाँव में पानी कहाँ से आता है?)',
            tracingText: '🎙️ माइक दबाकर बताएं कि आपके गाँव में पानी कहाँ से आता है।',
            correctAnswer: 'spoken_done',
            points: 4,
          },
        ];
      } else if (subject === 'math') {
        questions = [
          {
            id: 'c3_math_1',
            type: 'fillBlank',
            questionPromptHindi: '1. गुणा हल करें (Multiplication):',
            questionPromptTribal: { ho: 'Guna hisab olpe', santhali: 'Guna hisab olme', mundari: 'Guna hisab olpe' },
            tracingText: '  ६  ×  ७  =  __________  |  ८  ×  ५  =  __________',
            correctAnswer: '42, 40',
            points: 4,
          },
          {
            id: 'c3_math_2',
            type: 'fillBlank',
            questionPromptHindi: '2. भाग हल करें (Division):',
            questionPromptTribal: { ho: 'Hating hisab olpe', santhali: 'Hating hisab olme', mundari: 'Hating hisab olpe' },
            tracingText: '  ३६  ÷  ६  =  __________  |  ४५  ÷  ५  =  __________',
            correctAnswer: '6, 9',
            points: 4,
          },
          {
            id: 'c3_math_3',
            type: 'identify',
            questionPromptHindi: '3. भिन्न (Fraction) पहचानें: 1 रोटी के 4 बराबर टुकड़ों में से 1 टुकड़ा:',
            questionPromptTribal: { ho: 'Fraction mutha bachanpe', santhali: 'Fraction uprom me', mundari: 'Fraction upurum pe' },
            options: ['१/४ (One-Fourth)', '१/२ (Half)', '३/४ (Three-Fourths)', '१/१ (Whole)'],
            correctAnswer: '१/४ (One-Fourth)',
            points: 4,
          },
          {
            id: 'c3_math_4',
            type: 'fillBlank',
            questionPromptHindi: '4. मापन (Measurement): 1 मीटर में कितने सेंटीमीटर होते हैं?',
            questionPromptTribal: { ho: '1 Meter re kete cm menah?', santhali: '1 Meter re tinag cm menag-a?', mundari: '1 Meter re chimin cm mena?' },
            tracingText: 'उत्तर: 1 मीटर = __________ सेंटीमीटर (100 cm)',
            correctAnswer: '100',
            points: 4,
          },
          {
            id: 'c3_math_5',
            type: 'fillBlank',
            questionPromptHindi: '5. इबारती प्रश्न: 24 कॉपियों को 4 बच्चों में बराबर बाँटने पर प्रत्येक को कितनी कॉपियाँ मिलेंगी?',
            questionPromptTribal: { ho: 'Hating kaji hisab olpe', santhali: 'Hating kahni hisab olme', mundari: 'Hating kaji hisab olpe' },
            tracingText: '२४ ÷ ४ = _____ कॉपियाँ (6 Copies each)',
            correctAnswer: '6',
            points: 4,
          },
        ];
      } else {
        // Class 3 Languages
        questions = [
          {
            id: 'c3_lang_1',
            type: 'comprehension',
            questionPromptHindi: '1. लोककथा पठन व समझ (Tribal Story Comprehension):',
            questionPromptTribal: { ho: 'Kani padao kete uttor olpe', santhali: 'Kahni parhao kate uttor olme', mundari: 'Kahani padao kete uttor olpe' },
            comprehensionPassage: 'एक गाँव में एक बुद्धिमान खरगोश और एक शेर रहते थे। खरगोश ने अपनी चतुराई से शेर को कुएँ के पानी में उसकी परछाई दिखाकर पराजित कर दिया।',
            tracingText: 'प्रश्न: खरगोश ने शेर को कुएँ में क्या दिखाया?\nउत्तर: __________________________________________________',
            correctAnswer: 'उसकी परछाई / Reflection',
            points: 4,
          },
          {
            id: 'c3_lang_2',
            type: 'translation',
            questionPromptHindi: '2. हिंदी से मातृभाषा में वाक्य अनुवाद करें (Sentence Translation):',
            questionPromptTribal: { ho: 'Ho te tarjuma pe', santhali: 'Santhali te tarjuma me', mundari: 'Mundari te tarjuma pe' },
            tracingText: 'हिंदी: "आज मौसम बहुत सुहावना और ठंडा है।"\nअनुवाद: __________________________________________________',
            correctAnswer: 'Tisin raban ar bugi rutu menah',
            points: 4,
          },
          {
            id: 'c3_lang_3',
            type: 'fillBlank',
            questionPromptHindi: '3. संज्ञा व सर्वनाम पहचानें (Nouns & Pronouns in English/Hindi):',
            questionPromptTribal: { ho: 'Sangya bachanpe', santhali: 'Sangya uprom me', mundari: 'Sangya chunao pe' },
            tracingText: '"Birsa is a good student. He goes to school." Noun: ______ | Pronoun: ______',
            correctAnswer: 'Noun: Birsa, Pronoun: He',
            points: 4,
          },
          {
            id: 'c3_lang_4',
            type: 'mcq',
            questionPromptHindi: '4. विलोम शब्द (Opposites): "दिन (Day)" का विलोम क्या है?',
            questionPromptTribal: { ho: 'Biporit kaji bachanpe', santhali: 'Ulta ror bachaome', mundari: 'Ulta kaji chunao pe' },
            options: ['रात (Nida / Nind)', 'सुबह (Seta)', 'शाम (Aiyub)', 'दोपहर (Tikli)'],
            correctAnswer: 'रात (Nida / Nind)',
            points: 4,
          },
          {
            id: 'c3_lang_5',
            type: 'speaking',
            questionPromptHindi: '5. मौखिक अभिव्यक्ति (Spoken Voice Evaluation):',
            questionPromptTribal: { ho: 'Apu hatu porob kaji kajipe', santhali: 'Ama ato parab katha rorme', mundari: 'Ama hatu porob kaji kajipe' },
            audioSpokenText: 'अपने प्रिय त्योहार के बारे में 2 वाक्य मातृभाषा में बोलें।',
            tracingText: '🎙️ माइक दबाकर अपने पसंदीदा त्योहार (सरहुल/करमा/सोहराय) पर 2 वाक्य बोलें।',
            correctAnswer: 'spoken_done',
            points: 4,
          },
        ];
      }
    }

    // ==========================================
    // CLASS 4 DEDICATED WORKSHEETS
    // ==========================================
    else if (grade === '4') {
      if (subject === 'evs') {
        questions = [
          {
            id: 'c4_evs_1',
            type: 'mcq',
            questionPromptHindi: '1. मानव शरीर में रक्त को पूरे शरीर में पंप करने वाला अंग कौन सा है?',
            questionPromptTribal: { ho: 'Hormo re mayom pump organ okoni?', santhali: 'Hormo re mayom pump organ oka?', mundari: 'Hormo re mayom pump organ okoni?' },
            options: ['हृदय (Heart)', 'फेफड़े (Lungs)', 'आमाशय (Stomach)', 'मस्तिष्क (Brain)'],
            correctAnswer: 'हृदय (Heart)',
            points: 4,
          },
          {
            id: 'c4_evs_2',
            type: 'fillBlank',
            questionPromptHindi: '2. झारखंड के 3 प्रमुख खनिज संसाधनों के नाम लिखें (Mineral Resources):',
            questionPromptTribal: { ho: 'Jharkhand reya 3 Khanij nutum olpe', santhali: 'Jharkhand reyak 3 Khanij nutum olme', mundari: 'Jharkhand reya 3 Khanij nutum olpe' },
            tracingText: '१. कोयला (Coal)   २. लोहा (Iron Ore)   ३. ___________________ (Mica/Copper)',
            correctAnswer: 'अभ्रक / तांबा / यूरेनियम',
            points: 4,
          },
          {
            id: 'c4_evs_3',
            type: 'comprehension',
            questionPromptHindi: '3. वन्यजीव संरक्षण अनुच्छेद (Wildlife Conservation Passage):',
            questionPromptTribal: { ho: 'Bir jontu bachao kani padaope', santhali: 'Bir jontu banchao kahni parhaome', mundari: 'Bir jontu bachao kahani padaope' },
            comprehensionPassage: 'पलामू का बेतला राष्ट्रीय उद्यान और दलमा वन्यजीव अभयारण्य हाथियों व बाघों के प्राकृतिक आवास हैं। वनों की कटाई रोकने से ही इन पशुओं की रक्षा संभव है।',
            tracingText: 'प्रश्न: दलमा वन्यजीव अभयारण्य मुख्य रूप से किस पशु के संरक्षण के लिए प्रसिद्ध है?\nउत्तर: __________________________________________________',
            correctAnswer: 'हाथी (Elephant / Hathi)',
            points: 4,
          },
          {
            id: 'c4_evs_4',
            type: 'matching',
            questionPromptHindi: '4. सुरक्षा नियम व संकेतों का मिलान करें (Match Safety Rules):',
            questionPromptTribal: { ho: 'Safety niyam joda misape', santhali: 'Safety niyam jorao me', mundari: 'Safety niyam milao pe' },
            leftItems: ['🔴 लाल बत्ती (Red Light)', '🟢 हरी बत्ती (Green Light)', '🦓 जेब्रा क्रॉसिंग (Zebra Crossing)', '🚸 स्कूल जोन (School Zone)'],
            rightItems: ['पैदल सड़क पार करना', 'रुकिए (Stop)', 'सावधानी से धीरे चलें', 'चलिए (Go)'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c4_evs_5',
            type: 'speaking',
            questionPromptHindi: '5. मौखिक अभिव्यक्ति (Spoken Evaluation - Whisper.cpp):',
            questionPromptTribal: { ho: 'Bir bachao kaji kajipe', santhali: 'Bir banchao katha rorme', mundari: 'Bir bachao kaji kajipe' },
            audioSpokenText: 'वनों की रक्षा क्यों आवश्यक है? (Why must we protect forests?)',
            tracingText: '🎙️ वनों की सुरक्षा के 2 उपाय अपनी मातृभाषा में बोलें।',
            correctAnswer: 'spoken_done',
            points: 4,
          },
        ];
      } else if (subject === 'math') {
        questions = [
          {
            id: 'c4_math_1',
            type: 'fillBlank',
            questionPromptHindi: '1. भिन्नों का जोड़ हल करें (Fractions Addition):',
            questionPromptTribal: { ho: 'Fraction misa hisab olpe', santhali: 'Fraction mesawa hisab olme', mundari: 'Fraction juma hisab olpe' },
            tracingText: '  २/७  +  ३/७  =  __________  |  १/५  +  २/५  =  __________',
            correctAnswer: '५/७, ३/५',
            points: 4,
          },
          {
            id: 'c4_math_2',
            type: 'fillBlank',
            questionPromptHindi: '2. दशमलव संख्याओं को जोड़ें (Decimals Addition):',
            questionPromptTribal: { ho: 'Decimal hisab olpe', santhali: 'Decimal hisab olme', mundari: 'Decimal hisab olpe' },
            tracingText: '  २.५  +  १.२५  =  __________  |  ०.७५  +  ०.५०  =  __________',
            correctAnswer: '3.75, 1.25',
            points: 4,
          },
          {
            id: 'c4_math_3',
            type: 'fillBlank',
            questionPromptHindi: '3. आयत का परिमाप ज्ञात करें (Perimeter of Rectangle = 2 × (L + B)):',
            questionPromptTribal: { ho: 'Rectangle gherao hisab olpe', santhali: 'Rectangle gherao hisab olme', mundari: 'Rectangle gherao hisab olpe' },
            tracingText: 'लंबाई = 6 सेमी, चौड़ाई = 4 सेमी ➔ परिमाप = २ × (६ + ४) = _____ सेमी',
            correctAnswer: '20 सेमी / 20 cm',
            points: 4,
          },
          {
            id: 'c4_math_4',
            type: 'mcq',
            questionPromptHindi: '4. समकोण (Right Angle) का मान कितना होता है?',
            questionPromptTribal: { ho: 'Right Angle kete degree menah?', santhali: 'Right Angle tinag degree menag-a?', mundari: 'Right Angle chimin degree mena?' },
            options: ['९०° (90 Degrees)', '४५° (45 Degrees)', '१८०° (180 Degrees)', '३६०° (360 Degrees)'],
            correctAnswer: '९०° (90 Degrees)',
            points: 4,
          },
          {
            id: 'c4_math_5',
            type: 'fillBlank',
            questionPromptHindi: '5. बाजार इबारती सवाल: 1 किलोग्राम चावल का मूल्य ₹40 है, तो 5 किग्रा का मूल्य क्या होगा?',
            questionPromptTribal: { ho: 'Bazaar kaji hisab olpe', santhali: 'Hath daka hisab olme', mundari: 'Bazaar kaji hisab olpe' },
            tracingText: '५ × ४० = ₹_____ (Rupees 200)',
            correctAnswer: '₹200 / 200',
            points: 4,
          },
        ];
      } else {
        // Class 4 Languages & English
        questions = [
          {
            id: 'c4_lang_1',
            type: 'comprehension',
            questionPromptHindi: '1. ऐतिहासिक अनुच्छेद पठन (Historical Passage - Birsa Munda / Sidho-Kanhu):',
            questionPromptTribal: { ho: 'Birsa Munda kani padaope', santhali: 'Sidho-Kanhu kahni parhaome', mundari: 'Birsa Munda kahani padaope' },
            comprehensionPassage: 'भगवान बिरसा मुंडा ने जल, जंगल और जमीन की रक्षा के लिए "उलगुलान" क्रांति का नेतृत्व किया था। उनका जन्म खूंटी जिले के उलीहातू गाँव में हुआ था।',
            tracingText: 'प्रश्न: भगवान बिरसा मुंडा का जन्म किस जिले के गाँव में हुआ था?\nउत्तर: __________________________________________________',
            correctAnswer: 'खूंटी जिला, उलीहातू गाँव (Khunti, Ulihatu)',
            points: 4,
          },
          {
            id: 'c4_lang_2',
            type: 'fillBlank',
            questionPromptHindi: '2. व्याकरण - क्रिया का भूतकाल रूप लिखें (Past Tense of Verbs):',
            questionPromptTribal: { ho: 'Bhootkaal kaji olpe', santhali: 'Past tense ror olme', mundari: 'Bhootkaal kaji olpe' },
            tracingText: 'Go ➔ _________  |  Play ➔ _________  |  Read ➔ _________',
            correctAnswer: 'Went, Played, Read',
            points: 4,
          },
          {
            id: 'c4_lang_3',
            type: 'translation',
            questionPromptHindi: '3. अनुच्छेद अनुवाद (Paragraph Translation into Tribal Script):',
            questionPromptTribal: { ho: 'Ho te tarjumape', santhali: 'Santhali Ol Chiki te tarjuma me', mundari: 'Mundari te tarjumape' },
            tracingText: 'हिंदी: "हमारे गाँव के चारों ओर हरे-भरे पहाड़ और नदियाँ हैं।"\nअनुवाद: __________________________________________________',
            correctAnswer: 'Apu hatu parikere haria buru ar gadako menah',
            points: 4,
          },
          {
            id: 'c4_lang_4',
            type: 'fillBlank',
            questionPromptHindi: '4. समुच्चयबोधक शब्द भरें (Conjunctions: and, but, because):',
            questionPromptTribal: { ho: 'Conjunction perepe', santhali: 'Conjunction perej me', mundari: 'Conjunction perepe' },
            tracingText: '"Ravi ran fast, _______ he missed the bus." (and / but)',
            correctAnswer: 'but',
            points: 4,
          },
          {
            id: 'c4_lang_5',
            type: 'speaking',
            questionPromptHindi: '5. मौखिक अभिव्यक्ति (Spoken Storytelling):',
            questionPromptTribal: { ho: 'Kani kaji kajipe', santhali: 'Kahni rorme', mundari: 'Kahani kajipe' },
            audioSpokenText: 'अपनी मातृभाषा में 1 छोटी नैतिक कहानी बोलें (Tell a short story in your mother tongue)',
            tracingText: '🎙️ माइक दबाकर 1 छोटी कहानी अपनी मातृभाषा में बोलें।',
            correctAnswer: 'spoken_done',
            points: 4,
          },
        ];
      }
    }

    // ==========================================
    // CLASS 5 DEDICATED WORKSHEETS
    // ==========================================
    else {
      if (subject === 'evs') {
        questions = [
          {
            id: 'c5_evs_1',
            type: 'mcq',
            questionPromptHindi: '1. पारिस्थितिकी तंत्र (Ecosystem) में प्राथमिक उत्पादक कौन होते हैं?',
            questionPromptTribal: { ho: 'Ecosystem re primary producer okoni?', santhali: 'Ecosystem re primary producer oka?', mundari: 'Ecosystem re primary producer okoni?' },
            options: ['हरे पेड़-पौधे (Green Plants / Daru)', 'शाकाहारी पशु (Herbivores)', 'मांसाहारी पशु (Carnivores)', 'अपघटक (Decomposers)'],
            correctAnswer: 'हरे पेड़-पौधे (Green Plants / Daru)',
            points: 4,
          },
          {
            id: 'c5_evs_2',
            type: 'fillBlank',
            questionPromptHindi: '2. पर्यावरण प्रदूषण रोकने के 3 महत्वपूर्ण उपाय लिखें (Pollution Prevention):',
            questionPromptTribal: { ho: 'Pollution rokaw 3 upaye olpe', santhali: 'Pollution rukhiya 3 niyam olme', mundari: 'Pollution rokaw 3 upaye olpe' },
            tracingText: '१. अधिक पेड़ लगाना   २. प्लास्टिक का कम उपयोग   ३. ___________________',
            correctAnswer: 'कचरा प्रबंधन / स्वच्छ ऊर्जा / जल संरक्षण',
            points: 4,
          },
          {
            id: 'c5_evs_3',
            type: 'comprehension',
            questionPromptHindi: '3. सारंडा वन एवं जैव विविधता (Saranda Forest Biodiversity Passage):',
            questionPromptTribal: { ho: 'Saranda bir kani padaope', santhali: 'Saranda bir kahni parhaome', mundari: 'Saranda bir kahani padaope' },
            comprehensionPassage: 'एशिया का सबसे बड़ा साल वन सारंडा (सात सौ पहाड़ियों की भूमि) पश्चिमी सिंहभूम में स्थित है। यह एशियाई हाथियों, दुर्लभ जड़ी-बूटियों और आदिवासी संस्कृति का प्राकृतिक धरोहर है।',
            tracingText: 'प्रश्न: सारंडा वन को किस नाम से भी जाना जाता है?\nउत्तर: __________________________________________________',
            correctAnswer: 'सात सौ पहाड़ियों की भूमि (Land of 700 Hills)',
            points: 4,
          },
          {
            id: 'c5_evs_4',
            type: 'matching',
            questionPromptHindi: '4. संतुलित आहार व पोषक तत्वों का मिलान करें (Balanced Diet Components):',
            questionPromptTribal: { ho: 'Bugi mandi joda misape', santhali: 'Bugi daka jorao me', mundari: 'Bugi mandi milao pe' },
            leftItems: ['कार्बोहाइड्रेट (Carbohydrates)', 'प्रोटीन (Protein)', 'विटामिन व खनिज (Vitamins)', 'वसा (Fats)'],
            rightItems: ['शरीर की वृद्धि व मरम्मत', 'त्वरित ऊर्जा का स्रोत (भात/रोटी)', 'रोग प्रतिरोधक क्षमता (फल/साग)', 'ऊर्जा भंडारण व ताप नियंत्रण'],
            correctAnswer: 'matched',
            points: 4,
          },
          {
            id: 'c5_evs_5',
            type: 'speaking',
            questionPromptHindi: '5. मौखिक अभिव्यक्ति (Ecosystem Speech - Whisper.cpp + Piper TTS):',
            questionPromptTribal: { ho: 'Paryavaran banchao kaji kajipe', santhali: 'Paryavaran banchao katha rorme', mundari: 'Paryavaran banchao kaji kajipe' },
            audioSpokenText: 'जल और वनों के संरक्षण पर 2 मिनट का भाषण अपनी मातृभाषा में दें।',
            tracingText: '🎙️ माइक दबाकर पर्यावरण संरक्षण पर अपने विचार मातृभाषा में प्रस्तुत करें।',
            correctAnswer: 'spoken_done',
            points: 4,
          },
        ];
      } else if (subject === 'math') {
        questions = [
          {
            id: 'c5_math_1',
            type: 'fillBlank',
            questionPromptHindi: '1. प्रतिशत की गणना करें (Calculate Percentage):',
            questionPromptTribal: { ho: 'Percentage hisab olpe', santhali: 'Percentage hisab olme', mundari: 'Percentage hisab olpe' },
            tracingText: '  ५०० का २०% = __________  |  २०० का १०% = __________',
            correctAnswer: '100, 20',
            points: 4,
          },
          {
            id: 'c5_math_2',
            type: 'fillBlank',
            questionPromptHindi: '2. दशमलव संख्याओं का गुणा हल करें (Decimals Multiplication):',
            questionPromptTribal: { ho: 'Decimal guna olpe', santhali: 'Decimal guna olme', mundari: 'Decimal guna olpe' },
            tracingText: '  ३.५  ×  ४  =  __________  |  २.२५  ×  २  =  __________',
            correctAnswer: '14, 4.5',
            points: 4,
          },
          {
            id: 'c5_math_3',
            type: 'fillBlank',
            questionPromptHindi: '3. वर्ग का क्षेत्रफल ज्ञात करें (Area of Square = Side × Side):',
            questionPromptTribal: { ho: 'Square area hisab olpe', santhali: 'Square area hisab olme', mundari: 'Square area hisab olpe' },
            tracingText: 'भुजा = 8 मीटर ➔ क्षेत्रफल = ८ × ८ = _____ वर्ग मीटर',
            correctAnswer: '64 वर्ग मीटर / 64 sq m',
            points: 4,
          },
          {
            id: 'c5_math_4',
            type: 'fillBlank',
            questionPromptHindi: '4. ऐकिक नियम (Unitary Method): 12 पुस्तकों का मूल्य ₹360 है, तो 1 पुस्तक का मूल्य क्या होगा?',
            questionPromptTribal: { ho: 'Unitary hisab olpe', santhali: 'Unitary hisab olme', mundari: 'Unitary hisab olpe' },
            tracingText: '३६० ÷ १२ = ₹_____ प्रति पुस्तक',
            correctAnswer: '₹30 / 30',
            points: 4,
          },
          {
            id: 'c5_math_5',
            type: 'mcq',
            questionPromptHindi: '5. त्रिभुज के तीनों आंतरिक कोणों का योग कितना होता है?',
            questionPromptTribal: { ho: 'Triangle cone juma kete?', santhali: 'Triangle cone mesawa tinag?', mundari: 'Triangle cone juma chimin?' },
            options: ['१८०° (180 Degrees)', '९०° (90 Degrees)', '३६०° (360 Degrees)', '२७०° (270 Degrees)'],
            correctAnswer: '१८०° (180 Degrees)',
            points: 4,
          },
        ];
      } else {
        // Class 5 Languages & English
        questions = [
          {
            id: 'c5_lang_1',
            type: 'comprehension',
            questionPromptHindi: '1. अपठित लोक-साहित्य पठन व प्रश्न-उत्तर (Tribal Folklore Comprehension):',
            questionPromptTribal: { ho: 'Lok-sahitya kani padao kete uttor olpe', santhali: 'Lok-sahitya kahni parhao kate uttor olme', mundari: 'Lok-sahitya kahani padao kete uttor olpe' },
            comprehensionPassage: 'आदिवासी दर्शन में प्रकृति और मनुष्य का संबंध परस्पर पूरक है। पहाड़, नदियाँ और वृक्ष हमारे पूर्वजों के आशीर्वाद हैं। यही कारण है कि करमा और बाहा पर्व पर प्रकृति की कृतज्ञता प्रकट की जाती है।',
            tracingText: 'प्रश्न: करमा और बाहा पर्व पर समाज किसके प्रति कृतज्ञता प्रकट करता है?\nउत्तर: __________________________________________________',
            correctAnswer: 'प्रकृति के प्रति (To Mother Nature)',
            points: 4,
          },
          {
            id: 'c5_lang_2',
            type: 'translation',
            questionPromptHindi: '2. परिच्छेद अनुवाद (Formal Paragraph Translation in Dual Script):',
            questionPromptTribal: { ho: 'Dual script tarjumape', santhali: 'Dual script Santhali te tarjuma me', mundari: 'Dual script tarjumape' },
            tracingText: 'हिंदी: "शिक्षा हमारे जीवन का सबसे शक्तिशाली साधन है जो हमें आत्मनिर्भर बनाता है।"\nअनुवाद: __________________________________________________',
            correctAnswer: 'Shiksha abu jeevan reya marang shakti tana',
            points: 4,
          },
          {
            id: 'c5_lang_3',
            type: 'fillBlank',
            questionPromptHindi: '3. Prepositions & Adverbs (in, on, at, quickly):',
            questionPromptTribal: { ho: 'Grammar perepe', santhali: 'Grammar perej me', mundari: 'Grammar perepe' },
            tracingText: '"The book is _____ the table and the boy walked _____." (on / quickly)',
            correctAnswer: 'on, quickly',
            points: 4,
          },
          {
            id: 'c5_lang_4',
            type: 'written',
            questionPromptHindi: '4. रचनात्मक लेखन (Short Essay / Letter Prompt):',
            questionPromptTribal: { ho: 'Niban olpe', santhali: 'Niban olme', mundari: 'Niban olpe' },
            tracingText: 'विषय: "मेरे प्रिय शिक्षक (My Favourite Teacher)" पर 4 वाक्य लिखें:\n१. ____________________________________________________\n२. ____________________________________________________',
            correctAnswer: 'essay_written',
            points: 4,
          },
          {
            id: 'c5_lang_5',
            type: 'speaking',
            questionPromptHindi: '5. मौखिक अभिव्यक्ति व वाद-विवाद (Spoken Debate - Whisper.cpp + Piper TTS):',
            questionPromptTribal: { ho: 'Bhashan kajipe', santhali: 'Bhashan rorme', mundari: 'Bhashan kajipe' },
            audioSpokenText: 'अपनी मातृभाषा के संरक्षण पर 3 वाक्य बोलें (Speak on preserving your mother tongue)',
            tracingText: '🎙️ अपनी मातृभाषा के महत्व पर 3 वाक्य रिकॉर्ड करें।',
            correctAnswer: 'spoken_done',
            points: 4,
          },
        ];
      }
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
