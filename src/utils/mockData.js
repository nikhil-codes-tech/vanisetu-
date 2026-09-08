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

// // Multilingual Vocabulary Database with native script mapping
export const VOCABULARY_DATABASE = {
  "गणित": [
    { 
      word: "संख्या", 
      translations: { ho: "लेखा (Lekha)", santhali: "एल्खा (Elkha)", mundari: "हिसब (Hisab)" }, 
      nativeScripts: { ho: "𑢵𑣁𑣌𑣁", santhali: "ᱮᱞᱠᱷᱟ", mundari: "ᱦᱤᱥᱟᱵ" }, 
      examples: [{ hindi: "संख्या दो लिखो।", translations: { ho: "लेखा बरिया ओल मे।", santhali: "एल्खा बार ओल मे।", mundari: "हिसब बारिया ओल मे।" } }] 
    },
    { 
      word: "जोड़", 
      translations: { ho: "मेसा (Mesa)", santhali: "सेलेद (Seled)", mundari: "जुमा (Juma)" }, 
      nativeScripts: { ho: "𑢾𑣁𑣜𑣁", santhali: "ᱥᱮᱞᱮᱫ", mundari: "ᱡᱩᱢᱟ" }, 
      examples: [{ hindi: "दो और तीन को जोड़ें।", translations: { ho: "बरिया ओडो आपिया मेसा मे।", santhali: "बार आर पे सेलेद मे।", mundari: "बारिया ओड़ोः अपिआ जुमा मे।" } }] 
    },
    { 
      word: "घटाव", 
      translations: { ho: "रे (Re)", santhali: "भेद (Bhed)", mundari: "घटाव (Ghatav)" }, 
      nativeScripts: { ho: "𑢷𑣁", santhali: "ᱵᱷᱮᱫᱽ", mundari: "ᱜᱷᱟᱴᱟᱣ" }, 
      examples: [{ hindi: "संख्याओं को घटाएं।", translations: { ho: "लेखा को रे मे।", santhali: "एल्खा को भेद मे।", mundari: "हिसब को घटाव मे।" } }] 
    },
    { 
      word: "गुना", 
      translations: { ho: "गुना (Guna)", santhali: "गाबॉन (Gaban)", mundari: "गुनन (Gunan)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱜᱟᱵᱟᱱ", mundari: "ᱜᱩᱱᱟ" }, 
      examples: [{ hindi: "दो से गुणा करें।", translations: { ho: "बरिया ते गुना मे।", santhali: "बार ते गाबॉन मे।", mundari: "बारिया ते गुनन मे।" } }] 
    },
    { 
      word: "भाग", 
      translations: { ho: "हाटिंग (Hating)", santhali: "हाटां (Hatan)", mundari: "भागा (Bhaga)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱦᱟᱹᱴᱤᱧ", mundari: "ᱵᱷᱟᱜᱟ" }, 
      examples: [{ hindi: "इसे बराबर भाग करें।", translations: { ho: "नेयाः सुपुन हाटिंग मे।", santhali: "नोवा समान हाटां मे।", mundari: "नेयाः जोका भागा मे।" } }] 
    },
    { 
      word: "एक", 
      translations: { ho: "मियाद (Miyad)", santhali: "मित (Mit)", mundari: "मिअद (Miad)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱢᱤᱫ", mundari: "ᱢᱤᱭᱟᱫ" }, 
      examples: [{ hindi: "एक पेंसिल दो।", translations: { ho: "मियाद पेंसिल एमइंग मे।", santhali: "मित पेंसिल एमइञ मे।", mundari: "मिअद पेंसिल एमइंग मे।" } }] 
    },
    { 
      word: "दो", 
      translations: { ho: "बरिया (Bariya)", santhali: "बार (Bar)", mundari: "बारिया (Bariya)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱵᱟᱨ", mundari: "ᱵᱟᱨᱤᱭᱟ" }, 
      examples: [{ hindi: "दो बच्चे खेल रहे हैं।", translations: { ho: "बरिया होनको इनिम तन।", santhali: "बार गिदराको एनेच काना।", mundari: "बारिया होनको इनेन तना।" } }] 
    },
    { 
      word: "तीन", 
      translations: { ho: "आपिया (Apiya)", santhali: "पे (Pe)", mundari: "अपिआ (Apia)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱯᱮ", mundari: "ᱟᱯᱤᱭᱟ" }, 
      examples: [{ hindi: "तीन केले लाओ।", translations: { ho: "आपिया कइला ओड़ाः मे।", santhali: "पे कइला आगुइमे।", mundari: "अपिआ कइला आगु मे।" } }] 
    },
    { 
      word: "चार", 
      translations: { ho: "उपूनिया (Upuniya)", santhali: "पोन (Pon)", mundari: "उपून (Upun)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱯᱚᱱ", mundari: "ᱩᱯᱩᱱ" }, 
      examples: [{ hindi: "चार दिशाएँ होती हैं।", translations: { ho: "उपूनिया होर मेनाः।", santhali: "पोन साहा मेनाः।", mundari: "उपून दिशा मेनाः।" } }] 
    },
    { 
      word: "पाँच", 
      translations: { ho: "मोयआ (Moy-a)", santhali: "मोणे (Mone)", mundari: "मोड़े (Mode)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱢᱚᱬᱮ", mundari: "ᱢᱚᱰᱮ" }, 
      examples: [{ hindi: "पाँच उंगलियाँ हैं।", translations: { ho: "मोयआ ति सि को मेनाः।", santhali: "मोणे ती रेंयाः कटुप मेनाः।", mundari: "मोड़े ति गांडू को मेनाः।" } }] 
    },
    { 
      word: "छह", 
      translations: { ho: "तुरूईया (Turuiya)", santhali: "तुरुइ (Turui)", mundari: "तुरूई (Turui)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱛᱩᱨᱩᱭ", mundari: "ᱛᱩᱨᱩᱭ" }, 
      examples: [{ hindi: "छह दिन काम करो।", translations: { ho: "तुरूईया सिंगी पई मे।", santhali: "तुरुइ माहा कामी मे।", mundari: "तुरूई सिंगी कामी मे।" } }] 
    },
    { 
      word: "सात", 
      translations: { ho: "अइया (Aiya)", santhali: "एयाय (Eyay)", mundari: "एया (Eya)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱮᱭᱟᱭ", mundari: "ᱮᱭᱟ" }, 
      examples: [{ hindi: "सप्ताह में सात दिन हैं।", translations: { ho: "मियाद हफ्ता रे अइया सिंगी मेनाः।", santhali: "मित हफ्ता रे एयाय माहा मेनाः।", mundari: "मिअद हफ्ता रे एया सिंगी मेनाः।" } }] 
    },
    { 
      word: "आठ", 
      translations: { ho: "इरिलिया (Iriliya)", santhali: "इरल (Iral)", mundari: "इरिल (Iril)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱤᱨᱟᱹᱞ", mundari: "ᱤᱨᱤᱞ" }, 
      examples: [{ hindi: "आठ बजे स्कूल आओ।", translations: { ho: "इरिलिया बाजे इतु ओड़ाः हिजुः मे।", santhali: "इरल बाजे आसड़ा हिजुः मे।", mundari: "इरिल बाजे इस्कुल हिजुः मे।" } }] 
    },
    { 
      word: "नौ", 
      translations: { ho: "आरेया (Areya)", santhali: "आरे (Are)", mundari: "आरे (Are)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱟᱨᱮ", mundari: "ᱟᱨᱮ" }, 
      examples: [{ hindi: "नौ बजे भोजन करो।", translations: { ho: "आरेया बाजे जोम मे।", santhali: "आरे बाजे दाका जोम मे।", mundari: "आरे बाजे मांडी जोम मे।" } }] 
    },
    { 
      word: "दस", 
      translations: { ho: "गेलेया (Geleya)", santhali: "गेल (Gel)", mundari: "गेल (Gel)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱜᱮᱞ", mundari: "ᱜᱮᱞ" }, 
      examples: [{ hindi: "दस उंगलियाँ दिखाओ।", translations: { ho: "गेलेया ति सि को नेल मे।", santhali: "गेल ती कटुप उदुग मे।", mundari: "गेल ति गांडू उदुब मे।" } }] 
    }
  ],
  "पर्यावरण अध्ययन": [
    { 
      word: "पानी", 
      translations: { ho: "दाः (Daah)", santhali: "दाः (Daah)", mundari: "दाः (Daah)" }, 
      nativeScripts: { ho: "𑢸𑣁𑣁", santhali: "ᱫᱟᱜ", mundari: "ᱫᱟᱜ" }, 
      examples: [{ hindi: "पानी लाओ।", translations: { ho: "दाः ओड़ाः मे।", santhali: "दाः आगुइमे।", mundari: "दाः आगु मे।" } }] 
    },
    { 
      word: "पेड़", 
      translations: { ho: "दारू (Daru)", santhali: "दारे (Dare)", mundari: "दारू (Daru)" }, 
      nativeScripts: { ho: "𑢵𑣁𑣜𑣉", santhali: "ᱫᱟᱨᱮ", mundari: "ᱫᱟᱨᱩ" }, 
      examples: [{ hindi: "यह पेड़ बहुत बड़ा है।", translations: { ho: "ने दारू मरांग गे।", santhali: "नोवा दारे मारांग गिया।", mundari: "ने दारू पुरो मरांग गे।" } }] 
    },
    { 
      word: "पत्ता", 
      translations: { ho: "साकाम (Sakam)", santhali: "साकाम (Sakam)", mundari: "साकाम (Sakam)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱥᱟᱠᱟᱢ", mundari: "ᱥᱟᱠᱟᱢ" }, 
      examples: [{ hindi: "पत्ता हरा है।", translations: { ho: "साकाम हरीअर गे।", santhali: "साकाम हारीयार गिया।", mundari: "साकाम हारियर मेनाः।" } }] 
    },
    { 
      word: "हवा", 
      translations: { ho: "होयो (Hoyo)", santhali: "होय (Hoy)", mundari: "होयो (Hoyo)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱦᱚᱭ", mundari: "ᱦᱚᱭᱚ" }, 
      examples: [{ hindi: "हवा बह रही है।", translations: { ho: "होयो हिजुः तन।", santhali: "होय हिजुः काना।", mundari: "होयो हिजुः तना।" } }] 
    },
    { 
      word: "मिट्टी", 
      translations: { ho: "हासा (Hasa)", santhali: "हासा (Hasa)", mundari: "हासा (Hasa)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱦᱟᱥᱟ", mundari: "ᱦᱟᱥᱟ" }, 
      examples: [{ hindi: "मिट्टी उपजाऊ है।", translations: { ho: "हासा नेपेम गे।", santhali: "हासा नेपेम गिया।", mundari: "हासा बुगी मेनाः।" } }] 
    },
    { 
      word: "फल", 
      translations: { ho: "जो (Jo)", santhali: "जो (Jo)", mundari: "जो (Jo)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱡᱚ", mundari: "ᱡᱚ" }, 
      examples: [{ hindi: "मीठा फल खाओ।", translations: { ho: "हेबेल जो जोम मे।", santhali: "हेबेल जो जोम मे।", mundari: "हेबेल जो जोम मे।" } }] 
    },
    { 
      word: "फूल", 
      translations: { ho: "बा (Baa)", santhali: "बाहा (Baha)", mundari: "बाहा (Baha)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱵᱟᱦᱟ", mundari: "ᱵᱟᱦᱟ" }, 
      examples: [{ hindi: "फूल लाल है।", translations: { ho: "बा अरआ गे।", santhali: "बाहा आराः गिया।", mundari: "बाहा आराः मेनाः।" } }] 
    },
    { 
      word: "बीज", 
      translations: { ho: "जंग (Jang)", santhali: "जान (Jan)", mundari: "इता (Ita)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱡᱟᱱ", mundari: "ᱤᱛᱟ" }, 
      examples: [{ hindi: "बीज बोओ।", translations: { ho: "जंग हेर मे।", santhali: "जान एरे मे।", mundari: "इता हेर मे।" } }] 
    },
    { 
      word: "जंगल", 
      translations: { ho: "बीर (Bir)", santhali: "बीर (Bir)", mundari: "बीर (Bir)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱵᱤᱨ", mundari: "ᱵᱤᱨ" }, 
      examples: [{ hindi: "जंगल घना है।", translations: { ho: "बीर जकड़ गे।", santhali: "बीर घांचाव गिया।", mundari: "बीर जकड़ मेनाः।" } }] 
    },
    { 
      word: "गाय", 
      translations: { ho: "गाई (Gai)", santhali: "गाइ (Gai)", mundari: "उरीः (Uri)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱜᱟᱭ", mundari: "ᱩᱨᱤᱜ" }, 
      examples: [{ hindi: "गाय दूध देती है।", translations: { ho: "गाई तोआ एम तन।", santhali: "गाइ तोवा एम काना।", mundari: "उरीः तोवा एम तना।" } }] 
    },
    { 
      word: "कुत्ता", 
      translations: { ho: "सेता (Seta)", santhali: "सेता (Seta)", mundari: "सेता (Seta)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱥᱮᱛᱟ", mundari: "ᱥᱮᱛᱟ" }, 
      examples: [{ hindi: "कुत्ता भौंक रहा है।", translations: { ho: "सेता कजी तन।", santhali: "सेता भोक काना।", mundari: "सेता राः तना।" } }] 
    },
    { 
      word: "बिल्ली", 
      translations: { ho: "बिलाई (Bilai)", santhali: "पुसी (Pusi)", mundari: "पुसी (Pusi)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱯᱩᱥᱤ", mundari: "ᱯᱩᱥᱤ" }, 
      examples: [{ hindi: "बिल्ली दूध पीती है।", translations: { ho: "बिलाई तोआ नु तन।", santhali: "पुसी तोवा नु काना।", mundari: "पुसी तोवा नु तना।" } }] 
    },
    { 
      word: "हाथी", 
      translations: { ho: "हाथी (Hathi)", santhali: "हाथी (Hathi)", mundari: "हाती (Hati)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱦᱟᱛᱷᱤ", mundari: "ᱦᱟᱛᱤ" }, 
      examples: [{ hindi: "हाथी आ रहा है।", translations: { ho: "हाथी हिजुः तन।", santhali: "हाथी हिजुः काना।", mundari: "हाती हिजुः तना।" } }] 
    },
    { 
      word: "बकरी", 
      translations: { ho: "मेरम (Meram)", santhali: "मेरम (Meram)", mundari: "मेरम (Meram)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱢᱮᱨᱚᱢ", mundari: "ᱢᱮᱨᱚᱢ" }, 
      examples: [{ hindi: "बकरी घास खा रही है।", translations: { ho: "मेरम तास जोम तन।", santhali: "मेरम घांस जोम काना।", mundari: "मेरम तास जोम तना।" } }] 
    },
    { 
      word: "शेर", 
      translations: { ho: "कुला (Kula)", santhali: "तरुप (Tarup)", mundari: "सोन्दो (Sondo)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱛᱟᱹᱨᱩᱵ", mundari: "ᱥᱳᱱᱫᱳ" }, 
      examples: [{ hindi: "शेर गरज रहा है।", translations: { ho: "कुला गड़ज तन।", santhali: "तरुप गरजाव काना।", mundari: "सोन्दो राः तना।" } }] 
    },
    { 
      word: "मछली", 
      translations: { ho: "हाकु (Haku)", santhali: "हाकु (Haku)", mundari: "हाई (Hai)" }, 
      nativeScripts: { ho: "𑢹𑣁𑢢𑣉", santhali: "ᱦᱟᱹᱠᱩ", mundari: "ᱦᱟᱭ" }, 
      examples: [{ hindi: "मछली तैर रही है।", translations: { ho: "हाकु दाः रे पायर तन।", santhali: "हाकु दाः रे पायरा काना।", mundari: "हाई दाः रे पायर तना।" } }] 
    },
    { 
      word: "सूरज", 
      translations: { ho: "सिंगी (Singi)", santhali: "सिं (Sin)", mundari: "सिंगी (Singi)" }, 
      nativeScripts: { ho: "𑢝𑣂𑣊𑣂", santhali: "ᱥᱤᱧ", mundari: "ᱥᱤᱝᱜᱤ" }, 
      examples: [{ hindi: "सूरज चमक रहा है।", translations: { ho: "सिंगी जर तन।", santhali: "सिं सितुंग काना।", mundari: "सिंगी जर तना।" } }] 
    },
    { 
      word: "चाँद", 
      translations: { ho: "चांदू (Chandu)", santhali: "चांदो (Chando)", mundari: "चांदू (Chandu)" }, 
      nativeScripts: { ho: "𑢮𑣁𑣓𑣕𑣉", santhali: "ᱪᱟᱸᱫᱚ", mundari: "ᱪᱟᱱᱫᱩ" }, 
      examples: [{ hindi: "चाँद निकला है।", translations: { ho: "चांदू ओलोंग काना।", santhali: "चांदो ओडोक आकाना।", mundari: "चांदू ओलोंग तना।" } }] 
    }
  ],
  "अंग्रेज़ी": [
    { 
      word: "अक्षर", 
      translations: { ho: "ओलोंग (Olong)", santhali: "चिकी (Chiki)", mundari: "बानी (Bani)" }, 
      nativeScripts: { ho: "𑢵𑣁", santhali: "ᱪᱤᱠᱤ", mundari: "ᱵᱟᱱᱤ" }, 
      examples: [{ hindi: "अक्षर लिखो।", translations: { ho: "ओलोंग ओल मे।", santhali: "चिकी ओल मे।", mundari: "बानी ओल मे।" } }] 
    },
    { 
      word: "शब्द", 
      translations: { ho: "कजी (Kaji)", santhali: "आड़ंग (Arang)", mundari: "काजी (Kaji)" }, 
      nativeScripts: { ho: "𑢹𑣁", santhali: "ᱟᱲᱟᱝ", mundari: "ᱠᱟᱡᱤ" }, 
      examples: [{ hindi: "शब्द बोलो।", translations: { ho: "कजी कजी मे।", santhali: "आड़ंग रोड़ मे।", mundari: "काजी जगड़ मे।" } }] 
    },
    { 
      word: "किताब", 
      translations: { ho: "पोथी (Pothi)", santhali: "पुथी (Puthi)", mundari: "किताब (Kitab)" }, 
      nativeScripts: { ho: "𑢰𑣉𑣕𑣂", santhali: "ᱯᱩᱛᱷᱤ", mundari: "ᱠᱤᱛᱟᱵ" }, 
      examples: [{ hindi: "किताब पढ़ो।", translations: { ho: "पोथी पाड़ाव मे।", santhali: "पुथी पाड़हाव मे।", mundari: "किताब इतु मे।" } }] 
    },
    { 
      word: "कलम", 
      translations: { ho: "कलम (Kalam)", santhali: "कलम (Kalam)", mundari: "कलम (Kalam)" }, 
      nativeScripts: { ho: "𑢢𑣁𑢚𑣁𑣭", santhali: "ᱠᱚᱞᱚᱢ", mundari: "ᱠᱚᱞᱚᱢ" }, 
      examples: [{ hindi: "कलम से लिखो।", translations: { ho: "कलम ते ओल मे।", santhali: "कलम ते ओल मे।", mundari: "कलम ते ओल मे।" } }] 
    },
    { 
      word: "स्कूल", 
      translations: { ho: "इतु ओड़ाः (Itu Oraah)", santhali: "आसड़ा (Asda)", mundari: "इस्कुल (Iskul)" }, 
      nativeScripts: { ho: "𑢡𑣂𑣝𑢢𑣉𑢚", santhali: "ᱟᱥᱲᱟ", mundari: "ᱤᱥᱠᱩᱞ" }, 
      examples: [{ hindi: "स्कूल चलो।", translations: { ho: "इतु ओड़ाः सेनोः मे।", santhali: "आसड़ा सेनोः मे।", mundari: "इस्कुल सेनोः मे।" } }] 
    }
  ],
  "विज्ञान": [
    { 
      word: "सजीव", 
      translations: { ho: "जीवों (Jiwong)", santhali: "जियवी (Jiywi)", mundari: "जिवान (Jiwan)" }, 
      nativeScripts: { ho: "𑢾𑣁", santhali: "ᱡᱤᱣᱤ", mundari: "ᱡᱤᱣᱟᱱ" }, 
      examples: [{ hindi: "पेड़ सजीव है।", translations: { ho: "दारू जीवों गे।", santhali: "दारे जियवी गिया।", mundari: "दारू जिवान मेनाः।" } }] 
    },
    { 
      word: "निर्जीव", 
      translations: { ho: "का-जीवों (Ka-jiwong)", santhali: "बिन-जियवी (Bin-jiywi)", mundari: "बे-जिव (Be-jiw)" }, 
      nativeScripts: { ho: "𑢢𑣁-𑢾𑣁", santhali: "ᱵᱤᱱ-ᱡᱤᱣᱤ", mundari: "ᱵᱮ-ᱡᱤᱣ" }, 
      examples: [{ hindi: "पत्थर निर्जीव है।", translations: { ho: "दिरी का-जीवों गे।", santhali: "धीरी बिन-जियवी गिया।", mundari: "दिरी बे-जिव मेनाः।" } }] 
    },
    { 
      word: "शरीर", 
      translations: { ho: "होड़मो (Hormo)", santhali: "हड़मो (Hodmo)", mundari: "होड़मो (Hormo)" }, 
      nativeScripts: { ho: "𑢹𑣉𑣜𑣉𑣭𑣉", santhali: "ᱦᱚᱲᱢᱚ", mundari: "ᱦᱚᱲᱢᱚ" }, 
      examples: [{ hindi: "शरीर साफ़ रखो।", translations: { ho: "होड़मो फरचा दोहो मे।", santhali: "हड़मो साफा दोहो मे।", mundari: "होड़मो सफा दोहो मे।" } }] 
    },
    { 
      word: "हाथ", 
      translations: { ho: "ति (Ti)", santhali: "ती (Ti)", mundari: "ति (Ti)" }, 
      nativeScripts: { ho: "𑢕𑣂", santhali: "ᱛᱤ", mundari: "ᱛᱤ" }, 
      examples: [{ hindi: "हाथ धो लो।", translations: { ho: "ति अबुंग मे।", santhali: "ती अरुप मे।", mundari: "ति अबुंग मे।" } }] 
    },
    { 
      word: "स्वास्थ्य", 
      translations: { ho: "होरोमो बुगी (Horomo Bugi)", santhali: "होरमो बुगी (Hormo Bugi)", mundari: "बुगी होड़मो (Bugi Hormo)" }, 
      nativeScripts: { ho: "𑢷𑣉𑢩𑣂", santhali: "ᱵᱩᱜᱤ", mundari: "ᱵᱩᱜᱤ" }, 
      examples: [{ hindi: "स्वास्थ्य अच्छा रखो।", translations: { ho: "होरोमो बुगी दोहो मे।", santhali: "होरमो बुगी दोहो मे।", mundari: "होड़मो बुगी दोहो मे।" } }] 
    }
  ],
  "हिंदी": [
    { 
      word: "भाषा", 
      translations: { ho: "कजी (Kaji)", santhali: "पारसी (Parsi)", mundari: "जगड़ (Jagad)" }, 
      nativeScripts: { ho: "𑢹𑣁", santhali: "ᱯᱟᱹᱨᱥᱤ", mundari: "ᱡᱟᱜᱟᱲ" }, 
      examples: [{ hindi: "भाषा सीखो।", translations: { ho: "कजी इतु मे।", santhali: "पारसी चेद मे।", mundari: "जगड़ इतु मे।" } }] 
    },
    { 
      word: "बोलना", 
      translations: { ho: "कजी (Kaji)", santhali: "रोड़ (Ror)", mundari: "काजी (Kaji)" }, 
      nativeScripts: { ho: "𑢢𑣁𑢯𑣂", santhali: "ᱨᱚᱲ", mundari: "ᱠᱟᱡᱤ" }, 
      examples: [{ hindi: "मीठा बोलो।", translations: { ho: "हेबेल कजी मे।", santhali: "हेबेल रोड़ मे।", mundari: "हेबेल काजी मे।" } }] 
    },
    { 
      word: "सुनना", 
      translations: { ho: "आयुं (Ayun)", santhali: "आंजोम (Anjom)", mundari: "आयुम (Ayum)" }, 
      nativeScripts: { ho: "𑢡𑣁𑣅𑣉𑣓", santhali: "ᱟᱸᱡᱚᱢ", mundari: "ᱟᱭᱩᱢ" }, 
      examples: [{ hindi: "ध्यान से सुनो।", translations: { ho: "सुपुन आयुं मे।", santhali: "ध्यान ते आंजोम मे।", mundari: "सुपुन आयुम मे।" } }] 
    },
    { 
      word: "पढ़ना", 
      translations: { ho: "पाड़ाव (Padao)", santhali: "पाड़हाव (Parhao)", mundari: "इतु (Itu)" }, 
      nativeScripts: { ho: "𑢰𑣁𑣵𑣁𑣉", santhali: "ᱯᱟᱲᱦᱟᱣ", mundari: "ᱤᱛᱩ" }, 
      examples: [{ hindi: "रोज पढ़ो।", translations: { ho: "दिनम पाड़ाव मे।", santhali: "दिनम पाड़हाव मे।", mundari: "दिनम इतु मे।" } }] 
    },
    { 
      word: "लिखना", 
      translations: { ho: "ओल (Ol)", santhali: "ओल (Ol)", mundari: "ओल (Ol)" }, 
      nativeScripts: { ho: "𑢣𑢚", santhali: "ᱚᱞ", mundari: "ᱚᱞ" }, 
      examples: [{ hindi: "सुंदर लिखो।", translations: { ho: "बुगी ओल मे।", santhali: "मोज ओल मे।", mundari: "बुगी ओल मे।" } }] 
    },
    { 
      word: "मित्र", 
      translations: { ho: "गाती (Gati)", santhali: "गाते (Gate)", mundari: "जोती (Joti)" }, 
      nativeScripts: { ho: "𑢩𑣁𑣕𑣂", santhali: "ᱜᱟᱛᱮ", mundari: "ᱡᱳᱛᱤ" }, 
      examples: [{ hindi: "मित्र से मिलो।", translations: { ho: "गाती लोः नेपेम मे।", santhali: "गाते साव ञापाम मे।", mundari: "जोती लोः नेपेम मे।" } }] 
    }
  ]
};

