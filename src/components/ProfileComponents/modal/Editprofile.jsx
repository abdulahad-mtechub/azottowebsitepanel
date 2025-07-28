import React from 'react'
import { Button, Col, Flex, Form, Modal, Row, Select, Typography } from 'antd'
import { MyInput, MySelect } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
import { districtOp } from '../../../data';
const { Title, Text } = Typography
const Editprofile = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            footer={
                <Flex justify='end' gap={5}>
                    <Button type='button' className='btn text-black border-gray' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" className='btn bg-brand' onClick={onClose}>
                        Update
                    </Button>
                </Flex>
            }
            width={600}
        >

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5} className='m-0'>
                        Edit Profile
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-14' />
                    </Button>
                </Flex>
                <Text className='fs-14'>
                    Update your personal  information to keep your account accurate and up to date.
                </Text>
            </Flex>
            <Form
                layout='vertical'
                form={form}
                requiredMark={false}
            >
                <Row>
                    <Col span={24}>
                        <MyInput
                            label='Email Address'
                            name='email'
                            required
                            message="Please enter Email Address"
                            placeholder='Enter Email Address'
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            name="phoneNo"
                            label="Mobile Number"
                            required
                            message="Please enter a valid phone number"
                            addonBefore={
                                <Select
                                    defaultValue="SA"
                                    style={{ width: 80 }}
                                    onChange={(value) => form.setFieldsValue({ countryCode: value })}
                                >
                                    <Select.Option value="sa">SA</Select.Option>
                                    <Select.Option value="ae">AE</Select.Option>
                                </Select>
                            }
                            placeholder="3445592382"
                            value={form.getFieldValue("phoneNo") || ""}
                            className='w-100'
                        />
                    </Col>
                    <Col lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <MySelect
                            label='City'
                            name='city'
                            required
                            message="Please enter city"
                            placeholder='select city'
                            options={districtOp}
                        />
                    </Col>
                    <Col lg={{ span: 24 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <MySelect
                            label='District'
                            name='district'
                            required
                            message="Please enter district"
                            placeholder='select district'
                            options={districtOp}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export { Editprofile } 
