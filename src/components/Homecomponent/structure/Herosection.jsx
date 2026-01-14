import { Row, Col, Typography, Flex, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Trans, useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const Herosection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userId = Cookies.get("userId");

  return (
    <section className="hero">
      <Row gutter={[16, 16]} justify={"space-between"}>
        <Col
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
        >
          <div className="container">
            <Flex vertical gap={10} className="div center-mbl">
              <div className="tag">
                {t("Trusted Marketplace for Saudi Businesses")}
              </div>
              <Title className="m-0 text-white mbl-font" level={1}>
                <Trans i18nKey="buyOrSellHeading">
                  Buy or Sell a Verified Business with
                  <span className="text-brand">Confidence</span>
                </Trans>
              </Title>
              <Text className="text-light-gray my-2">
                {t(
                  "Explore real, revenue-generating businesses across Saudi Arabia. Whether you're an investor or an owner, Jusoor makes the process safe, simple, and secure."
                )}
              </Text>
              <Flex gap={10} className="mt-2 center-mbl">
                <Button
                  aria-labelledby="Explore Businesses"
                  className="btn bg-brand"
                  onClick={() => navigate("/businesslisting")}
                >
                  {t("Explore Businesses")}
                </Button>
                <Button
                  aria-labelledby="Sell Your Business"
                  className="btn bg-white text-dark"
                  onClick={() =>
                    navigate(userId ? "/sellbusinesscreate" : "/login")
                  }
                >
                  {t("Sell Your Business")}
                  {i18n.language === "ar" ? (
                    <LeftOutlined className="fs-10" />
                  ) : (
                    <RightOutlined className="fs-10" />
                  )}
                </Button>
              </Flex>
            </Flex>
          </div>
        </Col>

        <Col
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 10 }}
          xl={{ span: 10 }}
        >
          <div className="heroimginner">
            <picture>
              {/* 1. Mobile Version: Shown when screen is less than 768px */}
              <source
                media="(max-width: 996px)"
                srcSet={`assets/images/${
                  i18n.language === "ar"
                    ? "banner-web-ar.png"
                    : "homebanner.webp"
                }`}
              />
              <img
                src={`assets/images/${
                  i18n.language === "ar"
                    ? "banner-web-ar.png"
                    : "banner-web.webp"
                }`}
                alt={t("Hero Banner")}
                className="hero-img" // Use one class for both; handle sizing in CSS
                fetchPriority="high"
                loading="eager"
                decoding="async"
              />
            </picture>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export { Herosection };
