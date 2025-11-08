import { Button, Card, Col, Flex, Row, Typography,Spin, Empty } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { SuggestedArticles } from '../components';
import { GETARTICLE } from '../graphql/query'
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Text, Title,Paragraph } = Typography;

const ArticleSingleView = () => {
      const { t,i18n } = useTranslation();
      const lan = localStorage.getItem("lang") || i18n.language || "en";
      const isArabic = lan.toLowerCase() === "ar";
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, loading } = useQuery(GETARTICLE,{
        variables:{getArticleId:id}
    }) 

    if (loading) {
        return (
            <Flex justify="center" align="center" className="h-200">
                <Spin size="large" />
            </Flex>
        );
    }

    if (!data?.getArticle?.isArabic && isArabic) {
        return (
            <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="container padd-1">
                <Empty description={t('No article found')} />
            </div>
        );
    }

    return (
        <>
            <div className='padd'>
                <div className='feature pt-0'>
                    <div className='container'>
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Flex vertical gap={15}>
                                    <Flex vertical align='flex-start' gap={5}>
                                        <Button
                                            aria-labelledby={t('Arrow left')}
                                            className='border-0 p-0 bg-transparent'
                                            onClick={() => navigate(-1)}
                                        >
                                            <ArrowLeftOutlined />
                                        </Button>
                                        <Title className='m-0' level={2}>
                                            {isArabic ? data?.getArticle?.arabicTitle : data?.getArticle?.title}
                                        </Title>
                                    </Flex>
                                </Flex>
                            </Col>
                            <Col span={24}>
                                <Card className='h-100 border-gray rounded-12 card-cs'>
                                    <Flex vertical gap={15}>
                                        <div className='w-full h-400 mb-2 rounded-12 overflow-hidden'>
                                            <img
                                                src={data?.getArticle?.image || '/assets/default-banner.jpg'}
                                                width={'100%'}
                                                height={'100%'}
                                                className='object-cover object-top'
                                                alt={t('article-banner')}
                                                fetchPriority="high"
                                            />
                                        </div>
                                        <Paragraph className='fs-14 text-gray'>
                                            {
                                            isArabic? 
                                            <span dangerouslySetInnerHTML={{ __html: data?.getArticle?.arabicBody?.content }} />
                                            :
                                            <span dangerouslySetInnerHTML={{ __html: data?.getArticle?.body?.content }} />
                                            }
                                        </Paragraph>
                                    </Flex>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </div>
                <SuggestedArticles />
            </div>
        </>
    );
};

export { ArticleSingleView };