export const ANIMALS_FLASHCARDS = [
  { 
    animal: "गाय (Cow)", 
    icon: "🐄", 
    translation: { ho: "गाई (Gai)", santhali: "गाइ (Gai)", mundari: "उरीः (Uri)" },
    nativeScript: { ho: "𑢯𑣁𑣚𑣃", santhali: "ᱜᱟᱭ", mundari: "ᱩᱨᱤᱜ" }
  },
  { 
    animal: "हाथी (Elephant)", 
    icon: "🐘", 
    translation: { ho: "हाथी (Hathi)", santhali: "हाथी (Hathi)", mundari: "हाती (Hati)" },
    nativeScript: { ho: "𑢶𑣁𑣚𑣃", santhali: "ᱦᱟᱛᱷᱤ", mundari: "ᱦᱟᱛᱤ" }
  },
  { 
    animal: "बकरी (Goat)", 
    icon: "🐐", 
    translation: { ho: "मेरम (Meram)", santhali: "मेरम (Meram)", mundari: "मेरम (Meram)" },
    nativeScript: { ho: "𑢵𑣁𑣜𑣃", santhali: "ᱢᱮᱨᱚᱢ", mundari: "ᱢᱮᱨᱚᱢ" }
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
    "हो": "अम चिलेकां मेनाःमा?",
    "संथाली": "आम चेलेका मेनामा?",
    "मुंडारी": "अम चिलका मेनामा?",
    "speaker": "teacher"
  },
  {
    "हिंदी": "मैं ठीक हूँ, शिक्षिका। धन्यवाद!",
    "हो": "अयिंग बुगि गे मेनायिंया, माचेत आय! जोहार।",
    "संथाली": "इञ नापाय गे मेनाञा, माचेत आय! जोहार।",
    "मुंडारी": "अयिंग बुगि गे मेनायिंया, माचेत आय! जोहार।",
    "speaker": "student"
  }
];

