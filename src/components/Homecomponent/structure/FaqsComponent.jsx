import { useState } from 'react'
import { Col, Collapse, Flex, Row, Typography ,Spin} from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import {GETFAQ} from '../../../graphql/query/queries'
import { useQuery } from "@apollo/client";

const { Text, Title } = Typography;
const { Panel } = Collapse;
const FaqsComponent = () => {
    const [currentPanel,setCurrentPanel]=useState(['0'])
    const  {data, loading , error,refetch} = useQuery(GETFAQ,{
        variables: { search: "" },
    });
    const faqsData = data?.getFAQs?.faqs?.map(item => ({
        id: item.id,
        title:item.question,
        description: item.answer,
    })) || [];
    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }
    return (
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
                                            <Title level={5} className={`m-0 fw-500 fs-17 ${currentPanel.includes(String(f)) ? 'text-brand':'text-gray'}`}>
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
    )
}

export { FaqsComponent }
