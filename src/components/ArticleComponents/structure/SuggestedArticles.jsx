import { Col, Flex, Row, Typography } from 'antd'
import { ArtticleCards } from './ArtticleCards'
import { articleData } from '../../../data'
import { useTranslation } from 'react-i18next'

const { Text, Title } = Typography
const SuggestedArticles = () => {
    const { t } = useTranslation()
    const data = articleData.slice(0,3)

    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 64]} align={'middle'}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag bg-secondary fw-500 text-brand'>{t('Helpful Reads')}</div>
                            <Title className='m-0' level={2}>
                                {t('Suggested')} <span className='text-brand'>{t('Articles')}</span>
                            </Title>
                            <Text className='fs-14'>
                                {t('Discover tips, trends, and guides to support your business journey.')}
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