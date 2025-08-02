import { Card, Col, Flex, Image, Row, Typography } from 'antd'

const { Title, Text } = Typography
const BusinessVuewInfoCard = ({data}) => {

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
                                    {info?.title}
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