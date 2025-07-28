import { Button, Col, Flex, Form, Modal, Row, Typography } from 'antd'
import { CloseOutlined } from '@ant-design/icons';
import { MyDatepicker } from '../../Forms';

const { Title, Text } = Typography
const ScheduleMeeting = ({visible,onClose}) => {
     
    const [form] = Form.useForm(); 
    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                <Flex justify='end' gap={5}>
                    <Button type='button' className='btn text-black border-gray' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" className='btn bg-brand' onClick={()=>form.submit()}>
                        Send Meeting Request
                    </Button>
                </Flex>
            }
            width={600}
            > 

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5} className='m-0'>
                        Schedule Virtual Meeting
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>                
                <Text className='fs-14'>
                    Please share your availability to meet with the Seller for final deal discussion.
                </Text>
            </Flex>
            <Form
                layout='vertical'
                form={form}
                requiredMark={false}
            >
                <Row>
                    <Col span={24}>
                        <MyDatepicker
                            datePicker
                            label='Meeting Date'
                            name='date'
                            className='w-100'
                        />
                    </Col>
                    <Col span={24}>
                        <MyDatepicker
                            label='Meeting Time'
                            name='time'
                            className='w-100'
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export {ScheduleMeeting} 
