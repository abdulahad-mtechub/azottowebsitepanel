import React from 'react'
import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'

const { Text } = Typography
const SellerFinalDealsStep = ({form,completedeal}) => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Confirmation</Text>
                    <Text className='fs-13 text-gray'>Once you’ve received payment and uploaded all required documents, you can now mark this deal as completed. The Jusoor admin will verify everything before finalizing.</Text>
                </Flex>
            </Col>
            <>
                {
                    !completedeal && (
                        <>
                            <Col span={24}>
                                <Checkbox>
                                   I confirm that payment is received and documents have been submitted.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button type="primary" className='btn bg-brand'>
                                        Notify Jusoor to Finalize
                                    </Button>
                                </Flex>
                            </Col>
                        </>
                    )
                }
            </>
        </Row>
    )
}

export {SellerFinalDealsStep}