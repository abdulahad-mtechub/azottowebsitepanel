import { Card, Col, Flex, Image, Row, Typography } from 'antd'

const { Text, Title } = Typography
const Buyework = () => {

    const data = [
        {
            id: 1,
            title:'Explore Listings',
            desc:'Browse verified businesses across Saudi Arabia by category, location, or revenue.',
            subtitle: null,
            image:'/assets/images/explore.gif',
        },
        {
            id: 2,
            title:'Sign NDA',
            desc:'Unlock full business details and chat with the seller by signing a quick digital NDA.',
            subtitle: null,
            image:'/assets/images/signnda.gif',
        },
        {
            id: 3,
            title:'Send an Offer',
            desc:'Make offers, ask questions, or negotiate all through our secure in-platform chat.',
            subtitle: null,
            image:'/assets/images/sendoffer.gif',
        },
        {
            id: 4,
            title:'Close the Deal',
            desc:'Jusoor generates a sale agreement. Pay via bank and receive ownership',
            subtitle: 'Congratulation!',
            image:'/assets/images/finaldeal.gif',
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

export {Buyework}