import React from 'react'
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography } from 'antd'
import { soldbussinesData } from '../../../data'
import { Navigate, useNavigate } from 'react-router-dom'
const { Title, Text } = Typography
const Soldbussines = () => {
    const navigate = useNavigate();
    return (
        <Card className='border-gray'>
            <Row gutter={[16, 16]}>
                {
                    soldbussinesData?.map((pro, i) =>
                        <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={i}>
                            <Card className='h-100 border-gray rounded-12 card-cs cursor' onClick={() => navigate('/singleviewlisting/' + pro?.id)}>
                                <Flex vertical gap={20}>
                                    <Flex justify='space-between' align='center'>
                                        <Flex gap={4}>
                                            <Button className='fs-13'>
                                                Restaurant
                                            </Button>
                                            {
                                                pro?.type &&
                                                <Button className={`fs-12 text-white ${pro.type === 'Taqbeel' ? 'bg-brand' : 'bg-black'}`}>
                                                    {pro?.type}
                                                </Button>
                                            }
                                        </Flex>
                                        {pro?.status === 'Active' ? (
                                            <span className='badge-active rounded-8'>Active</span>
                                        ) : pro?.status === 'Inactive' ? (
                                            <span className='badge-inactive rounded-8'>Inactive</span>
                                        ) : pro?.status === 'Under-review' ? (
                                            <span className='badge-under-review rounded-8'>Under Review</span>
                                        ) : pro?.status === 'Sold' ? (
                                            <span className='badge-active rounded-8'>Sold</span>
                                        ) : null}


                                        {/* <span className='badge-review rounded-8'>Under-review</span> */}
                                    </Flex>
                                    <div>
                                        <div className='w-full card-img mb-2 rounded-12'>
                                            <img src="/assets/images/card-1.png" width={'100%'} height={'100%'} alt="" />
                                        </div>
                                        <Title className='' level={5}>
                                            {pro?.title}
                                        </Title>
                                        <Text className='fs-14 text-gray'>
                                            {pro?.description}
                                        </Text>
                                        <Divider className='my-1' />
                                        <Row justify={'space-between'}>
                                            {
                                                pro?.child?.map((item, c) => (
                                                    <React.Fragment key={c}>
                                                        <Col span={7}>
                                                            <Flex vertical>
                                                                <Title level={5} className='text-brand m-0 fs-13'>
                                                                    {item?.subtitle}
                                                                </Title>
                                                                <Text className='text-gray fs-12'>
                                                                    {item?.subdesc}
                                                                </Text>
                                                            </Flex>
                                                        </Col>
                                                        {
                                                            c < pro.child.length - 1 && (
                                                                <Divider type='vertical' style={{ height: 'auto' }} className='m-0' />
                                                            )
                                                        }
                                                    </React.Fragment>
                                                ))
                                            }
                                        </Row>
                                        <Divider className='my-1' />
                                        <Flex gap={3} align='center'>
                                            <Image src='/assets/icons/reyal.png' preview={false} width={20} />
                                            <Title level={4} className='m-0'>
                                                {pro?.amount}
                                            </Title>
                                        </Flex>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    )
                }
                <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Flex gap={5} align='center'>
                        <Text>Row Per page</Text>
                        <Select
                            className='select-filter'
                            defaultValue={10}
                            options={[
                                {
                                    value: 6,
                                    label: 6
                                },
                                {
                                    value: 10,
                                    label: 10
                                },
                                {
                                    value: 20,
                                    label: 20
                                },
                                {
                                    value: 50,
                                    label: 50
                                }
                            ]}
                        />
                    </Flex>
                </Col>
                <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                    <Pagination className='pagination' align="end" defaultCurrent={1} total={50} />
                </Col>
            </Row>
        </Card>
    )
}

export { Soldbussines } 
