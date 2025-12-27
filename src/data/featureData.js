const browsetypeData = [
  {
    id: 1,
    icons: "/assets/icons/restaurant.png",
    title: "Restaurants & Cafes",
    description: "Coffee shops, fast food, fine dining.",
  },
  {
    id: 2,
    icons: "/assets/icons/estate.png",
    title: "Real Estate & Construction",
    description: "Small real estate firms",
  },
  {
    id: 3,
    icons: "/assets/icons/retail.png",
    title: "Retail Services",
    description: "Grocery, clothing, electronics.",
  },
  {
    id: 4,
    icons: "/assets/icons/gym.png",
    title: "Health, Beauty & Fitness",
    description: "Gym studios, personal training spaces.",
  },
  {
    id: 5,
    icons: "/assets/icons/industrial.png",
    title: "Digital Businesses",
    description: "E-commerce (Online Store)",
  },
  {
    id: 6,
    icons: "/assets/icons/tech.png",
    title: "Tech & Software",
    description: "SaaS, app development, online platforms.",
  },
  {
    id: 7,
    icons: "/assets/icons/edu.png",
    title: "Education Services",
    description: "Tuition academies, language institutes.",
  },
  {
    id: 8,
    icons: "/assets/icons/ind.png",
    title: "Industrial Businesses",
    description: "Manufacturing units, factories",
  },
];

const footerlinkData = [
  {
    id: 1,
    title: "Categories",
    links: [
      {
        id: 1,
        name: "Restaurants & Cafes",
        path: "/businesslisting",
      },
      {
        id: 2,
        name: "Retail Services",
        path: "/businesslisting",
      },
      {
        id: 3,
        name: "Health, Beauty & Fitness",
        path: "/businesslisting",
      },
      {
        id: 4,
        name: "Automotive, Transportation & Logistics",
        path: "/businesslisting",
      },
      {
        id: 5,
        name: "Tech & Software",
        path: "/businesslisting",
      },
      // {
      //     id: 6,
      //     name: 'Digital Businesses',
      //     path: '/businesslisting'
      // },
      // {
      //     id: 7,
      //     name: 'Education Services',
      //     path: '/businesslisting'
      // },
      // {
      //     id: 8,
      //     name: 'Consulting & Professional Services',
      //     path: '/businesslisting'
      // },
      // {
      //     id: 9,
      //     name: 'Real Estate & Construction',
      //     path: '/businesslisting'
      // },
      // {
      //     id: 10,
      //     name: 'Industrial Businesses',
      //     path: '/businesslisting'
      // },
      // {
      //     id: 11,
      //     name: 'All',
      //     path: '/businesslisting'
      // },
    ],
  },
  {
    id: 1,
    title: "Quick Link",
    links: [
      {
        id: 1,
        name: "About Jusoor",
        path: "/about",
      },
      {
        id: 2,
        name: "FAQs",
        path: "/faq",
      },
      {
        id: 3,
        name: "Term of Use",
        path: "/termofuse",
      },
      {
        id: 4,
        name: "Articles",
        path: "/article",
      },
    ],
  },
];

