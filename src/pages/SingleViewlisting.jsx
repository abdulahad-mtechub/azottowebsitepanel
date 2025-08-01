import React, { useEffect } from 'react'
import { Breadcrumb, Button, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { inventColumn, keyassetsColumn, liabColumn, postsaleColumns } from '../data';
import { AnnualProfitBarChart, BusinessInfoCard, BusinessInfoCardMobile, ExploreSimilarBusiness, MarketAreaChart, PreviewTableContent } from '../components';
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GET_BUSINESS } from '../graphql/query/business';

const { Text, Title } = Typography;
const SingleViewlisting = () => {
    const [form] = Form.useForm(); 
    const { id } = useParams()
    const navigate = useNavigate();
    // const business = exploreData?.find((item)=>item?.id == id)
    const { data, loading, error } = useQuery(GET_BUSINESS, {
        variables: { getBusinessByIdId: id },
        skip: !id, // in case id is undefined
      });
    
      const business = data?.getBusinessById;
      const postSaleData = [
        {
          key: '1',
          period: business?.suppportDuration || 'N/A',
          session: business?.supportSession || 'N/A',
          verified: business?.isSupportVerified, // 1 or 0
        }
      ];

      const liabilitiesData = business?.liabilities?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: `SAR ${item?.price.toLocaleString()}`,
      }));
      
      const assetsData = business?.assets?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item?.purchaseYear,
        price: `SAR ${item?.price.toLocaleString()}`,
      }));
      
      const inventoryData = business?.inventoryItems?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: `SAR ${item.price?.toLocaleString()}`,
      }));
    
    useEffect(() => {
        // Fetch business detail using id
        // You can use it in a query to fetch full business
      }, [id]);
    return (
        <div className='padd-1 relative'>
            <div className='container'>
                <Breadcrumb
                    separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                    className='my-2 pt-1'
                    items={[
                        {
                            title: <Text className='cursor text-gray' onClick={() => navigate('/')}>Home</Text>,
                        },
                        {
                            title: <Text className='cursor text-gray' 
                            onClick={() => navigate('/businesslisting')}>Browse Businesses</Text>,
                        },
                        {
                            title: <Text className='fw-500'>
                                {business?.businessTitle ? business?.businessTitle : 'Not Found'}
                            </Text>,
                        },
                    ]}
                />
            </div>
            <div className='bg-img' style={{backgroundImage:'url(/assets/images/card-1.png)'}}>
                <div className='container'>
                    <Flex vertical gap={5} className='text-center'>
                        <Text className='text-white'>Reference #: {business?.reference ? business?.reference: 'Not Found'}</Text>
                        <Title level={2} className='text-white m-0'>{business?.businessTitle ? business?.businessTitle : 'Not Found'}</Title>
                    </Flex>
                </div>
            </div>
            <div className='container'>
                <Row gutter={[24,24]} className='mt-3'>
                    <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Card className='shadow-d radius-12 border-gray mb-3'>
                            <Flex vertical gap={10}>
                                <Flex vertical gap={1}>
                                    <Text className='fs-13 text-gray fw-500'>Reference #: {business?.reference ? business?.reference: 'Not Found'}</Text>
                                    <Title level={5} className='m-0'>
                                        {business?.businessTitle}
                                    </Title>
                                    <Flex align='center' gap={5}>
                                        <Title level={5} className='m-0'>
                                            {data?.title}
                                        </Title>
                                        {
                                            data?.type &&
                                            <Button className={`fs-12 border-0 text-white ${data.type === 'Taqbeel'?'bg-brand':'bg-black'}`}>
                                                {data?.type}
                                            </Button>
                                        }
                                    </Flex>
                                </Flex>
                                <Text>
                                    {business?.description ? business?.description : 'No description available.'}
                                </Text>
                                <Text>
                                Website:{" "}
                                    {business?.url ? (
                                        <Link to={business.url}>{business.url}</Link>
                                    ) : (
                                        "URL not provided"
                                    )}
                                </Text>
                                    {/* This café averages SAR 250,000 in annual revenue with a healthy annual profit of SAR 75,000. Its location offers strong foot traffic, especially during morning and late evening hours. Key assets include high-end espresso machines, seating furniture, POS system, and a fully branded visual identity. The owner is willing to offer 30 days of post-sale support, including supplier contacts, staff training, and marketing handover.
                                </Text> */}
                                {/* <Text>
                                    Website: <Link to={''}>http://almadinahcoffeeshop.com</Link>
                                </Text> */}
                            </Flex>
                        </Card>
                        {/* uncomment this and send business here as well */}
                        {/* <BusinessStats status={'Verified'} /> */}
                        <MarketAreaChart />
                        <AnnualProfitBarChart />
                        <Card className='shadow-d radius-12 border-gray mb-3'>
                            <Flex vertical gap={10}>
                                <Title level={5}>
                                    Growth Opportunity
                                </Title>
                                <Text>
                                    {business?.growthOpportunities ? business?.growthOpportunities : 'No growth opportunity details available.'}
                                </Text>
                            </Flex>
                        </Card>
                        <Card className='shadow-d radius-12 border-gray mb-3'>
                            <Flex vertical gap={10}>
                                <Title level={5}>
                                    Reason for Selling
                                </Title>
                                <Text>
                                    {business?.reason ? business?.reason : 'No reason for selling provided.'}
                                </Text>
                            </Flex>
                        </Card>
                        <PreviewTableContent title='Post - Sale Support' columns={postsaleColumns} data={postSaleData} />
                        <PreviewTableContent title='Outstanding Liabilities / Debt' columns={liabColumn} data={liabilitiesData} />
                        <PreviewTableContent title='Key Asset' columns={keyassetsColumn} data={assetsData} />
                        <PreviewTableContent title='Inventory' columns={inventColumn} data={inventoryData} />
                    </Col>
                    <Col lg={{span: 6}} md={{span: 0}} sm={{span: 0}} xs={{span: 0}}>
                        <BusinessInfoCard data={business} />
                    </Col>
                </Row>
                <BusinessInfoCardMobile/>
            </div>
            <ExploreSimilarBusiness id={business?.id} />
        </div>
    )
}

export { SingleViewlisting }
