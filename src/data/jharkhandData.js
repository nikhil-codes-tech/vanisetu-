export const JHARKHAND_DISTRICTS = [
  "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum",
  "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara",
  "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu",
  "Ramgarh", "Ranchi", "Sahebganj", "Saraikela-Kharsawan", "Simdega", "West Singhbhum"
];

export const TRIBAL_LANGUAGES = [
  { id: "ho", name: "हो (Ho)", script: "Warang Citi / Devanagari", defaultVoice: "ho-male-1" },
  { id: "santhali", name: "संथाली (Santhali)", script: "Ol Chiki / Devanagari", defaultVoice: "santhali-female-1" },
  { id: "mundari", name: "मुंडारी (Mundari)", script: "Bani Hisir / Devanagari", defaultVoice: "mundari-female-1" }
];

export const MOCK_SCHOOLS = [
  {
    udiseCode: "20190100201",
    name: "UPS Murhu Primary School",
    district: "Khunti",
    block: "Murhu",
    teachers: [
      {
        id: "TCH-201-01",
        name: "Savita Munda (सविता मुंडा)",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        assignedClass: "कक्षा 2 (Grade 2)",
        subject: "गणित (Mathematics)",
        primaryTribalLang: "ho",
        pin: "3214"
      },
      {
        id: "TCH-201-02",
        name: "Birsa Hansda (बिरसा हांसदा)",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
        assignedClass: "कक्षा 1 (Grade 1)",
        subject: "भाषा एवं साक्षरता (Hindi FLN)",
        primaryTribalLang: "ho",
        pin: "1234"
      },
      {
        id: "TCH-201-03",
        name: "Anjali Soren (अंजलि सोरेन)",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
        assignedClass: "कक्षा 3 (Grade 3)",
        subject: "पर्यावरण अध्ययन (EVS)",
        primaryTribalLang: "santhali",
        pin: "4321"
      }
    ]
  },
  {
    udiseCode: "20180400512",
    name: "Govt. Tribal Primary School, Dumka",
    district: "Dumka",
    block: "Dumka Sadar",
    teachers: [
      {
        id: "TCH-512-01",
        name: "Rameshwar Murmu (रामेश्वर मुर्मू)",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        assignedClass: "कक्षा 2 (Grade 2)",
        subject: "गणित (Mathematics)",
        primaryTribalLang: "santhali",
        pin: "1111"
      },
      {
        id: "TCH-512-02",
        name: "Sunita Tudu (सुनीता टुडू)",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        assignedClass: "कक्षा 4 (Grade 4)",
        subject: "भाषा एवं साक्षरता (Hindi FLN)",
        primaryTribalLang: "santhali",
        pin: "2222"
      }
    ]
  }
];
