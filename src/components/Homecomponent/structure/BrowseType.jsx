import { Button, Card, Col, Flex, Image, Row, Typography } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { browsetypeData } from '../../../data'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

const { Text, Title } = Typography

const BrowseType = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 991);

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const displayData = isMobile ? browsetypeData.slice(0, 4) : browsetypeData;

    return (
        <div className='feature bg-dark-blue'>
            <div className='container'>
                <Row gutter={[24, 40]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag bg-blue text-white fw-500'>
                                {t("Browse by Type")}
                            </div>
                            <Title className='m-0 text-white' level={2}>
                                {t("Discover Businesses Across")}{" "}
                                <span className='text-brand'>
                                    {t("Popular Categories")}
                                </span>
                            </Title>
                            <Text className='fs-14 text-white'>
                                {t("Whether you’re looking to buy or sell a thriving business, explore active categories that cover a wide range of local industries in Saudi Arabia.")}
                            </Text>
                        </Flex>
                    </Col>
                    {displayData?.map((type, i) => (
                        <Col lg={{ span: 6 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} key={i}>
                            <Card className='h-100 border-brand rounded-12'>
                                <Flex vertical gap={20} align='center' justify='center' className='text-center'>
                                    <Image src={type?.icons} preview={false} alt={t('type icon')} width={50} />
                                    <div>
                                        <Title className='m-0' level={5}>
                                            {t(type?.title)}
                                        </Title>
                                        <Text className='fs-14 text-gray'>
                                            {t(type?.description)}
                                        </Text>
                                    </div>
                                </Flex>
                            </Card>
                        </Col>
                    ))}
                    <Col span={24}>
                        <Flex justify='center'>
                            <Button aria-labelledby={t('Explore More Categories')} className='btn bg-brand'>
                                {t("Explore More Categories")} <RightOutlined className='fs-10' />
                            </Button>
                        </Flex>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { BrowseType }
