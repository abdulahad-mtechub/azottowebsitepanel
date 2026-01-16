import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Flex,
  Form,
  Image,
  Modal,
  Row,
  Typography,
  message,
  Popover,
} from "antd";
import { MyInput } from "../../Forms";
import { useEffect } from "react";
import { CREATE_OFFER } from "../../../graphql/mutation/mutations";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useCommissionRate } from "../../../hooks";

const { Title, Text } = Typography;
const OfferSellerModal = ({
  visible,
  onClose,
  businessId,
  offerId,
  refetch,
  mode,
}) => {
  const { t } = useTranslation();
  const { commissionRate } = useCommissionRate();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  const handleOfferAmountChange = (e) => {
    const offerAmount = parseFloat(String(e).replace(/,/g, "")) || 0;
    const commission = offerAmount * commissionRate;
    const commissionRounded = Number(commission.toFixed(2));
    const totalAmount = Number((offerAmount + commissionRounded).toFixed(2));

    form.setFieldsValue({
      commission: commissionRounded,
      totalamount: totalAmount,
    });
  };

  const [createOffer, { loading: createOfferLoading }] = useMutation(
    CREATE_OFFER,
    {
      onCompleted: () => refetch && refetch(),
    }
  );

  useEffect(() => {
    form.resetFields();
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
              aria-labelledby="Cancel"
              className="btn text-black border-gray"
              onClick={onClose}
            >
              {t("Cancel")}
            </Button>
            <Button
              aria-labelledby="Send an Offer"
              loading={createOfferLoading}
              disabled={createOfferLoading}
              className="btn bg-brand"
              onClick={async () => {
                try {
                  const values = await form.validateFields();
                  await createOffer({
                    variables: {
                      input: {
                        businessId,
                        price: parseFloat(values.offeramount),
                        ...(offerId ? { parentOfferId: offerId } : {}),
                        ...(mode === "offer" ? { isProceedToPay: false } : {}),
                        ...(mode === "proceed" ? { isProceedToPay: true } : {}),
                      },
                    },
                  });
                  messageApi.success(t("Offer sent successfully!"));
                  if (refetch) {
                    refetch({ limit: 10, offset: 0, search: "" });
                  }
                  onClose();
                } catch (error) {
                  console.error("Validation or mutation error:", error);
                }
              }}
            >
              {t("Send an Offer")}
            </Button>
          </Flex>
        }
        width={600}
      >
        <Flex vertical className="mb-3" gap={0}>
          <Flex justify="space-between" gap={6}>
            <Title level={4} className="m-0">
              {mode === "proceed"
                ? t("Proceed to Purchase")
                : t("Counter Offer to Seller")}
            </Title>
            <Button
              aria-labelledby="Close"
              onClick={onClose}
              className="p-0 border-0 bg-transparent"
            >
              <CloseOutlined className="fs-18" />
            </Button>
          </Flex>
          <Text>
            {mode === "proceed"
              ? t("Confirm your purchase by entering the agreed amount.")
              : t(
                  "Enter your offer amount and terms to send a counter-proposal to the seller."
                )}
          </Text>
        </Flex>
        <Form layout="vertical" form={form} requiredMark={false}>
          <Row>
            <Col span={24}>
              <MyInput
                type={"number"}
                label={t("Offer Amount")}
                name="offeramount"
                required
                isNumber
                message={t("Please enter offer amount")}
                placeholder={t("e.g. 75000")}
                addonBefore={
                  <img
                    src="/assets/icons/reyal-g.png"
                    width={14}
                    alt="currency-symbol"
                    fetchPriority="high"
                  />
                }
                className="w-100"
                onChange={handleOfferAmountChange}
              />
            </Col>
            <Col span={24}>
              <MyInput
                label={
                  <Flex gap={6} align="center">
                    <Text>{t(`Total Amount (Offer + Commission)`)}</Text>
                    <Popover
                      content={
                        <Text>
                          {t(
                            "This is the total amount including the commission."
                          )}
                        </Text>
                      }
                      title={null}
                      trigger={["hover", "click"]}
                      placement="left"
                      autoAdjustOverflow={true}
                      overlayStyle={{
                        maxWidth: "450px",
                        zIndex: 1060,
                      }}
                      overlayInnerStyle={{
                        maxHeight: "70vh",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                    >
                      <Image
                        preview={false}
                        src="/assets/icons/info-outline.png"
                        width={16}
                        alt="Commission info"
                        style={{ cursor: "pointer" }}
                      />
                    </Popover>
                  </Flex>
                }
                name="totalamount"
                required
                message={t("Please enter total amount")}
                placeholder={t("e.g. 80,000")}
                addonBefore={
                  <Image
                    src="/assets/icons/reyal-g.png"
                    alt="currency-symbol"
                    width={14}
                  />
                }
                className="w-100"
                disabled
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export { OfferSellerModal };
