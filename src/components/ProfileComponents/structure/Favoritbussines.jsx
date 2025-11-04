import { useState, useEffect, useMemo } from 'react';
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography, Spin, message, Space, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GETFAVORITBUSINESS } from '../../../graphql/query';
import { CREATE_SAVE_BUSINESS } from '../../../graphql/mutation/mutations';
import { useLazyQuery, useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { truncateChars } from '../../../utils';

const { Title, Text, Paragraph } = Typography;

const Favoritbussines = () => {
    
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(8);
    const [messageApi, contextHolder] = message.useMessage();
    const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);

    const [loadFavorites, { data, loading, refetch }] = useLazyQuery(GETFAVORITBUSINESS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        const offSet = (currentPage - 1) * limit;
        loadFavorites({ variables: { limit, offSet } });
    }, [currentPage, limit, loadFavorites]);

    const saveBusinessHandler = async (businessId, e) => {
        e.stopPropagation();
        try {
            await saveBusiness({
                variables: {
                    saveBusinessId: businessId,
                },
            });
            messageApi.success(t("Business removed from favorites successfully"));
            refetch(); 
        } catch (err) {
            console.error("Save mutation error:", err);
            messageApi.error(t("Save failed: ") + err.message);
        }
    };

    const favoriteBusinesses = useMemo(() => 
        data?.getFavoritBusiness?.businesses?.map(item => ({
            id: item.id,
            categoryName: item?.category?.name,
            businessTitle: item.businessTitle,
            description: item.description,
            price: item.price,
            isSaved: item.isSaved,
            isByTakbeer: item.isByTakbeer,
            businessStatus: item.businessStatus,
            child: [
                {
                    id: 1,
                    subtitle: item.revenue?.toLocaleString(),
                    subdesc: t('Revenue/month'),
                },
                {
                    id: 2,
                    subtitle: item.profit?.toLocaleString(),
                    subdesc: t('Profit/month'),
                },
                {
                    id: 3,
                    subtitle: `${item?.capitalRecovery} months`,
                    subdesc: t('Capital Recovery'),
                },
            ]
        })) ?? [], 
    [data, t]);
    
    const totalCount = data?.getFavoritBusiness?.totalCount ?? 0;

    if (loading && favoriteBusinesses.length === 0) {
        return (
            <Card className='border-gray'>
                <Flex justify='center' align='center' style={{ minHeight: 200 }}>
                    <Spin size='large' />
                </Flex>
            </Card>
        );
    }

    const showPagination = favoriteBusinesses.length > 0 && totalCount > limit;

    return (
        <>
            {contextHolder}
            <Card className='border-gray'>
                <Row gutter={[16, 16]}>
                    {favoriteBusinesses.map((pro) => (
                        <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={pro?.id}>
                            <Card className='h-100 border-gray rounded-12 card-cs cursor' onClick={() => navigate('/singleviewlisting/' + pro?.id)}>
                                <Flex vertical gap={20}>
                                    <Flex justify='space-between' align='center' gap={10} wrap>
                                        <Flex gap={10} wrap>
                                            <Button aria-labelledby={t('Category name')} className='fs-13'>
                                                {truncateChars(pro?.categoryName, 20)}
                                            </Button>
                                            {pro?.isByTakbeer !== undefined && (
                                                <Button aria-labelledby={t('type')} className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}>
                                                    <Space align='center' justify='center' >
                                                        <Text className='fs-12 text-white'>{pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}</Text>
                                                        <Tooltip title={pro.isByTakbeer ? 'Taqbeel refers to transferring a business by buying only the assets such as equipment or contracts without purchasing the trade name, brand, or commercial registration.' : 'Acquisition means a full purchase of the business, including its brand, trade name, CR, assets, and even liabilities.'}>
                                                        <img src="/assets/icons/info-a.png" width={16} alt="takbeel-icon" fetchPriority="high" className='center' />
                                                        </Tooltip>
                                                    </Space>
                                                </Button>
                                            )}
                                        </Flex>
                                        <Button 
                                            className='border-0 bg-transparent p-0' 
                                            aria-labelledby='bookmarked button'
                                            onClick={(e) => saveBusinessHandler(pro?.id, e)}
                                        >
                                            {pro?.isSaved === true ? 
                                                <img src='/assets/icons/bk-bl-d.png' alt={t('bookmarked-image')} width={22} fetchPriority="high" /> : 
                                                <img src='/assets/icons/bk-bl.png' alt={t('un-bookmarked-image')} width={22} fetchPriority="high" />
                                            }
                                        </Button>
                                    </Flex>

                                    <div>
                                        <div className='w-full card-img mb-2 rounded-12'>
                                            <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t('product-image')} fetchPriority="high" />
                                        </div>
                                        <Title level={5}>{truncateChars(pro?.businessTitle, 42)}</Title>
                                        <div className='h-80'>
                                            <Paragraph ellipsis={{ rows: 3, expandable: false, symbol: 'more' }} className='fs-14 text-gray'>
                                                {pro?.description}
                                            </Paragraph>
                                        </div>
                                        <Divider className='my-1' />
                                        <Space
                                            split={<Divider type="vertical" className="m-0 h-auto" />}
                                            align="center"
                                            style={{ width: '100%', justifyContent: 'space-between' }}
                                            >
                                            {pro?.child?.map((item, c) => (
                                                <Flex vertical align="center" justify="center" key={c}>
                                                <Title level={5} className="text-brand m-0 fs-13">
                                                    {item?.subtitle}
                                                </Title>
                                                <Text className="text-gray fs-12">{item?.subdesc}</Text>
                                                </Flex>
                                            ))}
                                        </Space>
                                        <Divider className='my-1' />
                                        <Flex gap={3} align='center'>
                                            <Image src='/assets/icons/reyal.webp' alt={t('currency-symbol')} preview={false} width={20} />
                                            <Title level={4} className='m-0'>{pro?.price?.toLocaleString?.() ?? pro?.price}</Title>
                                        </Flex>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    ))}

                    {loading && favoriteBusinesses.length > 0 && (
                        <Col span={24}>
                            <Flex justify='center' align='center' style={{ padding: '24px 0' }}>
                                <Spin />
                            </Flex>
                        </Col>
                    )}

                    {!loading && favoriteBusinesses.length === 0 && (
                        <Col span={24}>
                            <Flex vertical justify="center" align="center" style={{ minHeight: '250px' }}>
                                <img 
                                    src="/assets/icons/info-outline.png" 
                                    alt={t('no-data')} 
                                    width={45} 
                                    style={{ opacity: 0.5, marginBottom: '16px' }}
                                />
                                <Title level={4} className='text-gray m-0'>
                                    {t('No Favorite Listing')}
                                </Title>
                                <Text className='text-gray fs-14'>
                                    {t('You have not saved any businesses to your favorites yet.')}
                                </Text>
                            </Flex>
                        </Col>
                    )}
                </Row>

                {showPagination && (
                    <Row justify="space-between" align="middle" className='mt-3'>
                        <Col xs={24} sm={12}>
                            <Flex gap={5} align='center'>
                                <Text>{t('Rows Per Page:')}</Text>
                                <Select
                                    className="select-filter"
                                    value={limit}
                                    onChange={(value) => {
                                        setLimit(value);
                                        setCurrentPage(1);
                                    }}
                                    options={[
                                        { value: 8, label: 8 },
                                        { value: 16, label: 16 },
                                        { value: 24, label: 24 },
                                        { value: 40, label: 40 },
                                        { value: 48, label: 48 },
                                        { value: 60, label: 60 },
                                    ]}
                                />
                            </Flex>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Flex justify='end'>
                                <Pagination
                                    className='pagination'
                                    align="end"
                                    pageSize={limit}
                                    current={currentPage}
                                    total={totalCount}
                                    onChange={(page) => setCurrentPage(page)}
                                    showSizeChanger={false}
                                />
                            </Flex>
                        </Col>
                    </Row>
                )}
            </Card>
        </>
    )
}

export { Favoritbussines };
