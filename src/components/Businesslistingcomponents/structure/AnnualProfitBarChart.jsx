import { Card, Flex, Typography} from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
import ReactApexChart from 'react-apexcharts';

const { Text, Title } = Typography
const AnnualProfitBarChart = () => {

    const chartData = {
    series: [
      {
        name: 'Avg. Annual Profit',
        data: [390, 365, 200, 260, 200, 290, 350, 170, 200, 370, 350],
      },
    ],
    options: {
      chart: {
        type: 'bar',
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          borderRadiusApplication: 'end',
          columnWidth: '20%',
        }
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
        width: 2,
      },
      xaxis: {
        categories: [
          '2012',
          '2013',
          '2014',
          '2015',
          '2016',
          '2017',
          '2018',
          '2019',
          '2020',
          '2021',
          '2022',
        ],
        labels: {
          style: {
            colors: '#000',
            fontSize: '10px',
            whiteSpace: 'pre-wrap',
          },
          rotate: 0,
          formatter: function (value) {
            const maxCharsPerLine = 7;
            if (value.length > maxCharsPerLine) {
              return value.match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g'));
            }
            return value;
          },
        },
      },
      yaxis: {
        min: 0,
        max: 400,
        tickAmount: 5,
        labels: {
          style: {
            colors: '#000',
          },
        },
      },
      fill: {
        opacity: 1,
      },
      grid: {
        show: false,
      },
      colors: ['#0086FF'],
      legend: {
        show: true,
        showForSingleSeries: true,
        horizontalAlign: 'center',
        labels: {
            colors: '#000',
        }
    }
    },
  };

    return (
        <div>
            <Card className='radius-12 border-gray mb-3'>
                <Flex vertical className='mb-3'>
                    <ModuleTopHeading level={4} name='Avg. Annual Profit' />
                    <Text>
                        Similar businesses in this category typically earn this amount in yearly profit.
                    </Text>
                    <Title level={3} className='text-brand' >
                        48,000 SAR
                    </Title>
                </Flex>
                <ReactApexChart
                    options={chartData.options}
                    series={chartData.series}
                    type="bar"
                    height={300}
                />
            </Card>
        </div>
    );
};

export { AnnualProfitBarChart };
