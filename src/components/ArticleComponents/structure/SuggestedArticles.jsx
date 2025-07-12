import { Col, Flex, Row, Typography } from 'antd'
import { ArtticleCards } from './ArtticleCards'
import { articleData } from '../../../data'

const { Text, Title } = Typography
const SuggestedArticles = () => {

    const data = articleData.slice(0,3)

    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 64]} align={'middle'}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag bg-secondary fw-500 text-brand'>Helpful Reads</div>
                            <Title className='m-0' level={2}>
                                Suggested <span className='text-brand'>Articles</span>
                            </Title>
                            <Text className='fs-14'>
                                Discover tips, trends, and guides to support your business journey.
                            </Text>
                        </Flex>
                    </Col>
                    <Col span={24}>
                        <ArtticleCards data={data} />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export {SuggestedArticles}