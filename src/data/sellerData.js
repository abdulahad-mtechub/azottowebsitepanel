import { t } from "i18next";

const selleralertsData = [
  {
    key: '1',
    date: '02/07/2025',
    alertsdetails: [
      {
        key: '1',
        title: t('[Price] Counter offer'),
        desc: t('You received a counter offer of [Price] from [Buyer Name] for [Product Name].'),
        time: '11:05 AM',
      },
      {
        key: '2',
        title: t('[Price] proceed to Payment'),
        desc: t('You received a proceed to payment request from [Buyer Name] for [Product Name].'),
        time: '11:05 AM',
      },
      {
        key: '3',
        title: t('Commission Verified'),
        desc: t('Jasoor has verified your commission of [Price] for [Product Name].'),
        time: '11:05 AM',
      },
      {
        key: '4',
        title: t('Documents Uploaded'),
        desc: t('[Seller Name] has uploaded commercial contract & Transfer document for [Product Name].'),
        time: '11:05 AM',
      }
    ]
  },
  {
    key: '2',
    date: '02/07/2025',
    alertsdetails:[
      {
        key: '1',
        title: t('Meeting Request'),
        desc: t('You received a meeting request from [Seller Name] for [Product Name].'),
        time: '11:05 AM',
      },
      {
        key: '2',
        title: t('[Price] proceed to Payment'),
        desc: t('You received a proceed to payment request from [Buyer Name] for [Product Name].'),
        time: '11:05 AM',
      },
      {
        key: '3',
        title: t('Commission Verified'),
        desc: t('Jasoor has verified your commission of [Price] for [Product Name].'),
        time: '11:05 AM',
      },
      {
        key: '4',
        title: t('Documents Uploaded'),
        desc: t('[Seller Name] has uploaded commercial contract & Transfer document for [Product Name].'),
        time: '11:05 AM',
      }
    ]
  }
]

export { selleralertsData };
