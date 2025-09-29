import React, { useState,useRef } from 'react';
import { Breadcrumb, Flex, Typography, Steps, Button, Spin, message } from 'antd';
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BusinessDetailStep, BusinesslistingReviewModal, BusinessVisionStep, CancelModal, FinancialInfoStep, UploadSupportDocStep } from '../components';
import { CREATE_BUSINESS } from "../graphql/mutation/mutations";
import { useMutation } from '@apollo/client';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const LOCAL_STORAGE_KEY = 'sellBusinessDraft';

const SellBusinessCreate = ({ addstep }) => {
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [current, setCurrent] = useState(0);
    const [iscancel, setIsCancel] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [reviewmodal, setReviewModal] = useState(false);
    const navigate = useNavigate();
    const [createBusiness, { loading, error }] = useMutation(CREATE_BUSINESS);
    const businessDetailFormRef = useRef();

    const [businessData, setBusinessData] = useState(() => {
        const draft = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (draft) {
            const parsed = JSON.parse(draft);
            return {
                ...parsed,
                foundedDate: parsed.foundedDate ? dayjs(parsed.foundedDate) : null,
            };
        }
        return draft ? JSON.parse(draft) : {
            isByTakbeer: null,
            businessTitle: null,
            categoryId: null,
            district: null,
            city: null,
            foundedDate: null,
            numberOfEmployees: null,
            description: null,
            url: null,
            revenueTime: null,
            revenue: null,
            profittime: null,
            profit: null,
            price: null,
            profitMargen: null,
            recoveryTime: null,
            multiple: null,
            assets: [{ name: null, price: null, purchaseYear: null, quantity: null }],
            liabilities: [{ name: null, price: null, purchaseYear: null, quantity: null }],
            inventoryItems: [{ name: null, price: null, purchaseYear: null, quantity: null }],
            supportDuration: null,
            supportSession: null,
            growthOpportunities: null,
            reason: null,
            documents: [{ title: null, fileName: null, fileType: null, filePath: null, description: null }],
        };
    });

    const steps = [
        { title: t('Business Details'), content: <BusinessDetailStep ref={businessDetailFormRef} data={businessData} setData={setBusinessData} /> },
        { title: t('Financial & Growth Information'), content: <FinancialInfoStep ref={businessDetailFormRef} data={businessData} setData={setBusinessData} /> },
        { title: t('Business Vision'), content: <BusinessVisionStep ref={businessDetailFormRef} data={businessData} setData={setBusinessData} /> },
        { title: t('Document Uploads'), content: <UploadSupportDocStep ref={businessDetailFormRef} data={businessData} setData={setBusinessData} /> },
    ];

    const onChange = (value) => setCurrent(value);

    const next = () => { if (current < steps.length - 1) setCurrent(current + 1); };
    const prev = () => { if (current === 0) setIsCancel(true); else { setCurrent(current - 1); setIsPreview(false); } };

    const items = steps.map((item, index) => ({
        key: item.title,
        title: (
            <span className={`custom-step-title ${current >= index ? 'completed' : ''}`}>
                {item.title}
            </span>
        ),
    }));

    const handleCreateListing = async () => {
        try {
            const variables = {
                input: {
                    ...businessData,
                    revenueTime: businessData.revenueTime === 1 ? t('Last 6 Months') : businessData.revenueTime === 2 ? t('Last Year') : t('Last 6 Months'),
                    profittime: businessData.profittime === 1 ? t('Last 6 Months') : businessData.profittime === 2 ? t('Last Year') : t('Last 6 Months'),
                    revenue: parseFloat(businessData.revenue),
                    profit: parseFloat(businessData.profit),
                    price: parseFloat(businessData.price),
                    profitMargen: parseFloat(businessData.profitMargen),
                    recoveryTime: parseFloat(businessData.recoveryTime),
                    multiple: parseFloat(businessData.multiple),
                    assets: businessData.assets.map(asset => ({
                        name: asset.name,
                        price: parseFloat(asset.price),
                        purchaseYear: parseInt(asset.purchaseYear),
                        quantity: parseInt(asset.quantity),
                    })),
                    liabilities: businessData.liabilities.map(liability => ({
                        name: liability.name,
                        price: parseFloat(liability.price),
                        purchaseYear: parseInt(liability.purchaseYear),
                        quantity: parseInt(liability.quantity),
                    })),
                    inventoryItems: businessData.inventoryItems.map(item => ({
                        name: item.name,
                        price: parseFloat(item.price),
                        purchaseYear: parseFloat(item.purchaseYear),
                        quantity: parseInt(item.quantity),
                    })),
                    suppportDuration: parseInt(businessData.supportDuration),
                    supportSession: parseInt(businessData.supportSession),
                    growthOpportunities: businessData.growthOpportunities,
                    reason: businessData.reason,
                    documents: businessData.documents,
                }
            };
            const { data } = await createBusiness({ variables });
            if (data?.createBusiness?.id) {
                messageApi.success(t('Business listing created successfully!'));
                setReviewModal(true);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
            } else {
                messageApi.error(t('Failed to create business listing: No ID returned'));
            }
        } catch (err) {
            console.error(err);
            messageApi.error(t('Failed to create business listing'));
        }
    };

    const handleSaveDraft = () => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(businessData));
        messageApi.success(t('Draft saved locally!'));
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" className="h-200">
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
            {contextHolder}
            <div className='padd mb-2'>
                <div className='container'>
                    <Flex vertical gap={25} className='mt-3'>
                        <Breadcrumb
                            separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                            items={[
                                { title: <Text className='fs-13 text-gray' onClick={() => navigate('/')}>{t('Home')}</Text> },
                                { title: <Text className='fw-500 fs-13 text-black'>{t('Create a List')}</Text> },
                            ]}
                        />
                        <Steps
                            current={current}
                            onChange={onChange}
                            items={items}
                            progressDot={(dot, { index }) => (
                                <span className={`custom-dot ${current > index ? 'completed' : ''} ${current === index ? 'active' : ''}`}>
                                    {current > index ? <CheckOutlined /> : dot}
                                </span>
                            )}
                            className='mt-3 steps-create'
                        />
                        <div className="step-content">{steps[current].content}</div>

                        <Flex justify={'space-between'} gap={5} align='center'>
                            {current === 0 ? (
                                <Button type="button" className='btn border-gray text-black' onClick={()=>setIsCancel(true)}>
                                    {t('Cancel')}
                                </Button>
                            ) : (
                                <Button type="button" className='btn border-gray text-black' onClick={prev}>
                                    {t('Previous')}
                                </Button>
                            )}
                            <Flex gap={10} justify='end'>
                                <Button className='btn text-black border-gray' onClick={handleSaveDraft}>
                                    {t('Save as Draft')}
                                </Button>
                                {current < steps.length - 1 && (
                                    <Button type="primary" className='btn bg-brand' onClick={next}>
                                        {t('Next')}
                                    </Button>
                                )}
                                {current === steps.length - 1 && (
                                    <Button type="primary" className='btn bg-brand' onClick={handleCreateListing}>
                                        {t('Publish')}
                                    </Button>
                                )}
                            </Flex>
                        </Flex>
                    </Flex>
                </div>

                <CancelModal visible={iscancel} onClose={() => setIsCancel(false)} />
                <BusinesslistingReviewModal visible={reviewmodal} onClose={()=>setReviewModal(false)} onCreate={handleCreateListing} />
            </div>
        </>
    );
};

export { SellBusinessCreate };
