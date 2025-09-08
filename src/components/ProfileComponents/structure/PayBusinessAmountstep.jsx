import React from 'react'
import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'
import { SingleFileUpload } from '../../Forms/SingleFileUpload'
import {GET_BUSINESS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const { Text } = Typography
const PayBusinessAmountstep = ({form,inprogressdeal,bank}) => {
    const { data:business, loading:businessLoading, error:businessError } = useQuery(GET_BUSINESS, {
        variables: { 
            getBusinessByIdId: inprogressdeal?.businessId,
            limit: null,
            offset: null,
            search: null,
            status: null
        },
    });
    const dealBusiness = business?.getBusinessById?.business
    const bankRecipt = dealBusiness?.documents?.find(
    (doc) => doc.title === "Buyer Payment Receipt"
    );

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
                    bankRecipt ? (
                        <Card className='card-cs border-gray rounded-12' >
                            <Flex justify='space-between' align='center'>
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} preview={false} width={20} />
                                    <Flex vertical>
                                    <Text className="fs-13 text-gray">{bankRecipt.title}</Text>
                                    </Flex>
                                </Flex>
                                <a href={bankRecipt.filePath} target="_blank" rel="noreferrer" className="fs-13 text-blue-500 underline" >
                                    <Image
                                        src={"/assets/icons/download.png"}
                                        preview={false}
                                        width={16}
                                        style={{ cursor: "pointer" }}
                                    />
                                </a>
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
                            <Button aria-labelledby='Submit Payment' type="primary" className='btn bg-brand'>
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