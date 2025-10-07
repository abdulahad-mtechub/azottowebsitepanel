import { Image, Tooltip } from "antd";
import { t } from "i18next";

const postsaleColumns = [
    { title: t('Support Period'), dataIndex: 'period' },
    { title: t('Number of Session'), dataIndex: 'session' },
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={t('Verified by Jusoor')}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt={t("verified icon")} />
                 </Tooltip>;
            } else {
                return null
            }
        },
    }
];

const liabColumn = [
    { title: t('Liability name'), dataIndex: 'name' },
    { title: t('Number of Items'), dataIndex: 'items' },
    { title: t('Purchase Year'), dataIndex: 'purchaseyear' },
    { title: t('Price'), dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.png" width={12} alt={t("currency-symbol")} fetchPriority="high" /> {price}</>},
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={t('Verified by Jusoor')}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt={t("verified icon")} />
                 </Tooltip>;
            } else {
                return null
            }
        },
    },
];

const keyassetsColumn = [
    { title: t('Asset name'), dataIndex: 'name' },
    { title: t('Number of Items'), dataIndex: 'items' },
    { title: t('Purchase Year'), dataIndex: 'purchaseyear' },
    { title: t('Price'), dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.png" width={12} alt={t("currency-symbol")} fetchPriority="high"/> {price}</>},
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={t('Verified by Jusoor')}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt={t("verified icon")} />
                 </Tooltip>;
            } else {
                return null
            }
        },
    }
];

const inventColumn = [
    { title: t('Inventory name'), dataIndex: 'name' },
    { title: t('Number of Items'), dataIndex: 'items' },
    { title: t('Purchase Year'), dataIndex: 'purchaseyear' },
    { title: t('Price'), dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.png" width={12} alt={t("currency-symbol")} fetchPriority="high" /> {price}</>},
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={t('Verified by Jusoor')}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt={t("verified icon")} />
                 </Tooltip>;
            } else {
                return null
            }
        },
    }
];

export { postsaleColumns, liabColumn, keyassetsColumn, inventColumn }
