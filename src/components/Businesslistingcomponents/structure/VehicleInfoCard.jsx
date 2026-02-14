import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  message,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { useFormatNumber } from "../../../hooks";

const { Title, Text } = Typography;

const VehicleInfoCard = ({ data }) => {
  const { formatNumber } = useFormatNumber();
  const [messageApi, contextHolder] = message.useMessage();

  const vehicleInfoData = [
    {
      id: 1,
      icon: "/assets/icons/verification.png",
      title:  "Verified By Azotto",
      subtitle:  "Identity Verification",
    },
    {
      id: 2,
      icon: "/assets/icons/businessprice.png",
      title: formatNumber(data?.price || "0"),
      subtitle:  "Vehicle Price",
    },
  ];

  return (
    <>
      {contextHolder}
      <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Title level={5} className="m-0">
              { "Business Info"}
            </Title>
          </Col>
          {vehicleInfoData?.map((stat, i) => (
            <Col span={24} key={i}>
              <Flex gap={10}>
                <div
                  className={`icon-pre ${
                    stat.id === 1 ? "bg-light-green" : null
                  }`}
                >
                  <Image
                    src={stat?.icon}
                    preview={false}
                    width={"100%"}
                    alt={ "stats icon"}
                  />
                </div>
                <Flex vertical gap={2}>
                  <Title
                    level={5}
                    className={`m-0 ${
                      stat.id === 1 ? "text-green" : "text-brand"
                    }`}
                  >
                    {stat.id === 2 && (
                      <img
                        src="/assets/icons/reyal-b.png"
                        width={16}
                        alt={ "currency-symbol"}
                        fetchPriority="high"
                      />
                    )}{" "}
                    {stat.id === 1 ? (
                      <Space>
                        {stat?.title}
                        <Tooltip
                          title={ 
                            "The Azottohas verified the identity of the business owner."
                          }
                        >
                          <img
                            src="/assets/icons/info.png"
                            width={18}
                            alt={ "info-icon"}
                            fetchPriority="high"
                            className="center"
                          />
                        </Tooltip>
                      </Space>
                    ) : (
                      stat?.title
                    )}
                  </Title>
                  <Text className="text-gray fs-12 fw-500">
                    {stat?.subtitle}
                  </Text>
                </Flex>
              </Flex>
            </Col>
          ))}
          <Col span={24}>
            <Divider className="m-0" />
          </Col>
        </Row>
      </Card>
    </>
  );
};

export { VehicleInfoCard };
