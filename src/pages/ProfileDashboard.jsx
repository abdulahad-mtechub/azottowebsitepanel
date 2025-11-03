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
    Tooltip,
    Grid
} from 'antd';
import { ArrowLeftOutlined, MenuOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Allbussines, Basicinformation, BuyerDeals, BuyerOfferContent, Changepassword, CustomTabs, Editprofile, Meetings, ModuleTopHeading, Profilestatistics, SellerAlerts, Soldbussines,Favoritbussines,SellerDeals,SellerWallet, ProfileSidebar } from '../components';
import { useEffect, useState,useMemo } from 'react';
import { NAVUSERDATA,PROFESSIONALSTATISTICS,GETBUYERSTATISTICS } from '../graphql/query';
import { useLazyQuery } from '@apollo/client';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

const ProfileDashboard = () => {
    
    const userId = Cookies.get("userId"); 
    const navigate = useNavigate();
    const {t}= useTranslation()
    const screens = useBreakpoint(); 
    
    const profiletabData = {
        Seller: [
          { key: 'sellerdashboard', label: t('Dashboard') },
          {
            key: 'sellerlist',
            label: t('My Listing'),
            children: [
              { key: 'sellerBusiness', label: t('All Businesses') },
              { key: 'sellerSoldBusiness', label: t('Sold Businesses') },
            ],
          },
          {
            key: 'sellermeeting',
            label: t('Meetings'),
            //Meeting(10)
          },
          { key: 'sellerdeals', label: t('Deals') },
          { key: 'selleralert', label: t('Alerts') },
          { key: 'sellerwallet', label: t('Wallet') },
        ],
        Buyer: [
          { key: 'buyerdashboard', label: t('Dashboard') },
          { key: 'buyeroffers', label: t('Offers') },
          { key: 'buyermeeting', label: t('Meetings') },
          { key: 'buyerdeals', label: t('Deals') },
          { key: 'buyerfavlist', label: t('Favorite Listing') },
          { key: 'buyeralert', label: t('Alerts') },
        ],
    };
    
    const getInitialParentTab = () => {
        const saved = localStorage.getItem('profileParentTab');
        return (saved === 'Seller' || saved === 'Buyer') ? saved : 'Seller';
    };
    
    const getInitialChildTabs = () => {
        const saved = localStorage.getItem('profileChildTabs');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                const isSellerValid = profiletabData.Seller.some(tab => 
                    tab.key === parsed.Seller || tab.children?.some(child => child.key === parsed.Seller)
                );
                const isBuyerValid = profiletabData.Buyer.some(tab => 
                    tab.key === parsed.Buyer || tab.children?.some(child => child.key === parsed.Buyer)
                );
                
                if (isSellerValid && isBuyerValid) {
                    return parsed;
                }
            } catch {
                // Invalid JSON, fall through to defaults
            }
        }
        return {
            Seller: profiletabData.Seller?.[0]?.key || '',
            Buyer: profiletabData.Buyer?.[0]?.key || '',
        };
    };
    // Get current month start and end dates
    const getCurrentMonthRange = () => {
        const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
        const endDate = dayjs().endOf('month').format('YYYY-MM-DD');
        return [dayjs(startDate), dayjs(endDate)];
    };

    const [parentTab, setParentTab] = useState(getInitialParentTab);
    const [ addwalletvisible, setAddWalletVisible ] = useState(false)
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [dateRange, setDateRange] = useState(getCurrentMonthRange);
    const [getUser, { data:me }] = useLazyQuery(NAVUSERDATA);
    const [getSellerStats, { data: userStatsData }] = useLazyQuery(PROFESSIONALSTATISTICS);
    const [getBuyerUser,{ data: buyerStatsData }] = useLazyQuery(GETBUYERSTATISTICS);
    const [user, setUser] = useState(null);
    const [visible, setVisible] = useState(false)
    const [isedit, setIsEdit] = useState(false)
    const [activeChildTab, setActiveChildTab] = useState(getInitialChildTabs);

     useEffect(() => {
        if (userId) {
        getUser({ variables: { getNavUserId: userId } });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);
      
    useEffect(() => {
        if (me?.getNavUser) {
        setUser(me.getNavUser);
        }
    }, [me]);

    // Fetch seller stats with date range
    useEffect(() => {
        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            getSellerStats({ variables: { startDate, endDate } });
        }
    }, [dateRange, getSellerStats]);

    // Save tabs to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('profileParentTab', parentTab);
    }, [parentTab]);

    useEffect(() => {
        localStorage.setItem('profileChildTabs', JSON.stringify(activeChildTab));
    }, [activeChildTab]);

    const handleParentChange = (value) => {
        // Fetch buyer stats with date range when switching to Buyer tab
        if (value === 'Buyer' && dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            getBuyerUser({ variables: { startDate, endDate } });
        }
        setParentTab(value);
        const firstTabKey = profiletabData[value]?.[0]?.key;
        if (firstTabKey) {
            setActiveChildTab((prev) => ({
                ...prev,
                [value]: firstTabKey,
            }));
        }
    }

    const handleDateRangeChange = (dates) => {
        setDateRange(dates);
        // Fetch appropriate stats based on current tab
        if (dates && dates[0] && dates[1]) {
            const startDate = dates[0].format('YYYY-MM-DD');
            const endDate = dates[1].format('YYYY-MM-DD');
            
            if (parentTab === 'Seller') {
                getSellerStats({ variables: { startDate, endDate } });
            } else {
                getBuyerUser({ variables: { startDate, endDate } });
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userStatsData]);
    
    const buyerStatisticsData = useMemo(() => {
        if (!buyerStatsData?.getBuyerStatistics) return buyerStats.map(item => ({ ...item, numbers: '0' }));
        
        const stats = buyerStatsData.getBuyerStatistics;
        
        return buyerStats.map(item => ({
            ...item,
            numbers: stats[item.key]?.toLocaleString() || '0',
        }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [buyerStatsData]);
          
      const tabContent = {
        Seller: {
            sellerdashboard: (
                <Flex vertical gap={20}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name={t('Profile')} />
                        <Flex gap={5}>
                            <Button aria-labelledby='Password Manager' className='btn rounded-8 border-brand text-brand' type='button' onClick={() => setVisible(true)}>
                               {t("Password Manager")}
                            </Button>
                            <Button aria-labelledby='Edit Profile' className='btn bg-brand rounded-8' type='button' onClick={() => setIsEdit(true)}>
                                {t("Edit Profile")}
                            </Button>
                        </Flex>
                    </Flex>
                    <Basicinformation buyerDashboardData={buyerDashboardData} title={'Basic Information'} />
                    <Profilestatistics 
                        data={profileStatisticsData} 
                        title={'Profile Statistics'} 
                        dateRange={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                    />
                </Flex>
            ),
            sellerBusiness: (
                <Allbussines />
            ),
            sellerSoldBusiness: (
                <Flex vertical gap={20}>
                    <Flex align='center'>
                        <ModuleTopHeading level={4} name={t('Sold Businesses')} />
                    </Flex>
                    <Soldbussines />
                </Flex>
            ),
            sellermeeting: (
                <Flex vertical gap={20}>
                    <Flex align='center'>
                        <ModuleTopHeading level={4} name={t('Meetings')} />
                    </Flex>
                    <Meetings isBuyer={false} />
                </Flex>
            ),
            sellerdeals: (
                <SellerDeals />
            ),
            selleralert: (
                <Flex vertical gap={20}>
                    <ModuleTopHeading level={4} name={t('Alerts')} />
                    <SellerAlerts />
                </Flex>
            ),
            sellerwallet: (
                <Flex vertical gap={20}>
                    <Flex justify='space-between' gap={5}>
                        <ModuleTopHeading level={4} name={t('Wallet')} />
                        <Button aria-labelledby='Edit Profile' className='btn bg-brand rounded-8' type='button' onClick={() => {setAddWalletVisible(true)}}>
                           <PlusOutlined /> {t("Add Account")}
                        </Button>
                    </Flex>
                    <SellerWallet {...{addwalletvisible, setAddWalletVisible}} />
                </Flex>
            ),
        },
        Buyer: {
            buyerdashboard: (
                <Flex vertical gap={20}>
                    <Flex justify='space-between'>
                        <ModuleTopHeading level={4} name={t('Profile' )}/>
                        <Flex gap={5}>
                            <Button aria-labelledby='Password Manager' className='btn rounded-8 border-brand text-brand' type='button' onClick={() => setVisible(true)}>
                                {t("Password Manager")}
                            </Button>
                            <Button aria-labelledby='Edit Profile' className='btn bg-brand rounded-8' type='button' onClick={() => setIsEdit(true)}>
                                {t("Edit Profile")}
                            </Button>
                        </Flex>
                    </Flex>
                    <Basicinformation buyerDashboardData={buyerDashboardData} title={'Basic Information'} />
                    <Profilestatistics 
                        data={buyerStatisticsData} 
                        title={'Profile Statistics'} 
                        dateRange={dateRange}
                        onDateRangeChange={handleDateRangeChange}
                    />
                </Flex>
            ),
            buyeroffers: (
                <>
                    <BuyerOfferContent />
                </>
            ),
            buyermeeting: (
                <>
                    <Meetings isBuyer={true} />
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
                            <ModuleTopHeading level={4} name={t('Favorite Listing' )}/>
                        </Flex>
                        <Favoritbussines />
                    </Flex>
                </>
            ),
            buyeralert: (
                <>
                    <Flex vertical gap={20}>
                        <ModuleTopHeading level={4} name={t('Alerts')} />
                        <SellerAlerts />
                    </Flex>
                </>
            ),
        },
    };
    const isMobileOrTablet = !screens.lg;
    const handleButtonClick = () => {
        if (isMobileOrTablet) {
            setIsSidebarVisible(true);
        } else {
            navigate(-1);
        }
    };

    const buttonTooltipTitle = isMobileOrTablet
    ? t('Profile Sidebar')
    : t('Go Back');

    const buttonIcon = isMobileOrTablet
        ? <MenuOutlined className='fs-16' />
        : <ArrowLeftOutlined className='fs-16' />;

    return (
        <div className='padd mb-2'>
            <div className='container'>
                <Flex className='mt-3' gap={5} align='flex-start' vertical>
                    <Button
                        aria-labelledby={buttonTooltipTitle}
                        className='btn border-gray text-black p-2 d-lg-none'
                        type='button'
                        onClick={handleButtonClick}
                    >
                        {buttonIcon}
                    </Button>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            {
                                title: <Text className='fs-13 text-gray' onClick={() => navigate('/')}>{t("Home")}</Text>,
                            },
                            {
                                title: <Text className='fw-500 fs-13 text-black'>{t("Profile")}</Text>,
                            },
                        ]}
                    />
                </Flex>

                <Row gutter={[24, 24]} className='mt-3'>
                    {/* Left side - sidebar */}
                    <Col xs={0} sm={0} md={0} lg={8} xl={6}>
                        <Card className='radius-12 border-gray'>
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
                            tabContent?.[parentTab]?.[activeChildTab[parentTab]] || (
                            <div>{t('Invalid Tab')}</div>
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
                userData={user}
            />
        </div>
    );
};

export { ProfileDashboard };
