import {
    Breadcrumb,
    Flex,
    Typography,
    Button,
    Row,
    Col,
    Card,
    Segmented,
    Avatar,
    Tooltip
} from 'antd';
import { PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Allbussines, Basicinformation, BuyerDeals, BuyerOfferContent, Changepassword, CustomTabs, Editprofile, Meetings, ModuleTopHeading, Profilestatistics, SellerAlerts, Soldbussines,Favoritbussines,SellerDeals,SellerWallet, ProfileSidebar } from '../components';
import { useEffect, useState,useMemo } from 'react';
import { profiletabData, selleralertsData } from '../data';
import { ME,PROFESSIONALSTATISTICS,GETBUYERSTATISTICS } from '../graphql/query';
import { useLazyQuery,useQuery } from '@apollo/client';

const { Text, Title } = Typography;

const ProfileDashboard = () => {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [parentTab, setParentTab] = useState('Seller');
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [getUser, { data:me, loading: userLoading, error:userError }] = useLazyQuery(ME);
    const { data: userStatsData, loading: userStatsLoading, error: userStatsError } = useQuery(PROFESSIONALSTATISTICS);
    const [getBuyerUser,{ data: buyerStatsData, loading: buyerStatsLoading, error: buyerStatsError } ]= useLazyQuery(GETBUYERSTATISTICS);

    const [user, setUser] = useState(null);
    const [visible, setVisible] = useState(false)
    const [isedit, setIsEdit] = useState(false)
    const defaultChildTab = profiletabData[parentTab]?.[0]?.key || '';
    const [activeChildTab, setActiveChildTab] = useState({
        Seller: defaultChildTab,
        Buyer: profiletabData['Buyer']?.[0]?.key || '',
    });

     useEffect(() => {
        if (userId) {
        getUser({ variables: { getUserId: userId } });
        }
    }, [userId]);
      
    useEffect(() => {
        if (me?.getUser) {
        setUser(me.getUser);
        }
    }, [me]);

    const handleParentChange = (value) => {
        getBuyerUser()
        setParentTab(value);
        const firstTabKey = profiletabData[value]?.[0]?.key;
        if (firstTabKey) {
            setActiveChildTab((prev) => ({
                ...prev,
                [value]: firstTabKey,
            }));
        }
    }
    const buyerDashboardData = user ? [
        { title: 'Email',   desc: user?.email || 'N/A' },
        { title: 'Phone Number', desc: user?.phone || 'N/A' },
        { title: 'City', desc: user?.city || 'N/A' },
        { title: 'District', desc: user?.district || 'N/A' },
        { title: 'National ID / Passport', desc: (user?.documents || []).map((doc) => doc.filePath) },
        ] : [];

    const defaultStats = [
        { id: 1, img: '/assets/icons/total-view.png', title: 'Total Views', key: 'viewedBusinessesCount' },
        { id: 2, img: '/assets/icons/list-business.png', title: 'Number of Listed Businesses', key: 'listedBusinessesCount' },
        { id: 3, img: '/assets/icons/offer-recieved.png', title: 'Offers Received', key: 'receivedOffersCount' },
        { id: 4, img: '/assets/icons/pending-meeting-ic.png', title: 'Pending Meeting Requests', key: 'pendingMeetingsCount' },
        { id: 5, img: '/assets/icons/schedule-meeting.png', title: 'Schedule Meetings', key: 'scheduledMeetingsCount' },
        { id: 6, img: '/assets/icons/finalize-deal-ic.png', title: 'Finalized Deals', key: 'finalizedDealsCount' },
    ];
    
    const buyerStats = [
        { id: 1, img:'/assets/icons/favorite-ic.png', title: 'Favorite Listing', key: 'favouriteBusinessesCount' },
        { id: 2, img: '/assets/icons/schedule-meeting.png', title: 'Schedule Meetings', key: 'scheduledMeetingsCount' },
        { id: 3, img: '/assets/icons/finalize-deal-ic.png', title: 'Finalized Deals', key: 'finalizedDealsCount' },
    ];
        
    const profileStatisticsData = useMemo(() => {
        if (!userStatsData?.getProfileStatistics) return defaultStats.map(item => ({ ...item, numbers: '0' }));
        
        const stats = userStatsData.getProfileStatistics;
        
        return defaultStats.map(item => ({
            ...item,
            numbers: stats[item.key]?.toLocaleString() || '0',
        }));
        }, [userStatsData]);
    
    const buyerStatisticsData = useMemo(() => {
        if (!buyerStatsData?.getProfileStatistics) return buyerStats.map(item => ({ ...item, numbers: '0' }));
        
        const stats = buyerStatsData.getProfileStatistics;
        
        return buyerStats.map(item => ({
            ...item,
            numbers: stats[item.key]?.toLocaleString() || '0',
        }));
        }, [buyerStatsData]);
          
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
                    <Basicinformation buyerDashboardData={buyerDashboardData} title={'Basic Information'} />
                    <Profilestatistics data={profileStatisticsData} title={'Profile Statistics'} />
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
                <SellerDeals />
            ),
            selleralert: (
                <Flex vertical gap={20}>
                    <ModuleTopHeading level={4} name='Alerts' />
                    <SellerAlerts data={selleralertsData} />
                </Flex>
            ),
            sellerwallet: (
                <SellerWallet />
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
                    <Basicinformation buyerDashboardData={buyerDashboardData} title={'Basic Information'} />
                    <Profilestatistics data={buyerStatisticsData} title={'Profile Statistics'} />
                </Flex>
            ),
            buyeroffers: (
                <>
                    <BuyerOfferContent />
                </>
            ),
            buyermeeting: (
                <>
                    <Meetings />
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
                        <Favoritbussines />
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
                <Flex className='mt-3' align='center' justify='space-between'>
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
                    <Button className='bg-transparent border0 p-0 d-none' type='button' onClick={() => setIsSidebarVisible(true)}>
                        <Tooltip
                            title='Profile Sidebar'
                        >
                            <img src='/assets/icons/sidebar.png' alt='sidebar' width={25} />
                        </Tooltip>
                    </Button>
                </Flex>

                <Row gutter={[24, 24]} className='mt-3'>
                    {/* Left side - sidebar */}
                    <Col xs={0} sm={0} md={0} lg={8} xl={6}>
                        <Card className='radius-12 border-gray'>
                            <Flex vertical gap={30}>
                                <Flex vertical align='center' justify='center' gap={5}>
                                    <Avatar size={40} className='fs-16 text-brand' style={{backgroundColor:'#E9EEFC',textTransform:'uppercase',fontWeight:'bold'}}>
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
                                                setActiveChildTab((prev) => ({
                                                    ...prev,
                                                    [parentTab]: key,
                                                }));
                                            }}
                                        />
                                    </div>
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

            <ProfileSidebar 
                visible={isSidebarVisible}
                parentTab={parentTab}
                user={user}
                activeChildTab={activeChildTab}
                profiletabData={profiletabData}
                handleParentChange={handleParentChange}
                setActiveChildTab={setActiveChildTab}
                onClose={() => setIsSidebarVisible(false)}
            />

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
