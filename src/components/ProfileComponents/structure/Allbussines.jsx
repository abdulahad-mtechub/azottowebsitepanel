import React,{useState,useEffect} from 'react'
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography,Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
const { Title, Text } = Typography
import {GETSELLERBUSINESS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import { allbussinesData } from '../../../data/sellerbussinesData';
import { Singlebusinessview } from './Singlebusinessview';
import { ModuleTopHeading } from '../../Pagecomponents';
import { PlusOutlined } from '@ant-design/icons';


const Allbussines = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [ singledetail,setSingleDetail ] = useState(null)
    const [limit, setLimit] = useState(10); // default limit
    const offset = (currentPage - 1) * limit;

    const { data: sellerBusinesses, loading, error, refetch } = useQuery(GETSELLERBUSINESS, {
        variables: {
          limit,
          offset,
        },
        fetchPolicy: 'network-only', // optional but ensures fresh data
      });
    
    useEffect(() => {
        refetch({ limit, offset });
    }, [limit, offset]);

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }
      
    if(singledetail){
        return (
            <Singlebusinessview singledetail={singledetail} setSingleDetail={setSingleDetail}/>
        )
    }

    return (
        <Flex gap={20} vertical>
             <Flex justify='space-between' align='center'>
                <ModuleTopHeading level={4} name='All Businesses' />
                <Flex gap={5}>
                    <Button className='btn bg-brand rounded-8' type='button'  onClick={() => navigate('/sellbusinesscreate')}>
                        <PlusOutlined /> Sell a Business
                    </Button>
                </Flex>
            </Flex>
            <Card className='border-gray'>
                <Row gutter={[16, 16]}>
                    {
                        sellerBusinesses?.getAllSellerBusinesses?.businesses?.map((pro, i) =>
                            <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={i}>
                                <Card className='h-100 border-gray rounded-12 card-cs cursor' onClick={() => setSingleDetail(pro?.id)}>
                                    <Flex vertical gap={20}>
                                        <Flex justify='space-between' align='center'>
                                            <Flex gap={4}>
                                                <Button className='fs-13'>
                                                    {pro?.category?.name}
                                                </Button>
                                                {
                                                    pro?.isByTakbeer !== undefined && (
                                                        <Button className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}>
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
                                        </Flex>
                                        <div>
                                            <div className='w-full card-img mb-2 rounded-12'>
                                                <img src="/assets/images/card-1.png" width={'100%'} height={'100%'} alt="" />
                                            </div>
                                            <Title className='' level={5}>
                                                {pro?.businessTitle}
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
                                            <Flex align='center' justify='space-between'>
                                                <Flex gap={3} align='center'>
                                                    <Image src='/assets/icons/reyal.png' preview={false} width={20} />
                                                    <Title level={4} className='m-0'>
                                                        {pro?.price}
                                                    </Title>
                                                </Flex>
                                                <Text className='text-brand fs-14'>
                                                    {pro.offerCount}
                                                </Text>
                                            </Flex>
                                        </div>
                                    </Flex>
                                </Card>
                            </Col>
                        )
                    }
                    {sellerBusinesses?.getAllSellerBusinesses?.totalCount > 0 ? (
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
                                    total={sellerBusinesses?.getAllSellerBusinesses?.totalCount || 0}
                                    onChange={(page) => {
                                        setCurrentPage(page);
                                }} />
                            </Col>
                        </Row>
                    </Col>  
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
        </Flex>
    )
}

export { Allbussines } 
