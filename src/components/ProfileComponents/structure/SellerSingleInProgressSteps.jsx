import React, { useState } from 'react';
import { Breadcrumb, Flex, Typography, Steps, Card, Collapse, Form } from 'antd';
import { CheckOutlined, DownOutlined, RightOutlined, UpOutlined } from '@ant-design/icons';
import { DigitalSaleAgreementStep } from './DigitalSaleAgreementStep';
import { BankAccountDetailsStep } from './BankAccountDetailsStep';
import { ConfirmationDocsStep } from './ConfirmationDocsStep';
import { SellerFinalDealsStep } from './SellerFinalDealStep';

const { Text } = Typography;

const SellerSingleInprogressSteps = ({completedeal}) => {
    const [form] = Form.useForm();
    const [activeStep, setActiveStep] = useState(completedeal ? 3:0);
    const [openPanels, setOpenPanels] = useState( completedeal ? ['1','2','3','4'] : ['1']);

    const steps = [
        {
            key: '1',
            label: 'Digital Sale Agreement',
            content: <DigitalSaleAgreementStep form={form} completedeal={completedeal} />,
            status: 'Signed'
        },
        {
            key: '2',
            label: 'Bank Account Detials',
            content: <BankAccountDetailsStep form={form} completedeal={completedeal} />,
            status: 'Verified'
        },
        
        {
            key: '3',
            label: 'Confirmation & Docs',
            content: <ConfirmationDocsStep  completedeal={completedeal} />,
            status: 'Verified'
        },
        {
            key: '4',
            label: 'Finalize Deal',
            content: <SellerFinalDealsStep  completedeal={completedeal} />,
            status: 'Deal Closed'
        },
    ];

    const handleCollapseChange = (keys) => {
        setOpenPanels(keys);
        if (keys.length > 0) {
            const lastOpenedKey = keys[keys.length - 1];
            const stepIndex = steps.findIndex(step => step.key === lastOpenedKey);
            if (stepIndex !== -1) {
                setActiveStep(stepIndex);
            }
        }
    };

    const stepItems = steps.map((item, index) => ({
        key: item.key,
        label: (
            <Flex justify='space-between' align='center'>
                <span className={`custom-step-title`}>
                    {item.label}
                </span>
                <span className="collapse-indicator">
                    {openPanels.includes(item.key) ? 
                        <Flex align='center' gap={5}>
                            {
                                item?.status === 'Pending' ?
                                <Text className='sendstatus fs-10 badge-cs fw-500 fit-content'>{item?.status}</Text>
                                :
                                <Text className='received fs-10 badge-cs fw-500 fit-content'>{item?.status}</Text>
                            }
                            <UpOutlined />  
                        </Flex> : 
                        <DownOutlined />
                    }
                </span>
            </Flex>
        ),
        children: <div className="step-content">{item.content}</div>,
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

export { SellerSingleInprogressSteps };