const sendrequestData = [
  {
    key: '1',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    requesteddate: '21-04-2025 8:00 PM',
  },
  {
    key: '2',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    requesteddate: '21-04-2025 8:00 PM',
  },
  {
    key: '3',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    requesteddate: '21-04-2025 8:00 PM',
  }
]

const selleradminsechedulingData = [
  {
    key: '1',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    prefereddatetime: '21-04-2025 8:00 PM',
  },
  {
    key: '2',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    prefereddatetime: '21-04-2025 8:00 PM',
  },
  {
    key: '3',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    prefereddatetime: '21-04-2025 8:00 PM',
  }
]

const sellerrecievedrequestData = [
  {
    key: '1',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    status: 'Received',
    date: '21-04-2025 8:00 PM',
  },
  {
    key: '2',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    status: 'Inactive',
    date: '21-04-2025 8:00 PM',
  },
  {
    key: '3',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    businessprice: '20,000',
    offerprice: '20,000',
    status: 'Send',
    date: '21-04-2025 8:00 PM',
  }
]

const sellerscheduledData = [
  {
    key: '1',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    scheduledatetime: '21-04-2025 8:00 PM',
    businessprice: '20,000',
    offerprice: '20,000',
    meetinglink: 'https://meet.google.com',
  },
  {
    key: '2',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    scheduledatetime: '21-04-2025 9:00 PM',
    businessprice: '20,000',
    offerprice: '20,000',
    meetinglink: 'https://meet.google.com',
  },
  {
    key: '3',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    scheduledatetime: '21-04-2025 10:00 PM',
    businessprice: '20,000',
    offerprice: '20,000',
    meetinglink: 'https://meet.google.com',
  },
  {
    key: '4',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    scheduledatetime: '21-04-2025 11:00 PM',
    businessprice: '20,000',
    offerprice: '20,000',
    meetinglink: 'https://meet.google.com',
  },
  {
    key: '5',
    title: 'Al Madinah Coffee Shop',
    buyername: 'Aayid********',
    scheduledatetime: '21-04-2025 12:00 PM',
    businessprice: '20,000',
    offerprice: '20,000',
    meetinglink: 'https://meet.google.com',
  }
]

const selleralertsData = [
  {
      key: '1',
      date: '02/07/2025',
      alertsdetails: [
        {
          key: '1',
          title: '[Price] Counter offer',
          desc: 'You received a counter offer of [Price] from [Buyer Name] for [Product Name].',
          time: ' 11:05 AM',
        },
        {
          key: '2',
          title: '[Price] proceed to Payment',
          desc: 'You received a proceed to payment request from [Buyer Name] for [Product Name].',
          time: ' 11:05 AM',
        },
        {
          key: '3',
          title: 'Commission Verified',
          desc: 'Jasoor has verified your commission of [Price]  for [Product Name].',
          time: ' 11:05 AM',
        },
        {
          key: '4',
          title: 'Documents Uploaded',
          desc: '[Seller Name] has uploaded commercial contract & Transfer document   for [Product Name].',
          time: ' 11:05 AM',
        }
      ]
    },
    {
      key: '2',
      date: '02/07/2025',
      alertsdetails:[
        {
          key: '1',
          title: 'Meeting Request',
          desc: 'You received a meeting request from [Seller Name] for [Product Name].',
          time: ' 11:05 AM',
        },
        {
          key: '2',
          title: '[Price] proceed to Payment',
          desc: 'You received a proceed to payment request from [Buyer Name] for [Product Name].',
          time: ' 11:05 AM',
        },
        {
          key: '3',
          title: 'Commission Verified',
          desc: 'Jasoor has verified your commission of [Price]  for [Product Name].',
          time: ' 11:05 AM',
        },
        {
          key: '4',
          title: 'Documents Uploaded',
          desc: '[Seller Name] has uploaded commercial contract & Transfer document   for [Product Name].',
          time: ' 11:05 AM',
        }
      ]
    }
]

export { sendrequestData, selleradminsechedulingData, sellerrecievedrequestData, sellerscheduledData ,selleralertsData}