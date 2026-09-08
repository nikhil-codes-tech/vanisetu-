import React, { useState, useEffect, useRef } from 'react';
import TeacherAuth from './components/TeacherAuth';
import Dashboard from './components/Dashboard';
import WorksheetGenerator from './components/WorksheetGenerator';
import VocabularyList from './components/VocabularyList';
import LiveConversation from './components/LiveConversation';
import Dictionary from './components/Dictionary';
import TeacherProfile from './components/TeacherProfile';
import Avatar from './components/Avatar';
import { 
  Download, Wifi, WifiOff, Globe, ArrowLeftRight,
  Languages, Mic, Book, ChevronRight, ChevronLeft, Volume2, User, Bell, Search, Eye, EyeOff, Printer, FileText, CheckCircle2
} from 'lucide-react';
import { translateBetweenLanguages, VOCABULARY_DATABASE, LANGUAGES_METADATA, SUBJECTS_DATA, ANIMALS_FLASHCARDS } from './utils/mockData';
import { FLASHCARD_MATRIX, getQuizForCardAndLanguage } from './utils/flashcardsData';
import { MOCK_SCHOOLS } from './data/jharkhandData';
import canvasConfetti from 'canvas-confetti';
import PiperTtsService from './services/piperTts';
import WhisperAsrService from './services/whisperAsr';

const mockSyllabusData = {
  "कक्षा 1": {
    "गणित": [
      { id: "c1_m1", title: "संख्या पहचान (1-10)", nipun: "M-G1.1", outcomeText: "1 से 10 तक के अंकों की पहचान और गिनती।" },
      { id: "c1_m2", title: "सरल जोड़ (एक अंक)", nipun: "M-G1.2", outcomeText: "एक अंक के सरल जोड़ का अभ्यास।" },
      { id: "c1_m3", title: "आकृतियों की पहचान", nipun: "M-G1.3", outcomeText: "बुनियादी आकृतियाँ जैसे गोल, तिकोना और चौकोर पहचानना।" },
      { id: "c1_m4", title: "बड़ा और छोटा", nipun: "M-G1.4", outcomeText: "वस्तुओं के आकार की तुलना करना और वर्गीकृत करना।" }
    ],
    "हिंदी": [
      { id: "c1_h1", title: "स्वर और व्यंजन वर्ण", nipun: "L-G1.1", outcomeText: "वर्णमाला के अक्षरों की पहचान और उच्चारण।" },
      { id: "c1_h2", title: "दो अक्षरों वाले शब्द", nipun: "L-G1.2", outcomeText: "बिना मात्रा वाले दो अक्षरों के सरल शब्दों का पठन।" },
      { id: "c1_h3", title: "कविता और बालगीत", nipun: "L-G1.3", outcomeText: "सरल कविताओं को लय के साथ दोहराना और समझना।" }
    ],
    "पर्यावरण अध्ययन": [
      { id: "c1_e1", title: "मेरा शरीर (My Body)", nipun: "E-G1.1", outcomeText: "शरीर के अंगों के नाम और उनके कार्य।" },
      { id: "c1_e2", title: "मेरा परिवार (My Family)", nipun: "E-G1.2", outcomeText: "परिवार के सदस्यों के रिश्तों और भूमिकाओं की समझ।" },
      { id: "c1_e3", title: "हमारा घर (Our Home)", nipun: "E-G1.3", outcomeText: "घर के विभिन्न हिस्सों और उनकी सफाई का महत्व।" }
    ],
    "अंग्रेज़ी": [
      { id: "c1_a1", title: "Alphabet A to M", nipun: "L-G1.4", outcomeText: "Identify characters A to M and sound association." },
      { id: "c1_a2", title: "Alphabet N to Z", nipun: "L-G1.5", outcomeText: "Identify characters N to Z and sound association." },
      { id: "c1_a3", title: "Greetings & Polite Words", nipun: "L-G1.6", outcomeText: "Use basic greeting terms like Hello, Good Morning, Thank You." }
    ],
    "विज्ञान": [
      { id: "c1_s1", title: "हमारे आसपास की चीजें", nipun: "S-G1.1", outcomeText: "आसपास की सजीव और निर्जीव वस्तुओं की सामान्य पहचान।" },
      { id: "c1_s2", title: "हवा और पानी", nipun: "S-G1.2", outcomeText: "जीवन के लिए हवा और पानी की बुनियादी आवश्यकता की समझ।" },
      { id: "c1_s3", title: "दिन और रात", nipun: "S-G1.3", outcomeText: "सूरज, चाँद, तारों की पहचान और दिन-रात का अंतर।" }
    ]
  },
  "कक्षा 2": {
    "गणित": [
      { id: "c2_m1", title: "संख्या पहचान (11-50)", nipun: "M-G2.1", outcomeText: "11 से 50 तक के अंकों की पहचान और लिखना।" },
      { id: "c2_m2", title: "दो अंकों का जोड़ व घटाव", nipun: "M-G2.2", outcomeText: "हासिल रहित जोड़ व घटाव की प्रक्रिया।" },
      { id: "c2_m3", title: "लंबाई और वजन का मापन", nipun: "M-G2.3", outcomeText: "अमानक इकाइयों (जैसे बित्ता, कदम) से लंबाई मापना।" }
    ],
    "हिंदी": [
      { id: "c2_h1", title: "मात्राओं का ज्ञान", nipun: "L-G2.1", outcomeText: "मात्रा वाले शब्दों को पढ़ना और लिखना।" },
      { id: "c2_h2", title: "सरल वाक्य पठन", nipun: "L-G2.2", outcomeText: "तीन से चार शब्दों के सरल वाक्यों को प्रवाह के साथ पढ़ना।" },
      { id: "c2_h3", title: "चित्र कथा वर्णन", nipun: "L-G2.3", outcomeText: "चित्रों को देखकर कहानी बुनना और उसे व्यक्त करना।" }
    ],
    "पर्यावरण अध्ययन": [
      { id: "c2_e1", title: "पालतू जानवर (Domestic Animals)", nipun: "E-G2.1", outcomeText: "जानवरों के नाम और उनकी उपयोगिता।" },
      { id: "c2_e2", title: "पेड़-पौधे हमारे मित्र", nipun: "E-G2.2", outcomeText: "पौधों के महत्व और उनके विभिन्न उपयोगों की समझ।" },
      { id: "c2_e3", title: "मौसम और ऋतुएँ", nipun: "E-G2.3", outcomeText: "विभिन्न ऋतुओं (गर्मी, सर्दी, वर्षा) के अनुसार खानपान और पहनावा।" }
    ],
    "अंग्रेज़ी": [
      { id: "c2_a1", title: "Two-Letter Blends", nipun: "L-G2.4", outcomeText: "Read phonics blends like an, at, in, op." },
      { id: "c2_a2", title: "Action Words", nipun: "L-G2.5", outcomeText: "Understand and execute action verbs like Run, Jump, Sit, Stand." },
      { id: "c2_a3", title: "Colors and Shapes", nipun: "L-G2.6", outcomeText: "Identify primary colors and shapes in English." }
    ],
    "विज्ञान": [
      { id: "c2_s1", title: "पौधों के भाग", nipun: "S-G2.1", outcomeText: "पौधों के विभिन्न भागों (जड़, तना, पत्ती) का अध्ययन।" },
      { id: "c2_s2", title: "पशुओं के घर", nipun: "S-G2.2", outcomeText: "पशु-पक्षियों के रहने के स्थानों और घोंसलों की पहचान।" },
      { id: "c2_s3", title: "स्वस्थ शरीर और स्वच्छता", nipun: "S-G2.3", outcomeText: "स्वच्छता की आदतें और स्वास्थ्य के नियम।" }
    ]
  },
  "कक्षा 3": {
    "गणित": [
      { id: "c3_m1", title: "संख्या पहचान (51-100)", nipun: "M-G3.1", outcomeText: "51 से 100 तक के अंकों की समझ और उनका मान।" },
      { id: "c3_m2", title: "सरल गुणा", nipun: "M-G3.2", outcomeText: "एक अंकीय संख्याओं का गुणा करना।" },
      { id: "c3_m3", title: "पैटर्न और डिज़ाइन", nipun: "M-G3.3", outcomeText: "संख्या और आकृतियों के सरल पैटर्नों को आगे बढ़ाना।" }
    ],
    "हिंदी": [
      { id: "c3_h1", title: "संयुक्त अक्षर और वाक्य रचना", nipun: "L-G3.1", outcomeText: "छोटे वाक्यों का निर्माण और प्रवाह के साथ पठन।" },
      { id: "c3_h2", title: "कहानी का संक्षेपण", nipun: "L-G3.2", outcomeText: "पढ़ी गई कहानी के मुख्य पात्रों और घटनाओं को बताना।" },
      { id: "c3_h3", title: "पर्यायवाची शब्द", nipun: "L-G3.3", outcomeText: "समान अर्थ वाले शब्दों की पहचान और प्रयोग।" }
    ],
    "पर्यावरण अध्ययन": [
      { id: "c3_e1", title: "पेड़ और जल (Water & Trees)", nipun: "E-G3.1", outcomeText: "जल चक्र और हमारे जीवन में पेड़ों का योगदान।" },
      { id: "c3_e2", title: "हमारा भोजन", nipun: "E-G3.2", outcomeText: "संतुलित आहार और भोजन के मुख्य स्रोतों की समझ।" },
      { id: "c3_e3", title: "यातायात के साधन", nipun: "E-G3.3", outcomeText: "विभिन्न वाहनों और सड़क सुरक्षा के नियमों की जानकारी।" }
    ],
    "अंग्रेज़ी": [
      { id: "c3_a1", title: "Simple Three Letter Words", nipun: "L-G3.4", outcomeText: "Read CVC words like cat, dog, map, run." },
      { id: "c3_a2", title: "Nouns & Pronouns", nipun: "L-G3.5", outcomeText: "Identify naming words (Noun) and replacement words (Pronoun)." },
      { id: "c3_a3", title: "Short Stories reading", nipun: "L-G3.6", outcomeText: "Read and comprehend simple 2-3 sentence passages." }
    ],
    "विज्ञान": [
      { id: "c3_s1", title: "प्रकाश और छाया", nipun: "S-G3.1", outcomeText: "प्रकाश के स्रोत और छाया कैसे बनती है।" },
      { id: "c3_s2", title: "बल and गति (Force & Motion)", nipun: "S-G3.2", outcomeText: "धक्का देने और खींचने (Push/Pull) की सरल समझ।" },
      { id: "c3_s3", title: "मिट्टी के प्रकार", nipun: "S-G3.3", outcomeText: "मिट्टी के प्रकार और फसलों में इसकी उपयोगिता।" }
    ]
  },
  "कक्षा 4": {
    "गणित": [
      { id: "c4_m1", title: "स्थानीय मान (Place Value)", nipun: "M-G4.1", outcomeText: "चार अंकों की संख्याओं का स्थानीय मान ज्ञात करना।" },
      { id: "c4_m2", title: "सरल भाग", nipun: "M-G4.2", outcomeText: "एक अंकीय संख्या से भाग की प्रक्रिया और शेषफल।" },
      { id: "c4_m3", title: "समय और घड़ी", nipun: "M-G4.3", outcomeText: "घड़ी देखना और घंटे तथा मिनट की समझ विकसित करना।" }
    ],
    "हिंदी": [
      { id: "c4_h1", title: "कहानी पठन एवं संक्षेपण", nipun: "L-G4.1", outcomeText: "कहानियों को पढ़कर उनका मुख्य विचार समझाना।" },
      { id: "c4_h2", title: "विलोम शब्द और मुहावरे", nipun: "L-G4.2", outcomeText: "विपरीतार्थक शब्द और आम बोलचाल के मुहावरों का प्रयोग।" },
      { id: "c4_h3", title: "पत्र लेखन", nipun: "L-G4.3", outcomeText: "अनौपचारिक पत्रों का प्रारूप और लेखन अभ्यास।" }
    ],
    "पर्यावरण अध्ययन": [
      { id: "c4_e1", title: "झारखंड के वन्यजीव", nipun: "E-G4.1", outcomeText: "स्थानीय वन्यजीवों और राष्ट्रीय उद्यानों की समझ।" },
      { id: "c4_e2", title: "हमारे त्योहार और संस्कृति", nipun: "E-G4.2", outcomeText: "झारखंड के लोक त्योहारों (सरहुल, करमा) का महत्व।" },
      { id: "c4_e3", title: "आश्रय और घर के प्रकार", nipun: "E-G4.3", outcomeText: "विभिन्न भौगोलिक क्षेत्रों के अनुकूल घरों के प्रकार।" }
    ],
    "अंग्रेज़ी": [
      { id: "c4_a1", title: "Sentence Formation", nipun: "L-G4.4", outcomeText: "Frame simple sentences using correct subject-verb agreement." },
      { id: "c4_a2", title: "Adjectives (Describing Words)", nipun: "L-G4.5", outcomeText: "Use describing words like Big, Small, Beautiful, Green." },
      { id: "c4_a3", title: "Prepositions of Place", nipun: "L-G4.6", outcomeText: "Use prepositions like In, On, Under, Behind correctly." }
    ],
    "विज्ञान": [
      { id: "c4_s1", title: "पदार्थ की अवस्थाएँ", nipun: "S-G4.1", outcomeText: "ठोस, द्रव और गैस की अवधारणा और उनके उदाहरण।" },
      { id: "c4_s2", title: "पौधों में भोजन निर्माण", nipun: "S-G4.2", outcomeText: "प्रकाश संश्लेषण (Photosynthesis) की बुनियादी प्रक्रिया।" },
      { id: "c4_s3", title: "विद्युत के सरल परिपथ", nipun: "S-G4.3", outcomeText: "बैटरी, तार और बल्ब का उपयोग कर परिपथ बनाना।" }
    ]
  },
  "कक्षा 5": {
    "गणित": [
      { id: "c5_m1", title: "भिन्न की अवधारणा (Fractions)", nipun: "M-G5.1", outcomeText: "भिन्न को समझना और चित्रों के माध्यम से निरूपित करना।" },
      { id: "c5_m2", title: "ज्यामितीय आकृतियाँ", nipun: "M-G5.2", outcomeText: "कोणों (समकोण, न्यूनकोण) और बुनियादी आकृतियों की पहचान।" },
      { id: "c5_m3", title: "औसत और प्रतिशत", nipun: "M-G5.3", outcomeText: "दैनिक जीवन के आंकड़ों का औसत और प्रतिशत निकालना।" }
    ],
    "हिंदी": [
      { id: "c5_h1", title: "व्याकरण: संज्ञा, सर्वनाम, क्रिया", nipun: "L-G5.1", outcomeText: "व्याकरण के बुनियादी तत्वों का वाक्यों में सही प्रयोग।" },
      { id: "c5_h2", title: "निबंध लेखन", nipun: "L-G5.2", outcomeText: "किसी विषय पर तार्किक और सुसंगठित 8-10 वाक्यों का निबंध।" },
      { id: "c5_h3", title: "अपठित गद्यांश", nipun: "L-G5.3", outcomeText: "दिए गए गद्यांश को पढ़कर पूछे गए प्रश्नों के उत्तर देना।" }
    ],
    "पर्यावरण अध्ययन": [
      { id: "c5_e1", title: "जल संरक्षण के पारंपरिक तरीके", nipun: "E-G5.1", outcomeText: "झारखंड में तालाब, डोभा और जल संचयन की पद्धतियाँ।" },
      { id: "c5_e2", title: "प्राकृतिक आपदाएँ और प्रबंधन", nipun: "E-G5.2", outcomeText: "सूखा, बाढ़ और बिजली गिरने (Vajrapāt) से बचाव के उपाय।" },
      { id: "c5_e3", title: "खनिज संपदा (Jharkhand's Minerals)", nipun: "E-G5.3", outcomeText: "झारखंड में पाए जाने वाले कोयला, लोहा, तांबा खनिजों का परिचय।" }
    ],
    "अंग्रेज़ी": [
      { id: "c5_a1", title: "Paragraph Writing", nipun: "L-G5.4", outcomeText: "Write a short cohesive paragraph about a given topic." },
      { id: "c5_a2", title: "Tenses (Past, Present, Future)", nipun: "L-G5.5", outcomeText: "Understand and convert verbs into different tenses." },
      { id: "c5_a3", title: "Conjunctions (And, But, Or)", nipun: "L-G5.6", outcomeText: "Join sentences using and, but, or properly." }
    ],
    "विज्ञान": [
      { id: "c5_s1", title: "मानव शरीर के तंत्र", nipun: "S-G5.1", outcomeText: "श्वसन तंत्र और पाचन तंत्र के बुनियादी अंगों और उनके कार्य की जानकारी।" },
      { id: "c5_s2", title: "ब्रह्मांड और सौरमंडल", nipun: "S-G5.2", outcomeText: "सूर्य, ग्रहों और चंद्रमा की गतियों की सामान्य समझ।" },
      { id: "c5_s3", title: "सरल मशीनें (Simple Machines)", nipun: "S-G5.3", outcomeText: "उत्तोलक, घिरनी और ढालू तल (Lever, Pulley) का परिचय।" }
    ]
  }
};


