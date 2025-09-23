import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Modal, Row, Typography,message } from 'antd'
import { MyInput } from '../../Forms'
import { useEffect } from 'react'
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation } from '@apollo/client'
import { COUNTER_OFFER } from '../../../graphql/mutation';

const { Title, Text } = Typography
const CounterOffer = ({visible,onClose,selectedOfferId,title='Counter Offer to Seller'}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [counterOffer, { loading }] = useMutation(COUNTER_OFFER);

    const computeCommissionMarginal = (amount) => {
        
        if (!amount || amount <= 0) return 0;
        let remaining = amount;
        let commission = 0;
        const b1Limit = 100_000;
        if (remaining > 0) {
            const part = Math.min(remaining, b1Limit);
            commission += part * 0.04;
            remaining -= part;
        }
        const b2Limit = 400_000; 
        if (remaining > 0) {
            const part = Math.min(remaining, b2Limit);
            commission += part * 0.03;
            remaining -= part;
        }
        const b3Limit = 1_500_000;
        if (remaining > 0) {
            const part = Math.min(remaining, b3Limit);
            commission += part * 0.025;
            remaining -= part;
        }
        if (remaining > 0) {
            commission += remaining * 0.015;
        }
        return commission;
    };

    const handleOfferAmountChange = (e) => {
        const raw = e?.target?.value;
        console.log("raw:", raw);
        const offerAmount = parseFloat(String(raw).replace(/,/g, "")) || 0;
        let commission = 0;

        if (offerAmount === 0) {
            commission = 0;
        } else if (offerAmount < 50_000) {
            commission = 2000;
        } else {
            commission = computeCommissionMarginal(offerAmount);
        }

        const commissionRounded = Number(commission.toFixed(2));
        const totalAmount = Number((offerAmount + commissionRounded).toFixed(2));

        form.setFieldsValue({
            commission: commissionRounded,
            totalamount: totalAmount,
        });
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
            price: totalAmount, 
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
                    <Button aria-labelledby='Cancel' type='button' className='btn text-black border-gray' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button aria-labelledby='Send Counter Offer' type="primary" className='btn bg-brand' onClick={handleSubmit}>
                        Send Counter Offer
                    </Button>
                </Flex>
            }
            width={600}
        > 

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={4} className='m-0'>
                        {title}
                    </Title>
                    <Button aria-labelledby='Close' type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
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
                                <img src='/assets/icons/reyal-g.png' alt='currency-symbol' width={14} fetchPriority="high" />
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