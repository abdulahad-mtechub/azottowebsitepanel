import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { browsetypeData } from '../../../data'

const { Text, Title } = Typography
const BrowseType = () => {

    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 40]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag fw-500 bg-secondary fw-500 text-brand'>Browse by Type</div>
                            <Title className='m-0' level={2}>
                                 Discover Businesses Across <span className='text-brand'>Popular Categories</span>
                            </Title>
                            <Text className='fs-14'>
                                Whether you’re looking to buy or sell a thriving business, explore active categories that cover a wide range of local industries in Saudi Arabia.
                            </Text>
                        </Flex>
                    </Col>
                    {
                        browsetypeData?.map((type,i)=>
                            <Col lg={{span: 6}} md={{span: 12}} sm={{span: 24}} xs={{span: 24}} key={i}>
                                <Card className='h-100 border-brand rounded-12' >
                                    <Flex vertical gap={20}>
                                        <Image src={type?.icons} preview={false} width={40} />
                                        <div>
                                            <Title className='m-0' level={5}>
                                                {type?.title}
                                            </Title>
                                            <Text className='fs-14'>
                                                {type?.description}
                                            </Text>
                                        </div>
                                    </Flex>
                                </Card>
                            </Col>
                        )
                    }
                    <Col span={24}>
                        <Flex justify='center'>
                            <Button className='btn bg-brand'>
                                Explore More Categories <RightOutlined className='fs-10' />
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { BrowseType }
