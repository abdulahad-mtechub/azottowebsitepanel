import { Card, Col, Row } from "antd";
import { MySelect, SearchInput } from "../../Forms";
import { SellerSendRequestTable } from "./SellerSenRequestTable";
import { SellerRecieveRequestTable } from "./SellerRecieveRequestTable";
import { SellerAdminSchedulingTable } from "./SellerAdminSchedulingTable";
import { SellerScheduledTable } from "./SellerScheduledTable";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";

const Meetings = ({ isBuyer }) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState("1");
  const [searchValue, setSearchValue] = useState("");

  const items = useMemo(
    () => [
      {
        key: "1",
        label: t("Send Requests"),
        component: SellerSendRequestTable,
      },
      {
        key: "2",
        label: t("Receive Requests"),
        component: SellerRecieveRequestTable,
      },
      {
        key: "3",
        label: t("Admin Scheduling"),
        component: SellerAdminSchedulingTable,
      },
      {
        key: "4",
        label: t("Scheduled Meetings"),
        component: SellerScheduledTable,
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
    return <Component isBuyer={isBuyer} searchValue={searchValue} />;
  }, [activeKey, isBuyer, searchValue, items]);

  const handleTabChange = useCallback((value) => {
    setActiveKey(value);
    setSearchValue("");
  }, []);

  const handleSearchChange = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
  }, []);

  return (
    <Card className="border-gray">
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
  );
};

export { Meetings };
