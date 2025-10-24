import { useEffect } from 'react';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography, Spin, Image } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useInventColumn, useKeyassetsColumn, useLiabColumn, usePostsaleColumns } from '../data';
import { AnnualProfitBarChart, BusinessInfoCard, BusinessInfoCardMobile, ExploreSimilarBusiness, MarketAreaChart, PreviewTableContent } from '../components';
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from '@apollo/client';
import { GET_BUSINESS, SIMILER_BUSINESS_CATEGORY_GRAPH } from '../graphql/query/business';
import { BusinessStats } from '../components/SellBusinessComponents/structure/BusinessStats';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const SingleViewlisting = () => {

    const { t } = useTranslation();
    const postsaleColumns = usePostsaleColumns();
    const liabColumn = useLiabColumn();
    const keyassetsColumn = useKeyassetsColumn();
    const inventColumn = useInventColumn();
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const footer = document.getElementById("footer");
        const handleResize = () => {
            if (footer) {
                if (window.innerWidth <= 768) footer.classList.add("footer-add-150");
                else footer.classList.remove("footer-add-150");
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            if (footer) footer.classList.remove("footer-add-150");
        };
    }, []);

    const { data: businessData, loading: businessLoading } = useQuery(GET_BUSINESS, {
        variables: { getBusinessByIdId: id },
        skip: !id,
    });
    
    const business = businessData?.getBusinessById?.business;

    const postSaleData = [
        {
            key: '1',
            period: business?.supportDuration || t('N/A'),
            session: business?.supportSession || t('N/A'),
            verified: business?.isSupportVerified,
        }
    ];

    const liabilitiesData = business?.liabilities?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: item?.price.toLocaleString(),
        verified:item.isActive
    }));

    const assetsData = business?.assets?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item?.purchaseYear,
        price: item?.price.toLocaleString(),
        verified:item.isActive
    }));
    
    const inventoryData = business?.inventoryItems?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: item.price?.toLocaleString(),
        verified:item.isActive
    }));

    const { data: graphData, loading: graphLoading } = useQuery(SIMILER_BUSINESS_CATEGORY_GRAPH, {
        variables: { getBusinessByIdId: id },
        skip: !id,
    });

    if (businessLoading || graphLoading) {
        return (
            <div
                style={{
                    width: '100%',
                    minHeight: '550px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                }}
            >
            <Spin size="large" />
            </div>
        );
    }

    return (
        <div className='padd-1 relative'>
            <div className='container'>
                <Breadcrumb
                    separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                    className='my-2 pt-1'
                    items={[
                        { title: <Text className='cursor text-gray' onClick={() => navigate('/')}>{t('Home')}</Text> },
                        { title: <Text className='cursor text-gray' onClick={() => navigate('/businesslisting')}>{t('Browse Businesses')}</Text> },
                        { title: <Text className='fw-500'>{business?.businessTitle || t('Not Found')}</Text> },
                    ]}
                />
            </div>

            <div className='bg-img' style={{ backgroundImage:'url(/assets/images/card-1.webp)' }}>
                <div className='container'>
                    <Flex vertical gap={5} className='text-center'>
                        <Text className='text-white'>{t('Reference #')}: {business?.reference || t('Not Found')}</Text>
                        <Title level={2} className='text-white m-0'>{business?.businessTitle || t('Not Found')}</Title>
                    </Flex>
                </div>
            </div>

            <div className='container'>
                <Row gutter={[24,24]} className='mt-3'>
                    <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <Flex vertical gap={20}>    
                                <Flex vertical gap={10}>
                                    <Flex vertical gap={12}>
                                        <Text className='fs-13 text-gray fw-500'>{t('Reference #')}: {business?.reference || t('Not Found')}</Text>
                                        <Flex gap={10} align='center'>
                                            <Button aria-label="Arrow left" className='p-0' type="text" onClick={() => navigate("/businesslisting")}>
                                                <Image src="/assets/icons/back-arr.png" alt="Arrow Left" width={26} height={26} preview={false} />
                                            </Button>
                                            <Title level={3} className='m-0'>{business?.businessTitle}</Title>
                                            <Button
                                                    aria-labelledby="type"
                                                    className={`fs-12 text-white ${business.isByTakbeer ? 'bg-brand' : 'bg-black'}`}
                                                >
                                                {business.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
                                            </Button>
                                        </Flex>
                                        <Flex align='center' gap={5}>
                                            <Title level={5} className='m-0'>{businessData?.title}</Title>
                                            {businessData?.type &&
                                                <Button className={`fs-12 border-0 text-white ${businessData.type === 'Taqbeel'?'bg-brand':'bg-black'}`}>
                                                    {businessData?.type}
                                                </Button>
                                            }
                                        </Flex>
                                    </Flex>
                                    <Text>{business?.description || t('No description available.')}</Text>
                                </Flex>
                                
                            </Flex>
                        </Card>
                        <BusinessStats data={business} /> 
                        <MarketAreaChart /> 
                        <AnnualProfitBarChart graphData={graphData} /> 
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <Flex vertical gap={0}>
                                <Title level={5}>{t('Growth Opportunity')}</Title>
                                <Text>{business?.growthOpportunities || t('No growth opportunity details available.')}</Text>
                            </Flex>
                        </Card>
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <Flex vertical gap={0}>
                                <Title level={5}>{t('Reason for Selling')}</Title>
                                <Text>{business?.reason || t('No reason for selling provided.')}</Text>
                            </Flex>
                        </Card>
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <PreviewTableContent title={t('Post - Sale Support')} columns={postsaleColumns} data={postSaleData} />
                        </Card>
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <PreviewTableContent title={t('Outstanding Liabilities / Debt')} columns={liabColumn} data={liabilitiesData} />
                        </Card>
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <PreviewTableContent title={t('Key Asset')} columns={keyassetsColumn} data={assetsData} />
                        </Card>
                        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
                            <PreviewTableContent title={t('Inventory')} columns={inventColumn} data={inventoryData} />
                        </Card>
                    </Col>

                    <Col lg={{span: 6}} md={{span: 0}} sm={{span: 0}} xs={{span: 0}}>
                        <div className='sticky-comp'>
                            <BusinessInfoCard data={business} />
                        </div>
                    </Col>
                </Row>

                <BusinessInfoCardMobile />
            </div>

            <ExploreSimilarBusiness id={business?.id} />
        </div>
    );
};

export { SingleViewlisting };
