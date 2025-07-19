import { Button, Card, Col, Flex, Row, Typography } from 'antd'
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { articleData } from '../data';
import { SuggestedArticles } from '../components';

const { Text, Title, Paragraph } = Typography;
const ArticleSingleView = () => {
    const navigate = useNavigate();
    const { id } = useParams()
    const data = articleData?.find((item)=>item?.id == id)
    return (
        <>
            <div className='padd'>
                <div className='feature pt-0'>
                    <div className='container'>
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Flex vertical gap={15}>
                                    <Flex vertical align='flex-start' gap={5}>
                                        <Button className='border-0 p-0 bg-transparent' onClick={()=>navigate(-1)}>
                                            <ArrowLeftOutlined />
                                        </Button>
                                        <Title className='m-0' level={2}>
                                            {data?.title}
                                        </Title>
                                    </Flex>
                                    <Text className='fs-13 text-gray'>{data?.date}</Text>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Card className='h-100 border-gray rounded-12 card-cs'>
                                    <Flex vertical gap={15}>
                                        <div className='w-full h-400 mb-2 rounded-12 overflow-hidden'>
                                            <img src={data?.img} width={'100%'} height={'100%'} className='object-cover object-top' alt="" />
                                        </div>
                                        <Paragraph className='fs-14 text-gray'>
                                            When selling a business, confidentiality is paramount. Non-disclosure agreements (NDAs) are essential legal documents that protect sensitive information during the sale process. This comprehensive guide explains everything you need to know about NDAs in business sales.
                                        </Paragraph>
                                        <Flex vertical gap={5}>
                                            <Title level={5}>Overview & Acceptance</Title>
                                            <Paragraph className='fs-14 text-gray'>
                                                When selling a business, confidentiality is paramount. Non-disclosure agreements (NDAs) are essential legal documents that protect sensitive information during the sale process. This comprehensive guide explains everything you need to know about NDAs in business sales.
                                            </Paragraph>
                                        </Flex>
                                        <Flex vertical gap={5}>
                                            <Title level={5}>Key Elements of an Effective NDA</Title>
                                            <Paragraph className='fs-14 text-gray mb-1'>
                                                An effective NDA for business sales should include several critical components to ensure comprehensive protection:
                                            </Paragraph>
                                            <ul className='ml-20'>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Clear definition of what constitutes confidential information
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Specific obligations of the receiving party
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Exclusions from confidential treatment
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Term of the agreement (duration of confidentiality)Remedies for breach of contract
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Return or destruction of confidential materials
                                                    </Paragraph>
                                                </li>
                                            </ul>
                                        </Flex>
                                        <Flex vertical gap={5}>
                                            <Title level={5}>Implementation Best Practices</Title>
                                            <Paragraph className='fs-14 text-gray mb-1'>
                                                Follow these best practices to maximize the effectiveness of your NDA:
                                            </Paragraph>
                                            <ul className='ml-20'>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Have the NDA signed before sharing any sensitive information
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Customize the NDA for your specific business and situation
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Clearly mark all confidential documents
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Maintain a log of all information shared.
                                                    </Paragraph>
                                                </li>
                                                <li>
                                                    <Paragraph className='fs-14 text-gray mb-1'>
                                                        Limit access to confidential information to necessary parties only
                                                    </Paragraph>
                                                </li>
                                            </ul>
                                        </Flex>
                                        <Flex vertical gap={5}>
                                            <Title level={5}>Key Sectors for Investment</Title>
                                            <Paragraph className='fs-14 text-gray mb-1'>
                                                Several sectors stand out as particularly promising for foreign investors looking to enter the Saudi market or expand their existing operations:
                                            </Paragraph>
                                            <Flex vertical gap={5}>
                                                <Paragraph className='fs-14 m-0 fw-500'>1. Technology and Digital Economy</Paragraph>
                                                <Paragraph className='fs-14 text-gray'>
                                                    Saudi Arabia is investing heavily in its digital infrastructure and technology ecosystem. The establishment of tech hubs like NEOM's cognitive cities and King Abdullah Financial District is creating demand for advanced technologies in AI, IoT, cloud computing, and cybersecurity.
                                                </Paragraph>
                                            </Flex>
                                            <Flex vertical gap={5}>
                                                <Paragraph className='fs-14 m-0 fw-500'>2. Renewable Energy</Paragraph>
                                                <Paragraph className='fs-14 text-gray'>
                                                    The Kingdom has set ambitious targets for renewable energy, aiming to generate 50% of its electricity from renewables by 2030. This creates significant opportunities for investment in solar and wind projects, as well as energy storage solutions.
                                                </Paragraph>
                                            </Flex>
                                            <Flex vertical gap={5}>
                                                <Paragraph className='fs-14 m-0 fw-500'>3. Tourism and Entertainment</Paragraph>
                                                <Paragraph className='fs-14 text-gray'>
                                                    With mega-projects like the Red Sea Project, Qiddiya, and AlUla, Saudi Arabia is positioning itself as a premier tourist destination. Opportunities exist in hotel development, entertainment venues, and tourism services.
                                                </Paragraph>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <SuggestedArticles />
            </div>
        </>
    )
}

export { ArticleSingleView }
