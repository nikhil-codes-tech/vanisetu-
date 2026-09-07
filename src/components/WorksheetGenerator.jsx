import React, { useState, useEffect } from 'react';
import { LANGUAGES_METADATA } from '../utils/mockData';
import { Printer } from 'lucide-react';

const TRIBAL_DICTIONARY = {
  santhali: {
    "चिमिन सेब मेनाः आ? लेखा मे।": "ᱛᱤᱱᱟᱹᱜ ᱥᱮᱣ ᱢᱮᱱᱟᱜᱼᱟ? ᱞᱮᱠᱷᱟ ᱢᱮ। (तिनाः सेब मेनाःआ? लेखा मे।)",
    "नेयाः आकृतिको नेल मे।": "ᱱᱚᱣᱟ ᱪᱤᱛᱟᱹᱨ ᱧᱩᱛᱩᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (नोवा आकृतिको बाचाव मे।)",
    "मरांग वस्तु साला मे।": "ᱞᱟᱹᱴᱩ ᱡᱤᱱᱤᱥ ᱵᱟᱪᱷᱟᱣ ᱢᱮ। (लटू जिनिस बाचाव मे।)",
    "चिमिन सुपुन को मेनाः आ?": "ᱛᱤᱱᱟᱹᱜ ᱠᱟᱹᱴᱩᱵ ᱢᱮᱱᱟᱜᱼᱟ? (तिनाः कटुब को मेनाःआ?)",
    "जोड़ मे: १ + २ =": "ᱢᱮᱥᱟ ᱢᱮ: ᱑ + ᱒ = (मेसा मे: १ + २ =)",
    "मेसा मे: १२ + ५ =": "ᱢᱮᱥᱟ ᱢᱮ: ᱑᱒ + ᱕ = (मेसा मे: १२ + ५ =)",
    "रे मे: १० - ४ =": "ᱵᱷᱮᱜᱟᱨ ᱢᱮ: ᱑᱐ - ᱔ = (भेगार मे: १० - ४ =)",
    "दहाई अंक साल मे:": "ᱜᱮᱞ ᱴᱷᱟᱶ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (गेल ठाँव बाचाव मे:)",
    "कजी रे साला मे:": "ᱨᱚᱲ ᱛᱮ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (रोड़ ते बाचाव मे:)",
    "चिमिन बाजे तन?": "ᱛᱤᱱᱟᱹᱜ ᱵᱟᱡᱟᱜ ᱠᱟᱱᱟ? (तिनाः बाजाः काना?)",
    "गुना मे: ४ x ३ =": "ᱜᱩᱬᱟᱹᱭ ᱢᱮ: ４ ｘ ３ = (गुणै मे: ४ x ३ =)",
    "विस्तार रे ओल मे:": "ᱵᱤᱥᱛᱟᱹᱨ ᱛᱮ ᱚᱞ ᱢᱮ: (बिस्तर ते ओल मे:)",
    "पैटर्न पूरा मे:": "ᱰᱷᱟᱸᱪᱟ ᱯᱩᱨᱟᱹᱣ ᱢᱮ: (ढाँचा पुराव मे:)",
    "मेसा मे: २५० + १२० =": "ᱢᱮᱥᱟ ᱢᱮ: ᱒ ribbons ＋ ᱑᱒᱐ = (मेसा मे: २५० + १२० =)",
    "चिमिन कोने को मेनाः आ?": "ᱛᱤᱱᱟᱹᱜ ᱠᱚᱬ ᱢᱮᱱᱟᱜᱼᱟ? (तिनाः कोण मेनाःआ?)",
    "हाटिंग मे: २४ ÷ ४ =": "ᱦᱟᱹᱴᱤᱧ ᱢᱮ: ᱒᱔ 摆 ᱔ = (हाटिंग मे: २४ ÷ ४ =)",
    "स्थानीय मान साल मे:": "ᱴᱷᱟᱶ ᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (ठाँव मान बाचाव मे:)",
    "चिमिन ग्राम मेनाः आ?": "ᱛᱤᱱᱟᱹᱜ ᱜᱽᱨᱟᱢ ᱢᱮᱱᱟᱜᱼᱟ? (तिनाः ग्राम मेनाःआ?)",
    "भुजा को साला मे:": "ᱠᱟᱛᱷᱟ ᱠᱚ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (काथा को बाचाव मे:)",
    "गुना मे: १५ x ६ =": "ᱜᱩᱬᱟᱹᱭ ᱢᱮ: ᱑ baggy ｘ ᱖ = (गुणै मे: १५ x ६ =)",
    "भिन्न को साला मे।": "ᱦᱟᱹᱴᱤᱧ ᱵᱟᱪᱷᱟᱣ ᱢᱮ। (हाटिंग बाचाव मे।)",
    "डिग्री मान साला मे:": "ᱰᱤᱜᱽᱨᱤ ᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (डिग्री मान बाचाव मे:)",
    "हल मे: ३/५ + १/५ =": "ᱥᱚᱞᱦᱮ ᱢᱮ: / ＋ / = (सोलहे मे: ३/५ + १/५ =)",
    "औसत निकाल मे:": "ᱜᱩᱴ ᱚᱰᱚᱜ ᱢᱮ: (गुट ओडोग मे:)",
    "प्रतिशत मान साल मे:": "ᱥᱟᱭᱠᱚᱲᱟ ᱢᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सायकड़ा मान बाचाव मे:)",
    "अक्षर 'अ' रेयाः शब्द साला मे:": "ᱚᱞ 'ᱚ' ᱠᱷᱚᱱ ᱮᱦᱚᱵ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (ओल 'अ' खोन एहोब अड़ा बाचाव मे:)",
    "पहला वर्ण साल मे:": "ᱯᱩᱭᱞᱩ ᱚᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (पुयलू ओल बाचाव मे:)",
    "सरल शब्द साला मे:": "ᱥᱟᱫᱷᱟᱨᱚᱱ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (साधारण अड़ा बाचाव मे:)",
    "शब्द बनाओ मे:": "ᱟᱹᱲᱟᱹ ᱵᱮᱱᱟᱣ ᱢᱮ: (अड़ा बेनाव मे:)",
    "अंतिम अक्षर साला मे:": "ᱢᱩᱪᱟᱹᱫ ᱚᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (मुचाद ओल बाचाव मे:)",
    "मात्रा जोड़ मे:": "ᱢᱟᱛᱨᱟ ᱡᱚᱲᱟᱣ ᱢᱮ: (मात्रा जोड़ाव मे:)",
    "समान अर्थ साल मे:": "ᱥᱟᱢᱟᱱ ᱚᱨᱛᱷᱚ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सामान अरथो बाचाव मे:)",
    "सही शब्द साला मे:": "ᱥᱟᱹᱨᱤ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सारि अड़ा बाचाव मे:)",
    "वाक्य पूरा मे:": "ᱠᱟᱛᱷᱟ ᱯᱩᱨᱟᱹᱣ ᱢᱮ: (काथा पुराव मे:)",
    "बहुवचन साला मे:": "ᱥᱟᱸᱜᱮ ᱜᱚᱴᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सांगे गोटान बाचाव मे:)",
    "उल्टा शब्द साल मे:": "ᱩᱞᱴᱟᱹ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (उल्टा अड़ा बाचाव मे:)",
    "संज्ञा साला मे:": "ᱧᱩᱛᱩᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (ञुतुम बाचाव मे:)",
    "मुहावरा पूरा मे:": "ᱠᱟᱛᱷᱟ ᱯᱩᱨᱟᱹᱣ ᱢᱮ: (काथा पुराव मे:)",
    "क्रिया साला मे:": "ᱠᱟᱹᱢᱤ ᱵᱟᱪᱷᱟᱣ ᱢे: (कामि बाचाव मे:)",
    "संधि विच्छेद साल मे:": "ᱡᱚᱲᱟᱣ ᱵᱷᱮᱜᱟᱨ ᱢᱮ: (जोड़ाव भेगार मे:)",
    "सूंघने को साला मे:": "ᱥᱚ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सो अड़ा बाचाव मे:)",
    "रिश्ता साला मे:": "ᱥᱟᱹᱜᱟᱹᱭ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सागै बाचाव मे:)",
    "घर साला मे:": "ᱚᱲᱟᱜ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (ओड़ाग बाचाव मे:)",
    "सूरज साला मे:": "ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सिञ चांदो बाचाव मे:)",
    "दाः साला मे:": "ᱫᱟᱜ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (दाग बाचाव मे:)",
    "गाई (Cow) रेयाः अनुवाद साला मे:": "ᱜᱟᱭ ᱨᱮᱭᱟᱜ ᱛᱚᱨᱡᱚᱢᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (गाय रेयाग तरजोमा बाचाव मे:)",
    "पेड़ हो काजी रे चिनाः मेनाः आ?": "ᱫᱟᱨᱮ ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱪᱮᱫ ᱠᱚ ᱢᱮᱛᱟᱜᱼᱟ? (दारे संताड़ि ते चेद को मेताग-आ?)",
    "जंगली जानवर साला मे:": "ᱵᱤᱨ ᱡᱟᱱᱣᱟᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (बीर जानवर बाचाव मे:)",
    "कपड़े साला मे:": "ᱠᱤᱪᱨᱤᱡ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (किचरीज बाचाव मे:)",
    "जड़ साला मे:": "ᱨᱮᱦᱮᱫ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (रेहेद बाचाव मे:)",
    "राजकीय पशु साला मे:": "ᱨᱟᱡᱽ ᱡᱟᱱᱣᱟᱨ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (राज जानवर बाचाव मे:)",
    "ऋतु साला मे:": "ᱨᱤᱛᱩ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (रितु बाचाव मे:)",
    "जल स्रोत साला मे:": "ᱫᱟᱜ ᱡᱟᱭᱜᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (दाग जायगा बाचाव मे:)",
    "कोयला खदान साला मे:": "ᱠᱚᱭᱞᱟ ᱠᱷᱟᱫᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (कोयला खादान बाचाव मे:)",
    "बचाव स्थान साला मे:": "ᱵᱟᱧᱪᱟᱣ ᱡᱟᱭᱜᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (बाञ्चाव जायगा बाचाव मे:)",
    "मरांग वर्ण साला मे:": "ᱢᱟᱨᱟᱝ ᱚᱞ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (मरांग ओल बाचाव मे:)",
    "सुबह रेयाः कजी साल मे:": "ᱥᱮᱛᱟᱜ ᱨᱮᱭᱟᱜ ᱠᱟᱛᱷᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सेताग रेयाग काथा बाचाव मे:)",
    "'B' वर्ण रेयाः शब्द साला मे:": "'B' ᱚᱞ ᱨᱮᱭᱟᱜ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: ('B' ओल रेयाग अड़ा बाचाव मे:)",
    "खाली स्थान पूरा मे:": "ᱠᱷᱟᱹᱞᱤ ᱡᱟᱭᱜᱟ ᱯᱩᱨᱟᱹᱣ ᱢᱮ: (खाली जायगा पुराव मे:)",
    "रंग साला मे:": "ᱨᱚᱝ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (रंग बाचाव मे:)",
    "क्रिया शब्द साला मे:": "ᱠᱟᱹᱢᱤ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (कामि अड़ा बाचाव मे:)",
    "विशेषण साला मे:": "ᱜᱩᱬ ᱟᱹᱲᱟᱹ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (गुण अड़ा बाचाव मे:)",
    "सजीव साला मे:": "ᱡᱤᱣᱤᱭᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (जिवियान बाचाव मे:)",
    "हवा साला मे:": "ᱦᱚᱭ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (होय बाचाव मे:)",
    "निर्जीव साला मे:": "ᱵᱤᱱᱼᱡᱤᱣᱤᱭᱟᱱ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (बिन-जिवियान बाचाव मे:)",
    "तारे साला मे:": "ᱤᱯᱤᱞ ᱠᱚ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (इपिल को बाचाव मे:)",
    "पत्ती साला मे:": "ᱥᱟᱠᱟᱢ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (साकाम बाचाव मे:)",
    "अवस्था साला मे:": "ᱚᱵᱚᱥᱛᱷᱟ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (अवस्था बाचाव मे:)",
    "अंग साला मे:": "ᱦᱚᱲᱢᱚ ᱦᱟᱹᱴᱤᱧ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (होड़मो हाटिंग बाचाव मे:)",
    "ग्रह साला मे:": "ᱜᱽᱨᱚᱦᱚ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (ग्रह बाचाव मे:)",
    "स्विच साला मे:": "ᱥᱩᱭᱤᱪ ᱵᱟᱪᱷᱟᱣ ᱢᱮ: (सुइच बाचाव मे:)"
  },
  mundari: {
    "चिमिन सेब मेनाः आ? लेखा मे।": "चिमिन सेब मेनाःआ? लेखा मे।",
    "नेयाः आकृतिको नेल मे।": "नेयाः आकृतियाः नुतुम साला मे।",
    "मरांग वस्तु साला मे।": "मरांग जिनिस साला मे।",
    "चिमिन सुपुन को मेनाः आ?": "चिमिन कतुब को मेनाःआ?",
    "जोड़ मे: १ + २ =": "जोड़ मे: १ + २ =",
    "मेसा मे: १२ + ५ =": "मेसा मे: १२ + ५ =",
    "रे मे: १० - ४ =": "रे मे: १० - ४ =",
    "दहाई अंक साल मे:": "दहाई अंक साल मे:",
    "कजी रे साला मे:": "काजी रे साला मे:",
    "चिमिन बाजे तन?": "चिमिन बाजे तन?",
    "गुना मे: ४ x ३ =": "गुना मे: ४ x ३ =",
    "विस्तार रे ओल मे:": "विस्तार रे ओल मे:",
    "पैटर्न पूरा मे:": "पैटर्न पूरा मे:",
    "मेसा मे: २५० + १२० =": "मेसा मे: २५० + १२० =",
    "चिमिन कोने को मेनाः आ?": "चिमिन कोने को मेनाःआ?",
    "हाटिंग मे: २४ ÷ ४ =": "हाटिंग मे: २४ ÷ ४ =",
    "स्थानीय मान साल मे:": "स्थानीय मान साल मे:",
    "चिमिन ग्राम मेनाः आ?": "चिमिन ग्राम मेनाःआ?",
    "भुजा को साला मे:": "भुजा को साला मे:",
    "गुना मे: १५ x ६ =": "गुना मे: १५ x ६ =",
    "भिन्न को साला मे।": "भिन्न को साला मे।",
    "डिग्री मान साला मे:": "डिग्री मान साला मे:",
    "हल मे: ३/५ + १/५ =": "हल मे: ३/५ + १/५ =",
    "औसत निकाल मे:": "औसत निकाल मे:",
    "प्रतिशत मान साल मे:": "प्रतिशत मान साल मे:",
    "अक्षर 'अ' रेयाः शब्द साला मे:": "अक्षर 'अ' रेयाः शब्द साला मे:",
    "पहला वर्ण साल मे:": "पहला वर्ण साला मे:",
    "सरल शब्द साला मे:": "सरल शब्द साला मे:",
    "शब्द बनाओ मे:": "शब्द बनाओ मे:",
    "अंतिम अक्षर साला मे:": "अंतिम अक्षर साला मे:",
    "मात्रा जोड़ मे:": "मात्रा जोड़ मे:",
    "समान अर्थ साल मे:": "समान अर्थ साल मे:",
    "सही शब्द साला मे:": "सही शब्द साला मे:",
    "वाक्य पूरा मे:": "वाक्य पूरा मे:",
    "बहुवचन साला मे:": "बहुवचन साला मे:",
    "उल्टा शब्द साल मे:": "उल्टा शब्द साल मे:",
    "संज्ञा साला मे:": "संज्ञा साला मे:",
    "मुहावरा पूरा मे:": "मुहावरा पूरा मे:",
    "क्रिया साला मे:": "क्रिया साला मे:",
    "संधि विच्छेद साल मे:": "संधि विच्छेद साल मे:",
    "सूंघने को साला मे:": "सूंघने को साला मे:",
    "रिश्ता साला मे:": "रिश्ता साला मे:",
    "घर साला मे:": "घर साला मे:",
    "सूरज साला मे:": "सूरज साला मे:",
    "दाः साला मे:": "दाः साला मे:",
    "गाई (Cow) रेयाः अनुवाद साला मे:": "गाई (Cow) रेयाः अनुवाद साला मे:",
    "पेड़ हो काजी रे चिनाः मेनाः आ?": "पेड़ मुंडारी काजी रे चिनाः मेनाःआ?",
    "जंगली जानवर साला मे:": "जंगली जानवर साला मे:",
    "कपड़े साला मे:": "कपड़े साला मे:",
    "जड़ साला मे:": "जड़ साला मे:",
    "राजकीय पशु साला मे:": "राजकीय पशु साला मे:",
    "ऋतु साला मे:": "ऋतु साला मे:",
    "जल स्रोत साला मे:": "जल स्रोत साला मे:",
    "कोयला खदान साला मे:": "कोयला खदान साला मे:",
    "बचाव स्थान साला मे:": "बचाव स्थान साला मे:",
    "मरांग वर्ण साला मे:": "मरांग वर्ण साला मे:",
    "सुबह रेयाः कजी साल मे:": "सुबह रेयाः काजी साला मे:",
    "'B' वर्ण रेयाः शब्द साला मे:": "'B' वर्ण रेयाः शब्द साला मे:",
    "खाली स्थान पूरा मे:": "खाली स्थान पूरा मे:",
    "रंग साला मे:": "रंग साला मे:",
    "क्रिया शब्द साला मे:": "क्रिया शब्द साला मे:",
    "विशेषण साला मे:": "विशेषण साला मे:",
    "सजीव साला मे:": "सजीव साला मे:",
    "हवा साला मे:": "हवा साला मे:",
    "निर्जीव साला मे:": "निर्जीव साला मे:",
    "तारे साला मे:": "तारे साला मे:",
    "पत्ती साला मे:": "पत्ती साला मे:",
    "अवस्था साला मे:": "अवस्था साला मे:",
    "अंग साला मे:": "अंग साला मे:",
    "ग्रह साला मे:": "ग्रह साला मे:",
    "स्विच साला मे:": "स्विच साला मे:"
  }
};

