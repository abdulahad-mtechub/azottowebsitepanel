import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Image, Modal, Row, Typography, message, Popover, Table } from 'antd'
import { MyInput } from '../../Forms'
import { useEffect } from 'react'
import { CREATE_OFFER } from '../../../graphql/mutation/mutations'
import { useMutation } from '@apollo/client'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography
const OfferSellerModal = ({visible,onClose,businessId,offerId,refetch,mode}) => {

    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm(); 

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
        const offerAmount = parseFloat(String(raw).replace(/,/g, "")) || 0;
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

    const [createOffer, { loading: createOfferLoading }] = useMutation(CREATE_OFFER, {
        onCompleted: () => refetch && refetch()
    });

    useEffect(() => {
        form.resetFields();
    }, [visible, form]);

    // Commission bracket table data
    const commissionBrackets = [
        {
            key: '1',
            bracket: '0 - 100,000 SAR',
            rate: '4%',
            description: 'First 100K'
        },
        {
            key: '2',
            bracket: '100,001 - 500,000 SAR',
            rate: '3%',
            description: 'Next 400K'
        },
        {
            key: '3',
            bracket: '500,001 - 2,000,000 SAR',
            rate: '2.5%',
            description: 'Next 1.5M'
        },
        {
            key: '4',
            bracket: '2,000,001+ SAR',
            rate: '1.5%',
            description: 'Above 2M'
        }
    ];

    const columns = [
        {
            title: 'Price Range',
            dataIndex: 'bracket',
            key: 'bracket',
            width: '45%'
        },
        {
            title: 'Rate',
            dataIndex: 'rate',
            key: 'rate',
            width: '25%'
        },
        {
            title: 'Applied To',
            dataIndex: 'description',
            key: 'description',
            width: '30%'
        }
    ];

    const commissionContent = (
        <div style={{ maxWidth: '400px' }}>
            <Title level={5} style={{ marginBottom: '12px', color: 'var(--brand-color)' }}>
                {t("Jusoor Commission Structure")}
            </Title>
            <Text style={{ display: 'block', marginBottom: '16px', fontSize: '13px' }}>
                <strong>{t("Marginal Commission System:")}</strong> {t("Each rate applies only to the amount within its bracket.")}
            </Text>
            
            <Table 
                dataSource={commissionBrackets}
                columns={columns}
                pagination={false}
                size="small"
                bordered
                style={{ marginBottom: '16px' }}
            />

            <div style={{ 
                backgroundColor: 'var(--light-orange)', 
                padding: '8px', 
                borderRadius: '8px',
                marginBottom: '12px'
            }}>
                <Text strong style={{ fontSize: '13px', color: 'var(--orange)' }}>
                    Minimum Commission:
                </Text>
                <Text style={{ display: 'block', fontSize: '12px', marginTop: '4px' }}>
                    For deals under 50,000 SAR, a minimum commission of 2,000 SAR applies.
                </Text>
            </div>
        </div>
    );

    return (
        <>
        {contextHolder}
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                <Flex justify='end' gap={5}>
                    <Button aria-labelledby='Cancel' className='btn text-black border-gray' onClick={onClose}>
                        {t("Cancel")}
                    </Button>
                    <Button aria-labelledby='Send an Offer' loading={createOfferLoading} disabled={createOfferLoading} className='btn bg-brand' onClick={async () => {
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
                            messageApi.success(t("Offer sent successfully!"));
                            if (refetch) {
                                refetch({ limit: 10, offset: 0, search: '' });
                            }
                            onClose();
                        } catch (error) {
                            console.error("Validation or mutation error:", error);
                        }
                    }}>
                    {t("Send an Offer")}
                    </Button>
                </Flex>
            }
            width={600}
        > 

            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={4} className='m-0'>
                    {mode === "proceed" ? t("Proceed to Purchase") : t("Counter Offer to Seller")}
                    </Title>
                    <Button aria-labelledby='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>                
                <Text>
                {mode === "proceed" 
                ? t("Confirm your purchase by entering the agreed amount.")
                : t("Enter your offer amount and terms to send a counter-proposal to the seller.")}
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
                            label={t('Offer Amount')}
                            name='offeramount'
                            required
                            message={t("Please enter offer amount")}
                            placeholder={t('e.g. 75000')}
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
                                <Flex gap={6} align='center'>
                                    <Text>{t(`Total Amount (Offer + Commission)`)}</Text>
                                    <Popover 
                                        content={
                                            <Text>{t("This is the total amount including the commission.")}</Text>}
                                        title={null}
                                        trigger={['hover', 'click']}
                                        placement="left"
                                        autoAdjustOverflow={true}
                                        overlayStyle={{ 
                                            maxWidth: '450px',
                                            zIndex: 1060
                                        }}
                                        overlayInnerStyle={{ 
                                            maxHeight: '70vh', 
                                            overflowY: 'auto',
                                            overflowX: 'hidden'
                                        }}
                                    >
                                        <Image 
                                            preview={false} 
                                            src="/assets/icons/info-outline.png" 
                                            width={16} 
                                            alt="Commission info" 
                                            style={{ cursor: 'pointer' }}
                                        />
                                    </Popover>
                                </Flex>
                            }
                            name='totalamount'
                            required
                            message={t("Please enter total amount")}
                            placeholder={t('e.g. 80,000')}
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