import { Row, Col, Typography, Flex, Button } from 'antd'
import { RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const Herosection = () => {
  const navigate = useNavigate();

  return (
    <section className='hero'>
      <Row gutter={[16, 16]} justify={'space-between'}>
        <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 12 }} xl={{ span: 10 }}>
          <div className="container">
            <Flex vertical gap={10} className='div center-mbl'>
              <div className='tag'>Trusted Marketplace for Saudi Businesses</div>
              <Title className='m-0 text-white mbl-font' level={1}>
                Buy or Sell a Verified <br /> Business with <span className='text-brand'>Confidence</span>
              </Title>
              <Text className='text-light-gray my-2'>
                Explore real, revenue-generating businesses across Saudi Arabia. Whether you're an investor or an owner, Jusoor makes the process safe, simple, and secure.
              </Text>
              <Flex gap={10} className='mt-2 center-mbl'>
                <Button aria-labelledby='Explore Businesses' className='btn bg-brand' onClick={() => navigate('/businesslisting')}>
                  Explore Businesses
                </Button>
                <Button aria-labelledby='Sell Your Business' className='btn bg-white text-dark' onClick={() => navigate('/sellbusinesscreate')}>
                  Sell Your Business <RightOutlined className='fs-10' />
                </Button>
              </Flex>
            </Flex>
          </div>
        </Col>
        
        <Col sm={{ span: 24 }} md={{ span: 24 }} lg={{ span: 10 }} xl={{ span: 10 }}>
          <div className='heroimginner'>
            <img src='assets/images/banner-web.png' alt='hero-banner-web' className='web-vw'/>
            <img src='assets/images/homebanner.png' width={'100%'} className='mbl-vw'  alt='hero-banner-mobile' />
          </div>
        </Col>
      </Row>
    </section>
  )
}

export { Herosection }