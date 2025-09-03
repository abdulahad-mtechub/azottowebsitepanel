import React, { useState } from 'react';
import { Flex, Typography, Steps, Collapse, Form } from 'antd';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { DigitalSaleAgreementStep } from './DigitalSaleAgreementStep';
import { BankAccountDetailsStep } from './BankAccountDetailsStep';
import { ConfirmationDocsStep } from './ConfirmationDocsStep';
import { SellerFinalDealsStep } from './SellerFinalDealStep';
import { GETBANKSFORDEAL } from '../../../graphql/query';
import { useQuery } from '@apollo/client';


const statusToStepIndex = {
    COMMISSION_TRANSFER_FROM_BUYER_PENDING: 0, // Step 1: Commission Receipt
    COMMISSION_VERIFIED: 0, // still step 1
    DSA_FROM_SELLER_PENDING: 1, // Step 2: Digital Sale Agreement
    DSA_FROM_BUYER_PENDING: 1, // Step 2: Digital Sale Agreement
    BANK_DETAILS_FROM_SELLER_PENDING: 2, // Step 3: Bank Account Details
    SELLER_PAYMENT_VERIFICATION_PENDING: 3, // Step 4: Pay Business Amount
    PAYMENT_APPROVAL_FROM_SELLER_PENDING: 3, // Step 4: Pay Business Amount
    DOCUMENT_PAYMENT_CONFIRMATION: 4, // Step 5: Document & Payment Confirmation
    WAITING: 4, // Step 5
    BUYERCOMPLETED: 5, // Step 6: Finalize Deal
    SELLERCOMPLETED: 5, // Step 6
    COMPLETED: 5, // Step 6
    PENDING: 0, // default first step
};

const { Text } = Typography;

const SellerSingleInprogressSteps = ({completedeal,user,deal}) => {
    const [form] = Form.useForm();
    const initialStep = deal?.status ? statusToStepIndex[deal.status] || 0 : 0;
    const [activeStep, setActiveStep] = useState(initialStep);
   const { data, loading: fetching } = useQuery(GETBANKSFORDEAL, {
       variables: { dealId: deal?.key },
       fetchPolicy: "network-only", // ensures fresh data
     });
    const buyerBanks = data?.getBankDetailsByDealId;
    const found = deal?.busines?.documents?.find(doc => doc.title === "Jasoor Commission");
    const send = buyerBanks?.find(b => b?.isSend === true);
    const DSA = deal?.status
    const steps = [
        {
            key: '1',
            label: 'Digital Sale Agreement',
            content: <DigitalSaleAgreementStep form={form} details={deal} />,
            status: 
            DSA === 'DSA_FROM_SELLER_PENDING'
                ? 'Seller DSA Pending'
                : DSA === 'DSA_FROM_BUYER_PENDING'
                ? 'Buyer DSA Pending'
                : 'Verified',
            emptytitle: 'DSA Pending!',
            emptydesc: 'Waiting for the seller & buyer to sign the digital sale agreement.',
        },
        {
            key: '2',
            label: 'Bank Account Details',
            content: <BankAccountDetailsStep details={deal} />,
            status: send?.isSend ? 'Send' : 'Pending',
            emptytitle: 'Bank Details Pending!',
            emptydesc: 'Waiting for the seller to choose the bank account.',
        },
        {
            key: '3',
            label: 'Payment Confirmation & Docs',
            content: <ConfirmationDocsStep details={deal} />,
            status:  deal?.isDocVedifiedSeller ? 'Jusoor verification pending': 'Seller verification pending',
            emptytitle: 'Payment Confirmation Pending!',
            emptydesc: 'Waiting for the seller to transfer the document & approve the payment.',
        },
        {
            key: '4',
            label: 'Finalize Deal',
            content: <SellerFinalDealsStep details={deal} />,
            status: deal?.isDocVedifiedAdmin ? "Verified" : 'Pending',
            emptytitle: 'Deal Pending!',
            emptydesc: 'Waiting for the buyer & seller to finalized the deal.',
        },
    ];
    const [openPanels, setOpenPanels] = useState(
        deal ? steps.slice(0, initialStep + 1).map(step => step.key) : ['1']
    );

    const getStepItems = (steps) =>
        steps.map((item) => ({
            key: item.key,
            label: (
                <Flex justify='space-between' align='center'>
                    <span className='custom-step-title fw-600 fs-15'>{item.label}</span>
                    <span className='collapse-indicator'>
                        {openPanels.includes(item.key) ? (
                            <Flex align='center' gap={5}>
                                {(item.status.toLowerCase()?.startsWith('pending')) ? (
                                    <Text className='pending fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                ) : (item.status.toLowerCase()?.includes('verification')) ? (
                                    <Text className='branded fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                )                                
                                : (
                                    <Text className='success fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                )}
                                <UpOutlined />
                            </Flex>
                        ) : (
                            <DownOutlined />
                        )}
                    </span>
                </Flex>
            ),
            children: (
                item?.content === null || item?.content === '' ? (
                    <>
                        <Flex className='text-center' vertical justify='center' align='center'>
                            <Title level={5} className='fw-500 m-0 fs-14'>{item?.emptytitle}</Title>
                            <Text className='fs-14 text-gray'>{item?.emptydesc}</Text>
                        </Flex>
                        {
                            item?.key === '2' &&
                            <Flex vertical gap={5} className='mt-2'>
                                <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                                    <CheckCircleOutlined className='fs-14' /> Waiting for seller to sign the sales agreement
                                </Flex>
                                <Flex gap={5} className='badge-cs pending fs-12 fit-content' align='center'>
                                    <CheckCircleOutlined className='fs-14' /> Waiting for buyer to sign the sales agreement
                                </Flex>
                            </Flex> 
                        }
                    </>
                ) : (
                    <div className="step-content">{item.content}</div>
                )
            ),
            showArrow: false,
            extra: null,
        }));

    const stepsProgress = steps.map((item, index) => ({
        key: item.label,
        title: (
            <span className={`custom-step-title ${activeStep >= index ? 'completed' : ''}`}>
                {item.label}
            </span>
        ),
    }));

    return (
        <Flex vertical gap={25} className='mt-3'>        
            <Steps
                className='mt-3'
                current={activeStep}
                items={stepsProgress}
                progressDot={(dot, { status, index }) => (
                    <span className={`custom-dot ${activeStep > index ? 'completed' : ''} ${activeStep === index ? 'active' : ''}`}>
                        {activeStep > index ? (
                            <CheckOutlined />
                        ) : (
                            dot
                        )}
                    </span>
                )}
                onChange={(current) => {
                    setActiveStep(current);
                    setOpenPanels([steps[current].key]);
                }}
            />
            <Form form={form} layout='vertical'>
            <Collapse
                    activeKey={openPanels}
                    onChange={(keys) => handleCollapseChange(keys, steps)}
                    items={getStepItems(steps)}
                    className='collapse-cs1'
                    expandIconPosition="end"
                    ghost
                />
            </Form>
        </Flex>
    );
    // Modified to accept specific step list
    function handleCollapseChange(keys, stepsList) {
        setOpenPanels(keys);
        if (keys.length > 0) {
            const lastKey = keys[keys.length - 1];
            const stepIndex = stepsList.findIndex(step => step.key === lastKey);
            if (stepIndex !== -1) {
                setActiveStep(stepIndex);
            }
        }
    }
};

export { SellerSingleInprogressSteps };