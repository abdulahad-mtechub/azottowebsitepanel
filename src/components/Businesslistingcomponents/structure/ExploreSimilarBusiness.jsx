import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Tag,
  Typography,
  Spin,
  message,
  Tooltip,
  Space,
  Grid,
} from "antd";
import { useLazyQuery, useMutation } from "@apollo/client";
import { GET_RANDOM_BUSINESSES } from "../../../graphql";
import { CREATE_SAVE_BUSINESS } from "../../../graphql/mutation/mutations";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { truncateChars } from "../../../utils";
import { useFormatNumber } from "../../../hooks";
import { isAuthenticated } from "../../../utils/tokenManager";
import { useEffect } from "react";

const { Text, Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const ExploreSimilarBusiness = ({ id }) => {
  const isArabic = localStorage.getItem("lang") === "ar";
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const screens = useBreakpoint();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);
  const userId = Cookies.get("userId");

  // Check if user is inactive
  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";
  const userIsLoggedIn = isAuthenticated();

  const [getRandomBusinesses, { data, loading, refetch }] = useLazyQuery(
    GET_RANDOM_BUSINESSES,
    {
      fetchPolicy: "network-only",
    }
  );
  useEffect(() => {
    if (id) {
      getRandomBusinesses({
        variables: {
          getRandomBusinessesId: id,
          ...(userIsLoggedIn && userId ? { userId } : {}),
        },
      });
    }
  }, [id, userIsLoggedIn, userId, getRandomBusinesses]);

  const randomBusiness = data?.getRandomBusinesses;

  const saveBusinessHandler = async (businessId, currentSaveState, e) => {
    e.stopPropagation();

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

    // Check if user account is inactive
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
      refetch();
    } catch (err) {
      console.error("Save mutation error:", err);
      messageApi.error(t("Failed to update favorites: ") + err.message);
    }
  };

  const mappedBusinesses = randomBusiness?.map((b) => ({
    ...b,
    child: [
      {
        id: 1,
        icon: "/assets/icons/year-p.png",
        subtitle: (
          <>
            <img
              src="/assets/icons/reyal-b.png"
              width={10}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />{" "}
            {formatNumber(b?.revenue) || "0"}
          </>
        ),
        subdesc: t("Revenue/month"),
      },
      {
        id: 2,
        icon: "/assets/icons/revenue.png",
        subtitle: (
          <>
            <img
              src="/assets/icons/reyal-b.png"
              width={10}
              alt={t("currency-symbol")}
              fetchPriority="high"
            />{" "}
            {formatNumber(b?.profit) || "0"}
          </>
        ),
        subdesc: t("Profit/month"),
      },
      {
        id: 3,
        icon: "/assets/icons/team.png",
        subtitle: (
          <>
            {b?.capitalRecovery >= 12
              ? `${formatNumber(b.capitalRecovery / 12)} ${t("years")}`
              : `${formatNumber(b.capitalRecovery)} ${t("months")}`}
          </>
        ),
        subdesc: t("Capital Recovery"),
      },
    ],
  }));

  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  // Responsive layout variables
  const buttonGroupGap = screens.xs ? 4 : 12;
  const buttonGroupFlexDirection = screens.xs ? "vertical" : "horizontal";
  const shouldMainFlexWrap = screens.xs || screens.sm || screens.md;
  const mainFlexGap = screens.xs ? 8 : screens.sm || screens.md ? 12 : 0;

  return (
    <>
      {contextHolder}
      <div className="feature bg-light-brand">
        <div className="container">
          <Row gutter={[24, 60]}>
            <Col span={24}>
              <Flex
                vertical
                justify="center"
                align="center"
                gap={15}
                className="mx-width"
              >
                <div className="tag fw-500 bg-secondary fw-500 text-brand">
                  {t("You May Also Like")}
                </div>
                <Title className="m-0" level={2}>
                  <Trans i18nKey="exploreSimilar">
                    Explore Similar{" "}
                    <span className="text-brand">Businesses</span>
                  </Trans>
                </Title>
                <Text className="fs-14">
                  {t(
                    "Discover other verified businesses with similar category tailored to your interests."
                  )}
                </Text>
              </Flex>
            </Col>
            <Col span={24}>
              <Row gutter={[16, 16]}>
                {mappedBusinesses?.slice(0, 3)?.map((pro, i) => (
                  <Col
                    xl={{ span: 8 }}
                    lg={{ span: 8 }}
                    md={{ span: 12 }}
                    sm={{ span: 24 }}
                    xs={{ span: 24 }}
                    key={i}
                  >
                    <Card
                      className="h-100 border-gray rounded-12 bg-lightest-gray card-cs cursor"
                      onClick={() => navigate(`/singleviewlisting/${pro?.id}`)}
                    >
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
                              aria-labelledby={t(pro?.category?.name)}
                            >
                              {truncateChars(
                                isArabic
                                  ? pro?.category?.arabicName
                                  : pro?.category?.name,
                                14
                              )}
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
                                  {pro.isByTakbeer
                                    ? t("Taqbeel")
                                    : t("Acquiring")}
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
                              aria-labelledby={t("Bookmark-btn")}
                              className="border-0 bg-transparent p-0"
                              onClick={(e) =>
                                saveBusinessHandler(pro?.id, pro?.isSaved, e)
                              }
                              disabled={isUserInactive}
                              style={{
                                opacity: isUserInactive ? 0.5 : 1,
                                cursor: isUserInactive
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              {pro?.isSaved ? (
                                <img
                                  src="/assets/icons/bk-bl-d.webp"
                                  alt={t("bookmarked-image")}
                                  width={22}
                                />
                              ) : (
                                <img
                                  src="/assets/icons/bk-bl.png"
                                  alt={t("un-bookmarked-image")}
                                  width={22}
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
                            />
                          </div>
                          <Title level={5}>{pro?.businessTitle}</Title>
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
                                <Title
                                  level={5}
                                  className="text-brand m-0 fs-13"
                                >
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
                              {formatNumber(pro?.price)}
                            </Title>
                          </Flex>
                        </div>
                      </Flex>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export { ExploreSimilarBusiness };
