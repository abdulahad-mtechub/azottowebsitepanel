import { useRef, useState, useEffect } from 'react';
import { Col, Flex, Image, Row, Timeline, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const SellerContent = () => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t('Create Your Listing'),
      description: t('Add your business info, financials, brand documents. It only takes a few minutes.'),
      image: '/assets/images/2.png',
    },
    {
      title: t('Get Verified'),
      description: t('We verify your CR, key metrics, and identity to build buyer trust.'),
      image: '/assets/images/2.png',
    },
    {
      title: t('Receive Offers'),
      description: t('Buyers sign an NDA to view details and send offers through our secure chat.'),
      image: '/assets/images/2.png',
    },
    {
      title: t('Finalize the Deal'),
      description: t('Accept the offer, upload the transfer docs, and get paid directly via bank.'),
      image: '/assets/images/2.png',
    },
  ];

  const stepRefs = useRef([]);
  const containerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isScrolling) return;

      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.offsetHeight;
      const scrollPosition = window.scrollY;

      const progress = Math.min(1, Math.max(0, (scrollPosition - containerTop) / containerHeight));
      const stepCount = steps.length;
      const newActiveStep = Math.min(stepCount - 1, Math.floor(progress * stepCount));

      if (newActiveStep !== activeStep) {
        setActiveStep(newActiveStep);
      }
    };

    const handleTimelineClick = (index) => {
      if (isScrolling || index === activeStep) return;

      setIsScrolling(true);
      setActiveStep(index);

      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const containerHeight = container.offsetHeight;
      const stepHeight = containerHeight / steps.length;
      const targetScroll = containerTop + index * stepHeight;

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });

      setTimeout(() => setIsScrolling(false), 1000);
    };

    window.addEventListener('scroll', handleScroll);

    stepRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.addEventListener('click', () => handleTimelineClick(index));
      }
    });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      stepRefs.current.forEach((ref, index) => {
        if (ref) {
          ref.removeEventListener('click', () => handleTimelineClick(index));
        }
      });
    };
  }, [isScrolling, activeStep, steps.length]);

  return (
    <div ref={containerRef}>
      <Row gutter={[24, 24]} className="mt-2">
        <Col lg={12} md={24} sm={24} xs={24} className="sticky-top">
          <Flex align="center" justify="center" className="w-100 h-500">
            <Image
              src={steps[activeStep].image}
              width="100%"
              height="100%"
              style={{ transition: 'opacity 0.5s ease' }}
              className="object-contain maxwidth-100 maxheight-100"
              alt={steps[activeStep].title}
              preview={false}
            />
          </Flex>
        </Col>
        <Col lg={12} md={24} sm={24} xs={24}>
          <Flex vertical gap={20} className="m-ps-3 p-40-0">
            <Title level={4}>
              {t('Selling Your Business Is')} <span className="text-brand">{t('Straightforward')}</span>
            </Title>

            <Timeline
              className="w-100 maxwidth-450"
              items={steps.map((step, index) => ({
                dot: (
                  <img
                    src="/assets/icons/timeline.png"
                    width={20}
                    height={20}
                    alt={`Step ${index + 1}`}
                    style={{
                      opacity: activeStep === index ? 1 : 0.4,
                      transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      filter:
                        activeStep === index ? 'drop-shadow(0 0 2px rgba(24, 144, 255, 0.3))' : 'none',
                    }}
                  />
                ),
                children: (
                  <div
                    ref={(el) => (stepRefs.current[index] = el)}
                    style={{
                      opacity: activeStep === index ? 1 : 0.4,
                      transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      cursor: 'pointer',
                      padding: '8px 0',
                      willChange: 'opacity',
                    }}
                  >
                    <Title level={5} className="fw-500 mb-2">
                      {step.title}
                    </Title>
                    <Text className="fs-14 lh-1-5">{step.description}</Text>
                  </div>
                ),
              }))}
            />
          </Flex>
        </Col>
      </Row>
    </div>
  );
};

export { SellerContent };
