import { Row, Col, Image, Space, Typography, Divider, Flex, Button } from 'antd'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { WhatsAppOutlined } from '@ant-design/icons'
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography
const Footer = () => {
    const {t}= useTranslation()
    
const footerlinkData = [
    {
        id: 1,
        title: t('Categories'),
        links:[
            {
                id: 1,
                name: t('Restaurants & Cafes'),
                path: '/businesslisting'
            },
            {
                id: 2,
                name: t('Retail Services'),
                path: '/businesslisting'
            },
            {
                id: 3,
                name: t('Health, Beauty & Fitness'),
                path: '/businesslisting'
            },
            {
                id: 4,
                name: t('Automotive, Transportation & Logistics'),
                path: '/businesslisting'
            },
            {
                id: 5,
                name: t('Tech & Software'),
                path: '/businesslisting'
            },
        ]
    },
    {
        id: 1,
        title: t('Quick Link'),
        links:[
            {
                id: 1,
                name: t('About Jusoor'),
                path: '/about'
            },
            {
                id: 2,
                name: t('FAQs'),
                path: '/faq'
            },
            {
                id: 3,
                name: t('Term of Use'),
                path: '/termofuse'
            },
            {
                id: 4,
                name: t('Articles'),
                path: '/article'
            },
        ]
    },
]
    const navigate = useNavigate()
    const userId = Cookies.get("userId");
  return (
    <div className='footer' id='footer'>
        <div className='container'>
            <Row gutter={[24,24]} justify={'space-between'}>
                <Col lg={{span: 9}} md={{span: 24}} xs={{span: 24}} sm={{span: 24}}>
                    <Space direction='vertical' size={20} className='w-100'>
                        <div className='mb-1'>
                            <Link to={'/'}>
                                <img src='/assets/images/logo.png' alt='jusoor-logo' width={130} fetchPriority="high"/>
                            </Link>
                        </div>
                        <Text className='fs-13 text-white w-500'>
                            {t("Jusoor is a Saudi marketplace for buying and selling verified businesses — with secure payments, trusted documents, and smooth ownership transfers.")}
                        </Text>
                        <Flex gap={20}>
                            <Link to="#" target="_blank" rel="noopener noreferrer">
                                <Image src='/assets/icons/facebook.png' width={'23px'} alt='facebook-icon' preview={false} />
                            </Link>
                            <Link to="#" target="_blank" rel="noopener noreferrer">
                                <Image src='/assets/icons/instagram.png' width={'23px'} alt='facebook-icon' preview={false} />
                            </Link>
                            <Link to="#" target="_blank" className='text-white'>
                                <WhatsAppOutlined className='fs-23' />
                            </Link>
                        </Flex>
                    </Space>
                </Col>
                {
                    footerlinkData?.map((list,index)=>
                    <Col lg={{span: 5}} md={{span: 24}} xs={{span: 24}} sm={{span: 24}} key={index}>
                        <Flex vertical gap={15}>
                            <Title level={4} className='m-0 text-white'>{list?.title}</Title>
                            <ul className='ul-list'>    
                                {
                                    list?.links?.map((item,i)=>
                                        <li key={i}>
                                            <NavLink to={item?.path}>
                                                {
                                                    item?.name
                                                }
                                            </NavLink>
                                        </li>
                                    )
                                }
                            </ul>
                        </Flex>
                    </Col>
                    )
                }
                <Col lg={{span: 5}} md={{span: 24}} xs={{span: 24}} sm={{span: 24}}>
                    <Flex vertical gap={15}>
                        <Title level={4} className='m-0 text-white'>
                            {
                                userId ? t('Contact Us') : t('Need more help?')
                            }
                        </Title>
                        <Text className='fs-14 text-white'>
                            {
                                userId ? t('Contact us to access support, tools, and verified listings.') : t('Sign up to access support, tools, and verified listings.')
                            }
                        </Text>
                        <Flex>
                            {
                                userId ?
                                <NavLink to={'tel:1233242442'} className='text-white'>
                                    <Flex gap={5} align='center'>
                                        <WhatsAppOutlined className='fs-18' />
                                        12345667775
                                    </Flex>
                                </NavLink>
                                :
                                <Button type='primary' aria-labelledby='Sign Up' className='btn bg-brand' onClick={()=>navigate('/signup')}>
                                    Sign Up
                                </Button>
                            }
                        </Flex>
                    </Flex>
                </Col>
                <Col span={24}>
                    <Divider className='m-0 bg-brand'/>
                </Col>
                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                    <Flex align='items-center' className='w-100 quote' gap={20}>
                        <Typography.Text className='fs-12 text-white'>
                        {t("Copyright © {{year}} Jusoor", { year: new Date().getFullYear() })}
                        </Typography.Text>
                        <span className='text-brand'> | </span>
                        <NavLink to={''} className='fs-12 text-white'>
                            {t("Design by Repla Technologies")}
                        </NavLink>
                    </Flex>
                </Col>
                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                    <Flex  align='items-center' className='w-100 lastlink' gap={20}>
                        <NavLink to={'/termofuse'} className='fs-12 text-white'>
                            {t("Term of use")}
                        </NavLink>
                        <span className='text-brand'> | </span>
                        <NavLink to={'/privacypolicy'} className='fs-12 text-white'>
                            {t("Privacy Policy")}
                        </NavLink>
                    </Flex>
                </Col>
            </Row>
        </div>
    </div>
  )
}

export {Footer}