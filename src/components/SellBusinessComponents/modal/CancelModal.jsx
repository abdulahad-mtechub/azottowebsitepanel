import { Button, Divider, Flex, Modal, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;
const CancelModal = ({ visible, onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCancel = () => {
    onClose();
  };

  const handleConfirm = () => {
    localStorage.removeItem("sellBusinessDraft");
    navigate("/");
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      closeIcon={false}
      centered
      footer={
        <Flex justify="center" gap={5}>
          <Button
            aria-labelledby={t("Cancel")}
            type="button"
            className="btn text-black border-gray"
            onClick={handleCancel}
          >
            {t("Cancel")}
          </Button>
          <Button
            aria-labelledby={t("Confirm")}
            type="primary"
            className="btn bg-brand"
            onClick={handleConfirm}
          >
            {t("Confirm")}
          </Button>
        </Flex>
      }
    >
      <Flex vertical align="center" gap={6}>
        <img
          src="/assets/icons/cancel-ic.png"
          alt={t("close-status-icon")}
          width={50}
          fetchPriority="high"
        />
        <Title level={4} className="m-0">
          {t("Cancel Listing?")}
        </Title>
        <Text>
          {t(
            "Your current progress will be lost if you cancel. Do you still want to proceed?"
          )}
        </Text>
      </Flex>
      <Divider className="my-2 bg-light-brand" />
    </Modal>
  );
};

export { CancelModal };
