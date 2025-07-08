import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { featurecardData } from '../../../data'

const { Text, Title } = Typography
const JusoorFeature = () => {

    return (
        <div className='feature bg-dark-blue'>
            <div className='container'>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500'>Jasoor’s Features</div>
                            <Title className='m-0 text-white' level={2}>
                                Explore Powerful Features Built for <span className='text-brand'>Business Deals</span>
                            </Title>
                            <Text className='fs-14 text-white'>
                                From listing to ownership transfer, Jusoor offers verified tools that simplify every step  built for entrepreneurs, investors, and serious buyers across Saudi Arabia.
                            </Text>
                        </Flex>
                    </Col>
                    {
                        featurecardData?.map((items,index)=>
                            <Col lg={{span: (items?.id === 1 || items?.id === 4) ? 6 : 18}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={index}>
                                <Card className='card-border h-100'>
                                    <Flex vertical gap={20}>
                                        <div style={{height:50}}>
                                            <Title className='text-white' level={5}>
                                                {items?.title}
                                            </Title>
                                        </div>
                                        <div className='img-container'>
                                            <Image src={items?.img} preview={false} width={'100%'} height={'100%'}/>
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

export { JusoorFeature }
