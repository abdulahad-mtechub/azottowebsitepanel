import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'

const { Text } = Typography
const DigitalSaleAgreementStep = ({form,completedeal}) => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Downloads Digital Sale Agreement</Text>
                    <Text className='fs-13 text-gray' italic>This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding.</Text>
                </Flex>
                <Card className='card-cs border-gray rounded-12' >
                    <Flex justify='space-between' align='center'>
                        <Flex gap={15}>
                            <Image src={'/assets/icons/file.png'} alt='file icon' preview={false} width={20} />
                            <Flex vertical>
                                <Text className='fs-13 text-gray'>
                                    Digital Sale Agreement.pdf
                                </Text>
                                <Text className='fs-13 text-gray'>
                                    5.3 MB
                                </Text>
                            </Flex>
                        </Flex>
                        <Image src={'/assets/icons/download.png'} alt='download icon' preview={false} width={20} />
                    </Flex>
                </Card>
            </Col>
            <>
                {
                    !completedeal && (
                        <>
                            <Col span={24}>
                                <Flex vertical gap={3}>
                                    <Checkbox>
                                        I have read and agree to the terms of the sale agreement.
                                    </Checkbox>
                                    <Checkbox>
                                        I agree to pay the Jusoor platform commission.
                                    </Checkbox>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button aria-labelledby='Mark as Accepted' type="primary" className='btn bg-brand'>
                                        Mark as Accepted
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

export {DigitalSaleAgreementStep}