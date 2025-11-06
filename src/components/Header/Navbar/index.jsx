import { Typography, Button, Flex, Image, Row, Col, Badge, Dropdown, Avatar, Space,Spin, List, Divider, Card, Popover, message, Tooltip } from 'antd';
import './index.css';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import moment from 'moment';
import { MobileNavbar } from './MobileNavbar';
import Cookies from "js-cookie";
import { useLazyQuery, useSubscription, useMutation } from '@apollo/client';
import { NAVUSERDATA,NAVNOTIFICATION,NOTIFICATION,GET_CATEGORIES, ME } from '../../../graphql/query';
import { client } from '../../../config/apolloClient';
import { useTranslation } from 'react-i18next';
import {NEW_NOTIFICATION_SUBSCRIPTION} from '../../../graphql/subscription'
import { useQuery } from '@apollo/client';
import { MARK_NOTIFICATION_AS_READ, LOGOUT } from '../../../graphql/mutation';


const { Text, Title } = Typography;

const Navbar = ({setGetCategory}) => { 

  const { t,i18n } = useTranslation();
  const [ messageApi, contextHolder ] = message.useMessage();
  const lan = localStorage.getItem("lang") || i18n.language || "en";
  const isArabic = lan.toLowerCase() === "ar";
  const userId = Cookies.get("userId"); 
  const [isLoggedIn, setisLoggedIn] = useState(!!userId);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const browseHoverTimeoutRef = useRef(null);
  const [isshow, setIsShow] = useState(!!userId);
  const [user, setUser] = useState(null);
  const [ visible, setVisible ] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const NOTIFICATIONS_PAGE_SIZE = 10;
  const notificationOffsetRef = useRef(0);
  const [hasMoreNotifications, setHasMoreNotifications] = useState(true);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const loadingNotificationsRef = useRef(false);
  const [hasMarkedRead, setHasMarkedRead] = useState(false);
  const listContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.webp",
    alt: "Language logo"
  });
  const { data: categoryData } = useQuery(GET_CATEGORIES);
  const categories = categoryData?.getAllCategories?.categories?.map(cat => ({
    id: cat.id,
    title: cat.name,
    arabicTitle: cat.arabicName
  })) || [];
  const businessmenuData = [
    {
      id: 1,
      icon: '/assets/icons/m-1.png',
      title: t("Browse Businesses by Categories"),
      subtitle: t('Choose from popular business types.'),
      subdropdown: categories.map((cat, index) => ({
        id: cat.id ?? index + 1,
        title: isArabic ? cat.arabicTitle : cat.title,
        path: cat.title
          ? `/businesslisting?category=${encodeURIComponent(cat.title)}`
          : '/businesslisting',
      })),
    },
    {
      id: 3,
      icon: '/assets/icons/m-3.png',
      title: t('Browse Businesses by Revenue'),
      subtitle: t('Filter by business earnings.'),
      subdropdown: [
          { id: 1, title: t('SAR 0 - SAR 10,000'), path: '/businesslisting?revenue=0,10000' },
          { id: 2, title: t('SAR 10,000 - SAR 30,000'), path: '/businesslisting?revenue=10000,30000' },
          { id: 3, title: t('SAR 30,000 - SAR 60,000'), path: '/businesslisting?revenue=30000,60000' },
          { id: 4, title: t('SAR 60,000 - SAR 100,000'), path: '/businesslisting?revenue=60000,100000' },
          { id: 5, title: t('SAR 100,000 - SAR 150,000'), path: '/businesslisting?revenue=100000,150000' },
          { id: 6, title: t('SAR 150,000+'), path: '/businesslisting?revenue=150000,9999999' },
        ]
    },
  ]
  const [getUser, { data:me }] = useLazyQuery(NAVUSERDATA);
  const [getNavNotification, { data:navNotificationsData }] = useLazyQuery(NAVNOTIFICATION);
  const [getNotification] = useLazyQuery(NOTIFICATION);
  const [getUserDetails] = useLazyQuery(ME);
  const processedVerificationNotificationsRef = useRef(new Set());
  
  const loadNotifications = useCallback(async (reset = false) => {
    if (!userId || loadingNotificationsRef.current) {
      return;
    }

    const nextOffset = reset ? 0 : notificationOffsetRef.current;
    loadingNotificationsRef.current = true;
    setIsLoadingNotifications(true);

    try {
      const { data } = await getNotification({
        variables: {
          userId,
          limit: NOTIFICATIONS_PAGE_SIZE,
          offSet: nextOffset,
        },
        fetchPolicy: 'network-only',
      });

      const payload = data?.getNotifications;
      if (!payload) {
        setHasMoreNotifications(false);
        return;
      }

      const fetchedNotifications = payload.notifications ?? [];

      setNotifications((prev) => {
        const base = reset ? [] : prev;
        const merged = [...base];
        fetchedNotifications.forEach((item) => {
          if (!merged.some((existing) => existing.id === item.id)) {
            merged.push(item);
          }
        });
        return merged;
      });

      notificationOffsetRef.current = nextOffset + fetchedNotifications.length;
      setHasMoreNotifications(fetchedNotifications.length === NOTIFICATIONS_PAGE_SIZE);

      if (reset && listContainerRef.current) {
        listContainerRef.current.scrollTop = 0;
      }
    } catch (error) {
      console.error('Failed to load notifications', error);
    } finally {
      loadingNotificationsRef.current = false;
      setIsLoadingNotifications(false);
    }
  }, [userId, getNotification, NOTIFICATIONS_PAGE_SIZE]);

  const [markNotificationAsRead] = useMutation(MARK_NOTIFICATION_AS_READ);
  const [logoutMutation, { loading: logoutLoading }] = useMutation(LOGOUT);
  useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
    onSubscriptionData: async ({ subscriptionData }) => {
        const newNotif = subscriptionData.data?.newNotification;
        
        if (newNotif && newNotif.user?.id === userId) {
            setNotifications((prev) => {
              if (prev.some((item) => item.id === newNotif.id)) {
                return prev;
              }
              notificationOffsetRef.current += 1;
              return [newNotif, ...prev];
            });
            
            setUnreadCount((prev) => prev + 1);
            
            if (dropdownOpen) {
              setHasMarkedRead(false);
            }

            const isVerificationNotification = 
              newNotif.message?.toLowerCase().includes('verified successfully') ||
              newNotif.name?.toLowerCase().includes('account verified');

            if (isVerificationNotification && !processedVerificationNotificationsRef.current.has(newNotif.id)) {
              processedVerificationNotificationsRef.current.add(newNotif.id);
              
              try {
                const { data } = await getUserDetails({
                  variables: { getUserDetailsId: userId },
                  fetchPolicy: 'network-only',
                });

                if (data?.getUserDetails?.status) {
                  const newStatus = data.getUserDetails.status;
                  Cookies.set("userStatus", newStatus, { expires: 7 });
                  
                  messageApi.success(t('Your account has been verified successfully!'));
                  
                  setTimeout(() => {
                    window.location.reload();
                  }, 1500);
                }
              } catch (error) {
                console.error('Failed to fetch updated user status:', error);
              }
            }
        }
    }
  });
  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(lang);
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png" ,alt: "Arabic Language logo"}
        : { key: "1", label: "EN", icon: "assets/icons/en.webp" ,alt: "English Language logo"}
    );
  }, [i18n]);

  useEffect(() => {
    if (userId) {
      getUser({ variables: { getNavUserId: userId } });
      getNavNotification();
    }
  }, [userId, getNavNotification, getUser]);

  useEffect(() => {
    if (me?.getNavUser) {
      setUser(me.getNavUser);
    }
  }, [me]);

  useEffect(() => {
    const navCount = navNotificationsData?.getNotificationCount;
    if (typeof navCount === 'number') {
      setUnreadCount(navCount);
    }
  }, [navNotificationsData]);

  useEffect(() => {
    if (!dropdownOpen) {
      setHasMarkedRead(false);
    }
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen || hasMarkedRead || !userId) {
      return;
    }

    if (unreadCount === 0) {
      setHasMarkedRead(true);
      return;
    }

    markNotificationAsRead({ variables: { userId } })
      .then(() => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((notification) => ({
          ...notification,
          isRead: true,
        })));
        getNavNotification();
      })
      .catch(() => {})
      .finally(() => setHasMarkedRead(true));
  }, [dropdownOpen, hasMarkedRead, unreadCount, markNotificationAsRead, userId, getNavNotification]);

  const renderSubdropdownItems = (items) => {
    if (items.length <= 6) {
      return (
        <Col span={24}>
          <Flex gap={15} vertical className='w-100'>
            {items.map(item => (
              <NavLink 
                to={item.path} 
                key={item.id}
                onClick={()=>{setGetCategory(item?.title)}}
              >
                <Text className='fs-14 nav-link'>
                  {item.title}
                </Text>
              </NavLink>
            ))}
          </Flex>
        </Col>
      );
    } else {
      const midIndex = Math.ceil(items.length / 2);
      return (
        <>
          <Col span={12} className='border-right'>
            <Flex gap={15} vertical className='w-100'>
              {items.slice(0, midIndex).map(item => (
                <NavLink 
                  to={item.path} 
                  key={item.id}
                  onClick={()=>setGetCategory(item?.title)}
                >
                  <Text className='fs-14 nav-link'>
                    {item.title}
                  </Text>
                </NavLink>
              ))}
            </Flex>
          </Col>
          <Col span={12}>
            <Flex gap={15} vertical className='w-100'>
              {items.slice(midIndex).map(item => (
                <NavLink 
                  to={item.path} 
                  key={item.id}
                  onClick={()=>setGetCategory(item?.title)}
                >
                  <Text className='fs-14 nav-link'>
                    {item.title}
                  </Text>
                </NavLink>
              ))}
            </Flex>
          </Col>
        </>
      );
    }
  };
  useEffect(() => {
    setIsShow(isLoggedIn);
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await logoutMutation();
      message.success(t('Logged out successfully'));
    } catch {
      message.warning(t('Network issue. You were logged out locally.'));
    } finally {
      Cookies.remove('userId');
      Cookies.remove('authToken');
      Cookies.remove('userStatus');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userId');
      client.resetStore();
      setisLoggedIn(false);
      setIsShow(false);
      navigate('/');
      window.location.reload();
    }
  };
  // Check if user is inactive
  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";

  const items = [
    {
      key: '1',
      label: (
        <a
          href="#logout"
          onClick={(e) => {
            e.preventDefault(); // Prevent default link behavior
            setIsShow(false);
            handleLogout();
          }}
        >
          {logoutLoading ? t('Logging out...') : t("Logout")}
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            if (!isUserInactive) {
              navigate('/profiledashboard');
            }
          }}
          style={{
            opacity: isUserInactive ? 0.5 : 1,
            cursor: isUserInactive ? 'not-allowed' : 'pointer',
          }}
        >
          {t("My Profile")}
        </a>
      ),
      disabled: isUserInactive,
    },
  ];
  const handleChange = (lang) => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png", alt: "Arabic" }
        : { key: "1", label: "EN", icon: "assets/icons/en.webp", alt: "English" }
    );
  
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };
  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image src="assets/icons/en.webp" width={20} alt="English" preview={false} />
          <Text className='fs-13'>EN</Text>
        </Space>
      ),
      onClick: () => handleChange("en"),
    },
    {
      key: "2",
      label: (
        <Space>
          <Image src="assets/icons/ar.png" width={20} alt="Arabic" preview={false} />
          <Text className='fs-13'>AR</Text>
        </Space>
      ),
      onClick: () => handleChange("ar"),
    },
  ];
  
