import React from 'react'
import { paybusinessData } from '../../../data'
import { Button, Card, Col, Divider, Flex, Image, Radio, Row, Typography } from 'antd'
import { SingleFileUpload } from '../../Forms/SingleFileUpload'

const { Text } = Typography
const ConfirmationDocsStep = ({ form, completedeal }) => {

    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={10}>
                    <Card className='card-cs border-gray rounded-12' >
                        <Flex justify='space-between' align='center'>
                            <Flex gap={15}>
                                <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                <Flex vertical>
                                    <Text className='fs-13 text-gray'>
                                        Business Transaction Receipt .pdf
                                    </Text>
                                    <Text className='fs-13 text-gray'>
                                        5.3 MB
                                    </Text>
                                </Flex>
                            </Flex>
                            <Image src={'/assets/icons/download.png'} preview={false} width={20} />
                        </Flex>
                    </Card>
                    <Divider />
                    <Text className='fs-13 text-gray'>
                        Have you received the payment in your bank account?
                    </Text>
                    <Radio.Group>
                        <Radio value={1} className='fs-13 text-gray'>Yes</Radio>
                        <Radio value={2} className='fs-13 text-gray'>NO</Radio>
                    </Radio.Group>
                </Flex>
            </Col>

            <Col span={24}>
                {
                    completedeal ? (
                        <Card className='card-cs border-gray rounded-12' >
                            <Flex justify='space-between' align='center'>
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                    <Flex vertical>
                                        <Text className='fs-13 text-gray'>
                                            Bank-Statement.png
                                        </Text>
                                        <Text className='fs-13 text-gray'>
                                            5.3 MB
                                        </Text>
                                    </Flex>
                                </Flex>
                                <Image src={'/assets/icons/download.png'} preview={false} width={20} />
                            </Flex>
                        </Card>
                    ) :
                        <>
                            <Flex vertical gap={5} className='w-100'>
                                <Flex vertical >
                                    <Text className='fw-500 fs-14'>Updated Commercial Registration (CR)</Text>
                                    <Text className='text-gray'>
                                        Accepted formats:  JPG, PNG, PDF Max size: 5MB per file.
                                    </Text>
                                </Flex>
                                <Flex className='w-100'>
                                    <SingleFileUpload form={form} name={'uploadimge'} title={'Upload'} />
                                </Flex>
                            </Flex>
                            <Flex vertical gap={5} className='w-100 mt-2'>
                                <Flex vertical >
                                    <Text className='fw-500 fs-14'>Notarized Ownership Transfer Letter</Text>
                                    <Text className='text-gray'>
                                        Accepted formats:  JPG, PNG, PDF Max size: 5MB per file.
                                    </Text>
                                </Flex>
                                <Flex className='w-100'>
                                    <SingleFileUpload form={form} name={'uploadimge'} title={'Upload'} />
                                </Flex>
                            </Flex>
                        </>
                }
            </Col>
            {
                !completedeal && (
                    <Col span={24}>
                        <Flex>
                            <Button type="primary" className='btn bg-brand'>
                                Submit Documents
                            </Button>
                        </Flex>
                    </Col>
                )
            }
        </Row>
    )
}

export { ConfirmationDocsStep }