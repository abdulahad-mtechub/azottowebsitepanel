import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Image, Modal, Row, Tooltip, Typography } from 'antd'
import { MyInput } from '../../Forms'
import { useEffect } from 'react'
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation } from '@apollo/client'
import { useState } from 'react'
import { message } from "antd";


const { Title, Text } = Typography
const CounterOffer = ({visible,onClose}) => {
    const [messageApi, contextHolder] = message.useMessage();

    const [form] = Form.useForm(); 

    const handleOfferAmountChange = (e) => {
        const offerAmount = parseFloat(e.target.value) || 0;
        const totalAmount = offerAmount + (offerAmount * 0.06);
        form.setFieldsValue({ totalamount: totalAmount.toFixed(2) });
    };


    useEffect(() => {
        form.resetFields();
    }, [visible, form]);

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
                    <Button type="primary" className='btn bg-brand' >
                        Send Counter Offer
                    </Button>
                </Flex>
            }
            width={600}
        > 

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={4} className='m-0'>
                        Counter Offer to Seller
                    </Title>
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>                
                <Text>
                    Enter your offer amount to send a counter offer to the Buyer.
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
                            label='Offer Amount'
                            name='offeramount'
                            required
                            message="Please enter offer amount"
                            placeholder='e.g. 75000'
                            addonBefore={
                                <img src='/assets/icons/reyal-g.png' width={14} />
                            }
                            className='w-100'
                            onChange={handleOfferAmountChange}
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

export {CounterOffer}