const getTribalTranslation = (q, langCode) => {
  const hoText = q.translations?.ho || "";
  if (!hoText) return "अनुवाद उपलब्ध नहीं है";
  
  if (TRIBAL_DICTIONARY[langCode] && TRIBAL_DICTIONARY[langCode][hoText]) {
    return TRIBAL_DICTIONARY[langCode][hoText];
  }
  
  // Dynamic replacement fallbacks
  let fallbackText = hoText;
  if (langCode === 'santhali') {
    fallbackText = fallbackText.replace(/चिमिन/g, "तिनाः");
    fallbackText = fallbackText.replace(/मेनाः आ/g, "मेनाःआ");
    fallbackText = fallbackText.replace(/साला मे/g, "बाचाव मे");
  } else if (langCode === 'mundari') {
    fallbackText = fallbackText.replace(/मेनाः आ/g, "मेनाःआ");
  }
  
  return fallbackText;
};

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

export const CLASS_SUBJECT_THEMES = {
  "कक्षा 1": {
    "पर्यावरण अध्ययन": { chapterName: "मेरा परिवार, पशु, पौधे, भोजन (Family, Animals, Plants, Food)", outcome: "E-G1.1" },
    "गणित": { chapterName: "संख्या ज्ञान 1–20, जोड़ व आकृतियाँ (Numbers 1–20, Shapes, Addition)", outcome: "M-G1.1" },
    "हिंदी": { chapterName: "वर्णमाला, ध्वनि पहचान व सरल शब्द (Alphabet & Phonics)", outcome: "L-G1.1" },
    "अंग्रेज़ी": { chapterName: "Alphabet, Phonics, Colours, Numbers, Simple Words", outcome: "E-G1.1" },
    "विज्ञान": { chapterName: "हमारे आसपास की सजीव व निर्जीव वस्तुएं (Living & Non-Living)", outcome: "S-G1.1" }
  },
  "कक्षा 2": {
    "पर्यावरण अध्ययन": { chapterName: "मेरा विद्यालय, शरीर के अंग, ऋतुएँ (My School, Body Parts, Seasons)", outcome: "E-G2.1" },
    "गणित": { chapterName: "संख्या ज्ञान 1–100, जोड़, घटाव व पैटर्न (Numbers 1–100, Patterns)", outcome: "M-G2.1" },
    "हिंदी": { chapterName: "शब्द बनाना, छोटे वाक्य व चित्र वर्णन (Words & Short Sentences)", outcome: "L-G2.1" },
    "अंग्रेज़ी": { chapterName: "Vocabulary, Simple Sentences, Reading, Matching", outcome: "E-G2.1" },
    "विज्ञान": { chapterName: "ऋतुएँ, जल और इंद्रियाँ (Seasons, Water & Senses)", outcome: "S-G2.1" }
  },
  "कक्षा 3": {
    "पर्यावरण अध्ययन": { chapterName: "जल, पेड़-पौधे, प्राकृतिक पर्यावरण (Water, Plants, Environment)", outcome: "E-G3.1" },
    "गणित": { chapterName: "गुणा, भाग, भिन्न व मापन (Multiplication, Division, Fractions, Measurement)", outcome: "M-G3.1" },
    "हिंदी": { chapterName: "कहानी पठन, शब्दावली व वाक्य निर्माण (Reading & Vocabulary)", outcome: "L-G3.1" },
    "अंग्रेज़ी": { chapterName: "Grammar Basics, Comprehension, Vocabulary", outcome: "E-G3.1" },
    "विज्ञान": { chapterName: "जल चक्र, पौधों के भाग व पोषण (Water Cycle & Plant Parts)", outcome: "S-G3.1" }
  },
  "कक्षा 4": {
    "पर्यावरण अध्ययन": { chapterName: "मानव शरीर, प्राकृतिक संसाधन, सुरक्षा (Human Body, Resources, Safety)", outcome: "E-G4.1" },
    "गणित": { chapterName: "दशमलव, ज्यामिति, इबारती सवाल (Decimals, Geometry, Word Problems)", outcome: "M-G4.1" },
    "हिंदी": { chapterName: "अनुच्छेद पठन, व्याकरण व अनुवाद (Paragraph Reading, Grammar)", outcome: "L-G4.1" },
    "अंग्रेज़ी": { chapterName: "Tenses, Grammar, Comprehension, Writing", outcome: "E-G4.1" },
    "विज्ञान": { chapterName: "मानव शरीर क्रिया विज्ञान व प्राकृतिक आवास (Physiology & Matter)", outcome: "S-G4.1" }
  },
  "कक्षा 5": {
    "पर्यावरण अध्ययन": { chapterName: "पारिस्थितिकी, स्वास्थ्य, प्रदूषण (Ecosystem, Health, Pollution)", outcome: "E-G5.1" },
    "गणित": { chapterName: "प्रतिशत, ज्यामिति, समस्या समाधान (Percentages, Geometry, Area)", outcome: "M-G5.1" },
    "हिंदी": { chapterName: "अपठित गद्यांश, समझ व अनुवाद (Story Comprehension & Translation)", outcome: "L-G5.1" },
    "अंग्रेज़ी": { chapterName: "Grammar, Comprehension, Paragraph Writing, Vocabulary", outcome: "E-G5.1" },
    "विज्ञान": { chapterName: "खाद्य श्रृंखला, ऊर्जा व जैव विविधता (Food Chains & Conservation)", outcome: "S-G5.1" }
  }
};

