import { Card, Flex, Row, Col } from "antd";
import { ModuleTopHeading } from "../../Pagecomponents";
import { MySelect, SearchInput } from "../../Forms";
import { useState, useMemo, useCallback } from "react";
import { lazy, Suspense } from "react";
import { SingleCompleteDeal } from "./SingleCompleteDeal";
import { useTranslation } from "react-i18next";

const InprogressDealsTable = lazy(() =>
  import("./InprogressDealsTable").then((module) => ({
    default: module.InprogressDealsTable,
  }))
);
const SingleInProgressDeals = lazy(() =>
  import("./SingleInProgressDeals").then((module) => ({
    default: module.SingleInProgressDeals,
  }))
);
const CompleteDealsTable = lazy(() => import("./CompleteDealsTable"));

const BuyerDeals = () => {
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
        component: InprogressDealsTable,
      },
      {
        key: "2",
        label: t("Completed Deals"),
        component: CompleteDealsTable,
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
        searchValue={searchValue}
      />
    );
  }, [activeKey, searchValue, items]);

  const handleTabChange = useCallback((value) => {
    setActiveKey(value);
    setSearchValue("");
  }, []);

  const handleSearchChange = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
  }, []);

  if (inprogressdeal && !completedeal) {
    return (
      <Suspense>
        <SingleInProgressDeals
          inprogressdeal={inprogressdeal}
          setInprogressDeal={setInprogressDeal}
        />
      </Suspense>
    );
  }

  if (completedeal && !inprogressdeal) {
    return (
      <Suspense>
        <SingleCompleteDeal
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

export { BuyerDeals };
