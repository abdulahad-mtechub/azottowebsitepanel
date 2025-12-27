import { Card, Col, Flex, Image, Row, Typography } from "antd";
import { GET_CATEGORY } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";

const { Title, Text } = Typography;
const BusinessInfo = ({ data }) => {
  const { data: categoryData } = useQuery(GET_CATEGORY, {
    variables: { getCategoryByIdId: data.categoryId },
    skip: !data.categoryId,
  });

  if (!data.categoryId) {
    return <p>No category selected.</p>;
  }

  const category = categoryData?.getCategoryById;

  const businessInfoData = [
    {
      id: 1,
      icon: "/assets/icons/businessprice.png",
      title: (
        <>
          <img
            src="/assets/icons/reyal-b.png"
            width={16}
            alt="currency-symbol"
            fetchPriority="high"
          />{" "}
          {typeof data.price === "number"
            ? data.price.toLocaleString()
            : data.price}
        </>
      ),
      subtitle: "Business Price",
    },
    {
      id: 2,
      icon: "/assets/icons/foundationdate.png",
      title: `${new Date(data.foundedDate).getFullYear()}`,
      subtitle: "Foundation Date",
    },
    {
      id: 3,
      icon: "/assets/icons/businesscate.png",
      title: `${category?.name}`,
      subtitle: "Business Category",
    },
    {
      id: 4,
      icon: "/assets/icons/teamsize.png",
      title: `${data.numberOfEmployees}`,
      subtitle: "Team Size",
    },
    {
      id: 5,
      icon: "/assets/icons/businessloc.png",
      title: `${data.district}`,
      subtitle: "Business Location",
    },
  ];

  return (
    <Card className="shadow-d radius-12 border-gray mb-3">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={5} className="m-0">
            Business Info
          </Title>
        </Col>
        {businessInfoData?.map((stat, i) => (
          <Col span={24} key={i}>
            <Flex gap={10}>
              <div className="icon-pre">
                <Image
                  src={stat?.icon}
                  preview={false}
                  width={"100%"}
                  alt="stats icon"
                />
              </div>
              <Flex vertical gap={2}>
                <Title level={5} className="m-0 text-brand">
                  {stat?.title}
                </Title>
                <Text className="text-gray fs-12 fw-500">{stat?.subtitle}</Text>
              </Flex>
            </Flex>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export { BusinessInfo };
