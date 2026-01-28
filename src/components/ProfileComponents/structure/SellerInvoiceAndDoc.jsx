import { Card, Flex, Row, Col,Table } from "antd";
import { ModuleTopHeading } from "../../Pagecomponents";
import { MySelect, SearchInput } from "../../Forms";
import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const SellerInvoiceAndDoc = () => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState("1");
  const [searchValue, setSearchValue] = useState("");


    const columns = [
      { title: t("Vehicle VIN"), dataIndex: "title" },
      { title: t("Document Type"), dataIndex: "buyername" },
      {
        title: t("File Name"),
        dataIndex: "businessprice",
      },
      {
        title: t("Status"),
        dataIndex: "status",
      },
      {
        title: t("Uploaded Date"),
        dataIndex: "date",
        render: (text) => {
          return dayjs(text).format("MMM DD, YYYY • hh:mm A");
        },
      },
      {
        title: t("Action"),
        key: "action",
        fixed: "right",
        width: 100,
        align: "center",
      },
    ];

  const handleSearchChange = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
  }, []);
  return (
    <Flex vertical gap={20}>
      <ModuleTopHeading level={4} name={t("Invoices and Documents")} />
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
              className="border-light-gray radius-8"
            />
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
        <Col span={24}>
          <Table
            size="large"
            columns={columns}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
            pagination={{
              hideOnSinglePage: true,
              current: 1,
              pageSize: 10,
              total: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Col>
        </Row>
      </Card>
    </Flex>
  );
};

export { SellerInvoiceAndDoc };
