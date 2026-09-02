import { VocabularyWord } from '../types/models';

export const DICTIONARY_WORDS: VocabularyWord[] = [
  // MATH & NUMBERS
  { id: 1, english: 'One', hindi: 'एक', ho: 'Miyad', hoScript: '𑢱𑣁𑣕', santhali: 'Mit', santhaliScript: 'ᱢᱤᱫ', mundari: 'Miyad', category: 'Math' },
  { id: 2, english: 'Two', hindi: 'दो', ho: 'Bariya', hoScript: '𑢷𑣁𑣜𑣂𑣅𑣁', santhali: 'Bar', santhaliScript: 'ᱵᱟᱨ', mundari: 'Bariya', category: 'Math' },
  { id: 3, english: 'Three', hindi: 'तीन', ho: 'Apiya', hoScript: '𑢡𑣉𑣂𑣅𑣁', santhali: 'Pe', santhaliScript: 'ᱯᱮ', mundari: 'Apiya', category: 'Math' },
  { id: 4, english: 'Four', hindi: 'चार', ho: 'Upuniya', hoScript: '𑢣𑣉𑣂𑣅𑣁', santhali: 'Pone', santhaliScript: 'ᱯᱳᱱ', mundari: 'Upuniya', category: 'Math' },
  { id: 5, english: 'Five', hindi: 'पाँच', ho: 'Moya', hoScript: '𑢭𑣉𑣅𑣁', santhali: 'Mone', santhaliScript: 'ᱢᱚᱬᱮ', mundari: 'Moya', category: 'Math' },
  { id: 6, english: 'Addition', hindi: 'जोड़', ho: 'Misa', hoScript: '𑢭𑣂𑣝𑣁', santhali: 'Mesawa', santhaliScript: 'ᱢᱮᱥᱟ', mundari: 'Juma', category: 'Math' },
  { id: 7, english: 'Subtraction', hindi: 'घटाव', ho: 'Hating / Bhed', hoScript: '𑢹𑣁𑣕𑣂𑣊', santhali: 'Ochoko', santhaliScript: 'ᱚᱪᱚᱜ', mundari: 'Ghatav', category: 'Math' },
  { id: 8, english: 'Circle', hindi: 'वृत्त / गोल', ho: 'Gol / Dundul', hoScript: '𑢩𑣉𑣚', santhali: 'Gol', santhaliScript: 'ᱜᱳᱞ', mundari: 'Gol', category: 'Math' },
  { id: 9, english: 'Count', hindi: 'गिनती', ho: 'Leka', hoScript: '𑢚𑣄𑣈𑣁', santhali: 'Lekha', santhaliScript: 'ᱞᱮᱠᱷᱟ', mundari: 'Leka', category: 'Math' },
  { id: 10, english: 'Big', hindi: 'बड़ा', ho: 'Marang', hoScript: '𑢭𑣁𑣜𑣁𑣊', santhali: 'Marang', santhaliScript: 'ᱢᱟᱨᱟᱝ', mundari: 'Marang', category: 'Math' },
  { id: 11, english: 'Small', hindi: 'छोटा', ho: 'Hurin', hoScript: '𑢹𑣉𑣜𑣂𑣓', santhali: 'Khatiq / Hudin', santhaliScript: 'ᱦᱩᱰᱤᱧ', mundari: 'Hurin', category: 'Math' },

  // EVS & NATURE
  { id: 12, english: 'Sun', hindi: 'सूरज', ho: 'Singi', hoScript: '𑢝𑣂𑣊𑣂', santhali: 'Sin', santhaliScript: 'ᱥᱤᱧ', mundari: 'Singi', category: 'EVS' },
  { id: 13, english: 'Moon', hindi: 'चाँद', ho: 'Chandu', hoScript: '𑢮𑣁𑣓𑣕𑣉', santhali: 'Chando', santhaliScript: 'ᱪᱟᱸᱫᱚ', mundari: 'Chandu', category: 'EVS' },
  { id: 14, english: 'Tree', hindi: 'पेड़', ho: 'Daru', hoScript: '𑢵𑣁𑣜𑣉', santhali: 'Dare', santhaliScript: 'ᱫᱟᱨᱮ', mundari: 'Daru', category: 'EVS' },
  { id: 15, english: 'Water', hindi: 'पानी', ho: 'Da', hoScript: '𑢵𑣁', santhali: 'Dah', santhaliScript: 'ᱫᱟᱜ', mundari: 'Da', category: 'EVS' },
  { id: 16, english: 'Mountain', hindi: 'पहाड़', ho: 'Buru', hoScript: '𑢷𑣉𑣜𑣉', santhali: 'Buru', santhaliScript: 'ᱵᱩᱨᱩ', mundari: 'Buru', category: 'EVS' },
  { id: 17, english: 'River', hindi: 'नदी', ho: 'Gada', hoScript: '𑢩𑣁𑣵𑣁', santhali: 'Gada', santhaliScript: 'ᱜᱟᱰᱟ', mundari: 'Gada', category: 'EVS' },
  { id: 18, english: 'Soil / Earth', hindi: 'मिट्टी / धरती', ho: 'Hasa', hoScript: '𑢹𑣁𑣝𑣁', santhali: 'Hasa', santhaliScript: 'ᱦᱟᱥᱟ', mundari: 'Hasa', category: 'EVS' },
  { id: 19, english: 'Forest', hindi: 'जंगल / वन', ho: 'Bir', hoScript: '𑢷𑣂𑣜', santhali: 'Bir', santhaliScript: 'ᱵᱤᱨ', mundari: 'Bir', category: 'EVS' },
  { id: 20, english: 'Rain', hindi: 'बारिश / वर्षा', ho: 'Gama da', hoScript: '𑢩𑣁𑣭𑣁 𑢵𑣁', santhali: 'Dah Jari', santhaliScript: 'ᱫᱟᱜ ᱡᱟᱹᱲᱤ', mundari: 'Gama', category: 'EVS' },
  { id: 21, english: 'Flower', hindi: 'फूल', ho: 'Baha', hoScript: '𑢷𑣁𑢹𑣁', santhali: 'Baha', santhaliScript: 'ᱵᱟᱦᱟ', mundari: 'Baha', category: 'EVS' },
  { id: 22, english: 'Fruit', hindi: 'फल', ho: 'Joo', hoScript: '𑢯𑣉𑣉', santhali: 'Jo', santhaliScript: 'ᱡᱚ', mundari: 'Joo', category: 'EVS' },

  // ANIMALS & BIRDS
  { id: 23, english: 'Cow', hindi: 'गाय', ho: 'Uri', hoScript: '𑢣𑣜𑣂', santhali: 'Gai', santhaliScript: 'ᱜᱟᱹᱭ', mundari: 'Uri', category: 'EVS' },
  { id: 24, english: 'Dog', hindi: 'कुत्ता', ho: 'Seta', hoScript: '𑢝𑣈𑣕𑣁', santhali: 'Seta', santhaliScript: 'ᱥᱮᱛᱟ', mundari: 'Seta', category: 'EVS' },
  { id: 25, english: 'Cat', hindi: 'बिल्ली', ho: 'Bili', hoScript: '𑢷𑣂𑢚𑣂', santhali: 'Pusi', santhaliScript: 'ᱯᱩᱥᱤ', mundari: 'Bili', category: 'EVS' },
  { id: 26, english: 'Elephant', hindi: 'हाथी', ho: 'Hati', hoScript: '𑢹𑣁𑣕𑣂', santhali: 'Hathi', santhaliScript: 'ᱦᱟᱹᱛᱤ', mundari: 'Hati', category: 'EVS' },
  { id: 27, english: 'Tiger', hindi: 'बाघ', ho: 'Kula', hoScript: '𑢢𑣉𑢚𑣁', santhali: 'Tarup', santhaliScript: 'ᱛᱟᱹᱨᱩᱵ', mundari: 'Kula', category: 'EVS' },
  { id: 28, english: 'Bird', hindi: 'चिड़िया / पक्षी', ho: 'Chene', hoScript: '𑢮𑣈𑣓𑣈', santhali: 'Chene', santhaliScript: 'ᱪᱮᱬᱮ', mundari: 'Chene', category: 'EVS' },
  { id: 29, english: 'Fish', hindi: 'मछली', ho: 'Haku', hoScript: '𑢹𑣁𑢢𑣉', santhali: 'Haku', santhaliScript: 'ᱦᱟᱹᱠᱩ', mundari: 'Hai', category: 'EVS' },

  // CLASSROOM & SCHOOL
  { id: 30, english: 'School', hindi: 'विद्यालय / स्कूल', ho: 'Iskul', hoScript: '𑢡𑣂𑣝𑢢𑣉𑢚', santhali: 'Iskul / Asra', santhaliScript: 'ᱟᱥᱲᱟ', mundari: 'Iskul', category: 'General' },
  { id: 31, english: 'Teacher', hindi: 'शिक्षक / गुरुजी', ho: 'Masaab / Master', hoScript: '𑢭𑣁𑣝𑣁𑢷', santhali: 'Guru Gomke', santhaliScript: 'ᱢᱟᱪᱮᱛ', mundari: 'Master Gomke', category: 'General' },
  { id: 32, english: 'Book', hindi: 'किताब / पुस्तक', ho: 'Pothi', hoScript: '𑢰𑣉𑣕𑣂', santhali: 'Pothi', santhaliScript: 'ᱯᱩᱛᱷᱤ', mundari: 'Pothi', category: 'General' },
  { id: 33, english: 'Pen / Pencil', hindi: 'कलम', ho: 'Kalam', hoScript: '𑢢𑣁𑢚𑣁𑣭', santhali: 'Kalam', santhaliScript: 'ᱠᱚᱞᱚᱢ', mundari: 'Kalam', category: 'General' },
  { id: 34, english: 'Friend', hindi: 'मित्र / दोस्त', ho: 'Gati', hoScript: '𑢩𑣁𑣕𑣂', santhali: 'Gati', santhaliScript: 'ᱜᱟᱛᱮ', mundari: 'Joti', category: 'General' },
  { id: 35, english: 'Classroom', hindi: 'कक्षा / वर्ग', ho: 'Kakhsa', hoScript: '𑢢𑣁𑢢𑣝𑣁', santhali: 'Chann', santhaliScript: 'ᱪᱟᱱᱟᱪ', mundari: 'Kakhsa', category: 'General' },

  // ACTIONS & CONVERSATION
  { id: 36, english: 'Read', hindi: 'पढ़ना', ho: 'Padao', hoScript: '𑢰𑣁𑣵𑣁𑣉', santhali: 'Parhao', santhaliScript: 'ᱯᱟᱲᱦᱟᱣ', mundari: 'Padao', category: 'Hindi' },
  { id: 37, english: 'Write', hindi: 'लिखना', ho: 'Ol', hoScript: '𑢣𑢚', santhali: 'Ol', santhaliScript: 'ᱚᱞ', mundari: 'Ol', category: 'Hindi' },
  { id: 38, english: 'Speak', hindi: 'बोलना', ho: 'Kaji', hoScript: '𑢢𑣁𑢯𑣂', santhali: 'Ror', santhaliScript: 'ᱨᱚᱲ', mundari: 'Kaji', category: 'Hindi' },
  { id: 39, english: 'Listen', hindi: 'सुनना', ho: 'Ayun', hoScript: '𑢡𑣁𑣅𑣉𑣓', santhali: 'Anjom', santhaliScript: 'ᱟᱸᱡᱚᱢ', mundari: 'Ayum', category: 'Hindi' },
  { id: 40, english: 'Play', hindi: 'खेलना', ho: 'Inung', hoScript: '𑢡𑣂𑣓𑣉𑣊', santhali: 'Enech', santhaliScript: 'ᱮᱱᱮᱡ', mundari: 'Enen', category: 'General' },
  { id: 41, english: 'Sing', hindi: 'गाना', ho: 'Durang', hoScript: '𑢵𑣉𑣜𑣁𑣊', santhali: 'Sereng', santhaliScript: 'ᱥᱮᱨᱮᱧ', mundari: 'Durang', category: 'General' },
  { id: 42, english: 'Dance', hindi: 'नाचना', ho: 'Susun', hoScript: '𑢝𑣉𑣝𑣉𑣓', santhali: 'Enesh', santhaliScript: 'ᱮᱱᱮᱡ', mundari: 'Susun', category: 'General' },

  // SCIENCE & HEALTH
  { id: 43, english: 'Hand', hindi: 'हाथ', ho: 'Ti', hoScript: '𑢕𑣂', santhali: 'Ti', santhaliScript: 'ᱛᱤ', mundari: 'Ti', category: 'Science' },
  { id: 44, english: 'Eye', hindi: 'आँख', ho: 'Med', hoScript: '𑢭𑣈𑣵', santhali: 'Met', santhaliScript: 'ᱢᱮᱫ', mundari: 'Med', category: 'Science' },
  { id: 45, english: 'Ear', hindi: 'कान', ho: 'Lutur', hoScript: '𑢚𑣉𑣕𑣉𑣜', santhali: 'Lutur', santhaliScript: 'ᱞᱩᱛᱩᱨ', mundari: 'Lutur', category: 'Science' },
  { id: 46, english: 'Food', hindi: 'भोजन / खाना', ho: 'Mandi', hoScript: '𑢭𑣁𑣓𑣵𑣂', santhali: 'Daka', santhaliScript: 'ᱫᱟᱠᱟ', mundari: 'Mandi', category: 'Science' },
  { id: 47, english: 'Clean', hindi: 'साफ़ / स्वच्छ', ho: 'Pharcha', hoScript: '𑢰𑣁𑣜𑣮𑣁', santhali: 'Saphari', santhaliScript: 'ᱥᱟᱯᱷᱟ', mundari: 'Sapha', category: 'Science' },
  { id: 48, english: 'Health', hindi: 'स्वास्थ्य', ho: 'Horomo bugi', hoScript: '𑢹𑣉𑣜𑣉𑣭𑣉 𑢷𑣉𑢩𑣂', santhali: 'Hormo bugi', santhaliScript: 'ᱦᱚᱲᱢᱚ ᱵᱩᱜᱤ', mundari: 'Hormo', category: 'Science' },
  { id: 49, english: 'Good / Well', hindi: 'अच्छा / ठीक', ho: 'Bugi', hoScript: '𑢷𑣉𑢩𑣂', santhali: 'Besh / Bugi', santhaliScript: 'ᱵᱮᱥ', mundari: 'Bugi', category: 'General' },
  { id: 50, english: 'Namaste / Greeting', hindi: 'नमस्ते / जोहार', ho: 'Johar', hoScript: '𑢯𑣉𑢹𑣁𑣜', santhali: 'Johar', santhaliScript: 'ᱡᱚᱦᱟᱨ', mundari: 'Johar', category: 'General' },
];
