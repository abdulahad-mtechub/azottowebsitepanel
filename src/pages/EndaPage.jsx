import { Breadcrumb, Card, Col, Flex, Row, Typography,Spin } from 'antd'
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useQuery } from "@apollo/client";
import { GETENDATERMS } from '../graphql/query/queries';

const { Text, Title } = Typography;
const EndaPage = () => {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery(GETENDATERMS);
    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }
    return (
        <>
            <div className='padd-1'>
                <div className='bg-dark-blue bread-cs mb-3'>
                    <div className='container'>
                        <Breadcrumb
                            separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                            items={[
                                {
                                    title: <Text className='cursor text-gray' onClick={() => navigate('/')}>Home</Text>,
                                },
                                {
                                    title: <Text className='fw-500 text-white'>
                                        Jusoor E-NDA
                                    </Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>Jusoor E-NDA</Title>
                            <Text className='text-light-gray fs-16'>
                                Must you know about privacy policy of jusoor
                            </Text>
                        </Flex>
                    </div>
                </div>
                <div className='feature '>
                    <div className='container'>
                        <Row gutter={[24, 64]} justify={'center'}>
                            <Col span={24}>
                                <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                                    <div className='tag bg-secondary fw-500 text-brand'>Jusoor E-NDA</div>
                                    <Title className='m-0' level={2}>
                                        Understand the Rules of <span className='text-brand'>Confidentiality on Jusoor</span>
                                    </Title>
                                    <Text className='fs-14'>
                                        Before any deal on Jusoor, both parties must accept the E-NDA to keep financials, strategies, and client data strictly confidential and secure.
                                    </Text>
                                </Flex>
                            </Col>
                            <Col lg={{span: 22}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                                <Card className='bg-light-white border-gray'>
                                    <div className='mx-width'>
                                        <div dangerouslySetInnerHTML={{ __html: data?.getNDATerms?.ndaTerm?.content }} />
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div> 
            </div>
        </>
    )
}

export { EndaPage }