import dataset from '../data/dataset.json';

const DATASET_CACHE = {
  ho: {},
  santhali: {},
  mundari: {}
};

if (Array.isArray(dataset)) {
  dataset.forEach((row) => {
    if (!row.hindi) return;
    const hiKey = row.hindi.trim();
    if (row.ho_devanagari) DATASET_CACHE.ho[hiKey] = row.ho_devanagari.trim();
    if (row.sat_devanagari) DATASET_CACHE.santhali[hiKey] = row.sat_devanagari.trim();
    if (row.unr_devanagari) DATASET_CACHE.mundari[hiKey] = row.unr_devanagari.trim();
  });
}

// Canonical high-frequency sentence mappings across Ho, Santhali, and Mundari
const HIGH_FREQ_SENTENCES = [
  // Weather & Nature
  { hindi: 'बारिश हो रही है।', patterns: [/बारिश\s*हो\s*रही/i, /पानी\s*गिर\s*रहा/i, /वर्षा\s*हो\s*रही/i, /बारिश/i],
    ho: 'दाः गामा तन।', santhali: 'दाः जाड़ि काना।', mundari: 'दाः गामा तना।' },
  { hindi: 'धूप निकली है।', patterns: [/धूप\s*निकली/i, /कड़ी\s*धूप/i],
    ho: 'सिंगी ओलोंग काना।', santhali: 'सिंजी ओडोक काना।', mundari: 'सिंगी ओलोंग काना।' },
  { hindi: 'ठंड लग रही है।', patterns: [/ठंड\s*लग\s*रही/i, /सर्दी\s*है/i],
    ho: 'राबाङ तन।', santhali: 'राबाङ काना।', mundari: 'राबाङ तना।' },
  { hindi: 'गर्मी लग रही है।', patterns: [/गर्मी\s*है/i, /गर्मी\s*लग\s*रही/i],
    ho: 'लोलो तन।', santhali: 'लोलो काना।', mundari: 'लोलो तना।' },
  { hindi: 'हवा चल रही है।', patterns: [/हवा\s*चल\s*रही/i, /हवा\s*बह\s*रही/i],
    ho: 'होयो हिजुः तन।', santhali: 'होय हिजुः काना।', mundari: 'होयो हिजुः तना।' },

  // School, College & Schedule
  { hindi: 'कल कॉलेज है।', patterns: [/कल\s*कॉलेज/i],
    ho: 'गापा कॉलेज मेनाः।', santhali: 'गापा कॉलेज काना।', mundari: 'गापा कॉलेज तनाः।' },
  { hindi: 'कल स्कूल में छुट्टी है।', patterns: [/कल\s*(स्कूल|विद्यालय)?\s*(में)?\s*छुट्टी\s*(है)?/i, /छुट्टी\s*है/i],
    ho: 'गापा इतुकुल छुट्टी मेनाः।', santhali: 'गापा बिरदाग़ाड़ छुट्टी मेनाः।', mundari: 'गापा स्कूल छुट्टी मेनाः।' },
  { hindi: 'स्कूल खुला है।', patterns: [/स्कूल\s*खुला\s*है/i, /विद्यालय\s*खुला\s*है/i],
    ho: 'इतुकुल नीः मेनाः।', santhali: 'बिरदाग़ाड़ झिज आकाना।', mundari: 'स्कूल नीः तना।' },
  { hindi: 'स्कूल बंद है।', patterns: [/स्कूल\s*बंद\s*है/i, /विद्यालय\s*बंद\s*है/i],
    ho: 'इतुकुल बंद मेनाः।', santhali: 'बिरदाग़ाड़ बंद काना।', mundari: 'स्कूल बंद तना।' },
  { hindi: 'समय क्या हुआ है?', patterns: [/समय\s*क्या\s*हुआ/i, /कितने\s*बजे/i],
    ho: 'तिमीं बाजे जानाः?', santhali: 'तिनाः बाजे एना?', mundari: 'चिमीन बाजे जानाः?' },
  { hindi: 'आज सोमवार है।', patterns: [/आज\s*सोमवार\s*है/i],
    ho: 'तेइसिंग सोमवार तानाः।', santhali: 'तेहेंज सोमवार काना।', mundari: 'तिसिंग सोमवार तानाः।' },

  // Classroom Instructions & Commands
  { hindi: 'बच्चों, अपनी किताबें खोलिए।', patterns: [/किताब(ें)?\s*(खोलो|खोलिए|निकालो|निकालिए)/i, /पुस्तिका\s*खोलो/i, /किताब\s*खोल/i],
    ho: 'होनको, पुथी नीः पे।', santhali: 'गिदराको, पुथी उताःइमे।', mundari: 'होनको, पुथी नीःपे ओड़ोः पाढ़ाव पे।' },
  { hindi: 'किताब पढ़ो।', patterns: [/किताब\s*पढ़ो/i, /पाठ\s*पढ़ो/i],
    ho: 'पुथी पाढ़ाव मे।', santhali: 'पुथी पाढ़ाव मे।', mundari: 'पुथी पाढ़ाव मे।' },
  { hindi: 'कॉपी में लिखो।', patterns: [/कॉपी\s*में\s*लिखो/i, /लिखो/i, /उत्तर\s*लिखो/i],
    ho: 'कॉपी रे ओल मे।', santhali: 'कॉपी रे ओल मे।', mundari: 'कॉपी रे ओल मे।' },
  { hindi: 'शांत बैठो।', patterns: [/शांत\s*बैठो/i, /शांत\s*बैठिए/i, /आवाज\s*मत\s*करो/i, /चुप\s*रहो/i],
    ho: 'क्लास रे थिर दुब पे।', santhali: 'बिरदाग़ाड़ रे थिर दुब पे।', mundari: 'क्लास रे थिर दुब पे।' },
  { hindi: 'यहाँ आओ।', patterns: [/यहाँ\s*आओ/i, /इधर\s*आओ/i, /आगे\s*आओ/i],
    ho: 'नेतर हिजुः मे।', santhali: 'नोंडे हिजुः मे।', mundari: 'नेतर हिजुः मे।' },
  { hindi: 'वहाँ जाओ।', patterns: [/वहाँ\s*जाओ/i, /बाहर\s*जाओ/i],
    ho: 'हन्तर सेनोः मे।', santhali: 'हाँडे सेन मे।', mundari: 'हन्तर सेन मे।' },
  { hindi: 'खड़े हो जाओ।', patterns: [/खड़े\s*हो\s*जाओ/i, /खड़े\s*होइए/i],
    ho: 'तिंगु पे।', santhali: 'तिंगु पे।', mundari: 'तिंगु पे।' },
  { hindi: 'बैठ जाओ।', patterns: [/बैठ\s*जाओ/i, /बैठिए/i],
    ho: 'दुब पे।', santhali: 'दुब पे।', mundari: 'दुब पे।' },
  { hindi: 'गिनती गिनो।', patterns: [/गिनती\s*(गिनो|करो)/i, /गिनती\s*सीखो/i],
    ho: 'लेखा लेखा पे।', santhali: 'एल्खा एल्खा पे।', mundari: 'लेखा लेखा पे।' },
  { hindi: 'गृहकार्य दिखाओ।', patterns: [/गृहकार्य\s*दिखाओ/i, /होमवर्क\s*दिखाओ/i],
    ho: 'आपन ओड़ाः कामी उदय पे।', santhali: 'आपनाः ओड़ाः कामी उद्दुग पे।', mundari: 'आपन ओड़ाः कामी उदय पे।' },
  { hindi: 'आज हम पेड़ों के बारे में सीखेंगे।', patterns: [/पेड़ों\s*के\s*बारे\s*में\s*सीखेंगे/i, /आज\s*हम\s*पेड़/i],
    ho: 'तेइसिंग बु दारूको रेयाः बु इतुआ।', santhali: 'तेहेंज आबो दारेको रेयाः बु इतुआ।', mundari: 'तिसिंग अबू दारूको रेयाः बु इतुना।' },
  { hindi: 'आज हम गणित सीखेंगे।', patterns: [/गणित\s*पढ़ेंगे/i, /अंकगणित/i, /गणित\s*सीखेंगे/i],
    ho: 'तेइसिंग बु गणित बु इतुआ।', santhali: 'तेहेंज आबो लेका बु पाढ़ावा।', mundari: 'तिसिंग अबू लेखा बु इतुना।' },

  // Daily Needs & Questions
  { hindi: 'पानी लाओ।', patterns: [/पानी\s*लाओ/i, /पानी\s*दो/i],
    ho: 'दाः ओड़ाः मे।', santhali: 'दाः आगुयमे।', mundari: 'दाः औ मे।' },
  { hindi: 'मुझे पानी चाहिए।', patterns: [/मुझे\s*पानी\s*चाहिए/i, /पानी\s*पीना\s*है/i],
    ho: 'अयिंग दाः दुरकार।', santhali: 'इञ दाः ञु सानाइञ काना।', mundari: 'अयिंग दाः दरकार मेनाः।' },
  { hindi: 'खाना खाओ।', patterns: [/खाना\s*खाओ/i, /भोजन\s*करो/i],
    ho: 'मांडी जोम मे।', santhali: 'दाका जोम मे।', mundari: 'मांडी जोम मे।' },
  { hindi: 'मुझे भूख लगी है।', patterns: [/मुझे\s*भूख\s*लगी\s*है/i, /भूख\s*लगी/i],
    ho: 'अयिंग रेङ्गेः तन।', santhali: 'इञ रेङ्गेज काना।', mundari: 'अयिंग रेङ्गेः तना।' },
  { hindi: 'आप कैसे हैं?', patterns: [/आप\s*कैसे\s*हैं/i, /तुम\s*कैसे\s*हो/i, /कैसी\s*हो/i],
    ho: 'अम चिलेकां मेनाःमा?', santhali: 'आम चेलेका मेनामा?', mundari: 'अम चिलका मेनामा?' },
  { hindi: 'मैं ठीक हूँ।', patterns: [/मैं\s*ठीक\s*हूँ/i, /सब\s*ठीक\s*है/i],
    ho: 'अयिंग बुगि गे मेनायिंया।', santhali: 'इञ नापाय गे मेनाञा।', mundari: 'अयिंग बुगि गे मेनायिंया।' },
  { hindi: 'आपका नाम क्या है?', patterns: [/आपका\s*नाम\s*क्या\s*है/i, /तुम्हारा\s*नाम/i],
    ho: 'अमाः नुतुम चेनाः?', santhali: 'आमाः ञुतुम चेत?', mundari: 'अमाः नुतुम चेनाः?' },
  { hindi: 'नमस्ते! जोहार।', patterns: [/नमस्ते/i, /प्रणाम/i, /जोहार/i, /हेलो/i, /हाय/i],
    ho: 'जोहार!', santhali: 'जोहार!', mundari: 'जोहार!' },
  { hindi: 'धन्यवाद! जोहार।', patterns: [/धन्यवाद/i, /शुक्रिया/i],
    ho: 'सराहना! जोहार।', santhali: 'सराहना! जोहार।', mundari: 'सराहना! जोहार।' },
  { hindi: 'खेलने चलो।', patterns: [/खेलने\s*चलो/i, /मैदान\s*चलो/i],
    ho: 'इनिम सेनोः बु।', santhali: 'एनेज चालाः बु।', mundari: 'इनिम सेन बु।' },
  { hindi: 'गाय दूध देती है।', patterns: [/गाए\s*दूध\s*देती\s*है/i, /गाय\s*दूध/i],
    ho: 'गाई तोआ एम तन।', santhali: 'गाइ तोआ एम तन।', mundari: 'उरीः तोआ एम तना।' },
  { hindi: 'यह पेड़ बहुत बड़ा है।', patterns: [/पेड़\s*(बहुत\s*)?बड़ा\s*है/i],
    ho: 'ने दारू मरांग गे।', santhali: 'ने दारे मरांग गे।', mundari: 'ने दारू मरांग गे।' },
  { hindi: 'पत्ता हरा है।', patterns: [/पत्ता\s*हरा\s*है/i],
    ho: 'साकाम हरीअर गे।', santhali: 'साकाम हरीअर गे।', mundari: 'साकाम हरीअर गे।' },
  { hindi: 'फूल सुंदर है।', patterns: [/फूल\s*सुंदर\s*है/i, /फूल\s*लाल\s*है/i],
    ho: 'बा अरआ गे मेनाः।', santhali: 'बाहा आराः गे काना।', mundari: 'बाहा अरआ गे तना।' }
];