const handleDropdownChange = (open) => {
  setDropdownOpen(open);
  if (open) {
    setHasMarkedRead(false);
    if (userId) {
      notificationOffsetRef.current = 0;
      setNotifications([]);
      setHasMoreNotifications(true);
      loadNotifications(true);
      getNavNotification();
    }
  } else {
    setHasMarkedRead(false);
  }
};

const handleListScroll = useCallback((event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
  const isNearBottom = scrollHeight - scrollTop - clientHeight <= 16;
  if (isNearBottom && hasMoreNotifications && !loadingNotificationsRef.current) {
    loadNotifications();
  }
}, [hasMoreNotifications, loadNotifications]);

const dropdownContent = useMemo(() => {
  const data = notifications;
  const isScrollable = data.length >= NOTIFICATIONS_PAGE_SIZE;
  const showInitialLoader = dropdownOpen && data.length === 0 && isLoadingNotifications;
  const showLoadMoreSpinner = dropdownOpen && data.length > 0 && isLoadingNotifications && hasMoreNotifications;

  return (
    <Card className="rounded-12 card-cs size-notify border-0">
      <Text>{t("Notification")} ({unreadCount})</Text>
      <Divider className="bg-divider my-2" />
      {showInitialLoader ? (
        <Flex align="center" justify="center" style={{ minHeight: 120 }}>
          <Spin size="small" />
        </Flex>
      ) : data.length > 0 ? (
        <div
          ref={listContainerRef}
          onScroll={handleListScroll}
          style={{
            maxHeight: isScrollable ? 320 : 'auto',
            overflowY: isScrollable ? 'auto' : 'visible',
            paddingRight: isScrollable ? 4 : 0,
          }}
          className="overflowstyle"
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            className="overflow-scroll"
            renderItem={(item, index) => {
              const createdAtMoment = item?.createdAt ? moment(item.createdAt) : null;
              const relativeTime = createdAtMoment ? createdAtMoment.fromNow() : '';
              const absoluteTime = createdAtMoment ? createdAtMoment.format('MMM DD, YYYY • hh:mm A') : '';
              const itemClassName = `notification-item ${item?.isRead ? 'read' : 'unread'}`;
              const titleText = item?.name || t('Notification');

              return (
                <List.Item key={item?.id ?? index} className={itemClassName}>
                  <List.Item.Meta
                    avatar={<Avatar src={`/assets/icons/notify-ic.png`} size={30} />}
                    title={
                      <Text className={`notification-title ${item?.isRead ? 'read' : 'unread'}`}>
                        {titleText}
                      </Text>
                    }
                    description={
                      <Flex vertical gap={4} className="notification-description">
                        {item?.message && (
                          <Text className="fs-13 text-gray notification-message">
                            {item.message}
                          </Text>
                        )}
                        {(relativeTime || absoluteTime) && (
                          <Flex gap={8} align="center">
                            {relativeTime && (
                              <Text className="fs-12 text-gray notification-time-relative">
                                {relativeTime}
                              </Text>
                            )}
                            {relativeTime && absoluteTime && (
                              <Text className="fs-12 text-gray">•</Text>
                            )}
                            {absoluteTime && (
                              <Text className="fs-12 text-gray notification-time-absolute">
                                {absoluteTime}
                              </Text>
                            )}
                          </Flex>
                        )}
                      </Flex>
                    }
                  />
                </List.Item>
              );
            }}
          />
          {showLoadMoreSpinner && (
            <Flex justify="center" className="mt-2">
              <Spin size="small" />
            </Flex>
          )}
        </div>
      ) : (
        <Text className="fs-13 text-gray">No notifications yet.</Text>
      )}
    </Card>
  );
}, [notifications, unreadCount, dropdownOpen, isLoadingNotifications, hasMoreNotifications, handleListScroll, t, NOTIFICATIONS_PAGE_SIZE]);

