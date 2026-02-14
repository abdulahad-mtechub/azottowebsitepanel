import { Button, Divider, Flex, Modal, Typography, message } from "antd";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const DeleteModal = ({
  visible,
  onClose,
  title,
  subtitle,
  type,
  buttontext,
}) => {
  const { t } = useTranslation();

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
          <Flex justify="center" gap={5}>
            <Button
              aria-labelledby="Cancel"
              type="button"
              onClick={onClose}
              className="btn text-black border-gray"
            >
              "Cancel"
            </Button>
            <Button
              aria-labelledby="Confirm"
              className={`btn ${type === "danger" ? "bg-red" : "bg-brand"}`}
            >
              {buttontext ? (buttontext) : "Confirm"}
            </Button>
          </Flex>
        }
      >
        <Flex vertical align="center" className="text-center" gap={6}>
          <img
            src="/assets/icons/cancel-ic.png"
            alt={"close-status-icon"}
            width={50}
            fetchPriority="high"
          />
          <Title level={4} className="m-0">
            {title}
          </Title>
          <Text>{subtitle}</Text>
        </Flex>
        <Divider className="my-2 bg-light-brand" />
      </Modal>
    </>
  );
};

export { DeleteModal };
