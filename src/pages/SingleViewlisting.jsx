import { useEffect, useRef } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Typography,
  Spin,
  Image,
  Tooltip,
  Space,
  Collapse,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  VehicleInfoCard,
  VehicleInfoCardMobile,
  ExploreSimilarVehicles,
} from "../components";
import { RightOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { BusinessStats } from "../components/SellBusinessComponents/structure/BusinessStats";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../hooks";

const { Text, Title } = Typography;
const { Panel } = Collapse;

const SingleViewlisting = () => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const postsaleColumns = usePostsaleColumns();
  const liabColumn = useLiabColumn();
  const keyassetsColumn = useKeyassetsColumn();
  const inventColumn = useInventColumn();
  const { id } = useParams();
  const navigate = useNavigate();
  const viewTrackedRef = useRef(false);

  useEffect(() => {
    const footer = document.getElementById("footer");
    const handleResize = () => {
      if (footer) {
        if (window.innerWidth <= 768) footer.classList.add("footer-add-150");
        else footer.classList.remove("footer-add-150");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (footer) footer.classList.remove("footer-add-150");
    };
  }, []);


  return (
    <div className="padd-1 relative">
      <div className="container">
        <Breadcrumb
          separator={
            <Text className="text-gray">
              <RightOutlined className="fs-10" />
            </Text>
          }
          className="my-2 pt-1"
          items={[
            {
              title: (
                <Text
                  className="cursor text-gray"
                  onClick={() => navigate("/")}
                >
                  {t("Home")}
                </Text>
              ),
            },
            {
              title: (
                <Text
                  className="cursor text-gray"
                  onClick={() => navigate("/businesslisting")}
                >
                  {"Purchased Vehicles"}
                </Text>
              ),
            },
            {
              title: (
                <Text className="fw-500">
                  {business?.businessTitle || t("Not Found")}
                </Text>
              ),
            },
          ]}
        />
      </div>

      <div
        className="bg-img"
        style={{ backgroundImage: "url(/assets/images/card-1.webp)" }}
      >
        <div className="container">
          <Flex vertical gap={5} className="text-center">
            <Text className="text-white">
              {t("Reference #")}: {business?.reference || t("Not Found")}
            </Text>
            <Title level={2} className="text-white m-0">
              {business?.businessTitle || t("Not Found")}
            </Title>
          </Flex>
        </div>
      </div>

      <div className="container">
        <Row gutter={[24, 24]} className="mt-3">
          <Col
            lg={{ span: 18 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
              <Flex vertical gap={20}>
                <Flex vertical gap={10}>
                  <Flex vertical gap={12}>
                    <Text className="fs-13 text-gray fw-500">
                      {t("Reference #")}:{" "}
                      {business?.reference || t("Not Found")}
                    </Text>
                    <Flex gap={10} align="center">
                      <Button
                        aria-label={t("Arrow Left")}
                        className="p-0"
                        type="text"
                        onClick={() => navigate("/businesslisting")}
                      >
                        <Image
                          src="/assets/icons/back-arr.png"
                          alt={t("Arrow Left")}
                          width={26}
                          height={26}
                          preview={false}
                        />
                      </Button>
                      <Title level={3} className="m-0">
                        {business?.businessTitle}
                      </Title>
                    </Flex>
                    <Flex align="center" gap={5}>
                      <Title level={5} className="m-0">
                        {businessData?.title}
                      </Title>
                      {businessData?.type && (
                        <Button
                          className={`fs-12 border-0 text-white ${
                            businessData?.type === "Taqbeel"
                              ? "bg-brand"
                              : "bg-black"
                          }`}
                        >
                          {businessData?.type}
                        </Button>
                      )}
                    </Flex>
                  </Flex>
                  <Text className="text-justify">
                    {business?.description || t("No description available.")}
                  </Text>
                </Flex>
              </Flex>
            </Card>
            <BusinessStats data={business} />
          </Col>
          <Col
            lg={{ span: 6 }}
            md={{ span: 0 }}
            sm={{ span: 0 }}
            xs={{ span: 0 }}
          >
            <div className="sticky-comp">
              <VehicleInfoCard data={business} />
            </div>
          </Col>
        </Row>
        <VehicleInfoCardMobile data={business} />
      </div>
      <ExploreSimilarVehicles id={business?.id} />
    </div>
  );
};

export { SingleViewlisting };
