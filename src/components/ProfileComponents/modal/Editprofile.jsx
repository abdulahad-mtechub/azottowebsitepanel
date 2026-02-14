import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Modal,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import { MyInput, MySelect } from "../../Forms";
import { CloseOutlined } from "@ant-design/icons";
import { UPDATE_USER } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { NAVUSERDATA } from "../../../graphql";

const { Title, Text } = Typography;

const Editprofile = ({ visible, onClose, userData }) => {

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const userId = Cookies.get("userId");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    refetchQueries: [
      { query: NAVUSERDATA, variables: { getNavUserId: userId } },
    ],
  });

  // Reset initialization when modal opens/closes
  useEffect(() => {
    if (visible) {
      setIsInitialized(false);
    } else {
      // Reset form and state when modal closes
      form.resetFields();
      setSelectedDistrict(null);
    }
  }, [visible, form]);

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
          <Flex justify="end" gap={5}>
            <Button
              type="button"
              className="btn text-black border-gray"
              onClick={onClose}
              aria-labelledby={t("Cancel")}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="primary"
              className="btn bg-brand"
              loading={updateLoading}
              onClick={() => form.submit()}
              aria-labelledby={t("Update")}
            >
              {t("Update")}
            </Button>
          </Flex>
        }
        width={600}
      >
        <Flex vertical className="mb-3" gap={0}>
          <Flex justify="space-between" gap={6}>
            <Title level={5} className="m-0">
              {t("Edit Profile")}
            </Title>
            <Button
              type="button"
              onClick={onClose}
              className="p-0 border-0 bg-transparent"
              aria-labelledby={t("Close")}
            >
              <CloseOutlined className="fs-14" />
            </Button>
          </Flex>
          <Text className="fs-14">
            {t(
              "Update your personal information to keep your account accurate and up to date."
            )}
          </Text>
        </Flex>

        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
        >
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <MyInput
                label={t("Email Address")}
                name="email"
                placeholder={t("Enter Email Address")}
              />
            </Col>
            <Col span={24}>
              <MyInput
                name="phoneNo"
                label={t("Mobile Number")}
                addonBefore={
                  <Select
                    defaultValue="SA"
                    className="w-80px"
                    onChange={(value) =>
                      form.setFieldsValue({ countryCode: value })
                    }
                  >
                    <Select.Option value="sa">{t("SA")}</Select.Option>
                    <Select.Option value="ae">{t("AE")}</Select.Option>
                  </Select>
                }
                placeholder={t("3445592382")}
                className="w-100"
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export { Editprofile };
