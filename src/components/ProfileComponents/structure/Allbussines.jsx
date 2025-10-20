import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { GETSELLERBUSINESS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { Singlebusinessview } from './Singlebusinessview';
import { ModuleTopHeading } from '../../Pagecomponents';
import { PlusOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Allbussines = () => {
    
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentPage, setCurrentPage] = useState(1);
    const [singledetail, setSingleDetail] = useState(null);
    const [limit, setLimit] = useState(10);

    const [getSellerBusinesses, { data: sellerBusinesses, loading }] = useLazyQuery(GETSELLERBUSINESS, {
        fetchPolicy: 'network-only',
    });

    useEffect(() => {
        const offSet = (currentPage - 1) * limit;
        getSellerBusinesses({ variables: { limit, offSet } });
    }, [currentPage, limit, getSellerBusinesses]);

    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    if (singledetail) {
        return <Singlebusinessview singledetail={singledetail} setSingleDetail={setSingleDetail} />;
    }
    return (
        <Flex gap={20} vertical>
            <Flex justify='space-between' align='center'>
                <ModuleTopHeading level={4} name={t('All Businesses')} />
                <Flex gap={5}>
                    <Button
                        aria-labelledby={t('Sell a Business')}
                        className='btn bg-brand rounded-8'
                        type='button'
                        onClick={() => navigate('/sellbusinesscreate')}
                    >
                        <PlusOutlined /> {t('Sell a Business')}
                    </Button>
                </Flex>
            </Flex>
            <Card className='border-gray'>
                <Row gutter={[16, 16]}>
                    {sellerBusinesses?.getAllSellerBusinesses?.businesses?.map((pro, i) => (
                        <Col lg={{ span: 12 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={i}>
                            <Card className='h-100 border-gray rounded-12 card-cs cursor' onClick={() => setSingleDetail(pro?.id)}>
                                <Flex vertical gap={20}>
                                    <Flex justify='space-between' align='center'>
                                        <Flex gap={4}>
                                            <Button aria-labelledby={t('Category name')} className='fs-13'>
                                                {pro?.category?.name}
                                            </Button>
                                            {pro?.isByTakbeer !== undefined && (
                                                <Button
                                                    aria-labelledby={t('Type')}
                                                    className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}
                                                >
                                                    {pro.isByTakbeer ? t('Taqbeel') : t('Acquiring')}
                                                </Button>
                                            )}
                                        </Flex>
                                        {pro?.businessStatus === 'ACTIVE' ? (
                                            <span className='badge-active rounded-8'>{t('Active')}</span>
                                        ) : pro?.businessStatus === 'INACTIVE' ? (
                                            <span className='badge-inactive rounded-8'>{t('Inactive')}</span>
                                        ) : pro?.businessStatus === 'REJECT' ? (
                                            <span className='badge-inactive rounded-8'>{t('Rejected')}</span>
                                        ) : pro?.businessStatus === 'UNDER_REVIEW' ? (
                                            <span className='badge-review rounded-8'>{t('Under Review')}</span>
                                        ) : null}
                                    </Flex>
                                    <div>
                                        <div className='w-full card-img mb-2 rounded-12'>
                                            <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t('product-image')} fetchPriority="high" />
                                        </div>
                                        <Title className='' level={5}>{pro?.businessTitle}</Title>
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
                                        <Flex align='center' justify='space-between'>
                                            <Flex gap={3} align='center'>
                                                <Image src='/assets/icons/reyal.webp' alt={t('currency-symbol')} preview={false} width={20} />
                                                <Title level={4} className='m-0'>{pro?.price}</Title>
                                            </Flex>
                                            <Text className='text-brand fs-14'>{pro.offerCount}</Text>
                                        </Flex>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    ))}
                    {sellerBusinesses?.getAllSellerBusinesses?.totalCount > 0 ? (
                        <Col span={24} className='mt-3'>
                            <Row justify="space-between" align="middle">
                                <Col span={6}>
                                    <Flex gap={5} align='center'>
                                        <Text>{t('Rows Per Page')}:</Text>
                                        <Select
                                            className="select-filter"
                                            value={limit}
                                            onChange={(value) => {
                                                setLimit(value);
                                                setCurrentPage(1); // Reset to first page when limit changes
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
                                    <Pagination
                                        className='pagination'
                                        align="end"
                                        current={currentPage}
                                        pageSize={limit}
                                        total={sellerBusinesses?.getAllSellerBusinesses?.totalCount || 0}
                                        onChange={(page) => setCurrentPage(page)}
                                        showSizeChanger={false}
                                        showTotal={(total, range) => `${range[0]}-${range[1]} ${t('of')} ${total} ${t('items')}`}
                                    />
                                </Col>
                            </Row>
                        </Col>
                    ) : (
                        <Row>
                            <Col span={24} className='text-center mt-4'>
                                <Text>{t('No Business Found')}</Text>
                            </Col>
                        </Row>
                    )}
                </Row>
            </Card>
        </Flex>
    );
};

export { Allbussines };
