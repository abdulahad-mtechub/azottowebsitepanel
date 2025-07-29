import { useRive } from '@rive-app/react-canvas';
import { Card, Col, Flex, Image, Row, Typography } from 'antd';

const { Text, Title } = Typography;

const Sellerwork = () => {
  // const rive1 = useRive({
  //   src: '/assets/images/riv/buslisting.riv',
  //   autoplay: true,
  // });

  // const rive2 = useRive({
  //   src: '/assets/images/riv/offer.riv',
  //   autoplay: true,
  // });

  // const rive3 = useRive({
  //   src: '/assets/images/riv/sample1.riv',
  //   autoplay: true,
  // });

  const data = [
    {
      id: 1,
      title: 'Create Your Listing',
      desc: 'Add your business info, financials, and documents. It only takes a few minutes.',
      image: '/assets/images/create-listing.gif',
    },
    {
      id: 2,
      title: 'Get Verified',
      desc: 'We verify your CR, key metrics, and identity to build buyer trust.',
      image: '/assets/images/verify.gif',
    },
    {
      id: 3,
      title: 'Receive Offers',
      desc: 'Buyers sign an NDA to view details and send offers through our secure chat.',
      image: '/assets/images/offer.gif',
    },
    {
      id: 4,
      title: 'Finalize the Deal',
      desc: 'Accept the offer, upload the transfer docs, and get paid directly via bank.',
      image: '/assets/images/deal.gif',
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
              <Image preview={false} src={items?.image} />
            </Flex>
          </Card>
        </Col>
      ))}

      {/* <Col span={8}>
        <div style={{ width: 300, height: 300 }}>
          <rive1.RiveComponent />
        </div>
      </Col>
      <Col span={8}>
        <div style={{ width: 300, height: 300 }}>
          <rive2.RiveComponent />
        </div>
      </Col> */}
      {/* <Col span={8}>
        <div style={{ width: 300, height: 300 }}>
          <rive3.RiveComponent />
        </div>
      </Col> */}
    </Row>
  );
};

export { Sellerwork };
