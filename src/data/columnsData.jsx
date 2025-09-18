import { Image, Tooltip } from "antd";

const postsaleColumns = [
    { title: 'Support Period', dataIndex: 'period' },
    { title: 'Number of Session', dataIndex: 'session' },
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={'Verified by Jusoor'}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt="verified icon" />
                 </Tooltip>;
            } else {
                return null
            }
        },
    }
];

const liabColumn = [
    { title: 'Liability name', dataIndex: 'name' },
    { title: 'Number of Items', dataIndex: 'items' },
    { title: 'Purchase Year', dataIndex: 'purchaseyear' },
    { title: 'Price', dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.png" width={12} alt="currency-symbol" fetchPriority="high" /> {price}</>},
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={'Verified by Jusoor'}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt="verified icon" />
                 </Tooltip>;
            } else {
                return null
            }
        },
    },
];

const keyassetsColumn = [
    { title: 'Asset name', dataIndex: 'name' },
    { title: 'Number of Items', dataIndex: 'items' },
    { title: 'Purchase Year', dataIndex: 'purchaseyear' },
    { title: 'Price', dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.png" width={12} alt="currency-symbol" fetchPriority="high"/> {price}</>},
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === true || verified === 1) {
                return <Tooltip title={'Verified by Jusoor'}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt="verified icon" />
                 </Tooltip>;
            } else {
                return null
            }
        },
    }
];

const inventColumn = [
    { title: 'Inventory name', dataIndex: 'name' },
    { title: 'Number of Items', dataIndex: 'items' },
    { title: 'Purchase Year', dataIndex: 'purchaseyear' },
    { title: 'Price', dataIndex: 'price', render:(price)=><><img src="/assets/icons/reyal.png" width={12} alt="currency-symbol" fetchPriority="high" /> {price}</>},
    { title: null, dataIndex: 'verified',
        render: (verified) => {
            if (verified === 1) {
                return <Tooltip title={'Verified by Jusoor'}>
                    <Image src='/assets/icons/verified-user.png' preview={false} width={14} alt="verified icon" />
                 </Tooltip>;
            } else {
                return null
            }
        },
    }
];

export { postsaleColumns, liabColumn, keyassetsColumn, inventColumn }