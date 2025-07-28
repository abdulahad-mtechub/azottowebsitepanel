import React from 'react'
import { Row, Col, Card, Flex, Typography, Divider } from 'antd'
const { Text, Title } = Typography;
const SellerAlerts = ({data}) => {
    return (
        <Row>
            <Col span={24}>
                <Card className='bg-light-white border-gray overflow-style'>
                    {
                        data?.map((alert, index) => (
                            <Flex vertical key={index}>
                                <Text className='fs-15'>{alert?.date}</Text>
                                {
                                    alert?.alertsdetails.map((details, i) => (
                                        <Flex vertical className='mt-2' gap={4} style={{marginLeft: 15}} key={i}>
                                            <Flex  justify='space-between' >
                                                <Title level={5} className='m-0 fw-500'> {details?.title}</Title>
                                                <Text className='text-gray fs-12'> {details?.time}</Text>
                                            </Flex>
                                            <Text className='text-justify text-gray'>
                                                {details?.desc}
                                            </Text>
                                        </Flex>
                                    ))
                                }
                                <Divider/>
                            </Flex>
                        ))
                    }

                </Card>
            </Col>
        </Row>
    )
}

export { SellerAlerts } 
