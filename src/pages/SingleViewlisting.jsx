import { Breadcrumb, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { exploreData, inventColumn, inventData, keyassetData, keyassetsColumn, liabColumn, liabilityData, postsaleColumns, postsaleData } from '../data';
import { AnnualProfitBarChart, BusinessInfoCard, BusinessStats, ExploreSimilarBusiness, MarketAreaChart, PreviewTableContent } from '../components';
import { RightOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react'
import { useQuery } from '@apollo/client';
import { GET_BUSINESS } from '../graphql/query/business';

const { Text, Title } = Typography;
const SingleViewlisting = () => {
    // const [form] = Form.useForm(); 
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
        }
      ];
      
      const liabilitiesData = business?.liabilities?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: `SAR ${item?.toLocaleString()}`,
      }));
      
      const assetsData = business?.assets?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: `SAR ${item.price?.toLocaleString()}`,
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
        <div className='padd-1'>
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
                                </Flex>
                                <Text>
                                    {business?.description ? business?.description : 'No description available.'}
                                </Text>
                                <Text>
                                    Website: <Link to={''}>{business?.url}</Link>
                                </Text>
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
                        <PreviewTableContent
                        status={''}
                        title="Post - Sale Support"
                        columns={postsaleColumns}
                        data={postSaleData}
                        />

                        <PreviewTableContent
                        status="Verified"
                        title="Outstanding Liabilities / Debt"
                        columns={liabColumn}
                        data={liabilitiesData}
                        />

                        <PreviewTableContent
                        status="Verified"
                        title="Key Asset"
                        columns={keyassetsColumn}
                        data={assetsData}
                        />

                        <PreviewTableContent
                        status="Verified"
                        title="Inventory"
                        columns={inventColumn}
                        data={inventoryData}
                        />

                    </Col>
                    <Col lg={{span: 6}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <BusinessInfoCard data={business} />
                    </Col>
                </Row>
            </div>
            <ExploreSimilarBusiness id={business?.id} />
        </div>
    )
}

export { SingleViewlisting }
