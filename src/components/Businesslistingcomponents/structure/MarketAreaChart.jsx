import { Card, Col, Flex, Row, Typography} from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
// import { Chart } from "react-google-charts";

const { Text, Title } = Typography
const MarketAreaChart = () => {

    const data = [
        ['Province', 'Market Potential'],
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
        displayMode: 'regions',  // fills provinces (may not color perfectly)
        colorAxis: { colors: ['#E3F2FD', '#0D47A1'] },
        backgroundColor: '#fff',
        datalessRegionColor: '#f0f0f0',
        legend: { position: 'bottom' },
      };

    return (
        <div>
            <Card className='radius-12 border-gray mb-3'>
                <Flex vertical className='mb-3'>
                    <ModuleTopHeading level={4} name='Market Potential by Location' />
                    <Text>
                        Analyze local business trends, growth potential, and demand to make smarter buying decisions.
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
                                Regional Market Indicators
                            </Title>
                            <Row gutter={[24,24]} className='mt-3' justify={'space-between'}>
                                <Col span={11}>
                                    <Flex vertical gap={5}>
                                        <Text>Local Business Growth</Text>
                                        <Text>Population Density</Text>
                                        <Text>Industry Demand</Text>
                                    </Flex>
                                </Col>
                                <div className='horizontalline' />
                                <Col span={11}>
                                    <Flex vertical gap={5}>
                                        <Text>+4.3% (YoY)</Text>
                                        <Text>High</Text>
                                        <Text>High</Text>
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
