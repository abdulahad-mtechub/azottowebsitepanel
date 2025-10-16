import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Modal, Row, Typography, message } from 'antd';
import { MyInput } from '../../Forms';
import { useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { COUNTER_OFFER } from '../../../graphql/mutation';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const CounterOffer = ({ visible, onClose, selectedOfferId, title, refetch }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [counterOffer, { loading }] = useMutation(COUNTER_OFFER);

  // const computeCommissionMarginal = (amount) => {
  //   if (!amount || amount <= 0) return 0;
  //   let remaining = amount;
  //   let commission = 0;
  //   const b1Limit = 100_000;
  //   if (remaining > 0) {
  //     const part = Math.min(remaining, b1Limit);
  //     commission += part * 0.04;
  //     remaining -= part;
  //   }
  //   const b2Limit = 400_000; 
  //   if (remaining > 0) {
  //     const part = Math.min(remaining, b2Limit);
  //     commission += part * 0.03;
  //     remaining -= part;
  //   }
  //   const b3Limit = 1_500_000;
  //   if (remaining > 0) {
  //     const part = Math.min(remaining, b3Limit);
  //     commission += part * 0.025;
  //     remaining -= part;
  //   }
  //   if (remaining > 0) {
  //     commission += remaining * 0.015;
  //   }
  //   return commission;
  // };

  // const handleOfferAmountChange = (e) => {
  //   const raw = e?.target?.value;
  //   const offerAmount = parseFloat(String(raw).replace(/,/g, "")) || 0;
  //   let commission = 0;

  //   if (offerAmount === 0) {
  //     commission = 0;
  //   } else if (offerAmount < 50_000) {
  //     commission = 2000;
  //   } else {
  //     commission = computeCommissionMarginal(offerAmount);
  //   }

  //   const commissionRounded = Number(commission.toFixed(2));
  //   const totalAmount = Number((offerAmount + commissionRounded).toFixed(2));

  //   form.setFieldsValue({
  //     commission: commissionRounded,
  //     totalamount: totalAmount,
  //   });
  // };

  useEffect(() => {
    form.resetFields();
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = form.validateFields();
      const offerAmount = parseFloat(values.offeramount);

      await counterOffer({
        variables: {
          input: {
            parentOfferId: selectedOfferId,
            price: offerAmount, 
          },
        },
      });
      

      messageApi.success(t('Counter offer sent successfully!'));
      refetch();
      onClose();
    } catch (err) {
      console.error(err);
      messageApi.error(t('Failed to send counter offer.'));
    }
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      closeIcon={false}
      centered
      footer={
        <Flex justify='end' gap={5}>
          <Button aria-labelledby={t('Cancel')} type='button' className='btn text-black border-gray' onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button aria-labelledby={t('Send Counter Offer')} type="primary" className='btn bg-brand' onClick={handleSubmit} loading={loading}>
            {t('Send Counter Offer')}
          </Button>
        </Flex>
      }
      width={600}
    > 
      {contextHolder}
      <Flex vertical className='mb-3' gap={0}>
        <Flex justify='space-between' gap={6}>
          <Title level={4} className='m-0'>
            {title ? t(title) : t('Counter Offer to Seller')}
          </Title>
          <Button aria-labelledby={t('Close')} type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
            <CloseOutlined className='fs-18' />
          </Button>
        </Flex>                
        <Text>
          {t('Enter your offer amount to send a counter offer to the Buyer.')}
        </Text>
      </Flex>
      <Form
        layout='vertical'
        form={form}
        requiredMark={false}
      >
        <Row>
          <Col span={24}>
            <MyInput
              type='number'
              label={t('Offer Amount')}
              name='offeramount'
              required
              message={t('Please enter offer amount')}
              placeholder={t('e.g. 75000')}
              addonBefore={
                <img src='/assets/icons/reyal-g.png' alt='currency-symbol' width={14} fetchPriority="high" />
              }
              className='w-100'
              // onChange={handleOfferAmountChange}
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export { CounterOffer };
