import { Col, Row } from "antd";
import {
  ExploreLive,
  FaqsComponent,
  Herosection,
  HowWork,
  JusoorFuturembl,
  JusoorFutures,
} from "../components";

const Home = () => {
  return (
    <div>
      <Herosection />
      <HowWork />
      <Row>
        <Col xs={0} sm={0} md={0} lg={24} xl={24}>
          <JusoorFutures />
        </Col>
        <Col xs={24} sm={24} md={24} lg={0} xl={0}>
          <JusoorFuturembl />
        </Col>
        <Col span={24}>
          <ExploreLive />
        </Col>
        {/* <Col xs={0} sm={0} md={24} lg={24} xl={24}>
            <BrowseType />
          </Col> */}
        <Col xs={0} sm={0} md={24} lg={24} xl={24}>
          <FaqsComponent />
        </Col>
      </Row>
    </div>
  );
};

export { Home };
