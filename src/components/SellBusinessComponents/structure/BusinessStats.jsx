import { Card, Col, Flex, Image, Row, Tooltip, Typography } from 'antd'
import { stats } from '../../../data';

const { Title, Text } = Typography
const BusinessStats = ({status}) => {

    return (
        <Card className='radius-12 border-gray mb-3'>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Title level={5} className='m-0'>
                        Business Stats
                    </Title>
                </Col>
                {
                    stats?.map((stat,i)=>
                        <Col lg={{span: 12}} md={{span: 12}} sm={{span: 12}} xs={{span: 24}} key={i}>
                            <Flex gap={10}>
                                <div className='icon-pre'>
                                    <Image src={stat?.icon} preview={false} width={'100%'}  alt="" />
                                </div>
                                <Flex vertical gap={2}>
                                    <Flex gap={4}>
                                        <Title level={5} className='m-0'>
                                            {stat?.title}
                                        </Title>
                                        {(status && status.includes('Verified')) ?
                                            <Tooltip title={'Verified'}>
                                                <Image src='/assets/icons/check-cur.png' preview={false} width={14} />
                                            </Tooltip>
                                            : null
                                        }
                                    </Flex>
                                    <Text className='text-gray fs-12 fw-500'>
                                        {stat?.subtitle}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>
                    )
                }
            </Row>
        </Card>
    )
}

export {BusinessStats}