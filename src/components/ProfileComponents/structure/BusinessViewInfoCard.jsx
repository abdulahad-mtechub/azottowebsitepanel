import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { useTranslation } from 'react-i18next'

const { Title, Text } = Typography
const BusinessViewInfoCard = ({ data }) => {
    const { t } = useTranslation();

    const businessInfoData = [
        {
            id: 1,
            icon:'/assets/icons/verification.png',
            title: t('Verified'),
            subtitle: t('Identity Verification')
        },
        {
            id: 2,
            icon:'/assets/icons/businessprice.png',
            title: <> <img src="/assets/icons/reyal-b.png" width={16} alt={t("currency-symbol")} fetchPriority="high" /> {data?.price?.toLocaleString() || '0'}</>,
            subtitle: t('Business Price')
        },
        {
            id: 3,
            icon:'/assets/icons/businesscate.png',
            title: data?.category?.name || t('Unknown'),
            subtitle: t('Business Category')
        },
        {
            id: 5,
            icon:'/assets/icons/businessloc.png',
            title: `${data?.district + "" + (data?.city ? `, ${data?.city}` : '') || t('Unknown')}`,
            subtitle: t('Business Location')
        },
    ]

    return (
        <Card className='radius-12 border-gray mb-3'>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Title level={5} className='m-0'>
                        {t('Business Info')}
                    </Title>
                </Col>
                {
                    businessInfoData?.map((info, i) => (
                        <Col xs={24} sm={24} md={12} lg={6} key={i}>
                            <Flex gap={10}>
                                <div className={`icon-pre ${info.id === 1 ? 'bg-light-green' : null}`}>
                                    <Image src={info?.icon} preview={false} width={'100%'} alt={t("icon")} />
                                </div>
                                <Flex vertical gap={2}>
                                    <Title level={5} className={`m-0 ${info.id === 1 ? 'text-green' : ''}`}>
                                        {info?.title}
                                    </Title>
                                    <Text className='text-gray fs-12 fw-500'>
                                        {info?.subtitle}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>
                    ))
                }
            </Row>
        </Card>
    )
}

export { BusinessViewInfoCard }
