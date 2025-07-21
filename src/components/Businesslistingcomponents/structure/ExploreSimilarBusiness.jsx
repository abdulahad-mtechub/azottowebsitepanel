import { Button, Card, Col, Divider, Flex, Image, Row, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { exploreData } from '../../../data'
import React from 'react'
import { useQuery } from '@apollo/client';
import { GET_RANDOM_BUSINESSES } from '../../../graphql';

const { Text, Title } = Typography
const ExploreSimilarBusiness = ({id}) => {
    const { data, loading, error } = useQuery(GET_RANDOM_BUSINESSES, {
        variables: { getRandomBusinessesId: id },
        skip: !id, // in case id is undefined
      });
    const randomBusiness = data?.getRandomBusinesses;
    const mappedBusinesses = randomBusiness?.map((b) => ({
        ...b,
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: `SAR ${b?.revenue?.toLocaleString?.() || '0'}`,
                subdesc: 'Revenue/month',
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: `SAR ${b?.profit?.toLocaleString?.() || '0'}`,
                subdesc: 'Profit/month',
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: `${b?.recoveryTime || 'N/A'} months`,
                subdesc: 'Capital Recovery',
            },
        ],
    }));
    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 60]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500 bg-secondary fw-500 text-brand'>You May Also Like</div>
                            <Title className='m-0' level={2}>
                                Explore Similar <span className='text-brand'>Businesses</span>
                            </Title>
                            <Text className='fs-14'>
                                Discover other verified businesses with similar category tailored to your interests.
                            </Text>
                        </Flex>
                    </Col>
                    {
                        mappedBusinesses?.slice(0,4)?.map((pro,i)=>
                            <Col lg={{span: 6}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>
                                <Card className='h-100 border-gray rounded-12 card-cs' >
                                    <Flex vertical gap={20}>
                                        <Flex justify='space-between' align='center'>
                                            <Button>
                                                {pro?.category?.name}
                                            </Button>
                                            <Flex gap={4}>
                                                <Button className='fs-13'>
                                                    Restaurant
                                                </Button>
                                                {
                                                    pro?.type &&
                                                    <Button className={`fs-12 text-white ${pro.type === 'Taqbeel'?'bg-brand':'bg-black'}`}>
                                                        {pro?.type}
                                                    </Button>
                                                }
                                            </Flex>
                                            <Button className='border-0 bg-transparent p-0'>
                                                {
                                                    pro?.isSaved ?
                                                    <img src='/assets/icons/bk-bl-d.png' width={22}/> :
                                                    <img src='/assets/icons/bk-bl.png' width={22}/>
                                                }
                                            </Button>
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
                </Row>
            </div>
        </div>
    )
}

export { ExploreSimilarBusiness }
