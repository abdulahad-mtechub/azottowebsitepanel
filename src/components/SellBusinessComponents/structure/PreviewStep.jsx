import { Card, Col, Flex, Row, Typography } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { Link } from 'react-router-dom';
import { BusinessStats } from './BusinessStats';
import { useInventColumn, useKeyassetsColumn, useLiabColumn, usePostsaleColumns } from '../../../data';
import { PreviewTableContent } from './PreviewTableContent';
import { DocumentUploadedPrev } from './DocumentUploadedPrev';
import { BusinessInfo } from './BusinessInfo';
import { GET_CATEGORY } from "../../../graphql/query/business";
import { useQuery } from '@apollo/client';

const { Title, Text } = Typography
const PreviewStep = ({data}) => {
    const postsaleColumns = usePostsaleColumns();
    const liabColumn = useLiabColumn();
    const keyassetsColumn = useKeyassetsColumn();
    const inventColumn = useInventColumn();
    const { data: categoryData } = useQuery(GET_CATEGORY, {
        variables: { getCategoryByIdId: data.categoryId },
        skip: !data.categoryId,
      });
    
      if (!data.categoryId) {
        return <p>No category selected.</p>;
      }

    const category = categoryData?.getCategoryById;

    const postsaleData = [
        {
            key: '1',
            period: data.supportDuration ? data.supportDuration : '3 Months',
            session:data.supportSession ? data.supportSession : '2 Sessions'
        }
    ]
    const liabilities = data.liabilities?.map((item, index) => ({
        key: String(index + 1),
        name: item.name || 'N/A',
        items: item.quantity || '0',
        purchaseyear: item.purchaseYear || 'N/A',
        price: item.price ? `SAR ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}` : 'SAR 0',
    })) || [];
    
    const keyassetes = data.assets?.map((item, index) => ({
        key: String(index + 1),
        name: item.name || 'N/A',
        items: item.quantity || '0',
        purchaseyear: item.purchaseYear || 'N/A',
        price: item.price ? `SAR ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}` : 'SAR 0',
    })) || [];
    
    const inventoryItems = data.inventoryItems?.map((item, index) => ({
        key: String(index + 1),
        name: item.name || 'N/A',
        items: item.quantity || '0',
        purchaseyear: item.purchaseYear || 'N/A',
        price: item.price ? `SAR ${typeof item.price === 'number' ? item.price.toLocaleString() : item.price}` : 'SAR 0',
    })) || [];
      
    return (
        <>
            <ModuleTopHeading level={4} name='Preview' className='mb-3'/>
            <Row gutter={[24,24]}>
                <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                    <Card className='shadow-d radius-12 border-gray mb-3'>
                        <Flex vertical gap={10}>
                            <Title level={5} >
                                {data.businessTitle}
                            </Title>
                            <Text>
                                {category?.name}
                            </Text>
                            <Text>
                                {data?.description}
                            </Text>
                            <Text>
                                Website: <Link to={''}>{data.url? data.url:'No URL provided'}</Link>
                            </Text>
                        </Flex>
                    </Card>
                    <BusinessStats data={data} />
                    <Card className='shadow-d radius-12 border-gray mb-3'>
                        <Flex vertical gap={10}>
                            <Title level={5}>
                                Growth Opportunity
                            </Title>
                            <Text>
                            {data?.growthOpportunities ? data.growthOpportunities : 'No Growth Opportunity Provided' }
                            </Text>
                        </Flex>
                    </Card>
                    <Card className='shadow-d radius-12 border-gray mb-3'>
                        <Flex vertical gap={10}>
                            <Title level={5}>
                                Reason for Selling
                            </Title>
                            <Text>
                            {data.reason ? data.reason : 'No Reason Provided'}
                            </Text>
                        </Flex>
                    </Card>
                    <PreviewTableContent title='Post - Sale Support' columns={postsaleColumns} data={postsaleData} />
                    <PreviewTableContent title='Outstanding Liabilities / Debt' columns={liabColumn} data={liabilities} />
                    <PreviewTableContent title='Key Asset' columns={keyassetsColumn} data={keyassetes} />
                    <PreviewTableContent title='Inventory' columns={inventColumn} data={inventoryItems} />
                    <DocumentUploadedPrev />
                </Col>
                <Col lg={{span: 6}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                    <BusinessInfo data={data} />
                </Col>
            </Row>
        </>
    )
}

export {PreviewStep}