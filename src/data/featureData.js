const featurecardData = [
    {
        id: 1,
        title: 'Smart Filters to Find the Right Business',
        img:'/assets/images/c-1.png'
    },
    {
        id: 2,
        title: 'Only Real, Verified Businesses',
        img:'/assets/images/c-2.png'
    },
    {
        id: 3,
        title: 'Clear Performance Stats for Every Business',
        img:'/assets/images/c-3.png'
    },
    {
        id: 4,
        title: 'Powerful Dashboard to Manage All Your Activity',
        img:'/assets/images/c-4.png'
    },
]

const exploreData = [
    {
        id: 1,
        ref:'12435',
        title:'Al Madinah Coffee Shop',
        description:'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        save: 'no',
        status: 'Sold',
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:'SAR 50,000',
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:'SAR 25,000',
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:'3.8 months',
                subdesc:'Capital Recovery',
            },
        ]
    },
    {
        id: 2,
        ref:'89002',
        title:'Al Madinah Coffee Shop',
        description:'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        save: 'yes',
        status: null,
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:'SAR 50,000',
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:'SAR 25,000',
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:'3.8 months',
                subdesc:'Capital Recovery',
            },
        ]
    },
    {
        id: 3,
        ref:'62990',
        title:'Al Madinah Coffee Shop',
        description:'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        save: 'no',
        status: 'Sold',
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:'SAR 50,000',
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:'SAR 25,000',
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:'3.8 months',
                subdesc:'Capital Recovery',
            },
        ]
    },
    {
        id: 4,
        ref:'36257',
        title:'Al Madinah Coffee Shop',
        description:'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        save: 'no',
        status: null,
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:'SAR 50,000',
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:'SAR 25,000',
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:'3.8 months',
                subdesc:'Capital Recovery',
            },
        ]
    },
    {
        id: 5,
        ref:'09182',
        title:'Al Madinah Coffee Shop',
        description:'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        save: 'no',
        status: null,
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:'SAR 50,000',
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:'SAR 25,000',
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:'3.8 months',
                subdesc:'Capital Recovery',
            },
        ]
    },
    {
        id: 6,
        ref:'23167',
        title:'Al Madinah Coffee Shop',
        description:'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        save: 'yes',
        status: null,
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:'SAR 50,000',
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:'SAR 25,000',
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:'3.8 months',
                subdesc:'Capital Recovery',
            },
        ]
    },
]

const browsetypeData = [
    {
        id: 1,
        icons: '/assets/icons/restaurant.png',
        title: 'Restaurants & Cafes',
        description: 'Coffee shops, fast food, fine dining.'
    },
    {
        id: 2,
        icons: '/assets/icons/estate.png',
        title: 'Real Estate & Construction',
        description: 'Small real estate firms'
    },
    {
        id: 3,
        icons: '/assets/icons/retail.png',
        title: 'Retail Services',
        description: 'Grocery, clothing, electronics.'
    },
    {
        id: 4,
        icons: '/assets/icons/gym.png',
        title: 'Health, Beauty & Fitness',
        description: 'Gym studios, personal training spaces.'
    },
    {
        id: 5,
        icons: '/assets/icons/industrial.png',
        title: 'Industrial Businesses',
        description: 'E-commerce (Online Store)'
    },
    {
        id: 6,
        icons: '/assets/icons/tech.png',
        title: 'Tech & Software',
        description: 'SaaS, app development, online platforms.'
    },
    {
        id: 7,
        icons: '/assets/icons/edu.png',
        title: 'Education Services',
        description: 'Tuition academies, language institutes.'
    },
    {
        id: 8,
        icons: '/assets/icons/ind.png',
        title: 'Industrial Businesses',
        description: 'Manufacturing units, factories'
    },
]

const footerlinkData = [
    {
        id: 1,
        title: 'Categories',
        links:[
            {
                id: 1,
                name: 'Automotive Services',
                path: ''
            },
            {
                id: 2,
                name: 'Bakeries & Sweet Shops',
                path: ''
            },
            {
                id: 3,
                name: 'Educational Centers',
                path: ''
            },
            {
                id: 4,
                name: 'Pharmacies & Clinics',
                path: ''
            },
        ]
    },
    {
        id: 1,
        title: 'Quick Link',
        links:[
            {
                id: 1,
                name: 'About Jusoor',
                path: '/about'
            },
            {
                id: 2,
                name: 'Q&A',
                path: '/faq'
            },
            {
                id: 3,
                name: 'Term of Use',
                path: '/termofuse'
            },
            {
                id: 4,
                name: 'Articles',
                path: '/article'
            },
        ]
    },
]

