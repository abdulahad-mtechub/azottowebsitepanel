import { Col, Flex, Row, Typography } from 'antd'

const { Text, Title } = Typography
const WhyJusoor = () => {

    return (
        <div className='feature bg-dark-blue'>
            <div className='container'>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500'>Why Jusoor</div>
                            <Title className='m-0 text-white' level={2}>
                                A <span className='text-brand'>Smarter Way</span> to Buy and Sell Businesses
                            </Title>
                            <Text className='fs-14 text-white'>
                                We’ve built Jusoor to simplify business acquisitions and transfers in Saudi Arabia with verified listings, legal security, and real support at every step.
                            </Text>
                        </Flex>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { WhyJusoor }
