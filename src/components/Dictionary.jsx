import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { LANGUAGES_METADATA } from '../utils/mockData';

// Comprehensive dictionary database containing exactly 50 words (Point 2)
export const DICTIONARY_DATABASE = [
  // Numbers (1-10)
  { word: "एक", category: "Numbers", english: "One", translations: { ho: "मियाद (Miyad)", santhali: "मित" }, meaning: "संख्या प्रणाली में पहला स्थान / First in counting" },
  { word: "दो", category: "Numbers", english: "Two", translations: { ho: "बरिया (Bariya)", santhali: "बार" }, meaning: "एक और एक मिलकर बनने वाली संख्या / Second counting position" },
  { word: "तीन", category: "Numbers", english: "Three", translations: { ho: "आपिया (Apiya)", santhali: "पे" }, meaning: "दो से एक अधिक / Third counting position" },
  { word: "चार", category: "Numbers", english: "Four", translations: { ho: "उपूनिया (Upuniya)", santhali: "पोन" }, meaning: "तीन से एक अधिक / Fourth counting position" },
  { word: "पाँच", category: "Numbers", english: "Five", translations: { ho: "मोयआ (Moy-a)", santhali: "मोणे" }, meaning: "चार से एक अधिक / Fifth counting position" },
  { word: "छह", category: "Numbers", english: "Six", translations: { ho: "तुरूईया (Turuiya)", santhali: "तुरुइ" }, meaning: "पाँच से एक अधिक / Sixth counting position" },
  { word: "सात", category: "Numbers", english: "Seven", translations: { ho: "अइया (Aiya)", santhali: "एयाय" }, meaning: "छह से एक अधिक / Seventh counting position" },
  { word: "आठ", category: "Numbers", english: "Eight", translations: { ho: "इरिलिया (Iriliya)", santhali: "इरल" }, meaning: "सात से एक अधिक / Eighth counting position" },
  { word: "नौ", category: "Numbers", english: "Nine", translations: { ho: "आरेया (Areya)", santhali: "आरे" }, meaning: "आठ से एक अधिक / Ninth counting position" },
  { word: "दस", category: "Numbers", english: "Ten", translations: { ho: "गेलेया (Geleya)", santhali: "गेल" }, meaning: "नौ से एक अधिक / Tenth counting position" },

  // Nature (11-20)
  { word: "पानी", category: "Nature", english: "Water", translations: { ho: "दाः (Daah)", santhali: "दाः" }, meaning: "जीवन के लिए आवश्यक तरल पदार्थ / Hydration liquid" },
  { word: "पेड़", category: "Nature", english: "Tree", translations: { ho: "दारू (Daru)", santhali: "दारे" }, meaning: "जड़ और तने वाला बड़ा पौधा / Large woody plant" },
  { word: "पत्ता", category: "Nature", english: "Leaf", translations: { ho: "साकाम (Sakam)", santhali: "साकाम" }, meaning: "पेड़ की शाखाओं पर उगने वाला हरा हिस्सा / Foliage of tree" },
  { word: "हवा", category: "Nature", english: "Wind", translations: { ho: "होयो (Hoyo)", santhali: "होय" }, meaning: "वायुमंडल में चलने वाली वायु / Atmospheric air" },
  { word: "मिट्टी", category: "Nature", english: "Soil", translations: { ho: "हासा (Hasa)", santhali: "हासा" }, meaning: "पृथ्वी की ऊपरी उपजाऊ सतह / Fertile earth ground" },
  { word: "धूप", category: "Nature", english: "Sunlight", translations: { ho: "सिंगी जर (Singi Jar)", santhali: "सितुंग" }, meaning: "सूर्य से मिलने वाला प्रकाश और ऊष्मा / Warm solar radiation" },
  { word: "फल", category: "Nature", english: "Fruit", translations: { ho: "जो (Jo)", santhali: "जो" }, meaning: "पेड़ का खाने योग्य मीठा हिस्सा / Sweet edible produce" },
  { word: "फूल", category: "Nature", english: "Flower", translations: { ho: "बा (Baa)", santhali: "बाहा" }, meaning: "पौधे का सुंदर और सुगंधित भाग / Colorful blossom" },
  { word: "बीज", category: "Nature", english: "Seed", translations: { ho: "जंग (Jang)", santhali: "जंग" }, meaning: "जिससे नया पौधा उगता है / Reproductive plant kernel" },
  { word: "जंगल", category: "Nature", english: "Forest", translations: { ho: "बीर (Bir)", santhali: "बीर" }, meaning: "पेड़ों से ढका हुआ बड़ा भूभाग / Wild wooded area" },

  // Animals (21-30)
  { word: "गाय", category: "Animals", english: "Cow", translations: { ho: "गाई (Gai)", santhali: "गाइ" }, meaning: "दूध देने वाला एक पालतू पशु / Domestic milk bovine" },
  { word: "कुत्ता", category: "Animals", english: "Dog", translations: { ho: "सेता (Seta)", santhali: "सेता" }, meaning: "वफादार पालतू रखवाला जानवर / Guard canine pet" },
  { word: "बिल्ली", category: "Animals", english: "Cat", translations: { ho: "बिलाई (Bilai)", santhali: "पुसी" }, meaning: "एक छोटी पालतू म्याऊँ करने वाली बिल्ली / Small domestic feline" },
  { word: "हाथी", category: "Animals", english: "Elephant", translations: { ho: "हाथी (Hathi)", santhali: "हाथी" }, meaning: "एक विशाल सूंढ़ वाला जंगली जानवर / Giant trunk mammal" },
  { word: "बकरी", category: "Animals", english: "Goat", translations: { ho: "मेरम (Meram)", santhali: "मेरम" }, meaning: "दूध देने वाली छोटी चौपाया / Small livestock grazer" },
  { word: "शेर", category: "Animals", english: "Lion", translations: { ho: "कुला (Kula)", santhali: "तरुप" }, meaning: "जंगल का राजा मांसाहारी पशु / Apex wild feline carnivore" },
  { word: "बंदर", category: "Animals", english: "Monkey", translations: { ho: "गड़ी (Gari)", santhali: "गाड़ी" }, meaning: "पेड़ों पर उछलकूद करने वाला जानवर / Tree jumping primate" },
  { word: "पक्षी", category: "Animals", english: "Bird", translations: { ho: "चेणे (Chene)", santhali: "चेणे" }, meaning: "हवा में उड़ने वाला पंखदार जीव / Winged flying avian" },
  { word: "मछली", category: "Animals", english: "Fish", translations: { ho: "हाकु (Haku)", santhali: "हाकु" }, meaning: "पानी में तैरने वाला जलचर / Water breathing aquatic" },
  { word: "कछुआ", category: "Animals", english: "Turtle", translations: { ho: "हरो (Haro)", santhali: "होरो" }, meaning: "कठोर कवच वाला एक धीमा जलचर / Hard shell reptile" },

  // Classroom (31-40)
  { word: "किताब", category: "Classroom", english: "Book", translations: { ho: "पुथी (Puthi)", santhali: "पुथी" }, meaning: "पढ़ने के लिए छपे हुए पन्नों का संग्रह / Printed reading binder" },
  { word: "कलम", category: "Classroom", english: "Pen", translations: { ho: "ओलोंग दारू (Olong)", santhali: "कलम" }, meaning: "लिखने की स्याही वाली छड़ी / Ink writing instrument" },
  { word: "कॉपी", category: "Classroom", english: "Notebook", translations: { ho: "ओल पुथी (Ol Puthi)", santhali: "ओल साकाम" }, meaning: "लिखने के लिए खाली पन्नों की पुस्तिका / Blank writing pad" },
  { word: "बस्ता", category: "Classroom", english: "Schoolbag", translations: { ho: "झोला (Jhola)", santhali: "थैला" }, meaning: "किताबें ले जाने का थैला / Backpack carrier" },
  { word: "मेज", category: "Classroom", english: "Table", translations: { ho: "मेज (Mej)", santhali: "मेज" }, meaning: "लिखने-पढ़ने के लिए सपाट तख्त / Flat study desk" },
  { word: "कुर्सी", category: "Classroom", english: "Chair", translations: { ho: "कुर्सी (Kursi)", santhali: "कुर्सी" }, meaning: "बैठने का चार पैरों वाला साधन / Seat support" },
  { word: "चाक", category: "Classroom", english: "Chalk", translations: { ho: "चाक (Chalk)", santhali: "चाक" }, meaning: "श्यामपट्ट पर लिखने की सफेद खड़िया / Slate blackboard marker" },
  { word: "डस्टर", category: "Classroom", english: "Eraser", translations: { ho: "डस्टर (Duster)", santhali: "डस्टर" }, meaning: "लिखे हुए को मिटाने का साधन / Board cleaner pad" },
  { word: "स्कूल", category: "Classroom", english: "School", translations: { ho: "इतु ओड़ाः (Itu Oraah)", santhali: "इतु आसड़ा" }, meaning: "शिक्षा प्राप्त करने का केंद्र / Educational building" },
  { word: "कमरा", category: "Classroom", english: "Room", translations: { ho: "ओड़ाः (Oraah)", santhali: "बखोल" }, meaning: "चारों ओर दीवारों से घिरा हिस्सा / Enclosed living space" },

  // Dialogues/Verbs (41-50)
  { word: "पढ़ना", category: "Verbs", english: "To Read", translations: { ho: "पढ़ाओ (Padao)", santhali: "पढ़ाओ" }, meaning: "लिखे हुए शब्दों को समझना / Comprehend text aloud" },
  { word: "लिखना", category: "Verbs", english: "To Write", translations: { ho: "ओल (Ol)", santhali: "ओल" }, meaning: "अक्षरों को कागज पर अंकित करना / Inscribe characters" },
  { word: "खेलना", category: "Verbs", english: "To Play", translations: { ho: "इनेम (Inem)", santhali: "एनेच" }, meaning: "मनोरंजन के लिए क्रीड़ा करना / Engage in sports" },
  { word: "खाना", category: "Verbs", english: "To Eat", translations: { ho: "जोम (Jom)", santhali: "जोम" }, meaning: "भोजन ग्रहण करना / Consume food nourishment" },
  { word: "पीना", category: "Verbs", english: "To Drink", translations: { ho: "नु (Nu)", santhali: "नु" }, meaning: "तरल पदार्थ निगलना / Swallow hydration liquids" },
  { word: "आना", category: "Verbs", english: "To Come", translations: { ho: "हिजुः (Hijuh)", santhali: "हिजुः" }, meaning: "किसी स्थान की ओर बढ़ना / Approach location" },
  { word: "जाना", category: "Verbs", english: "To Go", translations: { ho: "सेनोः (Senoh)", santhali: "सेनोः" }, meaning: "एक स्थान से प्रस्थान करना / Depart from location" },
  { word: "सुनना", category: "Verbs", english: "To Listen", translations: { ho: "अंजोम (Anjom)", santhali: "अंजोम" }, meaning: "कानों से ध्वनि ग्रहण करना / Perceive auditory sounds" },
  { word: "बोलना", category: "Verbs", english: "To Speak", translations: { ho: "कजी (Kaji)", santhali: "रोर" }, meaning: "मुँह से आवाज़ निकालना / Express vocal statements" },
  { word: "देखना", category: "Verbs", english: "To See", translations: { ho: "नेल (Nel)", santhali: "नेयल" }, meaning: "आँखों से अवलोकन करना / Observe visual surroundings" }
];

