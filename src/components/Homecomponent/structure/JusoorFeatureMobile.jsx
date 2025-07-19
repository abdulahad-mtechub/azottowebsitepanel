import React, { useEffect, useRef } from 'react'
import { Col, Flex, Image, Row, Typography } from 'antd'
// import Lenis from 'lenis';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import gsap from 'gsap';

const { Text, Title } = Typography
const JusoorFeatureMobile = () => {

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

    // const lenis = new Lenis()
    // lenis.on('scroll', ()=>{})
    // function raf(time){
    //     lenis.raf(time);
    //     requestAnimationFrame(raf);
    // }
    // requestAnimationFrame(raf)

  return (
    <div className="feature bg-dark-blue">
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

                    {/* Animated Step Content */}
                    <Col span={24} className='overflow-hidden'>
                        <div ref={containerRef}>
                            <Flex align='center' gap={30} className='min-h-screen text-center overflow-hidden' style={{ width: `calc(100vw * ${steps.length})` }}>
                                {
                                    steps?.map((list,i)=>
                                        <Flex vertical align='center' justify='center' key={i} className='overflow-hidden min-h-screen' style={{width: '100vw'}}
                                            ref={(ref)=>imgRef.current[i] = ref}
                                        >
                                            <Image
                                                src={list?.img}
                                                alt={list?.title}
                                                preview={false}
                                                width={500}
                                            />
                                            <Flex vertical gap={5} align='center' style={{maxWidth: 400}}>
                                                <Title level={5} className='m-0 text-white'>{list?.title}</Title>
                                                <Text className="fs-13 text-white">
                                                    {
                                                        list?.description
                                                    }
                                                </Text>
                                            </Flex>
                                        </Flex>
                                    )
                                }
                            </Flex>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
  )
}

export {JusoorFeatureMobile}