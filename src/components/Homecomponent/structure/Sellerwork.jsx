import { Card, Col, Flex, Image, Row, Typography } from 'antd'

const { Text, Title } = Typography
const Sellerwork = () => {

    const data = [
        {
            id: 1,
            title:'Create Your Listing',
            desc:'Add your business info, financials, and documents. It only takes a few minutes.',
            subtitle: null,
            image:'/assets/images/listing-cd.png',
        },
        {
            id: 2,
            title:'Get Verified',
            desc:'We verify your CR, key metrics, and identity to build buyer trust.',
            subtitle: 'You are verified seller!',
            image:'/assets/images/verify-cd.png',
        },
        {
            id: 3,
            title:'Receive Offers',
            desc:'Buyers sign an NDA to view details and send offers through our secure chat.',
            subtitle: null,
            image:'/assets/images/offer-cd.png',
        },
        {
            id: 4,
            title:'Finalize the Deal',
            desc:'Accept the offer, upload the transfer docs, and get paid directly via bank.',
            subtitle: 'Congratulation!',
            image:'/assets/images/deal-cd.png',
        }
    ]
  return (
    <Row gutter={[24,24]} className='mt-3'>
        {
            data?.map((items,index)=>
                <Col lg={{span: 6}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={index}>
                    <Card className='border-0 h-100 work-cd bg-transparent'
                        actions={[
                            <Flex vertical  className='text-center' align='center'>
                                <Title level={4} className='m-0'>{items?.title}</Title>
                                <Text >
                                    {items?.desc}
                                </Text>
                            </Flex>
                        ]}
                    >
                        <Flex vertical align='flex-start' gap={10} className='h-100'>
                            <Text strong className='fs-14'>{items?.title}</Text>
                            <Flex gap={5} vertical align='center' className='text-center w-100'  justify='center'>
                                <img src={items?.image} width={200} height={200} className='object-contain' />
                                {items?.subtitle && <Text strong>{items?.subtitle}</Text>}
                            </Flex>
                        </Flex>
                    </Card>
                </Col>
            )
        }
    </Row>
  )
}

export {Sellerwork}