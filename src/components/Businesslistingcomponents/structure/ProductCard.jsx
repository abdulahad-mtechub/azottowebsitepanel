import React from 'react';
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography, Tag, Spin } from 'antd';
import { useNavigate, Link } from 'react-router-dom';
import { CREATE_SAVE_BUSINESS } from "../../../graphql";
import { useMutation } from '@apollo/client';
import { message } from "antd";
import { useTranslation } from 'react-i18next';
import { truncateChars } from '../../../utils';
import Cookies from "js-cookie";

const { Title, Text, Paragraph } = Typography;

const ProductCard = ({
    exploreData,
    refetchBusinesses,
    totalCount,
    currentPage,
    onPageChange,
    limit,
    onLimitChange,
    isLoading
}) => {
    const { t } = useTranslation();
    const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();
    const userId = Cookies.get("userId");

    const saveBusinessHandler = async (businessId, currentSaveState) => {
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
            refetchBusinesses(); 
        } catch (err) {
            console.error("Save mutation error:", err);
            messageApi.error(t("Failed to update favorites: ") + err.message);
        }
    };
    if (isLoading) {
        return (
            <div
            style={{
                width: '100%',
                minHeight: '300px',
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
    if (!isLoading && (!exploreData || exploreData.length === 0)) {
        return (
            <Flex vertical justify="center" align="center" style={{ minHeight: '250px' }}>
                <img 
                    src="/assets/icons/info-outline.png" 
                    alt={t('no-data')} 
                    width={45} 
                    style={{ opacity: 0.5, marginBottom: '16px' }}
                />
                <Title level={4} className='text-gray m-0'>
                    {t('No Data Found')}
                </Title>
                <Text className='text-gray fs-14'>
                    {t('No businesses match your search criteria. Try adjusting your filters.')}
                </Text>
            </Flex>
        );
    }

    return (
        <>
        {contextHolder}
        <Row gutter={[16,16]}>
            {
                exploreData?.map((pro,i) =>
                    <Col lg={{span: 8}} md={{span: 8}} sm={{span: 24}} xs={{span: 24}} key={i}>
                        <Link 
                            to={`/singleviewlisting/${pro.id}`}
                            style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}
                        >
                            <Card className='h-100 border-gray rounded-12 card-cs cursor bg-lightest-gray'>
                                <Flex vertical gap={20}>
                                    <Flex justify='space-between' align='center'>
                                        <Flex gap={4}>
                                            <Button className='fs-13' aria-labelledby='Restaurant'>
                                                {truncateChars(pro?.categoryName, 20)}
                                            </Button>
                                            <Button
                                                    aria-labelledby="type"
                                                    className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}
                                                >
                                                {pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
                                            </Button>
                                        </Flex>
                                        <Button 
                                            aria-labelledby='bookmarked-btn'
                                            className='border-0 bg-transparent p-0'
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                saveBusinessHandler(pro?.id, pro?.isSaved);
                                            }}
                                        >
                                            {
                                                pro?.isSaved
                                                ? <img src='/assets/icons/bk-bl-d.png' alt={t('bookmarked-image')} width={22} fetchPriority="high" />
                                                : <img src='/assets/icons/bk-bl.png' alt={t('un-bookmarked-image')} width={22} fetchPriority="high" />
                                            }
                                        </Button>
                                    </Flex>
                                <div>
                                    <div className='w-full card-img mb-2 rounded-12'>
                                        <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t("product-image")} fetchPriority="high" />
                                    </div>
                                    <Title strong className="fs-16">{pro?.title}</Title>
                                    <div className='h-80'>
                                        <Paragraph ellipsis={{ rows: 3, expandable: false, symbol: 'more' }} className='fs-14 text-gray'>
                                            {pro?.description}
                                        </Paragraph>
                                    </div>
                                    <Divider className='my-1' />
                                    <Row justify={'space-between'} align="middle">
                                        {
                                            pro?.child?.map((item, c) => (
                                                <React.Fragment key={c}>
                                                    <Col span={7}>
                                                        <Flex vertical align="center">
                                                            <Title level={5} className='text-brand m-0 fs-13 fw-500'>
                                                                {c !== 2 && <img src="/assets/icons/reyal-b.png" width={10} alt={t("currency-symbol")} fetchPriority="high" />} {item?.subtitle}
                                                            </Title>
                                                            <Text className='text-gray fs-12'>
                                                                {item?.subdesc}
                                                            </Text>
                                                        </Flex>
                                                    </Col>
                                                    {
                                                        c < pro.child.length - 1 && (
                                                            <Divider type='vertical' className='m-0 h-auto' />
                                                        )
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </Row>
                                    <Divider className='my-1' />
                                    <Flex gap={3} align='center'>
                                        <Image src='/assets/icons/reyal.webp' alt={t("currency-symbol")} preview={false} width={20} />
                                        <Title level={4} className='m-0'>{pro?.amount}</Title>
                                    </Flex>
                                </div>
                            </Flex>
                        </Card>
                        </Link>
                    </Col>
                )
            }
            {
                exploreData?.length > 0 && totalCount > 12 &&
                <Col span={24} className='mt-3'>
                    <Row justify="space-between" align="middle">
                        <Col span={6}>
                            <Flex gap={5} align='center'>
                                <Text>{t("Rows Per Page:")}</Text>
                                <Select
                                    className='select-filter'
                                    value={limit}
                                    onChange={onLimitChange}
                                    options={[
                                        { value: 12, label: 12 },
                                        { value: 24, label: 24 },
                                        { value: 36, label: 36 },
                                        { value: 48, label: 48 },
                                        { value: 60, label: 60 },
                                    ]}
                                />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex justify='end'>
                                <Pagination
                                    className='pagination'
                                    current={currentPage}
                                    total={totalCount}
                                    pageSize={limit}
                                    onChange={onPageChange}
                                    showSizeChanger={false}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Col>
            }
        </Row>
        </>
    )
}

export { ProductCard };
