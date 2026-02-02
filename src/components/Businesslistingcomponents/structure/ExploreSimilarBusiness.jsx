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
import { clearQueryCache } from "../../../config";

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
                  <Trans
                    i18nKey="exploreSimilar"
                    components={{ 1: <span className="text-brand" /> }}
                  />
                </Title>
                <Text className="fs-14">
                  {t(
                    "Discover other verified businesses with similar category tailored to your interests.",
                  )}
                </Text>
              </Flex>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export { ExploreSimilarBusiness };