useEffect(() => {
  if (!dropdownOpen) {
    return;
  }

  const container = listContainerRef.current;
  if (!container) {
    return;
  }

  const parentScrollable = container.parentElement;
  if (!parentScrollable) {
    return;
  }

  const parentScrollHandler = (event) => {
    handleListScroll(event);
  };

  parentScrollable.addEventListener('scroll', parentScrollHandler, { passive: true });

  return () => {
    parentScrollable.removeEventListener('scroll', parentScrollHandler);
  };
}, [dropdownOpen, handleListScroll]);

  // Cleanup any pending hover-close timers when component unmounts
  useEffect(() => {
    return () => {
      if (browseHoverTimeoutRef.current) {
        clearTimeout(browseHoverTimeoutRef.current);
      }
    };
  }, []);

  // Handlers for smooth open/close of the top-level Browse menu
  const handleBrowseEnter = () => {
    if (browseHoverTimeoutRef.current) {
      clearTimeout(browseHoverTimeoutRef.current);
    }
    setBrowseOpen(true);
  };

  const handleBrowseLeave = () => {
    // Small delay prevents flicker when moving between parent and dropdown
    browseHoverTimeoutRef.current = setTimeout(() => {
      setBrowseOpen(false);
    }, 120);
  };

  return (
    <>
    {contextHolder}
      <div className='gen-navbar-container relative'>
        <div className='w-100'>
          <div className="gen-navbar-small">
            <div className="gen-navbar-inner">
              <div className='gen-navbar-left'>
                <Link to={'/'}>
                  <img src={'/assets/images/logo.webp'}  width={'100%'} alt="jusoor-logo" fetchPriority="high" />
                </Link>
              </div>
              <div className="gen-navbar-right">
                <Flex align='center' gap={10}>
                  <Dropdown menu={{ items: lang }} trigger={["click"]}>
                    <Button
                      onClick={(e) => e.preventDefault()}
                      className="bg-transparent btn-outline btn p-2 border-white"
                      aria-labelledby='Arrow down icon'
                    >
                      <Space align="center">
                      <Image 
                        src={selectedLang.icon}
                        width={20}
                        preview={false}
                        // alt="notification icon" 
                        alt={selectedLang.alt}
                        className="up"
                      />
                        <Text className="text-white fs-13">{selectedLang?.label}</Text>
                        <DownOutlined className="text-white" />
                      </Space>
                    </Button>
                  </Dropdown>
                  <Button className='bg-transparent border-0 p-0' onClick={()=> setVisible(true)}>
                    <img src='/assets/icons/menu-icon.png' alt='hamburger icon' width={30} fetchPriority="high" />
                  </Button>
                  {isshow && (
                    <Popover
                      content={dropdownContent}
                      trigger="click"
                      placement="bottomRight"
                      open={dropdownOpen}
                      onOpenChange={handleDropdownChange}
                      getPopupContainer={() => document.body}
                    >
                      <Badge size="small" count={unreadCount} overflowCount={99}>
                        <Button aria-labelledby="Notification" className="bg-transparent border-0 p-0">
                          <Image
                            src="/assets/icons/notification.png"
                            width={"28px"}
                            preview={false}
                            alt="notification icon"
                            className="up"
                          />
                        </Button>
                      </Badge>
                    </Popover>
                  )}
                </Flex>
              </div>
            </div>
          </div>
        </div>
        <div className={'gen-navbar'}>
          <div className="gen-navbar-inner container">
            <Flex gap={20} align='center'>
              <div className='gen-navbar-left'>
                <Link to={'/'}>
                  <img src='/assets/images/logo.webp' width={'100%'} className='one' alt="jusoor-logo" fetchPriority="high" />
                </Link>
              </div>
              <ul className='nav-list'>
                <li onMouseEnter={handleBrowseEnter} onMouseLeave={handleBrowseLeave} className={browseOpen ? 'open' : ''}>
                  <NavLink to={''}>
                    <Flex gap={10}>
                      <Text className='text-white nav-item'>{t("Browse Businesses")}</Text>
                      <DownOutlined className='fs-12 text-white' />
                    </Flex>
                  </NavLink>
              
                  <ul className='dropdown' style={{ display: browseOpen ? 'block' : undefined }}>
                    <li className='drop-item'>
                      <NavLink 
                        to={'/businesslisting'} 
                        className='drop-link'
                        onClick={() => setGetCategory(null)}
                      >
                        <Flex gap={10} align='center'>
                          <Image src={'/assets/icons/browseall.png'} alt='browse all icon' width={30} className='pt-1s' preview={false} />
                          <Flex justify='space-between' gap={50} align='flex-start' className='w-100'>
                            <Title level={5} className='m-0 fw-500'>{t("Browse All")}</Title>
                            <ArrowRightOutlined className='arr text-brand pt-1s' />
                          </Flex>
                        </Flex>
                      </NavLink>
                    </li>
                    {businessmenuData?.map((list, index) => (
                      <li className='drop-item' key={index}>
                        <NavLink onClick={(e)=>{e.preventDefault()}} className='drop-link'>
                          <Flex gap={10} align='center'>
                            <Image src={list?.icon} alt='icon menu item' width={30} className='pt-1s' preview={false} />
                            <Flex justify='space-between' gap={50} align='flex-start' className='w-100'>
                              <Title level={5} className='m-0 fw-500'>{list?.title}</Title>
                              <ArrowRightOutlined className='arr text-brand pt-1s' />
                            </Flex>
                          </Flex>
                        </NavLink>
                        <div className='sub-dropdown'>
                          <Row gutter={[32,32]}>
                            {renderSubdropdownItems(list.subdropdown)}
                          </Row>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
                {/* <li>
                  <NavLink to={''}>
                    <Flex gap={10}>
                      <Text className={`nav-item
                          ${
                            others ? 'text-brand':'text-white'
                          }
                        `}>
                        {t("Others")}
                      </Text>
                      <DownOutlined className={`fs-12
                          ${
                            others ? 'text-brand':'text-white'
                          }
                        `}/>
                    </Flex>
                  </NavLink>
                  
                  <ul className='dropdown' >
                    {othersmenu?.map((list, index) => (
                      <li className='drop-item' key={index}>
                        <NavLink to={list?.path} className='drop-link'>
                          <Flex gap={10} align='center'>
                            <Image src={list?.icon} width={30} className='pt-1s' preview={false} />
                            <Flex justify='space-between' gap={50} align='flex-start' className='w-100'>
                              <Title level={5} className='m-0 fw-500'>{list?.title}</Title>
                              <ArrowRightOutlined className='arr text-brand pt-1s' />
                            </Flex>
                          </Flex>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
                <li>
                  <NavLink to="/article">
                    <Text className={`nav-item ${location.pathname === '/article' || location.pathname.startsWith('/articlesingleview/') ? 'text-brand' : 'text-white'}`}>
                      {t("Articles")}
                    </Text>
                  </NavLink>
                </li> */}
                <li>
                  <NavLink to="/about">
                    <Text className={`nav-item ${location.pathname === '/about' ? 'text-brand' : 'text-white'}`}>
                      {t("About Jusoor")}
                    </Text>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/faq">
                    <Text className={`nav-item ${location.pathname === '/faq' ? 'text-brand' : 'text-white'}`}>
                      {t("FAQs")}
                    </Text>
                  </NavLink>
                </li>
              </ul>
            </Flex>
            <Flex gap={10} align='center'>
            <Dropdown menu={{ items: lang }} trigger={["click"]}>
              <Button
                onClick={(e) => e.preventDefault()}
                className="bg-transparent btn-outline btn p-2 border-white"
                aria-label="language button"
              >
                <Space align="center">
                  <Image 
                    src={selectedLang.icon}
                    width={20}
                    preview={false}
                    // alt="notification icon" 
                    alt={selectedLang.alt}
                    className="up"
                  />
                  <Text className="text-white fs-13">{selectedLang?.label}</Text>
                  <DownOutlined className="text-white" />
                </Space>
              </Button>
            </Dropdown>
              {
                !isshow ? 
                <Flex gap={5} justify='end'>
                  <Button aria-labelledby='Sign Up' className='btn btn-outline' onClick={()=>navigate('/signup')}>
                    {t("Sign Up")}
                  </Button>
                  <Button aria-labelledby='Login' className='btn bg-brand' onClick={()=>navigate('/login')}>
                   {t("Sign In")}
                  </Button>
                </Flex>
              :
              <Flex gap={10} align='center'>
                <Tooltip 
                  title={isUserInactive ? t("Account Verification Pending. Please contact support.") : ""}
                  trigger={['hover', 'click']}
                  placement="bottom"
                >
                  <Button 
                    aria-labelledby='Sell a Business' 
                    className='btn bg-brand' 
                    onClick={() => !isUserInactive && navigate('/sellbusinesscreate')}
                    disabled={isUserInactive}
                    style={{
                      opacity: isUserInactive ? 0.6 : 1,
                      cursor: isUserInactive ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <PlusOutlined /> {t("Sell a Business")}
                  </Button>
                </Tooltip>
              
                <Popover
                  content={dropdownContent}
                  trigger="click"
                  placement="bottomRight"
                  open={dropdownOpen}
                  onOpenChange={handleDropdownChange}
                  overlayClassName="notification-popover"
                  getPopupContainer={() => document.body}
                >
                  <Badge size="small" count={unreadCount} overflowCount={99}>
                    <Button aria-labelledby='Notification' className='bg-transparent border-0 p-0'>
                      <Image 
                        src='/assets/icons/notification.png' 
                        width={'28px'} 
                        preview={false}
                        alt="notification icon" 
                        className="up"
                      />
                    </Button>
                  </Badge>
                </Popover>

              <Dropdown menu={{ items }} trigger={['click']}>
                <Flex align='center' gap={10}>
                  <Avatar size={40} className='fs-16 text-brand fw-bold bg-light-brand textuppercase'>
                    {user?.name?.charAt(0)}
                  </Avatar>
                  <DownOutlined className='text-white fs-13' />
                </Flex>
              </Dropdown>
            </Flex>
              }
            </Flex>
          </div>
        </div>
      </div>
      <MobileNavbar 
        visible={visible}
        onClose={()=>setVisible(false)}
      />
    </>
  );
};

export { Navbar };