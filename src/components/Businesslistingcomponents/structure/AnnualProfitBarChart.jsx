import { Card, Flex, Typography } from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const AnnualProfitBarChart = ({ graphData }) => {
  const { t } = useTranslation();

  const graph = graphData?.similerBusinessAvgAnualProfit?.graph;

  const chartData = {
    series: [
      {
        name: t('Avg. Annual Profit'),
        data: graph?.map(item => item?.profit), // profit values
      },
    ],
    options: {
      chart: {
        type: 'bar',
        toolbar: { show: false },
      },
      plotOptions: {
        bar: {
          borderRadius: 1,
          borderRadiusApplication: 'end',
          columnWidth: '20%',
        }
      },
      dataLabels: { enabled: false },
      stroke: { curve: 'smooth', width: 2 },
      xaxis: {
        categories: graph?.map(item => item?.year), // year labels
        labels: {
          style: { colors: '#000', fontSize: '10px', whiteSpace: 'pre-wrap' },
          rotate: 0,
          formatter: function(value) {
            const maxCharsPerLine = 7;
            if (value.toString().length > maxCharsPerLine) {
              return value.toString().match(new RegExp(`.{1,${maxCharsPerLine}}`, 'g'));
            }
            return value;
          }
        }
      },
      yaxis: {
        min: 0,
        max: Math.max(...(graph?.map(item => item?.profit) || [0])) * 1.1,
        tickAmount: 5,
        labels: { style: { colors: '#000' } }
      },
      fill: { opacity: 1 },
      grid: { show: false },
      colors: ['#0086FF'],
      legend: {
        show: true,
        showForSingleSeries: true,
        horizontalAlign: 'center',
        labels: { colors: '#000' }
      }
    }
  };

  return (
    <div>
      <Card className='radius-12 border-gray bg-lightest-gray mb-3'>
        <Flex vertical className='mb-3'>
          <ModuleTopHeading level={4} name={t('Avg. Annual Profit')} />
          <Text>
            {t('Similar businesses in this category typically earn this amount in yearly profit.')}
          </Text>
          <Title level={3} className='text-brand'>
            <img src="/assets/icons/reyal-b.png" width={20} alt="currency-symbol" fetchPriority="high"/> 48,000
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
