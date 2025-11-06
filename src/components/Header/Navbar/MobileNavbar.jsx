import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Collapse, Drawer, Flex, Image, Typography, message } from 'antd'
import { NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';
import { LOGOUT } from '../../../graphql/mutation';
import { GET_CATEGORIES } from '../../../graphql/query';
import { client } from '../../../config/apolloClient';

const { Title } = Typography
const { Panel } = Collapse;

const MobileNavbar = ({ visible, onClose }) => {

    const { t, i18n } = useTranslation();
    const lan = localStorage.getItem("lang") || i18n.language || "en";
    const isArabic = lan.toLowerCase() === "ar";
    const [currentPanel, setCurrentPanel] = useState([])
    const [currentPanels, setCurrentPanels] = useState([])
    const userId = Cookies.get("userId");
    const navigate = useNavigate()

    const [isDesktop, setIsDesktop] = useState(false);
    const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
    
    // Check if user is inactive
    const userStatus = Cookies.get("userStatus");
    const isUserInactive = userStatus === "pending" || userStatus === "inactive";
    
    // Fetch categories from GraphQL
    const { data: categoryData } = useQuery(GET_CATEGORIES);
    const categories = categoryData?.getAllCategories?.categories?.map(cat => ({
        id: cat.id,
        title: cat.name,
        arabicTitle: cat.arabicName
    })) || [];

    // Build mobile menu data dynamically
    const mobilemenuData = [
        {
            id: 1,
            name: t('Browse Businesses'),
            children: [
                {
                    id: 1,
                    name: t('Browse Businesses by Categories'),
                    innerchildren: categories.map((cat) => ({
                        id: cat.id,
                        title: isArabic ? cat.arabicTitle : cat.title,
                        path: cat.title
                            ? `/businesslisting?category=${encodeURIComponent(cat.title)}`
                            : '/businesslisting',
                    }))
                },
                {
                    id: 2,
                    name: t('Browse Businesses by Revenue'),
                    innerchildren: [
                        { id: 1, title: t('SAR 0 - SAR 10,000'), path: '/businesslisting?revenue=0,10000' },
                        { id: 2, title: t('SAR 10,000 - SAR 30,000'), path: '/businesslisting?revenue=10000,30000' },
                        { id: 3, title: t('SAR 30,000 - SAR 60,000'), path: '/businesslisting?revenue=30000,60000' },
                        { id: 4, title: t('SAR 60,000 - SAR 100,000'), path: '/businesslisting?revenue=60000,100000' },
                        { id: 5, title: t('SAR 100,000 - SAR 150,000'), path: '/businesslisting?revenue=100000,150000' },
                        { id: 6, title: t('SAR 150,000+'), path: '/businesslisting?revenue=150000,9999999' },
                    ]
                }
            ]
        },
        {
            id: 2,
            name: t('Others'),
            children: [
                {
                    id: 1,
                    name: t('About Jusoor'),
                    Path: '/about'
                },
                {
                    id: 2,
                    name: t('Term of Use'),
                    Path: '/termofuse'
                },
            ]
        }
    ];

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1199);

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isDesktop) return null;

    const handleLogout = async () => {
        try {
            await logoutMutation();
            onClose?.();
            message.success(t('Logged out successfully'));
        } catch {
            message.warning(t('Network issue. You were logged out locally.'));
        } finally {
            Cookies.remove('userId');
            Cookies.remove('authToken');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userId');
            client.resetStore();
            navigate('/');
            window.location.reload();
        }
    };

    return (
        <>
        <Drawer
            onClose={onClose}
            open={visible}
            title={null}
            closeIcon={false}
            className={`bg-dark-blue`}
            placement={isArabic ? 'right' : 'left'}
        >
            <Flex justify='space-between' align='center'>
                <NavLink to={'/'} onClick={onClose}>
                    <Image src='/assets/images/logo.webp' alt='jusoor logo' width={120} preview={false} fetchPriority="high"/>
                </NavLink>
                <Button aria-labelledby='Close' className='bg-transparent border-0 p-0' onClick={onClose}>
                    <CloseOutlined className='text-white fs-18' />
                </Button>
            </Flex>
            <div className='mt-3'>
                <Collapse
                    activeKey={currentPanel}
                    onChange={(keys) => { setCurrentPanel(keys) }}
                    ghost
                >
                    {
                        mobilemenuData?.map((menu, f) =>
                            <Panel
                                className={currentPanel.includes(String(f)) ? 'panel-active panel' : 'panel'}
                                showArrow={false}
                                header={<Title level={5} className='text-white m-0'>{menu?.name}</Title>}
                                key={f}
                                extra={
                                    ((currentPanel?.findIndex(x => x == f)) > -1) ?
                                        <MinusOutlined className='text-white fs-14'/>
                                        :
                                        <PlusOutlined className='text-white fs-14'/>
                                }
                            >
                                <div>
                                    {
                                        f === 0 &&    
                                        <NavLink to={'/'}  className='text-white fs-14 block p-2 pl-2'>
                                            <Title level={5} className='text-white m-0'>{t('Browse All')}</Title>
                                        </NavLink>
                                    }
                                    <Collapse
                                        activeKey={currentPanels}
                                        onChange={(keys) => { setCurrentPanels(keys) }}
                                        ghost
                                    >
                                        {
                                            menu?.children?.map((menuchild, f) =>
                                                menuchild?.innerchildren ? (
                                                    <Panel
                                                        className={currentPanels.includes(String(f)) ? 'panel-active panel' : 'panel'}
                                                        showArrow={false}
                                                        header={<Title level={5} className='text-white m-0'>{menuchild?.name}</Title>}
                                                        key={f}
                                                        extra={
                                                            ((currentPanels?.findIndex(x => x == f)) > -1) ?
                                                                <MinusOutlined className='text-white fs-14'/>
                                                                :
                                                                <PlusOutlined className='text-white fs-14'/>
                                                        }
                                                    >
                                                        <Flex vertical gap={10}>
                                                            {
                                                                menuchild?.innerchildren?.map((innerLink, i) =>
                                                                    <NavLink to={innerLink?.path} onClick={onClose} className='text-white fs-14' key={i}>
                                                                        {innerLink?.title}
                                                                    </NavLink>
                                                                )
                                                            }
                                                        </Flex>
                                                    </Panel>
                                                ) : (
                                                    <NavLink to={menuchild?.Path} onClick={onClose} className='text-white fs-14 block mb-2'>
                                                        {menuchild?.name}
                                                    </NavLink>
                                                )
                                            )
                                        }
                                    </Collapse>
                                </div>
                            </Panel>
                        )
                    }
                </Collapse>
                <Flex vertical>
                    <NavLink to={'/article'} onClick={onClose}  className='text-white fs-14 mb-1 block p-2 pl-2'>
                        <Title level={5} className='text-white m-0'>{t("Articles")}</Title>
                    </NavLink>
                    <NavLink to={'/faq'} onClick={onClose} className='text-white fs-14 block mb-2 p-2 pl-2'>
                        <Title level={5} className='text-white m-0'>{t("FAQs")}</Title>
                    </NavLink>
                    {userId && (
                        <NavLink to={'/profiledashboard'} onClick={onClose} className='text-white fs-14 block mb-2 p-2 pl-2'>
                            <Title level={5} className='text-white m-0'>{t("My Profile")}</Title>
                        </NavLink>
                    )}
                </Flex>
                <Flex vertical gap={10} align='center' justify='center'>
                    {userId ? (
                        <>
                            <Button 
                                aria-labelledby='Sell a Business' 
                                className='btn bg-brand mt-3 w-100' 
                                onClick={() => { 
                                    if (!isUserInactive) {
                                        navigate('/sellbusinesscreate'); 
                                        onClose();
                                    }
                                }}
                                disabled={isUserInactive}
                                style={{
                                    opacity: isUserInactive ? 0.6 : 1,
                                    cursor: isUserInactive ? 'not-allowed' : 'pointer',
                                }}
                            >
                                <PlusOutlined /> {t('Sell a Business')}
                            </Button>
                            <Button aria-labelledby='Logout' className='btn btn-outline w-100' danger loading={logoutLoading} onClick={handleLogout}>
                                {t('Logout')}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button aria-labelledby='Sign Up' className='btn btn-outline w-100' onClick={() => navigate('/signup')}>
                                {t(' Sign Up')}
                            </Button>
                            <Button aria-labelledby='Login' className='btn bg-brand w-100' onClick={() => navigate('/login')}>
                                {t(' Sign In')}
                            </Button>
                        </>
                    )}
                </Flex>
            </div>
        </Drawer>
        </>
    )
}

export { MobileNavbar }
