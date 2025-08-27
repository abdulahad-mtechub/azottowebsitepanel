import React from 'react'
import { Card, Row, Col, Flex, Typography, Breadcrumb, Space, Button, Image, Tabs } from 'antd'
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { allbussinesData } from '../../../data';
import { SellerOfferTable } from './SellerOfferTable';
import { SellerDealDetails } from './SellerDealDetails';
const { Text, Title } = Typography;
const Singlebusinessview = ({setSingleDetail}) => {

    const items = [
        {
            key:'1',
            label:'Deals',
            children: <SellerDealDetails />
        },
        {
            key:'2',
            label:'Offer',
            children:<SellerOfferTable/>
        },
    ]

    return (
        <div className='mb-2'>
            <Flex vertical gap={20}>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            {
                                title: <Text className='fs-13 text-gray' italic>Business Listing</Text>,
                            },
                            {
                                title: <Text className='fw-500 fs-13 text-black' italic>Al Madinah Coffee Shop</Text>,
                            },
                        ]}
                    />
                    <Flex justify='space-between'>
                        <Space>
                            <Button type='button' className='p-0 border-0 bg-transparent' onClick={()=>setSingleDetail(null)}>
                                <ArrowLeftOutlined />
                            </Button>
                            <Title level={5} className='m-0'>Al Madinah Coffee Shop</Title>
                        </Space>
                        <Space>
                            <Button className='btn bg-brand rounded-8' type='button'>
                                Edit
                            </Button>
                            <Button className='btn bg-red rounded-8' type='button'>
                                Inactivate Business
                            </Button>
                        </Space>
                    </Flex>
                    <Card className='radius-12 border-gray card-cs'>
                        <Row gutter={[16, 16]}>
                            {
                                allbussinesData[0]?.detailinfo.map((data, i) => (
                                    <Col lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} key={i}>
                                        <Card className='h-100 border-gray rounded-12' >
                                            <Flex vertical gap={15}>
                                                <Image src={data?.img} preview={false} width={40} />
                                                <div>
                                                    <Text className='fs-14 text-gray'>
                                                        {data?.title}
                                                    </Text>
                                                    <Title className='m-0' level={5}>
                                                        {data?.numbers}
                                                    </Title>

                                                </div>
                                            </Flex>
                                        </Card>
                                    </Col>
                                ))
                            }

                            <Col span={24}>
                                <Tabs 
                                    className='tabs-fill'
                                    defaultActiveKey="1"
                                    items={items}
                                />
                            </Col>

                        </Row>
                    </Card>
                </Flex>
        </div>
    )
}

export { Singlebusinessview } 
