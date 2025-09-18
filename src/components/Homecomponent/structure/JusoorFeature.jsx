import { Col, Steps, Typography, Row, Flex } from 'antd';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const { Text, Title } = Typography;

const JusoorFeature = () => {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const totalSteps = 4;

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
    gsap.registerPlugin(ScrollTrigger);

    // Clear any existing animations
    if (animationRef.current) {
      animationRef.current.kill();
    }

    animationRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: `bottom+=${(totalSteps - 1) * window.innerHeight} bottom`,
      pin: true,
      scrub: 0.8,
      markers: false,
      onUpdate: (self) => {
        const progress = self.progress * (totalSteps - 1);
        const newIndex = Math.min(totalSteps - 1, Math.max(0, Math.round(progress)));
        
        if (newIndex !== current) {
          setCurrent(newIndex);
        }
      },
      onEnter: () => setCurrent(0),
      onLeave: () => setCurrent(totalSteps - 1),
      onEnterBack: () => setCurrent(totalSteps - 1),
      onLeaveBack: () => setCurrent(0)
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, []);

  const items = steps.map((item, index) => ({
    key: item.title,
    title: (
      <span className={`custom-step-titles ${current >= index ? 'completed' : ''}`}>
        {item.title}
      </span>
    ),
    description: <Text className={`custom-step-titles ${current >= index ? 'completed' : ''}`}>{item.description}</Text>,
  }));

  return (
    <div className="feature bg-dark-blue" ref={containerRef}>
      <div className="container">
        <Row gutter={[24, 12]} align="middle" justify="space-between">
          <Col span={24}>
            <Flex vertical justify="center" align="center" gap={15} className="mx-width">
              <div className="tag fw-500">Jusoor's Features</div>
              <Title className="m-0 text-white" level={2}>
                Your <span className="text-brand">Trusted Saudi Marketplace</span> for Buying and Selling Businesses
              </Title>
            </Flex>
          </Col>

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

          <Col lg={{ span: 9 }} md={24} sm={24} xs={24}>
            <div className="step-content minheight-60vh" >
              <AnimatePresence mode="wait">
                <motion.div
                  key={steps[current].title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ 
                    duration: 0.4,
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                >
                  <div className="img-size-1 h-100">
                    <img
                      src={steps[current].img}
                      width="100%"
                      height="100%"
                      alt={steps[current].title}
                      className='object-contain'
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