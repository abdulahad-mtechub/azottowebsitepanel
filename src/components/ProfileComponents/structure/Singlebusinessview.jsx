import { Card, Row, Col, Flex, Typography, Breadcrumb, Space, Button, Image, Tabs, message } from 'antd';
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { SellerOfferTable } from './SellerOfferTable';
import { SellerDealDetails } from './SellerDealDetails';
import { useQuery, useMutation } from '@apollo/client';
import { GET_BUSINESS } from '../../../graphql/query/business';
import { UPDATE_BUSINESS } from '../../../graphql/mutation/mutations';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BusinessStatusModal } from '../modal/BusinessStatusModal';
import { useState } from 'react';

const { Text, Title } = Typography;

const Singlebusinessview = ({ setSingleDetail, singledetail }) => {
  
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [statusModalVisible, setStatusModalVisible] = useState(false);

  const { data, refetch } = useQuery(GET_BUSINESS, {
    variables: { getBusinessByIdId: singledetail },
    skip: !singledetail,
  });

  const [updateBusiness, { loading: updateLoading }] = useMutation(UPDATE_BUSINESS);

  const business = data?.getBusinessById?.business;

  const handleEditBusiness = () => {
    // Navigate to edit page with business ID
    navigate(`/sellbusinesscreate?edit=${singledetail}`);
  };

  const handleStatusToggle = async (newStatus) => {
    try {
      await updateBusiness({
        variables: {
          input: {
            id: singledetail,
            businessStatus: newStatus,
          },
        },
      });

      messageApi.success(
        newStatus === 'ACTIVE' 
          ? t('Business activated successfully!') 
          : t('Business inactivated successfully!')
      );
      
      setStatusModalVisible(false);
      refetch(); // Refresh the business data
    } catch (error) {
      console.error('Error updating business status:', error);
      messageApi.error(t('Failed to update business status'));
    }
  };

  const items = [
    {
      key: '1',
      label: t('Details'),
      children: <SellerDealDetails data={business} />,
    },
    {
      key: '2',
      label: t('Offer'),
      children: <SellerOfferTable data={business} />,
    },
  ];

  function mapBusinessPayloadToUI(payload) {
    return {
      id: payload?.id,
      ref: payload?.reference,
      title: payload?.businessTitle,
      description: payload?.description,
      amount: `SAR ${payload?.price?.toLocaleString()}`,
      status: payload?.isSupportVerified ? t('Active') : t('Under-review'),
      type: payload?.isByTakbeer ? t('Taqbeel') : t('Acquiring'),

      child: [
        {
          id: 1,
          icon: '/assets/icons/year-p.png',
          subtitle: `SAR ${payload?.revenue.toLocaleString()}`,
          subdesc: `${payload?.revenueTime}`,
        },
        {
          id: 2,
          icon: '/assets/icons/revenue.png',
          subtitle: `SAR ${payload?.profit.toLocaleString()}`,
          subdesc: `${payload?.profittime}`,
        },
        {
          id: 3,
          icon: '/assets/icons/team.png',
          subtitle: `${payload?.capitalRecovery} ${t('months')}`,
          subdesc: t('Capital Recovery'),
        },
      ],

      detailinfo: [
        {
          id: 1,
          img: '/assets/icons/total-view.png',
          title: t('Total Views'),
          numbers: data?.getBusinessById?.totalViews ?? '0',
        },
        {
          id: 2,
          img: '/assets/icons/noofoffer.png',
          title: t('Number of Offers'),
          numbers: data?.getBusinessById?.numberOfOffers ?? '0',
        },
        {
          id: 3,
          img: '/assets/icons/favorite-ic.png',
          title: t('Number of Favorites'),
          numbers: data?.getBusinessById?.numberOfFavorites ?? '0',
        },
      ],

      offerData:
        payload?.offers?.map((offer, i) => ({
          key: String(i + 1),
          buyername: offer?.buyer?.name ?? t('N/A'),
          businessprice: `SAR ${payload?.price?.toLocaleString()}`,
          offerprice: {
            amount: offer?.price,
            type: offer?.type ?? 'PP',
          },
          status: offer?.status,
          date: new Date(offer?.createdAt).toLocaleString(),
        })) ?? [],
    };
  }

  const uiBusiness = mapBusinessPayloadToUI(business);
  return (
    <div className='mb-2'>
      {contextHolder}
      <Flex vertical gap={20}>
        <Breadcrumb
          separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
          items={[
            { title: <Text className='fs-13 text-gray' italic>{t('Business Listing')}</Text> },
            { title: <Text className='fw-500 fs-13 text-black' italic>{business?.businessTitle}</Text> },
          ]}
        />
        <Flex justify='space-between'>
          <Space>
            <Button
              aria-labelledby={t('Arrow left')}
              type='button'
              className='p-0 border-0 bg-transparent'
              onClick={() => setSingleDetail(null)}
            >
              <ArrowLeftOutlined />
            </Button>
            <Title level={5} className='m-0'>{business?.businessTitle}</Title>
          </Space>
          <Space>
            <Button 
              aria-labelledby={t('Edit')} 
              className='btn bg-brand rounded-8' 
              type='button'
              onClick={handleEditBusiness}
            >
              {t('Edit')}
            </Button>
            {(business?.businessStatus === 'ACTIVE' || business?.businessStatus === 'INACTIVE') && (
              <Button 
                aria-labelledby={business?.businessStatus === 'ACTIVE' ? t('Inactivate Business') : t('Activate Business')} 
                className={`btn rounded-8 ${business?.businessStatus === 'ACTIVE' ? 'bg-red' : 'bg-brand'}`}
                type='button'
                onClick={() => setStatusModalVisible(true)}
              >
                {business?.businessStatus === 'ACTIVE' ? t('Inactivate Business') : t('Activate Business')}
              </Button>
            )}
          </Space>
        </Flex>
        <Card className='radius-12 border-gray card-cs'>
          <Row gutter={[16, 16]}>
            {uiBusiness.detailinfo.map((data, i) => (
              <Col lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} key={i}>
                <Card className='h-100 border-gray rounded-12'>
                  <Flex vertical gap={15}>
                    <Image src={data?.img} alt='image' preview={false} width={40} />
                    <div>
                      <Text className='fs-14 text-gray'>{data?.title}</Text>
                      <Title className='m-0' level={5}>{data?.numbers}</Title>
                    </div>
                  </Flex>
                </Card>
              </Col>
            ))}

            <Col span={24}>
              <Tabs className='tabs-fill' defaultActiveKey="1" items={items} />
            </Col>
          </Row>
        </Card>
      </Flex>

      <BusinessStatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        currentStatus={business?.businessStatus}
        onConfirm={handleStatusToggle}
        loading={updateLoading}
      />
    </div>
  );
};

export { Singlebusinessview };
