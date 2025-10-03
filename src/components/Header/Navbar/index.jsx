import { Typography, Button, Flex, Image, Row, Col, Badge, Dropdown, Avatar, Space,Spin, List, Divider, Card, Popover } from 'antd';
import './index.css';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { businessmenuData } from '../../../data';
import { useEffect, useState, useMemo, useRef } from 'react';
import { MobileNavbar } from './MobileNavbar';
import Cookies from "js-cookie";
import { useLazyQuery,useSubscription } from '@apollo/client';
import { NAVUSERDATA,NAVNOTIFICATION,NOTIFICATION } from '../../../graphql/query';
import { client } from '../../../config/apolloClient';
import { useTranslation } from 'react-i18next';
import {NEW_NOTIFICATION_SUBSCRIPTION} from '../../../graphql/subscription'

const { Text, Title } = Typography;

const Navbar = ({setGetCategory}) => { 
  const { t,i18n } = useTranslation();
  const userId = Cookies.get("userId"); // read userId from cookie
  const [isLoggedIn, setisLoggedIn] = useState(!!userId);
const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isshow, setIsShow] = useState(!!userId);
  const [user, setUser] = useState(null);
  const [ visible, setVisible ] = useState(false)
  const [notifications, setNotifications] = useState([]);
  const [notificationPage, setNotificationPage] = useState(1);
  const listContainerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.png",
    alt: "Language logo"
  });
  const [getUser, { data:me, loading: userLoading }] = useLazyQuery(NAVUSERDATA);
  const [getNavNotification, { data:navNotificationsData, loading: navNotificationLoading }] = useLazyQuery(NAVNOTIFICATION);
  const [getNotification, { data:notificationsData, loading: notificationLoading }] = useLazyQuery(NOTIFICATION);
  useSubscription(NEW_NOTIFICATION_SUBSCRIPTION, {
    onSubscriptionData: ({ subscriptionData }) => {
        const newNotif = subscriptionData.data?.newNotification;
        if (newNotif) {
            setNotifications((prev) => [newNotif, ...prev]);
        }
    }
  });
  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(lang); // ✅ now works
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png" }
        : { key: "1", label: "EN", icon: "assets/icons/en.png" }
    );
  }, [i18n]);
  useEffect(() => {
    if (userId) {
      getUser({ variables: { getNavUserId: userId } });
      getNavNotification({ variables: { userId } });
    }
  }, [userId, getNavNotification, getUser]);
  useEffect(() => {
    if (me?.getNavUser) {
      setUser(me.getNavUser);
    }
  }, [me]);

  useEffect(() => {
    const latestNotifications = notificationsData?.getNotifications?.notifications;
    if (latestNotifications) {
      setNotifications(latestNotifications);
    }
  }, [notificationsData]);

  useEffect(() => {
    setNotificationPage(1);
  }, [notifications.length]);

  useEffect(() => {
    if (listContainerRef.current && notifications.length > 0) {
      listContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [notificationPage, notifications.length]);
  const renderSubdropdownItems = (items) => {
    if (items.length <= 6) {
      return (
        <Col span={24}>
          <Flex gap={15} vertical className='w-100'>
            {items.map(item => (
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

  const handleLogout = () => {
    // Clear cookies
    Cookies.remove("userId");
    Cookies.remove("authToken");
  
    // Clear localStorage (in case you still store something there)
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userId");
  
    client.resetStore(); 
  
    setisLoggedIn(false);
    setIsShow(false);
  
    navigate('/');
    window.location.reload(); // optional hard reset
  };
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
          {t("Logout")}
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
            navigate('/profiledashboard')
          }}
        >
          {t("My Profile")}
        </a>
      ),
    },
  ];
  const handleChange = (lang) => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
  
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png", alt: "Arabic" }
        : { key: "1", label: "EN", icon: "assets/icons/en.png", alt: "English" }
    );
  
    // Optional: also update <html dir> for RTL support
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };
  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image src="assets/icons/en.png" width={20} alt="English" preview={false} />
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
    getNotification({
      variables: { userId: userId },
      fetchPolicy: "network-only"
    });
  }
};

// Memoize dropdown content
const notificationCount = notificationsData?.getNotifications?.count
  ?? (notifications.length > 0 ? notifications.length : undefined)
  ?? navNotificationsData?.getNotifications?.count
  ?? 0;

