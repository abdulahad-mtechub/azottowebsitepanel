import { Row, Col, Card, Flex, Typography } from 'antd'
import { AnnualProfitBarChart, MarketAreaChart } from '../../Businesslistingcomponents'
import { BusinessViewInfoCard } from './BusinessViewInfoCard';
import { BusinessStats ,PreviewTableContent} from '../../SellBusinessComponents';
import { inventColumn, keyassetsColumn, liabColumn, postsaleColumns } from '../../../data';
import { useQuery } from '@apollo/client';
import { SIMILER_BUSINESS_CATEGORY_GRAPH } from '../../../graphql/query/business';

const { Text, Title } = Typography;
const SellerDealDetails = ({ data }) => {
    const businessinfo = data;
    const postSaleData = [
        {
          key: '1',
          period: businessinfo?.suppportDuration || 'N/A',
          session: businessinfo?.supportSession || 'N/A',
          verified: businessinfo?.isSupportVerified, // 1 or 0
        }
    ];

    const liabilitiesData = businessinfo?.liabilities?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: `SAR ${item?.price.toLocaleString()}`,
    }));
      
    const assetsData = businessinfo?.assets?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item?.purchaseYear,
        price: `SAR ${item?.price.toLocaleString()}`,
    }));
      
    const inventoryData = businessinfo?.inventoryItems?.map((item, index) => ({
        key: item.id || index,
        name: item.name,
        items: item.quantity,
        purchaseyear: item.purchaseYear,
        price: `SAR ${item.price?.toLocaleString()}`,
    }));
    const { data:graphData, loading:graphLoading, error:graphError } = useQuery(SIMILER_BUSINESS_CATEGORY_GRAPH, {
        variables: { getBusinessByIdId: businessinfo?.id },
    });

    return (
        <Row gutter={[24, 24]}>
            <Col span={24}>
                <Card className='radius-12 border-gray mb-3'>
                    <Flex vertical gap={10}>
                        <Flex vertical gap={3}>
                            <Text className='fs-13 text-gray fw-500'>Reference #:{businessinfo?.reference ? businessinfo?.reference: 'Not Found'}</Text>
                            <Title level={5} className='m-0'>
                            {businessinfo?.businessTitle ? businessinfo?.businessTitle : 'Not Found'}
                            </Title>
                        </Flex>
                        <Text>
                        {businessinfo?.description ? businessinfo?.description : 'Not Found'}
                        </Text>
                    </Flex>
                </Card>
                <BusinessViewInfoCard  data={businessinfo} />
                <BusinessStats data={businessinfo} />
                <MarketAreaChart  data={businessinfo} />
                <AnnualProfitBarChart graphData={graphData} />
                <Card className='radius-12 border-gray mb-3'>
                    <Flex vertical gap={10}>
                        <Title level={5}>
                            Growth Opportunity
                        </Title>
                        <Text>
                        {businessinfo?.growthOpportunities ? businessinfo?.growthOpportunities : 'No growth opportunity details available.'}
                        </Text>
                    </Flex>
                </Card>
                <Card className='radius-12 border-gray mb-3'>
                    <Flex vertical gap={10}>
                        <Title level={5}>
                            Reason for Selling
                        </Title>
                        <Text>
                        {businessinfo?.reason ? businessinfo?.reason : 'No reason for selling provided.'}
                        </Text>
                    </Flex>
                </Card>
                <PreviewTableContent title='Post - Sale Support' columns={postsaleColumns} data={postSaleData} />
                <PreviewTableContent title='Outstanding Liabilities / Debt' columns={liabColumn} data={liabilitiesData} />
                <PreviewTableContent title='Key Asset' columns={keyassetsColumn} data={assetsData} />
                <PreviewTableContent title='Inventory' columns={inventColumn} data={inventoryData} />
            </Col>
        </Row>
    )
}

export { SellerDealDetails } 
