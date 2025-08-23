import { Typography, Button, Flex, Image, Row, Col, Badge, Dropdown, Avatar, Space } from 'antd';
import './index.css';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { businessmenuData, othersmenu } from '../../../data';
import { useEffect, useState,useContext } from 'react';
import { MobileNavbar } from './MobileNavbar';
import Cookies from "js-cookie";
import { useLazyQuery } from '@apollo/client';
import { ME,NOTIFICATION } from '../../../graphql/query';

const { Text, Title } = Typography;

const Navbar = ({setGetCategory}) => { 
  const userId = Cookies.get("userId"); // read userId from cookie
  const [isLoggedIn, setisLoggedIn] = useState(!!userId);
  const [isshow, setIsShow] = useState(!!userId); // true if userId exists
  const [user, setUser] = useState(null);
  const [notificationCount, setNotificationCount] = useState();
  const [ visible, setVisible ] = useState(false)
  const location = useLocation();
  const navigate = useNavigate()
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.png",
  });
  const otherPaths = ['/about', '/termofuse'];
  // ✅ Setup the lazy query
  const [getUser, { data:me, loading: userLoading, error:userError }] = useLazyQuery(ME);
  const [getNotification, { data:notifications, loading: notificationLoading, error:notificationError }] = useLazyQuery(NOTIFICATION);

  useEffect(() => {
    if (userId) {
      getUser({ variables: { getUserId: userId } });
      getNotification({ variables: { userId } });
    }
  }, [userId]);

  useEffect(() => {
    if (me?.getUser) {
      setUser(me.getUser);
      setNotificationCount(notifications?.length)
    }
  }, [me]);
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
    logout();  // This clears localStorage and sets isLoggedIn = false
    navigate('/login');
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
          Logout
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
          My Profile
        </a>
      ),
    },
  ];

  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image src="assets/icons/en.png" width={20} alt="English" preview={false} />
          <Text className='fs-13'>EN</Text>
        </Space>
      ),
      onClick: () =>
        setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png" }),
    },
    {
      key: "2",
      label: (
        <Space>
          <Image src="assets/icons/ar.png" width={20} alt="Arabic" preview={false} />
          <Text className='fs-13'>AR</Text>
        </Space>
      ),
      onClick: () =>
        setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
    },
  ];

  return (
    <>
      <div className='gen-navbar-container' style={{ position: 'relative' }}>
        <div className='w-100'>
          <div className="gen-navbar-small">
            <div className="gen-navbar-inner">
              <div className='gen-navbar-left'>
                <Link to={'/'}>
                  <img src={'/assets/images/logo.png'} width={'100%'} alt="logo" />
                </Link>
              </div>
              <div className="gen-navbar-right">
                <Flex align='center' gap={10}>
                  <Dropdown menu={{ items: lang }} trigger={["click"]}>
                    <Button
                      onClick={(e) => e.preventDefault()}
                      className="bg-transparent btn-outline btn p-2 border-white"
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
                  <div className="sp-cover"  onClick={()=> setVisible(true)}>
                    <span className="sp sp-1 sp-1-click"></span>
                    <span className="sp sp-2 sp-2-click"></span>
                    <span className="sp sp-3 sp-3-click"></span>
                  </div>
                  {
                    isshow &&
                    <>
                      <Badge size="small" count={1} overflowCount={1} >
                        <Button className='bg-transparent border-0 p-0'>
                          <Image 
                            src='/assets/icons/notification.png' 
                            width={'28px'} 
                            preview={false}
                            alt="tci" 
                            className="up"
                          />
                        </Button>
                      </Badge>
                      <Dropdown
                        menu={{items}}
                        trigger={['click']}
                      >
                        
                        <Image src='/assets/images/av-1.png' preview={false} width={30} style={{borderRadius:50}}/>
                      </Dropdown>
                    </>
                  }
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
                  <img src='/assets/images/logo.png' width={'100%'} className='one' alt="logo" />
                </Link>
              </div>
              <ul className='nav-list'>
                <li>
                  <NavLink to={''}>
                    <Flex gap={10}>
                      <Text className='text-white nav-item'>Browse Businesses</Text>
                      <DownOutlined className='fs-12 text-white' />
                    </Flex>
                  </NavLink>
              
                  <ul className='dropdown' >
                  {businessmenuData?.map((list, index) => (
                      <li className='drop-item' key={index}>
                        <NavLink onClick={(e)=>{e.preventDefault()}} className='drop-link'>
                          <Flex gap={10} align='center'>
                            <Image src={list?.icon} width={30} className='pt-1s' preview={false} />
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
                    <li className='drop-item'>
                      <NavLink to={'/businesslisting'} className='drop-link'>
                        <Flex gap={10} align='center'>
                          <Image src={'/assets/icons/browseall.png'} width={30} className='pt-1s' preview={false} />
                          <Flex justify='space-between' gap={50} align='flex-start' className='w-100'>
                            <Title level={5} className='m-0 fw-500'>Browse All</Title>
                            <ArrowRightOutlined className='arr text-brand pt-1s' />
                          </Flex>
                        </Flex>
                      </NavLink>
                    </li>
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
                      Articles
                    </Text>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about">
                    <Text className={`nav-item ${location.pathname === '/about' ? 'text-brand' : 'text-white'}`}>
                      About Jusoor
                    </Text>
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/faq">
                    <Text className={`nav-item ${location.pathname === '/faq' ? 'text-brand' : 'text-white'}`}>
                      FAQs
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
              {
                !isshow ? 
                <Flex gap={5} justify='end'>
                  <Button className='btn btn-outline' onClick={()=>navigate('/signup')}>
                    Sign up
                  </Button>
                  <Button className='btn bg-brand' onClick={()=>navigate('/login')}>
                    Login
                  </Button>
                </Flex>
              :
              <Flex gap={10} align='center'>
                <Button className='btn bg-brand' onClick={() => navigate('/sellbusinesscreate')}>
                  <PlusOutlined /> Sell a Business
                </Button>
              
                <Badge size="small" count={notificationCount} overflowCount={1}>
                  <Button className='bg-transparent border-0 p-0'>
                    <Image 
                      src='/assets/icons/notification.png' 
                      width={'28px'} 
                      preview={false}
                      alt="tci" 
                      className="up"
                    />
                  </Button>
                </Badge>

              <Dropdown menu={{ items }} trigger={['click']}>
                <Flex align='center' gap={10}>
                  {/* Profile Initial Avatar */}
                  {/* <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#4F46E5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {user?.name?.charAt(0)}
                  </div> */}
                  <Avatar size={40} className='fs-16 text-brand' style={{backgroundColor:'#E9EEFC',textTransform:'uppercase',fontWeight:'bold'}}>
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