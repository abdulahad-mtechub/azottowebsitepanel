import { Button, Col, Form, Image, Modal, Row, Typography, message, Spin } from 'antd';
import { MyInput, MySelect } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
import { ADD_BANK } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { GETUSERBANK } from '../../../graphql/query';
import Cookies from 'js-cookie';
import { useState } from 'react';

const { Title, Text } = Typography;

const AddWalletModal = ({ visible, onClose }) => {
  const userId = Cookies.get('userId'); // read userId from cookie
  const [messageApi, contextHolder] = message.useMessage();
  const [showSuccessAfterClose, setShowSuccessAfterClose] = useState(false);
  const [form] = Form.useForm();

  const [addBank, { loading }] = useMutation(ADD_BANK, {
    onCompleted: () => {
      setShowSuccessAfterClose(true);
      onClose();
    },
    onError: (err) => {
      messageApi.error(err.message || 'Something went wrong');
    },
    refetchQueries: [
      // if GETUSERBANK takes a variable named `getUserBanksId`, keep the object below,
      // otherwise just pass { query: GETUSERBANK }.
      { query: GETUSERBANK, /* variables: { getUserBanksId: userId } */ },
    ],
    awaitRefetchQueries: true,
  });

  const onFinish = (values) => {
    addBank({
      variables: {
        input: {
          bankName: values.bankName,
          accountTitle: values.accountHoldername,
          iban: values.ibanNumber,
        },
      },
    });
  };

  const handleAfterClose = () => {
    form.resetFields();
    if (showSuccessAfterClose) {
      messageApi.success('Bank account added successfully!');
      setShowSuccessAfterClose(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={visible}
        onCancel={() => {
          onClose();
        }}
        closeIcon={false}
        afterClose={handleAfterClose}        // <-- correct prop name
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button
              type="default"
              onClick={() => onClose()}
              aria-label="Cancel"
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="primary"
              onClick={() => form.submit()}
              aria-label="Save Account"
              loading={loading}   
            >
              Save Account
            </Button>
          </div>
        }
        width={600}
        destroyOnClose={false}
      >
        <div style={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Title level={5} style={{ margin: 0 }}>
              Add New Bank Account
            </Title>
            <Button
              type="text"
              onClick={() => onClose()}
              style={{ padding: 0 }}
              aria-label="Close"
              disabled={loading}
            >
              <CloseOutlined style={{ fontSize: 14 }} />
            </Button>
          </div>

          <Text className="fs-14">
            Securely link your bank account to receive payments for completed deals. Make sure the IBAN is correct to avoid payout delays.
          </Text>

          <Form layout="vertical" form={form} requiredMark={false} onFinish={onFinish} style={{ marginTop: 16 }}>
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <MySelect
                  label="Bank Name"
                  name="bankName"
                  required
                  message="Please choose bank name"
                  placeholder="select bank"
                  options={[
                    {
                      id: 1,
                      name: 'The Saudi Investment Bank',
                    },
                  ]}
                />
              </Col>

              <Col span={24}>
                <MyInput
                  label="Account Holder Name"
                  name="accountHoldername"
                  required
                  message="Please enter account holder name"
                  placeholder="Enter account holder name"
                />
              </Col>

              <Col span={24}>
                <MyInput
                  label="IBAN Number"
                  name="ibanNumber"
                  required
                  message="Please enter iban number"
                  placeholder="Enter iban number"
                />
              </Col>

              <Col span={24}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 12, borderRadius: 8, background: '#f0f7ff' }}>
                  <Image src="/assets/icons/info-b.png" preview={false} width={20} alt="info icon" />
                  <Text className="fs-13" style={{ color: '#096dd9' }}>
                    Your banking details are encrypted and used only for secure payouts through Jusoor.
                  </Text>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export { AddWalletModal };