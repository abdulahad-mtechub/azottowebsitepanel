import { useEffect, useMemo, useState } from "react";
import { Col, Collapse, Row, Typography, Flex, Card } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { GETFAQ } from "../../../graphql/query/queries";
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { LoadingCard } from "../../ui";

const { Text, Title } = Typography;

const FaqsComponent = () => {
  const { t, i18n } = useTranslation();
  const [currentPanel, setCurrentPanel] = useState([]);
  const [isArabic, setIsArabic] = useState(() => {
    const stored = (localStorage.getItem("lang") || "").toLowerCase();
    return i18n?.language === "ar" || stored === "ar";
  });

  const [loadData, { data, loading }] = useLazyQuery(GETFAQ, {
    variables: { search: "" },
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    const langFromStorage = () =>
      (localStorage.getItem("lang") || "").toLowerCase();
    const update = () => {
      setIsArabic(i18n?.language === "ar" || langFromStorage() === "ar");
      setCurrentPanel([]);
    };
    update();
    const onStorage = (e) => {
      if (e.key === "lang") update();
    };
    window.addEventListener("storage", onStorage);
    if (i18n && i18n.on) {
      i18n.on("languageChanged", update);
    }
    return () => {
      window.removeEventListener("storage", onStorage);
      if (i18n && i18n.off) {
        i18n.off("languageChanged", update);
      }
    };
  }, [i18n]);

  const filteredFaqs = useMemo(() => {
    const faqs = data?.getFAQs?.faqs || [];
    return faqs
      .filter((item) => Boolean(item.isArabic) === Boolean(isArabic))
      .map((item) => ({
        id: item.id,
        title: isArabic
          ? item.arabicQuestion || item.question
          : item.question || item.arabicQuestion,
        description: isArabic
          ? item.arabicAnswer || item.answer
          : item.answer || item.arabicAnswer,
      }));
  }, [data, isArabic]);

  return (
    <div className="feature" dir={isArabic ? "rtl" : "ltr"}>
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
                {t("FAQs")}
              </div>
              <Title className="m-0" level={2}>
                {t("Everything You Need to")}{" "}
                <span className="text-brand">{t("Know About Jusoor")}</span>
              </Title>
              <Text className="fs-14">
                {t(
                  "Learn how Jusoor works, how we verify businesses, and what to expect during the buying or selling process."
                )}
              </Text>
            </Flex>
          </Col>
          <Col
            lg={{ span: 20 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            {loading || filteredFaqs.length === 0 ? (
              <Card className="rounded-12 border-gray bg-lightest-gray">
                <LoadingCard
                  loading={loading}
                  isEmpty={!loading && filteredFaqs.length === 0}
                  emptyText={
                    isArabic
                      ? "لا توجد أسئلة متاحة حالياً"
                      : "No FAQs available right now."
                  }
                  height={200}
                  minHeight={200}
                  className="text-gray"
                />
              </Card>
            ) : (
              <Collapse
                className="collapse-fq"
                activeKey={currentPanel}
                onChange={(keys) =>
                  setCurrentPanel(Array.isArray(keys) ? keys : [String(keys)])
                }
                ghost
              >
                {filteredFaqs.map((faq, index) => {
                  const key = String(index);
                  const isOpen = currentPanel.includes(key);
                  return (
                    <Collapse.Panel
                      header={
                        <Title
                          level={3}
                          className={`m-0 fw-500 fs-17 ${
                            isOpen ? "text-brand" : "text-gray"
                          }`}
                        >
                          <span className="mr-15">
                            {isArabic
                              ? `${index + 1}.`
                              : `${index + 1 < 10 ? "0" : ""}${index + 1}`}
                          </span>
                          {faq.title}
                        </Title>
                      }
                      key={key}
                      extra={
                        isOpen ? (
                          <MinusOutlined className="fs-18" />
                        ) : (
                          <PlusOutlined className="fs-18" />
                        )
                      }
                      className={isOpen ? "panel-active panel" : "panel"}
                    >
                      <Text className="fs-16">{faq.description}</Text>
                    </Collapse.Panel>
                  );
                })}
              </Collapse>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { FaqsComponent };
