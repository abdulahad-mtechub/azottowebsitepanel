import { Button, Col, Flex, Form, Modal, Row, Typography } from 'antd'
import { MyInput } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
const { Title, Text } = Typography
const Changepassword = ({visible,onClose}) => {
     
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
                    <Button type="primary" className='btn bg-brand' onClick={()=>form.submit()}>
                        Confirm
                    </Button>
                </Flex>
            }
            width={600}
            > 

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5} className='m-0'>
                        Change Password
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-14' />
                    </Button>
                </Flex>                
                <Text className='fs-14'>
                    Enter your current password & type new password to update.
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
                            label='Current Password'
                            name='currentpassword'
                            message="Enter your current password"
                            placeholder='Enter your current password'
                            className='w-100'
                            type='password'
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            label='New Password'
                            name='newpassword'
                            message="Enter your new password"
                            placeholder='Enter your new password'
                            className='w-100'
                            type='password'
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            label='Confirm New Password'
                            name='confirmnewpassword'
                            message="Enter your confirm new password"
                            placeholder='Enter your confirm new password'
                            className='w-100'
                            type='password'
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export {Changepassword} 
