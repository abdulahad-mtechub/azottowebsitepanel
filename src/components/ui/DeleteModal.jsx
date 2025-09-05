import { Button, Divider, Flex, Modal, Typography,Spin,message } from 'antd'
import { UPDATE_OFFER,UPDATE_MEETING } from '../../graphql/mutation'
import { useMutation } from '@apollo/client';

const { Title, Text } = Typography
const DeleteModal = ({visible,onClose,title,subtitle,type,offerId,refetch,meetingId}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [updateOffer, { loading: updateOfferLoading }] = useMutation(UPDATE_OFFER);
    const [updateMeeting, { loading: updateMeetingLoading }] = useMutation(UPDATE_MEETING);

    const handleConfirm = async () => {
        try {
            if(meetingId){
                await updateMeeting({
                    variables: { input: { id: meetingId, status: 'REJECTED' } }
                });
            }else if (offerId){
                await updateOffer({
                    variables: { input: { id: offerId, status: 'REJECTED' } }
                });
            }
           
            messageApi.success('Offer rejected!');
            refetch && refetch();
            onClose();
        } catch (err) {
            messageApi.error('Failed to reject offer');
            console.error(err);
        }
    };

    if (updateOfferLoading) {
        return (
          <Flex justify="center" align="center" style={{ height: '200px' }}>
            <Spin size="large" />
          </Flex>
        );
    }
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
                <Button type='button' onClick={onClose} className='btn text-black border-gray'>
                    Cancel
                </Button>
                <Button className={`btn ${type==='danger'? 'bg-red':'bg-brand'}`} onClick={handleConfirm} loading={updateOfferLoading}>
                    Confirm
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' className='text-center' gap={6}>
            <img src='/assets/icons/cancel-ic.png' alt='close-status-icon' width={50} />
            <Title level={4} className='m-0'>
                {title}
            </Title>
            <Text>
                {subtitle}
            </Text>
        </Flex>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
    </>
    
  )
}

export {DeleteModal}