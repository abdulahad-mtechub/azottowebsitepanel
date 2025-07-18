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
            title:'Buy Now or Processed to Pay',
            desc:'With a single click, move to the payment step or buy the business without further delays.',
            image:'/assets/images/sendoffer.gif',
        },
        {
            id: 3,
            title:'Sign NDA & Virtual Meeting',
            desc:'Sign the NDA to access more info and book a virtual meeting.',
            image:'/assets/images/signnda.gif',
        },
        {
            id: 4,
            title:'Close the Deal',
            desc:'Jusoor generates a sale agreement. Pay via bank and receive ownership',
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
                        <Flex justify='center'>
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