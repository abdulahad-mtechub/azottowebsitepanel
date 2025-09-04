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

    const handleOfferAmountChange = (e) => {
        const offerAmount = parseFloat(e.target.value) || 0;
        const totalAmount = offerAmount + (offerAmount * 0.06);
        form.setFieldsValue({ totalamount: totalAmount.toFixed(2) });
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
                    <Button type='button' className='btn text-black border-gray' onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="primary" className='btn bg-brand' onClick={async () => {
                        try {
                            const values = await form.validateFields();
                            await createOffer({
                                variables: {
                                    input: {
                                        businessId,
                                        price: parseFloat(values.offeramount),
                                        ...(offerId ? { parentOfferId: offerId } : {}),
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
                    <Button type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
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
                    <Col span={24}>
                        <MyInput
                            label={
                                <Flex gap={2}>
                                    Total Amount <Tooltip title='Includes Jusoor’s 6% commission fee'>
                                        <Image preview={false} src="/assets/icons/info-outline.png" width={14} alt="" />
                                    </Tooltip>
                                </Flex>
                            }
                            name='totalamount'
                            required
                            message="Please enter total amount"
                            placeholder='e.g. 80,000'
                            addonBefore={
                                <Image src='/assets/icons/reyal-g.png' width={14} />
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