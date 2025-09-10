import React from 'react'
import { Button, Card, Col, Divider, Flex, Image, Row, Typography,Spin } from 'antd'
import { exploreData } from '../../../data/featureData'
import { RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { GETRANDOMBUSINESS } from '../../../graphql/query/business'
import { useQuery } from "@apollo/client";

const { Text, Title, Paragraph } = Typography
const ExploreLive = () => {
    const navigate = useNavigate()
    const  {data, loading , error,refetch} = useQuery(GETRANDOMBUSINESS);

    const exploreData = data?.getRandomBusinesses?.map(item => ({
        id: item.id,
        categoryName: item?.category?.name,
        ref:item.reference,
        title:item.businessTitle,
        description:item.description,
        amount: item.price,
        save: item.isSaved,
        status: item.isSold,
        type: item.isByTakbeer,
        child:[
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle:item.revenue,
                subdesc:'Revenue/month',
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle:item.profit,
                subdesc:'Profit/month',
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle:`${item?.recoveryTime} months`,
                subdesc:'Capital Recovery',
            },
        ]
    })) || [];

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }
    const truncateChars = (text, max = 25) => {
        if (!text) return "";
        // handle unicode safely
        const chars = Array.from(text);
        return chars.length > max ? chars.slice(0, max).join("") + "..." : text;
      };
    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[12, 24]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500 bg-secondary fw-500 text-brand'>Explore Live Listings</div>
                            <Title className='m-0' level={2}>
                                Businesses Currently <span className='text-brand'>Available for Sale</span>
                            </Title>
                            <Text className='fs-14 d-inline'>
                                Discover a created selection of verified businesses across various categories and cities in Saudi Arabia. Use filters to narrow down by industry, location, price, and more
                            </Text>
                        </Flex>
                    </Col>
                    {
                        exploreData?.slice(0,4)?.map((pro,i)=>
                            <Col xl={{span: 6}} lg={{span: 8}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>
                                <Card className='h-100 border-gray rounded-12 card-cs' >
                                    <Flex vertical gap={20}>
                                        <Flex justify='space-between' align='center'>
                                            <Flex gap={4}>
                                                <Button className='fs-13' aria-labelledby='Restaurant'>
                                                {truncateChars(pro?.categoryName, 20)}
                                                </Button>
                                                {typeof pro?.type === "boolean" && (
                                                <Button
                                                    aria-labelledby="type"
                                                    className={`fs-12 text-white ${pro.type ? 'bg-brand' : 'bg-black'}`}
                                                >
                                                    {pro.type ? "Taqbeel" : "Acquiring"}
                                                </Button>
                                                )}
                                            </Flex>
                                            <Button className='border-0 bg-transparent p-0' aria-labelledby='bookmarked button'>
                                                {
                                                    pro?.save === true ?
                                                    <img src='/assets/icons/bk-bl-d.png' alt='bookmarked-image' width={22} />: 
                                                    <img src='/assets/icons/bk-bl.png' alt='un-bookmarked-image' width={22} />
                                                }
                                            </Button>
                                            
                                        </Flex>
                                        <div>
                                            <div className='w-full card-img mb-2 rounded-12'>
                                                <img src="/assets/images/card-1.png" width={'100%'} height={'100%'} alt="product-image" />
                                            </div>
                                            <Title className='' level={5}>
                                                {truncateChars(pro?.title, 42)}
                                            </Title>
                                            <Paragraph
                                                ellipsis={{ rows: 3, expandable: false, symbol: 'more' }}
                                                className='fs-14 text-gray'
                                            >
                                                {pro?.description}
                                            </Paragraph>
                                            <Divider className='my-1' />
                                            <Row justify={'space-between'}>
                                                {
                                                    pro?.child?.map((item, c) => (
                                                        <React.Fragment key={c}>
                                                            <Col span={7}>
                                                                <Flex vertical>
                                                                    <Text className='text-brand fw-500 m-0 fs-13'>
                                                                        {item?.id !== 3 && <img src="/assets/icons/reyal-b.png" width={8} alt="currency-symbol" />} {item?.subtitle}
                                                                    </Text>
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
                    <Col span={24}>
                        <Flex justify='center'>
                            <Button onClick={()=>navigate('/businesslisting')} className='btn bg-brand' aria-labelledby='Browse Businesses'>
                                Browse Businesses <RightOutlined className='fs-10' />
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { ExploreLive }
