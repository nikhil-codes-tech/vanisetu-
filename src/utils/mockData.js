// Configured Institutional Database for PALASH Vani Setu Offline Classroom Engine
// Co-branded with Samagra Shiksha Jharkhand & JCERT

export const JHARKHAND_DISTRICTS = {
  "Khunti": ["UPS Murhu Primary School", "GPS Khunti Town School"],
  "Ranchi": ["GPS Ranchi Town School", "UPS Khelgaon Tribal School"],
  "Lohardaga": ["GPS Lohardaga Primary School", "UPS Bhandra Tribal School"]
};

export const MOCK_TEACHERS = [
  { id: "savita_102", name: "सविता मुंडा", englishName: "Savita Munda", shikshakId: "JH-TCH-20102", district: "Khunti", school: "UPS Murhu Primary School" },
  { id: "mamta_101", name: "ममता तिर्की", englishName: "Mamta Tirkey", shikshakId: "JH-TCH-20101", district: "Ranchi", school: "GPS Ranchi Town School" },
  { id: "amit_103", name: "अमित उरांव", englishName: "Amit Oraon", shikshakId: "JH-TCH-20103", district: "Lohardaga", school: "GPS Lohardaga Primary School" }
];

export const LANGUAGES_METADATA = {
  "हो": { 
    name: "हो (Ho)", 
    script: "वारंग क्षिति (Warang Chiti)", 
    translationCode: "ho", 
    status: "Installed", 
    devStage: "Fully Demonstrated" 
  },
  "मुंडारी": { 
    name: "मुंडारी (Mundari)", 
    script: "मुंडारी बानी", 
    translationCode: "mundari", 
    status: "Download", 
    devStage: "Language Pack Only" 
  },
  "संथाली": { 
    name: "संथाली (Santhali)", 
    script: "ओल चिकी (Ol Chiki)", 
    translationCode: "santhali", 
    status: "Download", 
    devStage: "Language Pack Only" 
  }
};

// Global Subjects & Chapters with NIPUN Competency codes (Point 7)
export const SUBJECTS_DATA = {
  "गणित": [
    { 
      id: "math_ch1", 
      title: "संख्या पहचानो (1–5)", 
      nipun: "M-G1.2", 
      outcomeText: "M-G1.2: One-to-one number correspondence and recognition up to 5." 
    },
    { 
      id: "math_ch2", 
      title: "गिनती (1–20)", 
      nipun: "M-G2.2", 
      outcomeText: "M-G2.2: Count and sequence numbers up to 20 in regional dialects." 
    }
  ],
  "हिंदी": [
    { 
      id: "hindi_ch1", 
      title: "वर्णमाला पहचान", 
      nipun: "L-G2.3", 
      outcomeText: "L-G2.3: Read simple primary alphabet combinations with local sound translation." 
    }
  ]
};

// Multilingual Vocabulary Database with native script mapping (Point 6 & 15)
export const VOCABULARY_DATABASE = {
  "गणित": [
    {
      word: "संख्या",
      translations: { ho: "लेखा (Lekha)", santhali: "एल्खा" },
      nativeScripts: { ho: "𑢵𑣁𑣌𑣁", santhali: "ᱮᱞᱠᱷᱟ" },
      examples: [
        { hindi: "संख्या दो लिखो।", translated: "लेखा बरिया ओल मे।" }
      ]
    },
    {
      word: "जोड़",
      translations: { ho: "मेसा (Mesa)", santhali: "सेलेद" },
      nativeScripts: { ho: "𑢾𑣁𑣜𑣁", santhali: "ᱥᱮᱞᱮᱫ" },
      examples: [
        { hindi: "दो और तीन को जोड़ें।", translated: "बरिया ओडो आपिया मेसा मे।" }
      ]
    }
  ],
  "पर्यावरण अध्ययन": [
    {
      word: "पानी",
      translations: { ho: "दाः (Daah)", santhali: "दाः" },
      nativeScripts: { ho: "𑢸𑣁𑣁", santhali: "ᱫᱟᱜ" },
      examples: [
        { hindi: "पानी लाओ।", translated: "दाः ओड़ाः मे।" }
      ]
    },
    {
      word: "पेड़",
      translations: { ho: "दारू (Daru)", santhali: "दारे" },
      nativeScripts: { ho: "𑢵𑣁𑣜𑣁", santhali: "ᱫᱟᱨᱮ" },
      examples: [
        { hindi: "यह पेड़ बहुत बड़ा है।", translated: "ने दारू मरांग गे।" }
      ]
    }
  ]
};

export const ANIMALS_FLASHCARDS = [
  { 
    animal: "गाय (Cow)", 
    icon: "🐄", 
    translation: { ho: "गाई (Gai)", santhali: "गाइ" },
    nativeScript: { ho: "𑢯𑣁𑣚𑣃", santhali: "ᱜᱟᱭ" }
  },
  { 
    animal: "हाथी (Elephant)", 
    icon: "🐘", 
    translation: { ho: "हाथी (Hathi)", santhali: "हाथी" },
    nativeScript: { ho: "𑢶𑣁𑣚𑣃", santhali: "ᱦᱟᱛᱷᱤ" }
  },
  { 
    animal: "बकरी (Goat)", 
    icon: "🐐", 
    translation: { ho: "मेरम (Meram)", santhali: "मेरम" },
    nativeScript: { ho: "𑢵𑣁𑣜𑣃", santhali: "ᱢᱮᱨᱚᱢ" }
  }
];

export const WORKSHEETS_DATABASE = {
  "गणित": {
    "math_ch1": {
      title: "संख्या पहचानो (1-5)",
      learningObjective: "बच्चे 1 से 5 तक की संख्याओं को पहचान सकें और मात्राओं का मिलान कर सकें।",
      estimatedTime: "20 मिनट",
      offline: true,
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          instruction: "कितने सेब हैं? गिनें और सही विकल्प चुनें।",
          visual: "🍎 🍎 🍎",
          options: ["2", "3", "4"],
          correct: "3",
          translations: {
            ho: "चिमिन सेब मेनाः आ? लेखा मेसा केते बगेया विकल्प साल मे।"
          }
        }
      ]
    }
  }
};

export const SCENARIO_DIALOGUES = [
  {
    "हिंदी": "आप कैसे हैं?",
    "हो": "अंजोम ते?",
    "speaker": "teacher"
  },
  {
    "हिंदी": "मैं ठीक हूँ, शिक्षिका। धन्यवाद!",
    "हो": "सबाई गे, एंगा! जोहार।",
    "speaker": "student"
  }
];

export function translateBetweenLanguages(text, sourceLang, targetLang) {
  if (!text) return "";
  
  const targetKey = targetLang.toLowerCase() === 'हो' ? 'ho' : 'santhali';
  
  if (text.includes("बच्चों, आज हम पेड़ों के बारे में सीखेंगे।")) {
    return targetLang === 'हो' ? 'होनको, तेइसिंग बु दारूको रेयाः बु इतुआ।' : 'होनको, तिहिंग बु दारूको रेयाः बु इतुआ।';
  }
  if (text.includes("बच्चों, किताब खोलिए।")) {
    return targetLang === 'हो' ? 'होनको, पुथी नीः पे।' : 'पुथी उताःइमे।';
  }
  return "अनुवाद उपलब्ध नहीं है";
}

export function getScenarioDialogues(sourceLang, targetLang) {
  return SCENARIO_DIALOGUES.map(item => ({
    speaker: item.speaker,
    sourceText: item[sourceLang] || item["हिंदी"],
    targetText: item[targetLang] || item["हो"],
    audioText: item[targetLang] || item["हिंदी"]
  }));
}
