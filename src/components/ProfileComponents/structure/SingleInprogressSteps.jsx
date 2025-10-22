import { useState, useEffect } from 'react';
import { Flex, Typography, Steps, Collapse, Form } from 'antd';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { PayCommissionInprogressStep } from './PayCommissionInprogressStep';
import { DigitalSaleAgreementStep } from './DigitalSaleAgreementStep';
import { PayBusinessAmountstep } from './PayBusinessAmountstep';
import { FinalDealsStep } from './FinalDealsStep';
import { GETUSERACTIVEBANK } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const SingleInprogressSteps = ({ inprogressdeal }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    
    const [activeBank, { data: activeBankData }] = useLazyQuery(GETUSERACTIVEBANK);

    useEffect(() => {
        if (inprogressdeal?.sellerId) {
            activeBank({ variables: { getUserActiveBanksId: inprogressdeal?.sellerId } });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inprogressdeal?.sellerId, activeBankData]);

    // Check if each step is completed based on deal status and admin approvals
    const isStep1Completed = inprogressdeal?.isCommissionVerified; // Admin verified commission
    const isStep2Completed = inprogressdeal?.isDsaSeller && inprogressdeal?.isDsaBuyer; // Both signed DSA
    const isStep3Completed = inprogressdeal?.isPaymentVedifiedSeller; // Payment verified
    const isStep4Completed = inprogressdeal?.isBuyerCompleted;

    // Determine initial step based on completion status
    const getInitialStep = () => {
        if (isStep4Completed) return 3;
        if (isStep3Completed) return 3;
        if (isStep2Completed) return 2;
        if (isStep1Completed) return 1;
        return 0;
    };

    const initialStep = getInitialStep();
    const [activeStep, setActiveStep] = useState(initialStep);
    const [openPanels, setOpenPanels] = useState(
        inprogressdeal ? Array.from({ length: initialStep + 1 }, (_, i) => (i + 1).toString()) : ['1']
    );

    const steps = [
        {
            key: '1',
            label: t('Pay Commission'),
            content: <PayCommissionInprogressStep form={form} inprogressdeal={inprogressdeal} />,
            status: inprogressdeal?.isCommissionVerified ? t('Verified') : t('Pending'),
            lockedTitle: t('Commission Payment Required'),
            lockedDesc: t('Please pay the commission to proceed with the deal.'),
            isCompleted: isStep1Completed,
            isEnabled: true,
        },
        {
            key: '2',
            label: t('Digital Sale Agreement'),
            content: <DigitalSaleAgreementStep form={form} details={inprogressdeal} />,
            status: !inprogressdeal?.isDsaSeller && !inprogressdeal?.isDsaBuyer
                ? t('Seller & Buyer DSA Pending')
                : !inprogressdeal?.isDsaSeller && inprogressdeal?.isDsaBuyer
                ? t('Seller DSA Pending')
                : inprogressdeal?.isDsaSeller && !inprogressdeal?.isDsaBuyer
                ? t('Buyer DSA Pending')
                : t('Signed'),
            lockedTitle: t('Commission Pending'),
            lockedDesc: t('Waiting for admin to verify your commission payment.'),
            isCompleted: isStep2Completed,
            isEnabled: isStep1Completed, // Enabled only if Step 1 is completed (admin verified commission)
        },
        {
            key: '3',
            label: t('Pay Business Amount'),
            content: <PayBusinessAmountstep inprogressdeal={inprogressdeal} bank={activeBankData?.getUserActiveBanks} form={form} />,
            status: inprogressdeal?.isPaymentVedifiedSeller ? t('Verified') : t('Pending'),
            lockedTitle: t('DSA Required'),
            lockedDesc: t('Waiting for seller & buyer to sign the Digital Sale Agreement.'),
            isCompleted: isStep3Completed,
            isEnabled: isStep2Completed, // Enabled only if Step 2 is completed (both signed DSA)
        },
        {
            key: '4',
            label: t('Finalize Deal'),
            content: <FinalDealsStep inprogressdeal={inprogressdeal} />,
            status: inprogressdeal?.isBuyerCompleted ? t('Completed') : t('Pending'),
            lockedTitle: t('Payment Verification Required'),
            lockedDesc: t('Waiting for seller to verify the business payment.'),
            isCompleted: isStep4Completed,
            isEnabled: isStep3Completed, // Enabled only if Step 3 is completed (payment verified)
        },
    ];

    const handleCollapseChange = (keys) => {
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
    };

    const stepItems = steps.map((item) => {
        const isDisabled = !item.isEnabled;
        return {
            key: item.key,
            label: (
                <Flex justify="space-between" align="center">
                    <span 
                        className={`custom-step-title fw-600 fs-15 ${isDisabled ? 'step-disabled' : ''}`}
                        style={{ opacity: isDisabled ? 0.5 : 1, cursor: isDisabled ? 'not-allowed' : 'pointer' }}
                    >
                        {item.label}
                    </span>
                    <span className="collapse-indicator">
                        {openPanels.includes(item.key) ? (
                            <Flex align="center" gap={5}>
                                {item?.status?.toLowerCase() === t('pending').toLowerCase() ||
                                item?.status?.toLowerCase().includes(t('pending').toLowerCase()) ||
                                item?.status?.toLowerCase().includes(t('waiting').toLowerCase()) ? (
                                    <Text className="sendstatus fs-10 badge-cs fw-500 fit-content">{item?.status}</Text>
                                ) : (
                                    <Text className="received fs-10 badge-cs fw-500 fit-content">{item?.status}</Text>
                                )}
                                <UpOutlined style={{ opacity: isDisabled ? 0.5 : 1 }} />
                            </Flex>
                        ) : (
                            <DownOutlined style={{ opacity: isDisabled ? 0.5 : 1 }} />
                        )}
                    </span>
                </Flex>
            ),
            children: (
                !item.isEnabled ? (
                    <Flex className='text-center' vertical justify='center' align='center'>
                        <Typography.Title level={5} className='fw-500 m-0 fs-14'>{item?.lockedTitle}</Typography.Title>
                        <Text className='fs-14 text-gray'>
                            {item?.lockedDesc}
                        </Text>
                    </Flex>
                ) : (
                    <div className="step-content">{item.content}</div>
                )
            ),
            showArrow: false,
            collapsible: isDisabled ? 'disabled' : 'header',
        };
    });

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

    return (
        <Flex vertical gap={25} className="mt-3">
            <Steps
                className="mt-3"
                current={activeStep}
                items={stepsProgress}
                onChange={(current) => {
                    // Only allow clicking on enabled steps
                    if (steps[current]?.isEnabled) {
                        setActiveStep(current);
                        setOpenPanels([steps[current].key]);
                    }
                }}
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
            />
            <Form form={form} layout="vertical">
                <Collapse
                    activeKey={openPanels}
                    onChange={handleCollapseChange}
                    items={stepItems}
                    className='collapse-cs1'
                    expandIconPosition="end"
                    ghost
                />
            </Form>
        </Flex>
    );
};

export { SingleInprogressSteps };
