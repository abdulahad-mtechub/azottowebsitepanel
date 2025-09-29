import React, { useEffect, useRef } from 'react'
import { Col, Flex, Image, Row, Typography } from 'antd'
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography

const JusoorFeatureMobile = () => {
    const { t } = useTranslation();
    const imgRef = useRef([])
    const containerRef = useRef([])
    gsap.registerPlugin(ScrollTrigger)

    useEffect(() => {
        gsap.to(imgRef.current, {
            xPercent: -100 * (imgRef.current.length - 1),
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                scrub: 1,
                pin: true,
                end: () => "+=" + containerRef.current.scrollWidth,
                snap: 1 / (imgRef.current.length - 1),
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill());
        };
    }, []);

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
                <Row gutter={[24, 24]} align="middle" justify="space-between">
                    <Col span={24}>
                        <Flex vertical justify="center" align="center" gap={15} className="mx-width">
                            <div className="tag fw-500">{t("Jusoor's Features")}</div>
                            <Title className="m-0 text-white" level={2}>
                                {t("Your")} <span className="text-brand">{t("Trusted Saudi Marketplace")}</span> {t("for Buying and Selling Businesses")}
                            </Title>
                            <Text className="fs-14 text-white">
                                {t("We've built Jusoor to simplify business acquisitions and transfers with verified listings, legal security, and real support at every step.")}
                            </Text>
                        </Flex>
                    </Col>

                    {/* Animated Step Content */}
                    <Col span={24} className='overflow-hidden'>
                        <div ref={containerRef}>
                            <Flex align='center' gap={30} className='min-h-screen text-center overflow-hidden' style={{ width: `calc(100vw * ${steps.length})` }}>
                                {steps?.map((list, i) =>
                                    <Flex vertical align='center' justify='center' key={i} className='overflow-hidden min-h-screen w-100vw'
                                        ref={(ref) => imgRef.current[i] = ref}
                                    >
                                        <Image
                                            src={list?.img}
                                            alt={list?.title}
                                            preview={false}
                                            width={400}
                                        />
                                        <Flex vertical gap={5} align='center' className='maxwidth-400'>
                                            <Title level={5} className='m-0 text-white'>{list?.title}</Title>
                                            <Text className="fs-13 text-white">{list?.description}</Text>
                                        </Flex>
                                    </Flex>
                                )}
                            </Flex>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { JusoorFeatureMobile }
