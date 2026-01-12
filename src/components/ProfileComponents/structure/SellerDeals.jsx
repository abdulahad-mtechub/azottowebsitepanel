import { Card, Flex, Spin, Row, Col } from "antd";
import { ModuleTopHeading } from "../../Pagecomponents";
import { MySelect, SearchInput } from "../../Forms";
import { lazy, Suspense, useMemo, useState, useCallback } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { SellerSingleCompleteDeal } from "./SellerSingleCompleteDeal";
import { useTranslation } from "react-i18next";

const SellerInProgressDeals = lazy(() =>
  import("./SellerInProgressDeals").then((module) => ({
    default: module.SellerInProgressDeals,
  }))
);
const SellerSingleInProgressDeals = lazy(() =>
  import("./SellerSingleInProgressDeal").then((module) => ({
    default: module.SellerSingleInProgressDeals,
  }))
);
const SellerCompleteDeal = lazy(() =>
  import("./SellerCompleteDeal").then((module) => ({
    default: module.SellerCompleteDeal,
  }))
);

const SellerDeals = () => {
  const { t } = useTranslation();
  const [inprogressdeal, setInprogressDeal] = useState();
  const [completedeal, setCompleteDeal] = useState();
  const [activeKey, setActiveKey] = useState("1");
  const [searchValue, setSearchValue] = useState("");

  const items = useMemo(
    () => [
      {
        key: "1",
        label: t("In-Progress Deals"),
        component: SellerInProgressDeals,
      },
      {
        key: "2",
        label: t("Completed Deals"),
        component: SellerCompleteDeal,
      },
    ],
    [t]
  );

  const selectOptions = useMemo(
    () =>
      items.map((item) => ({
        id: item.key,
        name: item.label,
      })),
    [items]
  );

  const renderContent = useCallback(() => {
    const selectedItem = items.find((item) => item.key === activeKey);
    if (!selectedItem) return null;

    const Component = selectedItem.component;
    return (
      <Component
        setInprogressDeal={setInprogressDeal}
        setCompleteDeal={setCompleteDeal}
        completedeal={completedeal}
        searchValue={searchValue}
      />
    );
  }, [activeKey, searchValue, items, completedeal]);

  const handleTabChange = useCallback((value) => {
    setActiveKey(value);
    setSearchValue("");
  }, []);

  const handleSearchChange = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
  }, []);

  if (inprogressdeal && !completedeal) {
    return (
      <Suspense
        fallback={
          <div>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        }
      >
        <SellerSingleInProgressDeals
          inprogressdeal={inprogressdeal}
          setInprogressDeal={setInprogressDeal}
        />
      </Suspense>
    );
  }

  if (completedeal && !inprogressdeal) {
    return (
      <Suspense
        fallback={
          <div>
            <Spin indicator={<LoadingOutlined spin />} size="large" />
          </div>
        }
      >
        <SellerSingleCompleteDeal
          completedeal={completedeal}
          setCompleteDeal={setCompleteDeal}
        />
      </Suspense>
    );
  } else {
    return (
      <Flex vertical gap={20}>
        <ModuleTopHeading level={4} name={t("Deals")} />
        <Card className="radius-12 border-gray">
          <Row gutter={[16, 16]}>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <SearchInput
                value={searchValue}
                placeholder={t("Search")}
                onDebouncedChange={handleSearchChange}
                debounceDelay={500}
                prefix={
                  <img
                    src="/assets/icons/search.png"
                    alt={t("search-icon")}
                    className="mx-3-inline"
                    width={12}
                    fetchPriority="high"
                  />
                }
              />
            </Col>
            <Col
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
            >
              <MySelect
                withoutForm
                value={activeKey}
                onChange={handleTabChange}
                options={selectOptions}
                className="border-light-gray radius-8"
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>{renderContent()}</Col>
          </Row>
        </Card>
      </Flex>
    );
  }
};

export { SellerDeals };
