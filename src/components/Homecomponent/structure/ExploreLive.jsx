import React from 'react'
import { Button, Card, Col, Divider, Flex, Image, Row, Typography, Spin, message, Space, Tooltip } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { GETRANDOMBUSINESS } from '../../../graphql/query/business'
import { CREATE_SAVE_BUSINESS } from '../../../graphql/mutation/mutations'
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from 'react-i18next'
import { truncateChars } from '../../../utils'
import Cookies from "js-cookie";

const { Text, Title, Paragraph } = Typography

const ExploreLive = () => {

    const navigate = useNavigate()
    const { t } = useTranslation()
    const [messageApi, contextHolder] = message.useMessage();
    const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);
    const userId = Cookies.get("userId");
    
    const userStatus = Cookies.get("userStatus");
    const isUserInactive = userStatus === "pending" || userStatus === "inactive";;
    
    const { data, loading, refetch} = useQuery(GETRANDOMBUSINESS);

    const saveBusinessHandler = async (businessId, currentSaveState, e) => {
        e.stopPropagation();

        if (!userId) {
            messageApi.info({
                content: (
                    <span>
                        {t('Please')}{' '}
                        <a
                            onClick={() => navigate('/login')}
                            style={{ color: '#1677ff', textDecoration: 'underline', cursor: 'pointer' }}
                        >
                            {t('login')}
                        </a>{' '}
                        {t('to continue')}.
                    </span>
                ),
            });
            return;
        }

        if (isUserInactive) {
            messageApi.warning(t("Your account is inactive. Please contact support."));
            return;
        }

        try {
            await saveBusiness({
                variables: {
                    saveBusinessId: businessId,
                },
            });
            if (currentSaveState) {
                messageApi.success(t("Business removed from favorites successfully"));
            } else {
                messageApi.success(t("Business added to favorites successfully"));
            }
            refetch(); 
        } catch (err) {
            console.error("Save mutation error:", err);
            messageApi.error(t("Failed to update favorites: ") + err.message);
        }
    };

    const exploreData = data?.getRandomBusinesses?.map(item => ({
        id: item.id,
        categoryName: item?.category?.name,
        ref: item.reference,
        title: item.businessTitle,
        description: item.description,
        amount: typeof item.price === 'number' ? item.price.toLocaleString() : item.price,
        save: item.isSaved,
        status: item.isSold,
        type: item.isByTakbeer,
        child: [
            {
                id: 1,
                icon:'/assets/icons/year-p.png',
                subtitle: typeof item.revenue === 'number' ? item.revenue.toLocaleString() : item.revenue,
                subdesc:t('Revenue/month'),
            },
            {
                id: 2,
                icon:'/assets/icons/revenue.png',
                subtitle: typeof item.profit === 'number' ? item.profit.toLocaleString() : item.profit,
                subdesc:t('Profit/month'),
            },
            {
                id: 3,
                icon:'/assets/icons/team.png',
                subtitle: item.capitalRecovery >= 12
                    ? `${(item.capitalRecovery / 12).toFixed(1)} ${t('years')}`
                    : `${item.capitalRecovery} ${t('months')}`,
                subdesc: t('Capital Recovery')
            },
        ]
    })) || [];

    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }
    return (
        <>
            {contextHolder}
            <div className='feature bg-light-brand'>
                <div className='container'>
                    <Row gutter={[12, 24]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500 bg-secondary fw-500 text-brand'>
                                {t("Explore Live Listings")}
                            </div>
                            <Title className='m-0' level={2}>
                                {t("Businesses Currently")} <span className='text-brand'>{t("Available for Sale")}</span>
                            </Title>
                            <Text className='fs-14 d-inline'>
                                {t("Discover a created selection of verified businesses across various categories and cities in Saudi Arabia. Use filters to narrow down by industry, location, price, and more")}
                            </Text>
                        </Flex>
                    </Col>
                    {exploreData?.slice(0,3)?.map((pro, i) => (
                        <Col xl={{span: 8}} lg={{span: 8}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>
                            <Card className='h-100 border-gray rounded-12 bg-lightest-gray card-cs cursor' onClick={() => navigate(`/singleviewlisting/${pro?.id}`)} >
                                <Flex vertical gap={20}>
                                    <Flex justify='space-between' align='center'>
                                        <Flex gap={4}>
                                            <Button className='fs-13' aria-labelledby={t(pro?.categoryName)}>
                                                {truncateChars(pro?.categoryName, 16)}
                                            </Button>
                                            {typeof pro?.type === "boolean" && (
                                                <Button
                                                    aria-labelledby="type"
                                                    className={`fs-12 text-white ${pro.type ? 'bg-brand' : 'bg-black'}`}
                                                >
                                                <Space align='center' justify='center' >
                                                    <Text className='fs-12 text-white'>{pro.type ? t("Taqbeel") : t("Acquiring")}</Text>
                                                    <Tooltip title={pro.type ? 'Taqbeel refers to transferring a business by buying only the assets such as equipment or contracts without purchasing the trade name, brand, or commercial registration.' : 'Acquisition means a full purchase of the business, including its brand, trade name, CR, assets, and even liabilities.'}>
                                                    <img src="/assets/icons/info-a.png" width={16} alt="takbeel-icon" fetchPriority="high" className='center' />
                                                    </Tooltip>
                                                </Space>
                                            </Button>
                                        )}
                                        </Flex>
                                        {userId && (
                                            <Button 
                                                className='border-0 bg-transparent p-0' 
                                                aria-labelledby='bookmarked button'
                                                onClick={(e) => saveBusinessHandler(pro?.id, pro?.save, e)}
                                                disabled={isUserInactive}
                                                style={{
                                                    opacity: isUserInactive ? 0.5 : 1,
                                                    cursor: isUserInactive ? 'not-allowed' : 'pointer'
                                                }}
                                            >
                                                {pro?.save === true ? 
                                                    <img src='/assets/icons/bk-bl-d.png' alt={t('bookmarked-image')} width={22} fetchPriority="high" /> : 
                                                    <img src='/assets/icons/bk-bl.png' alt={t('un-bookmarked-image')} width={22} fetchPriority="high" />
                                                }
                                            </Button>
                                        )}
                                    </Flex>
                                    <div>
                                        <div className='w-full card-img mb-2 rounded-12'>
                                            <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t('product-image')} fetchPriority="high" />
                                        </div>
                                        <Title className='' level={5}>
                                            {truncateChars(pro?.title, 42)}
                                        </Title>
                                        <div className='h-80'>
                                            <Paragraph className='fs-14 text-gray justify-clamp'>
                                                {pro?.description}
                                            </Paragraph>
                                        </div>
                                        <Divider className='my-1' />
                                        <Row justify={'space-between'} align="middle">
                                            {pro?.child?.map((item, c) => (
                                                <React.Fragment key={c}>
                                                    <Col span={7}>
                                                        <Flex vertical align="center">
                                                            <Text className='text-brand fw-500 m-0 fs-13'>
                                                                {item?.id !== 3 && <img src="/assets/icons/reyal-b.png" width={8} alt={t('currency-symbol')} />} {item?.subtitle}
                                                            </Text>
                                                            <Text className='text-gray fs-12'>
                                                                {item?.subdesc}
                                                            </Text>
                                                        </Flex>
                                                    </Col>
                                                    {c < pro.child.length - 1 && <Divider type='vertical' className='m-0 h-auto' />}
                                                </React.Fragment>
                                            ))}
                                        </Row>
                                        <Divider className='my-1' />
                                        <Flex gap={3} align='center'>
                                            <Image src='/assets/icons/reyal.webp' alt={t('currency-symbol')} preview={false} width={20} />
                                            <Title level={4} className='m-0'>
                                                {pro?.amount}
                                            </Title>
                                        </Flex>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    ))}

                    <Col span={24}>
                        <Flex justify='center'>
                            <Button onClick={()=>navigate('/businesslisting')} className='btn bg-brand' aria-labelledby='Browse Businesses'>
                                {t("Browse Businesses")} <RightOutlined className='fs-10' />
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </div>
        </div>
        </>
    )
}

export { ExploreLive }
