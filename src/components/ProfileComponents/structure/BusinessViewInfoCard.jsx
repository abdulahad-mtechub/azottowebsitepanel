import { Card, Col, Flex, Image, Row, Typography } from 'antd'

const { Title, Text } = Typography
const BusinessVuewInfoCard = () => {

    const data = [
        {
            id: 1,
            icon:'/assets/icons/verification.png',
            title:'Verified',
            subtitle:'Identity Verification'
        },
        {
            id: 2,
            icon:'/assets/icons/businessprice.png',
            title:`25,000`,
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
            title:`Riyadh District, Riyadh`,
            subtitle:'Business Location'
        },
    ]

    return (
        <>
            <Card className='radius-12 border-gray mb-3'>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Title level={5} className='m-0'>
                            Business Info
                        </Title>
                    </Col>
                    {
                        data?.map((info, i) =>(
                             <Col xs={24} sm={24} md={12} lg={6} key={i}>
                            <Flex gap={10}>
                                
                                <div className={`icon-pre ${info.id === 1 ? 'bg-light-green':null}`}>
                                    <Image src={info?.icon} preview={false} width={'100%'} alt="" />
                                </div>
                                <Flex vertical gap={2}>
                                    <Title level={5} className={`m-0 'text-brand'${info.id === 1 ? 'text-green':null}`}>
                                        {info?.id === 2 && <img src="/assets/icons/reyal.png" width={14} alt="currency-symbol" />} {info?.title}
                                    </Title>
                                    <Text className='text-gray fs-12 fw-500'>
                                        {info?.subtitle}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>
                        ))
                    }
                   
                </Row>
            </Card>
        </>
    )
}

export { BusinessVuewInfoCard }