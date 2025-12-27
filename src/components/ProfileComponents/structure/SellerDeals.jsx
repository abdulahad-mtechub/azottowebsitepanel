import { Card, Flex, Spin, Tabs } from "antd";
import { ModuleTopHeading } from "../../Pagecomponents";
import { lazy, Suspense, useMemo, useState } from "react";
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

  const singleTab = useMemo(
    () => [
      {
        key: "1",
        label: t("In-Progress Deals"),
        children: (
          <SellerInProgressDeals setInprogressDeal={setInprogressDeal} />
        ),
      },
      {
        key: "2",
        label: t("Completed Deals"),
        children: (
          <SellerCompleteDeal
            setCompleteDeal={setCompleteDeal}
            completedeal={completedeal}
          />
        ),
      },
    ],
    [setCompleteDeal, setInprogressDeal, completedeal, t]
  );

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
          <Tabs className="tabs-fill" defaultActiveKey="1" items={singleTab} />
        </Card>
      </Flex>
    );
  }
};

export { SellerDeals };
