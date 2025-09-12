import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { documentData } from '../../../data';

const { Title, Text } = Typography
const DocumentUploadedPrev = () => {

    return (
        <Card className='shadow-d radius-12 border-gray mb-3'>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Title level={5} className='m-0'>
                        Documents
                    </Title>
                </Col>
                {
                    documentData?.map((stat,i)=>
                        <Col span={24} key={i}>
                            <Flex gap={10} className='p-3 border-gray rounded-12'>
                                <Image src={'/assets/icons/file.png'} preview={false} width={24}  alt="file icon" />
                                <Flex vertical gap={2}>
                                    <Title level={5} className='m-0'>
                                        {stat?.name}
                                    </Title>
                                    <Text className='text-gray fs-12 fw-500'>
                                        {stat?.size}
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

export {DocumentUploadedPrev}