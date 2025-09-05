import { Button, Divider, Flex, Modal, Typography } from 'antd'

const { Title, Text } = Typography
const CancelModal = ({visible,onClose}) => {
  return (
    <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        footer={
            <Flex justify='center' gap={5}>
                <Button type='button' className='btn text-black border-gray'>
                    Cancel
                </Button>
                <Button type="primary" className='btn bg-brand'>
                    Confirm
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' gap={6}>
            <img src='/assets/icons/cancel-ic.png' alt='close-status-icon' width={50} />
            <Title level={4} className='m-0'>
                Cancel Listing?
            </Title>
            <Text>
                Your current progress will be lost if you cancel. Do you still want to proceed?
            </Text>
        </Flex>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
  )
}

export {CancelModal}