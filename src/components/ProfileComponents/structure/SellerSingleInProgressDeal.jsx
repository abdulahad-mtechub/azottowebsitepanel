import { RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography,Spin, Image } from 'antd';
import { SellerSingleInprogressSteps } from './SellerSingleInProgressSteps';
import { GETDEAL } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { useFormatNumber } from '../../../hooks';

const { Title, Text } = Typography;

const SellerSingleInProgressDeals = ({ inprogressdeal, setInprogressDeal }) => {
    const { t } = useTranslation();
    const { formatNumber } = useFormatNumber();
    const dealId = inprogressdeal.key;

    const { data, loading, error } = useQuery(GETDEAL, {
        variables: { getDealId: dealId },
        fetchPolicy: 'network-only',
    });

    if (error) return <Text type="danger">{t('Error loading deal')}: {error.message}</Text>;

    const deal = data?.getDeal
        ? {
            key: data.getDeal.id,
            businessTitle: data.getDeal.business?.businessTitle || '-',
            buyerId: data.getDeal.buyer?.id || '-',
            buyerName: data.getDeal.buyer?.name || '-',
            sellerName: data.getDeal.business?.seller?.name || '-',
            finalizedOffer: data.getDeal.offer?.price ? `${t('currency-symbol')} ${formatNumber(data.getDeal.offer.price)}` : '-',
            ndaPdfPath: data.getDeal.ndaPdfPath,
            status: data.getDeal.status || 0,
            date: data.getDeal.createdAt ? new Date(data.getDeal.createdAt).toLocaleDateString() : '-',
            busines: data.getDeal.business || '-',
            banks: data.getDeal.buyer?.banks || '-',
            isCommissionVerified: data.getDeal?.isCommissionVerified || false,
            isDsaSeller: data.getDeal?.isDsaSeller || false,
            isDsaBuyer: data.getDeal?.isDsaBuyer || false,
            isDocVedifiedSeller : data.getDeal?.isDocVedifiedSeller || false,
            isSellerCompleted : data.getDeal?.isSellerCompleted || false,
            isPaymentVedifiedSeller : data.getDeal?.isPaymentVedifiedSeller,
            isBuyerCompleted : data.getDeal?.isBuyerCompleted || false,
            isDocVedifiedBuyer : data.getDeal?.isDocVedifiedBuyer || false,
            isCommissionUploaded : data.getDeal?.isCommissionUploaded,
        } : null;

    const getStatusLabel = (deal) => {
        if (!deal) return t('Pending');
        
        if (deal.status === 'CANCEL') {
            return t('Cancelled');
        }

        if (deal.isBuyerCompleted && deal.isSellerCompleted && deal?.status === 'COMPLETED') {
            return t('Completed');
        }

        if (deal.isSellerCompleted && deal.isBuyerCompleted) {
            return t('Waiting for Jusoor to complete the deal');
        }
        if (deal.isBuyerCompleted && deal.isDocVedifiedBuyer) {
            return t('Finalizing Deal');
        }
        if (deal.isPaymentVedifiedSeller && !deal.isDocVedifiedBuyer) {
            return t('Document Verification Pending');
        }
        
        if (deal.isDsaSeller && deal.isDsaBuyer && !deal.isPaymentVedifiedSeller) {
            return t('Payment Verification Pending');
        }
        
        if (deal.isCommissionVerified && !deal.isDsaSeller && !deal.isDsaBuyer) {
            return t('Seller & Buyer DSA Pending');
        }
        if (deal.isCommissionVerified && !deal.isDsaSeller && deal.isDsaBuyer) {
            return t('Seller DSA Pending');
        }
        if (deal.isCommissionVerified && deal.isDsaSeller && !deal.isDsaBuyer) {
            return t('Buyer DSA Pending');
        }
        
        if (!deal.isCommissionVerified && deal.isCommissionUploaded) {
            return t('Commission Verification Pending');
        }
        if (deal.isCommissionVerified) {
            return t('Commission Verified');
        }
        
        return t('Commission Pending');
    };

    // Get badge class based on deal status
    const getStatusBadgeClass = (deal, status) => {
        if (!deal) return 'sendstatus';
        
        // Check if DSA is pending - Yellow
        if (
            status === t('Seller & Buyer DSA Pending') ||
            status === t('Seller DSA Pending') ||
            status === t('Buyer DSA Pending') ||
            status === t('Commission Verification Pending') ||
            status === t('Commission Pending') ||
            status === t('Payment Verification Pending') ||
            status === t('Document Verification Pending') ||
            status === t('Finalizing Deal') ||
            (!deal.isDsaSeller || !deal.isDsaBuyer)
        ) {
            // Only return yellow if commission is verified but DSA is not complete
            if (deal.isCommissionVerified && (!deal.isDsaSeller || !deal.isDsaBuyer)) {
                return 'sendstatus';
            }
            return 'sendstatus';
        }
        
        // Completed/Successful deals - Green
        if (
            deal.status === 'CANCEL' ||
            (deal.isBuyerCompleted && deal.isSellerCompleted) || 
            deal.isBuyerCompleted || 
            deal.isSellerCompleted ||
            status === t('Payment Verified') ||
            status === t('Commission Verified') ||
            status === t('Finalizing Deal') ||
            status === t('Completed') ||
            status === t('Verified') ||
            status === t('Signed') ||
            deal.isPaymentVedifiedSeller ||
            (deal.isDsaSeller && deal.isDsaBuyer) ||
            deal.isCommissionVerified
        ) {
            return 'success';
        }
        
        // Pending states - Yellow
        return 'sendstatus';
    };

    const sellerdealsData = [
        { title: t('Seller Name'), desc: deal?.sellerName },
        { title: t('Buyer Name'), desc: deal?.buyerName },
        { title: t('Finalized Offer'), desc: deal?.finalizedOffer },
        { title: t('Status'), desc: getStatusLabel(deal) },
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
                            title: <Text className='fs-13 text-gray cursor' onClick={() => setInprogressDeal(null)}>{t('Deals')}</Text>,
                        },
                        {
                            title: <Text className='fw-500 fs-13 text-black'>{deal?.businessTitle}</Text>,
                        },
                    ]}
                />
            </Flex>
            <Flex gap={15} align='center'>
                <Button
                    aria-labelledby={t('Arrow left')}
                    type='button'
                    className='p-0 border-0 bg-transparent'
                    onClick={() => setInprogressDeal(null)}
                >
                    <Image src="/assets/icons/back-arr.png" alt={t("Arrow Left")} width={22} height={22} preview={false} />
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
                                <Flex vertical gap={5}>
                                    <Text className='fw-600 fs-14 text-gray'>{list?.title}</Text>
                                    {list?.title === t('Status') ? (
                                        <Text className={`${getStatusBadgeClass(deal, list?.desc)} fs-12 badge-cs fw-500 fit-content`}>
                                            {list?.desc}
                                        </Text>
                                    ) : (
                                        <Text className='fs-14 fw-500 text-black'>{list?.desc}</Text>
                                    )}
                                </Flex>
                            </Col>
                        ))}
                    </Row>
                </div>
                <SellerSingleInprogressSteps deal={deal} />
            </Card>
        </Flex>
    );
}

export { SellerSingleInProgressDeals };
