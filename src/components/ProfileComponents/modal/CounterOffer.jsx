import { CloseOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Modal, Row, Typography, message } from "antd";
import { MyInput } from "../../Forms";
import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { COUNTER_OFFER } from "../../../graphql/mutation";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const CounterOffer = ({
  visible,
  onClose,
  selectedOfferId,
  title,
  refetch,
}) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [counterOffer, { loading }] = useMutation(COUNTER_OFFER);

  useEffect(() => {
    form.resetFields();
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      const offerAmount = parseFloat(values.offeramount);
      await counterOffer({
        variables: {
          input: {
            parentOfferId: selectedOfferId,
            price: offerAmount,
          },
        },
      });
      messageApi.success(t("Counter offer sent successfully!"));
      refetch();
      onClose();
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to send counter offer."));
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
        <Flex justify="end" gap={5}>
          <Button
            aria-labelledby={t("Cancel")}
            type="button"
            className="btn text-black border-gray"
            onClick={onClose}
          >
            {t("Cancel")}
          </Button>
          <Button
            aria-labelledby={t("Send Counter Offer")}
            type="primary"
            className="btn bg-brand"
            onClick={handleSubmit}
            loading={loading}
          >
            {t("Send Counter Offer")}
          </Button>
        </Flex>
      }
      width={600}
    >
      {contextHolder}
      <Flex vertical className="mb-3" gap={0}>
        <Flex justify="space-between" gap={6}>
          <Title level={4} className="m-0">
            {title ? t(title) : t("Counter Offer to Seller")}
          </Title>
          <Button
            aria-labelledby={t("Close")}
            type="button"
            onClick={onClose}
            className="p-0 border-0 bg-transparent"
          >
            <CloseOutlined className="fs-18" />
          </Button>
        </Flex>
        <Text>
          {t("Enter your offer amount to send a counter offer to the Buyer.")}
        </Text>
      </Flex>
      <Form layout="vertical" form={form} requiredMark={false}>
        <Row>
          <Col span={24}>
            <MyInput
              type="number"
              label={t("Offer Amount")}
              name="offeramount"
              required
              message={t("Please enter offer amount")}
              placeholder={t("e.g. 75000")}
              addonBefore={
                <img
                  src="/assets/icons/reyal-g.png"
                  alt="currency-symbol"
                  width={14}
                  fetchPriority="high"
                />
              }
              className="w-100"
            />
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export { CounterOffer };
