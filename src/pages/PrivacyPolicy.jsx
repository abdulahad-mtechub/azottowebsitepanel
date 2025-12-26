import { Breadcrumb, Card, Col, Flex, Row, Typography, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { GETPRIVACYPOLICY } from '../graphql/query/queries';

const { Text, Title, Paragraph } = Typography;

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { data, loading } = useQuery(GETPRIVACYPOLICY);

  const lang = localStorage.getItem('lang') || 'en';
  const isArabic = lang === 'ar';

  if (loading) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  const privacyPolicy = data?.getPrivacyPolicy?.[0];
  const policyContent = isArabic ? privacyPolicy?.arabicPolicy : privacyPolicy?.policy;

  return (
    <>
      <div className='padd-1'>
        <div className='bg-dark-blue bread-cs mb-3'>
          <div className='container'>
            <Breadcrumb
              separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
              items={[
                {
                  title: <Text className='cursor text-gray' onClick={() => navigate('/')}>{t("Home")}</Text>,
                },
                {
                  title: <Text className='fw-500 text-white'>{t("Jusoor Privacy Policy")}</Text>,
                },
              ]}
            />
            <Flex vertical gap={15} className='w-100 search-cs text-center'>
              <Title level={2} className='text-white m-0'>{t("Jusoor Privacy Policy")}</Title>
              <Text className='text-light-gray fs-16'>{t("Must you know about privacy policy of Jusoor")}</Text>
            </Flex>
          </div>
        </div>

        <div className='feature'>
          <div className='container'>
            <Row gutter={[24, 64]} justify={'center'}>
              <Col span={24}>
                <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                  <div className='tag bg-secondary fw-500 text-brand'>{t("Jusoor Privacy Policy")}</div>
                  <Title className='m-0' level={2}>
                    {t("Your Privacy")}, <span className='text-brand'>{t("Our Priority")}</span>
                  </Title>
                  <Text className='fs-14'>
                    {t("At Jusoor, we value your trust. This Privacy Policy explains how we collect, use, and protect your personal data when you access or use our platform.")}
                  </Text>
                </Flex>
              </Col>

              <Col lg={{ span: 22 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                <Card className='bg-light-white border-gray'>
                  <Flex vertical gap={20}>
                    <div>
                      <Paragraph className='fs-14 text-gray'>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: policyContent?.content,
                          }}
                        />
                      </Paragraph>
                    </div>
                  </Flex>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  );
};

export { PrivacyPolicy };
