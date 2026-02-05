import { Button, Flex, Modal, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const VehicleStatusModal = ({ visible, onClose, currentStatus, onConfirm, loading }) => {
  
    const { t } = useTranslation();
    const isActive = currentStatus === 'ACTIVE';
    const newStatus = isActive ? 'INACTIVE' : 'ACTIVE';

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            footer={null}
            width={500}
            centered
        >
            <Flex vertical gap={15} align="center" className="py-3">                
                <Flex vertical gap={10} align="center">
                    <Title level={4} className="m-0">
                        {isActive ? t('Inactivate Business?') : t('Activate Business?')}
                    </Title>
                    <Text className="text-center text-gray">
                        {isActive 
                            ? t('Are you sure you want to inactivate this business? It will no longer be visible to buyers.')
                            : t('Are you sure you want to activate this business? It will be visible to buyers again.')
                        }
                    </Text>
                </Flex>

                <Flex gap={10} justify="center" className="w-100">
                    <Button 
                        type="button" 
                        className="btn border-gray text-black"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {t('Cancel')}
                    </Button>
                    <Button 
                        type="primary" 
                        className={`btn ${isActive ? 'bg-red' : 'bg-brand'}`}
                        onClick={() => onConfirm(newStatus)}
                        loading={loading}
                    >
                        {isActive ? t('Inactivate') : t('Activate')}
                    </Button>
                </Flex>
            </Flex>
        </Modal>
    );
};

export { VehicleStatusModal };
