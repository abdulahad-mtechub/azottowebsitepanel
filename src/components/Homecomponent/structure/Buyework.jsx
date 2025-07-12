import { Card, Col, Flex, Row, Typography } from 'antd'

const { Text, Title } = Typography
const Buyework = () => {

    const data = [
        {
            id: 1,
            title:'Explore Listings',
            desc:'Browse verified businesses across Saudi Arabia by category, location, or revenue.',
            subtitle: null,
            image:'/assets/images/buyer-1-cd.png',
        },
        {
            id: 2,
            title:'Sign NDA',
            desc:'Unlock full business details and chat with the seller by signing a quick digital NDA.',
            subtitle: null,
            image:'/assets/images/buyer-2-cd.png',
        },
        {
            id: 3,
            title:'Send an Offer',
            desc:'Make offers, ask questions, or negotiate all through our secure in-platform chat.',
            subtitle: null,
            image:'/assets/images/buyer-3-cd.png',
        },
        {
            id: 4,
            title:'Close the Deal',
            desc:'Jusoor generates a sale agreement. Pay via bank and receive ownership',
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

export {Buyework}