import { Button, Card, Col, Divider, Flex, Image, Row, Typography } from 'antd'
import { OfferSellerModal, RequestMeetingModal } from '../modal'
import { useState } from 'react'
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';

const { Title,Text } = Typography
const BusinessInfoCard = ({data}) => {
    const userId = Cookies.get("userId"); // read userId from cookie
  const [isLoggedIn, setisLoggedIn] = useState(!!userId);
    const navigate = useNavigate();

    const businessInfoData = [
        {
            id: 1,
            icon:'/assets/icons/verification.png',
            title:'Verified',
            subtitle:'Identity Verification'
        },
        {
            id: 2,
            icon:'/assets/icons/businessprice.png',
            title:`${data?.price?.toLocaleString() || '0'}`,
            subtitle:'Business Price'
        },
        {
            id: 3,
            icon:'/assets/icons/businesscate.png',
            title:'Restaurant',
            subtitle:'Business Category'
        },
        {
            id: 5,
            icon:'/assets/icons/businessloc.png',
            title:`${data?.district || 'Unknown'}`,
            subtitle:'Business Location'
        },
    ]

    const [offerseller, setOfferSeller] = useState(false);
    const [offerMode, setOfferMode] = useState("offer");
    const [ meetingmodal, setMeetingModal ] = useState(false)

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
                            Business Info
                        </Title>
                    </Col>
                    {
                        businessInfoData?.map((stat,i)=>
                            <Col span={24} key={i}>
                                <Flex gap={10}>
                                    <div className={`icon-pre ${stat.id === 1 ? 'bg-light-green':null}`}>
                                        <Image src={stat?.icon} preview={false} width={'100%'}  alt="stats icon" />
                                    </div>
                                    <Flex vertical gap={2}>
                                        <Title level={5} className={`m-0 ${stat.id === 1 ? 'text-green':'text-brand'}`}>
                                            {stat.id === 2 &&<img src="/assets/icons/reyal-b.png" width={16} alt="currency-symbol" fetchpriority="high" />} {stat?.title}
                                        </Title>
                                        <Text className='text-gray fs-12 fw-500'>
                                            {stat?.subtitle}
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <Divider className='m-0' />
                    </Col>
                    {data?.seller?.id !== userId && (
                    <Col span={24}>
                    <Flex vertical gap={5}>
                        <Button className='btn bg-brand' aria-labelledby='Make an Offer'
                        onClick={()=> handleAction(() => { setOfferMode("offer"); setOfferSeller(true); })}>
                            Make an Offer</Button>
                        <Button aria-labelledby='Request Meeting' className='btn bg-dark-blue' onClick={()=> handleAction(() => setMeetingModal(true))}>Request Meeting</Button>
                        <Button aria-labelledby='Proceed to Purchase' className='btn bg-green text-white' 
                        onClick={()=> handleAction(() => { setOfferMode("proceed"); setOfferSeller(true); })}>Proceed to Purchase</Button>
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

export {BusinessInfoCard}