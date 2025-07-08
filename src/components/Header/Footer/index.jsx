import { Row, Col, Image, Space, Typography, Divider, Flex, Button } from 'antd'
import { Link, NavLink } from 'react-router-dom'
import { footerlinkData } from '../../../data'
import { WhatsAppOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const Footer = () => {


  return (
    <div className='footer'>
        <div className='container'>
            <Row gutter={[24,24]} justify={'space-between'}>
                <Col lg={{span: 9}} md={{span: 24}} xs={{span: 24}} sm={{span: 24}}>
                    <Space direction='vertical' size={20} className='w-100'>
                        <div className='mb-1'>
                            <Link to={'/'}>
                                <img src='/assets/images/logo.png' width={130}/>
                            </Link>
                        </div>
                        <Text className='fs-13 text-white w-500'>
                            Jusoor is a Saudi marketplace for buying and selling verified businesses — with secure payments, trusted documents, and smooth ownership transfers.
                        </Text>
                        <Flex gap={10}>
                            <Link to="#" target="_blank" rel="noopener noreferrer">
                                <Image src='/assets/icons/facebook.png' width={'23px'} preview={false} />
                            </Link>
                            <Link to="#" target="_blank" rel="noopener noreferrer">
                                <Image src='/assets/icons/instagram.png' width={'23px'} preview={false} />
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
                        <Title level={4} className='m-0 text-white'>Need more help</Title>
                        <Text className='fs-14 text-white'>
                            Vestibulum ante ipsum primis in faucibus orci luctus et ult
                        </Text>
                        <Flex>
                            <Button type='primary' className='btn bg-brand'>
                                Sign Up
                            </Button>
                        </Flex>
                    </Flex>
                </Col>
                <Col span={24}>
                    <Divider className='m-0 bg-brand'/>
                </Col>
                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                    <Flex align='items-center' className='w-100 quote' gap={20}>
                        <Typography.Text className='fs-12 text-white'>
                            Copyright © {new Date().getFullYear()} Jusoor
                        </Typography.Text>
                        <span className='text-brand'> | </span>
                        <NavLink to={''} className='fs-12 text-white'>
                            Design by Repla Technologies
                        </NavLink>
                    </Flex>
                </Col>
                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                    <Flex  align='items-center' className='w-100 lastlink' gap={20}>
                        <NavLink to={''} className='fs-12 text-white'>
                            Term of use
                        </NavLink>
                        <span className='text-brand'> | </span>
                        <NavLink to={''} className='fs-12 text-white'>
                            Privacy Policy
                        </NavLink>
                    </Flex>
                </Col>
            </Row>
        </div>
    </div>
  )
}

export {Footer}