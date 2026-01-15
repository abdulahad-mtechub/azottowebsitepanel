import { Breadcrumb, Card, Col, Flex, Row, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { GETTERMS } from "../graphql/query/queries";
import { useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

const { Paragraph, Text, Title } = Typography;

const Termofuse = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GETTERMS);

  const lang = localStorage.getItem("lang") || "en";
  const isArabic = lang === "ar";

  const terms = data?.getTerms[0];
  const termContent = isArabic ? terms?.arabicTerm : terms?.term;

  return (
    <div className="padd-1">
      <div className="bg-dark-blue bread-cs mb-3">
        <div className="container">
          <Breadcrumb
            separator={
              <Text className="text-gray">
                <RightOutlined className="fs-10" />
              </Text>
            }
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
                  <Text className="fw-500 text-white">{t("Terms of use")}</Text>
                ),
              },
            ]}
          />
          <Flex vertical gap={15} className="w-100 search-cs text-center">
            <Title level={2} className="text-white m-0">
              {t("Terms of use")}
            </Title>
            <Text className="text-light-gray fs-16">
              {t(
                "Understand the rules that govern how you use Jusoor — your access, rights, and responsibilities on our platform."
              )}
            </Text>
          </Flex>
        </div>
      </div>

      <div className="feature">
        <div className="container">
          <Row gutter={[24, 64]} justify={"center"}>
            <Col span={24}>
              <Flex
                vertical
                justify="center"
                align="center"
                gap={15}
                className="mx-width"
              >
                <div className="tag bg-secondary fw-500 text-brand">
                  {t("Terms of use")}
                </div>
                <Title className="m-0" level={2}>
                  <Trans i18nKey="understandRulesHeading">
                    Understand the Rules Before You{" "}
                    <span className="text-brand">List or Buy a Business</span>
                  </Trans>
                </Title>
                <Text className="fs-14">
                  {t(
                    "Understand the key legal terms for using Jusoor including listings, confidentiality, commissions, and data protection."
                  )}
                </Text>
              </Flex>
            </Col>

            <Col
              lg={{ span: 22 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Card
                className="bg-light-white border-gray"
                style={{ minHeight: 300 }}
              >
                {loading ? (
                  <Flex
                    justify="center"
                    align="center"
                    style={{ minHeight: 300 }}
                  >
                    <Spin size="large" />
                  </Flex>
                ) : (
                  <Flex vertical gap={20}>
                    <div>
                      <Paragraph className="fs-14 text-gray">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: termContent,
                          }}
                        />
                      </Paragraph>
                    </div>
                  </Flex>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};

export { Termofuse };
