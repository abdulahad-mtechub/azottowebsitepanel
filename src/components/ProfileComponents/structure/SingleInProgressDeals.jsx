import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography,Spin } from 'antd';
import { SingleInprogressSteps } from './SingleInprogressSteps';
import { GETDEAL,GETUSERACTIVEBANK } from '../../../graphql';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const SingleInProgressDeals = ({ inprogressdeal, setInprogressDeal }) => {
  const { t } = useTranslation();

  const dealId = inprogressdeal.key;

  const { data, loading, error } = useQuery(GETDEAL, {
    variables: { getDealId: dealId },
    fetchPolicy: 'network-only',
  });
  const { data:userBank } = useQuery(GETUSERACTIVEBANK, {
    variables: { getUserActiveBanksId: data?.getDeal?.buyer?.id },
    fetchPolicy: 'network-only',
  });
  if (error) return <Text type="danger">{t('Error loading deal')}: {error.message}</Text>;

  const banks=userBank?.getUserActiveBanks
  const deal = data?.getDeal
    ? {
        key: data?.getDeal?.id,
        businessTitle: data?.getDeal?.business?.businessTitle || '-',
        buyerId: data?.getDeal?.buyer?.id || null,
        buyerName: data?.getDeal?.buyer?.name || '-',
        sellerId: data?.getDeal?.business?.seller?.id || null,
        sellerName: data?.getDeal?.business?.seller?.name || '-',
        finalizedOffer: data?.getDeal?.offer?.price ? `SAR ${data?.getDeal?.offer?.price.toLocaleString()}` : '-',
        status: data?.getDeal?.status || 0,
        date: data?.getDeal?.createdAt ? new Date(data?.getDeal?.createdAt).toLocaleDateString() : '-',
        busines: data?.getDeal?.business || '-',
        banks: banks || '-',
        isCommissionVerified: data?.getDeal?.isCommissionVerified || false,
        isDsaSeller: data?.getDeal?.isDsaSeller || false,
        isDsaBuyer: data?.getDeal?.isDsaBuyer || false,
        isDocVedifiedSeller : data?.getDeal?.isDocVedifiedSeller || false,
        isSellerCompleted : data?.getDeal?.isSellerCompleted || false,
        isBuyerCompleted : data?.getDeal?.isBuyerCompleted || false,
        isPaymentVedifiedSeller : data?.getDeal?.isPaymentVedifiedSeller || false,
        commission : data?.getDeal?.offer?.commission || 0,
    } : null;

  // Helper function to get readable status
  const getStatusLabel = (status) => {
    const statusMap = {
      'COMMISSION_TRANSFER_FROM_BUYER_PENDING': t('Commission Pending'),
      
      'COMMISSION_VERIFIED': t('Commission Verified'),
      'DSA_FROM_SELLER_PENDING': t('DSA Seller Pending'),
      'DSA_FROM_BUYER_PENDING': t('DSA Buyer Pending'),
      'BANK_DETAILS_FROM_SELLER_PENDING': t('Bank Details Pending'),
      'SELLER_PAYMENT_VERIFICATION_PENDING': t('Payment Verification Pending'),
      'PAYMENT_APPROVAL_FROM_SELLER_PENDING': t('Payment Approval Pending'),
      'DOCUMENT_PAYMENT_CONFIRMATION': t('Document Confirmation'),
      'WAITING': t('Waiting'),
      'BUYERCOMPLETED': t('Buyer Completed'),
      'SELLERCOMPLETED': t('Seller Completed'),
      'COMPLETED': t('Completed'),
      'CANCEL': t('Cancelled'),
      'PENDING': t('Pending'),
    };
    return statusMap[status] || status;
  };

  const isCancelled = deal?.status === 'CANCEL';

  const buyerdealsData = [
    { title: t('Seller Name'), desc: deal?.sellerName },
    { title: t('Buyer Name'), desc: deal?.buyerName },
    { title: t('Finalized Offer'), desc: deal?.finalizedOffer },
    { title: t('Status'), desc: getStatusLabel(deal?.status) },
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
              title: <Text className='fw-500 fs-13 text-black'>{inprogressdeal?.title}</Text>,
            },
          ]}
        />
      </Flex>

      <Flex gap={15} align='center'>
        <Button
          aria-labelledby={t('Arrow left')}
          className='border-0 p-0 bg-transparent'
          onClick={() => setInprogressDeal(null)}
        >
          <ArrowLeftOutlined />
        </Button>
        <Title level={4} className='m-0'>
          {inprogressdeal?.title}
        </Title>
      </Flex>

      <Card className='radius-12 border-gray' style={{ opacity: isCancelled ? 0.7 : 1 }}>
        <div className='deals-status'>
          <Row gutter={[16, 16]}>
            {buyerdealsData.map((list, index) => (
              <Col xs={24} sm={12} md={6} lg={6} key={index}>
                <Flex vertical gap={5}>
                  <Text className='fw-600 fs-14 text-gray'>{list?.title}</Text>
                  {list?.title === t('Status') ? (
                    deal?.status === 'CANCEL' ? (
                      <Text className='inactive fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                    ) : deal?.status === 'COMPLETED' || deal?.status === 'BUYERCOMPLETED' || deal?.status === 'SELLERCOMPLETED' ? (
                      <Text className='success fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                    ) : deal?.status === 'COMMISSION_VERIFIED' || deal?.status === 'DOCUMENT_PAYMENT_CONFIRMATION' ? (
                      <Text className='received fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                    ) : (
                      <Text className='sendstatus fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                    )
                  ) : (
                    <Text className='fs-14 fw-500 text-black'>{list?.desc}</Text>
                  )}
                </Flex>
              </Col>
            ))}
          </Row>
        </div>

        {isCancelled ? (
          <Flex 
            vertical 
            justify="center" 
            align="center" 
            style={{ minHeight: '200px', padding: '40px 0' }}
          >
            <img 
              src="/assets/icons/cancel-ic.png" 
              alt={t('cancelled')} 
              width={60} 
              style={{ opacity: 0.5, marginBottom: '16px' }}
            />
            <Title level={4} className='text-gray m-0'>
              {t('Deal Cancelled')}
            </Title>
            <Text className='text-gray fs-14 text-center' style={{ maxWidth: '400px' }}>
              {t('This deal has been cancelled and no further actions can be taken.')}
            </Text>
          </Flex>
        ) : (
          <SingleInprogressSteps inprogressdeal={deal} />
        )}
      </Card>
    </Flex>
  );
};

export { SingleInProgressDeals };
