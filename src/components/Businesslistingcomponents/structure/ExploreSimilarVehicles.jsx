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
import { Trans, useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { truncateChars } from "../../../utils";
import { useFormatNumber } from "../../../hooks";
import { clearQueryCache } from "../../../config";

const { Text, Title, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const ExploreSimilarVehicles = ({ id }) => {
  const { t } = useTranslation();

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
                    "Discover other verified vehicles with similar category tailored to your interests.",
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

export { ExploreSimilarVehicles };
