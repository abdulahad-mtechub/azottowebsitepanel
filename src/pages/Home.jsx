import { Col, Row } from "antd";
import {
  ExploreLive,
  Herosection,
  HowWork,
} from "../components";
const Home = () => {
  return (
    <div>
      <Herosection />
      <HowWork />
      <Row>
        <Col span={24}>
          <ExploreLive />
        </Col>
      </Row>
    </div>
  );
};

export { Home };
