import React from 'react'
import { Button, Col, Divider, Flex, Form, Image, Row, Typography } from 'antd'
import { WhatsAppOutlined } from '@ant-design/icons'
import { MyInput } from '../../Forms'

const { Text, Title } = Typography
const Contactform = () => {

    const [ form ] = Form.useForm()

    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 24]} align={'middle'}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={10} className='mx-width'>
                            <div className='tag fw-500 bg-secondary fw-500 text-brand'>Contact With Jusoor</div>
                            <Title className='m-0' level={2}>
                                Reach Out to <span className='text-brand'>Jusoor Team</span>
                            </Title>
                            <Text className='fs-14'>
                                Have a question about a listing or need help getting started? Our team is here to assist you at every stage — from browsing businesses to finalizing the deal. Get in touch and let us guide you through the process with confidence.
                            </Text>
                        </Flex>
                    </Col>
                    <Col lg={{span: 11}} md={{span: 0}} sm={{span: 0}} xs={{span: 0}}>
                        <Flex justify='center'>
                            <Image src='/assets/images/contact.png' preview={false} />
                        </Flex>
                    </Col>
                    <Col lg={{span: 13}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Form
                            form={form}
                            layout='vertical'
                            requiredMark={false}
                        >
                            <Row>
                                <Col span={24}>
                                    <MyInput
                                        label='Full Name'
                                        name='name'
                                        required
                                        message="Please enter name"
                                        placeholder='Enter your full name'
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        label='Email'
                                        name='email'
                                        required
                                        message="Please enter email"
                                        placeholder='Enter your email address'
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        textArea
                                        label='Message'
                                        name='message'
                                        required
                                        message="Please enter message"
                                        placeholder='Write your question or message here...'
                                        rows={7}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Button type='button' className='btn btn-bg w-100'>Submit</Button>
                                </Col>
                                <Col span={24}>
                                    <Divider className='my-2'>Or</Divider>
                                </Col>
                                <Col span={24}>
                                    <Flex gap={10} align='center' justify='center'>
                                        <Text className='text-gray fs-13'>Message Us on WhatsApp</Text>
                                        <Button className='bg-green text-white rounded-20 fs-13'>WhatsApp <WhatsAppOutlined/> </Button>
                                    </Flex>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { Contactform }
