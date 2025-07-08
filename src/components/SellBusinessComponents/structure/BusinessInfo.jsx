import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { businessInfoData } from '../../../data';

const { Title, Text } = Typography
const BusinessInfo = () => {

    return (
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
                                <div className='icon-pre'>
                                    <Image src={stat?.icon} preview={false} width={'100%'}  alt="" />
                                </div>
                                <Flex vertical gap={2}>
                                    <Title level={5} className='m-0 text-brand'>
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
            </Row>
        </Card>
    )
}

export {BusinessInfo}