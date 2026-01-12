import { Col, Row, Table, Space, Typography } from "antd";
import { SearchInput } from "../../Forms";
import { SELLERDEALS } from "../../../graphql/query";
import { useLazyQuery } from "@apollo/client";
import { useMemo, useEffect, useState, memo } from "react";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";
import { getNamePreview } from "../../../utils";
import dayjs from "dayjs";

const { Text } = Typography;

const SellerCompleteDeal = memo(({ setCompleteDeal, searchValue }) => {
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [fetchDeals, { data: offerDeals, loading }] = useLazyQuery(
    SELLERDEALS,
    {
      fetchPolicy: "network-only",
    }
  );

  const handleTableChange = (paginationInfo) => {
    const newPagination = {
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize,
    };
    setPagination(newPagination);

    const offset = (paginationInfo.current - 1) * paginationInfo.pageSize;
    fetchDeals({
      variables: {
        limit: paginationInfo.pageSize,
        offset,
        search: searchValue || "",
      },
    });
  };

  useEffect(() => {
    const offset = (pagination.current - 1) * pagination.pageSize;
    fetchDeals({
      variables: {
        limit: pagination.pageSize,
        offset,
        search: searchValue || "",
      },
    });
  }, [searchValue, fetchDeals, pagination]);

  const columns = [
    { title: t("Business Title"), dataIndex: "title" },
    { title: t("Buyer Name"), dataIndex: "buyername" },
    {
      title: t("Finalized Price"),
      dataIndex: "finalizedprice",
      render: (finalizedprice) => (
        <Space size={5} align="center">
          {finalizedprice != null && finalizedprice !== "" ? (
            <>
              <img
                src="/assets/icons/reyal-b.png"
                width={16}
                alt={t("currency-symbol")}
                fetchPriority="high"
              />
              <Text>{formatNumber(finalizedprice)}</Text>
            </>
          ) : (
            <Text>-</Text>
          )}
        </Space>
      ),
    },
    {
      title: t("Finalized Date"),
      dataIndex: "date",
      render: (text) => {
        return dayjs(text).format("MMM DD, YYYY • hh:mm A");
      },
    },
  ];

  const sellercompletedealData = useMemo(() => {
    return (
      offerDeals?.getSellerCompletedDeals?.deals?.map((offer) => ({
        key: offer?.id,
        title: offer?.business?.businessTitle,
        buyername: getNamePreview(offer?.buyer?.name),
        finalizedprice: offer?.price,
        date: offer?.createdAt,
      })) || []
    );
  }, [offerDeals]);

  const totalCount = offerDeals?.getSellerCompletedDeals?.totalCount || 0;

  return (
    <>
      <Row gutter={[24, 12]} className="mt-2">
        <Col span={24}>
          <Table
            size="large"
            columns={columns}
            dataSource={sellercompletedealData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
            onRow={(record) => ({
              onClick: () => {
                if (record.key) {
                  setCompleteDeal(record);
                }
              },
            })}
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

SellerCompleteDeal.displayName = "SellerCompleteDeal";

export { SellerCompleteDeal };
