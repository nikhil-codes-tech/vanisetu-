import { DistrictData } from '../types/models';

export const MOCK_DISTRICTS: DistrictData[] = [
  {
    id: 'khunti',
    name: 'खूंटी (Khunti)',
    primaryLanguage: 'mundari',
    schools: [
      {
        udiseCode: '20190104201',
        name: 'राजकीय उत्क्रमित प्राथमिक विद्यालय, तोरपा',
        district: 'खूंटी',
        block: 'तोरपा (Torpa)',
        teachers: ['सुनील मुंडा (TCH-JH-0182)', 'अनिता मुंडू (TCH-JH-0491)', 'बिरसा टोपनो (TCH-JH-0832)'],
      },
      {
        udiseCode: '20190108902',
        name: 'प्राथमिक विद्यालय, मुरहू',
        district: 'खूंटी',
        block: 'मुरहू (Murhu)',
        teachers: ['रोशन पूर्ति (TCH-JH-1120)', 'सुशीला हेम्ब्रोम (TCH-JH-1594)'],
      },
    ],
  },
  {
    id: 'ranchi',
    name: 'राँची (Ranchi)',
    primaryLanguage: 'mundari',
    schools: [
      {
        udiseCode: '20200501103',
        name: 'राजकीय प्राथमिक विद्यालय, अनगड़ा',
        district: 'राँची',
        block: 'अनगड़ा (Angara)',
        teachers: ['अशोक बेक (TCH-JH-2201)', 'रीता कुजूर (TCH-JH-2940)', 'प्रभात केरकेट्टा (TCH-JH-3104)'],
      },
      {
        udiseCode: '20200508804',
        name: 'उत्क्रमित मध्य विद्यालय, बुंडू',
        district: 'राँची',
        block: 'बुंडू (Bundu)',
        teachers: ['संजय मुंडा (TCH-JH-3550)', 'विमला कुमारी (TCH-JH-3882)'],
      },
    ],
  },
  {
    id: 'west_singhbhum',
    name: 'प. सिंहभूम (West Singhbhum)',
    primaryLanguage: 'ho',
    schools: [
      {
        udiseCode: '20210302205',
        name: 'राजकीय प्राथमिक विद्यालय, चाईबासा',
        district: 'प. सिंहभूम',
        block: 'चाईबासा (Chaibasa)',
        teachers: ['लखन हो (TCH-JH-4102)', 'सोमाय बोयपाई (TCH-JH-4481)', 'मालती बानरा (TCH-JH-4920)'],
      },
      {
        udiseCode: '20210309906',
        name: 'उत्क्रमित प्राथमिक विद्यालय, चक्रधरपुर',
        district: 'प. सिंहभूम',
        block: 'चक्रधरपुर (Chakradharpur)',
        teachers: ['गौतम सामड (TCH-JH-5120)', 'सोनिया गगराई (TCH-JH-5541)'],
      },
    ],
  },
  {
    id: 'dumka',
    name: 'दुमका (Dumka - Santhal Pargana)',
    primaryLanguage: 'santhali',
    schools: [
      {
        udiseCode: '20220801207',
        name: 'राजकीय प्राथमिक विद्यालय, शिकारीपाड़ा',
        district: 'दुमका',
        block: 'शिकारीपाड़ा (Shikaripara)',
        teachers: ['शिबू सोरेन (TCH-JH-6190)', 'मारंग टुडू (TCH-JH-6421)', 'बहामुनी मुर्मू (TCH-JH-6880)'],
      },
      {
        udiseCode: '20220804508',
        name: 'उत्क्रमित मध्य विद्यालय, रानीश्वर',
        district: 'दुमका',
        block: 'रानीश्वर (Ranishwar)',
        teachers: ['सुभाष हेंब्रम (TCH-JH-7201)', 'पार्वती बेसरा (TCH-JH-7540)'],
      },
    ],
  },
];
