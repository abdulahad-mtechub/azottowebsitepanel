import { Col, Flex, Row, Typography, Spin } from "antd";
import { ArtticleCards } from "./ArtticleCards";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
import { GETARTICLES } from "../../../graphql/query";

const { Text, Title } = Typography;
const SuggestedArticles = ({ excludeId }) => {
  const { t, i18n } = useTranslation();
  const { data: articlesData, loading } = useQuery(GETARTICLES, {
    variables: { search: null },
  });

  const lang = localStorage.getItem("lang") || i18n.language || "en";
  const isArabic = lang.toLowerCase() === "ar";

  // Filter out the current article, filter by language, format data, and limit to 3
  const data =
    articlesData?.getArticles?.articles
      ?.filter(
        (article) => article.id !== excludeId && article.isArabic === isArabic
      )
      ?.map((item) => ({
        id: item.id,
        img: item.image,
        title: isArabic ? item?.arabicTitle : item?.title,
        desc: isArabic ? item?.arabicBody : item?.body,
        date: item.createdAt,
      }))
      ?.slice(0, 3) || [];

  return (
    <div className="feature bg-light-brand">
      <div className="container">
        <Row gutter={[24, 64]} align={"middle"}>
          <Col span={24}>
            <Flex
              vertical
              justify="center"
              align="center"
              gap={15}
              className="mx-width"
            >
              <div className="tag bg-secondary fw-500 text-brand">
                {t("Helpful Reads")}
              </div>
              <Title className="m-0" level={2}>
                {t("Suggested")}{" "}
                <span className="text-brand">{t("Articles")}</span>
              </Title>
              <Text className="fs-14">
                {t(
                  "Discover tips, trends, and guides to support your business journey."
                )}
              </Text>
            </Flex>
          </Col>
          <Col span={24}>
            {loading ? (
              <Flex justify="center" align="center" className="h-200">
                <Spin size="large" />
              </Flex>
            ) : (
              <ArtticleCards data={data} />
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { SuggestedArticles };
