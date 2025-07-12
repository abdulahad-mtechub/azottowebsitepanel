import { Card, Col, Flex, Form, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { Link } from 'react-router-dom';
import { BusinessStats } from './BusinessStats';
import { inventColumn, inventData, keyassetData, keyassetsColumn, liabColumn, liabilityData, postsaleColumns, postsaleData } from '../../../data';
import { PreviewTableContent } from './PreviewTableContent';
import { DocumentUploadedPrev } from './DocumentUploadedPrev';
import { BusinessInfo } from './BusinessInfo';

const { Title, Text } = Typography
const PreviewStep = () => {

    const [form] = Form.useForm();    

    return (
        <>
            <ModuleTopHeading level={4} name='Preview' className='mb-3'/>
            <Row gutter={[24,24]}>
                <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                    <Card className='shadow-d radius-12 border-gray mb-3'>
                        <Flex vertical gap={10}>
                            <Title level={5} >
                                Al Madinah Coffee Shop
                            </Title>
                            <Text>
                                Al Madinah Coffee Shop is a well-established café located in the heart of Al-Malaz, Riyadh. Operating for over 3 years, it has built a strong reputation among local residents and office workers for its premium coffee, cozy seating, and consistent service. The business runs from a fully furnished commercial unit with a stylish interior, dedicated staff, and all necessary licenses in place.
                            </Text>
                            <Text>
                                This café averages SAR 250,000 in annual revenue with a healthy annual profit of SAR 75,000. Its location offers strong foot traffic, especially during morning and late evening hours. Key assets include high-end espresso machines, seating furniture, POS system, and a fully branded visual identity. The owner is willing to offer 30 days of post-sale support, including supplier contacts, staff training, and marketing handover.
                            </Text>
                            <Text>
                                Website: <Link to={''}>http://almadinahcoffeeshop.com</Link>
                            </Text>
                        </Flex>
                    </Card>
                    <BusinessStats />
                    <Card className='shadow-d radius-12 border-gray mb-3'>
                        <Flex vertical gap={10}>
                            <Title level={5}>
                                Growth Opportunity
                            </Title>
                            <Text>
                                The café has strong potential for growth by introducing an online ordering system, partnering with food delivery apps, and expanding into nearby residential areas. Franchising or launching a second location in a busy district can further increase revenue.
                            </Text>
                        </Flex>
                    </Card>
                    <Card className='shadow-d radius-12 border-gray mb-3'>
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
                    <DocumentUploadedPrev />
                </Col>
                <Col lg={{span: 6}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                    <BusinessInfo />
                </Col>
            </Row>
        </>
    )
}

export {PreviewStep}