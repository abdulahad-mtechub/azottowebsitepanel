import { CheckOutlined } from '@ant-design/icons';
import { Col, Steps, Typography, Row, Flex } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const { Text, Title } = Typography;

const JusoorFeature = () => {
    const [current, setCurrent] = useState(0);
    const stepRefs = useRef([]);
    const containerRef = useRef(null);

    const steps = [
        {
            title: 'Verified Listings',
            description: 'Every business on Jusoor is verified for identity and commercial registration. ensuring you make decisions with confidence.',
            img: '/assets/images/ver.gif',
        },
        {
            title: 'Secure & Protected Deals',
            description: 'Our process includes E-NDA agreements, verified documents, and bank transfer flows to protect both buyers and sellers at every stage.',
            img: '/assets/images/secure.gif',
        },
        {
            title: 'Transparent Business Data',
            description: 'Access detailed financial metrics, team size, key assets, and liabilities before making an offer.',
            img: '/assets/images/scan.gif',
        },
        {
            title: 'Finalized Transactions Made Easy',
            description: 'Connecting serious buyers with trusted sellers through a secure and streamlined process.',
            img: '/assets/images/curr.gif',
        },
    ];

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = stepRefs.current.indexOf(entry.target);
                        if (index !== -1) {
                            setCurrent(index);
                        }
                    }
                });
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.6,
            }
        );

        stepRefs.current.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            stepRefs.current.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const items = steps.map((item, index) => ({
        key: item.title,
        title: (
            <span
                className={`custom-step-titles ${current >= index ? 'completed' : ''}`}
                ref={(el) => (stepRefs.current[index] = el)}
            >
                {item.title}
            </span>
        ),
        description: (
            <Text className="text-white">{item.description}</Text>
        ),
    }));

    return (
        <div className="feature bg-dark-blue" ref={containerRef}>
            <div className="container">
                <Row gutter={[24, 24]} align="middle" justify="space-between">
                    <Col span={24}>
                        <Flex vertical justify="center" align="center" gap={15} className="mx-width">
                            <div className="tag fw-500">Jusoor's Features</div>
                            <Title className="m-0 text-white" level={2}>
                                Your <span className="text-brand">Trusted Saudi Marketplace</span> for Buying and Selling Businesses
                            </Title>
                            <Text className="fs-14 text-white">
                                We've built Jusoor to simplify business acquisitions and transfers with verified listings, legal security, and real support at every step.
                            </Text>
                        </Flex>
                    </Col>

                    {/* Stepper */}
                    <Col lg={{ span: 8 }} md={24} sm={24} xs={24}>
                        <Title level={5} className="text-white">
                            Here's What Sets Us Apart
                        </Title>
                        <Steps
                            current={current}
                            progressDot
                            direction="vertical"
                            items={items}
                            className="mt-3 custom-step-head"
                        />
                    </Col>

                    {/* Animated Step Content */}
                    <Col lg={{ span: 9 }} md={24} sm={24} xs={24}>
                        <div className="step-content" style={{ minHeight: 300 }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="img-size-1 h-100">
                                        <img
                                            src={steps[current].img}
                                            width="100%"
                                            height="100%"
                                            alt={steps[current].title}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export { JusoorFeature };
