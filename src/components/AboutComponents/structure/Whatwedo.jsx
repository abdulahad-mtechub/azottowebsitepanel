import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { whatweData } from '../../../data'

const { Text, Title } = Typography

const Whatwedo = () => {


    return (
        <div className='feature'>
            <div className='container'>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag bg-secondary fw-500 text-brand'>What We Do</div>
                            <Title className='m-0' level={2}>
                                How Jusoor <span className='text-brand'>Helps You?</span>
                            </Title>
                            <Text className='fs-14'>
                                Jusoor is transforming how businesses are bought and sold in Saudi Arabia. We offer a digital marketplace where verified sellers can list their businesses
                            </Text>
                        </Flex>
                    </Col>
                    {
                        whatweData?.map((type,i)=>
                            <Col lg={{span: 8}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>
                                <Card className='h-100 border-brand rounded-12' >
                                    <Flex vertical gap={20}>
                                        <Image src={type?.icon} preview={false} width={40} />
                                        <div>
                                            <Title className='mb-1' level={5}>
                                                {type?.title}
                                            </Title>
                                            <Text className='fs-14'>
                                                {type?.description}
                                            </Text>
                                        </div>
                                    </Flex>
                                </Card>
                            </Col>
                        )
                    }
                </Row>
            </div>
        </div>
    )
}

export { Whatwedo }
