import { Row, Col, Typography, Flex, Button } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Trans, useTranslation } from "react-i18next";
import { useWalletAuth } from "../../../web3/hooks/useWalletAuth";

const { Title, Text } = Typography;

const Herosection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const userId = Cookies.get("userId");
  const {
    isConnected,
    isSigningInProgress,
    isSignPending,
    isMobile,
    connectors,
    logedIn,
    connect,
    handleWalletConnect,
    handleWalletDisconnect
  } = useWalletAuth();
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
                {"Trusted Vehicle Marketplace Powered by Blockchain"}
              </div>
              <Title className="m-0 text-white mbl-font" level={1}>
                <Trans i18nKey="buyOrSellHeading">
                Buy, Sell & Verify Vehicles with Absolute
                  <span className="text-brand">Confidence</span>
                </Trans>
              </Title>
              <Text className="text-light-gray my-2">
                {
                  "Explore verified vehicles with tamper-proof history records on Azotto. Whether you’re a buyer, seller, or dealer, Azotto ensures transparency, security, and trust through blockchain-backed verification."
                }
              </Text>
              <Flex gap={10} className="mt-2 center-mbl">
                <Button
                  aria-labelledby="Explore Vehicles"
                  className="btn bg-brand"
                  onClick={() => navigate("/businesslisting")}
                >
                  {t("Explore Vehicles")}
                </Button>
                <Button
                  aria-labelledby="Sell Your Vehicles"
                  className="btn bg-white text-dark"
                  onClick={() =>
                    navigate(userId ? "/sellvincreate" : "/login")
                  }
                >
                  {"Sell Your Vehicles"}
                  {i18n.language === "ar" ? (
                    <LeftOutlined className="fs-10" />
                  ) : (
                    <RightOutlined className="fs-10" />
                  )}
                </Button>
              </Flex>

              {!isConnected ?  <Flex gap={10} className="mt-2 center-mbl">
                <Button
                  aria-labelledby="Connect MetaMask"
                  className="btn bg-brand"
                  onClick={() => handleWalletConnect( connectors[0] )}
                >
                  {t("Connect MetaMask")}
                </Button>
                <Button
                  aria-labelledby="Connect Trust Wallet"
                  className="btn bg-white text-dark"
                  onClick={() => handleWalletConnect( connectors[1] )}
                >
                  {"Connect Trust Wallet"}
                  
                </Button>
              </Flex>:
                <Flex gap={10} className="mt-2 center-mbl">
                 
                  <Button
                    aria-labelledby="Connect Trust Wallet"
                    className="btn bg-white text-dark"
                    onClick={() => handleWalletDisconnect()}
                  >
                    {"Disconnect"}

                  </Button>
                </Flex>
              }
            </Flex>
          </div>
        </Col>

        <Col
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 10 }}
        >
          <div className="heroimginner">
            <picture>
              <source
                media="(max-width: 996px)"
                srcSet={`/assets/images/${
                  i18n.language === "ar"
                    ? "banner-web-ar.png"
                    : "homebanner.webp"
                }`}
              />
              <img
                src="/assets/images/banner.png"
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
