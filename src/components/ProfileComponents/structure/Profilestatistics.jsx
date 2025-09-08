import { Card, Row, Col, Typography, Flex, Button, Image } from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';

const { Title, Text } = Typography;

const Profilestatistics = ({data, title}) => {
    return (
        <Card className='rounded-12  border-gray'>
            <Flex justify='space-between'>
                <ModuleTopHeading level={4} name={title}/>
                <Button type='button' className='bg-transparent border-gray'>
                    <img src='/assets/icons/calendar.png' alt='calendar-icon' width={20} /> 01/02/2025 - 30/02/2025
                </Button>
            </Flex>
            <Row gutter={[16, 16]} className='mt-2'>
                {
                    data?.map((data, i) => (
                        <Col lg={{span: 8}} md={{span: 12}} sm={{span: 12}} xs={{span: 12}} key={i}>
                                <Card className='h-100 border-gray rounded-12' >
                                    <Flex vertical gap={15}>
                                        <Image src={data?.img} alt='icon' preview={false} width={40} />
                                        <div>
                                            <Text className='fs-14 text-gray'>
                                                {data?.title}
                                            </Text>
                                            <Title className='m-0' level={5}>
                                                {data?.numbers}
                                            </Title>
                                            
                                        </div>
                                    </Flex>
                                </Card>
                            </Col>
                    ))
                }

            </Row>
        </Card>
    )
}

export { Profilestatistics } 
