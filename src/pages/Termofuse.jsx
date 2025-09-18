import { Breadcrumb, Card, Col, Flex, Row, Typography,Spin } from 'antd'
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import {GETTERMS} from '../graphql/query/queries'
import { useQuery } from "@apollo/client";
const {Paragraph, Text, Title } = Typography;
const Termofuse = () => {
    const navigate = useNavigate();
    const  {data, loading , error,refetch} = useQuery(GETTERMS,{
        variables: { search: "" },
    });
    if (loading) {
        return (
            <Flex justify="center" align="center" className="h-200">
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
                                        Term to Use
                                    </Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>Term to Use</Title>
                            <Text className='text-light-gray fs-16'>
                                Understand the rules that govern how you use Jusoor  your access, rights, and responsibilities on our platform.
                            </Text>
                        </Flex>
                    </div>
                </div>
                <div className='feature '>
                    <div className='container'>
                        <Row gutter={[24, 64]} justify={'center'}>
                            <Col span={24}>
                                <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                                    <div className='tag bg-secondary fw-500 text-brand'>Term to Use</div>
                                    <Title className='m-0' level={2}>
                                        Understand the Rules Before You <span className='text-brand'>List or Buy a Business</span>
                                    </Title>
                                    <Text className='fs-14'>
                                        Understand the key legal terms for using Jusoor including listings, confidentiality, commissions, and data protection.
                                    </Text>
                                </Flex>
                            </Col>
                            <Col lg={{span: 22}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                                <Card className='bg-light-white border-gray'>
                                <Flex vertical gap={20}>
                                <div>
                                    <Paragraph  className='fs-14 text-gray'>
                                         <span dangerouslySetInnerHTML={{ __html: data?.getTerms?.term?.content }} />
                                    </Paragraph>
                                </div>
                            </Flex>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div> 
            </div>
        </>
    )
}

export { Termofuse }
