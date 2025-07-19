import { Col, Row } from 'antd'
import { BrowseType, Contactform, ExploreLive, Herosection, HowWork, JusoorFeature, JusoorFeatureMobile, JusoorFuturembl } from '../components'

const Home = () => {
  return (
    <div>
        <Herosection />
        <HowWork />
        <Row>
          <Col xs={0} sm={0} md={0} lg={24} xl={24}>
            <JusoorFeature />
          </Col>
          <Col xs={24} sm={24} md={24} lg={0} xl={0}>
            <JusoorFuturembl />
          </Col>
        </Row>
        <ExploreLive />
        <BrowseType />
        <Contactform />
    </div>
  )
}

export{Home}