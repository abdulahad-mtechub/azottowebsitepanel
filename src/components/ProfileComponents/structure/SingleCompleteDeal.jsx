import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd';
import { SingleInprogressSteps } from './SingleInprogressSteps';
import { OFFERBYID } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const SingleCompleteDeal = ({ completedeal, setCompleteDeal }) => {
  const { t } = useTranslation();
  const { error: offerError, data: offerData } = useQuery(OFFERBYID, {
    variables: { offerId: completedeal?.id },
    skip: !completedeal?.id,
  });

  if (offerError) return <Text type="danger">{t('Failed to load offer data')}</Text>;

  const dealInfo = [
    { title: t('Price'), desc: offerData?.price },
    { title: t('Status'), desc: offerData?.status },
    { title: t('Buyer'), desc: offerData?.buyer?.name },
    { title: t('Created At'), desc: offerData?.createdAt ? new Date(offerData.createdAt).toLocaleString() : '-' },
  ];

  return (
    <Flex vertical gap={20}>
      <Flex vertical gap={25}>
        <Breadcrumb
          separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
          items={[
            {
              title: <Text className='fs-13 text-gray cursor' onClick={() => setCompleteDeal(null)}>{t('Deals')}</Text>,
            },
            {
              title: <Text className='fw-500 fs-13 text-black'>{offerData?.business?.businessTitle}</Text>,
            },
          ]}
        />
      </Flex>

      <Flex gap={15} align='center'>
        <Button
          aria-labelledby={t('Arrow left')}
          className='border-0 p-0 bg-transparent'
          onClick={() => setCompleteDeal(null)}
        >
          <ArrowLeftOutlined />
        </Button>
        <Title level={4} className='m-0'>
          {completedeal?.title}
        </Title>
      </Flex>

      <Card className='radius-12 border-gray'>
        <div className='deals-status'>
          <Row gutter={[16, 16]}>
            {dealInfo.map((list, index) => (
              <Col xs={24} sm={12} md={6} lg={6} key={index}>
                <Flex vertical gap={0}>
                  <Text className='fw-600 fs-14'>{list?.title}</Text>
                  {list?.title === t('Status') ? (
                    list.desc === 'Completed' ? (
                      <Text className='bg-green text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                    ) : (
                      <Text className='bg-brand text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                    )
                  ) : (
                    <Text className='fs-14 fw-normal'>{list?.desc}</Text>
                  )}
                </Flex>
              </Col>
            ))}
          </Row>
        </div>

        <SingleInprogressSteps completedeal={completedeal} />
      </Card>
    </Flex>
  );
};

export { SingleCompleteDeal };