export const getTemplatesForSubject = (subject) => {
  return ["कक्षा 1", "कक्षा 2", "कक्षा 3", "कक्षा 4", "कक्षा 5"].map((cls, idx) => {
    const theme = CLASS_SUBJECT_THEMES[cls]?.[subject] || { chapterName: `${subject} कार्यपत्रक`, outcome: `M-G${idx+1}.1` };
    return {
      id: `ws_${subject}_${idx+1}`,
      cls: cls,
      title: `${theme.chapterName}`,
      outcome: theme.outcome,
      duration: "20 minutes",
      learningObjective: `${cls} के बच्चों के लिए ${theme.chapterName} पर आधारित JCERT NIPUN Bilingual Worksheet.`,
      questions: generateQuestionsForClassSubject(cls, subject)
    };
  });
};

export default function WorksheetGenerator({ 
  selectedLanguage, 
  onSpeak, 
  selectedSubject, 
  setSelectedSubject 
}) {
  const [newClass, setNewClass] = useState('कक्षा 1');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newChapterName, setNewChapterName] = useState(() => CLASS_SUBJECT_THEMES['कक्षा 1']?.[selectedSubject]?.chapterName || 'मेरा परिवार, पशु, पौधे, भोजन');
  const [activeWorksheet, setActiveWorksheet] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLowInkMode, setIsLowInkMode] = useState(false);

  const activeLangMeta = LANGUAGES_METADATA[selectedLanguage] || LANGUAGES_METADATA["हो"];

  // Automatically update chapter name & active worksheet whenever subject or class changes
  useEffect(() => {
    const theme = CLASS_SUBJECT_THEMES[newClass]?.[selectedSubject];
    if (theme) {
      setNewChapterName(theme.chapterName);
    }
    const templates = getTemplatesForSubject(selectedSubject);
    const matchingTemplate = templates.find(t => t.cls === newClass) || templates[0];
    if (matchingTemplate) {
      setActiveWorksheet(matchingTemplate);
      setUserAnswers({});
      setQuizFinished(false);
    }
  }, [selectedSubject, newClass]);

  const handleOpenWorksheet = (sheet) => {
    if (sheet.cls) {
      setNewClass(sheet.cls);
      const theme = CLASS_SUBJECT_THEMES[sheet.cls]?.[selectedSubject];
      if (theme) {
        setNewChapterName(theme.chapterName);
      }
    }
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
    const theme = CLASS_SUBJECT_THEMES[newClass]?.[selectedSubject];
    const sheetObj = {
      id: `custom_${Date.now()}`,
      cls: newClass,
      title: `${newChapterName} (${newClass})`,
      outcome: theme?.outcome || (newClass === 'कक्षा 5' ? 'M-G5.1' : (newClass === 'कक्षा 4' ? 'M-G4.1' : (newClass === 'कक्षा 3' ? 'M-G3.1' : 'M-G1.2'))),
      duration: "20 minutes",
      learningObjective: `${newClass} के बच्चों के लिए ${newChapterName} आधारित bilingual worksheet.`,
      questions: customQuestions
    };
    setActiveWorksheet(sheetObj);
    setShowSuccessModal(true);
  };

  const templatesList = getTemplatesForSubject(selectedSubject);

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
                      <p>कक्षा (Class): {activeWorksheet?.cls || newClass} · Section: ______</p>
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
                      const tribalInstruction = q.translations?.[activeLangMeta.translationCode] || getTribalTranslation(q, activeLangMeta.translationCode);

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
            
            {showSuccessModal && (
              <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full mx-4 shadow-2xl text-center space-y-4 animate-scale-in font-sans">
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 text-xl font-bold border border-emerald-100">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-black text-slate-900">Worksheet Generated!</h3>
                    <p className="text-xs text-slate-500 font-bold leading-normal">
                      Bilingual Worksheet has been generated successfully and is ready to print or save offline.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full bg-[#0F4D2A] hover:bg-[#09351C] text-white text-xs font-black py-2.5 rounded-lg transition-colors cursor-pointer shadow-3xs"
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
