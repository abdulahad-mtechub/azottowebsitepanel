import {
  Row,
  Col,
  Image,
  Space,
  Typography,
  Divider,
  Flex,
  Button,
} from "antd";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { PhoneOutlined, WhatsAppOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

const { Title, Text } = Typography;
const Footer = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const userId = Cookies.get("userId");

  const footerlinkData = [
    {
      id: 1,
      title: t("Quick Link"),
      links: [
        {
          id: 1,
          name: t("About Us"),
          path: "/about",
        },
      ],
    },
  ];
  return (
    <div className="footer" id="footer">
      <div className="container">
        <Row gutter={[24, 24]} justify={"space-between"}>
          <Col
            lg={{ span: 9 }}
            md={{ span: 24 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
          >
            <Space direction="vertical" size={20} className="w-100">
              <div className="mb-1">
                <Link to={"/"}>
                  <img
                    src="/assets/images/logo.svg"
                    alt="azotto-logo"
                    width={180}
                    fetchPriority="high"
                  />
                </Link>
              </div>
              <Text className="fs-13 text-white w-500">
                {t(
                  "Azottois a licensed platform (7050269450) for buying and selling verified Vin. We offer a secure and seamless experience — with identity and vin verification, secure payments, and smooth ownership transfer."
                )}
              </Text>
            </Space>
          </Col>
          {footerlinkData?.map((list, index) => (
            <Col
              lg={{ span: 5 }}
              md={{ span: 24 }}
              xs={{ span: 24 }}
              sm={{ span: 24 }}
              key={index}
            >
              <Flex vertical gap={15}>
                <Title level={4} className="m-0 text-white">
                  {list?.title}
                </Title>
                <ul className="ul-list">
                  {list?.links?.map((item, i) => (
                    <li key={i}>
                      <NavLink to={item?.path}>{item?.name}</NavLink>
                    </li>
                  ))}
                </ul>
              </Flex>
            </Col>
          ))}
          <Col
            lg={{ span: 5 }}
            md={{ span: 24 }}
            xs={{ span: 24 }}
            sm={{ span: 24 }}
          >
            <Flex vertical gap={15}>
              <Title level={4} className="m-0 text-white">
                {userId ? t("Contact Us") : t("Need more help?")}
              </Title>
              <Text className="fs-14 text-white">
                {userId
                  ? t(
                      "Contact us to access support, tools, and verified listings."
                    )
                  : t(
                      "Sign up to access support, tools, and verified listings."
                    )}
              </Text>
              <Flex>
                {userId ? (
                  <NavLink to={"tel:+966507710632"} className="text-white">
                    <Flex gap={5} align="center">
                      <PhoneOutlined className="fs-18" />
                      +966 50 771 0632
                    </Flex>
                  </NavLink>
                ) : (
                  <Button
                    type="primary"
                    aria-labelledby="Sign Up"
                    className="btn bg-brand"
                    onClick={() => navigate("/signup")}
                  >
                    {t("Sign Up")}
                  </Button>
                )}
              </Flex>
            </Flex>
          </Col>
          <Col span={24}>
            <Divider className="m-0 bg-brand" />
          </Col>
          <Col
            lg={{ span: 12 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Flex align="center" className="w-100 quote" gap={20}>
              <Typography.Text className="fs-12 text-white">
                {t("Copyright © {{year}} Azotto", {
                  year: new Date().getFullYear(),
                })}
              </Typography.Text>
              <span className="text-brand"> | </span>
              <NavLink
                to={""}
                className="fs-12 text-white"
                fetchPriority="high"
              >
                {t("Developed and maintained by MtechHub LLC")}
              </NavLink>
            </Flex>
          </Col>
          <Col
            lg={{ span: 12 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { Footer };
