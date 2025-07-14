import { Card, Col, Flex, Image, Row, Typography } from 'antd'

const { Text, Title } = Typography
const Sellerwork = () => {

    const data = [
        {
            id: 1,
            title:'Create Your Listing',
            desc:'Add your business info, financials, and documents. It only takes a few minutes.',
            subtitle: null,
            image:'/assets/images/create-listing.gif',
        },
        {
            id: 2,
            title:'Get Verified',
            desc:'We verify your CR, key metrics, and identity to build buyer trust.',
            subtitle: 'You are verified seller!',
            image:'/assets/images/verify.gif',
        },
        {
            id: 3,
            title:'Receive Offers',
            desc:'Buyers sign an NDA to view details and send offers through our secure chat.',
            subtitle: null,
            image:'/assets/images/offer.gif',
        },
        {
            id: 4,
            title:'Finalize the Deal',
            desc:'Accept the offer, upload the transfer docs, and get paid directly via bank.',
            subtitle: 'Congratulation!',
            image:'/assets/images/deal.gif',
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
                        <Flex>
                            <Image preview={false} src={items?.image} />
                        </Flex>
                    </Card>
                </Col>
            )
        }
    </Row>
  )
}

export {Sellerwork}