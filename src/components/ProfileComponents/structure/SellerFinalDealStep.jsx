import { useState } from 'react';
import { Button, Checkbox, Col, Flex, Row, Typography, message } from 'antd';
import { FINALIZE_DEAL } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { GETDEAL } from '../../../graphql';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const SellerFinalDealsStep = ({ details }) => {
    
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [finalizDeal] = useMutation(FINALIZE_DEAL, {
        refetchQueries: [
            { query: GETDEAL, variables: { getDealId: details?.key } },
        ],
        awaitRefetchQueries: true,
    });
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConfirmed) {
            messageApi.error(t('Please confirm payment and documents before submitting.'));
            return;
        }
        try {
            setLoading(true);
            await finalizDeal({
                variables: {
                    input: {
                        id: details.key,
                        status: "SELLERCOMPLETED",
                        isSellerCompleted: true
                    },
                }
            });

            messageApi.success(t("Deal marked as completed from your end. Jusoor will verify shortly."));
        } catch (err) {
            console.error(err);
            messageApi.error(t("Failed to save documents"));
        } finally {
            setLoading(false);
        }
    };

    const dealBusiness = details?.busines?.documents || [];
    const uploadDocs = dealBusiness.length >= 4;

    return (
        <Row gutter={[16, 24]}>
            {contextHolder}
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>{t('Confirmation')}</Text>
                    <Text className='fs-13 text-gray'>
                        {t("Once you’ve verified payment and documents, you can now mark this deal as completed. The Jusoor admin will verify everything before finalizing.")}
                    </Text>
                </Flex>
            </Col>
            {uploadDocs && !details?.isSellerCompleted && (
                <>
                    <Col span={24}>
                        <Checkbox
                            checked={isConfirmed || details?.isSellerCompleted}
                            onChange={(e) => setIsConfirmed(e.target.checked)}
                            disabled={details?.isSellerCompleted}
                        >
                            {t("I confirm that payment is received and documents have been Verified.")}
                        </Checkbox>
                    </Col>
                    <Col span={24}>
                        <Flex>
                            <Button
                                aria-labelledby={t('Notify Jusoor to Finalize')}
                                type="primary"
                                className='btn bg-brand'
                                onClick={handleSubmit}
                                disabled={details?.isSellerCompleted}
                                loading={loading}
                            >
                                {t('Notify Jusoor to Finalize')}
                            </Button>
                        </Flex>
                    </Col>
                </>
            )}
        </Row>
    );
};

export { SellerFinalDealsStep };
