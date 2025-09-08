import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Modal, Row, Typography,message } from 'antd'
import { MyInput } from '../../Forms'
import { useEffect } from 'react'
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation } from '@apollo/client'
import { COUNTER_OFFER } from '../../../graphql/mutation';

const { Title, Text } = Typography
const CounterOffer = ({visible,onClose,selectedOfferId}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [counterOffer, { loading }] = useMutation(COUNTER_OFFER);

    const handleOfferAmountChange = (e) => {
        const offerAmount = parseFloat(e.target.value) || 0;
        const totalAmount = offerAmount + (offerAmount * 0.06);
        form.setFieldsValue({ totalamount: totalAmount.toFixed(2) });
    };

    useEffect(() => {
        form.resetFields();
    }, [visible, form]);

    // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const offerAmount = parseFloat(values.offeramount);
      const totalAmount = offerAmount + offerAmount * 0.06;

      await counterOffer({
        variables: {
          input: {
            parentOfferId: selectedOfferId,
            price: totalAmount, // send calculated total amount
          },
        },
      });

      messageApi.success('Counter offer sent successfully!');
      onClose();
    } catch (err) {
      console.error(err);
      messageApi.error('Failed to send counter offer.');
    }
  };

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
                    <Button type="primary" className='btn bg-brand' onClick={handleSubmit}>
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
                            type='number'
                            label='Offer Amount'
                            name='offeramount'
                            required
                            message="Please enter offer amount"
                            placeholder='e.g. 75000'
                            addonBefore={
                                <img src='/assets/icons/reyal-g.png' alt='currency-symbol' width={14} />
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