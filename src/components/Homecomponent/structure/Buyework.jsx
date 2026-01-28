import { useRive } from '@rive-app/react-canvas';
import { Card, Col, Flex, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const Buyework = () => {
  const { t } = useTranslation();

  const rive1 = useRive({
    src: '/assets/images/riv/business_listing.riv',
    autoplay: true,
  });

  const rive2 = useRive({
    src: '/assets/images/riv/send_offer.riv',
    autoplay: true,
  });

  const rive3 = useRive({
    src: '/assets/images/riv/sign_&_virutal_meeting.riv',
    autoplay: true,
  });

  const rive4 = useRive({
    src: '/assets/images/riv/finalize_deal.riv',
    autoplay: true,
  });

  const data = [
    {
      id: 1,
      title: t('Explore Listings'),
      desc: t('Browse verified businesses across Saudi Arabia by category, location, or revenue.'),
      image: <rive1.RiveComponent />,
    },
    {
      id: 2,
      title: t('Negotiate or Buy Instantly'),
      desc: t('With a single click, move to the payment step or buy the business without further delays.'),
      image: <rive2.RiveComponent />,
    },
    {
      id: 3,
      title: t('Sign NDA & Virtual Meeting'),
      desc: t('Sign the NDA to access more info and book a virtual meeting.'),
      image: <rive3.RiveComponent />,
    },
    {
      id: 4,
      title: t('Close the Deal'),
      desc: t('Azottogenerates a sale agreement. Pay via bank and receive ownership'),
      image: <rive4.RiveComponent />,
    },
  ];

  return (
    <Row gutter={[24, 24]} className="mt-3">
      {data?.map((items, index) => (
        <Col
          lg={{ span: 6 }}
          md={{ span: 12 }}
          sm={{ span: 24 }}
          xs={{ span: 24 }}
          key={index}
        >
          <Card className="border-0 h-100 work-cd bg-transparent">
            <Flex vertical align="center" gap={20}>
            <Flex justify="center">
              <div className="riv-cs">{items?.image}</div>
            </Flex>
            <Flex vertical className="text-center" align="center" gap={8}>
              <Title level={4} className="m-0">
                {items?.title}
              </Title>
              <Text>{items?.desc}</Text>
            </Flex>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { Buyework };
