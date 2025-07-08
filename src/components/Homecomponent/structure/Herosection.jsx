import { Row, Col, Typography, Flex, Button } from 'antd'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const Herosection = () => {

  const {t}= useTranslation()
  const navigate = useNavigate()
  return (
    <section className='hero'>
      <div className="container">
        <Row gutter={[16, 16]} className='inner'>
          <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 12 }}>
            <Flex vertical gap={10} className='div'>
              <div className='tag'>Trusted Marketplace for Saudi Businesses</div>
              <Title className='m-0 text-white' level={1}>
                Buy or Sell a Verified <br /> Business with <span className='text-brand'>Confidence</span>
              </Title>
              <Text className='text-light-gray my-2'>
                Explore real, revenue-generating businesses across Saudi Arabia. Whether you're an investor or an owner, Jusoor makes the process safe, simple, and secure.
              </Text>
              <Flex gap={10} align='center'>
                <Flex vertical gap={2}  align='center'>
                  <Text className='text-light-gray fs-12'>Districts Covered</Text>
                  <Title className='m-0 text-white fw-normal' level={5}>
                    10+
                  </Title>
                </Flex>
                <div className='hr-line'></div>
                <Flex vertical gap={2} align='center'>
                  <Text className='text-light-gray fs-12'>Cities Actively Listed</Text>
                  <Title className='m-0 text-white fw-normal' level={5}>
                    20+
                  </Title>
                </Flex>
                <div className='hr-line'></div>
                <Flex vertical gap={2} align='center'>
                  <Text className='text-light-gray fs-12'>Business Categories</Text>
                  <Title className='m-0 text-white fw-normal' level={5}>
                    10+
                  </Title>
                </Flex>
              </Flex>
              <Flex gap={10} className='mt-2'>
                <Button className='btn bg-brand'>
                  Explore Businesses
                </Button>
                <Button className='btn bg-white text-dark'>
                  Sell Your Business <RightOutlined className='fs-10' />
                </Button>
              </Flex>
            </Flex>
          </Col>
          <Col sm={{ span: 24 }} md={{ span: 10 }} lg={{ span: 10 }} xl={{ span: 10 }}>
            <div className='heroimginner'>
              <img src='assets/images/shap-cr.png' alt='' className='shap'/>
              <img src='assets/images/1.png' alt='' />
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}

export { Herosection }