function getSyllabus(grade, subject) {
  const gradeKey = grade.includes('1') ? 'कक्षा 1' :
                   grade.includes('2') ? 'कक्षा 2' :
                   grade.includes('3') ? 'कक्षा 3' :
                   grade.includes('4') ? 'कक्षा 4' : 'कक्षा 5';
  
  return mockSyllabusData[gradeKey]?.[subject] || [];
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [teacherData, setTeacherData] = useState(null); // holds teacher profile object
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sourceLanguage, setSourceLanguage] = useState('हिंदी');
  const [targetLanguage, setTargetLanguage] = useState('हो');
  const [classLevel, setClassLevel] = useState('Grade 2');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  // Multi-teacher switcher state (Point 3)
  const [isTeacherSwitcherOpen, setIsTeacherSwitcherOpen] = useState(false);

  // 1. Core States
  const [selectedSubject, setSelectedSubject] = useState('गणित');
  const [curriculumClass, setCurriculumClass] = useState('कक्षा 1');
  const [curriculumSubject, setCurriculumSubject] = useState('गणित');
  
  // Interactive Network status toggle
  const [networkSimulationMode, setNetworkSimulationMode] = useState('cloud'); // cloud vs offline
  const [isOnline, setIsOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState('आज, 10:42 AM');
  const [syncStatus, setSyncStatus] = useState('safe'); 
  
  // Student Preview Full-screen replica simulator
  const [isStudentPreview, setIsStudentPreview] = useState(false);
  const [studentMockAnswer, setStudentMockAnswer] = useState(null);

  // 2. Playback speech speed rate dial
  const [speechRate, setSpeechRate] = useState(0.85); // 0.75 or 1.0

  // 3. AI Outcomes dynamic bindings
  const [selectedNipunOutcome, setSelectedNipunOutcome] = useState('M-G1.2');
  const [selectedChapterObj, setSelectedChapterObj] = useState({
    id: "math_ch1", 
    title: "संख्या पहचानो (1–5)", 
    nipun: "M-G1.2", 
    outcomeText: "M-G1.2: One-to-one number correspondence and recognition up to 5."
  });

  // 4. AI Translation
  const [translationInput, setTranslationInput] = useState('बच्चों, आज हम पेड़ों के बारे में सीखेंगे।');
  const [translationOutput, setTranslationOutput] = useState('');
  const [sharedClassroomMessage, setSharedClassroomMessage] = useState('');
  const [translationHistory, setTranslationHistory] = useState([
    { sourceText: 'पानी लाओ।', targetText: 'दाः ओड़ाः मे।', source: 'हिंदी', target: 'हो' },
    { sourceText: 'आज हम संख्या सीखेंगे।', targetText: 'तेइसिंग बु लेखा रेयाः बु इतुआ।', source: 'हिंदी', target: 'हो' }
  ]);

  const getLanguageAwareHistory = (lang) => {
    if (lang === 'संथाली') {
      return [
        { speaker: 'teacher', hindiText: 'बच्चों, किताब खोलिए।', tribalText: 'गिदराको, पुथी उताःइमे।', latency: '1.12', lang: 'संथाली' },
        { speaker: 'student', tribalText: 'इञ दाः ञु सानाइञ काना।', hindiText: 'मुझे पानी चाहिए।', latency: '1.20', lang: 'संथाली' }
      ];
    } else if (lang === 'मुंडारी') {
      return [
        { speaker: 'teacher', hindiText: 'बच्चों, किताब खोलिए।', tribalText: 'होनको, पुथी नीःपे ओड़ोः पाढ़ाव पे।', latency: '1.12', lang: 'मुंडारी' },
        { speaker: 'student', tribalText: 'अयिंग दाः दरकार मेनाः।', hindiText: 'मुझे पानी चाहिए।', latency: '1.20', lang: 'मुंडारी' }
      ];
    } else {
      return [
        { speaker: 'teacher', hindiText: 'बच्चों, किताब खोलिए।', tribalText: 'होनको, पुथी नीः पे।', latency: '1.12', lang: 'हो' },
        { speaker: 'student', tribalText: 'अयिंग दाः दुरकार।', hindiText: 'मुझे पानी चाहिए।', latency: '1.20', lang: 'हो' }
      ];
    }
  };

  // 5. Voice-to-Voice Bridge state
  const [isVoiceBridgeTranslating, setIsVoiceBridgeTranslating] = useState(false);
  const [voiceBridgeSpokenText, setVoiceBridgeSpokenText] = useState('');
  const [voiceBridgeTranslatedText, setVoiceBridgeTranslatedText] = useState('');
  const [voiceBridgeLatency, setVoiceBridgeLatency] = useState(null);
  const [voiceBridgeStep, setVoiceBridgeStep] = useState('idle'); // idle, listening, translating, playing
  const [voiceBridgeHistory, setVoiceBridgeHistory] = useState(getLanguageAwareHistory('हो'));
  const [customVoiceBridgeLine, setCustomVoiceBridgeLine] = useState('');

  // 6. Multi-grade Flashcards state
  const [flashcardClass, setFlashcardClass] = useState('कक्षा 1');
  const [flashcardSubject, setFlashcardSubject] = useState('पर्यावरण अध्ययन');
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [flashcardLearnedMap, setFlashcardLearnedMap] = useState({});
  const [isFlashcardRecording, setIsFlashcardRecording] = useState(false);
  const [flashcardScore, setFlashcardScore] = useState(null);
  const [selectedFlashcardOption, setSelectedFlashcardOption] = useState(null);
  const [flashcardQuizFeedback, setFlashcardQuizFeedback] = useState(null);

  const toggleFlashcardLearned = (cardIdx) => {
    const key = `${flashcardClass}_${flashcardSubject}_${cardIdx}`;
    setFlashcardLearnedMap(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // 7. Global Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Logout confirmation modal state
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const profileDropdownRef = useRef(null);
  const switcherDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (switcherDropdownRef.current && !switcherDropdownRef.current.contains(event.target)) {
        setIsTeacherSwitcherOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setVoiceBridgeHistory(getLanguageAwareHistory(targetLanguage));
  }, [targetLanguage]);

  const handleGlobalSpeak = (textToSpeak, langCode) => {
    const code = (langCode || '').toString().toLowerCase();
    let voiceKey = 'ho_female';
    if (code.includes('संथाली') || code.includes('santhali') || code.includes('sat')) {
      voiceKey = 'santhali_male';
    } else if (code.includes('मुंडारी') || code.includes('mundari') || code.includes('unr')) {
      voiceKey = 'mundari_standard';
    } else if (code.includes('hi') || code.includes('हिंदी') || code.includes('hindi')) {
      voiceKey = 'hindi_female';
    } else {
      voiceKey = 'ho_female';
    }
    PiperTtsService.speak(textToSpeak, { speed: speechRate, voiceModelKey: voiceKey });
  };

  const handleLogin = (teacherProfile) => {
    setTeacherData(teacherProfile);
    setSourceLanguage('हिंदी');
    
    // Set matching dialect
    const lang = teacherProfile.primaryTribalLang === 'ho' 
      ? 'हो' 
      : (teacherProfile.primaryTribalLang === 'santhali' ? 'संथाली' : 'मुंडारी');
    setTargetLanguage(lang);
    setClassLevel(teacherProfile.assignedClass || 'Grade 2');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setTeacherData(null);
    setActiveTab('dashboard');
    setIsStudentPreview(false);
  };

  const handleAITranslate = (e) => {
    e.preventDefault();
    if (!translationInput.trim()) return;
    
    const result = translateBetweenLanguages(translationInput, sourceLanguage, targetLanguage);
    setTranslationOutput(result);
    
    setTranslationHistory(prev => [
      { sourceText: translationInput, targetText: result, source: sourceLanguage, target: targetLanguage },
      ...prev.slice(0, 4)
    ]);
  };

  const handleSendToClassroom = () => {
    if (!translationOutput) return;
    setSharedClassroomMessage(translationInput);
    setActiveTab('live');
    alert("✓ अनुवादित पाठ लाइव कक्षा सत्र (Live Classroom) के शीर्ष पर भेज दिया गया है!");
  };

  const handleVoiceBridgeSpeak = async (speakingLang) => {
    setVoiceBridgeStep('listening');
    setVoiceBridgeSpokenText('');
    setVoiceBridgeTranslatedText('');
    setVoiceBridgeLatency(null);

    const startTime = performance.now();
    const langCode = speakingLang === 'Hindi' ? 'hi' : (targetLanguage === 'संथाली' ? 'sat' : (targetLanguage === 'मुंडारी' ? 'unr' : 'hoc'));

    let currentSpoken = '';
    await WhisperAsrService.startListening(langCode, (partial) => {
      currentSpoken = partial;
      setVoiceBridgeSpokenText(partial);
    });

    let hasFinalized = false;
    const finalizeSpeech = async () => {
      if (hasFinalized) return;
      hasFinalized = true;
      setVoiceBridgeStep('translating');

      const result = await WhisperAsrService.stopListening(currentSpoken, langCode);
      const recognized = (currentSpoken && currentSpoken.trim().length > 0) ? currentSpoken : result.text;
      setVoiceBridgeSpokenText(recognized);

      setTimeout(() => {
        setVoiceBridgeStep('playing');
        let trans = '';
        if (speakingLang === 'Hindi') {
          trans = translateBetweenLanguages(recognized, 'हिंदी', targetLanguage);
        } else {
          trans = translateBetweenLanguages(recognized, targetLanguage, 'हिंदी');
        }

        const latency = ((performance.now() - startTime) / 1000).toFixed(2);
        setVoiceBridgeTranslatedText(trans);
        setVoiceBridgeLatency(latency);

        if (speakingLang === 'Hindi') {
          handleGlobalSpeak(trans, targetLanguage);
          setVoiceBridgeHistory(prev => [
            { speaker: 'teacher', hindiText: recognized, tribalText: trans, latency, lang: targetLanguage },
            ...prev
          ]);
          canvasConfetti({ particleCount: 40, spread: 35, origin: { y: 0.8 } });
        } else {
          handleGlobalSpeak(trans, 'hi');
          setVoiceBridgeHistory(prev => [
            { speaker: 'student', tribalText: recognized, hindiText: trans, latency, lang: targetLanguage },
            ...prev
          ]);
        }

        setTimeout(() => setVoiceBridgeStep('idle'), 1500);
      }, 350);
    };

    const autoStopTimer = setTimeout(() => {
      finalizeSpeech();
    }, 4200);

    window._stopVoiceBridgeListener = () => {
      clearTimeout(autoStopTimer);
      finalizeSpeech();
    };
  };

  const handleCustomLineSubmit = (e) => {
    e.preventDefault();
    if (!customVoiceBridgeLine.trim()) return;
    const inputLine = customVoiceBridgeLine.trim();
    const startTime = performance.now();

    const trans = translateBetweenLanguages(inputLine, 'हिंदी', targetLanguage);
    const latency = ((performance.now() - startTime + 240) / 1000).toFixed(2);

    setVoiceBridgeSpokenText(inputLine);
    setVoiceBridgeTranslatedText(trans);
    setVoiceBridgeLatency(latency);
    setVoiceBridgeStep('playing');

    handleGlobalSpeak(trans, targetLanguage);
    setVoiceBridgeHistory(prev => [
      { speaker: 'teacher', hindiText: inputLine, tribalText: trans, latency, lang: targetLanguage },
      ...prev
    ]);
    canvasConfetti({ particleCount: 30, spread: 25, origin: { y: 0.8 } });
    setCustomVoiceBridgeLine('');

    setTimeout(() => setVoiceBridgeStep('idle'), 1200);
  };

  const handleFlashcardRecord = () => {
    setIsFlashcardRecording(true);
    setFlashcardScore(null);
    setTimeout(() => {
      setIsFlashcardRecording(false);
      setFlashcardScore(92);
      canvasConfetti({ particleCount: 40, spread: 30, origin: { y: 0.8 } });
    }, 1800);
  };

  const handleSyncNow = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setLastSyncTime(`आज, ${hours}:${minutes} ${ampm}`);
      setSyncStatus('safe');
      canvasConfetti({
        particleCount: 50,
        spread: 40,
        origin: { y: 0.8 }
      });
    }, 1500);
  };

  if (!isLoggedIn) {
    return <TeacherAuth onLoginSuccess={handleLogin} />;
  }

  // Multi-teacher switcher list loading
  const currentSchoolObj = MOCK_SCHOOLS.find(s => s.udiseCode === teacherData.udiseCode) || MOCK_SCHOOLS[0];
  const peerTeachers = currentSchoolObj ? currentSchoolObj.teachers.filter(t => t.id !== teacherData.id) : [];

  const handlePeerSwitch = (peerObj) => {
    handleLogin({
      ...peerObj,
      schoolName: currentSchoolObj.name,
      udiseCode: currentSchoolObj.udiseCode,
      district: teacherData.district,
      block: teacherData.block
    });
    setIsTeacherSwitcherOpen(false);
  };

  const activeLangMeta = LANGUAGES_METADATA[targetLanguage] || LANGUAGES_METADATA["हो"];

  const groupedNavigation = [
    {
      title: 'TEACH',
      items: [
        { id: 'dashboard', label: '🏠 Dashboard' },
        { id: 'curriculum', label: '📚 Curriculum' },
        { id: 'lessons', label: '📖 Worksheets' },
        { id: 'vocabulary', label: '🔤 Vocabulary' },
        { id: 'dictionary', label: '📖 Dictionary' },
        { id: 'flashcards', label: '🎴 Flashcards' }
      ]
    },
    {
      title: 'AI TOOLS',
      items: [
        { id: 'voice-bridge', label: '🎙 Voice Bridge' },
        { id: 'translate', label: '✨ AI Translation' }
      ]
    },
    {
      title: 'CLASSROOM',
      items: [
        { id: 'progress', label: '📊 Progress' }
      ]
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'profile', label: '👤 Teacher Profile' },
        { id: 'offline', label: '📦 Content' },
        { id: 'sync-device', label: '🔄 Sync & Device' }
      ]
    }
  ];

  return (
    <div className={`flex h-screen bg-[#FDFBF7] overflow-hidden font-sans text-slate-805 ${isStudentPreview ? 'text-lg' : ''}`}>
      
      {/* Student View replica modal */}
      {isStudentPreview && (
        <div className="fixed inset-0 bg-[#0F4D2A]/90 z-50 flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white rounded-3xl border-8 border-slate-900 shadow-2xl max-w-4xl w-full h-[620px] overflow-hidden flex flex-col justify-between p-6 relative">
            <div className="flex justify-between items-center border-b pb-3 text-xs font-black uppercase text-slate-750">
              <span className="text-emerald-805">🟢 Student Mode Replica</span>
              <button 
                onClick={() => setIsStudentPreview(false)}
                className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded h-11 flex items-center cursor-pointer min-w-[48px]"
              >
                Exit Student View
              </button>
            </div>

            <div className="my-auto space-y-6 text-center">
              <div>
                <span className="text-[10px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase">
                  M-G1.2: One-to-One Correspondence
                </span>
                <h3 className="text-base font-black text-slate-850 mt-2">चित्रों को गिनें और संख्या का चयन करें।</h3>
              </div>

              <div className="w-48 h-20 bg-slate-50 border border-slate-200 rounded-full mx-auto flex items-center justify-center text-5xl shadow-inner select-none">
                🍎 🍎 🍎
              </div>

              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                {['2', '3', '4'].map(val => (
                  <button
                    key={val}
                    onClick={() => {
                      setStudentMockAnswer(val);
                      if (val === '3') {
                        canvasConfetti({ particleCount: 80, spread: 50, origin: { y: 0.6 } });
                        handleGlobalSpeak('सबाशी गे! सही उत्तर तीन है।', 'hi');
                      }
                    }}
                    className={`h-16 text-lg font-black border rounded-lg flex items-center justify-center transition-colors cursor-pointer min-w-[56px] ${
                      studentMockAnswer === val
                        ? (val === '3' ? 'bg-emerald-50 border-emerald-350 text-emerald-800' : 'bg-rose-50 border-rose-350 text-rose-800')
                        : 'bg-[#FAF9F5] border-slate-250 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {studentMockAnswer && (
                <p className={`text-xs font-black uppercase ${studentMockAnswer === '3' ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {studentMockAnswer === '3' ? '✓ सही उत्तर (Shabash!)' : '✗ पुनः प्रयास करें'}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <button
                onClick={() => handleGlobalSpeak('चिमिन सेब मेनाः आ?', targetLanguage)}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-755 px-4.5 py-3 rounded-lg text-xs font-black flex items-center space-x-1.5 cursor-pointer h-12 min-w-[48px]"
              >
                <Volume2 className="w-4.5 h-4.5" />
                <span>छुओ और सुनो (Touch to Hear Ho)</span>
              </button>

              <span className="text-[9px] text-slate-400 font-bold uppercase">Samagra Shiksha Tablet Mock</span>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      {!isStudentPreview && (
        <aside className={`${isSidebarCollapsed ? 'w-16' : 'w-60'} bg-[#0F4D2A] text-white flex flex-col justify-between flex-shrink-0 z-20 shadow-lg transition-all duration-300`}>
          <div>
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#082a17]">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <img 
                  src="/vanisetu_logo.jpg" 
                  alt="VaniSetu Logo" 
                  className="w-8 h-8 rounded-lg object-contain bg-white p-0.5 border border-white/20 flex-shrink-0"
                />
                {!isSidebarCollapsed && (
                  <div className="text-left whitespace-nowrap">
                    <h2 className="text-xs font-black tracking-wide leading-none">PALASH VaniSetu</h2>
                    <p className="text-[7.5px] text-[#A6C4B9] uppercase tracking-widest font-extrabold mt-1">JCERT / SAMAGRA SHIKSHA</p>
                  </div>
                )}
              </div>
              <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white cursor-pointer h-9 w-9 flex items-center justify-center"
              >
                {isSidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Profile context */}
            {!isSidebarCollapsed && (
              <div className="mx-3 my-4 p-3.5 bg-[#082a17]/70 border border-white/5 rounded text-left text-xs text-slate-350 space-y-2">
                <div className="flex items-center space-x-2.5">
                  <Avatar name={teacherData.name} size="xs" border={true} />
                  <div>
                    <p className="font-extrabold text-white leading-none">{teacherData.name.split(' ')[0]}</p>
                    <p className="text-[8.5px] text-slate-400 font-bold mt-1.5 leading-none">Shikshak ID: {teacherData.id}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-2 mt-1 text-[8.5px]">
                  <span className="text-emerald-450 font-black">● Offline Config</span>
                  <span className="text-slate-500 font-bold">2026-27</span>
                </div>
              </div>
            )}

            {/* Navigation Lists with 48px min touch target */}
            <div className="p-2 py-3 space-y-3.5 max-h-[62vh] overflow-y-auto">
              {groupedNavigation.map((group, gIdx) => (
                <div key={gIdx} className="space-y-0.5 text-left">
                  {!isSidebarCollapsed && (
                    <p className="text-[8.5px] font-black text-[#6F9586] tracking-wider px-3.5 uppercase mb-1 leading-none">{group.title}</p>
                  )}
                  {group.items.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                        }}
                        className={`w-full text-left px-3.5 rounded transition-all duration-150 flex items-center group relative cursor-pointer min-h-[48px] ${
                          isActive 
                            ? 'bg-[#185c37] text-white font-black shadow-sm border-l-4 border-[#E06D10]' 
                            : 'text-[#C7D4CF] hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        {!isSidebarCollapsed ? (
                          <span className="text-xs font-bold">{item.label}</span>
                        ) : (
                          <span className="text-xs font-black text-center w-full">{item.label.substring(0, 2)}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-white/10 bg-[#082a17]/80 text-[8.5px] text-slate-400 font-bold">
            {!isSidebarCollapsed && <p className="text-center">Developed by Vanitech</p>}
          </div>
        </aside>
      )}

      {/* Main Window */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Institutional Header Bar */}
        <header className="bg-white border-b border-slate-200 px-6 flex justify-between items-center flex-shrink-0 shadow-3xs flex-wrap py-2 gap-3 min-h-[64px]">
          
          {/* UDISE & Block codes metadata */}
          <div className="text-left text-[9px] font-black text-slate-500 space-y-0.5 font-sans leading-none uppercase">
            <p className="text-slate-850 font-extrabold">🏫 UDISE School Code: {teacherData.udiseCode || '20190100201'}</p>
            <p className="text-slate-455 mt-1">District: {teacherData.district || 'Khunti'} / Block: {teacherData.block || 'Murhu'} · 2026-27</p>
          </div>

        </header>

        {/* Tab Router Workspace */}
        <main className="flex-1 overflow-y-auto bg-[#FDFBF7]">
          
          {activeTab === 'dashboard' && (
            <Dashboard
              teacherData={{ teacher: teacherData, school: teacherData.schoolName }}
              setActiveTab={setActiveTab}
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              setTargetLanguage={setTargetLanguage}
              onLogout={() => {
                setShowLogoutConfirm(true);
              }}
              classLevel={classLevel}
              setClassLevel={setClassLevel}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              isOnline={isOnline}
              setIsOnline={setIsOnline}
              lastSyncTime={lastSyncTime}
              handleSyncNow={handleSyncNow}
              syncStatus={syncStatus}
              setSelectedNipunOutcome={setSelectedNipunOutcome}
            />
          )}

          {activeTab === 'vocabulary' && (
            <VocabularyList 
              selectedLanguage={targetLanguage}
              onSpeak={handleGlobalSpeak}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          )}

          {/* Voice Bridge Workspace (Point 3 & 4) */}
          {activeTab === 'voice-bridge' && (
            <div className="p-6 max-w-5xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Voice Bridge</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Inputs left panel */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-5 space-y-5 shadow-3xs">
                  <div>
                    <span className="text-[8px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase">
                      ONNX Local Execution
                    </span>
                    <h3 className="text-sm font-black text-slate-805 mt-1.5">🎙️ Live Voice Bridge</h3>
                    <p className="text-[10px] text-slate-450 font-bold">
                      Hindi-speaking teachers can translate speech to regional language in real time.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2 border-t border-slate-100 font-sans">
                    <div className="space-y-3">
                      
                      {/* Playback speed selector rate */}
                      <div className="bg-slate-50 p-2.5 border rounded space-y-1.5">
                        <label className="block text-[9.5px] font-black text-slate-500 uppercase">
                          Speech Speed rate: {speechRate}x
                        </label>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => setSpeechRate(0.75)}
                            className={`px-3 py-1.5 border text-xs font-bold rounded-lg cursor-pointer flex-1 h-10 ${
                              speechRate === 0.75 ? 'bg-[#0F4D2A] text-white border-emerald-950' : 'bg-white text-slate-700'
                            }`}
                          >
                            0.75x (Slower for Grade 1-2)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpeechRate(1.0)}
                            className={`px-3 py-1.5 border text-xs font-bold rounded-lg cursor-pointer flex-1 h-10 ${
                              speechRate === 1.0 ? 'bg-[#0F4D2A] text-white border-emerald-950' : 'bg-white text-slate-700'
                            }`}
                          >
                            1.0x (Standard Speed)
                          </button>
                        </div>
                      </div>

                      {voiceBridgeStep === 'listening' ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (window._stopVoiceBridgeListener) window._stopVoiceBridgeListener();
                          }}
                          className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-lg cursor-pointer flex items-center justify-center space-x-2 shadow-md min-h-[48px] uppercase animate-pulse"
                        >
                          <span className="w-3 h-3 rounded-full bg-white animate-ping mr-1"></span>
                          <span>🛑 अनुवाद करें (Stop & Translate Now)</span>
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleVoiceBridgeSpeak('Hindi')}
                            disabled={voiceBridgeStep !== 'idle'}
                            className="w-full bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black rounded-lg cursor-pointer flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 min-h-[48px] uppercase"
                          >
                            <Mic className="w-4.5 h-4.5" />
                            <span>🎙️ Speak in Microphone (Hindi)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleVoiceBridgeSpeak('Tribal')}
                            disabled={voiceBridgeStep !== 'idle'}
                            className="w-full bg-indigo-650 hover:bg-indigo-755 text-white text-xs font-black rounded-lg cursor-pointer flex items-center justify-center space-x-2 shadow-xs disabled:opacity-50 min-h-[48px] uppercase"
                          >
                            <Mic className="w-4.5 h-4.5" />
                            <span>🎙️ Student Speaks ({targetLanguage})</span>
                          </button>
                        </>
                      )}

                      {/* Custom Line Text Input (Type & Translate) */}
                      <form onSubmit={handleCustomLineSubmit} className="pt-3 border-t border-slate-200 space-y-2">
                        <label className="block text-[8.5px] font-black text-slate-500 uppercase">
                          ✍️ या कोई भी वाक्य टाइप करें (Type Any Sentence)
                        </label>
                        <div className="flex space-x-1.5">
                          <input
                            type="text"
                            value={customVoiceBridgeLine}
                            onChange={(e) => setCustomVoiceBridgeLine(e.target.value)}
                            placeholder="उदा. सभी बच्चे अपनी किताबें निकालें..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:bg-white h-10"
                          />
                          <button
                            type="submit"
                            disabled={!customVoiceBridgeLine.trim()}
                            className="bg-[#E06D10] hover:bg-[#c25e0c] disabled:opacity-50 text-white text-xs font-black px-3 py-2 rounded h-10 cursor-pointer flex-shrink-0"
                          >
                            ✨ Translate & Speak
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Simulated Screen telemetry metrics */}
                <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded shadow-3xs space-y-6">
                  
                  <div className="border border-slate-205 bg-[#FAF9F5] p-5 rounded-lg text-center space-y-3">
                    <div className="flex justify-between text-[8.5px] text-[#E06D10] font-black uppercase">
                      <span>Telemetry Telemetry</span>
                      <span>Target: &lt; 3.0s</span>
                    </div>

                    {/* Waveform graphic view */}
                    <div className="py-4 flex justify-center items-center select-none">
                      {voiceBridgeStep === 'idle' && (
                        <div className="w-14 h-14 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-black">
                          🎙️
                        </div>
                      )}

                      {voiceBridgeStep === 'listening' && (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-rose-600 text-white rounded-full flex items-center justify-center font-black animate-pulse">
                            🔴
                          </div>
                          {/* CSS Waveforms */}
                          <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded px-3 w-40">
                            <span className="w-1 bg-rose-500 h-4 rounded animate-bounce"></span>
                            <span className="w-1 bg-rose-500 h-6 rounded animate-bounce delay-75"></span>
                            <span className="w-1 bg-rose-500 h-3 rounded animate-bounce delay-150"></span>
                          </div>
                          <p className="text-[10px] text-rose-600 font-extrabold uppercase">Listening Microphone...</p>
                        </div>
                      )}

                      {voiceBridgeStep === 'translating' && (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-indigo-650 text-white rounded-full flex items-center justify-center font-black animate-spin">
                            ✨
                          </div>
                          <p className="text-[10px] text-indigo-750 font-extrabold uppercase animate-pulse">Translating...</p>
                        </div>
                      )}

                      {voiceBridgeStep === 'playing' && (
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center font-black">
                            🔊
                          </div>
                          <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded px-3 w-40">
                            <span className="w-1 bg-emerald-500 h-5 rounded animate-pulse"></span>
                            <span className="w-1 bg-emerald-500 h-3 rounded animate-pulse delay-75"></span>
                            <span className="w-1 bg-emerald-500 h-6 rounded animate-pulse delay-150"></span>
                          </div>
                          <p className="text-[10px] text-emerald-800 font-extrabold uppercase">Piper TTS Playing Audio...</p>
                        </div>
                      )}
                    </div>

                    {/* Telemetry info with live memory RAM constraint specs (Point 3) */}
                    <div className="text-[9.5px] text-slate-500 bg-white border p-2.5 rounded text-left font-mono space-y-1.5 leading-none">
                      <p>Pipeline Engine: <span className="font-extrabold text-emerald-800">Local ONNX Runtime + Piper TTS</span></p>
                      {voiceBridgeLatency && <p>Latency speed: <span className="font-extrabold text-[#E06D10]">{voiceBridgeLatency}s</span></p>}
                      <p>Model Footprint: <span className="font-extrabold text-[#E06D10]">214 MB / 2048 MB RAM</span></p>
                    </div>

                    {/* Result boxes */}
                    {voiceBridgeSpokenText && (
                      <div className="space-y-1 bg-white border border-slate-200 p-3.5 rounded text-left text-xs font-bold leading-relaxed">
                        <p className="text-slate-500">Spoken / Input: "{voiceBridgeSpokenText}"</p>
                        <p className="text-indigo-950 font-mono mt-1">Translated: "{voiceBridgeTranslatedText}"</p>
                      </div>
                    )}
                  </div>

                  {/* Log lists */}
                  <div className="space-y-3 font-sans">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Conversation Log</h4>
                    <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1">
                      {voiceBridgeHistory.map((item, index) => (
                        <div key={index} className="p-3 bg-[#FAF9F5] border border-slate-200 rounded font-bold text-xs">
                          <div className="flex justify-between text-[8px] text-slate-455 uppercase tracking-wider mb-1">
                            <span>{item.speaker === 'teacher' ? 'Teacher ➔ Student' : 'Student ➔ Teacher'}</span>
                            <span className="text-emerald-805 font-extrabold">⚡ {item.latency}s delay</span>
                          </div>
                          {item.speaker === 'teacher' ? (
                            <>
                              <p className="text-slate-800">Hindi: "{item.hindiText}"</p>
                              <p className="text-indigo-900 mt-1 font-mono">{item.lang || targetLanguage}: "{item.tribalText}"</p>
                            </>
                          ) : (
                            <>
                              <p className="text-indigo-900 font-mono">{item.lang || targetLanguage}: "{item.tribalText}"</p>
                              <p className="text-slate-850 mt-1">Hindi: "{item.hindiText}"</p>
                            </>
                          )}

                          <div className="flex justify-between items-center pt-2 mt-1.5 border-t border-slate-200/60">
                            <button
                              type="button"
                              onClick={() => {
                                const textToPlay = item.speaker === 'teacher' ? item.tribalText : item.hindiText;
                                const playLang = item.speaker === 'teacher' ? (item.lang || targetLanguage) : 'hi';
                                handleGlobalSpeak(textToPlay, playLang);
                              }}
                              className="text-[10px] text-indigo-700 hover:text-indigo-900 font-bold flex items-center space-x-1.5 cursor-pointer bg-white px-3 py-1.5 rounded border border-indigo-200 shadow-3xs hover:bg-indigo-50 active:scale-95 transition-all"
                            >
                              <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
                              <span>🔊 Replay Audio</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard?.writeText(item.speaker === 'teacher' ? item.tribalText : item.hindiText);
                                alert("✓ Copied to clipboard!");
                              }}
                              className="text-[9.5px] text-slate-600 hover:text-slate-800 font-bold bg-white px-2.5 py-1.5 rounded border border-slate-200 cursor-pointer hover:bg-slate-50 active:scale-95 transition-all"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {activeTab === 'curriculum' && (() => {
            const currentSyllabusList = getSyllabus(curriculumClass, curriculumSubject);
            const activeChapterDetail = currentSyllabusList.some(ch => ch.id === selectedChapterObj?.id)
              ? selectedChapterObj
              : (currentSyllabusList[0] || null);

            return (
              <div className="p-6 max-w-5xl mx-auto space-y-6 text-left animate-fade-in font-sans">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
                  <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                  <span>/</span>
                  <span>Curriculum Outline</span>
                </div>

                {/* Class and Subject Selectors Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border border-slate-205 rounded p-5 shadow-3xs text-xs font-bold text-slate-700">
                  <div>
                    <label className="block text-[8.5px] font-black text-[#0F4D2A] uppercase mb-1.5">Class Selection (कक्षा चुनें)</label>
                    <select
                      value={curriculumClass}
                      onChange={(e) => {
                        const newCls = e.target.value;
                        setCurriculumClass(newCls);
                        const firstCh = getSyllabus(newCls, curriculumSubject)[0];
                        setSelectedChapterObj(firstCh || null);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-slate-755 font-bold cursor-pointer h-11 focus:outline-none"
                    >
                      <option value="कक्षा 1">कक्षा 1 (Grade 1)</option>
                      <option value="कक्षा 2">कक्षा 2 (Grade 2)</option>
                      <option value="कक्षा 3">कक्षा 3 (Grade 3)</option>
                      <option value="कक्षा 4">कक्षा 4 (Grade 4)</option>
                      <option value="कक्षा 5">कक्षा 5 (Grade 5)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-[8.5px] font-black text-[#0F4D2A] uppercase mb-1.5">Subject Selection (विषय चुनें)</label>
                    <select
                      value={curriculumSubject}
                      onChange={(e) => {
                        const newSub = e.target.value;
                        setCurriculumSubject(newSub);
                        const firstCh = getSyllabus(curriculumClass, newSub)[0];
                        setSelectedChapterObj(firstCh || null);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded py-2 px-3 text-slate-755 font-bold cursor-pointer h-11 focus:outline-none"
                    >
                      <option value="गणित">गणित (Mathematics)</option>
                      <option value="हिंदी">हिंदी (Hindi)</option>
                      <option value="पर्यावरण अध्ययन">पर्यावरण अध्ययन (EVS)</option>
                      <option value="अंग्रेज़ी">अंग्रेज़ी (English)</option>
                      <option value="विज्ञान">विज्ञान (Science)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* List items (Left span 5) */}
                  <div className="lg:col-span-5 bg-white border border-slate-200 rounded p-5 space-y-4 shadow-3xs">
                    <h3 className="text-sm font-black text-slate-805">📚 JCERT Outcomes ({curriculumClass} · {curriculumSubject})</h3>
                    
                    <div className="space-y-3.5">
                      {currentSyllabusList.map((ch, idx) => (
                        <div
                          key={ch.id}
                          onClick={() => setSelectedChapterObj(ch)}
                          className={`p-3.5 border rounded cursor-pointer transition-all ${
                            activeChapterDetail?.id === ch.id 
                              ? 'border-[#0F4D2A] bg-indigo-50/50' 
                              : 'border-slate-200 hover:bg-slate-50 bg-[#FAF9F5]'
                          }`}
                        >
                          <span className="text-[8px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">
                            NIPUN Competency: {ch.nipun}
                          </span>
                          <p className="text-xs font-extrabold text-slate-850 mt-1">{ch.title}</p>
                        </div>
                      ))}
                      {currentSyllabusList.length === 0 && (
                        <p className="text-xs text-slate-400 font-semibold py-8 text-center">इस कक्षा और विषय के लिए कोई पाठ्यक्रम उपलब्ध नहीं है।</p>
                      )}
                    </div>
                  </div>

                  {/* Inspect outcome details (Right span 7) */}
                  <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded shadow-3xs">
                    {activeChapterDetail ? (
                      <div className="space-y-5 animate-fade-in text-xs font-bold text-slate-700">
                        
                        <div className="border-b border-slate-100 pb-3">
                          <span className="text-[8.5px] bg-[#E06D10] text-white px-2 py-0.5 rounded font-black uppercase inline-block">
                            Competency Code: {activeChapterDetail.nipun}
                          </span>
                          <h4 className="text-sm font-black text-slate-850 mt-2">{activeChapterDetail.title}</h4>
                        </div>

                        <div className="bg-[#FAF9F5] border border-slate-200 p-3 rounded leading-relaxed">
                          <span className="text-[8px] text-slate-400 uppercase font-black block">Outcome Objective</span>
                          <p className="text-slate-800 mt-1 font-extrabold">"{activeChapterDetail.outcomeText}"</p>
                        </div>

                        {/* Aligned child workspace triggers */}
                        <div className="space-y-3">
                          <p className="text-[9px] text-[#0F4D2A] font-black uppercase">Available materials:</p>
                          
                          <div className="divide-y divide-slate-100 border border-slate-200 rounded overflow-hidden">
                            <button
                              onClick={() => setActiveTab('lessons')}
                              className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                            >
                              <span>📖 Lesson (Worksheets)</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Start exercise →</span>
                            </button>

                            <button
                              onClick={() => setActiveTab('voice-bridge')}
                              className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                            >
                              <span>🎙 Voice Script (Voice Bridge)</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Practice translation →</span>
                            </button>

                            <button
                              onClick={() => {
                                setSelectedNipunOutcome(activeChapterDetail.nipun);
                                setActiveTab('lessons');
                              }}
                              className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                            >
                              <span>📄 Worksheet (AI Generator)</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Bilingual Preview →</span>
                            </button>

                            <button
                              onClick={() => setActiveTab('flashcards')}
                              className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                            >
                              <span>🎴 Flashcards</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Visual learning →</span>
                            </button>

                            <button
                              onClick={() => setActiveTab('vocabulary')}
                              className="w-full text-left p-3.5 hover:bg-slate-50 transition-colors flex justify-between items-center cursor-pointer bg-white"
                            >
                              <span>🗣 Vocabulary</span>
                              <span className="text-[10px] text-slate-400 font-semibold">Study word list →</span>
                            </button>
                          </div>
                        </div>

                      </div>
                    ) : (
                      <div className="text-center text-slate-400 font-semibold py-24 text-xs">
                        ← बाईं ओर से कोई भी NIPUN आउटकम चैप्टर चुनें।
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })()}

          {/* Bilingual Worksheets */}
          {(activeTab === 'lessons' || activeTab === 'worksheets') && (
            <WorksheetGenerator
              selectedLanguage={targetLanguage}
              onSpeak={handleGlobalSpeak}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
            />
          )}

          {/* Flashcards */}
          {activeTab === 'flashcards' && (() => {
            const getGradeKey = (c) => {
              if (c.includes('1')) return '1';
              if (c.includes('2')) return '2';
              if (c.includes('3')) return '3';
              if (c.includes('4')) return '4';
              return '5';
            };

            const getSubjectKey = (s) => {
              if (s === 'हो भाषा') return 'language_ho';
              if (s === 'संथाली भाषा') return 'language_santhali';
              if (s === 'मुंडारी भाषा') return 'language_mundari';
              if (s === 'गणित') return 'math';
              if (s === 'अंग्रेज़ी') return 'english';
              return 'evs';
            };

            const gradeKey = getGradeKey(flashcardClass);
            const subjectKey = getSubjectKey(flashcardSubject);
            const currentDeck = (FLASHCARD_MATRIX[gradeKey] && FLASHCARD_MATRIX[gradeKey][subjectKey]) || FLASHCARD_MATRIX['1']['evs'];
            const safeCardIndex = activeCardIndex >= currentDeck.length ? 0 : activeCardIndex;
            const currentCard = currentDeck[safeCardIndex];

            // Determine active language key based on selected targetLanguage / subject
            const activeLangKey = flashcardSubject === 'संथाली भाषा' 
              ? 'संथाली' 
              : (flashcardSubject === 'मुंडारी भाषा' 
                  ? 'मुंडारी' 
                  : (flashcardSubject === 'हो भाषा' ? 'हो' : targetLanguage));

            let activeTribalLabel = targetLanguage;
            let tribalWord = currentCard.nameHo;
            let tribalScript = currentCard.scriptHo;

            if (activeLangKey === 'संथाली' || activeLangKey.includes('san') || activeLangKey.includes('संथाली')) {
              activeTribalLabel = 'संथाली (Ol Chiki)';
              tribalWord = currentCard.nameSanthali;
              tribalScript = currentCard.scriptSanthali;
            } else if (activeLangKey === 'मुंडारी' || activeLangKey.includes('mun') || activeLangKey.includes('मुंडारी')) {
              activeTribalLabel = 'मुंडारी (Bani / Devanagari)';
              tribalWord = currentCard.nameMundari;
              tribalScript = currentCard.scriptMundari;
            } else {
              activeTribalLabel = 'हो (Warang Chiti)';
              tribalWord = currentCard.nameHo;
              tribalScript = currentCard.scriptHo;
            }

            const activeQuiz = getQuizForCardAndLanguage(currentCard, activeLangKey);

            return (
              <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
                <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                  <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                  <span>/</span>
                  <span>Visual Learning Cards</span>
                </div>

                <div className="bg-white border border-slate-205 rounded p-6 shadow-3xs space-y-5">
                  <div>
                    <h3 className="text-sm font-black text-slate-805">🎴 Visual Learning Cards (Flashcards)</h3>
                    <p className="text-[10px] text-slate-450 font-bold">Curriculum-aligned multi-grade visual flashcards with interactive MCQ quizzes.</p>
                  </div>

                  {/* Class and Subject Selectors */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#FAF9F5] border border-slate-200 rounded p-4 text-xs font-bold text-slate-700">
                    <div>
                      <label className="block text-[8.5px] font-black text-[#0F4D2A] uppercase mb-1.5">Class Selection (कक्षा चुनें)</label>
                      <select
                        value={flashcardClass}
                        onChange={(e) => {
                          setFlashcardClass(e.target.value);
                          setActiveCardIndex(0);
                          setFlashcardScore(null);
                          setSelectedFlashcardOption(null);
                          setFlashcardQuizFeedback(null);
                        }}
                        className="w-full bg-white border border-slate-200 rounded py-2 px-3 text-slate-755 font-bold cursor-pointer h-11 focus:outline-none"
                      >
                        <option value="कक्षा 1">कक्षा 1 (Grade 1)</option>
                        <option value="कक्षा 2">कक्षा 2 (Grade 2)</option>
                        <option value="कक्षा 3">कक्षा 3 (Grade 3)</option>
                        <option value="कक्षा 4">कक्षा 4 (Grade 4)</option>
                        <option value="कक्षा 5">कक्षा 5 (Grade 5)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-[8.5px] font-black text-[#0F4D2A] uppercase mb-1.5">Subject Selection (विषय चुनें)</label>
                      <select
                        value={flashcardSubject}
                        onChange={(e) => {
                          setFlashcardSubject(e.target.value);
                          setActiveCardIndex(0);
                          setFlashcardScore(null);
                          setSelectedFlashcardOption(null);
                          setFlashcardQuizFeedback(null);
                        }}
                        className="w-full bg-white border border-slate-200 rounded py-2 px-3 text-slate-755 font-bold cursor-pointer h-11 focus:outline-none"
                      >
                        <option value="पर्यावरण अध्ययन">पर्यावरण अध्ययन (EVS)</option>
                        <option value="हो भाषा">हो भाषा (Language - Ho)</option>
                        <option value="संथाली भाषा">संथाली भाषा (Language - Santhali)</option>
                        <option value="मुंडारी भाषा">मुंडारी भाषा (Language - Mundari)</option>
                        <option value="गणित">गणित (Mathematics)</option>
                        <option value="अंग्रेज़ी">अंग्रेज़ी (English)</option>
                      </select>
                    </div>
                  </div>

                  <div className="border border-slate-250 rounded-lg p-8 max-w-md mx-auto text-center space-y-5 bg-[#FAF9F5] shadow-sm">
                    <div className="flex justify-between items-center text-[10px] text-slate-450 font-black uppercase">
                      <span>Card {safeCardIndex + 1} / {currentDeck.length} ({flashcardClass} · {flashcardSubject})</span>
                      
                      <button
                        onClick={() => toggleFlashcardLearned(safeCardIndex)}
                        className={`px-2 py-0.5 rounded border text-[8.5px] font-black uppercase cursor-pointer ${
                          flashcardLearnedMap[`${flashcardClass}_${flashcardSubject}_${safeCardIndex}`] 
                            ? 'bg-emerald-50 border-emerald-250 text-emerald-800' 
                            : 'border-slate-350 text-slate-650 bg-white'
                        }`}
                      >
                        {flashcardLearnedMap[`${flashcardClass}_${flashcardSubject}_${safeCardIndex}`] ? '✓ सीखा हुआ' : 'मैंने सीख लिया'}
                      </button>
                    </div>

                    <div className="w-48 h-48 bg-white border border-slate-200 rounded-full mx-auto flex items-center justify-center text-8xl shadow-inner select-none">
                      {currentCard.emoji}
                    </div>

                    <div className="py-3.5 border-y border-slate-200 space-y-3.5">
                      <div>
                        <span className="text-[8px] text-slate-455 uppercase block font-bold">Hindi / Concept</span>
                        <p className="text-sm font-black text-slate-800">
                          {currentCard.titleHindi}
                        </p>
                        <span className="text-[9px] text-slate-400 font-bold">Category: {currentCard.category}</span>
                      </div>
                      
                      <div>
                        <span className="text-[8px] text-indigo-400 uppercase block font-bold">
                          {activeTribalLabel} (Native Script)
                        </span>
                        <p className="text-xl font-black text-indigo-950 font-mono tracking-wider">
                          {tribalScript || tribalWord}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                          Pronunciation: "{tribalWord}"
                        </p>
                      </div>
                    </div>

                    {/* Quick 5-Card Jump Bar */}
                    <div className="flex justify-center items-center space-x-1.5 pt-1">
                      {currentDeck.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveCardIndex(idx);
                            setFlashcardScore(null);
                            setSelectedFlashcardOption(null);
                            setFlashcardQuizFeedback(null);
                          }}
                          className={`w-7 h-7 rounded-full text-xs font-black transition-all cursor-pointer flex items-center justify-center border ${
                            safeCardIndex === idx
                              ? 'bg-[#0F4D2A] text-white border-[#09351C] shadow-xs scale-110'
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4 pt-1">
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => {
                            handleGlobalSpeak(tribalWord || currentCard.titleHindi, activeLangKey);
                          }}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 text-xs font-black py-2.5 px-4 rounded-lg cursor-pointer h-11 flex items-center space-x-1.5 shadow-3xs"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>🔊 Play Audio</span>
                        </button>

                        <button
                          onClick={handleFlashcardRecord}
                          disabled={isFlashcardRecording}
                          className="bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black py-2.5 px-4 rounded-lg cursor-pointer h-11 flex items-center space-x-1.5 disabled:opacity-50"
                          style={{ backgroundColor: '#0F4D2A' }}
                        >
                          <span>{isFlashcardRecording ? 'Listening...' : '🎙 Practice Pronunciation'}</span>
                        </button>
                      </div>

                      {isFlashcardRecording && (
                        <div className="flex space-x-1 justify-center items-center h-8 bg-white border border-slate-200 rounded px-4 w-40 mx-auto">
                          <span className="w-1 bg-[#0F4D2A] h-4 rounded animate-pulse"></span>
                          <span className="w-1 bg-[#0F4D2A] h-6 rounded animate-pulse delay-75"></span>
                          <span className="w-1 bg-[#0F4D2A] h-3 rounded animate-pulse delay-150"></span>
                        </div>
                      )}

                      {flashcardScore !== null && (
                        <p className="bg-emerald-50 border border-emerald-250 p-2.5 rounded text-center text-xs font-black text-emerald-800 animate-fade-in">
                          Pronunciation Score: {flashcardScore}% ✓ (Good matching!)
                        </p>
                      )}

                      {/* Interactive MCQ Quiz */}
                      <div className="pt-4 border-t border-slate-200 text-left space-y-3 font-sans">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">💡 Flashcard Quiz ({activeTribalLabel} - Question {safeCardIndex + 1} of 5)</p>
                        <p className="text-xs font-black text-slate-805 leading-normal">
                          {activeQuiz.questionText}
                        </p>
                        
                        <div className="grid grid-cols-1 gap-2 pt-1">
                          {activeQuiz.options.map((optionText, idx) => {
                            const isSelected = selectedFlashcardOption === idx;
                            let btnStyle = "border-slate-205 hover:bg-slate-50 text-slate-700 bg-white";
                            if (isSelected) {
                              if (flashcardQuizFeedback === 'correct') {
                                btnStyle = "bg-emerald-50 border-emerald-350 text-emerald-800";
                              } else {
                                btnStyle = "bg-rose-50 border-rose-300 text-rose-800";
                              }
                            }
                            
                            return (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedFlashcardOption(idx);
                                  if (idx === activeQuiz.correctIndex) {
                                    setFlashcardQuizFeedback('correct');
                                    canvasConfetti({ particleCount: 35, spread: 25, origin: { y: 0.8 } });
                                    handleGlobalSpeak('सबाशी! सही उत्तर।', 'hi');
                                  } else {
                                    setFlashcardQuizFeedback('incorrect');
                                  }
                                }}
                                className={`border p-2.5 rounded-lg text-left text-xs font-black transition-all cursor-pointer flex justify-between items-center ${btnStyle}`}
                              >
                                <span>{optionText}</span>
                                {isSelected && (
                                  <span className="text-[10px] font-bold">
                                    {flashcardQuizFeedback === 'correct' ? '✓ Correct' : '❌ Try Again'}
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex justify-center space-x-2 pt-2">
                        <button
                          onClick={() => { 
                            setActiveCardIndex(p => Math.max(0, p - 1)); 
                            setFlashcardScore(null); 
                            setSelectedFlashcardOption(null); 
                            setFlashcardQuizFeedback(null); 
                          }}
                          disabled={safeCardIndex === 0}
                          className="px-3.5 py-1.5 border border-slate-350 hover:bg-slate-100 rounded text-xs font-bold disabled:opacity-40 cursor-pointer bg-white"
                        >
                          ← Prev
                        </button>
                        <button
                          onClick={() => { 
                            setActiveCardIndex(p => Math.min(currentDeck.length - 1, p + 1)); 
                            setFlashcardScore(null); 
                            setSelectedFlashcardOption(null); 
                            setFlashcardQuizFeedback(null); 
                          }}
                          disabled={safeCardIndex === currentDeck.length - 1}
                          className="px-3.5 py-1.5 border border-slate-350 hover:bg-slate-100 rounded text-xs font-bold disabled:opacity-40 cursor-pointer bg-white"
                        >
                          Next →
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === 'translate' && (
            <div className="p-6 max-w-3xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>AI Translation</span>
              </div>

              <div className="bg-white border border-slate-205 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">✨ AI Translation</h3>
                  <p className="text-[10px] text-slate-455 font-bold">Classroom-aware translation between Hindi and supported regional languages.</p>
                </div>

                <form onSubmit={handleAITranslate} className="space-y-4 text-xs font-bold">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2.5">
                      <span className="text-[8.5px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-black uppercase inline-block">
                        🇮🇳 Hindi (Teacher Input)
                      </span>
                      <textarea
                        value={translationInput}
                        onChange={(e) => setTranslationInput(e.target.value)}
                        maxLength={500}
                        className="w-full bg-slate-50 border border-slate-205 rounded p-3 text-xs font-bold text-slate-808 focus:outline-none focus:bg-white resize-none h-24 shadow-inner"
                        placeholder="उदा. बच्चों, आज हम गिनती सीखेंगे।"
                      />
                    </div>

                    <div className="space-y-2.5">
                      <span className="text-[8.5px] bg-indigo-50 text-indigo-750 px-2 py-0.5 rounded font-black uppercase inline-block">
                        🟢 {activeLangMeta.name} (Translation Output)
                      </span>
                      
                      <div className="bg-[#FAF9F5] border border-slate-200 rounded p-3 text-xs font-bold text-indigo-950 font-mono h-24 overflow-y-auto leading-relaxed shadow-inner">
                        {translationOutput || "अनुवाद की प्रतीक्षा में..."}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black py-2.5 rounded shadow-xs cursor-pointer h-11 uppercase font-sans"
                  >
                    ✨ Translate Instruction
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <LiveConversation 
              sourceLanguage={sourceLanguage}
              targetLanguage={targetLanguage}
              currentTeacher={teacherData} 
              onSpeak={handleGlobalSpeak}
              sharedClassroomMessage={sharedClassroomMessage}
              setSharedClassroomMessage={setSharedClassroomMessage}
            />
          )}

          {activeTab === 'progress' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Student Progress</span>
              </div>

              <div className="bg-white border border-slate-200 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">
                    {teacherData?.assignedClass || 'कक्षा 2'} — सीखने की प्रगति (Learning Progress)
                  </h3>
                  <p className="text-[10px] text-slate-455 font-bold">28 students • {teacherData?.schoolName || 'UPS Murhu Primary School'}</p>
                </div>

                <div className="space-y-4 pt-2 border-t border-slate-105 text-xs font-bold text-slate-705">
                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>भाषा (Languages)</span>
                      <span>████████░░ 82%</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>गणित (Mathematics)</span>
                      <span>███████░░░ 71%</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>पर्यावरण अध्ययन (EVS)</span>
                      <span>████████░░ 78%</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>अंग्रेज़ी (English)</span>
                      <span>██████░░░░ 64%</span>
                    </div>
                  </div>

                  <div className="space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span>विज्ञान (Science)</span>
                      <span>████████░░ 80%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'offline' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="bg-white border border-slate-200 rounded p-5 shadow-3xs space-y-4">
                <div>
                  <h3 className="text-sm font-black text-slate-855">ऑफलाइन सामग्री (Offline Storage Manager)</h3>
                  <p className="text-[10px] text-slate-455 font-bold">Manage resources downloaded on this tablet.</p>
                </div>
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                  <div className="flex justify-between items-center font-bold">
                    <span>DEVICE STORAGE:</span>
                    <span className="text-[#0F4D2A]">12.4 GB Free</span>
                  </div>
                  <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-200">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '68%' }}></div>
                  </div>
                  <p className="text-[9px] text-slate-450 text-right font-black uppercase">68% space used</p>
                </div>

                <button 
                  onClick={handleSyncNow}
                  className="bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-bold py-2.5 px-4 rounded cursor-pointer h-11"
                  style={{ backgroundColor: '#0F4D2A' }}
                >
                  अभी सिंक करें (Sync Now)
                </button>
              </div>
            </div>
          )}

          {activeTab === 'sync-device' && (
            <div className="p-6 max-w-2xl mx-auto space-y-6 text-left animate-fade-in font-sans">
              <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5">
                <span className="hover:underline cursor-pointer" onClick={() => setActiveTab('dashboard')}>Dashboard</span>
                <span>/</span>
                <span>Sync & Device</span>
              </div>

              <div className="bg-white border border-slate-200 rounded p-6 shadow-3xs space-y-5">
                <div>
                  <h3 className="text-sm font-black text-slate-805">🔄 Offline Sync & Device Status</h3>
                  <p className="text-[10.5px] text-slate-455 font-bold">Verifiable specifications confirming offline-first capabilities.</p>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-[#FAF9F5] border border-slate-200 p-4 rounded text-xs font-bold text-slate-755 leading-relaxed">
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Device model</span>
                    <p className="text-sm font-black text-[#0F4D2A]">Tablet-04 (Low-Cost Android)</p>
                  </div>
                  <div>
                    <span className="text-[8px] text-slate-400 uppercase block">Operating System</span>
                    <p className="text-sm font-black text-slate-808">Android 9+</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[8px] text-slate-400 uppercase block">Memory RAM</span>
                    <p className="text-sm font-black text-slate-808">2 GB RAM (Validated ✓)</p>
                  </div>
                  <div className="border-t border-slate-200/60 pt-3">
                    <span className="text-[8px] text-slate-400 uppercase block">Connection</span>
                    <p className="text-sm font-black text-amber-700">No Internet Required</p>
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={handleSyncNow}
                    className="bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black py-2.5 px-5 rounded cursor-pointer shadow-xs"
                    style={{ backgroundColor: '#0F4D2A' }}
                  >
                    Sync Now
                  </button>
                </div>
              </div>
            </div>
          )}



          {activeTab === 'dictionary' && (
            <Dictionary 
              selectedLanguage={targetLanguage} 
              onSpeak={handleGlobalSpeak}
            />
          )}

          {activeTab === 'profile' && (
            <TeacherProfile 
              teacherData={teacherData} 
              classLevel={classLevel} 
              setClassLevel={setClassLevel} 
              onLogout={() => {
                setShowLogoutConfirm(true);
              }}
            />
          )}

        </main>

      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4 animate-scale-in font-sans">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#E06D10] text-xl font-bold border border-amber-100">
              ⚠️
            </div>
            <div className="space-y-1.5 text-left sm:text-center">
              <h3 className="text-sm font-black text-slate-900">Are you sure you want to log out?</h3>
              <p className="text-xs text-slate-500 font-bold leading-normal">
                You will need to re-verify your Shikshak ID to log in again.
              </p>
            </div>
            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  handleLogout();
                }}
                className="flex-1 bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black py-2.5 rounded-lg transition-colors cursor-pointer shadow-3xs"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;
