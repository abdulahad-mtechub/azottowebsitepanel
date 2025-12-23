import {
  Button,
  Col,
  Form,
  Image,
  Modal,
  Row,
  Typography,
  message,
} from "antd";
import { MyInput, MySelect } from "../../Forms";
import { CloseOutlined } from "@ant-design/icons";
import { ADD_BANK } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import { GETUSERBANK } from "../../../graphql/query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const AddWalletModal = ({ visible, onClose }) => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();
  const [showSuccessAfterClose, setShowSuccessAfterClose] = useState(false);
  const [form] = Form.useForm();

  const [addBank, { loading }] = useMutation(ADD_BANK, {
    onCompleted: () => {
      setShowSuccessAfterClose(true);
      onClose();
    },
    onError: (err) => {
      messageApi.error(err.message || t("Something went wrong"));
    },
    refetchQueries: [{ query: GETUSERBANK }],
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
      messageApi.success(t("Bank account added successfully!"));
      setShowSuccessAfterClose(false);
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
        afterClose={handleAfterClose}
        footer={
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button
              type="default"
              onClick={onClose}
              aria-label={t("Cancel")}
              disabled={loading}
            >
              {t("Cancel")}
            </Button>

            <Button
              type="primary"
              onClick={() => form.submit()}
              aria-label={t("Save Account")}
              loading={loading}
            >
              {t("Save Account")}
            </Button>
          </div>
        }
        width={600}
        destroyOnClose={false}
      >
        <div
          style={{
            opacity: loading ? 0.6 : 1,
            pointerEvents: loading ? "none" : "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <Title level={5} style={{ margin: 0 }}>
              {t("Add New Bank Account")}
            </Title>
            <Button
              type="text"
              onClick={onClose}
              style={{ padding: 0 }}
              aria-label={t("Close")}
              disabled={loading}
            >
              <CloseOutlined style={{ fontSize: 14 }} />
            </Button>
          </div>

          <Text className="fs-14">
            {t(
              "Securely link your bank account to receive payments for completed deals. Make sure the IBAN is correct to avoid payout delays."
            )}
          </Text>

          <Form
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={onFinish}
            style={{ marginTop: 16 }}
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <MySelect
                  label={t("Bank Name")}
                  name="bankName"
                  required
                  message={t("Please choose bank name")}
                  placeholder={t("select bank")}
                  options={[
                    {
                      id: 1,
                      name: t("The Saudi Investment Bank"),
                    },
                  ]}
                />
              </Col>

              <Col span={24}>
                <MyInput
                  label={t("Account Holder Name")}
                  name="accountHoldername"
                  required
                  message={t("Please enter account holder name")}
                  placeholder={t("Enter account holder name")}
                />
              </Col>

              <Col span={24}>
                <MyInput
                  label={t("IBAN Number")}
                  name="ibanNumber"
                  required
                  message={t("Please enter iban number")}
                  placeholder={t("Enter iban number")}
                />
              </Col>

              <Col span={24}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 8,
                    background: "#f0f7ff",
                  }}
                >
                  <Image
                    src="/assets/icons/info-b.png"
                    preview={false}
                    width={20}
                    alt={t("info icon")}
                  />
                  <Text className="fs-13" style={{ color: "#096dd9" }}>
                    {t(
                      "Your banking details are encrypted and used only for secure payouts through Jusoor."
                    )}
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
