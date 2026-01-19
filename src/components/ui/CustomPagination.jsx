import { Col, Flex, Typography, Select, Pagination, Grid } from "antd";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../hooks";

const { Text } = Typography;
const { useBreakpoint } = Grid;

const selectOptions = [
  { value: 10, label: "10" },
  { value: 20, label: "20" },
  { value: 50, label: "50" },
  { value: 100, label: "100" },
];

const CustomPagination = ({
  totalItems,
  limit,
  setLimit,
  currentPage,
  setCurrentPage,
}) => {
  const screens = useBreakpoint();
  const { t } = useTranslation();
  const { formatNumber } = useFormatNumber();

  // Hide pagination if total items fit in one page
  if (totalItems <= limit && currentPage === 1) {
    return null;
  }

  return (
    <Col span={24} className="mt-3">
      <Flex
        justify={screens.md ? "space-between" : "center"}
        align="center"
        wrap="wrap"
        gap={screens.xs ? 16 : 24}
      >
        <Flex
          gap={8}
          align="center"
          justify={screens.xs ? "center" : "flex-start"}
          style={{ flexShrink: 0, minWidth: screens.xs ? "100%" : "auto" }}
        >
          <Text>{t("Rows Per Page")}:</Text>
          <Select
            className="select-filter"
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setCurrentPage(1);
            }}
            options={selectOptions}
            style={{ width: 80 }}
          />
        </Flex>

        <Flex
          justify={screens.xs ? "center" : "flex-end"}
          style={{ flexGrow: 1, minWidth: screens.xs ? "100%" : "auto" }}
        >
          <Pagination
            className="pagination"
            current={currentPage}
            pageSize={limit}
            total={totalItems}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${formatNumber(range[0])}-${formatNumber(range[1])} ${t(
                "of",
              )} ${formatNumber(total)} ${t("items")}`
            }
            simple={screens.xs}
            responsive={true}
            size={screens.sm ? "default" : "small"}
            itemRender={(page, type, originalElement) => {
              if (type === "page") {
                return <a>{formatNumber(page)}</a>;
              }
              return originalElement;
            }}
          />
        </Flex>
      </Flex>
    </Col>
  );
};

export { CustomPagination };
