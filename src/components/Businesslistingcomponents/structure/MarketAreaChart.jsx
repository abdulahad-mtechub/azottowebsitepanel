import { Card, Col, Flex, Row, Typography } from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
import { useTranslation } from 'react-i18next';
import Chart from 'react-google-charts';

const { Text, Title } = Typography;

const MarketAreaChart = () => {
    const { t } = useTranslation();

    const data = [
        [t('Province'), t('Market Potential')],
        ['Riyadh', 1000],
        ['Makkah', 900],
        ['Madinah', 800],
        ['Eastern Province', 750],
        ['Qassim', 700],
        ['Asir', 600],
        ['Tabuk', 500],
        ['Hail', 450],
        ['Northern Borders', 300],
        ['Jizan', 350],
        ['Najran', 400],
        ['Al Bahah', 320],
        ['Al Jawf', 280],
    ];
      
    const options = {
        region: 'SA',
        displayMode: 'regions',
        colorAxis: { colors: ['#E3F2FD', '#0D47A1'] },
        backgroundColor: '#0D47A1',
        datalessRegionColor: '#0D47A1',
        legend: { position: 'bottom' },
    };

    return (
        <div>
            <Card className='radius-12 border-gray bg-lightest-gray mb-3'>
                <Flex vertical className='mb-3'>
                    <ModuleTopHeading level={4} name={t('Market Potential by Location')} />
                    <Text>
                        {t('Analyze local business trends, growth potential, and demand to make smarter buying decisions.')}
                    </Text>
                </Flex>
                <Row gutter={[24,12]} align={'middle'}>
                    <Col lg={{span: 14}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        {/* <Chart
                            chartType="GeoChart"
                            width="100%"
                            height="500px"
                            data={data}
                            options={options}
                        /> */}
                    </Col>
                    <Col lg={{span: 10}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                        <Card className='rounded-12 border-gray'>
                            <Title level={5} className='text-center'>
                                {t('Regional Market Indicators')}
                            </Title>
                            <Row gutter={[24,24]} className='mt-3' justify={'space-between'}>
                                <Col span={12}>
                                    <Flex vertical gap={10}>
                                        <Text>{t('Local Business Growth')}</Text>
                                        <Text>{t('Population Density')}</Text>
                                        <Text>{t('Industry Demand')}</Text>
                                    </Flex>
                                </Col>
                                <div className='horizontalline' />
                                <Col span={11}>
                                    <Flex vertical gap={10}>
                                        <Text>+4.3% (YoY)</Text>
                                        <Text>{t('High')}</Text>
                                        <Text>{t('High')}</Text>
                                    </Flex>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export { MarketAreaChart };
