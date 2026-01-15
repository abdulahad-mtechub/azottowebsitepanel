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
  useInventColumn,
  useKeyassetsColumn,
  useLiabColumn,
  usePostsaleColumns,
} from "../data";
import {
  BusinessInfoCard,
  BusinessInfoCardMobile,
  ExploreSimilarBusiness,
  PreviewTableContent,
} from "../components";
import { RightOutlined, PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_BUSINESS } from "../graphql/query/business";
import { CREATE_VIEW_BUSINESS } from "../graphql/mutation";
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

  const [viewBusiness] = useMutation(CREATE_VIEW_BUSINESS);

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

  const { data: businessData, loading: businessLoading } = useQuery(
    GET_BUSINESS,
    {
      variables: { getBusinessByIdId: id },
      skip: !id,
    }
  );

  const business = businessData?.getBusinessById?.business;

  // Track business view once when business data is loaded
  useEffect(() => {
    if (business?.id && !viewTrackedRef.current) {
      viewTrackedRef.current = true;
      viewBusiness({
        variables: { viewBusinessId: business.id },
      }).catch((error) => {
        console.error("Error tracking business view:", error);
      });
    }
  }, [business?.id, viewBusiness]);

  const postSaleData = [
    {
      key: "1",
      period: formatNumber(business?.supportDuration) || t("N/A"),
      session: formatNumber(business?.supportSession) || t("N/A"),
      verified: business?.isSupportVerified,
    },
  ];

  const liabilitiesData = business?.liabilities?.map((item, index) => ({
    key: item.id || index,
    name: item.name,
    items: formatNumber(item.quantity),
    purchaseyear: formatNumber(item.purchaseYear),
    price: formatNumber(item?.price),
    verified: item.isActive,
  }));

  const assetsData = business?.assets?.map((item, index) => ({
    key: item.id || index,
    name: item.name,
    items: formatNumber(item.quantity),
    purchaseyear: formatNumber(item?.purchaseYear),
    price: formatNumber(item?.price),
    verified: item.isActive,
  }));

  const inventoryData = business?.inventoryItems?.map((item, index) => ({
    key: item.id || index,
    name: item.name,
    items: formatNumber(item.quantity),
    purchaseyear: formatNumber(item.purchaseYear),
    price: formatNumber(item.price),
    verified: item.isActive,
  }));

  if (businessLoading) {
    return (
      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

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
                  {t("Browse Businesses")}
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
              {t("Reference #")}:{" "}
              {formatNumber(business?.reference) || t("Not Found")}
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
                      {formatNumber(business?.reference) || t("Not Found")}
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
                      <Button
                        aria-labelledby="type"
                        className={`${
                          business?.isByTakbeer ? "bg-brand" : "bg-black"
                        }`}
                      >
                        <Space align="center" justify="center">
                          <Text className="fs-12 text-white">
                            {business?.isByTakbeer
                              ? t("Taqbeel")
                              : t("Acquiring")}
                          </Text>
                          <Tooltip
                            title={
                              business?.isByTakbeer
                                ? t(
                                    "Taqbeel refers to transferring a business by buying only the assets such as equipment or contracts without purchasing the trade name, brand, or commercial registration."
                                  )
                                : t(
                                    "Acquisition means a full purchase of the business, including its brand, trade name, CR, assets, and even liabilities."
                                  )
                            }
                          >
                            <img
                              src="/assets/icons/info-a.png"
                              width={16}
                              alt={t("takbeel-icon")}
                              fetchPriority="high"
                              className="center"
                            />
                          </Tooltip>
                        </Space>
                      </Button>
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
            {business?.growthOpportunities && (
              <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
                <Flex vertical gap={0}>
                  <Title level={5}>{t("Growth Opportunity")}</Title>
                  <Text className="text-justify">
                    {business?.growthOpportunities}
                  </Text>
                </Flex>
              </Card>
            )}
            <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
              <Flex vertical gap={0}>
                <Title level={5}>{t("Reason for Selling")}</Title>
                <Text className="text-justify">
                  {business?.reason || t("No reason for selling provided.")}
                </Text>
              </Flex>
            </Card>
            <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
              <PreviewTableContent
                title={t("Post - Sale Support")}
                columns={postsaleColumns}
                data={postSaleData}
              />
            </Card>
            {liabilitiesData?.length > 0 && (
              <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) =>
                    isActive ? <MinusOutlined /> : <PlusOutlined />
                  }
                  expandIconPosition="end"
                  className="custom-collapse"
                >
                  <Panel
                    header={
                      <Title level={5} className="m-0">
                        {t("Outstanding Liabilities / Debt")}
                      </Title>
                    }
                    key="1"
                    className="shadow-d radius-12 bg-lightest-gray"
                  >
                    <PreviewTableContent
                      title={null}
                      columns={liabColumn}
                      data={liabilitiesData}
                    />
                  </Panel>
                </Collapse>
              </Card>
            )}
            {assetsData?.length > 0 && (
              <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) =>
                    isActive ? <MinusOutlined /> : <PlusOutlined />
                  }
                  expandIconPosition="end"
                  className="custom-collapse"
                >
                  <Panel
                    header={
                      <Title level={5} className="m-0">
                        {t("Key Asset")}
                      </Title>
                    }
                    key="1"
                    className="shadow-d radius-12 bg-lightest-gray"
                  >
                    <PreviewTableContent
                      title={null}
                      columns={keyassetsColumn}
                      data={assetsData}
                    />
                  </Panel>
                </Collapse>
              </Card>
            )}
            {inventoryData?.length > 0 && (
              <Card className="shadow-d radius-12 border-gray bg-lightest-gray mb-3">
                <Collapse
                  defaultActiveKey={["1"]}
                  expandIcon={({ isActive }) =>
                    isActive ? <MinusOutlined /> : <PlusOutlined />
                  }
                  expandIconPosition="end"
                  className="custom-collapse"
                >
                  <Panel
                    header={
                      <Title level={5} className="m-0">
                        {t("Inventory")}
                      </Title>
                    }
                    key="1"
                    className="shadow-d radius-12 bg-lightest-gray"
                  >
                    <PreviewTableContent
                      title={null}
                      columns={inventColumn}
                      data={inventoryData}
                    />
                  </Panel>
                </Collapse>
              </Card>
            )}
          </Col>
          <Col
            lg={{ span: 6 }}
            md={{ span: 0 }}
            sm={{ span: 0 }}
            xs={{ span: 0 }}
          >
            <div className="sticky-comp">
              <BusinessInfoCard data={business} />
            </div>
          </Col>
        </Row>
        <BusinessInfoCardMobile data={business} />
      </div>

      <ExploreSimilarBusiness id={business?.id} />
    </div>
  );
};

export { SingleViewlisting };
