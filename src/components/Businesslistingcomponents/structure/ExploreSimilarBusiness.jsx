import { Button, Card, Col, Divider, Flex, Image, Row, Tag, Typography,Spin } from 'antd';
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_RANDOM_BUSINESSES } from '../../../graphql';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'

const { Text, Title, Paragraph } = Typography;

const ExploreSimilarBusiness = ({ id }) => {
    const { t } = useTranslation();
    const navigate = useNavigate()
    const { data, loading, error } = useQuery(GET_RANDOM_BUSINESSES, {
        variables: { getRandomBusinessesId: id },
        skip: !id,
    });

    const randomBusiness = data?.getRandomBusinesses;

    const mappedBusinesses = randomBusiness?.map((b) => ({
        ...b,
        child: [
            {
                id: 1,
                icon: '/assets/icons/year-p.png',
                subtitle: <><img src="/assets/icons/reyal-b.png" width={10} alt={t("currency-symbol")} fetchPriority="high"/> {b?.revenue?.toLocaleString?.() || '0'}</>,
                subdesc: t('Revenue/month'),
            },
            {
                id: 2,
                icon: '/assets/icons/revenue.png',
                subtitle: <><img src="/assets/icons/reyal-b.png" width={10} alt={t("currency-symbol")} fetchPriority="high" /> {b?.profit?.toLocaleString?.() || '0'}</>,
                subdesc: t('Profit/month'),
            },
            {
                id: 3,
                icon: '/assets/icons/team.png',
                subtitle: `${b?.capitalRecovery || t('N/A')} months`,
                subdesc: t('Capital Recovery'),
            },
        ],
    }));
    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 60]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500 bg-secondary fw-500 text-brand'>{t('You May Also Like')}</div>
                            <Title className='m-0' level={2}>
                                {t('Explore Similar')} <span className='text-brand'>{t('Businesses')}</span>
                            </Title>
                            <Text className='fs-14'>
                                {t('Discover other verified businesses with similar category tailored to your interests.')}
                            </Text>
                        </Flex>
                    </Col>
                    <Col span={24}>
                        <Row gutter={[16,16]}>
                        {
                            mappedBusinesses?.slice(0,4)?.map((pro,i)=>
                                <Col xl={{span: 6}} lg={{span: 8}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>       
                                    <Card className='h-100 border-gray rounded-12 card-cs cursor'  onClick={() => navigate(`/singleviewlisting/${pro?.id}`)}>
                                        <Flex vertical gap={20}>
                                            <Flex justify='space-between' align='center'>
                                                <Flex gap={4}>
                                                    <Tag color="default" className="fs-12">
                                                        {pro.category.name.split(/\s+/).slice(0, 1).join(' ') + '...'}
                                                    </Tag>
                                                    <Tag
                                                        aria-labelledby={t("type")}
                                                        className={`fs-12 text-white ${pro.isByTakbeer ? 'bg-brand' : 'bg-black'}`}
                                                    >
                                                        {pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
                                                    </Tag>
                                                </Flex>
                                                <Button aria-labelledby={t('Bookmark-btn')} className='border-0 bg-transparent p-0'>
                                                    {pro?.isSaved ?
                                                        <img src='/assets/icons/bk-bl-d.png' alt={t('bookmarked-image')} width={22} /> :
                                                        <img src='/assets/icons/bk-bl.png' alt={t('un-bookmarked-image')} width={22} />
                                                    }
                                                </Button>
                                            </Flex>
                                            <div>
                                                <div className='w-full card-img mb-2 rounded-12'>
                                                    <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t("product-image")} />
                                                </div>
                                                <Title level={5}>{pro?.businessTitle}</Title>
                                                <div className='h-80'>
                                                    <Paragraph
                                                        ellipsis={{ rows: 3, expandable: false, symbol: 'more' }}
                                                        className='fs-14 text-gray'
                                                    >
                                                        {pro?.description}
                                                    </Paragraph>
                                                </div>
                                                <Divider className='my-1' />
                                                <Row justify={'space-between'}>
                                                    {pro?.child?.map((item, c) => (
                                                        <React.Fragment key={c}>
                                                            <Col span={7}>
                                                                <Flex vertical>
                                                                    <Title level={5} className='text-brand m-0 fs-13 fw-500'>
                                                                        {item?.subtitle}
                                                                    </Title>
                                                                    <Text className='text-gray fs-12'>
                                                                        {item?.subdesc}
                                                                    </Text>
                                                                </Flex>
                                                            </Col>
                                                            {c < pro.child.length - 1 && (
                                                                <Divider type='vertical' className='m-0 h-auto' />
                                                            )}
                                                        </React.Fragment>
                                                    ))}
                                                </Row>
                                                <Divider className='my-1' />
                                                <Flex gap={3} align='center'>
                                                    <Image src='/assets/icons/reyal.png' alt={t('currency-symbol')} preview={false} width={20} />
                                                    <Title level={4} className='m-0'>{pro?.price}</Title>
                                                </Flex>
                                            </div>
                                        </Flex>
                                    </Card>
                                </Col>
                            )}
                        </Row>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { ExploreSimilarBusiness };
