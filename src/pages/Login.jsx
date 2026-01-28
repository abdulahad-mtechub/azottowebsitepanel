import {
  Form,
  Button,
  Typography,
  Row,
  Col,
  Divider,
  Checkbox,
  Flex,
  Image,
  Dropdown,
  Space,
  message,
} from "antd";
import { MyInput } from "../components";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutation/login";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons";
import { setAuthTokens } from "../utils/tokenManager";
import { startAutoRefresh } from "../utils/tokenRefreshService";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;
const LoginPage = () => {
  const { t, i18n } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loginUser, { loading: userloading }] = useMutation(LOGIN);
  const [form] = Form.useForm();
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.webp",
  });
  const [redirecting, setRedirecting] = useState(false);
  const [language, setLanguage] = useState();
  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    setLanguage(lang);
    i18n.changeLanguage(lang);
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png" }
        : { key: "1", label: "EN", icon: "assets/icons/en.webp" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = async (values) => {
    try {
      const email = values.email.toLowerCase();
      const password = values.password;

      const { data, errors } = await loginUser({
        variables: { email, password },
      });

      if (data?.login?.token && data?.login?.refreshToken) {
        // Use the new token manager to store tokens securely
        const success = setAuthTokens(
          data.login.token,
          data.login.refreshToken,
          data.login.user
        );

        if (success) {
          // Start automatic token refresh
          startAutoRefresh();
          messageApi.success(t("Login successful!"));
          setRedirecting(true);
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      } else {
        throw new Error(errors?.[0].message);
      }
    } catch (error) {
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        t("Login failed");
      messageApi.error(`${t("Login failed")}: ${t(errorMessage)}`);
    }
  };
  const handleChange = (value) => {
    setLanguage(value);
    localStorage.setItem("lang", value);
    i18n?.changeLanguage(value);
  };
  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image
            src="assets/icons/en.webp"
            width={20}
            alt="English"
            preview={false}
          />
          <Text className="fs-13">EN</Text>
        </Space>
      ),
      onClick: () => {
        setSelectedLang({
          key: "1",
          label: "EN",
          icon: "assets/icons/en.webp",
          alt: "Azottolanguage logo",
        }),
          setLanguage("en");
        handleChange("en");
      },
    },
    {
      key: "2",
      label: (
        <Space>
          <Image
            src="assets/icons/ar.png"
            width={20}
            alt="Arabic"
            preview={false}
          />
          <Text className="fs-13">AR</Text>
        </Space>
      ),
      onClick: () => {
        setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
          setLanguage("ar");
        handleChange("ar");
      },
    },
  ];

  return (
    <>
      {contextHolder}
      <Row className="signup-page" align={"middle"}>
        <Col xs={24} sm={24} md={12} lg={16} className="signup-form-container">
          <div className="form-inner">
            <Button
              aria-labelledby="Arrow left"
              shape="circle"
              onClick={() => navigate("/")}
              style={{
                backgroundColor: "#1B1F41",
                borderColor: "#1B1F41",
              }}
            >
              <ArrowLeftOutlined
                style={{
                  color: "#0000FF",
                  transform: language === "ar" ? "rotate(180deg)" : undefined,
                }}
              />
            </Button>
            <NavLink to={"/"}>
              <div className="logo">
                <img
                  src="/logo.png"
                  alt="azotto-logo"
                  height={70}
                  fetchPriority="high"
                />
              </div>
            </NavLink>

            <Title level={3} className="text-white">{t("Sign In to your account")}</Title>
            <Paragraph className="text-white">
              {t("Enter your credentials to login to your account.")}
            </Paragraph>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              requiredMark={false}
            >
              <MyInput
                label={t("Email Address")}
                name="email"
                required
                message={t("Please enter email address")}
                placeholder={t("Enter email address")}
                validator={{
                  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t("Please enter a valid email address"),
                }}
              />
              <MyInput
                label={t("Password")}
                type="password"
                name="password"
                required
                message={t("Please enter password")}
                placeholder={t("Enter password")}
              />
              <Flex justify="space-between" className="mb-3">
                <Checkbox>{t("Remember Me")}</Checkbox>
                <NavLink to={"/forgotpass"} className="fs-13 text-brand">
                  {t("Forget Password?")}
                </NavLink>
              </Flex>
              <Button
                htmlType="submit"
                type="primary"
                className="btn bg-dark-blue fs-16"
                block
                aria-labelledby="Signin"
                loading={userloading || redirecting}
              >
                {t("Sign In")}
              </Button>
            </Form>

            <Paragraph className="text-center mt-3 text-white">
              {t("Don't have an account?")}{" "}
              <NavLink to={"/signup"}>{t("Sign Up")}</NavLink>
            </Paragraph>
          </div>
        </Col>
        <Col
          xs={0}
          md={12}
          lg={8}
          className="signup-visual-container"
          onChange={handleChange}
          value={language}
        >
          <Flex vertical justify="space-between" className="h-100">
            <Flex vertical justify="center" align="center" className="logo-sp">
              <Image
               src="/assets/images/logo.svg"
                alt="azotto-logo"
                width={200}
                preview={false}
                fetchPriority="high"
              />
            </Flex>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export { LoginPage };
