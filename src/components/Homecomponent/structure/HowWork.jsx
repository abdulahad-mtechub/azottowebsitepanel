import { useState, useMemo } from "react";
import { Col, Flex, Row, Typography } from "antd";
import { Segmented } from "antd";
import { Sellerwork } from "./Sellerwork";
import { Trans, useTranslation } from "react-i18next";

const { Title } = Typography;

const HowWork = () => {
  const { t, i18n } = useTranslation();
  const KEYS = { SELLER: "Seller", BUYER: "Buyer" };

  const labelToKey = useMemo(
    () => ({
      [t("Seller")]: KEYS.SELLER,
      [t("Buyer")]: KEYS.BUYER,
      [KEYS.SELLER]: KEYS.SELLER,
      [KEYS.BUYER]: KEYS.BUYER,
    }),
    [t, i18n.language]
  );

  const [activeTab, setActiveTab] = useState(KEYS.SELLER);

  const segmentedOptions = [
    { label: t("Seller"), value: KEYS.SELLER },
    { label: t("Buyer"), value: KEYS.BUYER },
  ];

  const handleSegmentChange = (val) => {
    const normalized = labelToKey[val] || KEYS.SELLER;
    setActiveTab(normalized);
  };

  return (
    <div className="feature bg-light-brand">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Flex
              vertical
              justify="center"
              align="center"
              gap={15}
              className="max-width"
            >
              <div className="tag bg-secondary fw-500 text-brand">
                {t("How AzottoWorks?")}
              </div>

              <Title className="m-0" level={2}>
                <Trans
                  i18nKey="A simple Way To Buy Or Sell"
                  components={{ 1: <span className="text-brand" /> }}
                />
              </Title>
            </Flex>
          </Col>

          <Col span={24}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Segmented
                className="custom-segment"
                options={segmentedOptions}
                value={activeTab}
                onChange={handleSegmentChange}
                aria-label="Content filter"
              />
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { HowWork };
