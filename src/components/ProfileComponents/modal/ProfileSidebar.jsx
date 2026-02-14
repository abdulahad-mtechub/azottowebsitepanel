import { CloseOutlined } from "@ant-design/icons";
import { Avatar, Button, Drawer, Flex, Segmented, Typography } from "antd";

const { Title } = Typography;
const ProfileSidebar = ({
  visible,
  onClose,
  user,
  parentTab,
  handleParentChange,
  segmentedOptions,
}) => {

  return (
    <Drawer
      onClose={onClose}
      open={visible}
      title={null}
      width={260}
      closeIcon={false}
      placement="left"
      className={`drawer-no-p p-2`}
    >
      <Flex justify="end">
        <Button
          aria-labelledby="Close"
          onClick={onClose}
          className="p-0 border-0 bg-transparent"
        >
          <CloseOutlined className="fs-18" />
        </Button>
      </Flex>
      <Flex vertical gap={30}>
        <Flex vertical align="center" justify="center" gap={5}>
          <Avatar
            size={40}
            className="fs-16 text-brand fw-bold bg-light-brand textuppercase"
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <Title level={5} className="fw-500">
            {user?.name?.charAt(0)?.toUpperCase() + user?.name?.slice(1)}
          </Title>
        </Flex>
        <Flex vertical gap={10}>
          <Flex justify="center">
            <Segmented
              className="custom-segment"
              options={segmentedOptions}
              value={parentTab}
              onChange={handleParentChange}
            />
          </Flex>
        </Flex>
      </Flex>
    </Drawer>
  );
};

export { ProfileSidebar };
