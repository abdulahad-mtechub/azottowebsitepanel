import { Row, Col, Card, Flex, Typography, Button } from 'antd';
import { AnnualProfitBarChart, MarketAreaChart } from '../../Businesslistingcomponents';
import { BusinessViewInfoCard } from './BusinessViewInfoCard';
import { BusinessStats, PreviewTableContent } from '../../SellBusinessComponents';
import { useInventColumn, useKeyassetsColumn, useLiabColumn, usePostsaleColumns } from '../../../data';
import { useQuery } from '@apollo/client';
import { SIMILER_BUSINESS_CATEGORY_GRAPH } from '../../../graphql/query/business';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const SellerDealDetails = ({ data }) => {
  const { t } = useTranslation();
  const postsaleColumns = usePostsaleColumns();
  const liabColumn = useLiabColumn();
  const keyassetsColumn = useKeyassetsColumn();
  const inventColumn = useInventColumn();
  const businessinfo = data;
  const postSaleData = [
    {
      key: '1',
      period: businessinfo?.supportDuration || t('N/A'),
      session: businessinfo?.supportSession || t('N/A'),
      verified: businessinfo?.isSupportVerified,
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

  const { data: graphData } = useQuery(SIMILER_BUSINESS_CATEGORY_GRAPH, {
    variables: { getBusinessByIdId: businessinfo?.id },
  });

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
          <Flex vertical gap={20}>    
            <Flex vertical gap={10}>
                <Flex vertical gap={12}>
                    <Text className='fs-13 text-gray fw-500'>{t('Reference #')}: {businessinfo?.reference || t('Not Found')}</Text>
                    <Title level={4} className='m-0'>{businessinfo?.businessTitle}</Title>
                    <Flex align='center' gap={5}>
                        <Title level={5} className='m-0'>{businessinfo?.title}</Title>
                        {businessinfo?.type && (
                            <Button className={`fs-12 border-0 text-white ${businessinfo.type === 'Taqbeel' ? 'bg-brand' : 'bg-black'}`}>
                                {businessinfo?.type}
                            </Button>
                        )
                        }
                    </Flex>
                </Flex>
                <Text className='text-justify'>{businessinfo?.description || t('No description available.')}</Text>
            </Flex>
          </Flex>
        </Card>
        <BusinessViewInfoCard data={businessinfo} />
        <BusinessStats data={businessinfo} />
        <MarketAreaChart data={businessinfo} />
        <AnnualProfitBarChart graphData={graphData} />
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
          <Flex vertical gap={0}>
            <Title level={5}>{t('Growth Opportunity')}</Title>
            <Text className='text-justify'>{businessinfo?.growthOpportunities || t('No growth opportunity details available.')}</Text>
          </Flex>
        </Card>
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
          <Flex vertical gap={0}>
              <Title level={5}>{t('Reason for Selling')}</Title>
              <Text className='text-justify'>{businessinfo?.reason || t('No reason for selling provided.')}</Text>
          </Flex>
        </Card>
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
          <PreviewTableContent title={t('Post - Sale Support')} columns={postsaleColumns} data={postSaleData} />
        </Card>
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
            <PreviewTableContent title={t('Outstanding Liabilities / Debt')} columns={liabColumn} data={liabilitiesData} />
        </Card>
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
          <PreviewTableContent title={t('Key Asset')} columns={keyassetsColumn} data={assetsData} />
        </Card>
        <Card className='shadow-d radius-12 border-gray bg-lightest-gray mb-3'>
            <PreviewTableContent title={t('Inventory')} columns={inventColumn} data={inventoryData} />
        </Card>
      </Col>
    </Row>
  );
};

export { SellerDealDetails };
