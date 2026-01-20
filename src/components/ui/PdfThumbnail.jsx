import { Flex, Typography } from "antd";
import { FilePdfOutlined } from "@ant-design/icons";

const { Text } = Typography;

const PdfThumbnail = ({ url, width = 150, height = 100, onClick }) => {
  return (
    <Flex
      vertical
      align="center"
      justify="center"
      style={{
        width,
        height,
        cursor: "pointer",
        backgroundColor: "#f5f5f5",
        border: "1px solid #d9d9d9",
        borderRadius: "4px",
        transition: "all 0.3s",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "#fafafa";
        e.currentTarget.style.borderColor = "#ff4d4f";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "#f5f5f5";
        e.currentTarget.style.borderColor = "#d9d9d9";
      }}
    >
      <FilePdfOutlined style={{ fontSize: 40, color: "#ff4d4f" }} />
      <Text
        style={{ fontSize: 12, color: "#595959", marginTop: 8 }}
        ellipsis={{ tooltip: true }}
      >
        PDF Document
      </Text>
    </Flex>
  );
};

export { PdfThumbnail };