const businessmenuData = [
  {
    id: 1,
    icon: "/assets/icons/m-1.png",
    title: "Browse by Categories",
    subtitle: "Choose from popular business types.",
    subdropdown: [
      {
        id: 1,
        title: "Restaurants & Cafes",
        path: "/businesslisting?category=Restaurants & Cafes",
      },
      {
        id: 2,
        title: "Retail Services",
        path: "/businesslisting?category=Retail Services",
      },
      {
        id: 3,
        title: "Health, Beauty & Fitness",
        path: "/businesslisting?category=Health, Beauty & Fitness",
      },
      {
        id: 4,
        title: "Automotive, Transportation & Logistics",
        path: "/businesslisting?category=Automotive, Transportation & Logistics",
      },
      {
        id: 5,
        title: "Tech & Software",
        path: "/businesslisting?category=Tech & Software",
      },
      {
        id: 6,
        title: "Digital Businesses",
        path: "/businesslisting?category=Digital Businesses",
      },
      {
        id: 7,
        title: "Education Services",
        path: "/businesslisting?category=Education Services",
      },
      {
        id: 8,
        title: "Consulting & Professional Services",
        path: "/businesslisting?category=Consulting & Professional Services",
      },
      {
        id: 9,
        title: "Real Estate & Construction",
        path: "/businesslisting?category=Real Estate & Construction",
      },
      {
        id: 10,
        title: "Industrial Businesses",
        path: "/businesslisting?category=Industrial Businesses",
      },
    ],
  },
  // {
  //     id: 2,
  //     icon: '/assets/icons/m-2.png',
  //     title: 'Browse by Location',
  //     subtitle: 'Find businesses in your city.',
  //     subdropdown: [
  //         { id: 1, title: 'Riyadh', path: '/businesslisting?city=Riyadh' },
  //         { id: 2, title: 'Jeddah', path: '/businesslisting?city=Jeddah' },
  //         { id: 3, title: 'Makkah', path: '/businesslisting?city=Makkah' },
  //         { id: 4, title: 'Madinah', path: '/businesslisting?city=Madinah' },
  //         { id: 5, title: 'Dammam', path: '/businesslisting?city=Dammam' },
  //         { id: 6, title: 'Khobar', path: '/businesslisting?city=Khobar' },
  //         { id: 7, title: 'Dhahran', path: '/businesslisting?city=Dhahran' },
  //         { id: 8, title: 'Abha', path: '/businesslisting?city=Abha' },
  //         { id: 9, title: 'Khamis Mushait', path: '/businesslisting?city=Khamis Mushait' },
  //         { id: 10, title: 'Tabuk', path: '/businesslisting?city=Tabuk' },
  //         { id: 11, title: 'Hail', path: '/businesslisting?city=Hail' },
  //         { id: 12, title: 'Jazan', path: '/businesslisting?city=Jazan' },
  //         { id: 13, title: 'Sakaka', path: '/businesslisting?city=Sakaka' },
  //         { id: 14, title: 'Al Bahah', path: '/businesslisting?city=Al Bahah' },
  //         { id: 15, title: 'Najran', path: '/businesslisting?city=Najran' },
  //         { id: 16, title: 'Arar', path: '/businesslisting?city=Arar' },
  //         { id: 17, title: 'Buraydah', path: '/businesslisting?city=Buraydah' },
  //         { id: 18, title: 'Yanbu', path: '/businesslisting?city=Yanbu' },
  //         { id: 19, title: 'Al Majmaah', path: '/businesslisting?city=Al Majmaah' },
  //         { id: 20, title: 'Al Qatif', path: '/businesslisting?city=Al Qatif' },
  //     ]
  // },
  {
    id: 3,
    icon: "/assets/icons/m-3.png",
    title: "Browse by Revenue",
    subtitle: "Filter by business earnings.",
    subdropdown: [
      {
        id: 1,
        title: "SAR 0 - SAR 10,000",
        path: "/businesslisting?revenue=0,10000",
      },
      {
        id: 2,
        title: "SAR 10,000 - SAR 30,000",
        path: "/businesslisting?revenue=10000,30000",
      },
      {
        id: 3,
        title: "SAR 30,000 - SAR 60,000",
        path: "/businesslisting?revenue=30000,60000",
      },
      {
        id: 4,
        title: "SAR 60,000 - SAR 100,000",
        path: "/businesslisting?revenue=60000,100000",
      },
      {
        id: 5,
        title: "SAR 100,000 - SAR 150,000",
        path: "/businesslisting?revenue=100000,150000",
      },
      {
        id: 6,
        title: "SAR 150,000+",
        path: "/businesslisting?revenue=150000,9999999",
      },
    ],
  },

  // {
  //     id: 4,
  //     icon: '/assets/icons/m-4.png',
  //     title: 'Browse by Profit',
  //     subtitle: 'Explore based on profit margin.',
  //     subdropdown: [
  //         { id: 1, title: 'SAR 0 - SAR 1000', path: '/businesslisting?profit=0,1000' },
  //         { id: 2, title: 'SAR 1000 - SAR 5000', path: '/businesslisting?profit=1000,5000' },
  //         { id: 3, title: 'SAR 5000 - SAR 10,000', path: '/businesslisting?profit=5000,10000' },
  //         { id: 4, title: 'SAR 10,000 - SAR 30,000', path: '/businesslisting?profit=10000,30000' },
  //         { id: 5, title: 'SAR 30,000 - SAR 50,000', path: '/businesslisting?profit=30000,50000' },
  //         { id: 6, title: 'SAR 50,000+', path: '/businesslisting?profit=50000,9999999' },
  //     ]
  // },
];

