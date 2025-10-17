import React, { useState, useEffect, useMemo } from 'react';
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GETFAVORITBUSINESS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Favoritbussines = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(8);

    const [loadFavorites, { data, loading }] = useLazyQuery(GETFAVORITBUSINESS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        const offSet = (currentPage - 1) * limit;
        loadFavorites({ variables: { limit, offSet } });
    }, [currentPage, limit, loadFavorites]);

    const favoriteBusinesses = useMemo(() => data?.getFavoritBusiness?.businesses ?? [], [data]);
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
        <Card className='border-gray'>
            <Row gutter={[16, 16]}>
                {favoriteBusinesses.map((pro) => (
                    <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={pro?.id}>
                        <Card className='h-100 border-gray rounded-12 card-cs cursor' onClick={() => navigate('/singleviewlisting/' + pro?.id)}>
                            <Flex vertical gap={20}>
                                <Flex justify='space-between' align='center'>
                                    <Flex gap={4}>
                                        <Button aria-labelledby={t('Category name')} className='fs-13'>
                                            {pro?.category?.name}
                                        </Button>
                                        {pro?.isByTakbeer !== undefined && (
                                            <Button aria-labelledby={t('type')} className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}>
                                                {pro.isByTakbeer ? t('Taqbeel') : t('Direct')}
                                            </Button>
                                        )}
                                    </Flex>
                                    {pro?.businessStatus === 'ACTIVE' ? (
                                        <span className='badge-active rounded-8'>{t('Active')}</span>
                                    ) : pro?.businessStatus === 'INACTIVE' ? (
                                        <span className='badge-inactive rounded-8'>{t('Inactive')}</span>
                                    ) : pro?.businessStatus === 'UNDER_REVIEW' ? (
                                        <span className='badge-review rounded-8'>{t('Under Review')}</span>
                                    ) : null}
                                </Flex>

                                <div>
                                    <div className='w-full card-img mb-2 rounded-12'>
                                        <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t('product-image')} fetchPriority="high" />
                                    </div>
                                    <Title level={5}>{pro?.businessTitle}</Title>
                                    <Text className='fs-14 text-gray'>{pro?.description}</Text>
                                    <Divider className='my-1' />
                                    <Row justify={'space-between'}>
                                        {pro?.child?.map((item, c) => (
                                            <React.Fragment key={c}>
                                                <Col span={7}>
                                                    <Flex vertical>
                                                        <Title level={5} className='text-brand m-0 fs-13'>{item?.subtitle}</Title>
                                                        <Text className='text-gray fs-12'>{item?.subdesc}</Text>
                                                    </Flex>
                                                </Col>
                                                {c < pro.child.length - 1 && <Divider type='vertical' className='m-0 h-auto' />}
                                            </React.Fragment>
                                        ))}
                                    </Row>
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
            </Row>

            {!loading && favoriteBusinesses.length === 0 && (
                <Flex justify='center' align='center' style={{ minHeight: 160 }}>
                    <Text>{t('No Favorite Listing')}</Text>
                </Flex>
            )}

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
    )
}

export { Favoritbussines };
