import React,{useState,useEffect} from 'react'
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import {GETFAVORITBUSINESS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const { Title, Text } = Typography
const Favoritbussines = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10); // default limit
    const offset = (currentPage - 1) * limit;

    const { data: sellerSoldBusinesses, loading, error, refetch } = useQuery(GETFAVORITBUSINESS);
    
    useEffect(() => {
        refetch({ limit, offset });
    }, [limit, offset]);

    return (
        <Card className='border-gray'>
            <Row gutter={[16, 16]}>
                {
                    sellerSoldBusinesses?.getFavoritBusiness?.businesses?.map((pro, i) =>
                        <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={i}>
                            <Card className='h-100 border-gray rounded-12 card-cs cursor' onClick={() => navigate('/singleviewlisting/' + pro?.id)}>
                                <Flex vertical gap={20}>
                                    <Flex justify='space-between' align='center'>
                                         <Flex gap={4}>
                                            <Button aria-labelledby='Category name' className='fs-13'>
                                                {pro?.category?.name}
                                            </Button>
                                            {
                                                pro?.isByTakbeer !== undefined && (
                                                    <Button aria-labelledby='type' className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}>
                                                    {pro.isByTakbeer ? 'Taqbeel' : 'Direct'}
                                                    </Button>
                                                )
                                            }
                                        </Flex>
                                        {pro?.status === 'ACTIVE' ? (
                                            <span className='badge-active rounded-8'>Active</span>
                                        ) : pro?.status === 'INACTIVE' ? (
                                            <span className='badge-inactive rounded-8'>Inactive</span>
                                        ) : pro?.status === 'UNDER_REVIEW' ? (
                                            <span className='badge-review rounded-8'>Under Review</span>
                                        ) : null}


                                        {/* <span className='badge-review rounded-8'>Under-review</span> */}
                                    </Flex>
                                    <div>
                                        <div className='w-full card-img mb-2 rounded-12'>
                                            <img src="/assets/images/card-1.png" width={'100%'} height={'100%'} alt="product-image" />
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
                                                {pro?.price}
                                            </Title>
                                        </Flex>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    )
                }
                {sellerSoldBusinesses?.getAllSellerBusinesses?.totalCount > 0 ? (
                <Row gutter={[16, 16]}>
                <Col span={24} className='mt-3'>
                    <Row justify="space-between" align="middle">
                        <Col span={6}>
                            <Flex gap={5} align='center'>
                                <Text>Rows Per Page:</Text>
                                <Select
                                    className="select-filter"
                                    value={limit}
                                    onChange={(value) => {
                                        setLimit(value);
                                        setCurrentPage(1); // reset to first page when limit changes
                                    }}
                                    options={[
                                        { value: 6, label: 6 },
                                        { value: 10, label: 10 },
                                        { value: 20, label: 20 },
                                        { value: 50, label: 50 },
                                    ]}
                                    />
                            </Flex>
                        </Col>
                        <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                            <Pagination className='pagination' align="end" pageSize={limit}
                                total={sellerSoldBusinesses?.getAllSellerBusinesses?.totalCount || 0}
                                onChange={(page) => {
                                    setCurrentPage(page);
                            }} />
                        </Col>
                        </Row>
                    </Col>    
                </Row>
                ) : (
                    <Row>
                      <Col span={24} className='text-center mt-4'>
                        <Text>No Business Found</Text>
                      </Col>
                    </Row>
                  )
                }
            </Row>
        </Card>
    )
}

export { Favoritbussines } 
