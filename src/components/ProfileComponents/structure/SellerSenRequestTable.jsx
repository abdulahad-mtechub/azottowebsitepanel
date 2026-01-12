import { Col, Row, Space, Table, Typography } from "antd";
import { SearchInput } from "../../Forms";
import { SENTMEETINGS } from "../../../graphql/query";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState, useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useFormatNumber } from "../../../hooks";
import { getNamePreview } from "../../../utils";

const { Text } = Typography;

const SellerSendRequestTable = memo(({ isBuyer, searchValue }) => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [fetchMeetings, { data, loading }] = useLazyQuery(SENTMEETINGS, {
    fetchPolicy: "network-only",
  });

  const getStatusBadgeClass = (status) => {
    const statusUpper = status?.toUpperCase();
    switch (statusUpper) {
      case "SCHEDULED":
      case "ACCEPTED":
      case "COMPLETED":
        return "success";
      case "PENDING":
      case "PENDING_APPROVAL":
      case "READY_FOR_SCHEDULING":
        return "sendstatus";
      case "REJECTED":
      case "CANCELLED":
        return "inactive";
      default:
        return "received";
    }
  };

  const columns = [
    { title: t("Business Title"), dataIndex: "title" },
    {
      title: isBuyer ? t("Seller Name") : t("Buyer Name"),
      dataIndex: "buyername",
    },
    {
      title: t("Business Price"),
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
      title: t("Offer Price"),
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
      title: t("Requested Date"),
      render: (record) => {
        return (
          <Text>{`${dayjs(record?.requestedDate)?.format(
            "DD MMM YYYY, hh:mm A"
          )} - ${dayjs(record?.requestedEndDate)?.format("hh:mm A")}`}</Text>
        );
      },
    },
  ];

  const sendrequestData =
    data?.getMySentMeetingRequests?.items?.map((meeting) => {
      return {
        key: meeting.id,
        title: meeting.business?.businessTitle,
        buyername: getNamePreview(meeting.requestedTo?.name),
        businessprice: meeting.business?.price,
        offerprice: meeting.offer?.price,
        status: meeting.status,
        requestedDate: meeting.requestedDate,
        requestedEndDate: meeting.requestedEndDate,
      };
    }) || [];

  const totalCount = data?.getMySentMeetingRequests?.totalCount || 0;

  const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

  const handleTableChange = (paginationInfo) => {
    const newPagination = {
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };
    setPagination(newPagination);

    const offSet = (paginationInfo.current - 1) * paginationInfo.pageSize;
    fetchMeetings({
      variables: {
        search: searchValue || "",
        isBuyer,
        limit: paginationInfo.pageSize,
        offSet,
      },
    });
  };

  useEffect(() => {
    const offSet = (pagination.current - 1) * pagination.pageSize;
    fetchMeetings({
      variables: {
        search: searchValue || "",
        isBuyer,
        limit: pagination.pageSize,
        offSet,
      },
    });
  }, [searchValue, fetchMeetings, isBuyer, pagination]);

  return (
    <>
      <Row gutter={[24, 12]} className="mt-2">
        <Col span={24}>
          <Table
            size="large"
            columns={columns}
            dataSource={sendrequestData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 830 }}
            loading={loading}
            pagination={{
              hideOnSinglePage: true,
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: totalCount,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${formatNumber(range[0])}-${formatNumber(range[1])} ${t(
                  "of"
                )} ${formatNumber(total)} ${t("items")}`,
              pageSizeOptions: ["10", "20", "50", "100"],
              itemRender: (page, type, originalElement) => {
                if (type === "page") {
                  return <a>{formatNumber(page)}</a>;
                }
                return originalElement;
              },
            }}
            onChange={handleTableChange}
          />
        </Col>
      </Row>
    </>
  );
});

SellerSendRequestTable.displayName = "SellerSendRequestTable";

export { SellerSendRequestTable };