const dropdownContent = useMemo(() => {
  const data = notifications;
  const hasOverflow = data.length > 5;

  return (
    <Card className="rounded-12 card-cs size-notify">
      <Text>Notification ({notificationCount})</Text>
      <Divider className="bg-divider my-2" />
      {notificationLoading ? (
        <Text>Loading...</Text>
      ) : data.length > 0 ? (
        <div
          ref={listContainerRef}
          style={{
            maxHeight: hasOverflow ? 320 : 'auto',
            overflowY: hasOverflow ? 'auto' : 'visible',
            paddingRight: hasOverflow ? 4 : 0,
          }}
          className="overflowstyle"
        >
          <List
            itemLayout="horizontal"
            dataSource={data}
            className="overflow-scroll"
            pagination={{
              pageSize: 5,
              size: 'small',
              current: notificationPage,
              onChange: setNotificationPage,
              hideOnSinglePage: true,
            }}
            renderItem={(item, index) => (
              <List.Item key={index}>
                <List.Item.Meta
                  avatar={<Avatar src={`/assets/icons/notify-ic.png`} size={30} />}
                  title={
                    <NavLink to={""} className={"fw-500"}>
                      {item.name}
                    </NavLink>
                  }
                  description={
                    <Flex gap={5} align="center">
                      <Text className="fs-12 text-gray">1 hour ago</Text>
                      <Text className="fs-12 text-gray">12:24 AM</Text>
                    </Flex>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      ) : (
        <Text className="fs-13 text-gray">No notifications yet.</Text>
      )}
    </Card>
  );
}, [notificationCount, notificationLoading, notifications, notificationPage]);

  return (
    <>
      <div className='gen-navbar-container relative'>
        <div className='w-100'>
          <div className="gen-navbar-small">
            <div className="gen-navbar-inner">
              <div className='gen-navbar-left'>
                <Link to={'/'}>
                  <img src={'/assets/images/logo.png'}  width={'100%'} alt="jusoor-logo" fetchPriority="high" />
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
                          alt={selectedLang.label}
                          preview={false}
                        />
                        <Text className="text-white fs-13">{selectedLang.label}</Text>
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
                      overlayClassName="notification-popover"
                    >
                      <Badge size="small" count={notificationCount} overflowCount={99}>
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
                  <img src='/assets/images/logo.png' width={'100%'} className='one' alt="jusoor-logo" fetchPriority="high" />
                </Link>
              </div>
              <ul className='nav-list'>
                <li>
                  <NavLink to={''}>
                    <Flex gap={10}>
                      <Text className='text-white nav-item'>{t("Browse Businesses")}</Text>
                      <DownOutlined className='fs-12 text-white' />
                    </Flex>
                  </NavLink>
              
                  <ul className='dropdown' >
                    <li className='drop-item'>
                      <NavLink to={'/businesslisting'} className='drop-link'>
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
                        Others
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
                </li> */}
                <li>
                  <NavLink to="/article">
                    <Text className={`nav-item ${location.pathname === '/article' || location.pathname.startsWith('/articlesingleview/') ? 'text-brand' : 'text-white'}`}>
                      {t("Articles")}
                    </Text>
                  </NavLink>
                </li>
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
                  <Image src={selectedLang.icon} width={20} alt={selectedLang.alt} preview={false} />
                  <Text className="text-white fs-13">{selectedLang.label}</Text>
                  <DownOutlined className="text-white" />
                </Space>
              </Button>
            </Dropdown>
              {
                !isshow ? 
                <Flex gap={5} justify='end'>
                  <Button aria-labelledby='Sign Up' className='btn btn-outline' onClick={()=>navigate('/signup')}>
                    {t("Sign up")}
                  </Button>
                  <Button aria-labelledby='Login' className='btn bg-brand' onClick={()=>navigate('/login')}>
                   {t(" Sign In")}
                  </Button>
                </Flex>
              :
              <Flex gap={10} align='center'>
                <Button aria-labelledby='Sell a Business' className='btn bg-brand' onClick={() => navigate('/sellbusinesscreate')}>
                  <PlusOutlined /> {t("Sell a Business")}
                </Button>
              
                
                <Popover
                  content={dropdownContent}
                  trigger="click"
                  placement="bottom"
                  open={dropdownOpen}
                  onOpenChange={handleDropdownChange}
                  overlayClassName="notification-popover"
                >
                  <Badge size="small" count={notificationCount} overflowCount={99}>
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