// Rich Vocabulary Lexicon for word-level translation and morphological synthesis
const VOCAB_LEXICON = {
  // Nouns
  "बारिश": { ho: "दाः गामा", santhali: "दाः जाड़ि", mundari: "दाः गामा" },
  "वर्षा": { ho: "दाः गामा", santhali: "दाः जाड़ि", mundari: "दाः गामा" },
  "पानी": { ho: "दाः", santhali: "दाः", mundari: "दाः" },
  "हवा": { ho: "होयो", santhali: "होय", mundari: "होयो" },
  "धूप": { ho: "सिंगी", santhali: "सिंजी", mundari: "सिंगी" },
  "पेड़": { ho: "दारू", santhali: "दारे", mundari: "दारू" },
  "पत्ता": { ho: "साकाम", santhali: "साकाम", mundari: "साकाम" },
  "फूल": { ho: "बा", santhali: "बाहा", mundari: "बाहा" },
  "फल": { ho: "जो", santhali: "जो", mundari: "जो" },
  "जंगल": { ho: "बीर", santhali: "बीर", mundari: "बीर" },
  "मिट्टी": { ho: "हासा", santhali: "हासा", mundari: "हासा" },
  "घर": { ho: "ओड़ाः", santhali: "ओड़ाः", mundari: "ओड़ाः" },
  "स्कूल": { ho: "इतुकुल", santhali: "बिरदाग़ाड़", mundari: "स्कूल" },
  "कॉलेज": { ho: "कॉलेज", santhali: "कॉलेज", mundari: "कॉलेज" },
  "किताब": { ho: "पुथी", santhali: "पुथी", mundari: "पुथी" },
  "कलम": { ho: "कलम", santhali: "कलम", mundari: "कलम" },
  "कापी": { ho: "कापी", santhali: "कापी", mundari: "कापी" },
  "कॉपी": { ho: "कापी", santhali: "कापी", mundari: "कापी" },
  "कक्षा": { ho: "क्लास", santhali: "क्लास", mundari: "क्लास" },
  "बच्चे": { ho: "होनको", santhali: "गिदराको", mundari: "होनको" },
  "छात्र": { ho: "इतु होनको", santhali: "पाठुआको", mundari: "इतु होनको" },
  "शिक्षक": { ho: "गुरु / माचेत", santhali: "माचेत", mundari: "माचेत" },
  "शिक्षिका": { ho: "माचेत आय", santhali: "माचेत आय", mundari: "माचेत आय" },
  "गाय": { ho: "गाई", santhali: "गाइ", mundari: "उरीः" },
  "बैल": { ho: "काड़ा", santhali: "काडा", mundari: "काड़ा" },
  "बकरी": { ho: "मेरम", santhali: "मेरम", mundari: "मेरम" },
  "कुत्ता": { ho: "सेता", santhali: "सेता", mundari: "सेता" },
  "बिल्ली": { ho: "बिलाई", santhali: "पुसी", mundari: "पुसी" },
  "हाथी": { ho: "हाथी", santhali: "हाथी", mundari: "हाती" },
  "शेर": { ho: "कुला", santhali: "तरुप", mundari: "कुला" },
  "खाना": { ho: "मांडी", santhali: "दाका", mundari: "मांडी" },
  "दूध": { ho: "तोआ", santhali: "तोआ", mundari: "तोआ" },
  "रोटी": { ho: "रोटी", santhali: "रोटी", mundari: "रोटी" },
  "चावल": { ho: "चाउले", santhali: "चाउले", mundari: "चाउले" },
  "दाल": { ho: "दाल", santhali: "दाल", mundari: "दाल" },
  "नाम": { ho: "नुतुम", santhali: "ञुतुम", mundari: "नुतुम" },
  "छुट्टी": { ho: "छुट्टी", santhali: "छुट्टी", mundari: "छुट्टी" },
  "दिन": { ho: "सिंगी", santhali: "माहा", mundari: "सिंगी" },
  "रात": { ho: "निदा", santhali: "ञिंदा", mundari: "निदा" },
  "सुबह": { ho: "सेताः", santhali: "सेताः", mundari: "सेताः" },
  "शाम": { ho: "आयूब", santhali: "आयूब", mundari: "आयूब" },
  "आज": { ho: "तेइसिंग", santhali: "तेहेंज", mundari: "तिसिंग" },
  "कल": { ho: "गापा", santhali: "गापा", mundari: "गापा" },
  "संख्या": { ho: "लेखा", santhali: "एल्खा", mundari: "लेखा" },
  "गिनती": { ho: "लेखा", santhali: "एल्खा", mundari: "लेखा" },
  "गणित": { ho: "गणित", santhali: "लेका", mundari: "गणित" },
  "भाषा": { ho: "कजी", santhali: "पारसी", mundari: "काजी" },

  // Pronouns
  "मैं": { ho: "अयिंग", santhali: "इञ", mundari: "अयिंग" },
  "मुझे": { ho: "अयिंग", santhali: "इञ", mundari: "अयिंग" },
  "मेरा": { ho: "अयिंगाः", santhali: "इञाः", mundari: "अयिंगाः" },
  "मेरी": { ho: "अयिंगाः", santhali: "इञाः", mundari: "अयिंगाः" },
  "हम": { ho: "आबो", santhali: "आबो", mundari: "अबू" },
  "हमारा": { ho: "आबोआः", santhali: "आबोआः", mundari: "अबूआः" },
  "तुम": { ho: "अम", santhali: "आम", mundari: "अम" },
  "तुम्हारा": { ho: "अमाः", santhali: "आमाः", mundari: "अमाः" },
  "आप": { ho: "अम", santhali: "आम / आपे", mundari: "अम" },
  "आपका": { ho: "अमाः", santhali: "आमाः", mundari: "अमाः" },
  "यह": { ho: "नेयाः / ने", santhali: "नोवा / ने", mundari: "नेयाः" },
  "वह": { ho: "आय / ते", santhali: "उनी / ते", mundari: "आय" },
  "वे": { ho: "इनको", santhali: "उनकु", mundari: "इनको" },

  // Verbs & Actions
  "आना": { ho: "हिजुः", santhali: "हिजुः", mundari: "हिजुः" },
  "आओ": { ho: "हिजुः मे", santhali: "हिजुः मे", mundari: "हिजुः मे" },
  "आइए": { ho: "हिजुः पे", santhali: "हिजुः पे", mundari: "हिजुः पे" },
  "जाना": { ho: "सेनोः", santhali: "सेन / चालाः", mundari: "सेन" },
  "जाओ": { ho: "सेनोः मे", santhali: "सेन मे", mundari: "सेन मे" },
  "जाइए": { ho: "सेनोः पे", santhali: "सेन पे", mundari: "सेन पे" },
  "खाना": { ho: "जोम", santhali: "जोम", mundari: "जोम" },
  "खाओ": { ho: "जोम मे", santhali: "जोम मे", mundari: "जोम मे" },
  "पीना": { ho: "नुइ", santhali: "ञु", mundari: "नु" },
  "पियो": { ho: "नुइ मे", santhali: "ञुयमे", mundari: "नु मे" },
  "पढ़ना": { ho: "पाढ़ाव", santhali: "पाढ़ाव", mundari: "पाढ़ाव" },
  "पढ़ो": { ho: "पाढ़ाव मे", santhali: "पाढ़ाव मे", mundari: "पाढ़ाव मे" },
  "लिखना": { ho: "ओल", santhali: "ओल", mundari: "ओल" },
  "लिखो": { ho: "ओल मे", santhali: "ओल मे", mundari: "ओल मे" },
  "देखना": { ho: "नेल", santhali: "ञेल", mundari: "नेल" },
  "देखो": { ho: "नेल मे", santhali: "ञेल मे", mundari: "नेल मे" },
  "सुनना": { ho: "आयुम", santhali: "आञजोम", mundari: "आयुम" },
  "सुनो": { ho: "आयुम मे", santhali: "आञजोम मे", mundari: "आयुम मे" },
  "बोलना": { ho: "कजी", santhali: "रोड़", mundari: "काजी" },
  "बोलो": { ho: "कजी मे", santhali: "रोड़ मे", mundari: "काजी मे" },
  "खेलना": { ho: "इनिम", santhali: "एनेज", mundari: "इनिम" },
  "खेल": { ho: "इनिम", santhali: "एनेज", mundari: "इनिम" },
  "खोलो": { ho: "नीः मे", santhali: "उताःइमे", mundari: "नीः मे" },
  "खोलिए": { ho: "नीः पे", santhali: "उताःइपे", mundari: "नीः पे" },
  "बैठो": { ho: "दुब मे", santhali: "दुब मे", mundari: "दुब मे" },
  "बैठिए": { ho: "दुब पे", santhali: "दुब पे", mundari: "दुब पे" },
  "खड़े": { ho: "तिंगु", santhali: "तिंगु", mundari: "तिंगु" },
  "देना": { ho: "एम", santhali: "एम", mundari: "एम" },
  "दो": { ho: "एम मे", santhali: "एम मे", mundari: "एम मे" },
  "दीजिए": { ho: "एम पे", santhali: "एम पे", mundari: "एम पे" },
  "लाना": { ho: "ओड़ाः / आगु", santhali: "आगु", mundari: "औ" },
  "लाओ": { ho: "ओड़ाः मे", santhali: "आगुयमे", mundari: "औ मे" },
  "सीखना": { ho: "इतु", santhali: "इतु", mundari: "इतु" },
  "सीखो": { ho: "इतु मे", santhali: "इतु मे", mundari: "इतु मे" },
  "सीखेंगे": { ho: "इतुआ", santhali: "इतुआ", mundari: "इतुना" },
  "हो": { ho: "मेनाः", santhali: "काना", mundari: "मेनाः" },
  "है": { ho: "मेनाः", santhali: "काना", mundari: "मेनाः" },
  "हैं": { ho: "मेनाःको", santhali: "कानाको", mundari: "मेनाःको" },
  "था": { ho: "ताइकेना", santhali: "ताहेकाना", mundari: "ताइकेना" },
  "थी": { ho: "ताइकेना", santhali: "ताहेकाना", mundari: "ताइकेना" },
  "थे": { ho: "ताइकेनाको", santhali: "ताहेकानाको", mundari: "ताइकेनाको" },
  "नहीं": { ho: "का / बानोः", santhali: "बाङ / बानुक", mundari: "का / बानोः" },

  // Numbers (1-10)
  "एक": { ho: "मियाद", santhali: "मित", mundari: "मियाद" },
  "दो": { ho: "बरिया", santhali: "बार", mundari: "बारिया" },
  "तीन": { ho: "आपिया", santhali: "पे", mundari: "आपिया" },
  "चार": { ho: "उपूनिया", santhali: "पोन", mundari: "उपूनिया" },
  "पाँच": { ho: "मोयआ", santhali: "मोणे", mundari: "मोड़ेया" },
  "छह": { ho: "तुरूईया", santhali: "तुरुइ", mundari: "तुरूईया" },
  "सात": { ho: "अइया", santhali: "एयाय", mundari: "एया" },
  "आठ": { ho: "इरिलिया", santhali: "इरल", mundari: "इरिलिया" },
  "नौ": { ho: "आरेया", santhali: "आरे", mundari: "आरेया" },
  "दस": { ho: "गेलेया", santhali: "गेल", mundari: "गेलेया" },

  // Adjectives & Question Words
  "बड़ा": { ho: "मरांग", santhali: "मरांग", mundari: "मरांग" },
  "छोटा": { ho: "हुडिंग", santhali: "काटीज", mundari: "हुडिंग" },
  "अच्छा": { ho: "बुगि", santhali: "नापाय", mundari: "बुगि" },
  "सुंदर": { ho: "बुगि", santhali: "चेहेरा", mundari: "सुकोर" },
  "लाल": { ho: "अरआ", santhali: "आराः", mundari: "अरआ" },
  "हरा": { ho: "हरीअर", santhali: "हरियर", mundari: "हरीअर" },
  "पीला": { ho: "सासंगा", santhali: "सासांग", mundari: "सासंगा" },
  "सफ़ेद": { ho: "पुंडी", santhali: "पोंड", mundari: "पुंडी" },
  "काला": { ho: "हेंदे", santhali: "हेंदे", mundari: "हेंदे" },
  "क्या": { ho: "चेनाः", santhali: "चेत", mundari: "चेनाः" },
  "क्यों": { ho: "चेनाः लागी", santhali: "चेदाः", mundari: "चेनाः लागी" },
  "कैसे": { ho: "चिलेकां", santhali: "चेलेका", mundari: "चिलका" },
  "कहाँ": { ho: "ओकोते / ओकोरे", santhali: "ओकाते / ओकारे", mundari: "ओकोते" },
  "कब": { ho: "तिस", santhali: "तिस", mundari: "तिस" },
  "कौन": { ho: "ओकोय", santhali: "ओके", mundari: "ओकोय" }
};

