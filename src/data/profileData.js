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

export { profiletabData, offerData, adminsechedulingData, scheduledData };
