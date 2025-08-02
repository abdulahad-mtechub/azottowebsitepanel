import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { SingleInprogressSteps } from './SingleInprogressSteps'
import { OFFERBYID } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import React from 'react'

const { Title, Text } = Typography
const SingleInProgressDeals = ({inprogressdeal, setInprogressDeal}) => {
const { data, loading, error } = useQuery(OFFERBYID, {
    variables: { getOffersByIdId: inprogressdeal?.key },
})
const offer = data?.getOffersById;
const buyerdealsData = offer ? [
    {
        title: 'Seller Name',
        desc: offer?.business?.seller?.name || '-',
    },
    {
        title: 'Buyer Name',
        desc: offer?.buyer?.name || '-',
    },
    {
        title: 'Finalized Offer',
        desc: offer?.price ? `SAR ${offer.price.toLocaleString()}` : '-',
    },
    {
        title: 'Status',
        desc: offer?.status || '-',
    },
] : [];

return (
    <Flex vertical gap={20}>
        <Flex vertical gap={25}>
            <Breadcrumb
                separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                items={[
                    {
                        title: <Text className='fs-13 text-gray cursor' onClick={() => setInprogressDeal(null)}>Deals</Text>,
                    },
                    {
                        title: <Text className='fw-500 fs-13 text-black'>{inprogressdeal?.title}</Text>,
                    },
                ]}
            />
        </Flex>
        <Flex gap={15} align='center'>
            <Button className='border-0 p-0 bg-transparent' onClick={() => setInprogressDeal(null)}>
                <ArrowLeftOutlined />
            </Button>
            <Title level={4} className='m-0'>
                {inprogressdeal?.title}
            </Title>
        </Flex>
        <Card className='radius-12 border-gray'>
            <div className='deals-status'>
                <Row gutter={[16, 16]}>
                    {
                        buyerdealsData?.map((list,index)=>
                            <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                <Flex vertical gap={0}>
                                    <Text className='fw-600 fs-14'>{list?.title}</Text>
                                    {
                                    (list?.title === 'Status') ? (
                                        list.desc === 'In-progress' ?
                                        <Text className='bg-brand text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>:
                                        <Text className='sendstatus fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                                    ) : (
                                        <Text className='fs-14 fw-normal'>{list?.desc}</Text>
                                    )}
                                </Flex>
                            </Col>
                        )
                    }
                </Row>
            </div>
            <SingleInprogressSteps inprogressdeal={inprogressdeal} offer={offer} />
        </Card>
    </Flex>
)
}

export {SingleInProgressDeals}