const mobilemenuData = [
  {
    id: 1,
    name: "Browse Businesses",
    children: [
      {
        id: 1,
        name: "Browse by Categories",
        innerchildren: [
          {
            id: 1,
            title: "Restaurants & Cafes",
            path: "/businesslisting",
          },
          {
            id: 2,
            title: "Retail Stores",
            path: "/businesslisting",
          },
          {
            id: 3,
            title: "Salons & Beauty Centers",
            path: "/businesslisting",
          },
          {
            id: 4,
            title: "E-commerce Stores",
            path: "/businesslisting",
          },
          {
            id: 5,
            title: "Gyms & Fitness Centers",
            path: "/businesslisting",
          },
          {
            id: 6,
            title: "Automotive Services",
            path: "/businesslisting",
          },
          {
            id: 7,
            title: "Bakeries & Sweet Shops",
            path: "/businesslisting",
          },
          {
            id: 8,
            title: "Tech & Software Startups",
            path: "/businesslisting",
          },
          {
            id: 9,
            title: "Educational Centers",
            path: "/businesslisting",
          },
          {
            id: 10,
            title: "Pharmacies & Clinics",
            path: "/businesslisting",
          },
          {
            id: 11,
            title: "Printing & Stationery Shops",
            path: "/businesslisting",
          },
          {
            id: 12,
            title: "Pet Shops & Services",
            path: "/businesslisting",
          },
        ],
      },
      // {
      //     id: 2,
      //     name: 'Browse by Location',
      //     innerchildren:[
      //         {
      //             id: 1,
      //             title: 'Riyadh',
      //             path: '',
      //         },
      //         {
      //             id: 2,
      //             title: 'Makkah',
      //             path: '',
      //         },
      //         {
      //             id: 3,
      //             title: 'Eastern',
      //             path: '',
      //         },
      //         {
      //             id: 4,
      //             title: 'Al-Madinah',
      //             path: '',
      //         },
      //         {
      //             id: 5,
      //             title: 'Asir',
      //             path: '',
      //         },
      //         {
      //             id: 6,
      //             title: 'Tabuk',
      //             path: '',
      //         },
      //         {
      //             id: 7,
      //             title: 'Hail',
      //             path: '',
      //         },
      //         {
      //             id: 8,
      //             title: 'Al-Jouf',
      //             path: '',
      //         },
      //         {
      //             id: 9,
      //             title: 'Al-Bahah',
      //             path: '',
      //         },
      //         {
      //             id: 10,
      //             title: 'Jazan',
      //             path: '',
      //         },
      //         {
      //             id: 11,
      //             title: 'Najran',
      //             path: '',
      //         },
      //         {
      //             id: 12,
      //             title: 'Northern Borders',
      //             path: '',
      //         },
      //         {
      //             id: 13,
      //             title: 'Al-Qassim',
      //             path: '',
      //         },
      //     ]
      // },
      {
        id: 3,
        name: "Browse by Revenue",
        innerchildren: [
          {
            id: 1,
            title: "- 10 k",
            path: "",
          },
          {
            id: 2,
            title: "10k - 30k",
            path: "",
          },
          {
            id: 3,
            title: "30k - 60k",
            path: "",
          },
          {
            id: 4,
            title: "60k - 100k",
            path: "",
          },
          {
            id: 5,
            title: "100k - 150k",
            path: "",
          },
          {
            id: 6,
            title: "150k +",
            path: "",
          },
        ],
      },
      // {
      //     id: 4,
      //     name: 'Browse by Profilt',
      //     innerchildren:[
      //         {
      //             id: 1,
      //             title: '- 1k',
      //             path: '',
      //         },
      //         {
      //             id: 2,
      //             title: '1k - 5k',
      //             path: '',
      //         },
      //         {
      //             id: 3,
      //             title: '10k - 30k',
      //             path: '',
      //         },
      //         {
      //             id: 4,
      //             title: '30k - 50k',
      //             path: '',
      //         },
      //         {
      //             id: 5,
      //             title: '50k +',
      //             path: '',
      //         },
      //     ]
      // },
    ],
  },
  {
    id: 1,
    name: "Others",
    children: [
      {
        id: 1,
        name: "About Jusoor",
        Path: "/about",
      },
      {
        id: 2,
        name: "Term of Use",
        Path: "/termofuse",
      },
    ],
  },
];

export { browsetypeData, footerlinkData, businessmenuData, mobilemenuData };
