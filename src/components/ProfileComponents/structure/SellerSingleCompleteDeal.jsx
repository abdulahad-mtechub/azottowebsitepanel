import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography,Spin } from 'antd';
import { SellerSingleInprogressSteps } from './SellerSingleInProgressSteps';
import { GETDEAL} from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const SellerSingleCompleteDeal = ({ completedeal, setCompleteDeal }) => {
    const { t } = useTranslation();
    const dealId = completedeal.key;

    const { data, loading, error } = useQuery(GETDEAL, {
        variables: { getDealId: dealId },
        fetchPolicy: 'network-only',
    });

    if (error) return <Text type="danger">{t('Error loading deal')}: {error.message}</Text>;

    const deal = data?.getDeal
        ? {
            key: data.getDeal.id,
            businessTitle: data.getDeal.business?.businessTitle || '-',
            buyerName: data.getDeal.buyer?.name || '-',
            sellerName: data.getDeal.business?.seller?.name || '-',
            finalizedOffer: data.getDeal.offer?.price ? `SAR ${data.getDeal.offer.price.toLocaleString()}` : '-',
            status: data.getDeal.status || 0,
            date: data.getDeal.createdAt ? new Date(data.getDeal.createdAt).toLocaleDateString() : '-',
            busines: data.getDeal.business || '-',
            banks: data.getDeal.buyer?.banks || '-',
        } : null;


    const sellerdealsData = [
        { title: t('Seller Name'), desc: deal?.sellerName },
        { title: t('Buyer Name'), desc: deal?.buyerName },
        { title: t('Finalized Offer'), desc: deal?.finalizedOffer },
        { title: t('Status'), desc: deal?.status },
    ];
    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }
    if (!deal) return <Text>{t('No deal found')}</Text>;

    return (
        <Flex vertical gap={20}>
            <Flex vertical gap={25}>
                <Breadcrumb
                    separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                    items={[
                        {
                            title: <Text className='fs-13 text-gray cursor' onClick={() => setCompleteDeal(null)}>{t('Deals')}</Text>,
                        },
                        {
                            title: <Text className='fw-500 fs-13 text-black'>{deal?.businessTitle}</Text>,
                        },
                    ]}
                />
            </Flex>
            <Flex gap={15} align='center'>
                <Button aria-label={t('Arrow left')} className='border-0 p-0 bg-transparent' onClick={() => setCompleteDeal(null)}>
                    <ArrowLeftOutlined />
                </Button>
                <Title level={4} className='m-0'>
                    {deal?.businessTitle}
                </Title>
            </Flex>
            <Card className='radius-12 border-gray'>
                <div className='deals-status'>
                    <Row gutter={[16, 16]}>
                        {sellerdealsData?.map((list, index) => (
                            <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                <Flex vertical gap={0}>
                                    <Text className='fw-600 fs-14'>{list?.title}</Text>
                                    {(list?.title === t('Status')) ? (
                                        list.desc === 'Completed' ?
                                            <Text className='bg-green text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text> :
                                            <Text className='bg-brand text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                                    ) : (
                                        <Text className='fs-14 fw-normal'>{list?.desc}</Text>
                                    )}
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </div>
                <SellerSingleInprogressSteps completedeal={completedeal} />
            </Card>
        </Flex>
    );
}

export { SellerSingleCompleteDeal };
