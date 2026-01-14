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

export { footerlinkData, businessmenuData, mobilemenuData };
