import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'

const { Text } = Typography
const FinalDealsStep = ({form,inprogressdeal}) => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Document Received Confirmation</Text>
                    <Text className='fs-13 text-gray'>The seller has uploaded final documents. Please review and confirm you’ve received all required legal materials before the deal is finalized.</Text>
                </Flex>
                {
                    ['Commercial Registration (CR).png','Notarized Ownership Transfer Letter.png']?.map((items,i)=>
                        <Card className='card-cs border-gray rounded-12 mb-2'  key={i}>
                            <Flex justify='space-between' align='center'>
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} alt='file icon' preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className='fs-13 text-gray'>
                                            {items}
                                        </Text>
                                        <Text className='fs-13 text-gray'>
                                            5.3 MB
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Image src={'/assets/icons/download.png'} alt='download icon' preview={false} width={16} />
                            </Flex>
                        </Card>
                    )
                }
            </Col>
            <>
                {
                    !inprogressdeal && (
                        <>
                            <Col span={24}>
                                <Checkbox>
                                    I confirm that I’ve received and reviewed the final transfer documents.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button aria-labelledby='Notify Jusoor a Finalize' type="primary" className='btn bg-brand'>
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

export {FinalDealsStep}