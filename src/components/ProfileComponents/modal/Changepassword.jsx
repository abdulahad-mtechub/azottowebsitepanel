import { Button, Col, Flex, Form, Modal, Row, Typography, message } from 'antd';
import { MyInput } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
import { CHANGE_PASSWORD } from '../../../graphql/mutation';
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Changepassword = ({ visible, onClose }) => {
  
  const { t } = useTranslation();
  const [form] = Form.useForm(); 
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
  const [messageApi, contextHolder] = message.useMessage();

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  const handleSubmit = async (values) => {
    try {
      const userId = Cookies.get("userId"); 
      await changePassword({
        variables: {
          adminChangePasswordId: userId,
          oldPassword: values.currentpassword,
          newPassword: values.newpassword,
        },
      });

      messageApi.success(t("Password changed successfully ✅"));
      form.resetFields();
      onClose();
    } catch (err) {
      messageApi.error(t(`Failed to change password ❌ ${err}`));
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
        footer={
          <Flex justify="end" gap={5}>
            <Button aria-labelledby={t('Cancel')} type="button" className="btn text-black border-gray" onClick={onClose}>
              {t('Cancel')}
            </Button>
            <Button
              type="primary"
              className="btn bg-brand"
              loading={loading}
              onClick={() => form.submit()}
              aria-labelledby={t('Confirm')}
            >
              {t('Confirm')}
            </Button>
          </Flex>
        }
        width={600}
      >
        <Flex vertical className="mb-3" gap={0}>
          <Flex justify="space-between" gap={6}>
            <Title level={5} className="m-0">
              {t('Change Password')}
            </Title>
            <Button aria-labelledby={t('Close')} type="button" onClick={onClose} className="p-0 border-0 bg-transparent">
              <CloseOutlined className="fs-14" />
            </Button>
          </Flex>
          <Text className="fs-14">
            {t('Enter your current password & type new password to update.')}
          </Text>
        </Flex>

        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          onFinish={handleSubmit}
        >
          <Row>
            <Col span={24}>
              <MyInput
                label={t('Current Password')}
                name="currentpassword"
                message={t('Enter your current password')}
                placeholder={t('Enter your current password')}
                className="w-100"
                type="password"
              />
            </Col>

            <Col span={24}>
              <Form.Item
                name="newpassword"
                rules={[
                  { required: true, message: t('Enter your new password') },
                  {
                    pattern: passwordPattern,
                    message: t('Password should contain at least 8 characters, one uppercase letter, one number and one special character'),
                  },
                ]}
                hasFeedback
              >
                <MyInput
                  label={t('New Password')}
                  placeholder={t('Enter your new password')}
                  className="w-100"
                  type="password"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                name="confirmnewpassword"
                dependencies={["newpassword"]}
                hasFeedback
                rules={[
                  { required: true, message: t('Please confirm your new password') },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newpassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error(t('The password that you entered do not match!')));
                    },
                  }),
                ]}
              >
                <MyInput
                  label={t('Confirm New Password')}
                  placeholder={t('Enter your confirm new password')}
                  className="w-100"
                  type="password"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export { Changepassword };
