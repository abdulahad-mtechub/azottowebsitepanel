import { Col, Row, Space, Table, Typography } from "antd";
import { SearchInput } from "../../Forms";
import { READYSCHEDULEDMEETINGS } from "../../../graphql/query";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useFormatNumber } from "../../../hooks";
import { getNamePreview } from "../../../utils";

const { Text } = Typography;

const SellerAdminSchedulingTable = ({ isBuyer }) => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const [searchValue, setSearchValue] = useState("");
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [fetchMeetings, { data, loading }] = useLazyQuery(
    READYSCHEDULEDMEETINGS,
    {
      fetchPolicy: "network-only",
    }
  );
  const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, []);

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

  const selleradminsechedulingData =
    data?.getMeetingsReadyForScheduling?.items?.map((meeting) => {
      const isSellerMeeting =
        meeting?.business?.seller?.id === meeting?.requestedBy?.id;

      const displayName = isBuyer
        ? isSellerMeeting
          ? meeting?.requestedBy?.name || "-"
          : meeting?.requestedTo?.name || "-"
        : isSellerMeeting
        ? meeting?.requestedTo?.name || "-"
        : meeting?.requestedBy?.name || "-";
      return {
        key: meeting.id,
        title: meeting.business?.businessTitle,
        buyername: getNamePreview(displayName),
        businessprice: meeting.business?.price,
        offerprice: meeting.offer?.price,
        prefereddatetime: isBuyer
          ? isSellerMeeting
            ? `${dayjs(meeting.requestedDate)?.format(
                "DD MMM YYYY, hh:mm A"
              )} - ${dayjs(meeting.requestedEndDate)?.format("hh:mm A")}`
            : dayjs(meeting.receiverAvailabilityDate)?.format(
                "DD MMM YYYY, hh:mm A"
              )
          : !isSellerMeeting
          ? `${dayjs(meeting.requestedDate)?.format(
              "DD MMM YYYY, hh:mm A"
            )} - ${dayjs(meeting.requestedEndDate)?.format("hh:mm A")}`
          : dayjs(meeting.receiverAvailabilityDate)?.format(
              "DD MMM YYYY, hh:mm A"
            ),
        status: meeting.status,
      };
    }) || [];

  const totalCount = data?.getMeetingsReadyForScheduling?.totalCount || 0;

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
      render: (offerprice) => (
        <Space size={5} align="center">
          {offerprice != null && offerprice !== "" ? (
            <>
              <img
                src="/assets/icons/reyal-b.png"
                width={16}
                alt={t("currency-symbol")}
                fetchPriority="high"
              />
              <Text>{formatNumber(offerprice)}</Text>
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
              ? t("Under Admin Review")
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
    { title: t("Preferred Date & Time"), dataIndex: "prefereddatetime" },
  ];

  const handleTableChange = (paginationInfo) => {
    const newPagination = {
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };
    setPagination(newPagination);

    const offset = (paginationInfo.current - 1) * paginationInfo.pageSize;
    fetchMeetings({
      variables: {
        search: searchValue || "",
        isBuyer,
        limit: paginationInfo.pageSize,
        offset,
      },
    });
  };

  useEffect(() => {
    const offset = (pagination.current - 1) * pagination.pageSize;
    fetchMeetings({
      variables: {
        search: searchValue || "",
        isBuyer,
        limit: pagination.pageSize,
        offset,
      },
    });
  }, [searchValue, fetchMeetings, isBuyer, pagination]);

  return (
    <>
      <Row gutter={[24, 12]} className="mt-2">
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 12 }}
          lg={{ span: 8 }}
        >
          <SearchInput
            withoutForm={true}
            placeholder={t("Search")}
            onDebouncedChange={handleDebouncedSearch}
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
        <Col span={24}>
          <Table
            size="large"
            columns={columns}
            dataSource={selleradminsechedulingData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
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
};

export { SellerAdminSchedulingTable };
