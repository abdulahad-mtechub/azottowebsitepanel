import { useRive } from '@rive-app/react-canvas';
import { Card, Col, Flex, Row, Typography } from 'antd'

const { Text, Title } = Typography
const Buyework = () => {

    const rive1 = useRive({
        src: '/assets/images/riv/business_listing.riv',
        autoplay: true,
    });

    const rive2 = useRive({
        src: '/assets/images/riv/send_offer.riv',
        autoplay: true,
    });

    const rive3 = useRive({
        src: '/assets/images/riv/sign_&_virutal_meeting.riv',
        autoplay: true,
    });

    const rive4 = useRive({
        src: '/assets/images/riv/finalize_deal.riv',
        autoplay: true,
    });

    const data = [
        {
            id: 1,
            title:'Explore Listings',
            desc:'Browse verified businesses across Saudi Arabia by category, location, or revenue.',
            image: <rive1.RiveComponent />,
        },
        {
            id: 2,
            title:'Negotiate or Buy Instantly',
            desc:'With a single click, move to the payment step or buy the business without further delays.',
            image:<rive2.RiveComponent />,
        },
        {
            id: 3,
            title:'Sign NDA & Virtual Meeting',
            desc:'Sign the NDA to access more info and book a virtual meeting.',
            image: <rive3.RiveComponent />,
        },
        {
            id: 4,
            title:'Close the Deal',
            desc:'Jusoor generates a sale agreement. Pay via bank and receive ownership',
            image:<rive4.RiveComponent />,
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
                            <div style={{ width: '100%', height: 300 }}>
                                {items?.image}
                            </div>
                        </Flex>
                    </Card>
                </Col>
            )
        }
    </Row>
  )
}

export {Buyework}