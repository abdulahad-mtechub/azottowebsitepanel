import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Flex, Form, Row, Typography } from 'antd'
import { MyInput } from '../../Forms'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography
const SignJusoorEndaStep = ({form, onClose, user, }) => {
    useEffect(() => {
        if (user) {
          form.setFieldsValue({
            name: user.name || '',
            email: user.email || '',
            phoneNo: user.phone || '',
            ndaAgree: false,
            termsAgree: false,
            commissionAgree: false,
          });
        }
    }, [user, form]);
      
  return (
    <div>
        <Flex vertical className='mb-3' gap={0}>
            <Flex justify='space-between' gap={6}>
                <Title level={5} className='m-0'>
                    Submit Jusoor E-NDA
                </Title>
                <Button type='button' aria-labelledby='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>                
            <Text>
                To continue, please accept the non-disclosure agreement. This ensures trust and security before your meeting.
            </Text>
        </Flex>
        <Card className='tagline mb-3'>
            <Flex vertical gap={5}>
                <Text className='text-brown fw-600'>Included:</Text>
                <ul>
                    <li className='text-brown'>
                        Confidentiality between both parties
                    </li>
                    <li className='text-brown'>
                        Buyer agrees to pay Jusoor’s platform commission if deal is finalized
                    </li>
                    <li className='text-brown'>
                        Acceptance of Jusoor Terms & Conditions
                    </li>
                </ul>
            </Flex>
        </Card>
        <Form
            layout='vertical'
            form={form}
            requiredMark={false}
        >
            <Row>
                <Col span={24}>
                    <MyInput
                        label='Full Name'
                        name='name'
                        required
                        message="Please enter "
                        placeholder='e.g. Jhon watson'
                        className='w-100'
                        disabled
                    />
                </Col>
                <Col span={24}>
                    <MyInput
                        label='Email'
                        name='email'
                        required
                        message="Please enter email"
                        placeholder='e.g. abc@gmail.com'
                        className='w-100'
                        disabled
                    />
                </Col>
                <Col span={24}>
                    <MyInput
                        label='Phone Number'
                        name='phoneNo'
                        required
                        message="Please enter phone number"
                        placeholder='e.g. +123 456 789'
                        className='w-100'
                        disabled
                    />
                </Col>
                <Col span={24}>
                    <Flex vertical gap={5}>
                    <Form.Item name='ndaAgree' valuePropName='checked' className='m-0'>
                        <Checkbox>I agree to the <Link to=''>Jusoor E-NDA Terms</Link></Checkbox>
                    </Form.Item>
                    <Form.Item name='termsAgree' valuePropName='checked' className='m-0'>
                        <Checkbox>I accept Jusoor’s platform <Link to=''>Terms and Conditions</Link></Checkbox>
                    </Form.Item>
                    <Form.Item name='commissionAgree' valuePropName='checked' className='m-0'>
                        <Checkbox>I agree to pay the platform commission if a deal is finalized</Checkbox>
                    </Form.Item>
                    </Flex>
                </Col>
            </Row>
        </Form>
    </div>
  )
}

export {SignJusoorEndaStep}