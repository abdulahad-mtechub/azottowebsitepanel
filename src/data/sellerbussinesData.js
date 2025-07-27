

const allbussinesData = [
    {
        id: 1,
        ref: '12435',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Active',
        type: 'Taqbeel',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ],
        detailinfo: [
            {
                id: 1,
                img: '/assets/icons/total-view.png',
                title: 'Total Views',
                numbers: '10,240'
            },
            {
                id: 2,
                img: '/assets/icons/list-business.png',
                title: 'Number of Offers',
                numbers: '240'
            },
            {
                id: 3,
                img: '/assets/icons/favorite.png',
                title: 'Number of Favorites',
                numbers: '23'
            },
        ],
        offerData: [
            {
                key: '1',
                buyername: 'Aayid********',
                businessprice: 'Sar 20,000',
                offerprice: {
                    amount: '20000',
                    type: 'CO'
                },
                status: 'Received',
                date: '21-04-2025 8:00 PM',
            },
            {
                key: '2',
                buyername: 'Aayid********',
                businessprice: 'Sar 20,000',
                offerprice: {
                    amount: '20000',
                    type: 'CO'
                },
                status: 'Inactive',
                date: '21-04-2025 8:00 PM',
            },
            {
                key: '3',
                buyername: 'Aayid********',
                businessprice: 'Sar 20,000',
                offerprice: {
                    amount: '20000',
                    type: 'PP'
                },
                status: 'Send',
                date: '21-04-2025 8:00 PM',
            }
        ]
    },
    {
        id: 2,
        ref: '89002',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Inactive',
        type: 'Acquiring',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 3,
        ref: '62990',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Under-review',
        type: 'Taqbeel',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 4,
        ref: '36257',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Active',
        type: 'Acquiring',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 5,
        ref: '09182',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Inactive',
        type: 'Taqbeel',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 6,
        ref: '23167',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Under-review',
        type: 'Acquiring',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ],
    },
]

const soldbussinesData = [
    {
        id: 1,
        ref: '12435',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Sold',
        type: 'Taqbeel',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 2,
        ref: '89002',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Sold',
        type: 'Acquiring',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 3,
        ref: '62990',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Sold',
        type: 'Taqbeel',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 4,
        ref: '36257',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Sold',
        type: 'Acquiring',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 5,
        ref: '09182',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Sold',
        type: 'Taqbeel',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
    {
        id: 6,
        ref: '23167',
        title: 'Al Madinah Coffee Shop',
        description: 'A popular neighborhood café located in Al-Malaz with a steady flow of daily customers. Fully operational, profitable, and ideal',
        amount: '950,00',
        status: 'Sold',
        type: 'Acquiring',
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: 'SAR 50,000',
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: 'SAR 25,000',
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: '3.8 months',
                subdesc: 'Capital Recovery',
            },
        ]
    },
]

export { allbussinesData, soldbussinesData }