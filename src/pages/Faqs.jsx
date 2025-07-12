import { useState } from 'react'
import { Breadcrumb, Col, Collapse, Flex, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom';
import { faqsData } from '../data';
import { MinusOutlined, PlusOutlined, RightOutlined } from '@ant-design/icons';
import { Contactform } from '../components';

const { Text, Title } = Typography;
const { Panel } = Collapse;
const Faqs = () => {
    const navigate = useNavigate();
    const [currentPanel,setCurrentPanel]=useState(['0'])


    return (
        <>
            <div className='padd-1'>
                <div className='bg-dark-blue bread-cs mb-3'>
                    <div className='container'>
                        <Breadcrumb
                            separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                            items={[
                                {
                                    title: <Text className='cursor text-gray' onClick={() => navigate('/')}>Home</Text>,
                                },
                                {
                                    title: <Text className='fw-500 text-gray'>
                                        FAQs
                                    </Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>Frequently Asked Questions</Title>
                            <Text className='text-white'>Find answers to the most common questions about how Jusoor works, business verification, payments, and more</Text>
                        </Flex>
                    </div>
                </div>
                <div className='feature '>
                    <div className='container'>
                        <Row gutter={[24, 64]} justify={'center'}>
                            <Col span={24}>
                                <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                                    <div className='tag bg-secondary fw-500 text-brand'>FAQs</div>
                                    <Title className='m-0' level={2}>
                                        A Everything You Need to <span className='text-brand'>Know About Jusoor</span>
                                    </Title>
                                    <Text className='fs-14'>
                                        Learn how Jusoor works, how we verify businesses, and what to expect during the buying or selling process.
                                    </Text>
                                </Flex>
                            </Col>
                            <Col lg={{span: 20}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                                <Collapse
                                    className='collapse-fq'
                                    defaultActiveKey={['0']}
                                    onChange={(keys)=>{setCurrentPanel(keys)}}
                                    ghost
                                >
                                    {
                                        faqsData?.map((faq,f)=>
                                            <Panel className={currentPanel.includes(String(f)) ? 'panel-active panel' : 'panel'}  showArrow={false} 
                                                header={
                                                    <Title level={5} className={`m-0 fw-500 ${currentPanel.includes(String(f)) ? 'text-brand':'text-gray'}`}>
                                                        <span style={{marginRight: 15}}>0{f+1}</span>{faq?.title}
                                                    </Title>
                                                } key={f} 
                                                extra={((currentPanel?.findIndex(x=>x==f))>-1) ?
                                                <MinusOutlined 
                                                    style={{transition: 'transform 0.2s ease-in-out', fontSize: 18}} />
                                                :
                                                <PlusOutlined
                                                    style={{transition: 'transform 0.2s ease-in-out', fontSize: 18}}/>}
                                                    
                                            >
                                                <div>
                                                    <Text className='fs-16'>
                                                        {faq?.description}
                                                    </Text>
                                                </div>
                                            </Panel>
                                        )
                                    }
                                </Collapse>
                            </Col>
                        </Row>
                    </div>
                </div> 
            </div>
            <Contactform />
        </>
    )
}

export { Faqs }
