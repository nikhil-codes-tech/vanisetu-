import React, { useState, useEffect } from 'react';
import { LANGUAGES_METADATA } from '../utils/mockData';
import { Printer } from 'lucide-react';

const generateQuestionsForClassSubject = (grade, subject) => {
  const gradeNum = grade.includes('1') ? 1 :
                   grade.includes('2') ? 2 :
                   grade.includes('3') ? 3 :
                   grade.includes('4') ? 4 : 5;
  
  if (subject === "गणित") {
    if (gradeNum === 1) {
      return [
        { id: 1, type: "multiple-choice", instruction: "कितने सेब हैं? गिनें और चुनें।", visual: "🍎 🍎 🍎", options: ["2", "3", "4"], correct: "3", translations: { ho: "चिमिन सेब मेनाः आ? लेखा मे।" } },
        { id: 2, type: "multiple-choice", instruction: "इस आकृति का नाम चुनें:", visual: "🔴", options: ["गोल (Circle)", "चौकोर (Square)", "तिकोना (Triangle)"], correct: "गोल (Circle)", translations: { ho: "नेयाः आकृतिको नेल मे।" } },
        { id: 3, type: "multiple-choice", instruction: "बड़ी वस्तु कौन सी है?", visual: "📦 (Box) vs ✉️ (Envelope)", options: ["बॉक्स (Box)", "लिफाफा (Envelope)"], correct: "बॉक्स (Box)", translations: { ho: "मरांग वस्तु साला मे।" } },
        { id: 4, type: "multiple-choice", instruction: "कितनी उंगलियां हैं?", visual: "🖐️", options: ["3", "4", "5"], correct: "5", translations: { ho: "चिमिन सुपुन को मेनाः आ?" } },
        { id: 5, type: "multiple-choice", instruction: "सरल जोड़: 1 + 2 = ", options: ["2", "3", "4"], correct: "3", translations: { ho: "जोड़ मे: १ + २ =" } }
      ];
    } else if (gradeNum === 2) {
      return [
        { id: 1, type: "multiple-choice", instruction: "जोड़ें: 12 + 5 = ", options: ["15", "17", "19"], correct: "17", translations: { ho: "मेसा मे: १२ + ५ =" } },
        { id: 2, type: "multiple-choice", instruction: "घटाएं: 10 - 4 = ", options: ["5", "6", "7"], correct: "6", translations: { ho: "रे मे: १० - ४ =" } },
        { id: 3, type: "multiple-choice", instruction: "संख्या 35 में दहाई (Tens) स्थान का अंक क्या है?", options: ["3", "5", "30"], correct: "3", translations: { ho: "दहाई अंक साल मे:" } },
        { id: 4, type: "multiple-choice", instruction: "संख्या 42 को हिंदी शब्दों में चुनें:", options: ["बयालीस (42)", "तैंतालीस (43)", "चौंतालीस (44)"], correct: "बयालीस (42)", translations: { ho: "कजी रे साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "घड़ी में छोटी सुई 3 पर और बड़ी सुई 12 पर है। समय क्या है?", options: ["2 बजे", "3 बजे", "12 बजे"], correct: "3 बजे", translations: { ho: "चिमिन बाजे तन?" } }
      ];
    } else if (gradeNum === 3) {
      return [
        { id: 1, type: "multiple-choice", instruction: "गुणा करें: 4 x 3 = ", options: ["10", "12", "15"], correct: "12", translations: { ho: "गुना मे: ४ x ३ =" } },
        { id: 2, type: "multiple-choice", instruction: "संख्या 145 को विस्तारित रूप में लिखें:", options: ["100 + 40 + 5", "100 + 4 + 5", "10 + 40 + 5"], correct: "100 + 40 + 5", translations: { ho: "विस्तार रे ओल मे:" } },
        { id: 3, type: "multiple-choice", instruction: "पैटर्न पूरा करें: 2, 4, 6, 8, ...", options: ["9", "10", "12"], correct: "10", translations: { ho: "पैटर्न पूरा मे:" } },
        { id: 4, type: "multiple-choice", instruction: "जोड़ें: 250 + 120 = ", options: ["350", "370", "390"], correct: "370", translations: { ho: "मेसा मे: २५० + १२० =" } },
        { id: 5, type: "multiple-choice", instruction: "त्रिभुज (Triangle) में कुल कितने कोने होते हैं?", options: ["3", "4", "5"], correct: "3", translations: { ho: "चिमिन कोने को मेनाः आ?" } }
      ];
    } else if (gradeNum === 4) {
      return [
        { id: 1, type: "multiple-choice", instruction: "भाग करें: 24 ÷ 4 = ", options: ["5", "6", "7"], correct: "6", translations: { ho: "हाटिंग मे: २४ ÷ ४ =" } },
        { id: 2, type: "multiple-choice", instruction: "संख्या 4352 में 3 का स्थानीय मान (Place Value) क्या है?", options: ["3", "30", "300"], correct: "300", translations: { ho: "स्थानीय मान साल मे:" } },
        { id: 3, type: "multiple-choice", instruction: "आधा किलोग्राम (1/2 kg) में कितने ग्राम होते हैं?", options: ["250 ग्राम", "500 ग्राम", "1000 ग्राम"], correct: "500 ग्राम", translations: { ho: "चिमिन ग्राम मेनाः आ?" } },
        { id: 4, type: "multiple-choice", instruction: "एक आयत (Rectangle) में कितनी भुजाएं होती हैं?", options: ["3", "4", "5"], correct: "4", translations: { ho: "भुजा को साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "गुणा करें: 15 x 6 = ", options: ["80", "90", "100"], correct: "90", translations: { ho: "गुना मे: १५ x ६ =" } }
      ];
    } else {
      return [
        { id: 1, type: "multiple-choice", instruction: "दिए गए चित्र में छायांकित भाग का भिन्न (Fraction) क्या है?", visual: "■ □ □ □ (1 out of 4)", options: ["1/2", "1/4", "3/4"], correct: "1/4", translations: { ho: "भिन्न को साला मे।" } },
        { id: 2, type: "multiple-choice", instruction: "समकोण (Right Angle) का मान कितने डिग्री होता है?", options: ["45 डिग्री", "90 डिग्री", "180 डिग्री"], correct: "90 डिग्री", translations: { ho: "डिग्री मान साला मे:" } },
        { id: 3, type: "multiple-choice", instruction: "हल करें: 3/5 + 1/5 = ", options: ["4/5", "4/10", "2/5"], correct: "4/5", translations: { ho: "हल मे: ३/५ + १/५ =" } },
        { id: 4, type: "multiple-choice", instruction: "औसत ज्ञात करें: 10, 20, 30 का औसत क्या होगा?", options: ["15", "20", "25"], correct: "20", translations: { ho: "औसत निकाल मे:" } },
        { id: 5, type: "multiple-choice", instruction: "हल करें: 150 का 10% क्या होगा?", options: ["10", "15", "20"], correct: "15", translations: { ho: "प्रतिशत मान साल मे:" } }
      ];
    }
  } else if (subject === "हिंदी") {
    if (gradeNum === 1) {
      return [
        { id: 1, type: "multiple-choice", instruction: "अक्षर 'अ' से शुरू होने वाला शब्द चुनें:", options: ["आम", "अनार", "इमली"], correct: "अनार", translations: { ho: "अक्षर 'अ' रेयाः शब्द साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "चित्र पहचान कर पहला वर्ण चुनें:", visual: "🍇 (अंगूर)", options: ["अ", "आ", "अं"], correct: "अं", translations: { ho: "पहला वर्ण साल मे:" } },
        { id: 3, type: "multiple-choice", instruction: "बिना मात्रा वाला दो अक्षरों का शब्द कौन सा है?", options: ["घर", "आम", "किताब"], correct: "घर", translations: { ho: "सरल शब्द साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "वर्णों को जोड़कर शब्द बनाएं: क + ल + म = ", options: ["कमल", "कलम", "नमक"], correct: "कलम", translations: { ho: "शब्द बनाओ मे:" } },
        { id: 5, type: "multiple-choice", instruction: "'नल' शब्द का अंतिम अक्षर क्या है?", options: ["न", "ल", "त"], correct: "ल", translations: { ho: "अंतिम अक्षर साला मे:" } }
      ];
    } else if (gradeNum === 2) {
      return [
        { id: 1, type: "multiple-choice", instruction: "'क' में 'आ' की मात्रा जोड़ने पर क्या बनेगा?", options: ["के", "का", "की"], correct: "का", translations: { ho: "मात्रा जोड़ मे:" } },
        { id: 2, type: "multiple-choice", instruction: "'सूरज' का समान अर्थ वाला (समानार्थी) शब्द चुनें:", options: ["चाँद", "सूर्य", "तारा"], correct: "सूर्य", translations: { ho: "समान अर्थ साल मे:" } },
        { id: 3, type: "multiple-choice", instruction: "सही वर्तनी (Spelling) वाला शब्द पहचानें:", options: ["किताब", "कतीब", "कताब"], correct: "किताब", translations: { ho: "सही शब्द साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "वाक्य पूरा करें: 'राम फल ______ है।'", options: ["खाता", "खाती", "खाते"], correct: "खाता", translations: { ho: "वाक्य पूरा मे:" } },
        { id: 5, type: "multiple-choice", instruction: "'लड़का' का बहुवचन (Plural) रूप क्या होगा?", options: ["लड़कों", "लड़के", "लड़कियां"], correct: "लड़के", translations: { ho: "बहुवचन साला मे:" } }
      ];
    } else {
      return [
        { id: 1, type: "multiple-choice", instruction: "'सुंदर' शब्द का विलोम (Opposite) शब्द चुनें:", options: ["बदसूरत", "अच्छा", "साफ"], correct: "बदसूरत", translations: { ho: "उल्टा शब्द साल मे:" } },
        { id: 2, type: "multiple-choice", instruction: "दिए गए शब्दों में 'संज्ञा' (Noun) शब्द पहचानें:", options: ["खेलना", "सुंदर", "रांची"], correct: "रांची", translations: { ho: "संज्ञा साला मे:" } },
        { id: 3, type: "multiple-choice", instruction: "मुहावरा पूरा करें: 'नौ दो ______ होना।'", options: ["आठ", "ग्यारह", "बारह"], correct: "ग्यारह", translations: { ho: "मुहावरा पूरा मे:" } },
        { id: 4, type: "multiple-choice", instruction: "दिए गए वाक्यों में क्रिया (Verb) शब्द पहचानें: 'मोहन रो रहा है।'", options: ["मोहन", "रो रहा", "है"], correct: "रो रहा", translations: { ho: "क्रिया साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "'विद्यालय' का सही संधि विच्छेद क्या होगा?", options: ["विद्या + आलय", "विद्य + आलय", "विद्या + लय"], correct: "विद्या + आलय", translations: { ho: "संधि विच्छेद साल मे:" } }
      ];
    }
  } else if (subject === "पर्यावरण अध्ययन") {
    if (gradeNum === 1) {
      return [
        { id: 1, type: "multiple-choice", instruction: "सूंघने के लिए शरीर के किस अंग का उपयोग करते हैं?", options: ["आँख", "नाक", "कान"], correct: "नाक", translations: { ho: "सूंघने को साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "पिताजी के भाई को हम क्या कहते हैं?", options: ["मामा", "चाचा", "मौसा"], correct: "चाचा", translations: { ho: "रिश्ता साला मे:" } },
        { id: 3, type: "multiple-choice", instruction: "हमें रहने के लिए किस चीज की आवश्यकता होती है?", options: ["घर", "गाड़ी", "दुकान"], correct: "घर", translations: { ho: "घर साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "दिन में आकाश में क्या चमकता है?", options: ["सूरज", "चाँद", "तारे"], correct: "सूरज", translations: { ho: "सूरज साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "हमें प्यास लगने पर क्या पीना चाहिए?", options: ["दूध", "पानी", "चाय"], correct: "पानी", translations: { ho: "दाः साला मे:" } }
      ];
    } else if (gradeNum === 2) {
      return [
        { id: 1, type: "multiple-choice", instruction: "गाय (Cow) के लिए सही क्षेत्रीय अनुवाद चुनें:", options: ["मेरम", "गाई", "बीर"], correct: "गाई", translations: { ho: "गाई (Cow) रेयाः अनुवाद साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "पेड़ को हो भाषा में क्या कहते हैं?", options: ["दाः", "दारू", "साकाम"], correct: "दारू", translations: { ho: "पेड़ हो काजी रे चिनाः मेनाः आ?" } },
        { id: 3, type: "multiple-choice", instruction: "कौन सा पशु जंगली (Wild) जानवर है?", options: ["शेर", "बकरी", "कुत्ता"], correct: "शेर", translations: { ho: "जंगली जानवर साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "गर्मी के मौसम में हम किस प्रकार के कपड़े पहनते हैं?", options: ["ऊनी कपड़े", "सूती कपड़े", "प्लास्टिक कपड़े"], correct: "सूती कपड़े", translations: { ho: "कपड़े साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "पेड़ का कौन सा भाग जमीन के अंदर होता है?", options: ["जड़", "पत्ती", "फूल"], correct: "जड़", translations: { ho: "जड़ साला मे:" } }
      ];
    } else {
      return [
        { id: 1, type: "multiple-choice", instruction: "झारखंड का राजकीय पशु कौन सा है?", options: ["बाघ", "हाथी", "हिरण"], correct: "हाथी", translations: { ho: "राजकीय पशु साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "सरहुल त्योहार किस ऋतु में मनाया जाता है?", options: ["वसन्त ऋतु", "शरद ऋतु", "वर्षा ऋतु"], correct: "वसन्त ऋतु", translations: { ho: "ऋतु साला मे:" } },
        { id: 3, type: "multiple-choice", instruction: "तालाब और कुआं जल संरक्षण के कैसे स्रोत हैं?", options: ["पारंपरिक", "कृत्रिम", "आधुनिक"], correct: "पारंपरिक", translations: { ho: "जल स्रोत साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "झारखंड में कोयला मुख्य रूप से कहाँ पाया जाता है?", options: ["जमशेदपुर", "झरिया (धनबाद)", "रांची"], correct: "झरिया (धनबाद)", translations: { ho: "कोयला खदान साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "बाढ़ आने पर हमें तुरंत कहाँ जाना चाहिए?", options: ["ऊंचे स्थानों पर", "नदी के किनारे", "घर के बेसमेंट में"], correct: "ऊंचे स्थानों पर", translations: { ho: "बचाव स्थान साला मे:" } }
      ];
    }
  } else if (subject === "अंग्रेज़ी") {
    if (gradeNum === 1) {
      return [
        { id: 1, type: "multiple-choice", instruction: "Select the uppercase letter for 'a':", options: ["A", "B", "C"], correct: "A", translations: { ho: "मरांग वर्ण साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "What do we say when we meet someone in the morning?", options: ["Good Night", "Good Morning", "Goodbye"], correct: "Good Morning", translations: { ho: "सुबह रेयाः कजी साल मे:" } },
        { id: 3, type: "multiple-choice", instruction: "Which word starts with letter 'B'?", options: ["Apple", "Ball", "Cat"], correct: "Ball", translations: { ho: "'B' वर्ण रेयाः शब्द साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "Complete the alphabet: A, B, C, __", options: ["E", "D", "F"], correct: "D", translations: { ho: "खाली स्थान पूरा मे:" } },
        { id: 5, type: "multiple-choice", instruction: "What is the color of an apple?", options: ["Red", "Blue", "Green"], correct: "Red", translations: { ho: "रंग साला मे:" } }
      ];
    } else {
      return [
        { id: 1, type: "multiple-choice", instruction: "Identify the action word (Verb):", options: ["Book", "Read", "Table"], correct: "Read", translations: { ho: "क्रिया शब्द साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "Complete the sentence: 'The book is ______ the table.'", options: ["on", "under", "in"], correct: "on", translations: { ho: "खाली स्थान पूरा मे:" } },
        { id: 3, type: "multiple-choice", instruction: "Choose the correct spelling:", options: ["Scole", "School", "Skhool"], correct: "School", translations: { ho: "सही शब्द साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "Identify the describing word (Adjective): 'She has a red pen.'", options: ["She", "red", "pen"], correct: "red", translations: { ho: "विशेषण साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "Select the plural of 'Child':", options: ["Childs", "Children", "Childes"], correct: "Children", translations: { ho: "बहुवचन साला मे:" } }
      ];
    }
  } else {
    if (gradeNum === 1) {
      return [
        { id: 1, type: "multiple-choice", instruction: "कौन सी वस्तु सजीव (Living) है?", options: ["खिलौना कार", "पौधा (Plant)", "पत्थर"], correct: "पौधा (Plant)", translations: { ho: "सजीव साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "हवा को हम क्या कर सकते हैं?", options: ["देख सकते हैं", "महसूस कर सकते हैं", "छू सकते हैं"], correct: "महसूस कर सकते हैं", translations: { ho: "हवा साला मे:" } },
        { id: 3, type: "multiple-choice", instruction: "दिन में रोशनी का मुख्य स्रोत क्या है?", options: ["बल्ब", "सूरज", "मोमबत्ती"], correct: "सूरज", translations: { ho: "सूरज साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "कौन सी वस्तु निर्जीव (Non-Living) है?", options: ["चिड़िया", "कुत्ता", "कुर्सी"], correct: "कुर्सी", translations: { ho: "निर्जीव साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "तारे कब दिखाई देते हैं?", options: ["दिन में", "रात में", "दोपहर में"], correct: "रात में", translations: { ho: "तारे साला मे:" } }
      ];
    } else {
      return [
        { id: 1, type: "multiple-choice", instruction: "पौधे का कौन सा भाग प्रकाश संश्लेषण करता है?", options: ["जड़", "पत्ती (Leaf)", "तना"], correct: "पत्ती (Leaf)", translations: { ho: "पत्ती साला मे:" } },
        { id: 2, type: "multiple-choice", instruction: "पदार्थ की कितनी मुख्य अवस्थाएँ होती हैं?", options: ["दो", "तीन", "चार"], correct: "तीन", translations: { ho: "अवस्था साला मे:" } },
        { id: 3, type: "multiple-choice", instruction: "श्वसन तंत्र (Respiratory System) का मुख्य अंग क्या है?", options: ["फेफड़े (Lungs)", "आमाशय (Stomach)", "हृदय (Heart)"], correct: "फेफड़े (Lungs)", translations: { ho: "अंग साला मे:" } },
        { id: 4, type: "multiple-choice", instruction: "सौरमंडल में कुल कितने ग्रह हैं?", options: ["7", "8", "9"], correct: "8", translations: { ho: "ग्रह साला मे:" } },
        { id: 5, type: "multiple-choice", instruction: "विद्युत परिपथ को चालू या बंद करने के लिए किसका उपयोग करते हैं?", options: ["तार", "बल्ब", "स्विच (Switch)"], correct: "स्विच (Switch)", translations: { ho: "स्विच साला मे:" } }
      ];
    }
  }
};

const AVAILABLE_WORKSHEETS_TEMPLATES = {
  "गणित": [
    {
      id: "ws_math_1",
      title: "संख्या पहचानना (1–5)",
      outcome: "M-G1.2",
      duration: "20 minutes",
      learningObjective: "M-G1.2: One-to-one correspondence and recognition up to 5.",
      questions: generateQuestionsForClassSubject("कक्षा 1", "गणित")
    },
    {
      id: "ws_math_2",
      title: "जोड़ और घटाव",
      outcome: "M-G2.2",
      duration: "25 minutes",
      learningObjective: "M-G2.2: Count and sequence numbers up to 20.",
      questions: generateQuestionsForClassSubject("कक्षा 2", "गणित")
    }
  ],
  "हिंदी": [
    {
      id: "ws_hin_1",
      title: "वर्णमाला पहचान",
      outcome: "L-G2.3",
      duration: "15 minutes",
      learningObjective: "L-G2.3: Read alphabet combinations with local sound translation.",
      questions: generateQuestionsForClassSubject("कक्षा 2", "हिंदी")
    }
  ],
  "पर्यावरण अध्ययन": [
    {
      id: "ws_evs_1",
      title: "हमारे पशु-पक्षी (Animals)",
      outcome: "E-G1.5",
      duration: "15 minutes",
      learningObjective: "जीव-जंतुओं के नाम और स्थानीय परिवेश में उनके आवास की पहचान।",
      questions: generateQuestionsForClassSubject("कक्षा 1", "पर्यावरण अध्ययन")
    },
    {
      id: "ws_evs_2",
      title: "जल और पेड़ (Water & Plants)",
      outcome: "E-G2.4",
      duration: "20 minutes",
      learningObjective: "पेड़-पौधों के महत्व और जल संरक्षण की बुनियादी समझ।",
      questions: generateQuestionsForClassSubject("कक्षा 2", "पर्यावरण अध्ययन")
    }
  ],
  "अंग्रेज़ी": [
    {
      id: "ws_eng_1",
      title: "Alphabets Matching (A–Z)",
      outcome: "L-G1.4",
      duration: "15 minutes",
      learningObjective: "L-G1.4: Recognition of English letters with local script sounds.",
      questions: generateQuestionsForClassSubject("कक्षा 1", "अंग्रेज़ी")
    }
  ],
  "विज्ञान": [
    {
      id: "ws_sci_1",
      title: "सजीव और निर्जीव (Living & Non-Living)",
      outcome: "E-G2.3",
      duration: "20 minutes",
      learningObjective: "E-G2.3: Classifying living plants and non-living objects.",
      questions: generateQuestionsForClassSubject("कक्षा 2", "विज्ञान")
    }
  ]
};

export default function WorksheetGenerator({ 
  selectedLanguage, 
  onSpeak, 
  selectedSubject, 
  setSelectedSubject 
}) {
  const [activeWorksheet, setActiveWorksheet] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  // Low-ink B&W mode
  const [isLowInkMode, setIsLowInkMode] = useState(false);

  // Custom worksheets generator state
  const [newClass, setNewClass] = useState('कक्षा 2');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newChapterName, setNewChapterName] = useState('संख्या मिलान');
  const [wsType, setWsType] = useState('MCQ');

  const activeLangMeta = LANGUAGES_METADATA[selectedLanguage] || LANGUAGES_METADATA["हो"];

  // Auto-switch templates when subject changes (Point 1)
  useEffect(() => {
    const templates = AVAILABLE_WORKSHEETS_TEMPLATES[selectedSubject] || [];
    if (templates.length > 0) {
      setActiveWorksheet(templates[0]);
      setUserAnswers({});
      setQuizFinished(false);
    } else {
      setActiveWorksheet(null);
    }
  }, [selectedSubject]);

  const handleOpenWorksheet = (sheet) => {
    setActiveWorksheet(sheet);
    setUserAnswers({});
    setQuizFinished(false);
  };

  const handleDownload = () => {
    setDownloadComplete(true);
    setTimeout(() => setDownloadComplete(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSelectOption = (qId, val) => {
    setUserAnswers(prev => ({
      ...prev,
      [qId]: val
    }));
  };

  const handleCustomGenerate = (e) => {
    e.preventDefault();
    const customQuestions = generateQuestionsForClassSubject(newClass, selectedSubject);
    const sheetObj = {
      id: `custom_${Date.now()}`,
      title: `${newChapterName} (${newClass} - ${newDifficulty})`,
      outcome: newClass === 'कक्षा 5' ? 'M-G5.1' : (newClass === 'कक्षा 4' ? 'M-G4.1' : (newClass === 'कक्षा 3' ? 'M-G3.1' : 'M-G1.2')),
      duration: "20 minutes",
      learningObjective: `${newClass} के बच्चों के लिए ${newChapterName} आधारित bilingual worksheet.`,
      questions: customQuestions
    };
    setActiveWorksheet(sheetObj);
    alert("✓ AI Bilingual Worksheet Generated!");
  };

  const templatesList = AVAILABLE_WORKSHEETS_TEMPLATES[selectedSubject] || [];

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-slate-805 font-sans text-left">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Title breadcrumb */}
        <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
          <span>Teach</span>
          <span>/</span>
          <span>Worksheets</span>
        </div>

        {/* Split workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: Controls (Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Custom Generator Form */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4 shadow-3xs">
              <h3 className="text-sm font-black text-slate-805">✨ AI Bilingual Worksheet Builder</h3>
              
              <form onSubmit={handleCustomGenerate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Subject</label>
                  <select 
                    value={selectedSubject} 
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-2 font-bold text-slate-700 h-10 cursor-pointer"
                  >
                    <option value="गणित">गणित (Mathematics)</option>
                    <option value="हिंदी">हिंदी (Hindi)</option>
                    <option value="पर्यावरण अध्ययन">पर्यावरण अध्ययन (EVS)</option>
                    <option value="अंग्रेज़ी">अंग्रेज़ी (English)</option>
                    <option value="विज्ञान">विज्ञान (Science)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Class Level</label>
                  <select 
                    value={newClass} 
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-2 font-bold text-slate-700 h-10 cursor-pointer"
                  >
                    <option value="कक्षा 1">कक्षा 1</option>
                    <option value="कक्षा 2">कक्षा 2</option>
                    <option value="कक्षा 3">कक्षा 3</option>
                    <option value="कक्षा 4">कक्षा 4</option>
                    <option value="कक्षा 5">कक्षा 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[8.5px] font-black text-slate-400 uppercase mb-1">Chapter Name</label>
                  <input
                    type="text"
                    value={newChapterName}
                    onChange={(e) => setNewChapterName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded py-1.5 px-2 font-bold text-slate-850 h-10"
                  />
                </div>

                {/* Low-Ink Checkbox option */}
                <div className="flex items-center space-x-2 py-1.5">
                  <input
                    type="checkbox"
                    id="inkMode"
                    checked={isLowInkMode}
                    onChange={(e) => setIsLowInkMode(e.target.checked)}
                    className="w-4.5 h-4.5 accent-[#E06D10] cursor-pointer"
                  />
                  <label htmlFor="inkMode" className="text-xs font-bold text-slate-705 cursor-pointer">
                    Low-Ink Mode (B&W printable layout)
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#E06D10] hover:bg-[#c25e0c] text-white text-xs font-black py-2.5 rounded shadow-xs cursor-pointer h-10 uppercase"
                >
                  ✨ Generate Worksheet
                </button>
              </form>
            </div>

            {/* Available list */}
            <div className="bg-white border border-slate-200 rounded p-5 space-y-4 shadow-3xs text-left">
              <h3 className="text-sm font-black text-slate-805">Available Worksheets</h3>
              
              <div className="space-y-3.5">
                {templatesList.length === 0 ? (
                  <p className="text-xs text-slate-400 font-semibold text-center py-4">इस विषय के लिए कोई वर्कशीट उपलब्ध नहीं है।</p>
                ) : (
                  templatesList.map(sheet => (
                    <div 
                      key={sheet.id} 
                      className={`p-3.5 border rounded cursor-pointer transition-all ${
                        activeWorksheet?.id === sheet.id 
                          ? 'border-[#0F4D2A] bg-indigo-50/50' 
                          : 'border-slate-200 hover:bg-slate-50 bg-[#FAF9F5]'
                      }`}
                      onClick={() => handleOpenWorksheet(sheet)}
                    >
                      <span className="text-[8.5px] bg-[#0F4D2A] text-white px-2 py-0.5 rounded font-black uppercase inline-block mb-1">
                        Competency: {sheet.outcome}
                      </span>
                      <p className="text-xs font-extrabold text-slate-850">{sheet.title}</p>
                      <p className="text-[9.5px] text-slate-455 font-semibold mt-1">Duration: {sheet.duration} • JCERT Standard</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: A4 Printable Canvas */}
          <div className="lg:col-span-7 bg-white border border-slate-200 p-6 rounded shadow-3xs text-left">
            {activeWorksheet ? (
              <div className="space-y-5 animate-fade-in">
                
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 flex-wrap gap-2">
                  <span className="text-xs font-extrabold text-[#0F4D2A] bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                    Bilingual A4 Canvas Preview
                  </span>
                  
                  <div className="flex space-x-2 font-sans">
                    <button
                      onClick={handlePrint}
                      className="px-3.5 py-1.5 border border-slate-350 hover:bg-slate-50 text-slate-705 text-xs font-bold rounded h-10 flex items-center space-x-1 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print / Save PDF (Bilingual)</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3.5 py-1.5 bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-bold rounded h-10 flex items-center cursor-pointer"
                    >
                      <span>{downloadComplete ? '✓ Saved' : 'Save Offline'}</span>
                    </button>
                  </div>
                </div>

                <div className={`p-8 font-serif text-slate-900 min-h-[600px] relative border-2 border-slate-900 ${
                  isLowInkMode ? 'bg-white' : 'bg-white shadow-md'
                }`}>
                  
                  {/* Corner Cut Marks */}
                  <div className="absolute top-2 left-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">┌</div>
                  <div className="absolute top-2 right-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">┐</div>
                  <div className="absolute bottom-2 left-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">└</div>
                  <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 font-sans pointer-events-none select-none">┘</div>

                  {/* JCERT Government Co-branding Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-955 pb-4 text-left">
                    <div className="space-y-1">
                      <h4 className="text-[10px] text-slate-500 font-black uppercase font-sans">
                        SAMAGRA SHIKSHA JHARKHAND • JCERT
                      </h4>
                      <h3 className="text-base font-black text-slate-900 tracking-wide uppercase leading-tight font-sans">
                        {activeWorksheet.title}
                      </h3>
                      <p className="text-[9px] text-[#E06D10] font-sans font-black">
                        NIPUN COMPETENCY LINKED: {activeWorksheet.outcome}
                      </p>
                    </div>

                    {/* Roll No & Student Fields */}
                    <div className="text-right text-[9.5px] font-sans font-bold space-y-1.5 flex-shrink-0">
                      <p>नाम (Name): _______________________</p>
                      <p>अनुक्रमांक (Roll No): _________________</p>
                      <p>कक्षा (Class): {newClass} · Section: ______</p>
                    </div>
                  </div>

                  {/* Objective box */}
                  <div className={`my-4 p-3.5 rounded border font-sans text-[11px] leading-relaxed text-left ${
                    isLowInkMode ? 'bg-white border-slate-900 text-slate-900' : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    <p className="font-extrabold text-slate-955">Learning Competency Objective:</p>
                    <p className="mt-0.5">{activeWorksheet.learningObjective}</p>
                  </div>

                  {/* Bilingual questions side-by-side */}
                  <div className="space-y-6 pt-3 font-sans text-xs">
                    {activeWorksheet.questions.map((q, idx) => {
                      const selectedVal = userAnswers[q.id];
                      const isAnswered = selectedVal !== undefined;
                      const isCorrect = selectedVal === q.correct;
                      const tribalInstruction = q.translations?.[activeLangMeta.translationCode] || "अनुवाद उपलब्ध नहीं है";

                      return (
                        <div key={q.id} className="space-y-4 pb-4 border-b border-dashed border-slate-300">
                          
                          <div className="grid grid-cols-2 gap-6">
                            
                            {/* HINDI COLUMN */}
                            <div className="space-y-1.5 border-r border-slate-200 pr-3 text-left">
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black uppercase ${
                                isLowInkMode ? 'border border-slate-900 text-slate-900' : 'bg-slate-100 text-slate-600'
                              }`}>
                                Hindi Instruction
                              </span>
                              <p className="font-extrabold text-slate-900">{idx + 1}. {q.instruction}</p>
                            </div>

                            {/* TRIBAL COLUMN */}
                            <div className="space-y-1.5 pl-1 text-left">
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-black uppercase ${
                                isLowInkMode ? 'border border-slate-900 text-slate-900' : 'bg-indigo-50 text-indigo-750'
                              }`}>
                                {activeLangMeta.name} Translation
                              </span>
                              <p className="font-extrabold text-indigo-950 font-mono">{idx + 1}. {tribalInstruction}</p>
                            </div>

                          </div>

                          {q.visual && (
                            <div className="p-3 bg-slate-50 border border-slate-200 rounded text-center text-3xl select-none max-w-xs mx-auto">
                              {q.visual}
                            </div>
                          )}

                          {/* Options grid */}
                          <div className="grid grid-cols-3 gap-2.5 max-w-sm mx-auto">
                            {q.options.map(opt => {
                              let style = "border-slate-200 bg-white text-slate-800 hover:bg-slate-50";
                              if (isAnswered) {
                                if (opt === q.correct) {
                                  style = "border-emerald-350 bg-emerald-50 text-emerald-800 font-extrabold";
                                } else if (selectedVal === opt) {
                                  style = "border-rose-350 bg-rose-50 text-rose-800";
                                } else {
                                  style = "border-slate-100 bg-white text-slate-400 opacity-60";
                                }
                              }
                              return (
                                <button
                                  key={opt}
                                  onClick={() => !isAnswered && handleSelectOption(q.id, opt)}
                                  className={`border p-2.5 rounded text-center text-xs font-bold cursor-pointer transition-colors ${style}`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center text-slate-400 font-semibold py-32 text-xs">
                ← बाईं ओर से कोई वर्कशीट चुनें या नई वर्कशीट जनरेट करें।
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
