import React from 'react'
import { Row, Col, Card, Flex, Typography } from 'antd'
import { AnnualProfitBarChart, MarketAreaChart } from '../../Businesslistingcomponents'
import { BusinessVuewInfoCard } from './BusinessViewInfoCard';
import { BusinessStats ,PreviewTableContent} from '../../SellBusinessComponents';
import { inventColumn, inventData, keyassetData, keyassetsColumn, liabColumn, liabilityData, postsaleColumns, postsaleData } from '../../../data';
const { Text, Title } = Typography;
const SellerDealDetails = ({ data }) => {
    const businessinfo = data?.businessInfoData;
    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                <Card className='radius-12 border-gray mb-3'>
                    <Flex vertical gap={10}>
                        <Flex vertical gap={3}>
                            <Text className='fs-13 text-gray fw-500'>Reference #: {data?.ref}</Text>
                            <Title level={5} className='m-0'>
                                Al Madinah Coffee Shop
                            </Title>
                        </Flex>
                        <Text>
                            Al Madinah Coffee Shop is a well-established café located in the heart of Al-Malaz, Riyadh. Operating for over 3 years, it has built a strong reputation among local residents and office workers for its premium coffee, cozy seating, and consistent service. The business runs from a fully furnished commercial unit with a stylish interior, dedicated staff, and all necessary licenses in place.
                        </Text>
                        <Text>
                            This café averages SAR 250,000 in annual revenue with a healthy annual profit of SAR 75,000. Its location offers strong foot traffic, especially during morning and late evening hours. Key assets include high-end espresso machines, seating furniture, POS system, and a fully branded visual identity. The owner is willing to offer 30 days of post-sale support, including supplier contacts, staff training, and marketing handover.
                        </Text>
                    </Flex>
                </Card>
                <BusinessVuewInfoCard />
                <BusinessStats data={businessinfo} />
                <MarketAreaChart />
                <AnnualProfitBarChart />
                <Card className='radius-12 border-gray mb-3'>
                    <Flex vertical gap={10}>
                        <Title level={5}>
                            Growth Opportunity
                        </Title>
                        <Text>
                            The café has strong potential for growth by introducing an online ordering system, partnering with food delivery apps, and expanding into nearby residential areas. Franchising or launching a second location in a busy district can further increase revenue.
                        </Text>
                    </Flex>
                </Card>
                <Card className='radius-12 border-gray mb-3'>
                    <Flex vertical gap={10}>
                        <Title level={5}>
                            Reason for Selling
                        </Title>
                        <Text>
                            The owner is relocating abroad for personal reasons and is looking for a serious buyer to take over and continue the café’s success.
                        </Text>
                    </Flex>
                </Card>
                <PreviewTableContent title='Post - Sale Support' columns={postsaleColumns} data={postsaleData} />
                <PreviewTableContent title='Outstanding Liabilities / Debt' columns={liabColumn} data={liabilityData} />
                <PreviewTableContent title='Key Asset' columns={keyassetsColumn} data={keyassetData} />
                <PreviewTableContent title='Inventory' columns={inventColumn} data={inventData} />
            </Col>
        </Row>
    )
}

export { SellerDealDetails } 
