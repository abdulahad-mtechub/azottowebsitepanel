import { Button, Card, Flex, Image, message, Typography } from 'antd';
import { OfferSellerModal, RequestMeetingModal, ProceedToPurchaseModal } from '../modal';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation, useQuery } from '@apollo/client'
import { CHECK_OFFER_EXISTS } from '../../../graphql/query/offer'
import { CHECKMEETINGEXISTS } from '../../../graphql/query/meeting'

const { Title, Text } = Typography;

const BusinessInfoCardMobile = ({ data }) => {

  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userId = Cookies.get("userId");
  const isLoggedIn = !!userId;
  
  // Check if user is inactive
  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";
  const [createOffer, { loading: createOfferLoading }] = useMutation(CREATE_OFFER);
  const [hasExistingOffer, setHasExistingOffer] = useState(false);
  const [existingMeeting, setExistingMeeting] = useState(false);
  const [existingProceedToPay, setExistingProceedToPay] = useState(false);
  
  const { data: offerExistsData, refetch: refetchOfferExists } = useQuery(CHECK_OFFER_EXISTS, {
    variables: { 
      businessId: data?.id, 
      buyerId: userId 
    },
    skip: !userId || !data?.id,
    fetchPolicy: 'cache-and-network',
  });
  
  const { data: meetingExistsData, refetch: refetchMeetingExists } = useQuery(CHECKMEETINGEXISTS, {
    variables: { 
      businessId: data?.id,
      buyerId: userId
    },
    skip: !userId || !data?.id,
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (offerExistsData?.checkOfferExists) {
      setHasExistingOffer(offerExistsData.checkOfferExists.exists);
      setExistingProceedToPay(offerExistsData.checkOfferExists.isProceedToPay);
    }
  }, [offerExistsData]);

  useEffect(() => {
    if (meetingExistsData?.checkMeetingExists !== undefined) {
      setExistingMeeting(meetingExistsData.checkMeetingExists);
    }
  }, [meetingExistsData]);

  const [offerseller, setOfferSeller] = useState(false);
  const [meetingmodal, setMeetingModal] = useState(false);
  const [proceedModal, setProceedModal] = useState(false);
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

  const handleAction = (callback) => {
    if (isLoggedIn) {
      callback();
    } else {
      navigate('/login');
    }
  };

  const handleProceedButtonClick = () => {
    handleAction(() => setProceedModal(true));
  };

  const handleConfirmProceed = async () => {
    try {
      const { data: response } = await createOffer({
        variables: {
          input: {
            businessId: data?.id,
            price: data?.price,
            isProceedToPay: true,
          },
        },
      });

      if (response?.createOffer?.id) {
        setProceedModal(false);
        messageApi.success(t('Your purchase request has been sent to the seller!'));
        // Refetch to update button states
        refetchOfferExists();
      }
    } catch (error) {
      console.error('Error creating proceed to purchase offer:', error);
      messageApi.error(t('Failed to send purchase request. Please try again.'));
    }
  };

  return (
    <>
      {contextHolder}
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
        {data?.seller?.id !== userId && (                
          <Flex justify='center' gap={5}>
            <Button 
              aria-labelledby={t('Make an Offer')} 
              className='btn bg-brand fs-10 mbl-pad' 
              onClick={()=> handleAction(() => { setOfferMode("offer"); setOfferSeller(true); })}
              disabled={hasExistingOffer || isUserInactive}
              style={{ 
                opacity: (hasExistingOffer || isUserInactive) ? 0.5 : 1,
                cursor: (hasExistingOffer || isUserInactive) ? 'not-allowed' : 'pointer'
              }}
            >
              {isUserInactive 
                ? t('Verification Pending') 
                : hasExistingOffer 
                ? t('Offer Already Submitted') 
                : t('Make an Offer')}
            </Button>
            <Button 
              aria-labelledby={t('Request Meeting')} 
              className='btn bg-dark-blue fs-10 mbl-pad' 
              onClick={()=> handleAction(() => setMeetingModal(true))}
              disabled={existingMeeting || isUserInactive}
              style={{ 
                opacity: (existingMeeting || isUserInactive) ? 0.5 : 1,
                cursor: (existingMeeting || isUserInactive) ? 'not-allowed' : 'pointer'
              }}
            >
              {isUserInactive 
                ? t('Verification Pending') 
                : existingMeeting 
                ? t('Meeting Already Requested') 
                : t('Request Meeting')}
            </Button>
            <Button 
              aria-labelledby={t('Proceed to Purchase')} 
              className='btn bg-green text-white fs-10 mbl-pad'
              onClick={handleProceedButtonClick}
              disabled={hasExistingOffer || existingProceedToPay || isUserInactive}
              style={{ 
                opacity: (hasExistingOffer || existingProceedToPay || isUserInactive) ? 0.5 : 1,
                cursor: (hasExistingOffer || existingProceedToPay || isUserInactive) ? 'not-allowed' : 'pointer'
              }}
            >
              {isUserInactive 
                ? t('Verification Pending') 
                : existingProceedToPay 
                ? t('Purchase Request Sent') 
                : hasExistingOffer 
                ? t('Offer Already Submitted') 
                : t('Proceed to Purchase')}
            </Button>
          </Flex>
        )}
      </Card>

      <OfferSellerModal 
        businessId={data?.id}
        visible={offerseller}
        onClose={() => {
          setOfferSeller(false);
          refetchOfferExists();
        }}
        mode={offerMode}
        refetch={refetchOfferExists}
      />
      <ProceedToPurchaseModal
        visible={proceedModal}
        onClose={() => setProceedModal(false)}
        businessPrice={data?.price || 0}
        onConfirm={handleConfirmProceed}
        loading={createOfferLoading}
      />
      <RequestMeetingModal 
        businessId={data?.id}
        visible={meetingmodal}
        onlyMeeting={true}
        onClose={() => {
          setMeetingModal(false);
        }}
        refetch={refetchMeetingExists}
      />
    </>
  )
}

export { BusinessInfoCardMobile };
