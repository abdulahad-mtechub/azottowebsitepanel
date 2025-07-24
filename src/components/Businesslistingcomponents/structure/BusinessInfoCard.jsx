import { Button, Card, Col, Divider, Flex, Image, Row, Typography } from 'antd'
import { OfferSellerModal, RequestMeetingModal } from '../modal'
import { useState } from 'react'

const { Title,Text } = Typography
const BusinessInfoCard = ({data}) => {

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
            title:`SAR ${data?.price?.toLocaleString() || '0'}`,
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

    const [ offerseller, setOfferSeller ] = useState(false)
    const [ meetingmodal, setMeetingModal ] = useState(false)

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
                                        <Image src={stat?.icon} preview={false} width={'100%'}  alt="" />
                                    </div>
                                    <Flex vertical gap={2}>
                                        <Title level={5} className={`m-0 ${stat.id === 1 ? 'text-green':'text-brand'}`}>
                                            {stat?.title}
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
                    <Col span={24}>
                        <Flex vertical gap={5}>
                            <Button className='btn bg-brand' onClick={()=>setOfferSeller(true)}>Make an Offer</Button>
                            <Button className='btn bg-dark-blue' onClick={()=>setMeetingModal(true)}>Request Meeting</Button>
                            <Button className='btn bg-green text-white'>Proceed to Purchase</Button>
                        </Flex>
                    </Col>
                </Row>
            </Card>
            <OfferSellerModal 
                businessId={data?.id}
                visible={offerseller}
                onClose={()=>setOfferSeller(false)}
            />
            <RequestMeetingModal 
                businessId={data?.id}
                visible={meetingmodal}
                onClose={()=>setMeetingModal(false)}
            />
        </>
    )
}

export {BusinessInfoCard}