import {
    Breadcrumb,
    Flex,
    Typography,
    Button,
    Row,
    Col,
    Card,
    Segmented
} from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Allbussines, Basicinformation, BuyerDeals, BuyerMeetingContent, BuyerOfferContent, Changepassword, CustomTabs, Editprofile, Meetings, ModuleTopHeading, Profilestatistics, SellerAlerts, Soldbussines } from '../components';
import { useState } from 'react';
import { buyerdashboard, buyerdashstatistic, profilestatisticsData, profiletabData, selleralertsData } from '../data';

const { Text, Title } = Typography;

const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [parentTab, setParentTab] = useState('Seller');
    const [visible, setVisible] = useState(false)
    const [isedit, setIsEdit] = useState(false)
    const defaultChildTab = profiletabData[parentTab]?.[0]?.key || '';
    const [activeChildTab, setActiveChildTab] = useState({
        Seller: defaultChildTab,
        Buyer: profiletabData['Buyer']?.[0]?.key || '',
    });

    const handleParentChange = (value) => {
        setParentTab(value);
        const firstTabKey = profiletabData[value]?.[0]?.key;
        if (firstTabKey) {
            setActiveChildTab((prev) => ({
                ...prev,
                [value]: firstTabKey,
            }));
        }
    }

    const tabContent = {
        Seller: {
            sellerdashboard: (
                <Flex vertical gap={20}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name='Profile' />
                        <Flex gap={5}>
                            <Button className='btn rounded-8 border-brand text-brand' type='button' onClick={() => setVisible(true)}>
                                Password Manager
                            </Button>
                            <Button className='btn bg-brand rounded-8' type='button' onClick={() => setIsEdit(true)}>
                                Edit Profile
                            </Button>
                        </Flex>
                    </Flex>
                    <Basicinformation data={buyerdashboard} title={'Basic Information'} />
                    <Profilestatistics data={profilestatisticsData} title={'Profile Statistics'} />
                </Flex>
            ),
            sellerBusiness: (
                <Flex vertical gap={20}>
                    <Flex justify='space-between' align='center'>
                        <ModuleTopHeading level={4} name='All Businesses' />
                        <Flex gap={5}>
                            <Button className='btn bg-brand rounded-8' type='button' onClick={() => setIsEdit(true)}>
                                <PlusOutlined /> Sell a Business
                            </Button>
                        </Flex>
                    </Flex>
                    <Allbussines />
                </Flex>
            ),
            sellerSoldBusiness: (
                <Flex vertical gap={20}>
                    <Flex align='center'>
                        <ModuleTopHeading level={4} name='Sold Businesses' />
                    </Flex>
                    <Soldbussines />
                </Flex>
            ),
            sellermeeting: (
                <Flex vertical gap={20}>
                    <Flex align='center'>
                        <ModuleTopHeading level={4} name='Meetings' />
                    </Flex>
                    <Meetings />
                </Flex>
            ),
            sellerdeals: (
                3
            ),
            selleralert: (
                <Flex vertical gap={20}>
                    <ModuleTopHeading level={4} name='Alerts' />
                    <SellerAlerts data={selleralertsData} />
                </Flex>
            ),
            sellerwallet: (
                3
            ),
        },
        Buyer: {
            buyerdashboard: (
                <Flex vertical gap={20}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name='Profile' />
                        <Flex gap={5}>
                            <Button className='btn rounded-8 border-brand text-brand' type='button' onClick={() => setVisible(true)}>
                                Password Manager
                            </Button>
                            <Button className='btn bg-brand rounded-8' type='button' onClick={() => setIsEdit(true)}>
                                Edit Profile
                            </Button>
                        </Flex>
                    </Flex>
                    <Basicinformation data={buyerdashboard} title={'Basic Information'} />
                    <Profilestatistics data={buyerdashstatistic} title={'Profile Statistics'} />
                </Flex>
            ),
            buyeroffers: (
                <>
                    <BuyerOfferContent />
                </>
            ),
            buyermeeting: (
                <>
                    <BuyerMeetingContent />
                </>
            ),
            buyerdeals: (
                <>
                    <BuyerDeals />
                </>
            ),
            buyerfavlist: (
                <>
                    <Flex vertical gap={20}>
                        <Flex align='center'>
                            <ModuleTopHeading level={4} name='Favorite Listing' />
                        </Flex>
                        <Soldbussines />
                    </Flex>
                </>
            ),
            buyeralert: (
                <>
                    <Flex vertical gap={20}>
                        <ModuleTopHeading level={4} name='Alerts' />
                        <SellerAlerts data={selleralertsData} />
                    </Flex>
                </>
            ),
        },
    };

    return (
        <div className='padd mb-2'>
            <div className='container'>
                <Flex vertical gap={25} className='mt-3'>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            {
                                title: <Text className='fs-13 text-gray' onClick={() => navigate('/')}>Home</Text>,
                            },
                            {
                                title: <Text className='fw-500 fs-13 text-black'>Profile</Text>,
                            },
                        ]}
                    />
                </Flex>

                <Row gutter={[24, 24]} className='mt-3'>
                    {/* Left side - sidebar */}
                    <Col xs={0} sm={0} md={0} lg={8} xl={6}>
                        <Card className='radius-12 border-gray'>
                            <Flex vertical gap={30}>
                                <Flex vertical align='center' justify='center' gap={20}>
                                    <div className='profile-ic'>DJ</div>
                                    <Title level={5} className='fw-500'>Dean John</Title>
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
                                                    setActiveChildTab((prev) => ({
                                                        ...prev,
                                                        [parentTab]: key,
                                                    }));
                                                }}
                                            />
                                        </div>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </Card>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={16} xl={18}>
                        {
                            tabContent[parentTab][activeChildTab[parentTab]] || (
                                <div>Invalid Tab</div>
                            )
                        }
                    </Col>
                </Row>
            </div>

            <Changepassword
                visible={visible}
                onClose={() => setVisible(false)}
            />
            <Editprofile
                visible={isedit}
                onClose={() => setIsEdit(false)}
            />
        </div>
    );
};

export { ProfileDashboard };
