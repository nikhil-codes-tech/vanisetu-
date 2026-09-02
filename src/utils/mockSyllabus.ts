import { ClassGrade, SubjectCategory, SyllabusChapter } from '../types/models';

const SUBJECTS: SubjectCategory[] = ['math', 'science', 'hindi', 'english', 'evs'];
const GRADES: ClassGrade[] = ['1', '2', '3', '4', '5'];

const CHAPTER_TEMPLATES: Record<SubjectCategory, { title: string; ho: string; santhali: string; mundari: string; desc: string }[]> = {
  math: [
    { title: 'संख्या ज्ञान व गिनती (Numbers 1-20)', ho: 'Leka & Ginti', santhali: 'Lekha Ar Sakhi', mundari: 'Ginti Leka', desc: 'Counting items in native tribal language with Ol Chiki & Warang Chiti' },
    { title: 'आकृतियाँ और स्थान (Shapes & Space)', ho: 'Mutha & Tha', santhali: 'Muthan Ar Thao', mundari: 'Mutha Thav', desc: 'Exploring circles, squares and spatial concepts in nature' },
    { title: 'जोड़ और घटाव (Addition & Subtraction)', ho: 'Misa & Hating', santhali: 'Mesawa Ar Ochoko', mundari: 'Juma Ghatav', desc: 'Foundational arithmetic using pebble counters and leaf groups' },
  ],
  science: [
    { title: 'हमारे आस-पास के पौधे (Plants Around Us)', ho: 'Abu Bepar Daruko', santhali: 'Abo Aspan Dare', mundari: 'Abu Japa Daruko', desc: 'Identifying local medicinal herbs, trees, and leaf patterns' },
    { title: 'जल और उसका महत्व (Water & Life)', ho: 'Da & Jonom', santhali: 'Dah Ar Jiwi', mundari: 'Da Jeev', desc: 'Understanding rain, rivers, water cycles and clean drinking habits' },
    { title: 'मौसम और ऋतुएँ (Seasons & Weather)', ho: 'Rutu & Gama', santhali: 'Rutu Ar Jari', mundari: 'Mausam Rutu', desc: 'Sarhul, Karma, Monsoon and harvesting seasons in Jharkhand' },
  ],
  hindi: [
    { title: 'वर्णमाला व ध्वनि (Alphabet & Sounds)', ho: 'Ol & Kaji Sari', santhali: 'Akhor Ar Sari', mundari: 'Varnamala Sari', desc: 'Bridging tribal mother tongue phonetics with Devanagari Hindi' },
    { title: 'सरल शब्द व वाक्य (Simple Words & Sentences)', ho: 'Bugi Kaji Ol', santhali: 'Suluk Ror Ol', mundari: 'Kaji Ror', desc: 'Reading simple stories about village festivals and daily life' },
    { title: 'लोककथाएँ व कविताएँ (Folk Tales & Poems)', ho: 'Kani & Durang', santhali: 'Kahni Ar Sereng', mundari: 'Kahani Durang', desc: 'Traditional tribal moral folklore retold in dual scripts' },
  ],
  english: [
    { title: 'Greetings & Self Introduction', ho: 'Johar & Upurum', santhali: 'Johar Ar Uprom', mundari: 'Johar Upurum', desc: 'Hello, Name, School, and Basic polite classroom phrases' },
    { title: 'Colors & Common Objects', ho: 'Rong & Samanko', santhali: 'Rong Ar Jinish', mundari: 'Rang Saman', desc: 'Identifying colors, animals, and common school objects' },
    { title: 'Action Words & Rhymes', ho: 'Kame Kaji', santhali: 'Kami Ror', mundari: 'Kami Kaji', desc: 'Sing, dance, run, jump, read, write in classroom rhymes' },
  ],
  evs: [
    { title: 'मेरा परिवार और समुदाय (My Family & Village)', ho: 'Aing Owa & Hatu', santhali: 'Inyak Orak Ar Aato', mundari: 'Aing Ora & Hatu', desc: 'Kinship terms, village elders, and community cooperation' },
    { title: 'स्वच्छता और स्वास्थ्य (Health & Cleanliness)', ho: 'Pharcha & Bugi', santhali: 'Saphari Ar Hormo', mundari: 'Sapha Hormo', desc: 'Hand washing, dental care, clean water, and healthy diet' },
    { title: 'पर्व-त्योहार (Festivals of Jharkhand)', ho: 'Porob & Baa', santhali: 'Parab Ar Baha', mundari: 'Porob Sarhul', desc: 'Sarhul, Karma, Sohrai, Mage Porob and cultural heritage' },
  ],
};

export const GENERATE_MOCK_SYLLABUS = (): SyllabusChapter[] => {
  const chapters: SyllabusChapter[] = [];
  let index = 1;

  for (const grade of GRADES) {
    for (const subject of SUBJECTS) {
      const templates = CHAPTER_TEMPLATES[subject];
      for (let chNum = 1; chNum <= 3; chNum++) {
        const template = templates[(chNum - 1) % templates.length];
        const compPrefix = subject.substring(0, 1).toUpperCase();
        chapters.push({
          id: `ch_${grade}_${subject}_${chNum}`,
          grade,
          subject,
          chapterNumber: chNum,
          titleHindi: `कक्षा ${grade} - ${template.title}`,
          titleTribal: {
            ho: template.ho,
            santhali: template.santhali,
            mundari: template.mundari,
          },
          nipunCompetencyCode: `${compPrefix}${grade}.${chNum}`,
          description: template.desc,
          completed: chNum === 1,
          masteryPercentage: chNum === 1 ? 85 : chNum === 2 ? 40 : 0,
        });
        index++;
      }
    }
  }

  return chapters;
};

export const MOCK_SYLLABUS = GENERATE_MOCK_SYLLABUS();