const businessmenuData = [
    {
        id: 1,
        icon: '/assets/icons/m-1.png',
        title: 'Browse Businesses by Categories',
        subtitle: 'Choose from popular business types.',
        subdropdown:[
            {
                id: 1,
                title: 'Restaurants & Cafes',
                path: '/businesslisting',
            },
            {
                id: 2,
                title: 'Retail Services',
                path: '/businesslisting',
            },
            {
                id: 3,
                title: 'Health, Beauty & Fitness',
                path: '/businesslisting',
            },
            {
                id: 4,
                title: 'Automotive, Transportation & Logistics',
                path: '/businesslisting',
            },
            {
                id: 5,
                title: 'Tech & Software',
                path: '/businesslisting',
            },
            {
                id: 6,
                title: 'Digital Businesses',
                path: '/businesslisting',
            },
            {
                id: 7,
                title: 'Education Services',
                path: '/businesslisting',
            },
            {
                id: 8,
                title: 'Consulting & Professional Services',
                path: '/businesslisting',
            },
            {
                id: 9,
                title: 'Real Estate & Construction',
                path: '/businesslisting',
            },
            {
                id: 10,
                title: 'Industrial Businesses',
                path: '/businesslisting',
            },
        ]
    },
    {
        id: 2,
        icon: '/assets/icons/m-2.png',
        title: 'Browse Businesses by Location',
        subtitle: 'Find businesses in your city.',
        subdropdown:[
            {
                id: 1,
                title: 'Riyadh',
                path: '',
            },
            {
                id: 2,
                title: 'Makkah',
                path: '',
            },
            {
                id: 3,
                title: 'Eastern',
                path: '',
            },
            {
                id: 4,
                title: 'Al-Madinah',
                path: '',
            },
            {
                id: 5,
                title: 'Asir',
                path: '',
            },
            {
                id: 6,
                title: 'Tabuk',
                path: '',
            },
            {
                id: 7,
                title: 'Hail',
                path: '',
            },
            {
                id: 8,
                title: 'Jazan',
                path: '',
            },
            {
                id: 9,
                title: 'Al-Jouf',
                path: '',
            },
            {
                id: 10,
                title: 'Al-Bahah',
                path: '',
            },
            {
                id: 11,
                title: 'Najran',
                path: '',
            },
            {
                id: 12,
                title: 'Northern Borders',
                path: '',
            },
            {
                id: 13,
                title: 'Al-Qassim',
                path: '',
            },
        ]
    },
    {
        id: 3,
        icon: '/assets/icons/m-3.png',
        title: 'Browse Businesses by Revenue',
        subtitle: 'Filter by business earnings.',
        subdropdown:[
            {
                id: 1,
                title: 'SAR 0 - SAR 10,000',
                path: '',
            },
            {
                id: 2,
                title: 'SAR 10,000 - SAR 30,000',
                path: '',
            },
            {
                id: 3,
                title: 'SAR 30,000 - SAR 60,000',
                path: '',
            },
            {
                id: 4,
                title: 'SAR 60,000 - SAR 100,000',
                path: '',
            },
            {
                id: 5,
                title: 'SAR 100,000 - SAR 150,000',
                path: '',
            },
            {
                id: 6,
                title: 'SAR 150,000+',
                path: ''
            }
        ]
    },

    {
        id: 4,
        icon: '/assets/icons/m-4.png',
        title: 'Browse Businesses by Profilt',
        subtitle: 'Explore based on profit margin.',
        subdropdown:[
            {
                id: 1,
                title: 'SAR 0 - SAR 1000',
                path: '',
            },
            {
                id: 2,
                title: 'SAR 1000 - SAR 5000',
                path: '',
            },
            {
                id: 3,
                title: 'SAR 5000 - SAR 10,000',
                path: '',
            },
            {
                id: 4,
                title: 'SAR 10,000 - SAR 30,000',
                path: '',
            },
            {
                id: 5,
                title: 'SAR 30,000 - SAR 50,000',
                path: '',
            },
            {
                id: 6,
                title: 'SAR 50,000+',
                path: '',
            },
        ]
    },
]

const othersmenu = [
    {
        id: 1,
        icon: '/assets/icons/ab.png',
        title: 'About Jusoor',
        subtitle: 'Choose from popular business types.',
        path:'/about'
    },
    {
        id: 2,
        icon: '/assets/icons/fq.png',
        title: 'Q&A',
        subtitle: 'Find businesses in your city.',
        path:'/faq'
    },
    {
        id: 3,
        icon: '/assets/icons/tu.png',
        title: 'Term of Use',
        subtitle: 'Explore based on profit margin.',
        path:'/termofuse'
    },
    {
        id: 4,
        icon: '/assets/icons/art.png',
        title: 'Articles',
        subtitle: 'Filter by business earnings.',
        path:'/article'
    },
]


