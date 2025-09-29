import { Col, Flex, Image, Row, Typography } from 'antd'
import { useAboutData } from '../../../data/aboutData'  // use the custom hook
const { Title, Text } = Typography

const AboutComponent = () => {
  const { introData } = useAboutData()

  return (
    <div className='feature'>
      <div className='container'>
        <Row gutter={[24, 24]} justify={'space-between'} align={'middle'}>
          <Col lg={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
            <Flex vertical justify='center' gap={15}>
              <div className='tag bg-secondary fw-500 text-brand'>
                {introData.subtitle}
              </div>
              <Title className='m-0' level={2}>
                {introData.title}
              </Title>
              <Text className='fs-14 text-justify'>
                {introData.desc}
              </Text>
              <ul className='nomark'>
                {introData?.list?.map((item, i) => (
                  <li key={i}>
                    <Flex gap={5} align='center'>
                      <Image
                        src='/assets/icons/timeline.png'
                        alt='list icon'
                        width={16}
                        preview={false}
                      />
                      <Text className='fs-14'>{item}</Text>
                    </Flex>
                  </li>
                ))}
              </ul>
            </Flex>
          </Col>

          <Col lg={{ span: 10 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
            <Flex justify='center'>
              <Image
                src='/assets/images/ab-1.png'
                alt='image'
                width={300}
                height={300}
                preview={false}
                className='rounded-12'
              />
            </Flex>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export { AboutComponent }
