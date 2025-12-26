import { Breadcrumb, Col, Flex, Row, Typography, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { ArtticleCards, SearchInput, MySelect } from "../components";
import { useState, useCallback, useEffect } from "react";
import { RightOutlined } from "@ant-design/icons";
import { GETARTICLES } from "../graphql/query/queries";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const Article = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectfilter, setSelectFilter] = useState(t("Sorting"));
  const [searchQuery, setSearchQuery] = useState("");
  const [current, setCurrent] = useState(1);

  const lang = localStorage.getItem("lang") || i18n.language || "en";
  const isArabic = lang.toLowerCase() === "ar";

  const [fetchArticles, { data, loading }] = useLazyQuery(GETARTICLES, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    fetchArticles({
      variables: { search: searchQuery },
    });
  }, [searchQuery, fetchArticles]);

  // Filter articles based on language and map to required format
  const articleData =
    data?.getArticles?.articles
      ?.filter((article) => article.isArabic === isArabic)
      ?.map((item) => ({
        id: item.id,
        img: item.image,
        title: isArabic ? item?.arabicTitle : item?.title,
        desc: isArabic ? item?.arabicBody : item?.body,
        date: item.createdAt,
      })) || [];
  const total = data?.getArticles?.totalCount || 0;

  const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
    setSearchQuery(debouncedSearchValue);
    setCurrent(1); // reset pagination
  }, []);

  return (
    <>
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
                    <Text className="fw-500 text-white">{t("Articles")}</Text>
                  ),
                },
              ]}
            />
            <Flex vertical gap={15} className="w-100 search-cs text-center">
              <Title level={2} className="text-white m-0">
                {t("Articles")}
              </Title>
              <Text className="text-light-gray fs-16">
                {t(
                  "Explore content that helps you make well-informed decisions when buying or selling."
                )}
              </Text>
            </Flex>
          </div>
        </div>
        <div className="feature">
          <div className="container">
            <Row gutter={[24, 12]} justify={"center"}>
              <Col span={24} className="mb-3">
                <Flex vertical justify="center" align="center" gap={15}>
                  <div className="tag bg-secondary fw-500 text-brand">
                    {t("Articles")}
                  </div>
                  <Title className="m-0" level={2}>
                    {t("Tips to Help You Make the Right Choice")}
                  </Title>
                  <Text className="fs-14">
                    {t(
                      "We share educational and market-driven articles to help you understand the landscape and evaluate opportunities clearly."
                    )}
                  </Text>
                </Flex>
              </Col>
              <Col
                lg={{ span: 6 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <SearchInput
                  withoutForm={true}
                  placeholder={t("Search")}
                  onDebouncedChange={handleDebouncedSearch}
                  debounceDelay={500}
                />
              </Col>
              <Col
                lg={{ span: 18 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <Flex justify="end" gap={10} align="center">
                  <Text className="text-gray fs-14">
                    {t("Showing 1–10 of 47 Articles")}
                  </Text>
                  <MySelect
                    withoutForm
                    showSearch
                    placeholder={t("Sorting")}
                    options={[
                      { id: 1, name: t("Low to High") },
                      { id: 2, name: t("High to Low") },
                    ]}
                    className="select"
                    value={selectfilter}
                    onChange={(value) => setSelectFilter(value)}
                  />
                </Flex>
              </Col>
              <Col span={24}>
                <ArtticleCards data={articleData} loadmore={loading} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export { Article };
