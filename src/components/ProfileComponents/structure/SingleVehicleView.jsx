import {
  Card,
  Row,
  Col,
  Flex,
  Typography,
  Breadcrumb,
  Space,
  Button,
  Image,
  Tabs,
  message,
  Tooltip,
} from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { VehicleStatusModal } from "../modal/VehicleStatusModal";
import { useState } from "react";

const { Text, Title } = Typography;

const SingleVehicleView = ({ setSingleDetail, singledetail }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [statusModalVisible, setStatusModalVisible] = useState(false);


  const handleStatusToggle = async (newStatus) => {
    //TODO
  };
  return (
    <div className="mb-2">
      {contextHolder}
      <Flex vertical gap={20}>
        <Breadcrumb
          separator={
            <Text className="text-gray">
              <RightOutlined className="fs-10" />
            </Text>
          }
        />
        <Flex justify="space-between">
          <Space>
            <Button
              aria-labelledby={t("Arrow left")}
              type="button"
              className="p-0 border-0 bg-transparent"
              onClick={() => setSingleDetail(null)}
            >
              <Image
                src="/assets/icons/back-arr.png"
                alt={t("Arrow Left")}
                width={22}
                height={22}
                preview={false}
              />
            </Button>
            <Title level={5} className="m-0">
              {business?.businessTitle}
            </Title>
          </Space>
        </Flex>
        <Card className="radius-12 border-gray card-cs">
          <Row gutter={[16, 16]}>

            <Col span={24}>
              <Tabs className="tabs-fill" defaultActiveKey="1" items={items} />
            </Col>
          </Row>
        </Card>
      </Flex>

      <VehicleStatusModal
        visible={statusModalVisible}
        onClose={() => setStatusModalVisible(false)}
        currentStatus={business?.businessStatus}
        onConfirm={handleStatusToggle}
        loading={updateLoading}
      />
    </div>
  );
};

export { SingleVehicleView };
