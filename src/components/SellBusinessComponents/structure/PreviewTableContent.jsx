import { Col, Row, Table, Typography } from "antd";

const { Title } = Typography;
const PreviewTableContent = ({ title, columns, data }) => {
  return (
    <Row gutter={[24, 12]}>
      <Col span={24}>
        <Title level={5} className="m-0">
          {title}
        </Title>
      </Col>
      <Col span={24}>
        <Table
          size="large"
          columns={columns}
          dataSource={data}
          className="pagination table"
          showSorterTooltip={false}
          scroll={{ x: 500 }}
          pagination={false}
        />
      </Col>
    </Row>
  );
};

export { PreviewTableContent };