const mobilemenuData = [
    {
        id: 1,
        name: 'Browse Businesses',
        children:[
            {
                id: 1,
                name: 'Browse Businesses by Categories',
                innerchildren:[
                    {
                        id: 1,
                        title: 'Restaurants & Cafes',
                        path: '/businesslisting',
                    },
                    {
                        id: 2,
                        title: 'Retail Stores',
                        path: '/businesslisting',
                    },
                    {
                        id: 3,
                        title: 'Salons & Beauty Centers',
                        path: '/businesslisting',
                    },
                    {
                        id: 4,
                        title: 'E-commerce Stores',
                        path: '/businesslisting',
                    },
                    {
                        id: 5,
                        title: 'Gyms & Fitness Centers',
                        path: '/businesslisting',
                    },
                    {
                        id: 6,
                        title: 'Automotive Services',
                        path: '/businesslisting',
                    },
                    {
                        id: 7,
                        title: 'Bakeries & Sweet Shops',
                        path: '/businesslisting',
                    },
                    {
                        id: 8,
                        title: 'Tech & Software Startups',
                        path: '/businesslisting',
                    },
                    {
                        id: 9,
                        title: 'Educational Centers',
                        path: '/businesslisting',
                    },
                    {
                        id: 10,
                        title: 'Pharmacies & Clinics',
                        path: '/businesslisting',
                    },
                    {
                        id: 11,
                        title: 'Printing & Stationery Shops',
                        path: '/businesslisting',
                    },
                    {
                        id: 12,
                        title: 'Pet Shops & Services',
                        path: '/businesslisting',
                    },
                ]
            },
            {
                id: 2,
                name: 'Browse Businesses by Location',
                innerchildren:[
                    {
                        id: 1,
                        title: 'Riyadh',
                        path: '',
                    },
                    {
                        id: 2,
                        title: 'Makkah',
                        path: '',
                    },
                    {
                        id: 3,
                        title: 'Eastern',
                        path: '',
                    },
                    {
                        id: 4,
                        title: 'Al-Madinah',
                        path: '',
                    },
                    {
                        id: 5,
                        title: 'Asir',
                        path: '',
                    },
                    {
                        id: 6,
                        title: 'Tabuk',
                        path: '',
                    },
                    {
                        id: 7,
                        title: 'Hail',
                        path: '',
                    },
                    {
                        id: 8,
                        title: 'Al-Jouf',
                        path: '',
                    },
                    {
                        id: 9,
                        title: 'Al-Bahah',
                        path: '',
                    },
                    {
                        id: 10,
                        title: 'Jazan',
                        path: '',
                    },
                    {
                        id: 11,
                        title: 'Najran',
                        path: '',
                    },
                    {
                        id: 12,
                        title: 'Northern Borders',
                        path: '',
                    },
                    {
                        id: 13,
                        title: 'Al-Qassim',
                        path: '',
                    },
                ]
            },
            {
                id: 3,
                name: 'Browse Businesses by Revenue',
                innerchildren:[
                    {
                        id: 1,
                        title: '- 10 k',
                        path: '',
                    },
                    {
                        id: 2,
                        title: '10k - 30k',
                        path: '',
                    },
                    {
                        id: 3,
                        title: '30k - 60k',
                        path: '',
                    },
                    {
                        id: 4,
                        title: '60k - 100k',
                        path: '',
                    },
                    {
                        id: 5,
                        title: '100k - 150k',
                        path: '',
                    },
                    {
                        id: 6,
                        title: '150k +',
                        path: ''
                    }
                ]
            },
            {
                id: 4,
                name: 'Browse Businesses by Profilt',
                innerchildren:[
                    {
                        id: 1,
                        title: '- 1k',
                        path: '',
                    },
                    {
                        id: 2,
                        title: '1k - 5k',
                        path: '',
                    },
                    {
                        id: 3,
                        title: '10k - 30k',
                        path: '',
                    },
                    {
                        id: 4,
                        title: '30k - 50k',
                        path: '',
                    },
                    {
                        id: 5,
                        title: '50k +',
                        path: '',
                    },
                ]
            },
        ]
    },
    {
        id: 1,
        name: 'Others',
        children:[
            {
                id: 1,
                name: 'About Jusoor',
                Path: '/about'
            },
            {
                id: 2,
                name: 'Q&A',
                Path: '/faq'
            },
            {
                id: 3,
                name: 'Term of Use',
                Path: '/termofuse'
            },
            {
                id: 4,
                name: 'Articles',
                Path: '/article'
            },
        ]
    }
]

export { featurecardData, exploreData, browsetypeData, footerlinkData, businessmenuData, mobilemenuData, othersmenu }