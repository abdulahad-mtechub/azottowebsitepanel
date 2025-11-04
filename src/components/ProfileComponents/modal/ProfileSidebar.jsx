import { CloseOutlined } from '@ant-design/icons'
import { Avatar, Button, Drawer, Flex, Segmented, Typography } from 'antd'
import { useMemo } from 'react';
import { CustomTabs } from '../../ui';
import {GETBUYERMEETINGCOUNT,GETSELLERMEETINGCOUNT} from '../..//../graphql/query'
import { useQuery } from "@apollo/client";
import { useTranslation } from 'react-i18next';

const { Title } = Typography;
const ProfileSidebar = ({visible,onClose,user,parentTab,handleParentChange,activeChildTab, setActiveChildTab,profiletabData}) => {

    const { t } = useTranslation();
    const { data: sellerData, loading: sellerLoading } = useQuery(GETSELLERMEETINGCOUNT);

    const { data: buyerData, loading: buyerLoading } = useQuery(GETBUYERMEETINGCOUNT);
    
    const sellerCount = sellerData?.getSellerCount ?? 0;
    const buyerCount = buyerData?.getBuyerCount ?? 0;
    const countsLoading = sellerLoading || buyerLoading;
  
    const itemsForRender = useMemo(() => {
      const clone = (arr) => arr.map(item => {
        if (item.children) {
          return { ...item, children: item.children.map(c => ({ ...c })) };
        }
        return { ...item };
      });
  
      const tabs = clone(profiletabData[parentTab] || []);
      return tabs.map(item => {
        if (item.key === 'sellermeeting') {
          return { ...item, label: `${t('Meetings')} (${countsLoading ? '...' : sellerCount})` };
        }
        if (item.key === 'buyermeeting') {
          return { ...item, label: `${t('Meetings')} (${countsLoading ? '...' : buyerCount})` };
        }
        return item;
      });
    }, [parentTab, profiletabData, sellerCount, buyerCount, countsLoading, t]);

    return (
        <Drawer
            onClose={onClose}
            open={visible}
            title={null}
            width={260}
            closeIcon={false}
            placement='left'
            className={`drawer-no-p p-2`}
        >
            <Flex justify='end'>
                <Button aria-labelledby='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>
            <Flex vertical gap={30}>
                <Flex vertical align='center' justify='center' gap={5}>
                    <Avatar size={40} className='fs-16 text-brand fw-bold bg-light-brand textuppercase'>
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Title level={5} className='fw-500'>{user?.name?.charAt(0)?.toUpperCase() + user?.name?.slice(1)}</Title>
                </Flex>
                <Flex vertical gap={10}>
                    <Flex justify="center">
                        <Segmented
                            className='custom-segment'
                            options={[
                                { label: t('Seller'), value: 'Seller' },
                                { label: t('Buyer'), value: 'Buyer' },
                            ]}
                            value={parentTab}
                            onChange={handleParentChange}
                        />
                    </Flex>
                    <div className="text-center mt-4">
                        <CustomTabs
                            items={itemsForRender}
                            activeKey={activeChildTab[parentTab]}
                            onChange={(key) => {
                                onClose();
                                setActiveChildTab((prev) => ({
                                    ...prev,
                                    [parentTab]: key,
                                }));
                            }}
                        />
                    </div>
                </Flex>
            </Flex>
        </Drawer>
    );
};

export { ProfileSidebar };