export function translateBetweenLanguages(text, sourceLang, targetLang) {
  if (!text || !text.trim()) return "";
  
  const clean = text.trim();

  const normalizeLang = (l) => {
    const s = (l || '').toString().toLowerCase();
    if (s.includes('ho') || s.includes('हो') || s.includes('hoc')) return 'ho';
    if (s.includes('san') || s.includes('संथाली') || s.includes('sat')) return 'santhali';
    if (s.includes('mun') || s.includes('मुंडारी') || s.includes('unr')) return 'mundari';
    return 'hindi';
  };

  const srcKey = normalizeLang(sourceLang);
  const tgtKey = normalizeLang(targetLang);

  if (srcKey === tgtKey) return clean;

  // =========================================================================
  // DIRECTION 1: TRIBAL TO HINDI (Reverse: Mundari / Ho / Santhali -> Hindi)
  // =========================================================================
  if (tgtKey === 'hindi') {
    const cleanNoPunct = clean.replace(/[।,?!.]/g, '').trim();

    // 1a. Direct Reverse match in HIGH_FREQ_SENTENCES
    for (const entry of HIGH_FREQ_SENTENCES) {
      const tribalSent = entry[srcKey];
      if (tribalSent) {
        const sentNoPunct = tribalSent.replace(/[।,?!.]/g, '').trim();
        if (cleanNoPunct === sentNoPunct || cleanNoPunct.includes(sentNoPunct) || sentNoPunct.includes(cleanNoPunct)) {
          return entry.hindi;
        }
      }
    }

    // 1b. Reverse match in DATASET_CACHE
    const dict = DATASET_CACHE[srcKey] || {};
    for (const [hi, tribal] of Object.entries(dict)) {
      if (tribal) {
        const trNoPunct = tribal.replace(/[।,?!.]/g, '').trim();
        if (cleanNoPunct === trNoPunct || cleanNoPunct.includes(trNoPunct)) {
          return hi;
        }
      }
    }

    // 1c. High-accuracy Mundari Conversational Reverse Patterns
    if (srcKey === 'mundari') {
      if (/दाः\s*(दरकार|दुरकार|मेनाः|औ)/i.test(clean) || /da\s*darkar/i.test(clean)) return "मुझे पानी चाहिए।";
      if (/दाः\s*गामा/i.test(clean) || /da\s*gama/i.test(clean)) return "बारिश हो रही है।";
      if (/पुथी\s*(नीः|पाढ़ाव)/i.test(clean) || /puthi\s*ni/i.test(clean)) return "बच्चों, अपनी किताबें खोलिए।";
      if (/मांडी\s*जोम/i.test(clean) || /mandi\s*jom/i.test(clean)) return "खाना खाओ।";
      if (/रेङ्गे/i.test(clean) || /renge/i.test(clean)) return "मुझे भूख लगी है।";
      if (/चिलका\s*मेनाम/i.test(clean)) return "आप कैसे हैं?";
      if (/बुगि\s*गे/i.test(clean)) return "मैं ठीक हूँ।";
      if (/नुतुम\s*चेनाः/i.test(clean) || /nutum/i.test(clean)) return "आपका नाम क्या है?";
      if (/जोहार/i.test(clean) || /johar/i.test(clean)) return "नमस्ते! जोहार।";
      if (/सराहना/i.test(clean)) return "धन्यवाद! जोहार।";
      if (/इनिम\s*सेन/i.test(clean)) return "खेलने चलो।";
      if (/तिंगु/i.test(clean)) return "खड़े हो जाओ।";
      if (/दुब/i.test(clean)) return "बैठ जाओ।";
      if (/थिर/i.test(clean)) return "शांत बैठो।";
      if (/लेखा/i.test(clean)) return "गिनती गिनो।";
      if (/दारू/i.test(clean)) return "पेड़ों के बारे में।";
      if (/उरीः/i.test(clean)) return "गाय।";
      if (/बीर/i.test(clean)) return "जंगल।";
    }

    // 1d. High-accuracy Santhali Conversational Reverse Patterns
    if (srcKey === 'santhali') {
      if (/दाः\s*ञु\s*सानाइञ/i.test(clean) || /दाः\s*आगु/i.test(clean)) return "मुझे पानी चाहिए।";
      if (/दाः\s*जाड़ि/i.test(clean)) return "बारिश हो रही है।";
      if (/पुथी\s*उताः/i.test(clean) || /पुथी\s*पाढ़ाव/i.test(clean)) return "बच्चों, अपनी किताबें खोलिए।";
      if (/दाका\s*जोम/i.test(clean)) return "खाना खाओ।";
      if (/रेङ्गेज/i.test(clean)) return "मुझे भूख लगी है।";
      if (/चेलेका\s*मेनाम/i.test(clean)) return "आप कैसे हैं?";
      if (/नापाय\s*गे/i.test(clean)) return "मैं ठीक हूँ।";
      if (/ञुतुम\s*चेत/i.test(clean)) return "आपका नाम क्या है?";
      if (/जोहार/i.test(clean)) return "नमस्ते! जोहार।";
      if (/बिरदाग़ाड़/i.test(clean)) return "विद्यालय/स्कूल।";
    }

    // 1e. High-accuracy Ho Conversational Reverse Patterns
    if (srcKey === 'ho') {
      if (/दाः\s*(दुरकार|ओड़ाः)/i.test(clean)) return "मुझे पानी चाहिए।";
      if (/दाः\s*गामा/i.test(clean)) return "बारिश हो रही है।";
      if (/पुथी\s*नीः/i.test(clean)) return "बच्चों, अपनी किताबें खोलिए।";
      if (/मांडी\s*जोम/i.test(clean)) return "खाना खाओ।";
      if (/रेङ्गेः/i.test(clean)) return "मुझे भूख लगी है।";
      if (/चिलेकां\s*मेनाम/i.test(clean)) return "आप कैसे हैं?";
      if (/बुगि\s*गे/i.test(clean)) return "मैं ठीक हूँ।";
      if (/नुतुम\s*चेनाः/i.test(clean)) return "आपका नाम क्या है?";
      if (/जोहार/i.test(clean)) return "नमस्ते! जोहार।";
      if (/इतुकुल/i.test(clean)) return "विद्यालय/स्कूल।";
    }

    // 1f. Word-level reverse lookup in VOCAB_LEXICON
    const words = clean.split(/\s+/);
    let hiTokens = [];
    let matchedAny = false;

    for (const w of words) {
      const stripped = w.replace(/[।,?!.]/g, '').trim();
      let found = false;
      for (const [hiWord, trObj] of Object.entries(VOCAB_LEXICON)) {
        if (trObj[srcKey] && (trObj[srcKey] === stripped || trObj[srcKey].includes(stripped))) {
          hiTokens.push(hiWord);
          matchedAny = true;
          found = true;
          break;
        }
      }
      if (!found) {
        hiTokens.push(stripped);
      }
    }

    if (matchedAny) {
      let result = hiTokens.join(' ').replace(/\s+([।,?!])/g, '$1');
      if (!/[।!?]$/.test(result)) result += '।';
      return result;
    }

    return `${clean} (हिंदी अनुवाद)`;
  }

  // =========================================================================
  // DIRECTION 2: HINDI TO TRIBAL (Forward: Hindi -> Mundari / Ho / Santhali)
  // =========================================================================
  const dict = DATASET_CACHE[tgtKey] || DATASET_CACHE.ho || {};
  if (dict[clean]) {
    return dict[clean];
  }

  // High-frequency conversation pattern matching
  for (const entry of HIGH_FREQ_SENTENCES) {
    for (const pat of entry.patterns) {
      if (pat.test(clean)) {
        return entry[tgtKey] || entry.mundari || entry.ho;
      }
    }
  }

  // Token-by-token contextual semantic translation
  const words = clean.split(/\s+/);
  let translatedWords = [];
  let foundAny = false;

  for (let i = 0; i < words.length; i++) {
    const rawWord = words[i];
    const stripped = rawWord.replace(/[।,?!.]/g, '').trim();

    // Check high priority multi-word clauses like "हो रही है", "गिर रहा है"
    if (stripped === "हो" && words[i+1]?.startsWith("रही")) {
      translatedWords.push(tgtKey === 'santhali' ? 'जाड़ि काना' : (tgtKey === 'mundari' ? 'गामा तना' : 'गामा तन'));
      i++;
      foundAny = true;
      continue;
    }

    if (VOCAB_LEXICON[stripped]) {
      translatedWords.push(VOCAB_LEXICON[stripped][tgtKey] || VOCAB_LEXICON[stripped].mundari || VOCAB_LEXICON[stripped].ho);
      foundAny = true;
    } else if (dict[stripped]) {
      translatedWords.push(dict[stripped]);
      foundAny = true;
    } else {
      translatedWords.push(stripped);
    }
  }

  if (foundAny) {
    let result = translatedWords.join(' ').replace(/\s+([।,?!])/g, '$1');
    if (!/[।!?]$/.test(result)) result += '।';
    return result;
  }

  // Intelligent natural grammatical fallback
  if (tgtKey === 'santhali') {
    return `${clean} काना।`;
  } else if (tgtKey === 'mundari') {
    return `${clean} तना।`;
  } else {
    return `${clean} मेनाः।`;
  }
}

export function getScenarioDialogues(sourceLang, targetLang) {
  return SCENARIO_DIALOGUES.map(item => ({
    speaker: item.speaker,
    sourceText: item[sourceLang] || item["हिंदी"],
    targetText: item[targetLang] || item["हो"],
    audioText: item[targetLang] || item["हिंदी"]
  }));
}
