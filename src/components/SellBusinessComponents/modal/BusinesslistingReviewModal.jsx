import { Button, Divider, Flex, Modal, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography
const BusinesslistingReviewModal = ({visible,onClose}) => {

  const { t } = useTranslation();
  const navigate = useNavigate()

  return (
    <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
            <Flex justify='center' gap={5}>
                <Button aria-labelledby={t('Back to Home')} type='button' className='btn text-black border-gray' onClick={()=>{onClose();navigate('/')}}>
                    {t('Back to Home')}
                </Button>
                <Button aria-labelledby={t('Create new list')} type="primary" className='btn bg-brand' onClick={()=>{onClose()}}>
                    {t('Create new list')}
                </Button>
            </Flex>
        }
      > 

        <Flex vertical align='center' className='text-center' gap={6}>
            <img src='/assets/icons/complete.png' alt={t('complete-status-icon')} width={50} fetchPriority="high" />
            <Title level={4} className='m-0'>
                {t('Business Listing Under Review')}
            </Title>
            <Text>
                {t('Your business listing is currently under review. Once approved by the admin,it will go live on the marketplace.')}
            </Text>
        </Flex>
        <Divider className='my-2 bg-light-brand' />
    </Modal>
  )
}

export {BusinesslistingReviewModal}