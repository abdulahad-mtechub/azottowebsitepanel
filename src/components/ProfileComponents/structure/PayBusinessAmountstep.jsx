import React from 'react'
import { paybusinessData } from '../../../data'
import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'
import { SingleFileUpload } from '../../Forms/SingleFileUpload'

const { Text } = Typography
const PayBusinessAmountstep = ({form,inprogressdeal,bank}) => {
    console.log*("inprogressdeal",inprogressdeal)
    const paybusinessData = [
        {
          title:'Seller’s Bank Name',
          desc:bank?.bankName
        },
        {
          title:'Seller’s IBAN',
          desc:bank?.accountNumber
        },
        {
          title:'Account Holder Name',
          desc:bank?.accountTitle
        },
        {
          title:'Amount to Pay',
          desc:inprogressdeal?.offerprice
        },
      ]
    return (
        <Row gutter={[16, 24]}>
            {
                paybusinessData?.map((list,index)=>
                    <Col xs={24} sm={12} md={6} lg={6} key={index}>
                        <Flex vertical gap={4}>
                            <Text className='fw-500 fs-14'>{list?.title}</Text>
                            <Text className='fs-14 text-gray'>{list?.desc}</Text>
                        </Flex>
                    </Col>
                )
            }

            <Col span={24}>
                {
                    inprogressdeal ? (
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
                    <Flex vertical gap={5} className='w-100'>
                        <Flex vertical >
                            <Text className='fw-500 fs-14'>Upload a bank statement or screenshot</Text>
                            <Text className='text-gray'>
                                Accepted formats:  JPG, PNG, PDF Max size: 5MB per file.
                            </Text>
                        </Flex>
                        <Flex  className='w-100'>
                            <SingleFileUpload form={form} name={'uploadimge'} title={'Upload'} />
                        </Flex>
                    </Flex>
                }
            </Col>
            {
                !inprogressdeal && (
                    <Col span={24}>
                        <Flex>
                            <Button type="primary" className='btn bg-brand'>
                                Submit Payment
                            </Button>
                        </Flex>
                    </Col>
                )
            }
        </Row>
    )
}

export {PayBusinessAmountstep}