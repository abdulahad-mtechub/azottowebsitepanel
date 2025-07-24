import { Card, Col, Flex, Row, Typography} from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
import { Chart } from "react-google-charts";

const { Text, Title } = Typography
const MarketAreaChart = () => {

    const data = [
        ["Country", "Popularity"],
        ["China", 1000],
        ["United States", 1],
        ["Brazil", 1],
        ["Germany", 1],
        ["France", 1],
        ["Russia", 1],
        ["Canada", 1],
    ];

    const options = {
        colorAxis: { colors: ["#4285F4", "#FF0000"] },
        backgroundColor: "#fff",
        datalessRegionColor: "#f0f0f0",
        legend: "none",
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
                        <Chart
                            chartType="GeoChart"
                            width="100%"
                            height="500px"
                            data={data}
                            options={options}
                        />
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
