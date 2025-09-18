import { Col, Flex, Image, Row, Typography } from 'antd'

const { Text, Title } = Typography
const JusoorFuturembl = () => {


    const steps = [
        {
            title: 'Verified Listings',
            description: 'Every business on Jusoor is verified for identity and commercial registration. ensuring you make decisions with confidence.',
            img: '/assets/images/ver.gif',
        },
        {
            title: 'Secure & Protected Deals',
            description: 'Our process includes E-NDA agreements, verified documents, and bank transfer flows to protect both buyers and sellers at every stage.',
            img: '/assets/images/secure.gif',
        },
        {
            title: 'Transparent Business Data',
            description: 'Access detailed financial metrics, team size, key assets, and liabilities before making an offer.',
            img: '/assets/images/scan.gif',
        },
        {
            title: 'Finalized Transactions Made Easy',
            description: 'Connecting serious buyers with trusted sellers through a secure and streamlined process.',
            img: '/assets/images/curr.gif',
        },
    ];

  return (
    <div className="feature bg-dark-blue">
            <div className="container">
                <Row gutter={[24, 24]} align="middle" justify="space-between">
                    <Col span={24}>
                        <Flex vertical justify="center" align="center" gap={15} className="mx-width">
                            <div className="tag fw-500">Jusoor's Features</div>
                            <Title className="m-0 text-white" level={2}>
                                Your <span className="text-brand">Trusted Saudi Marketplace</span> for Buying and Selling Businesses
                            </Title>
                            {/* <Text className="fs-14 text-white">
                                We've built Jusoor to simplify business acquisitions and transfers with verified listings, legal security, and real support at every step.
                            </Text> */}
                        </Flex>
                    </Col>
                    {
                        steps?.map((list,i)=>
                            <Col span={24}  key={i}>
                                <Flex vertical align='center' justify='center' className='text-center'
                                >
                                    <Image
                                        src={list?.img}
                                        alt={list?.title}
                                        preview={false}
                                        width={200}
                                    />
                                    <Flex vertical gap={5} align='center' className='maxwidth-400'>
                                        <Title level={5} className='m-0 text-white'>{list?.title}</Title>
                                        <Text className="fs-13 text-white">
                                            {
                                                list?.description
                                            }
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Col>
                        )
                    }                    
                </Row>
            </div>
        </div>
  )
}

export {JusoorFuturembl}