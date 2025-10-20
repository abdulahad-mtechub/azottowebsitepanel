import { Button, Divider, Flex, Modal, Typography, Spin, message } from 'antd';
import { UPDATE_OFFER } from '../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { REJECT_MEETING } from '../../graphql';

const { Title, Text } = Typography;

const DeleteModal = ({ visible, onClose, title, subtitle, type, offerId, refetch, meetingId, buttontext }) => {

    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [updateOffer, { loading: updateOfferLoading }] = useMutation(UPDATE_OFFER);
    const [updateMeeting, { loading: updateMeetingLoading }] = useMutation(REJECT_MEETING);

    const handleConfirm = async () => {
        try {
            if (meetingId) {
                await updateMeeting({
                    variables: { meetingId } 
                });
            } else if (offerId) {
                await updateOffer({
                    variables: { input: { id: offerId, status: 'REJECTED' } }
                });
            }
            if (meetingId) {
                messageApi.success(t('Meeting rejected!'));
                refetch && refetch();
            } else if (offerId) {
                messageApi.success(t('Offer rejected!'));
                refetch && refetch();
            }
            onClose();
        } catch (err) {
            messageApi.error(t('Failed to reject offer'));
            console.error(err);
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={null}
                open={visible}
                onCancel={onClose}
                closeIcon={false}
                centered
                footer={
                    <Flex justify='center' gap={5}>
                        <Button aria-labelledby='Cancel' type='button' onClick={onClose} className='btn text-black border-gray'>
                            {t('Cancel')}
                        </Button>
                        <Button aria-labelledby='Confirm' className={`btn ${type === 'danger' ? 'bg-red' : 'bg-brand'}`} onClick={handleConfirm} loading={updateOfferLoading || updateMeetingLoading}>
                            {buttontext ? t(buttontext) : t('Confirm')}
                        </Button>
                    </Flex>
                }
            >
                <Flex vertical align='center' className='text-center' gap={6}>
                    <img src='/assets/icons/cancel-ic.png' alt={t('close-status-icon')} width={50} fetchPriority="high" />
                    <Title level={4} className='m-0'>
                        {t(title)}
                    </Title>
                    <Text>
                        {t(subtitle)}
                    </Text>
                </Flex>
                <Divider className='my-2 bg-light-brand' />
            </Modal>
        </>
    );
};

export { DeleteModal };
