import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Flex, Form, Row, Typography } from 'antd'
import { MyDatepicker, MyInput } from '../../Forms'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography
const ScheduleMeetingStep = ({form,onClose}) => {
  return (
    <div>
        <Flex vertical className='mb-3' gap={0}>
            <Flex justify='space-between' gap={6}>
                <Title level={5} className='m-0'>
                    Schedule Virtual Meeting
                </Title>
                <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>                
            <Text>
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
    </div>
  )
}

export {ScheduleMeetingStep}