export default function Dictionary({ selectedLanguage, onSpeak }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Numbers', 'Nature', 'Animals', 'Classroom', 'Verbs'];
  const activeLangMeta = LANGUAGES_METADATA[selectedLanguage] || LANGUAGES_METADATA["हो"];
  const targetKey = activeLangMeta.translationCode || 'ho';

  const filteredData = DICTIONARY_DATABASE.filter(item => {
    const matchesSearch = 
      item.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.translations[targetKey] || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen text-slate-805 text-left leading-normal font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Breadcrumbs */}
        <div className="text-[10px] font-bold text-slate-400 uppercase flex space-x-1.5 font-sans">
          <span>Teach</span>
          <span>/</span>
          <span>Bilingual Dictionary</span>
        </div>

        {/* 1. Filter Panel */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl p-5 shadow-3xs space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-base font-black text-[#0F4D2A] uppercase tracking-wide">
                JCERT Bilingual Dictionary (शब्दकोश)
              </h2>
              <p className="text-[10px] text-slate-455 font-bold mt-0.5">
                Exactly 50 primary classroom words translated across Devanagari phonetics.
              </p>
            </div>
            <div className="bg-[#FAF7ED] border border-[#E5DEC9] px-3.5 py-2 rounded-lg text-xs font-black text-slate-700 h-10 flex items-center">
              Active Loop: Hindi ➔ {activeLangMeta.name}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-2 border-t border-slate-100 items-end">
            {/* Search */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[8.5px] font-black text-slate-400 uppercase">शब्द खोजें (Search Word)</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="उदा. पानी, किताब, One..."
                className="w-full bg-slate-50 border border-slate-205 rounded px-3 py-2 text-xs font-bold focus:bg-white focus:outline-none h-11 shadow-inner"
              />
            </div>

            {/* Category selection tabs */}
            <div className="md:col-span-6 space-y-1">
              <label className="block text-[8.5px] font-black text-slate-400 uppercase">श्रेणी चुनें (Select Category)</label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black cursor-pointer transition-colors border ${
                      selectedCategory === cat
                        ? 'bg-[#0F4D2A] text-white border-emerald-950 shadow-3xs'
                        : 'bg-white hover:bg-slate-50 border-slate-250 text-slate-700'
                    }`}
                  >
                    {cat === 'All' ? 'सभी शब्द' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Main dictionary table grid */}
        <div className="bg-white border border-[#E5DEC9] rounded-2xl shadow-3xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-[#FAF7ED] border-b border-[#E5DEC9] font-black text-[9px] text-[#0F4D2A] uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Hindi (हिंदी)</th>
                  <th className="p-3.5">English</th>
                  <th className="p-3.5">{activeLangMeta.name} Translation</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Meaning / Context</th>
                  <th className="p-3.5 text-center">Audio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold text-slate-808">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold italic">
                      कोई परिणाम नहीं मिला। (No results matched)
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => {
                    const transVal = item.translations[targetKey] || "अनुवाद उपलब्ध नहीं है";
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-3.5 text-[#0F4D2A] font-black">{item.word}</td>
                        <td className="p-3.5 text-slate-550">{item.english}</td>
                        <td className="p-3.5 font-mono text-indigo-950 text-sm tracking-wide">{transVal}</td>
                        <td className="p-3.5">
                          <span className="bg-slate-100 text-slate-600 border px-2 py-0.5 rounded-full text-[8.5px] uppercase font-black">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500 font-medium font-sans leading-relaxed">{item.meaning}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => onSpeak(transVal !== 'अनुवाद उपलब्ध नहीं है' ? transVal.split(' ')[0] : item.word, targetKey)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-650 p-2 rounded-lg cursor-pointer h-10 w-10 flex items-center justify-center border border-indigo-150 mx-auto"
                            title="Listen Pronunciation"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
