import { Card, Col, Flex, Image, Row, Tooltip, Typography } from 'antd'
import React, { useState,useEffect } from 'react'

const { Title, Text } = Typography
const BusinessStats = ({data}) => {
    const [profitTimeValue, setProfitTimeValue] = useState('Last Year');
    const [revenueTimeValue, setRevenueTimeValue] = useState('Last Year');
    useEffect(() => {
        if (data?.profittime === 0) {
            setProfitTimeValue('Last 6 Months');
        } else {
            setProfitTimeValue('Last Year');
        }
    
        if (data?.revenueTime === 0) {
            setRevenueTimeValue('Last 6 Months');
        } else {
            setRevenueTimeValue('Last Year');
        }
    }, [data?.profittime, data?.revenueTime]); 
    
    const stats = [
        {
            id: 1,
            icon:'/assets/icons/rev.png',
            title:`SAR ${data?.revenue ? data?.revenue : '0'}`,
            subtitle:`Revenue ${revenueTimeValue ? '(Last Year)' : ''}`,
        },
        {
            id: 2,
            icon:'/assets/icons/pro.png',
            title:`SAR ${data?.profit ? data?.profit : '0'}`,
            subtitle:`Profit  ${profitTimeValue ? '(Last Year)' : ''}`,
        },
        {
            id: 3,
            icon:'/assets/icons/promar.png',
            title:`SAR ${data?.profitMargen ? data?.profitMargen : '0'}`,
            subtitle:'Profit Margin %'
        },
        {
            id: 4,
            icon:'/assets/icons/cap-re.png',
            title:'3.8 months',
            subtitle:'Capital Recovery'
        },
        {
            id: 5,
            icon:'/assets/icons/foundationdate.png',
            title:'2020',
            subtitle:'Foundation Date'
        },
        {
            id: 6,
            icon:'/assets/icons/teamsize.png',
            title:'1-10',
            subtitle:'Team Size'
        },
    ]
    return (
        <Card className='radius-12 border-gray mb-3'>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex align='center' gap={3}>
                        <Title level={5} className='m-0'>
                            Business Stats
                        </Title>
                        {(status && status.includes('Verified')) ?
                            <Tooltip title={'Verified'}>
                                <Image src='/assets/icons/verified-user.png' preview={false} width={16} />
                            </Tooltip>
                            : null
                        }
                    </Flex>
                </Col>
                {
                    stats?.map((stat,i)=>
                        <Col lg={{span: 12}} md={{span: 12}} sm={{span: 12}} xs={{span: 24}} key={i}>
                            <Flex gap={10}>
                                <div className='icon-pre'>
                                    <Image src={stat?.icon} preview={false} width={'100%'}  alt="" />
                                </div>
                                <Flex vertical gap={2}>
                                    <Flex gap={4}>
                                        <Title level={5} className='m-0'>
                                            {stat?.title}
                                        </Title>
                                    </Flex>
                                    <Text className='text-gray fs-13 fw-500'>
                                        {stat?.subtitle}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Col>
                    )
                }
            </Row>
        </Card>
    )
}

export {BusinessStats}