import { useState } from 'react'
import { Breadcrumb, Card, Col, Collapse, Flex, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom';
import { faqsData } from '../data';
import { MinusOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Contactform } from '../components';

const { Text, Title } = Typography;
const { Panel } = Collapse;
const Termofuse = () => {
    const navigate = useNavigate();
    const [currentPanel,setCurrentPanel]=useState(['0'])


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
                                    title: <Text className='fw-500 text-gray'>
                                        Term to Use
                                    </Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>Term to Use</Title>
                            <Text className='text-white'>
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
                                    <Flex vertical gap={15} className='mb-3'>
                                        <Title level={4} className='m-0'>01 Overview & Acceptance</Title>
                                        <Flex vertical gap={8}>
                                            <Text className='text-justify'>
                                                Welcome to Jusoor, a digital platform developed to enable the secure buying and selling of verified businesses across Saudi Arabia. By accessing, registering, or using any service on the Jusoor platform, you agree to be legally bound by these Terms of Use. These terms outline your rights, responsibilities, and limitations while using the platform and apply to all users including buyers, sellers, and unregistered visitors. If you do not accept these terms, you may not access or use any feature of Jusoor.
                                            </Text>
                                            <Text className='text-justify'>
                                                Using the platform constitutes your full acceptance of these Terms, along with our Privacy Policy, Commission Guidelines, and any other policies referenced. This agreement governs all platform activity, including creating listings, uploading business documents, engaging in buyer–seller communication, signing E-NDAs, and participating in transactions. Users are expected to act in good faith, follow Saudi regulations, and ensure accuracy and truthfulness in all information provided.
                                            </Text>
                                            <Text className='text-justify'>
                                                These terms apply uniformly to everyone on the platform — whether you're browsing listings, posting a business for sale, initiating offers, or participating in Jusoor-facilitated meetings. Jusoor reserves the right to update or modify these Terms at any time, and such changes will become effective upon being posted. Continued use of the platform after an update signifies your agreement to the modified terms. The latest version of this agreement will always be accessible, and we encourage users to review it periodically.
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Flex vertical gap={15} className='mb-3'>
                                        <Title level={4} className='m-0'>02 Account Creation & Eligibility</Title>
                                        <Flex vertical gap={8}>
                                            <Text className='text-justify'>
                                                To access the full services offered by Jusoor, including listing a business for sale, submitting offers, signing E-NDAs, or communicating via our internal chat system, you are required to create a user account. During the registration process, users must provide accurate, current, and complete information, including but not limited to valid identification, Commercial Registration (CR) for sellers, and contact information. Jusoor may verify this information through third-party services or internal review, and reserves the right to reject any account application at its sole discretion.
                                            </Text>
                                            <Text className='text-justify'>
                                                By registering, you affirm that you are at least 18 years of age and legally capable of entering into binding agreements under applicable laws in Saudi Arabia. Entities registering on behalf of a company or organization confirm that they have the legal authority to bind that entity to these Terms. Individuals acting without proper authorization will have their accounts suspended or removed without notice.
                                            </Text>
                                            <Text className='text-justify'>
                                                Users are solely responsible for maintaining the confidentiality of their login credentials and are fully accountable for all activities conducted under their account. You agree to notify Jusoor immediately of any unauthorized use of your account or breach of security. Jusoor will not be liable for any loss or damage arising from your failure to protect your login credentials.
                                            </Text>
                                            <Text className='text-justify'>
                                                Each individual or entity is permitted to maintain only one active Jusoor account unless expressly approved otherwise. Duplicate or fake accounts will be permanently removed, and any ongoing transactions may be suspended. Additionally, users who fail to meet our eligibility requirements may have their access restricted or terminated at any stage.
                                            </Text>
                                        </Flex>
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
