import React, { useState } from 'react'
import { Breadcrumb, Flex, Typography, Steps, Button } from 'antd'
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BusinessDetailStep, BusinesslistingReviewModal, BusinessVisionStep, CancelModal, FinancialInfoStep, PreviewStep, UploadSupportDocStep } from '../components';

const { Text } = Typography

const SellBusinessCreate = ({ addstep }) => {
    const [current, setCurrent] = useState(0);
    const [iscancel, setIsCancel] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [reviewmodal, setReviewModal] = useState(false);
    const navigate = useNavigate();

    const steps = [
        {
            title: 'Business Details',
            content: <BusinessDetailStep />,
        },
        {
            title: 'Financial & Growth Information',
            content: <FinancialInfoStep />,
        },
        {
            title: 'Business Vision',
            content: <BusinessVisionStep />,
        },
        {
            title: 'Document Uploads',
            content: null,
        },
    ];

    const onChange = (value) => {
        setCurrent(value);
        setIsPreview(false);
    };

    const next = () => {
        if (current < steps.length - 1) {
            setCurrent(current + 1);
            setIsPreview(false);
        }
    };

    const prev = () => {
        if (current === 0) {
            setIsCancel(true);
        } else if (current === steps.length - 1 && isPreview) {
            setIsPreview(false);
        } else {
            setCurrent(current - 1);
            setIsPreview(false);
        }
    };

    const items = steps.map((item, index) => ({
        key: item.title,
        title: (
            <span className={`custom-step-title ${current >= index ? 'completed' : ''}`}>
                {item.title}
            </span>
        ),
    }));


    const handleCreateListing = () => {
        setReviewModal(false);
        setCurrent(0);
        setIsPreview(false);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className='padd mb-2'>
            <div className='container'>
                <Flex vertical gap={25} className='mt-3'>
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[
                            {
                                title: <Text className='fs-13 text-gray' onClick={() => navigate('/')}>Home</Text>,
                            },
                            {
                                title: <Text className='fw-500 fs-13 text-black'>Create a List</Text>,
                            },
                        ]}
                    />
                    <Steps
                        current={current}
                        onChange={onChange}
                        items={items}
                        progressDot={(dot, { status, index }) => (
                            <span className={`custom-dot ${current > index ? 'completed' : ''} ${current === index ? 'active' : ''}`}>
                                {current > index ? (
                                    <CheckOutlined />
                                ) : (
                                    dot
                                )}
                            </span>
                        )}
                        className='mt-3'
                    />

                    <div className="step-content">
                        {current === steps.length - 1
                            ? isPreview
                                ? <PreviewStep />
                                : <UploadSupportDocStep />
                            : steps[current].content}
                    </div>

                    <Flex gap={10} justify='end'>
                        <Button
                            className='btn text-black border-gray'
                            onClick={prev}
                        >
                            {current === 0 ? 'Cancel' : 'Previous'}
                        </Button>

                        {current < steps.length - 1 && (
                            <Button type="primary" className='btn bg-brand' onClick={next}>
                                Next
                            </Button>
                        )}

                        {current === steps.length - 1 && !isPreview && (
                            <Button type="primary" className='btn bg-brand' onClick={() => setIsPreview(true)}>
                                Preview
                            </Button>
                        )}

                        {current === steps.length - 1 && isPreview && (
                            <Button type="primary" className='btn bg-brand' onClick={()=>setReviewModal(true)}>
                                Publish
                            </Button>
                        )}
                    </Flex>
                </Flex>
            </div>

            <CancelModal
                visible={iscancel}
                onClose={() => setIsCancel(false)}
            />
            <BusinesslistingReviewModal 
                visible={reviewmodal}
                onClose={()=>setReviewModal(false)}
                onCreate={handleCreateListing}
            />
        </div>
    )
}

export { SellBusinessCreate }
