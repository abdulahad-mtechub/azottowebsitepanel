import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { missionData } from '../../../data'

const { Title, Text } = Typography
const OurMission = () => {
    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[64,24]} justify={'space-between'} align={'middle'}>
                    <Col lg={{span: 12}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Image src='/assets/images/ab-2.png' width={'100%'} height={400} preview={false} className='rounded-12 object-cover' />
                    </Col>
                    <Col lg={{span: 12}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Flex vertical justify='center' gap={15}>
                            <div className='tag bg-secondary fw-500 text-brand'>{missionData?.subtitle}</div>
                            <Title className='m-0' level={2}>
                                {missionData?.title}
                            </Title>
                            <Text className='fs-14 text-justify'>
                                {missionData?.desc}
                            </Text>
                            <Row gutter={[24,24]}>
                                {
                                    missionData?.list?.map((items,i)=>
                                        <Col lg={{span: 8}} md={{span: 12}} sm={{span:24}} xs={{span: 24}} key={i}>
                                            <Card className='bg-brand border-0 text-center'>
                                                <Title level={5} className='text-white fw-600'>{items?.title}</Title>
                                                <Text className='fs-14 text-white'>
                                                    {
                                                        items?.desc
                                                    }
                                                </Text>
                                            </Card>
                                        </Col>
                                    )
                                }
                            </Row>
                        </Flex>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export {OurMission}