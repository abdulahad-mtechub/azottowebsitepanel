import { Card, Col, Flex, Image, Row, Tooltip, Typography } from 'antd'
import moment from 'moment';
import { useState,useEffect } from 'react'
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography
const BusinessStats = ({data}) => {
    const { t } = useTranslation();
    const [profitTimeValue, setProfitTimeValue] = useState('Last Year');
    const [revenueTimeValue, setRevenueTimeValue] = useState('Last Year');


    useEffect(() => {
        if (data?.profittime === "6" || data?.profittime === "Last 6 Months") {
            setProfitTimeValue('Last 6 Months');
        } else {
            setProfitTimeValue('Last Year');
        }
    
        if (data?.revenueTime === "6" || data?.revenueTime === "Last 6 Months") {
            setRevenueTimeValue('Last 6 Months');
        } else {
            setRevenueTimeValue('Last Year');
        }
    }, [data?.profittime, data?.revenueTime]); 

    const months = data?.capitalRecovery ?? 0;
    
    const stats = [
        {
            id: 1,
            icon:'/assets/icons/rev.png',
            title: <><img src="/assets/icons/reyal-b.png" width={16} alt="currency-symbol" fetchPriority="high" /> {data?.revenue ? data?.revenue : '0'}</>,
            subtitle:`${t('Revenue')} ${t(revenueTimeValue) || ''}`,
        },
        {
            id: 2,
            icon:'/assets/icons/pro.png',
            title:<><img src="/assets/icons/reyal-b.png" width={16} alt="currency-symbol" fetchPriority="high" /> {data?.profit ? data?.profit : '0'}</>,
            subtitle:`${t('Profit')}  ${t(profitTimeValue) || ''}`,
        },
        {
            id: 3,
            icon:'/assets/icons/promar.png',
            title: `${data?.profitMargen ? data?.profitMargen : '0'}%`,
            subtitle: `${t('Profit Margin')}`
        },
        {
            id: 4,
            icon:'/assets/icons/cap-re.png',
            title:months >= 12 ? `${(months / 12).toFixed(1)} years` : `${months} months`,
            subtitle:`${t('Capital Recovery')}`
        },
        {
            id: 5,
            icon:'/assets/icons/foundationdate.png',
            title: data?.foundedDate ? moment(data?.foundedDate).format('YYYY') : 'N/A',
            subtitle:`${t('Foundation Date')}`
        },
        {
            id: 6,
            icon:'/assets/icons/teamsize.png',
            title:data?.numberOfEmployees ? data?.numberOfEmployees : 'N/A',
            subtitle :`${t('Team Size')}`
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
                        {(data?.isStatsVerified) ?
                            <Tooltip title={'Verified'}>
                                <Image src='/assets/icons/verified-user.png' alt='verified icon' preview={false} width={16} />
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
                                    <Image src={stat?.icon} preview={false} width={'100%'}  alt="stats icon" />
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