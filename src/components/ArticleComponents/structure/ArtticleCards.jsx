import { Button, Card, Col, Flex, Row, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Text, Paragraph } = Typography;

const ArtticleCards = ({ data, loadmore = false }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <Row gutter={[24, 24]}>
            {
                data?.map((art, i) =>
                    <Col lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 24 }} xs={{ span: 24 }} key={i}>
                        <Card 
                            className='h-100 border-gray rounded-12 card-cs cursor' 
                            onClick={() => navigate('/articlesingleview/' + art?.id)}
                            actions={[
                                <Text className='fs-13 text-gray mt-2'>
                                    {art?.date}
                                </Text>
                            ]}
                        >
                            <Flex vertical gap={20}>
                                <div>
                                    <div className='w-full card-img-2 mb-2 rounded-12'>
                                        <img src={art?.img} width={'100%'} height={'100%'} className='object-cover object-top' alt={t('article-image')} fetchPriority="high"/>
                                    </div>
                                    <Paragraph 
                                        ellipsis={{ rows: 2 }}
                                        className='fs-16 fw-600 h-50'
                                    >
                                        {art?.title}
                                    </Paragraph>
                                    <Paragraph 
                                        ellipsis={{ rows: 2, expandable: true, symbol: t('more') }}
                                        className='fs-14 text-gray'
                                    >
                                        <span dangerouslySetInnerHTML={{ __html: art?.desc?.content }} />
                                    </Paragraph>
                                </div>
                            </Flex>
                        </Card>
                    </Col>
                )
            }
            {
                loadmore &&
                <Col span={24}>
                    <Flex justify='center' className='mt-3'>
                        <Button aria-labelledby={t('Load More Articles')} className='btn btn-bg'>
                            {t('Load More Articles')}
                        </Button>
                    </Flex>
                </Col>
            }
        </Row>
    );
}

export { ArtticleCards };
