import { CloseOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

const { Title, Text } = Typography;

const ProceedToPurchaseModal = ({ visible, onClose, businessPrice, onConfirm, loading }) => {
    const { t } = useTranslation();

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

    const { commission, totalAmount } = useMemo(() => {
        let calculatedCommission = 0;

        if (businessPrice === 0) {
            calculatedCommission = 0;
        } else if (businessPrice < 50000) {
            calculatedCommission = 2000;
        } else {
            calculatedCommission = computeCommissionMarginal(businessPrice);
        }

        const commissionRounded = Number(calculatedCommission.toFixed(2));
        const total = Number((businessPrice + commissionRounded).toFixed(2));

        return {
            commission: commissionRounded,
            totalAmount: total
        };
    }, [businessPrice]);

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            centered
            footer={
                <Flex justify='end' gap={5}>
                    <Button
                        aria-labelledby={t('Cancel')}
                        className='btn text-black border-gray'
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('Cancel')}
                    </Button>
                    <Button
                        aria-labelledby={t('Confirm & Proceed')}
                        className='btn bg-green text-white'
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {t('Confirm & Proceed')}
                    </Button>
                </Flex>
            }
            width={500}
        >
            <Flex vertical gap={20}>
                <Flex justify='space-between' align='center'>
                    <Title level={4} className='m-0'>
                        {t('Proceed to Purchase')}
                    </Title>
                    <Button
                        aria-labelledby={t('Close')}
                        onClick={onClose}
                        className='p-0 border-0 bg-transparent'
                        disabled={loading}
                    >
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>

                <Text className='fs-14 text-gray'>
                    {t('Are you sure you want to proceed with this purchase?')}
                </Text>

                <Flex vertical gap={12}>
                    <Flex justify='space-between' align='center'>
                        <Text className='fs-14'>{t('Business Price')}</Text>
                        <Text className='fw-500 fs-16'>
                            {t('SAR')} {businessPrice?.toLocaleString() || '0'}
                        </Text>
                    </Flex>

                    <Flex justify='space-between' align='center'>
                        <Text className='fs-14'>{t('Jusoor Commission')}</Text>
                        <Text className='fw-500 fs-16'>
                            {t('SAR')} {commission?.toLocaleString() || '0'}
                        </Text>
                    </Flex>

                    <div style={{ height: '1px', background: '#e0e0e0', margin: '8px 0' }} />

                    <Flex justify='space-between' align='center'>
                        <Text className='fw-600 fs-16'>{t('Total Amount')}</Text>
                        <Text className='fw-600 fs-18 text-brand'>
                            {t('SAR')} {totalAmount?.toLocaleString() || '0'}
                        </Text>
                    </Flex>
                </Flex>
            </Flex>
        </Modal>
    );
};

export { ProceedToPurchaseModal };
