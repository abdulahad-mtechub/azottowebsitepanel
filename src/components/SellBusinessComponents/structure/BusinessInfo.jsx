import { Card, Col, Flex, Image, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";

const { Title, Text } = Typography;
const BusinessInfo = ({ data }) => {

  return (
    <Card className="shadow-d radius-12 border-gray mb-3">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={5} className="m-0">
            Business Info
          </Title>
        </Col>
       
      </Row>
    </Card>
  );
};

export { BusinessInfo };
