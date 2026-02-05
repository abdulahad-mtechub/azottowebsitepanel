import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Typography,
  Image,
} from "antd";
import {
  MySelect,
  ProductCard,
} from "../components";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import { useApolloClient } from "@apollo/client";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../hooks";

const { Text, Title } = Typography;

const VehicleListingPage = ({ getcategory }) => {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const rawCategoryParam = params.get("category");
  const categoryParam =
    rawCategoryParam && rawCategoryParam !== "undefined"
      ? rawCategoryParam
      : null;
  const [limit, setLimit] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [isShow, setIsShow] = useState(false);

  const apolloClient = useApolloClient();
  const [businesses, setBusinesses] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const lastQueryRef = useRef(null);
  const lastVarsRef = useRef(null);

  const runQuery = useCallback(
    async (queryDoc, variables) => {
      setIsLoading(true);
      lastQueryRef.current = queryDoc;
      lastVarsRef.current = variables;
      try {
        const res = await apolloClient.query({
          query: queryDoc,
          variables,
          fetchPolicy: "network-only",
        });
        setBusinesses(res.data);
      } finally {
        setIsLoading(false);
      }
    },
    [apolloClient]
  );

  const refetch = useCallback(async () => {
    if (!lastQueryRef.current) return;
    // Silent refetch: read from cache first (instant), then update from network in background
    try {
      const res = await apolloClient.query({
        query: lastQueryRef.current,
        variables: lastVarsRef.current,
        fetchPolicy: "cache-first",
      });
      setBusinesses(res.data);
      // Then silently fetch fresh data from network
      apolloClient
        .query({
          query: lastQueryRef.current,
          variables: lastVarsRef.current,
          fetchPolicy: "network-only",
        })
        .then((freshRes) => {
          setBusinesses(freshRes.data);
        })
        .catch((err) => {
          console.error("Background refetch failed:", err);
        });
    } catch (error) {
      console.error("Refetch failed:", error);
    }
  }, [apolloClient]);
  const options = [
    { id: 1, key: t("Low to High") },
    { id: 2, key: t("High to Low") },
  ];
  const [sortOrder, setSortOrder] = useState(null); // null by default

  const handleSearch = () => {
    // Reset to first page
    setCurrentPage(1);

  };

  return (
    <div className="padd-1 mb-3">
      <div className="bg-dark-blue bread-cs mb-3">
        <div className="container">
          <Breadcrumb
            separator={
              <Text className="text-gray">
                <RightOutlined className="fs-10" />
              </Text>
            }
            items={getBreadcrumbItems()}
          />
          <Flex vertical gap={30} className="w-100 search-cs">
            <Flex vertical gap={5} className="text-center">
              <Title level={2} className="text-white m-0">
                {t("Find the Right Business for You")}
              </Title>
            </Flex>
            <Card className="shadow-c rounded">
              <Row gutter={[24, 24]} align={"middle"}>
                <Col
                  lg={{ span: 12 }}
                  md={{ span: 12 }}
                  sm={{ span: 24 }}
                  xs={{ span: 24 }}
                >
                </Col>
                <Col
                  xl={{ span: 9 }}
                  lg={{ span: 8 }}
                  md={{ span: 12 }}
                  sm={{ span: 24 }}
                  xs={{ span: 24 }}
                >
                </Col>
                <Col
                  xl={{ span: 3 }}
                  lg={{ span: 4 }}
                  md={{ span: 24 }}
                  sm={{ span: 24 }}
                  xs={{ span: 24 }}
                >
                  <Button
                    aria-labelledby={t("Search")}
                    className="btn bg-brand fs-14 fw-400 w-100"
                    onClick={handleSearch}
                  >
                    <Image
                      src="/assets/icons/search-w.png"
                      preview={false}
                      width={16}
                      alt={t("search icon")}
                    />{" "}
                    {t("Search")}
                  </Button>
                </Col>
              </Row>
            </Card>
          </Flex>
        </div>
      </div>
      <div className="container">
        <Flex
          gap={10}
          justify="space-between"
          wrap
          align="center"
          className="mb-3"
        >
          <Flex gap={5} align="center">
            <Text className="text-gray fs-13">
              {t("Showing {{start}}–{{end}} of {{total}} Businesses", {
                start: (currentPage - 1) * limit + 1,
                end: Math.min(currentPage * limit, totalCount || 0),
                total: totalCount || 0,
              })}
            </Text>
            <MySelect
              withoutForm
              placeholder={t("Sort By")}
              options={options.map((opt) => ({ ...opt, name: t(opt.key) }))}
              className="select"
              value={sortOrder}
              allowClear
              onChange={(id) => {
                setSortOrder(
                  id === 1 ? "Low to High" : id === 2 ? "High to Low" : null
                );
              }}
              style={{ minWidth: 120 }}
            />
          </Flex>
        </Flex>
        <Flex gap={isShow ? 24 : 0} align="stretch" className="mb-4">
          <Motion.div
            key="product"
            animate={{ width: isShow ? "calc(100% - 250px)" : "100%" }}
            transition={{ duration: 0.4 }}
            style={{ minWidth: 0, position: "relative", width: "100%" }}
            className="mobile-100"
          >
            <div style={{ position: "relative", width: "100%" }}>
              <ProductCard
                exploreData={businessList?.map((biz) => ({
                  id: biz.id,
                  title: biz.businessTitle,
                }))}
                refetchBusinesses={refetch}
                totalCount={totalCount || 0}
                currentPage={currentPage}
                onPageChange={(page) => setCurrentPage(page)}
                limit={limit}
                onLimitChange={(value) => {
                  setLimit(value);
                  setCurrentPage(1);
                }}
                isLoading={isLoading}
              />
            </div>
          </Motion.div>
        </Flex>
      </div>
    </div>
  );
};

export { VehicleListingPage };
