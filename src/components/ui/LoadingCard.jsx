import { Flex, Spin, Typography } from "antd";

const { Text } = Typography;

const LoadingCard = ({
  height = 590,
  minHeight = 590,
  loading = false,
  isEmpty = false,
  emptyText = "No Data Available",
  className = "",
}) => {
  if (isEmpty) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{
          height: height,
          minHeight: minHeight,
        }}
      >
        <Text className={className}>{emptyText}</Text>
      </Flex>
    );
  }

  return (
    <Flex
      justify="center"
      align="center"
      style={{
        height: height,
        minHeight: minHeight,
      }}
    >
      <Spin size="large" spinning={loading} />
    </Flex>
  );
};

export { LoadingCard };
