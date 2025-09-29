import { useRive } from '@rive-app/react-canvas';
import { Card, Col, Flex, Row, Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const Sellerwork = () => {
  const { t } = useTranslation();

  const rive1 = useRive({
    src: '/assets/images/riv/create_listing.riv',
    autoplay: true,
  });

  const rive2 = useRive({
    src: '/assets/images/riv/verified_seller.riv',
    autoplay: true,
  });

  const rive3 = useRive({
    src: '/assets/images/riv/receive_offers.riv',
    autoplay: true,
  });

  const rive4 = useRive({
    src: '/assets/images/riv/finalize_deal.riv',
    autoplay: true,
  });

  const data = [
    {
      id: 1,
      title: t('Create Your Listing'),
      desc: t('Add your business info, financials, and documents. It only takes a few minutes.'),
      image: <rive1.RiveComponent />,
    },
    {
      id: 2,
      title: t('Get Verified'),
      desc: t('We verify your CR, key metrics, and identity to build buyer trust.'),
      image: <rive2.RiveComponent />,
    },
    {
      id: 3,
      title: t('Receive Offers'),
      desc: t('Buyers sign an NDA to view details and send offers through our secure chat.'),
      image: <rive3.RiveComponent />,
    },
    {
      id: 4,
      title: t('Finalize the Deal'),
      desc: t('Accept the offer, upload the transfer docs, and get paid directly via bank.'),
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
            <Flex justify="center">
              <div className="riv-cs">
                {items?.image}
              </div>
            </Flex>
            <Flex vertical className="text-center" align="center">
              <Title level={2} className="m-0">
                {items?.title}
              </Title>
              <Text>{items?.desc}</Text>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { Sellerwork };
