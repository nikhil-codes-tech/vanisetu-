// Configured Institutional Database for PALASH VaniSetu Offline Classroom Engine
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
  ],
  "अंग्रेज़ी": [
    {
      id: "eng_ch1",
      title: "Alphabets (A–Z)",
      nipun: "L-G1.4",
      outcomeText: "L-G1.4: Identify English alphabet characters and letter sounds."
    }
  ],
  "विज्ञान": [
    {
      id: "sci_ch1",
      title: "सजीव और निर्जीव",
      nipun: "E-G2.3",
      outcomeText: "E-G2.3: Classify objects in local environment as living or non-living."
    }
  ]
};

// Multilingual Vocabulary Database with native script mapping
export const VOCABULARY_DATABASE = {
  "गणित": [
    { word: "संख्या", translations: { ho: "लेखा (Lekha)", santhali: "एल्खा" }, nativeScripts: { ho: "𑢵𑣁𑣌𑣁", santhali: "ᱮᱞᱠᱷᱟ" }, examples: [{ hindi: "संख्या दो लिखो।", translated: "लेखा बरिया ओल मे।" }] },
    { word: "जोड़", translations: { ho: "मेसा (Mesa)", santhali: "सेलेद" }, nativeScripts: { ho: "𑢾𑣁𑣜𑣁", santhali: "ᱥᱮᱞᱮᱫ" }, examples: [{ hindi: "दो और तीन को जोड़ें।", translated: "बरिया ओडो आपिया मेसा मे।" }] },
    { word: "घटाव", translations: { ho: "रे (Re)", santhali: "भेद" }, nativeScripts: { ho: "𑢷𑣁", santhali: "ᱵᱷᱮᱫᱽ" }, examples: [{ hindi: "संख्याओं को घटाएं।", translated: "लेखा को रे मे।" }] },
    { word: "गुना", translations: { ho: "गुना (Guna)", santhali: "गाबॉन" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱜᱟᱵᱟᱱ" }, examples: [{ hindi: "दो से गुणा करें।", translated: "बरिया ते गुना मे।" }] },
    { word: "भाग", translations: { ho: "हाटिंग (Hating)", santhali: "हाटिंग" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱦᱟᱹᱴᱤᱧ" }, examples: [{ hindi: "इसे बराबर भाग करें।", translated: "नेयाः सुपुन हाटिंग मे।" }] },
    { word: "एक", translations: { ho: "मियाद (Miyad)", santhali: "मित" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱢᱤᱫ" }, examples: [{ hindi: "एक पेंसिल दो।", translated: "मियाद पेंसिल एमइंग मे।" }] },
    { word: "दो", translations: { ho: "बरिया (Bariya)", santhali: "बार" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱵᱟᱨ" }, examples: [{ hindi: "दो बच्चे खेल रहे हैं।", translated: "बरिया होनको इनिम तन।" }] },
    { word: "तीन", translations: { ho: "आपिया (Apiya)", santhali: "पे" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱯᱮ" }, examples: [{ hindi: "तीन केले लाओ।", translated: "आपिया कइला ओड़ाः मे।" }] },
    { word: "चार", translations: { ho: "उपूनिया (Upuniya)", santhali: "पोन" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱯᱚᱱ" }, examples: [{ hindi: "चार दिशाएँ होती हैं।", translated: "उपूनिया होर मेनाः।" }] },
    { word: "पाँच", translations: { ho: "मोयआ (Moy-a)", santhali: "मोणे" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱢᱚᱬᱮ" }, examples: [{ hindi: "पाँच उंगलियाँ हैं।", translated: "मोयआ ति सि को मेनाः।" }] },
    { word: "छह", translations: { ho: "तुरूईया (Turuiya)", santhali: "तुरुइ" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱛᱩᱨᱩᱭ" }, examples: [{ hindi: "छह दिन काम करो।", translated: "तुरूईया सिंगी पई मे।" }] },
    { word: "सात", translations: { ho: "अइया (Aiya)", santhali: "एयाय" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱮᱭᱟᱭ" }, examples: [{ hindi: "सप्ताह में सात दिन हैं।", translated: "मियाद हफ्ता रे अइया सिंगी मेनाः।" }] },
    { word: "आठ", translations: { ho: "इरिलिया (Iriliya)", santhali: "इरल" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱤᱨᱟᱹᱞ" }, examples: [{ hindi: "आठ बजे स्कूल आओ।", translated: "इरिलिया बाजे इतु ओड़ाः हिजुः मे।" }] },
    { word: "नौ", translations: { ho: "आरेया (Areya)", santhali: "आरे" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱟᱨᱮ" }, examples: [{ hindi: "नौ बजे भोजन करो।", translated: "आरेया बाजे जोम मे।" }] },
    { word: "दस", translations: { ho: "गेलेया (Geleya)", santhali: "गेल" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱜᱮᱞ" }, examples: [{ hindi: "दस उंगलियाँ दिखाओ।", translated: "गेलेया ति सि को नेल मे।" }] }
  ],
  "पर्यावरण अध्ययन": [
    { word: "पानी", translations: { ho: "दाः (Daah)", santhali: "दाः" }, nativeScripts: { ho: "𑢸𑣁𑣁", santhali: "ᱫᱟᱜ" }, examples: [{ hindi: "पानी लाओ।", translated: "दाः ओड़ाः मे।" }] },
    { word: "पेड़", translations: { ho: "दारू (Daru)", santhali: "दारे" }, nativeScripts: { ho: "𑢵𑣁𑣜𑣁", santhali: "ᱫᱟᱨᱮ" }, examples: [{ hindi: "यह पेड़ बहुत बड़ा है।", translated: "ने दारू मरांग गे।" }] },
    { word: "पत्ता", translations: { ho: "साकाम (Sakam)", santhali: "साकाम" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱥᱟᱠᱟᱢ" }, examples: [{ hindi: "पत्ता हरा है।", translated: "साकाम हरीअर गे।" }] },
    { word: "हवा", translations: { ho: "होयो (Hoyo)", santhali: "होय" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱦᱚᱭ" }, examples: [{ hindi: "हवा बह रही है।", translated: "होयो हिजुः तन।" }] },
    { word: "मिट्टी", translations: { ho: "हासा (Hasa)", santhali: "हासा" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱦᱟᱥᱟ" }, examples: [{ hindi: "मिट्टी उपजाऊ है।", translated: "हासा नेपेम गे।" }] },
    { word: "फल", translations: { ho: "जो (Jo)", santhali: "जो" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱡᱚ" }, examples: [{ hindi: "मीठा फल खाओ।", translated: "हेबेल जो जोम मे।" }] },
    { word: "फूल", translations: { ho: "बा (Baa)", santhali: "बाहा" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱵᱟᱦᱟ" }, examples: [{ hindi: "फूल लाल है।", translated: "बा अरआ गे।" }] },
    { word: "बीज", translations: { ho: "जंग (Jang)", santhali: "जंग" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱡᱟᱝ" }, examples: [{ hindi: "बीज बोओ।", translated: "जंग हेर मे।" }] },
    { word: "जंगल", translations: { ho: "बीर (Bir)", santhali: "बीर" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱵᱤᱨ" }, examples: [{ hindi: "जंगल घना है।", translated: "बीर जकड़ गे।" }] },
    { word: "गाय", translations: { ho: "गाई (Gai)", santhali: "गाइ" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱜᱟᱭ" }, examples: [{ hindi: "गाय दूध देती है।", translated: "गाई तोआ एम तन।" }] },
    { word: "कुत्ता", translations: { ho: "सेता (Seta)", santhali: "सेता" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱥᱮᱛᱟ" }, examples: [{ hindi: "कुत्ता भौंक रहा है।", translated: "सेता कजी तन।" }] },
    { word: "बिल्ली", translations: { ho: "बिलाई (Bilai)", santhali: "पुसी" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱯᱩᱥᱤ" }, examples: [{ hindi: "बिल्ली दूध पीती है।", translated: "बिलाई तोआ नु तन।" }] },
    { word: "हाथी", translations: { ho: "हाथी (Hathi)", santhali: "हाथी" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱦᱟᱛᱷᱤ" }, examples: [{ hindi: "हाथी आ रहा है।", translated: "हाथी हिजुः तन।" }] },
    { word: "बकरी", translations: { ho: "मेरम (Meram)", santhali: "मेरम" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱢᱮᱨᱚᱢ" }, examples: [{ hindi: "बकरी घास खा रही है।", translated: "मेरम तास जोम तन।" }] },
    { word: "शेर", translations: { ho: "कुला (Kula)", santhali: "तरुप" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱛᱟᱹᱨᱩᱵ" }, examples: [{ hindi: "शेर गरज रहा है।", translated: "कुला गड़ज तन।" }] }
  ],
  "अंग्रेज़ी": [
    { word: "अक्षर", translations: { ho: "ओलोंग (Olong)", santhali: "चिकी" }, nativeScripts: { ho: "𑢵𑣁", santhali: "ᱪᱤᱠᱤ" }, examples: [{ hindi: "अक्षर लिखो।", translated: "ओलोंग ओल मे।" }] }
  ],
  "विज्ञान": [
    { word: "सजीव", translations: { ho: "जीवों (Jiwong)", santhali: "जियवी" }, nativeScripts: { ho: "𑢾𑣁", santhali: "ᱡᱤᱣᱤ" }, examples: [{ hindi: "पेड़ सजीव है।", translated: "दारू जीवों गे।" }] }
  ],
  "हिंदी": [
    { word: "भाषा", translations: { ho: "कजी (Kaji)", santhali: "पारसी" }, nativeScripts: { ho: "𑢹𑣁", santhali: "ᱯᱟᱹᱨᱥᱤ" }, examples: [{ hindi: "भाषा सीखो।", translated: "कजी इतु मे।" }] }
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
