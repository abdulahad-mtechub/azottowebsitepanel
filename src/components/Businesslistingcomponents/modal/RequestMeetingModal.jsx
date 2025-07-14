import { CloseOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Flex, Form, Image, Modal, Row, Tooltip, Typography } from 'antd'
import { MyInput } from '../../Forms'
import { Link } from 'react-router-dom'
import { ScheduleMeetingStep, SignJusoorEndaStep } from '../structure'
import { useState } from 'react'

const { Title, Text } = Typography
const RequestMeetingModal = ({visible,onClose}) => {

    const [form] = Form.useForm(); 
    const [current, setCurrent] = useState(0);

    const steps = [
        {
            title: null,
            content: <SignJusoorEndaStep form={form} onClose={onClose} />,
        },
        {
            title: null,
            content: <ScheduleMeetingStep form={form} onClose={onClose} />,
        },
    ];

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            footer={null}
            width={600}
        > 
            <div className="step-content mb-3">{steps[current].content}</div>
            <Flex gap={10} justify='end'>
                <Button disabled={current > 0 ? false: true} className='btn text-black border-gray' onClick={prev}>
                    Previous
                </Button>
                {current < steps.length - 1 && (
                    <Button type="primary" className='btn bg-brand' onClick={next}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" className='btn bg-brand'>
                        Send Meeting Request
                    </Button>
                )}
            </Flex>
        </Modal>
    )
}

export {RequestMeetingModal}