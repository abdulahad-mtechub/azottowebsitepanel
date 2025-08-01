import { useRive } from '@rive-app/react-canvas';
import { Card, Col, Flex, Image, Row, Typography } from 'antd';

const { Text, Title } = Typography;

const Sellerwork = () => {
  const rive1 = useRive({
    src: '/assets/images/riv/create_listing.riv',
    autoplay: true,
  });

  const rive2 = useRive({
    src: '/assets/images/riv/verified_seller.riv',
    autoplay: true,
  });

  const rive3 = useRive({
    src: '/assets/images/riv/sign-meet.riv',
    autoplay: true,
  });

  const rive4 = useRive({
    src: '/assets/images/riv/finalize_deal.riv',
    autoplay: true,
  });

  const data = [
    {
      id: 1,
      title: 'Create Your Listing',
      desc: 'Add your business info, financials, and documents. It only takes a few minutes.',
      image: <rive1.RiveComponent />,
    },
    {
      id: 2,
      title: 'Get Verified',
      desc: 'We verify your CR, key metrics, and identity to build buyer trust.',
      image: <rive2.RiveComponent />,
    },
    {
      id: 3,
      title: 'Receive Offers',
      desc: 'Buyers sign an NDA to view details and send offers through our secure chat.',
      image: <rive3.RiveComponent />,
    },
    {
      id: 4,
      title: 'Finalize the Deal',
      desc: 'Accept the offer, upload the transfer docs, and get paid directly via bank.',
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
          <Card
            className="border-0 h-100 work-cd bg-transparent"
            actions={[
              <Flex vertical className="text-center" align="center">
                <Title level={4} className="m-0">
                  {items?.title}
                </Title>
                <Text>{items?.desc}</Text>
              </Flex>,
            ]}
          >
            <Flex justify="center">
              {/* <Image preview={false} src={items?.image} /> */}
              <div style={{ width: '100%', height: 300 }}>
                {items?.image}
              </div>
            </Flex>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export { Sellerwork };
