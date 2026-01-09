import { CloseOutlined } from "@ant-design/icons";
import { Button, Flex, Modal, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { useFormatNumber, useCommissionRate } from "../../../hooks";

const { Title, Text } = Typography;

const ProceedToPurchaseModal = ({
  visible,
  onClose,
  businessPrice,
  onConfirm,
  loading,
}) => {
  const { t } = useTranslation();
  const { commissionRate } = useCommissionRate();
  const { formatNumber } = useFormatNumber();

  const { commission, totalAmount } = useMemo(() => {
    const calculatedCommission = businessPrice * commissionRate;

    const commissionRounded = Number(calculatedCommission.toFixed(2));
    const total = Number((businessPrice + commissionRounded).toFixed(2));

    return {
      commission: commissionRounded,
      totalAmount: total,
    };
  }, [businessPrice]);

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
            className="btn text-black border-gray"
            onClick={onClose}
            disabled={loading}
          >
            {t("Cancel")}
          </Button>
          <Button
            aria-labelledby={t("Confirm & Proceed")}
            className="btn bg-green text-white"
            onClick={onConfirm}
            loading={loading}
          >
            {t("Confirm & Proceed")}
          </Button>
        </Flex>
      }
      width={500}
    >
      <Flex vertical gap={20}>
        <Flex justify="space-between" align="center">
          <Title level={4} className="m-0">
            {t("Proceed to Purchase")}
          </Title>
          <Button
            aria-labelledby={t("Close")}
            onClick={onClose}
            className="p-0 border-0 bg-transparent"
            disabled={loading}
          >
            <CloseOutlined className="fs-18" />
          </Button>
        </Flex>

        <Text className="fs-14 text-gray">
          {t("Are you sure you want to proceed with this purchase?")}
        </Text>

        <Flex vertical gap={12}>
          <Flex justify="space-between" align="center">
            <Text className="fs-14">{t("Business Price")}</Text>
            <Text className="fw-500 fs-16">
              {formatNumber(businessPrice) || "0"}
            </Text>
          </Flex>

          <Flex justify="space-between" align="center">
            <Text className="fs-14">{t("Jusoor Commission")}</Text>
            <Text className="fw-500 fs-16">
              {formatNumber(commission) || "0"}
            </Text>
          </Flex>

          <div
            style={{ height: "1px", background: "#e0e0e0", margin: "8px 0" }}
          />

          <Flex justify="space-between" align="center">
            <Text className="fw-600 fs-16">{t("Total Amount")}</Text>
            <Text className="fw-600 fs-18 text-brand">
              {formatNumber(totalAmount) || "0"}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Modal>
  );
};

export { ProceedToPurchaseModal };
