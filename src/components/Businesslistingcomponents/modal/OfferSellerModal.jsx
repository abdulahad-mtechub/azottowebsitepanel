import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Image, Modal, Row, Tooltip, Typography,message } from 'antd'
import { MyInput } from '../../Forms'
import { useEffect } from 'react'
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation } from '@apollo/client'

const { Title, Text } = Typography
const OfferSellerModal = ({visible,onClose,businessId,offerId,refetch,mode}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm(); 

    const computeCommissionMarginal = (amount) => {
        console.log("amount:", amount);
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
        console.log(offerAmount, "offerAmount");
        let commission = 0;

        
        if (offerAmount === 0) {
            commission = 0;
        } else if (offerAmount < 50000) {
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

    const [createOffer] = useMutation(CREATE_OFFER);

    useEffect(() => {
        form.resetFields();
    }, [visible, form]);

    return (
        <>
        {contextHolder}
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            footer={
                <Flex justify='end' gap={5}>
                    <Button aria-labelledby='Cancel' className='btn text-black border-gray' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button aria-labelledby='Send an Offer' className='btn bg-brand' onClick={async () => {
                        try {
                            const values = await form.validateFields();
                            await createOffer({
                                variables: {
                                    input: {
                                        businessId,
                                        price: parseFloat(values.offeramount),
                                        ...(offerId ? { parentOfferId: offerId } : {}),
                                        ...(mode === "offer" ? { isProceedToPay: false } : {}),
                                        ...(mode === "proceed" ? { isProceedToPay: true } : {}),
                                    },
                                },
                            });
                            messageApi.success("Offer sent successfully!");
                            if (refetch) {
                                refetch({ limit: 10, offset: 0, search: '' });
                            }
                            onClose();
                        } catch (error) {
                            console.error("Validation or mutation error:", error);
                        }
                    }}>
                    Send an Offer
                    </Button>
                </Flex>
            }
            width={600}
        > 

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={4} className='m-0'>
                    {mode === "proceed" ? "Proceed to Purchase" : "Counter Offer to Seller"}
                    </Title>
                    <Button aria-labelledby='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>                
                <Text>
                {mode === "proceed" 
                ? "Confirm your purchase by entering the agreed amount."
                : "Enter your offer amount and terms to send a counter-proposal to the seller."}
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
                            type={'number'}
                            label='Offer Amount'
                            name='offeramount'
                            required
                            message="Please enter offer amount"
                            placeholder='e.g. 75000'
                            addonBefore={
                                <img src='/assets/icons/reyal-g.png' width={14} alt='currency-symbol' fetchPriority="high"/>
                            }
                            className='w-100'
                            onChange={handleOfferAmountChange}
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            label={
                                <Flex gap={2}>
                                    Total Amount <Tooltip title='Includes Jusoor’s 6% commission fee'>
                                        <Image preview={false} src="/assets/icons/info-outline.png" width={14} alt="info icon" />
                                    </Tooltip>
                                </Flex>
                            }
                            name='totalamount'
                            required
                            message="Please enter total amount"
                            placeholder='e.g. 80,000'
                            addonBefore={
                                <Image src='/assets/icons/reyal-g.png' alt='currency-symbol' width={14} />
                            }
                            className='w-100'
                            disabled
                        />
                    </Col>
                </Row>
            </Form>
        </Modal>
        </>
    )
}

export {OfferSellerModal}