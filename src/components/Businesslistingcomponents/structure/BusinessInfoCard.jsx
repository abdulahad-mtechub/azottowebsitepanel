import { Button, Card, Col, Divider, Flex, Image, Row, Typography } from 'antd';
import { OfferSellerModal, RequestMeetingModal } from '../modal';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation, useQuery } from '@apollo/client'
import { CHECK_OFFER_EXISTS } from '../../../graphql/query/offer'

const { Title, Text } = Typography;

const BusinessInfoCard = ({ data }) => {

  const { t } = useTranslation();
  const userId = Cookies.get("userId");
  const isLoggedIn = !!userId;
  const navigate = useNavigate();
  const [createOffer] = useMutation(CREATE_OFFER);
  const [hasExistingOffer, setHasExistingOffer] = useState(false);
  
  const { data: offerExistsData } = useQuery(CHECK_OFFER_EXISTS, {
    variables: { 
      businessId: data?.id, 
      buyerId: userId 
    },
    skip: !userId || !data?.id,
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (offerExistsData?.checkOfferExists) {
      setHasExistingOffer(offerExistsData.checkOfferExists);
    }
  }, [offerExistsData]);


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
  const [offerId, setOfferId] = useState(false);

  const handleAction = (callback) => {
    if (isLoggedIn) {
      callback();
    } else {
      navigate('/login');
    }
  };

  const handleProceedtoPurchase = async ()=>{
    const { data: response } = await createOffer({
      variables: {
        input: {
          businessId: data?.id,   // ← this is your prop `data`
          price: data?.price,
          isProceedToPay: true,
        },
      },
    });

    if (response?.createOffer?.id) {
      setOfferId(response.createOffer.id);
    }
  setMeetingModal(true)
  }

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
                <Button 
                  className='btn bg-brand' 
                  aria-labelledby={t('Make an Offer')}
                  onClick={()=> handleAction(() => { setOfferMode("offer"); setOfferSeller(true); })}
                  disabled={hasExistingOffer}
                >
                  {hasExistingOffer ? t('Offer Already Submitted') : t('Make an Offer')}
                </Button>
                <Button aria-labelledby={t('Request Meeting')} className='btn bg-dark-blue' onClick={()=> handleAction(() => setMeetingModal(true))}>
                  {t('Request Meeting')}
                </Button>
                <Button aria-labelledby={t('Proceed to Purchase')} className='btn bg-green text-white' 
                  onClick={ handleProceedtoPurchase}>
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
        offerId={offerId}
        onClose={()=>{setMeetingModal(false)}}
      />
    </>
  )
}

export { BusinessInfoCard };
