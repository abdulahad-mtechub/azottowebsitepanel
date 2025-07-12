import React, { useState } from 'react'
import { Button, Card, Checkbox, Col, Flex, Form, Radio, Row, Select, Space, Tooltip, Typography } from 'antd'
import { MyDatepicker, MyInput, MySelect } from '../../Forms'
import { ModuleTopHeading } from '../../Pagecomponents'
import { teamsizeOp } from '../../../data'

const { Title, Text } = Typography
const BusinessDetailStep = () => {

    const [form] = Form.useForm();
    const [ isaccess, setIsAccess ] = useState(true);
    
    const handleRadioChange = (e) => {
        setIsAccess(e.target.value === 2);
    };
    

    return (
        <>
            <Flex vertical gap={1} className='mb-3'>
                <ModuleTopHeading level={4} name='Tell us about your business' />
                <Text className='text-gray'>Let’s start with the basic business information</Text>
            </Flex>
            <Card className='shadow-d radius-12 border-gray'>
                <Form
                    layout="vertical"
                    form={form}
                >
                    <Row gutter={24}>
                        <Col span={24}>
                            <Flex>
                                <Radio.Group 
                                    onChange={handleRadioChange} 
                                    value={isaccess ? 2 : 1}
                                    className='mb-3 margintop-5'
                                >
                                    <Radio value={1} className='fs-14'>
                                        <Flex gap={3} align='center'>
                                            Sell business by Acquiring 
                                            <img src="/assets/icons/info.png" width={20} alt="" />
                                        </Flex>
                                    </Radio>
                                    <Radio value={2} className='fs-14'>
                                        <Flex gap={3} align='center'>
                                            Sell business by Takbeel
                                            <img src="/assets/icons/info.png" width={20} alt="" />
                                        </Flex>
                                    </Radio>
                                </Radio.Group>
                            </Flex>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label="Business Title"
                                name="title"
                                required
                                message="Please enter title"
                                placeholder='Write business name'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MySelect
                                label="Business Category"
                                name="category"
                                required
                                message="Choose business category"
                                options={[
                                    {
                                        id: 1,
                                        name: 'Category 01'
                                    }
                                ]}
                                placeholder='Choose business category'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MySelect
                                label="District"
                                name="district"
                                required
                                message="Choose district"
                                options={[
                                    {
                                        id: 1,
                                        name: 'Makkah'
                                    }
                                ]}
                                placeholder='Choose district'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MySelect
                                label="City"
                                name="city"
                                required
                                message="Choose city"
                                options={[
                                    {
                                        id: 1,
                                        name: 'Tabuk'
                                    }
                                ]}
                                placeholder='Choose city'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyDatepicker
                                datePicker
                                label="Foundation Date"
                                name="dob"
                                required
                                message="Please enter foundation date"
                                placeholder='Enter foundation date'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MySelect
                                label="Team Size"
                                name="teamSize"
                                required
                                message="Choose team size"
                                options={teamsizeOp}
                                placeholder='Enter team size'
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                textArea
                                label="Description"
                                name="description"
                                placeholder='Write description about your business'
                                rows={5}
                            />
                        </Col>
                        <Col span={24}>
                            <MyInput
                                label="Business Website Url"
                                name="url"
                                placeholder={'Add website url'}
                            />
                        </Col>
                    </Row>
                </Form>             
            </Card>
        </>
    )
}

export {BusinessDetailStep}