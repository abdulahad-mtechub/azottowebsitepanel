import { useState,useEffect } from 'react';
import { Flex, Typography, Steps, Collapse, Form } from 'antd';
import { CheckOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { PayCommissionInprogressStep } from './PayCommissionInprogressStep';
import { DigitalSaleAgreementStep } from './DigitalSaleAgreementStep';
import { PayBusinessAmountstep } from './PayBusinessAmountstep';
import { FinalDealsStep } from './FinalDealsStep';
import { GETUSERACTIVEBANK } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';

const { Text } = Typography;
const SingleInprogressSteps = ({inprogressdeal}) => {
    const [form] = Form.useForm();
    const [activeStep, setActiveStep] = useState(inprogressdeal ? 3:0);
    const [openPanels, setOpenPanels] = useState( inprogressdeal ? ['1','2','3','4'] : ['1']);

    const [activeBank, { data: activeBankData }] = useLazyQuery(GETUSERACTIVEBANK)

    useEffect(() => {
        if (inprogressdeal?.sellerId) {
            activeBank({ variables: { getUserActiveBanksId: inprogressdeal?.sellerId } });
        }
    }, [inprogressdeal?.sellerId, activeBankData]);

    const bankRecipt = inprogressdeal?.busines?.documents?.find(
    (doc) => doc.title === "Buyer Payment Receipt"
    );

    const steps = [
        {
            key: '1',
            label: 'Pay Commission',
            content: <PayCommissionInprogressStep form={form} inprogressdeal={inprogressdeal} />,
            status: inprogressdeal?.isCommissionVerified ? "Verified" :
                    inprogressdeal?.busines?.documents?.find(
                        (doc) => doc.title === "Jasoor Commission"
                    ) ? 'Jasoor Verified Pending' : 'Pending',
        },
        {
            key: '2',
            label: 'Digital Sale Agreement',
            content: <DigitalSaleAgreementStep form={form} details={inprogressdeal} />,
            status: !inprogressdeal?.isDsaSeller && !inprogressdeal?.isDsaBuyer
                ? 'Seller & Buyer DSA Pending'
                : !inprogressdeal?.isDsaSeller && inprogressdeal?.isDsaBuyer
                ? 'Seller DSA Pending'
                : inprogressdeal?.isDsaSeller && !inprogressdeal?.isDsaBuyer
                ? 'Buyer DSA Pending'
                : 'Verified',
        },
        {
            key: '3',
            label: 'Pay Business Amount',
            content: <PayBusinessAmountstep inprogressdeal={inprogressdeal} bank={activeBankData?.getUserActiveBanks} form={form} />,
            status: bankRecipt ? 'Verified' : 'Pending'
        },
        {
            key: '4',
            label: 'Finalize Deal',
            content: <FinalDealsStep  inprogressdeal={inprogressdeal} />,
            status: inprogressdeal?.isBuyerCompleted ? 'Deal Closed' : 'Pending'
        },
    ];

    const isStepComplete = (status) =>
        status && !['pending', 'waiting'].includes(status.toLowerCase());

    const getUnlockedStepKeys = () => {
        const keys = [];
        for (let i = 0; i < steps.length; i++) {
            if (i === 0 || isStepComplete(steps[i - 1].status)) {
                keys.push(steps[i].key);
            } else {
                break;
            }
        }
        return keys;
    };

    const unlockedKeys = getUnlockedStepKeys();
    

    const handleCollapseChange = (keys) => {
        const filteredKeys = keys.filter((key) => unlockedKeys.includes(key));
        setOpenPanels(filteredKeys);

        if (filteredKeys.length > 0) {
            const lastOpenedKey = filteredKeys[filteredKeys.length - 1];
            const stepIndex = steps.findIndex((step) => step.key === lastOpenedKey);
            if (stepIndex !== -1) {
                setActiveStep(stepIndex);
            }
        }
    };

    const stepItems = steps.map((item, index) => {
        const isDisabled = !unlockedKeys.includes(item.key);
        return {
            key: item.key,
            label: (
                <Flex justify="space-between" align="center">
                    <span className="custom-step-title">{item.label}</span>
                    <span className="collapse-indicator">
                        {openPanels.includes(item.key) ? (
                            <Flex align="center" gap={5}>
                                {item?.status?.toLowerCase() === 'pending' ||
                                item?.status?.toLowerCase().includes('pending') ||
                                item?.status?.toLowerCase().includes('waiting') ? (
                                    <Text className="sendstatus fs-10 badge-cs fw-500 fit-content">
                                        {item?.status}
                                     </Text>
                                ) : (
                                    <Text className="received fs-10 badge-cs fw-500 fit-content">
                                        {item?.status}
                                    </Text>
                                )}
                                <UpOutlined />
                            </Flex>
                        ) : (
                            <DownOutlined />
                        )}
                    </span>
                </Flex>
            ),
            children: <div className="step-content">{item.content}</div>,
            showArrow: false,
            collapsible: isDisabled ? 'disabled' : 'header',
        };
    });


    const stepsProgress = steps.map((item, index) => ({
        key: item.label,
        title: (
            <span
                className={`custom-step-title ${activeStep >= index ? 'completed' : ''} ${
                    !unlockedKeys.includes(item.key) ? 'disabled' : ''
                }`}
            >
                {item.label}
            </span>
        ),
    }));

    return (
        <Flex vertical gap={25} className="mt-3">
            <Steps
                className="mt-3"
                current={activeStep}
                items={stepsProgress}
                onChange={(current) => {
                    // Allow navigation only to unlocked steps
                    if (unlockedKeys.includes(steps[current].key)) {
                        setActiveStep(current);
                        setOpenPanels([steps[current].key]);
                    }
                }}
                progressDot={(dot, { status, index }) => (
                    <span
                        className={`custom-dot ${
                            activeStep > index ? 'completed' : ''
                        } ${activeStep === index ? 'active' : ''}`}
                    >
                        {activeStep > index ? <CheckOutlined /> : dot}
                    </span>
                )}
            />
            <Form form={form} layout="vertical">
                <Collapse
                    activeKey={openPanels}
                    onChange={handleCollapseChange}
                    items={stepItems.map((item) => ({
                        ...item,
                        collapsible: unlockedKeys.includes(item.key) ? 'header' : 'disabled',
                    }))}
                    className={`collapse-cs1 step-disabled`}
                    expandIconPosition="end"
                    ghost
                />
            </Form>
        </Flex>
    );
};

export { SingleInprogressSteps };
