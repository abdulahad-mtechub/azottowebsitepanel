import { useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Image,
  Row,
  Typography,
  message,
  Space,
  Tooltip,
  Grid,
} from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { GETRANDOMBUSINESS } from "../../../graphql/query/business";
import { CREATE_SAVE_BUSINESS } from "../../../graphql/mutation/mutations";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { truncateChars } from "../../../utils";
import Cookies from "js-cookie";
import { useFormatNumber } from "../../../hooks";
import { isAuthenticated } from "../../../utils/tokenManager";
import { LoadingCard } from "../../ui";
import { clearQueryCache } from "../../../config";

const { Text, Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const ExploreLive = () => {
  const { formatNumber } = useFormatNumber();
  const navigate = useNavigate();
  const screens = useBreakpoint();
  const { t, i18n } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);
  const userId = Cookies.get("userId");
  const isArabic =
    (localStorage.getItem("lang") || "en").toLowerCase() === "ar";

  const userStatus = Cookies.get("userStatus");
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";

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

    if (isUserInactive) {
      messageApi.warning(
        t("Your account is inactive. Please contact support."),
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
        clearQueryCache("getFavoritBusiness");
        messageApi.success(t("Business removed from favorites successfully"));
      } else {
        clearQueryCache("getFavoritBusiness");
        messageApi.success(t("Business added to favorites successfully"));
      }
      refetch();
    } catch (err) {
      console.error("Save mutation error:", err);
      messageApi.error(t("Failed to update favorites: ") + err.message);
    }
  };

  // Responsive layout variables
  const buttonGroupGap = screens.xs ? 4 : 12;
  const buttonGroupFlexDirection = screens.xs ? "vertical" : "horizontal";
  const shouldMainFlexWrap = screens.md;
  const mainFlexGap = screens.xs ? 8 : screens.sm || screens.md ? 12 : 0;

  return (
    <>
      {contextHolder}
      <div className="feature bg-light-brand">
        <div className="container">
          <Row gutter={[12, 24]}>
            <Col span={24}>
              <Flex
                vertical
                justify="center"
                align="center"
                gap={15}
                className="mx-width"
              >
                <div className="tag fw-500 bg-secondary fw-500 text-brand">
                  {t("Explore Live Listings")}
                </div>
                <Title className="m-0" level={2}>
                  {t("Businesses Currently")}{" "}
                  <span className="text-brand">{t("Available for Sale")}</span>
                </Title>
                <Text className="fs-14 d-inline">
                  {t(
                    "Discover a curated selection of verified businesses across various categories and cities in Saudi Arabia. Use filters to narrow down by industry, location, price, and more.",
                  )}
                </Text>
              </Flex>
            </Col>
            <Col span={24}>
              <Flex justify="center">
                <Button
                  onClick={() => navigate("/businesslisting")}
                  className="btn bg-brand"
                  aria-labelledby="Browse Vehicles"
                >
                  {t("Browse Vehicles")}
                  {i18n.language === "ar" ? (
                    <LeftOutlined className="fs-10" />
                  ) : (
                    <RightOutlined className="fs-10" />
                  )}
                </Button>
              </Flex>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export { ExploreLive };
