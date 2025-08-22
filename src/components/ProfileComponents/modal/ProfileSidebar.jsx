import { CloseOutlined } from '@ant-design/icons'
import { Avatar, Button, Drawer, Flex, Segmented, Typography } from 'antd'
import { useEffect, useState } from 'react';
import { CustomTabs } from '../../ui';

const { Title } = Typography;
const ProfileSidebar = ({visible,onClose,user,parentTab,handleParentChange,activeChildTab, setActiveChildTab,profiletabData}) => {

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1199);

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isDesktop) return null;

    return (
        <Drawer
            onClose={onClose}
            open={visible}
            title={null}
            closeIcon={false}
            placement='left'
            className={`drawer-no-p p-2`}
        >
            <Flex justify='end'>
                <Button onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>
            <Flex vertical gap={30}>
                <Flex vertical align='center' justify='center' gap={5}>
                    <Avatar size={40} className='fs-16' style={{backgroundColor:'#4F46E5',textTransform:'uppercase',fontWeight:'bold'}}>
                        {user?.name?.charAt(0)}
                    </Avatar>
                    <Title level={5} className='fw-500'>{user?.name?.charAt(0)?.toUpperCase() + user?.name?.slice(1)}</Title>
                </Flex>
                <Flex vertical gap={10}>
                    <Flex justify="center">
                        <Segmented
                            className='custom-segment'
                            options={['Seller', 'Buyer']}
                            value={parentTab}
                            onChange={handleParentChange}
                        />
                    </Flex>
                    <div className="text-center mt-4">
                        <CustomTabs
                            items={profiletabData[parentTab]}
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
    )
}

export {ProfileSidebar}