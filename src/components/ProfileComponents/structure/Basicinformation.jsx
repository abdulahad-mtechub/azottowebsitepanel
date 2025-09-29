import { Card, Row, Col, Typography, Flex, Image } from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const Basicinformation = ({ buyerDashboardData, title }) => {
    const { t } = useTranslation();

    return (
        <Card className='rounded-12 border-gray'>
            <ModuleTopHeading level={4} name={t(title)} />
            <Row gutter={[16, 16]} className='mt-2'>
                {
                    buyerDashboardData?.map((list, index) =>
                        <Col xs={24} sm={12} md={6} lg={6} key={index}>
                            <Flex vertical gap={0}>
                                <Text className='fw-600 fs-14'>{t(list?.title)}</Text>
                                {Array.isArray(list?.desc) ? (
                                    <Flex gap={10} className="mt-2">
                                        {list.desc.map((imageUrl, imgIndex) => (
                                            <div className='border-gray p-2' key={imgIndex}>
                                                <Image src={imageUrl} width={150} height={100} preview={false} alt={t('basic info image')} />
                                            </div>
                                        ))}
                                    </Flex>
                                ) : (
                                    <Text className='fs-14 fw-normal'>{t(list?.desc)}</Text>
                                )}
                            </Flex>
                        </Col>
                    )
                }
            </Row>
        </Card>
    );
}

export { Basicinformation };
