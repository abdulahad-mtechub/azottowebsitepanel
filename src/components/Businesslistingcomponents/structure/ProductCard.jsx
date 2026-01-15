import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Typography,
  Spin,
  Tooltip,
  Space,
  Grid,
} from "antd";
import { useNavigate, Link } from "react-router-dom";
import { CREATE_SAVE_BUSINESS } from "../../../graphql";
import { useMutation } from "@apollo/client";
import { message } from "antd";
import { useTranslation } from "react-i18next";
import { truncateChars } from "../../../utils";
import Cookies from "js-cookie";
import { useFormatNumber } from "../../../hooks";

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const ProductCard = ({
  exploreData,
  refetchBusinesses,
  totalCount,
  currentPage,
  onPageChange,
  limit,
  onLimitChange,
  isLoading,
}) => {
  const screens = useBreakpoint();
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const userId = Cookies.get("userId");

  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";

  const saveBusinessHandler = async (businessId, currentSaveState) => {
    if (!userId) {
      messageApi.info({
        content: (
          <span>
            {t("Please")}{" "}
            <a
              onClick={() => navigate("/login")}
              style={{
                color: "#1677ff",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              {t("login")}
            </a>{" "}
            {t("to continue")}.
          </span>
        ),
      });
      return;
    }

    if (isUserInactive) {
      messageApi.warning(
        t("Your account is inactive. Please contact support.")
      );
      return;
    }

    try {
      await saveBusiness({
        variables: {
          saveBusinessId: businessId,
        },
      });
      if (currentSaveState) {
        messageApi.success(t("Business removed from favorites successfully"));
      } else {
        messageApi.success(t("Business added to favorites successfully"));
      }
      refetchBusinesses();
    } catch (err) {
      console.error("Save mutation error:", err);
      messageApi.error(t("Failed to update favorites: ") + err.message);
    }
  };
  if (isLoading) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ width: "100%", height: "50vh" }}
      >
        <Spin size="large" />
      </Flex>
    );
  }

  if (!exploreData || exploreData.length === 0) {
    return (
      <Flex
        vertical
        justify="center"
        align="center"
        style={{ width: "100%", minHeight: "400px", padding: "40px 0" }}
      >
        <img
          src="/assets/icons/info-outline.png"
          alt={t("no-data")}
          width={45}
          style={{ opacity: 0.5, marginBottom: "16px" }}
        />
        <Title level={4} className="text-gray m-0">
          {t("No Data Found")}
        </Title>
        <Text className="text-gray fs-14">
          {t(
            "No businesses match your search criteria. Try adjusting your filters."
          )}
        </Text>
      </Flex>
    );
  }

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 16]}>
        {exploreData?.map((pro, i) => {
          // Responsive layout variables
          const buttonGroupGap = screens.xs ? 4 : 12;
          const buttonGroupFlexDirection = screens.xs
            ? "vertical"
            : "horizontal";
          const shouldMainFlexWrap = screens.xs || screens.sm || screens.md;
          const mainFlexGap = screens.xs
            ? 8
            : screens.sm || screens.md
            ? 12
            : 0;

          return (
            <Col
              lg={{ span: 8 }}
              md={{ span: 12 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
              key={i}
            >
              <Link
                to={`/singleviewlisting/${pro.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                  height: "100%",
                }}
              >
                <Card className="h-100 border-gray rounded-12 card-cs cursor bg-lightest-gray">
                  <Flex vertical gap={20}>
                    <Flex
                      justify="space-between"
                      align={screens.xs ? "flex-start" : "center"}
                      wrap={shouldMainFlexWrap ? "wrap" : "nowrap"}
                      gap={mainFlexGap}
                    >
                      <Flex
                        gap={buttonGroupGap}
                        align="center"
                        direction={buttonGroupFlexDirection}
                      >
                        <Button
                          className="fs-13"
                          aria-labelledby={t(pro?.categoryName)}
                        >
                          {truncateChars(pro?.categoryName, 14)}
                        </Button>
                        <Button
                          aria-labelledby="type"
                          className={`${
                            pro.isByTakbeer ? "bg-brand" : "bg-black"
                          }`}
                        >
                          <Space
                            align="center"
                            justify="center"
                            size={4}
                            wrap={false}
                          >
                            <Text className="fs-12 text-white">
                              {pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
                            </Text>
                            <Tooltip
                              title={
                                pro.isByTakbeer
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
                                alt="takbeel-icon"
                                fetchPriority="high"
                                className="center"
                              />
                            </Tooltip>
                          </Space>
                        </Button>
                      </Flex>
                      {userId && (
                        <Button
                          aria-labelledby="bookmarked-btn"
                          className="border-0 bg-transparent p-0"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            saveBusinessHandler(pro?.id, pro?.isSaved);
                          }}
                          disabled={isUserInactive}
                          style={{
                            opacity: isUserInactive ? 0.5 : 1,
                            cursor: isUserInactive ? "not-allowed" : "pointer",
                          }}
                        >
                          {pro?.isSaved ? (
                            <img
                              src="/assets/icons/bk-bl-d.webp"
                              alt={t("bookmarked-image")}
                              width={22}
                              fetchPriority="high"
                            />
                          ) : (
                            <img
                              src="/assets/icons/bk-bl.png"
                              alt={t("un-bookmarked-image")}
                              width={22}
                              fetchPriority="high"
                            />
                          )}
                        </Button>
                      )}
                    </Flex>
                    <div>
                      <div className="w-full card-img mb-2 rounded-12">
                        <img
                          src="/assets/images/card-1.webp"
                          width={"100%"}
                          height={"100%"}
                          alt={t("product-image")}
                          fetchPriority="high"
                        />
                      </div>
                      <Title strong className="fs-16">
                        {pro?.title}
                      </Title>
                      <div className="h-80">
                        <Paragraph
                          ellipsis={{
                            rows: 3,
                            expandable: false,
                            symbol: "more",
                          }}
                          className="fs-14 text-gray"
                        >
                          {pro?.description}
                        </Paragraph>
                      </div>
                      <Divider className="my-1" />
                      <Space
                        split={
                          <Divider type="vertical" className="m-0 h-auto" />
                        }
                        align="center"
                        style={{
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        {pro?.child?.map((item, c) => (
                          <Flex
                            vertical
                            align="center"
                            justify="center"
                            key={c}
                          >
                            <Title level={5} className="text-brand m-0 fs-13">
                              {item?.subtitle}
                            </Title>
                            <Text className="text-gray fs-12">
                              {item?.subdesc}
                            </Text>
                          </Flex>
                        ))}
                      </Space>
                      <Divider className="my-1" />
                      <Flex gap={3} align="center">
                        <Image
                          src="/assets/icons/reyal.webp"
                          alt={t("currency-symbol")}
                          preview={false}
                          width={20}
                        />
                        <Title level={4} className="m-0">
                          {pro?.amount}
                        </Title>
                      </Flex>
                    </div>
                  </Flex>
                </Card>
              </Link>
            </Col>
          );
        })}
        {exploreData?.length > 0 && totalCount > 12 && (
          <Col span={24} className="mt-3">
            <Row justify="space-between" align="middle">
              <Col span={6}>
                <Flex gap={5} align="center">
                  <Text>{t("Rows Per Page:")}</Text>
                  <Select
                    className="select-filter"
                    value={limit}
                    onChange={onLimitChange}
                    options={[
                      { value: 12, label: formatNumber(12) },
                      { value: 24, label: formatNumber(24) },
                      { value: 36, label: formatNumber(36) },
                      { value: 48, label: formatNumber(48) },
                      { value: 60, label: formatNumber(60) },
                    ]}
                  />
                </Flex>
              </Col>
              <Col span={6}>
                <Flex justify="end">
                  <Pagination
                    className="pagination"
                    current={currentPage}
                    total={totalCount}
                    pageSize={limit}
                    onChange={onPageChange}
                    showSizeChanger={false}
                    itemRender={(page, type, originalElement) => {
                      if (type === "page") {
                        return <a>{formatNumber(page)}</a>;
                      }
                      return originalElement;
                    }}
                  />
                </Flex>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </>
  );
};

export { ProductCard };
