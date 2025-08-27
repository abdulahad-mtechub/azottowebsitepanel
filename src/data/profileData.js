const profiletabData = {
  Seller: [
    { key: 'sellerdashboard', label: 'Dashboard' },
    {
      key: 'sellerlist',
      label: 'My Listing',
      children: [
        { key: 'sellerBusiness', label: 'All Businesses' },
        { key: 'sellerSoldBusiness', label: 'Sold Businesses' },
      ],
    },
    {
      key: 'sellermeeting',
      label: 'Meetings (10)',
      //Meeting(10)
    },
    { key: 'sellerdeals', label: 'Deals' },
    { key: 'selleralert', label: 'Alerts' },
    { key: 'sellerwallet', label: 'Wallet' },
  ],
  Buyer: [
    { key: 'buyerdashboard', label: 'Dashboard' },
    { key: 'buyeroffers', label: 'Offers' },
    { key: 'buyermeeting', label: 'Meetings' },
    { key: 'buyerdeals', label: 'Deals' },
    { key: 'buyerfavlist', label: 'Favorite Listing' },
    { key: 'buyeralert', label: 'Alerts' },
  ],
};

const profilestatisticsData = [
    {
        id:1,
        img:'/assets/icons/total-view.png',
        title:'Total Views',
        numbers:'10,240'
    },
    {
        id:2,
        img:'/assets/icons/list-business.png',
        title:'Number of Listed Businesses',
        numbers:'12'
    },
    {
        id:3,
        img:'/assets/icons/offer-recieved.png',
        title:'Offers Received',
        numbers:'8'
    },
     {
        id:4,
        img:'/assets/icons/offer-recieved.png',
        title:'Pending Meeting Requests',
        numbers:'8'
    },
    {
        id:5,
        img:'/assets/icons/schedule-meeting.png',
        title:'Schedule Meetings',
        numbers:'10'
    },
    {
        id:6,
        img:'/assets/icons/c-2.png',
        title:'Finalized Deals',
        numbers:'2'
    }
]

const buyerdashboard = [
  {
    title:'Email',
    desc:'abc@gmail.com'
  },
  {
    title:'Phone Number',
    desc:'1234 93734 568'
  },
  {
    title:'City',
    desc:'Makkah'
  },
  {
    title:'District',
    desc:'Makkah District'
  },
  {
    title:'National ID / Passport',
    desc:[
      '/assets/images/idcardback.png',
      '/assets/images/idcardfront.png'
    ]
  },
]

const buyerdashstatistic = [
    {
      id:1,
      img:'/assets/icons/favorite.png',
      title:'Favorite Listing',
      numbers:'18'
    },
    {
      id:2,
      img:'/assets/icons/schedule-meeting.png',
      title:'Schedule Meeting',
      numbers:'10'
    },
    {
      id:3,
      img:'/assets/icons/c-2.png',
      title:'Finalized Deals',
      numbers:'8'
    },
]

const offerData = [
  {
    key: '1',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    businessprice:'20,000',
    offerprice:'20,000',
    status:'Received',
    date:'21-04-2025 8:00 PM',
  },
  {
    key: '2',
    title:'Al Riyadh Tea Shop',
    sellername:'Aayid********',
    businessprice:'20,000',
    offerprice:'20,000',
    status:'Inactive',
    date:'21-04-2025 8:00 PM',
  },
  {
    key: '3',
    title:'Al Makkah Coffee Shop',
    sellername:'Aayid********',
    businessprice:'20,000',
    offerprice:'20,000',
    status:'Send',
    date:'21-04-2025 8:00 PM',
  }
]

const adminsechedulingData = [
  {
    key: '1',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    businessprice:'20,000',
    offerprice:'20,000',
    prefereddatetime:'21-04-2025 8:00 PM',
  },
  {
    key: '2',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    businessprice:'20,000',
    offerprice:'20,000',
    prefereddatetime:'21-04-2025 8:00 PM',
  },
  {
    key: '3',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    businessprice:'20,000',
    offerprice:'20,000',
    prefereddatetime:'21-04-2025 8:00 PM',
  }
]

const scheduledData = [
  {
    key: '1',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    scheduledatetime:'21-04-2025 8:00 PM',
    businessprice:'20,000',
    offerprice:'20,000',
    meetinglink:'https://meet.google.com',
  },
  {
    key: '2',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    scheduledatetime:'21-04-2025 9:00 PM',
    businessprice:'20,000',
    offerprice:'20,000',
    meetinglink:'https://meet.google.com',
  },
  {
    key: '3',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    scheduledatetime:'21-04-2025 10:00 PM',
    businessprice:'20,000',
    offerprice:'20,000',
    meetinglink:'https://meet.google.com',
  },
  {
    key: '4',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    scheduledatetime:'21-04-2025 11:00 PM',
    businessprice:'20,000',
    offerprice:'20,000',
    meetinglink:'https://meet.google.com',
  },
  {
    key: '5',
    title:'Al Madinah Coffee Shop',
    sellername:'Aayid********',
    scheduledatetime:'21-04-2025 12:00 PM',
    businessprice:'20,000',
    offerprice:'20,000',
    meetinglink:'https://meet.google.com',
  }
]

const buyerdealsData = [
  {
    title:'Seller Name',
    desc:'Furqaan Azeem'
  },
  {
    title:'Buyer Name',
    desc:'Ali Haider'
  },
  {
    title:'Finalized Offer',
    desc:'SAR 23,000'
  },
  {
    title:'Status',
    desc:'In-progress'
  },
]

const comdealsData = [
  {
    title:'Seller Name',
    desc:'Furqaan Azeem'
  },
  {
    title:'Buyer Name',
    desc:'Ali Haider'
  },
  {
    title:'Finalized Offer',
    desc:'SAR 23,000'
  },
  {
    title:'Status',
    desc:'Completed'
  },
]

const paycommissionData = [
  {
    title:'Jusoor Bank Name',
    desc:'Al Rajhi Bank'
  },
  {
    title:'IBAN Number',
    desc:'SA1234 5678 9012 3456 7890'
  },
  {
    title:'Commission Amount to Pay',
    desc:'SAR 1,200'
  },
]

const paybusinessData = [
  {
    title:'Seller’s Bank Name',
    desc:'Al Rajhi Bank'
  },
  {
    title:'Seller’s IBAN',
    desc:'SA1234 5678 9012 3456 7890'
  },
  {
    title:'Account Holder Name',
    desc:'Faizaan Ali'
  },
  {
    title:'Amount to Pay',
    desc:'SAR 80,000'
  },
]

export {profiletabData, profilestatisticsData, buyerdashboard,buyerdashstatistic,offerData, adminsechedulingData, scheduledData, buyerdealsData, paycommissionData, paybusinessData, comdealsData }