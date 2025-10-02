import { Button, Card, Col, Divider, Flex, Image, Row, Typography } from 'antd';
import { OfferSellerModal, RequestMeetingModal } from '../modal';
import { useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const BusinessInfoCard = ({ data }) => {

  const { t } = useTranslation();
  const userId = Cookies.get("userId");
  const [isLoggedIn, setisLoggedIn] = useState(!!userId);
  const navigate = useNavigate();
  const businessInfoData = [
    {
      id: 1,
      icon:'/assets/icons/verification.png',
      title: t('Verified'),
      subtitle: t('Identity Verification')
    },
    {
      id: 2,
      icon:'/assets/icons/businessprice.png',
      title: `${data?.price?.toLocaleString() || '0'}`,
      subtitle: t('Business Price')
    },
    {
      id: 3,
      icon:'/assets/icons/businesscate.png',
      title: data?.category?.name || t('Unknown'),
      subtitle: t('Business Category')
    },
    {
      id: 5,
      icon:'/assets/icons/businessloc.png',
      title: `${data?.district || t('Unknown')}`,
      subtitle: t('Business Location')
    },
  ];

  const [offerseller, setOfferSeller] = useState(false);
  const [offerMode, setOfferMode] = useState("offer");
  const [meetingmodal, setMeetingModal] = useState(false);

  const handleAction = (callback) => {
    if (isLoggedIn) {
      callback();
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Card className='shadow-d radius-12 border-gray mb-3'>
        <Row gutter={[24,24]}>
          <Col span={24}>
            <Title level={5} className='m-0'>
              {t('Business Info')}
            </Title>
          </Col>
          {businessInfoData?.map((stat, i) =>
            <Col span={24} key={i}>
              <Flex gap={10}>
                <div className={`icon-pre ${stat.id === 1 ? 'bg-light-green':null}`}>
                  <Image src={stat?.icon} preview={false} width={'100%'}  alt={t("stats icon")} />
                </div>
                <Flex vertical gap={2}>
                  <Title level={5} className={`m-0 ${stat.id === 1 ? 'text-green':'text-brand'}`}>
                    {stat.id === 2 && <img src="/assets/icons/reyal-b.png" width={16} alt={t("currency-symbol")} fetchPriority="high" />} {stat?.title}
                  </Title>
                  <Text className='text-gray fs-12 fw-500'>
                    {stat?.subtitle}
                  </Text>
                </Flex>
              </Flex>
            </Col>
          )}
          <Col span={24}>
            <Divider className='m-0' />
          </Col>
          {data?.seller?.id !== userId && (
            <Col span={24}>
              <Flex vertical gap={5}>
                <Button className='btn bg-brand' aria-labelledby={t('Make an Offer')}
                  onClick={()=> handleAction(() => { setOfferMode("offer"); setOfferSeller(true); })}>
                  {t('Make an Offer')}
                </Button>
                <Button aria-labelledby={t('Request Meeting')} className='btn bg-dark-blue' onClick={()=> handleAction(() => setMeetingModal(true))}>
                  {t('Request Meeting')}
                </Button>
                <Button aria-labelledby={t('Proceed to Purchase')} className='btn bg-green text-white' 
                  onClick={()=> handleAction(() => { setOfferMode("proceed"); setOfferSeller(true); })}>
                  {t('Proceed to Purchase')}
                </Button>
              </Flex>
            </Col>
          )}
        </Row>
      </Card>

      <OfferSellerModal 
        businessId={data?.id}
        visible={offerseller}
        onClose={()=>setOfferSeller(false)}
        mode={offerMode}
      />
      <RequestMeetingModal 
        businessId={data?.id}
        visible={meetingmodal}
        onClose={()=>{setMeetingModal(false)}}
      />
    </>
  )
}

export { BusinessInfoCard };
