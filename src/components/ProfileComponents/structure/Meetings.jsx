import { Card, Col, Row,Table } from "antd";
import { MySelect, SearchInput } from "../../Forms";
import { useTranslation } from "react-i18next";
import { useState, useCallback, useMemo } from "react";

const Meetings = ({ isBuyer }) => {
  const { t } = useTranslation();
  const [activeKey, setActiveKey] = useState("1");
  const [searchValue, setSearchValue] = useState("");

  const columns = [
    { title: t("Vin Number"), dataIndex: "title" },
    {
      title: isBuyer ? t("Seller Name") : t("Buyer Name"),
      dataIndex: "buyername",
    },
    {
      title: t("Condition Score"),
      dataIndex: "businessprice",
      render: (businessprice) => (
        <Space size={5} align="center">
          {businessprice != null && businessprice !== "" ? (
            <>
              <img
                src="/assets/icons/reyal-b.png"
                width={16}
                alt={t("currency-symbol")}
                fetchPriority="high"
              />
              <Text>{formatNumber(businessprice)}</Text>
            </>
          ) : (
            <Text>-</Text>
          )}
        </Space>
      ),
    },
    {
      title: t("Document Complete"),
      dataIndex: "offerprice",
      render: (businessprice) => (
        <Space size={5} align="center">
          {businessprice != null && businessprice !== "" ? (
            <>
              <img
                src="/assets/icons/reyal-b.png"
                width={16}
                alt={t("currency-symbol")}
                fetchPriority="high"
              />
              <Text>{formatNumber(businessprice)}</Text>
            </>
          ) : (
            <Text>-</Text>
          )}
        </Space>
      ),
    },
    {
      title: t("Status"),
      dataIndex: "status",
      render: (status) => {
        return (
          <Text
            className={`${getStatusBadgeClass(status)} fs-12 badge-cs fw-500`}
          >
            {status === "REJECTED"
              ? t("Rejected")
              : status === "REQUESTED"
              ? t("Requested")
              : status === "CANCELLED"
              ? t("Cancelled")
              : status === "SCHEDULED"
              ? t("Scheduled")
              : status === "ACCEPTED"
              ? t("Accepted")
              : status === "COMPLETED"
              ? t("Completed")
              : status === "PENDING"
              ? t("Pending")
              : status === "PENDING_APPROVAL"
              ? t("Pending Approval")
              : status === "READY_FOR_SCHEDULING"
              ? t("Ready for Scheduling")
              : t(status)}
          </Text>
        );
      },
    },
    {
      title: t("Last Verified On "),
      render: (record) => {
        return (
          <Text>{`${dayjs(record?.requestedDate)?.format(
            "DD MMM YYYY, hh:mm A"
          )} - ${dayjs(record?.requestedEndDate)?.format("hh:mm A")}`}</Text>
        );
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
            scroll={{ x: 830 }}
            pagination={{
              hideOnSinglePage: true,
              current: 1,
              pageSize:10,
              total: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export { Meetings };
