import { Card, Col, Flex, Image, Row, Typography } from 'antd'
import { Trans, useTranslation } from 'react-i18next';

const { Text, Title } = Typography

const JusoorFutures = () => {
    const { t } = useTranslation();

    const steps = [
        {
            title: t('Verified Listings'),
            description: t('Every business on Jusoor is verified for identity and commercial registration. ensuring you make decisions with confidence.'),
            img: '/assets/images/ver.gif',
        },
        {
            title: t('Secure & Protected Deals'),
            description: t('Our process includes E-NDA agreements, verified documents, and bank transfer flows to protect both buyers and sellers at every stage.'),
            img: '/assets/images/secure.gif',
        },
        {
            title: t('Transparent Business Data'),
            description: t('Access detailed financial metrics, team size, key assets, and liabilities before making an offer.'),
            img: '/assets/images/scan.gif',
        },
        {
            title: t('Finalized Transactions Made Easy'),
            description: t('Connecting serious buyers with trusted sellers through a secure and streamlined process.'),
            img: '/assets/images/curr.gif',
        },
    ];

    return (
        <div className="feature bg-dark-blue">
            <div className="container">
                <Row gutter={[24, 64]}>
                    <Col span={24}>
                        <Flex vertical justify="center" align="center" gap={15} className="mx-width">
                            <div className="tag fw-500">{t("Jusoor's Futures")}</div>
                            <Title className="m-0 text-white" level={2}>
                                <Trans i18nKey="trustedMarketplace">
                                    Your <span className="text-brand">Trusted Saudi Marketplace</span> for Buying and Selling Businesses
                                </Trans>
                            </Title>
                        </Flex>
                    </Col>
                    {steps?.map((list, i) =>
                        <Col span={24} lg={{ span: 6 }} key={i}>
                            <Card className='border-0 card-d-brand rounded-20 h-100'>
                                <Flex vertical align='center' gap={10} justify='center' className='text-center'>
                                    <Image
                                        src={list?.img}
                                        alt={list?.title}
                                        preview={false}
                                        width={200}
                                    />
                                    <Flex vertical gap={10} align='center' className='maxwidth-400'>
                                        <Title strong className='fs-17 m-0 text-white'>{list?.title}</Title>
                                        <Text className="fs-15 text-white">{list?.description}</Text>
                                    </Flex>
                                </Flex>
                            </Card>
                        </Col>
                    )}
                </Row>
            </div>
        </div>
    )
}

export { JusoorFutures }
