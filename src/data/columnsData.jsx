import { Image, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;
const usePostsaleColumns = () => {
    const { t } = useTranslation();

    const postsaleColumns = [
        {  
            title: t('Support Period'), 
            dataIndex: 'period',
            render: (period) => (
                <Text>{period ? <>{`${period} Months`}</> : "-"}</Text>
            )
        },
        { 
            title: t('Number of Session'), 
            dataIndex: 'Session',
            render: (session) => (
                <Text>{session ? <>{`${session} sessions`}</> : "-"}</Text>
            )
        },
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

    return postsaleColumns;
};

const useLiabColumn = () => {
    const { t } = useTranslation();

    const liabColumn = [
        { title: t('Liability name'), dataIndex: 'name' },
        { title: t('Number of Items'), dataIndex: 'items' },
        { title: t('Purchase Year'), dataIndex: 'purchaseyear' },
        { title: t('Price'), dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.webp" width={12} alt={t("currency-symbol")} fetchPriority="high" /> {price}</>},
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

    return liabColumn;
};

const useKeyassetsColumn = () => {
    const { t } = useTranslation();

    const keyassetsColumn = [
        { title: t('Asset name'), dataIndex: 'name' },
        { title: t('Number of Items'), dataIndex: 'items' },
        { title: t('Purchase Year'), dataIndex: 'purchaseyear' },
        { title: t('Price'), dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.webp" width={12} alt={t("currency-symbol")} fetchPriority="high"/> {price}</>},
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

    return keyassetsColumn;
};

const useInventColumn = () => {
    const { t } = useTranslation();

    const inventColumn = [
        { title: t('Inventory name'), dataIndex: 'name' },
        { title: t('Number of Items'), dataIndex: 'items' },
        { title: t('Purchase Year'), dataIndex: 'purchaseyear' },
        { title: t('Price'), dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.webp" width={12} alt={t("currency-symbol")} fetchPriority="high" /> {price}</>},
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

    return inventColumn;
};

export { usePostsaleColumns, useLiabColumn, useKeyassetsColumn, useInventColumn }