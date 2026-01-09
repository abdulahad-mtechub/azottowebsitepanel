import {
  Button,
  Col,
  Flex,
  Form,
  Modal,
  Row,
  Typography,
  message,
  Input,
} from "antd";
import { MyInput } from "../../Forms";
import { CloseOutlined } from "@ant-design/icons";
import { CHANGE_PASSWORD } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Changepassword = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^])[A-Za-z\d@$!%*?&#^]{8,}$/;
  const [messageApi, contextHolder] = message.useMessage();

  const [changePassword, { loading }] = useMutation(CHANGE_PASSWORD);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values) => {
    try {
      const userId = Cookies.get("userId");
      const { data, errors } = await changePassword({
        variables: {
          adminChangePasswordId: userId,
          oldPassword: values.currentpassword,
          newPassword: values.newpassword,
        },
      });

      if (errors && errors.length > 0) {
        const graphQLError = errors[0]?.message;
        messageApi.error(t(graphQLError || "Failed to change password"));
        return;
      }

      if (data?.adminChangePassword) {
        messageApi.success(t("Password changed successfully ✅"));
        form.resetFields();
        onClose();
      } else {
        messageApi.error(
          t("Failed to change password. Please check your current password.")
        );
      }
    } catch (err) {
      const graphQLError = err?.graphQLErrors?.[0]?.message;
      if (graphQLError) {
        messageApi.error(t(graphQLError));
      } else if (err?.networkError) {
        messageApi.error(t("Network error. Please check your connection."));
      } else {
        messageApi.error(
          t(err?.message || "Something went wrong. Please try again.")
        );
      }
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={visible}
        onCancel={handleClose}
        closeIcon={false}
        centered
        footer={
          <Flex justify="end" gap={5}>
            <Button
              aria-labelledby={t("Cancel")}
              type="button"
              className="btn text-black border-gray"
              onClick={handleClose}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="primary"
              className="btn bg-brand"
              loading={loading}
              onClick={() => form.submit()}
              aria-labelledby={t("Confirm")}
            >
              {t("Confirm")}
            </Button>
          </Flex>
        }
        width={600}
      >
        <Flex vertical className="mb-3" gap={0}>
          <Flex justify="space-between" gap={6}>
            <Title level={5} className="m-0">
              {t("Change Password")}
            </Title>
            <Button
              aria-labelledby={t("Close")}
              type="button"
              onClick={handleClose}
              className="p-0 border-0 bg-transparent"
            >
              <CloseOutlined className="fs-14" />
            </Button>
          </Flex>
          <Text className="fs-14">
            {t("Enter your current password & type new password to update.")}
          </Text>
        </Flex>

        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          onFinish={handleSubmit}
          preserve={false}
        >
          <Row>
            <Col span={24}>
              <MyInput
                label={t("Current Password")}
                name="currentpassword"
                required={true}
                message={t("Enter your current password")}
                placeholder={t("Enter your current password")}
                className="w-100"
                type="password"
              />
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Typography.Text className="fs-14 fw-400">
                    {t("New Password")}
                  </Typography.Text>
                }
                name="newpassword"
                rules={[
                  { required: true, message: t("Enter your new password") },
                  {
                    pattern: passwordPattern,
                    message: t(
                      "Password should contain at least 8 characters, one uppercase letter, one number and one special character"
                    ),
                  },
                ]}
                hasFeedback
                className="custom-input fs-14"
              >
                <Input.Password
                  placeholder={t("Enter your new password")}
                  size="middle"
                  className="m-0 fs-14"
                />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label={
                  <Typography.Text className="fs-14 fw-400">
                    {t("Confirm Password")}
                  </Typography.Text>
                }
                name="confirmnewpassword"
                dependencies={["newpassword"]}
                hasFeedback
                className="custom-input fs-14"
                rules={[
                  {
                    required: true,
                    message: t("Please confirm your password"),
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newpassword") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          t("The password that you entered do not match!")
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  placeholder={t("Enter your confirm password")}
                  size="middle"
                  className="m-0 fs-14"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export { Changepassword };
