import { useState } from 'react';
import { Flex, Typography, Steps, Collapse, Form } from 'antd';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { DigitalSaleAgreementStep } from './DigitalSaleAgreementStep';
import { BankAccountDetailsStep } from './BankAccountDetailsStep';
import { ConfirmationDocsStep } from './ConfirmationDocsStep';
import { SellerFinalDealsStep } from './SellerFinalDealStep';
import { useTranslation } from 'react-i18next';

const statusToStepIndex = {
    COMMISSION_TRANSFER_FROM_BUYER_PENDING: 0,
    COMMISSION_VERIFIED: 0,
    DSA_FROM_SELLER_PENDING: 1,
    DSA_FROM_BUYER_PENDING: 1,
    BANK_DETAILS_FROM_SELLER_PENDING: 2,
    SELLER_PAYMENT_VERIFICATION_PENDING: 3,
    PAYMENT_APPROVAL_FROM_SELLER_PENDING: 3,
    DOCUMENT_PAYMENT_CONFIRMATION: 4,
    WAITING: 4,
    BUYERCOMPLETED: 5,
    SELLERCOMPLETED: 5,
    COMPLETED: 5,
    PENDING: 0,
};

const { Text, Title } = Typography;

const SellerSingleInprogressSteps = ({ deal }) => {

    const { t } = useTranslation();
    const [form] = Form.useForm();
    console.log('deal in steps:', deal);
    // Check if each step is completed based on deal status and admin approvals
    const isCommissionVerified = deal?.isCommissionVerified || deal?.status === 'COMMISSION_VERIFIED';
    const isStep1Completed = deal?.isDsaSeller && deal?.isDsaBuyer;
    const isStep2Completed = deal?.bankAccountId || deal?.status === 'SELLER_PAYMENT_VERIFICATION_PENDING' || 
                             deal?.status === 'PAYMENT_APPROVAL_FROM_SELLER_PENDING' || 
                             deal?.status === 'DOCUMENT_PAYMENT_CONFIRMATION' ||
                             deal?.status === 'WAITING' ||
                             deal?.status === 'BUYERCOMPLETED' ||
                             deal?.status === 'SELLERCOMPLETED' ||
                             deal?.status === 'COMPLETED';
    const isStep3Completed = deal?.isDocVedifiedBuyer && deal?.isBuyerCompleted;
    const isStep4Completed = deal?.isSellerCompleted;

    const initialStep = deal?.status ? statusToStepIndex[deal.status] || 0 : 0;
    const [activeStep, setActiveStep] = useState(initialStep);
    const [openPanels, setOpenPanels] = useState(
        deal ? Array.from({ length: initialStep + 1 }, (_, i) => (i + 1).toString()) : ['1']
    );

    const steps = [
        {
            key: '1',
            label: t('Digital Sale Agreement'),
            content: <DigitalSaleAgreementStep form={form} details={deal} />,
            status: !deal?.isDsaSeller && !deal?.isDsaBuyer
                ? t('Seller & Buyer DSA Pending')
                : !deal?.isDsaSeller && deal?.isDsaBuyer
                ? t('Seller DSA Pending')
                : deal?.isDsaSeller && !deal?.isDsaBuyer
                ? t('Buyer DSA Pending')
                : t('Verified'),
            emptytitle: t('DSA Pending!'),
            emptydesc: t('Waiting for the seller & buyer to sign the digital sale agreement.'),
            lockedTitle: t('Commission Payment Pending'),
            lockedDesc: t('Waiting for buyer commission payment verification.'),
            isCompleted: isStep1Completed,
            isEnabled: isCommissionVerified, // Enabled only if commission is verified by admin
        },
        {
            key: '2',
            label: t('Bank Account Details'),
            content: <BankAccountDetailsStep details={deal} />,
            status: isStep2Completed ? t('Completed') : t('Send'),
            emptytitle: t('Bank Details Pending!'),
            emptydesc: t('Waiting for the seller to choose the bank account.'),
            lockedTitle: t('DSA Required'),
            lockedDesc: t('Waiting for seller & buyer to sign the Digital Sale Agreement.'),
            isCompleted: isStep2Completed,
            isEnabled: isStep1Completed, // Enabled only if Step 1 is completed
        },
        {
            key: '3',
            label: t('Payment Confirmation & Docs'),
            content: <ConfirmationDocsStep form={form} details={deal} />,
            status: deal?.isDocVedifiedSeller && deal?.isDocVedifiedAdmin
                ? t('Verified')
                : deal?.isDocVedifiedSeller
                ? t('Jusoor verification pending')
                : t('Seller verification pending'),
            emptytitle: t('Payment Confirmation Pending!'),
            emptydesc: t('Waiting for the seller to transfer the document & approve the payment.'),
            lockedTitle: t('Bank Account Required'),
            lockedDesc: t('Waiting for seller to provide bank account details.'),
            isCompleted: isStep3Completed,
            isEnabled: isStep2Completed, // Enabled only if Step 2 is completed
        },
        {
            key: '4',
            label: t('Finalize Deal'),
            content: <SellerFinalDealsStep details={deal} />,
            status: deal?.isSellerCompleted ? t("Verified") : t('Pending'),
            emptytitle: t('Deal Pending!'),
            emptydesc: t('Waiting for the buyer & seller to finalize the deal.'),
            lockedTitle: t('Document Verification Required'),
            lockedDesc: t('Waiting for seller to upload documents and admin verification.'),
            isCompleted: isStep4Completed,
            isEnabled: isStep3Completed, // Enabled only if Step 3 is completed and admin verified
        },
    ];

    const getStepItems = (steps) =>
        steps.map((item) => ({
            key: item.key,
            label: (
                <Flex justify='space-between' align='center'>
                    <span 
                        className={`custom-step-title fw-600 fs-15 ${!item.isEnabled ? 'step-disabled' : ''}`}
                        style={{ opacity: !item.isEnabled ? 0.5 : 1, cursor: !item.isEnabled ? 'not-allowed' : 'pointer' }}
                    >
                        {item.label}
                    </span>
                    <span className='collapse-indicator'>
                        {openPanels.includes(item.key) ? (
                            <Flex align='center' gap={5}>
                                {(item.status.toLowerCase()?.startsWith('pending')) ? (
                                    <Text className='pending fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                ) : (item.status.toLowerCase()?.includes('verification')) ? (
                                    <Text className='branded fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                ) : (
                                    <Text className='success fs-10 sm-pill fw-500 fit-content'>{item?.status}</Text>
                                )}
                                <UpOutlined style={{ opacity: !item.isEnabled ? 0.5 : 1 }} />
                            </Flex>
                        ) : (
                            <DownOutlined style={{ opacity: !item.isEnabled ? 0.5 : 1 }} />
                        )}
                    </span>
                </Flex>
            ),
            children: (
                !item.isEnabled ? (
                    <Flex className='text-center' vertical justify='center' align='center'>
                        <Title level={5} className='fw-500 m-0 fs-14'>{item?.lockedTitle}</Title>
                        <Text className='fs-14 text-gray'>
                            {item?.lockedDesc}
                        </Text>
                    </Flex>
                ) : !item.content ? (
                    <Flex className='text-center' vertical justify='center' align='center'>
                        <Title level={5} className='fw-500 m-0 fs-14'>{item?.emptytitle}</Title>
                        <Text className='fs-14 text-gray'>{item?.emptydesc}</Text>
                    </Flex>
                ) : (
                    <div className="step-content">{item.content}</div>
                )
            ),
            showArrow: false,
            extra: null,
            collapsible: item.isEnabled ? 'header' : 'disabled',
        }));

    const stepsProgress = steps.map((item, index) => ({
        key: item.label,
        title: (
            <span 
                className={`custom-step-title ${activeStep >= index ? 'completed' : ''} ${!item.isEnabled ? 'step-disabled' : ''}`}
                style={{ opacity: !item.isEnabled ? 0.5 : 1 }}
            >
                {item.label}
            </span>
        ),
        disabled: !item.isEnabled,
    }));

    function handleCollapseChange(keys) {
        // Filter out disabled steps
        const validKeys = keys.filter(key => {
            const stepIndex = steps.findIndex(step => step.key === key);
            return stepIndex !== -1 && steps[stepIndex].isEnabled;
        });
        
        setOpenPanels(validKeys);
        if (validKeys.length > 0) {
            const lastKey = validKeys[validKeys.length - 1];
            const stepIndex = steps.findIndex(step => step.key === lastKey);
            if (stepIndex !== -1) setActiveStep(stepIndex);
        }
    }

    return (
        <Flex vertical gap={25} className='mt-3'>
            <Steps
                className='mt-3'
                current={activeStep}
                items={stepsProgress}
                progressDot={(dot, { index }) => {
                    const step = steps[index];
                    const isDisabled = !step?.isEnabled;
                    return (
                        <span 
                            className={`custom-dot ${activeStep > index ? 'completed' : ''} ${activeStep === index ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}
                            style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                        >
                            {activeStep > index ? <CheckOutlined /> : dot}
                        </span>
                    );
                }}
                onChange={(current) => {
                    // Only allow clicking on enabled steps
                    if (steps[current]?.isEnabled) {
                        setActiveStep(current);
                        setOpenPanels([steps[current].key]);
                    }
                }}
            />
            <Form form={form} layout='vertical'>
                <Collapse
                    activeKey={openPanels}
                    onChange={(keys) => handleCollapseChange(keys)}
                    items={getStepItems(steps)}
                    className='collapse-cs1'
                    expandIconPosition="end"
                    ghost
                />
            </Form>
        </Flex>
    );
};

export { SellerSingleInprogressSteps };
