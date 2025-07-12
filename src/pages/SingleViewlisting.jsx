import { Breadcrumb, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { exploreData, inventColumn, inventData, keyassetData, keyassetsColumn, liabColumn, liabilityData, postsaleColumns, postsaleData } from '../data';
import { AnnualProfitBarChart, BusinessInfoCard, BusinessStats, ExploreSimilarBusiness, MarketAreaChart, PreviewTableContent } from '../components';
import { RightOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;
const SingleViewlisting = () => {
    const [form] = Form.useForm(); 
    const navigate = useNavigate();
    const { id } = useParams()
    const data = exploreData?.find((item)=>item?.id == id)

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
                                {data?.title ? data?.title : 'Not Found'}
                            </Text>,
                        },
                    ]}
                />
            </div>
            <div className='bg-img' style={{backgroundImage:'url(/assets/images/card-1.png)'}}>
                <div className='container'>
                    <Flex vertical gap={5} className='text-center'>
                        <Text className='text-white'>Reference #: {data?.ref ? data?.ref: 'Not Found'}</Text>
                        <Title level={2} className='text-white m-0'>{data?.title ? data?.title : 'Not Found'}</Title>
                    </Flex>
                </div>
            </div>
            <div className='container'>
                <Row gutter={[24,24]} className='mt-3'>
                    <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Card className='shadow-d radius-12 border-gray mb-3'>
                            <Flex vertical gap={10}>
                                <Flex vertical gap={1}>
                                    <Text className='fs-13 text-gray fw-500'>Reference #: {data?.ref ? data?.ref: 'Not Found'}</Text>
                                    <Title level={5} className='m-0'>
                                        {data?.title}
                                    </Title>
                                </Flex>
                                <Text>
                                    Al Madinah Coffee Shop is a well-established café located in the heart of Al-Malaz, Riyadh. Operating for over 3 years, it has built a strong reputation among local residents and office workers for its premium coffee, cozy seating, and consistent service. The business runs from a fully furnished commercial unit with a stylish interior, dedicated staff, and all necessary licenses in place.
                                </Text>
                                <Text>
                                    This café averages SAR 250,000 in annual revenue with a healthy annual profit of SAR 75,000. Its location offers strong foot traffic, especially during morning and late evening hours. Key assets include high-end espresso machines, seating furniture, POS system, and a fully branded visual identity. The owner is willing to offer 30 days of post-sale support, including supplier contacts, staff training, and marketing handover.
                                </Text>
                                <Text>
                                    Website: <Link to={''}>http://almadinahcoffeeshop.com</Link>
                                </Text>
                            </Flex>
                        </Card>
                        <BusinessStats status={'Verified'} />
                        <MarketAreaChart />
                        <AnnualProfitBarChart />
                        <Card className='shadow-d radius-12 border-gray mb-3'>
                            <Flex vertical gap={10}>
                                <Title level={5}>
                                    Growth Opportunity
                                </Title>
                                <Text>
                                    The café has strong potential for growth by introducing an online ordering system, partnering with food delivery apps, and expanding into nearby residential areas. Franchising or launching a second location in a busy district can further increase revenue.
                                </Text>
                            </Flex>
                        </Card>
                        <Card className='shadow-d radius-12 border-gray mb-3'>
                            <Flex vertical gap={10}>
                                <Title level={5}>
                                    Reason for Selling
                                </Title>
                                <Text>
                                    The owner is relocating abroad for personal reasons and is looking for a serious buyer to take over and continue the café’s success.
                                </Text>
                            </Flex>
                        </Card>
                        <PreviewTableContent status={''} title='Post - Sale Support' columns={postsaleColumns} data={postsaleData} />
                        <PreviewTableContent status={'Verified'} title='Outstanding Liabilities / Debt' columns={liabColumn} data={liabilityData} />
                        <PreviewTableContent status={'Verified'} title='Key Asset' columns={keyassetsColumn} data={keyassetData} />
                        <PreviewTableContent status={'Verified'} title='Inventory' columns={inventColumn} data={inventData} />
                    </Col>
                    <Col lg={{span: 6}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <BusinessInfoCard />
                    </Col>
                </Row>
            </div>
            <ExploreSimilarBusiness />
        </div>
    )
}

export { SingleViewlisting }
