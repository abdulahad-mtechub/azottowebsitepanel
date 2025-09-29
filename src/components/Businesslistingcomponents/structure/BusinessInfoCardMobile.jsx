import { Button, Card, Flex, Image, Typography } from 'antd';
import { OfferSellerModal, RequestMeetingModal } from '../modal';
import { useState } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const BusinessInfoCardMobile = ({ data }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = Cookies.get("userId"); // read userId from cookie
  const [isLoggedIn, setisLoggedIn] = useState(!!userId);
  const [offerseller, setOfferSeller] = useState(false);
  const [meetingmodal, setMeetingModal] = useState(false);
  const [offerMode, setOfferMode] = useState("offer");

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
      title: t('Restaurant'),
      subtitle: t('Business Category')
    },
    {
      id: 5,
      icon:'/assets/icons/businessloc.png',
      title: `${data?.district || t('Unknown')}`,
      subtitle: t('Business Location')
    },
  ];

  const handleAction = (callback) => {
    if (isLoggedIn) {
      callback();
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Card className='border0 mobile-view-info'>
        <div className='flex-card no-display-scroll mb-2'>
          {businessInfoData?.map((stat,i) =>
            <Flex gap={10} key={i}>
              <div className={`icon-pre-m ${stat.id === 1 ? 'bg-light-green':null}`}>
                <Image src={stat?.icon} preview={false} width={30} alt={t("stats icon")} />
              </div>
              <Flex vertical gap={2}>
                <Title level={5} className={`m-0 ${stat.id === 1 ? 'text-green':'text-brand'}`}>
                  {stat.id === 2 && <img src="/assets/icons/reyal-b.png" width={12} alt={t("currency-symbol")} fetchPriority="high" />} {stat?.title}
                </Title>
                <Text className='text-gray fs-12 fw-500'>
                  {stat?.subtitle}
                </Text>
              </Flex>
            </Flex>
          )}
        </div>                
        <Flex justify='center' gap={5}>
          <Button aria-labelledby={t('Make an Offer')} className='btn bg-brand fs-10 mbl-pad' onClick={()=>{setOfferMode("offer");setOfferSeller(true)}}>
            {t('Make an Offer')}
          </Button>
          <Button aria-labelledby={t('Request Meeting')} className='btn bg-dark-blue fs-10 mbl-pad' onClick={()=>setMeetingModal(true)}>
            {t('Request Meeting')}
          </Button>
          <Button aria-labelledby={t('Proceed to Purchase')} className='btn bg-green text-white fs-10 mbl-pad'
            onClick={()=> handleAction(() => { setOfferMode("proceed"); setOfferSeller(true); })}>
            {t('Proceed to Purchase')}
          </Button>
        </Flex>
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
        onClose={()=>setMeetingModal(false)}
      />
    </>
  )
}

export { BusinessInfoCardMobile };
