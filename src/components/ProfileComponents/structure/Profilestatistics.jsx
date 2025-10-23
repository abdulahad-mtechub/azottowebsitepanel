import { Card, Row, Col, Typography, Flex, Image, DatePicker } from 'antd';
import { ModuleTopHeading } from '../../Pagecomponents';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const Profilestatistics = ({ data, title, dateRange, onDateRangeChange }) => {
  const { t } = useTranslation();

  // Default to current month if dateRange is not provided
  const defaultDateRange = dateRange || [
    dayjs().startOf('month'),
    dayjs().endOf('month')
  ];

  return (
    <Card className='rounded-12 border-gray'>
      <Flex justify='space-between' align='center'>
        <ModuleTopHeading level={4} name={t(title)} />
        <RangePicker
          value={defaultDateRange}
          onChange={onDateRangeChange}
          format='YYYY-MM-DD'
          placeholder={[t('Start Date'), t('End Date')]}
          className='w-auto'
        />
      </Flex>
      <Row gutter={[16, 16]} className='mt-2'>
        {data?.map((item, i) => (
          <Col lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} key={i}>
            <Card className='h-100 border-gray rounded-12'>
              <Flex vertical gap={15}>
                <Image src={item?.img} alt={t('icon')} preview={false} width={40} />
                <div>
                  <Text className='fs-14 text-gray'>
                    {t(item?.title)}
                  </Text>
                  <Title className='m-0' level={5}>
                    {item?.numbers}
                  </Title>
                </div>
              </Flex>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export { Profilestatistics };
