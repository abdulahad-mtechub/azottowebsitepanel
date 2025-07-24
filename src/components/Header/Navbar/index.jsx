import { Typography, Button, Flex, Image, Row, Col, Badge, Dropdown } from 'antd';
import './index.css';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons';
import { businessmenuData, othersmenu } from '../../../data';
import { useEffect, useState,useContext } from 'react';
import { MobileNavbar } from './MobileNavbar';
import { AuthContext } from '../../../context/AuthContext';


const { Text, Title } = Typography;

const Navbar = ({setGetCategory}) => { 

  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isshow, setIsShow] = useState(isLoggedIn);
  const [ visible, setVisible ] = useState(false)
  const navigate = useNavigate()
  const otherPaths = ['/about', '/faq', '/termofuse', '/article'];
  const others = otherPaths.includes(location.pathname);


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
                              <Title level={5} className='m-0'>{list?.title}</Title>
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
                      <NavLink to={'/browseall'} className='drop-link'>
                        <Flex gap={10} align='center'>
                          <Image src={'/assets/icons/browseall.png'} width={30} className='pt-1s' preview={false} />
                          <Flex justify='space-between' gap={50} align='flex-start' className='w-100'>
                            <Title level={5} className='m-0'>Browse All</Title>
                            <ArrowRightOutlined className='arr text-brand pt-1s' />
                          </Flex>
                        </Flex>
                      </NavLink>
                    </li>
                  </ul>
                </li>
                <li>
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
                              <Title level={5} className='m-0'>{list?.title}</Title>
                              <ArrowRightOutlined className='arr text-brand pt-1s' />
                            </Flex>
                          </Flex>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </Flex>
            <div>
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
                <Button className='btn bg-brand' onClick={()=>navigate('/sellbusinesscreate')}>
                  <PlusOutlined /> Sell a Business
                </Button>
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
                  <Flex align='center' gap={10}>
                    <Image src='/assets/images/av-1.png' preview={false} width={40} style={{borderRadius:50}}/>
                    <DownOutlined className='text-white fs-13' />
                  </Flex>
                </Dropdown>
              </Flex>
              }
            </div>
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