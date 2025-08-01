import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { comdealsData } from '../../../data'
import { SingleInprogressSteps } from './SingleInprogressSteps'
import {GETADMINACTIVEBANK,OFFERBYID } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import React,{ useMemo,useEffect } from 'react'

const { Title, Text } = Typography
const SingleCompleteDeal = ({completedeal, setCompleteDeal}) => {
    const { loading:bankLoading, error:bankError, data:bankData } = useQuery(GETADMINACTIVEBANK);
    const { loading: offerLoading, error: offerError, data: offerData } = useQuery(OFFERBYID, {
        variables: { offerId: completedeal?.id }, // 👈 pass the offer ID here
        skip: !completedeal?.id, // avoid calling query if ID not present
    });
    // if (offerLoading) return <Spin />;
    if (offerError) return <Text type="danger">Failed to load offer data</Text>;

  return (
    <Flex vertical gap={20}>
        <Flex vertical gap={25}>
            <Breadcrumb
                separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                items={[
                    {
                        title: <Text className='fs-13 text-gray cursor' onClick={() => setCompleteDeal(null)}>Deals</Text>,
                    },
                    {
                        title: <Text className='fw-500 fs-13 text-black'>{offer?.business?.businessTitle}</Text>,
                    },
                ]}
            />
        </Flex>
        <Flex gap={15} align='center'>
            <Button className='border-0 p-0 bg-transparent' onClick={() => setCompleteDeal(null)}>
                <ArrowLeftOutlined />
            </Button>
            <Title level={4} className='m-0'>
                {completedeal?.title}
            </Title>
        </Flex>
        <Card className='radius-12 border-gray'>
            <div className='deals-status'>
                <Row gutter={[16, 16]}>
                    {[
                         { title: 'Price', desc: offer?.price },
                         { title: 'Status', desc: offer?.status },
                         { title: 'Buyer', desc: offer?.buyer?.name },
                         { title: 'Created At', desc: new Date(offer?.createdAt).toLocaleString() },
                    ]?.map((list,index)=>
                            <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                <Flex vertical gap={0}>
                                    <Text className='fw-600 fs-14'>{list?.title}</Text>
                                    {
                                    (list?.title === 'Status') ? (
                                        list.desc === 'Completed' ?
                                        <Text className='bg-green text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>:
                                        <Text className='bg-brand text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>                                        
                                    ) : (
                                        <Text className='fs-14 fw-normal'>{list?.desc}</Text>
                                    )}
                                </Flex>
                            </Col>
                        )
                    }
                </Row>
            </div>
            <SingleInprogressSteps completedeal={completedeal} />
        </Card>
    </Flex>
  )
}

export {SingleCompleteDeal}