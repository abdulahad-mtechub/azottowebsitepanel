import {
  Form,
  Button,
  Typography,
  Row,
  Col,
  Flex,
  Image,
  message,
} from "antd";
import { MyInput } from "../components";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useLoginWithEmail, usePrivy } from "@privy-io/react-auth";

const { Title, Paragraph } = Typography;

const PrivyLoginPage = () => {
  const { t, i18n } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Privy hooks
  const { sendCode, loginWithCode, state } = useLoginWithEmail({
    onError: (error) => {
      messageApi.error(t("Authentication failed") + ": " + error.message);
    },
  });

  const { authenticated, user } = usePrivy();

  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("en");
  const [redirecting, setRedirecting] = useState(false);

  // Determine current step based on Privy state
  const step = state.status === 'awaiting-code-input' || state.status === 'submitting-code'
    ? "verify"
    : "email";

  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    setLanguage(lang);
    i18n.changeLanguage(lang);
  }, [i18n]);

  // Show success message when code is sent
  useEffect(() => {
    if (state.status === 'awaiting-code-input') {
      messageApi.success(t("OTP sent successfully! Check your email."));
    }
  }, [state.status, messageApi, t]);

  // Redirect when authenticated
  useEffect(() => {
    if (authenticated && user) {
      messageApi.success(t("Login successful!"));
      setRedirecting(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [authenticated, user, navigate, messageApi, t]);

  const handleSendCode = async (values) => {
    const emailValue = values.email.toLowerCase().trim();
    setEmail(emailValue);
    await sendCode({ email: emailValue });
  };

  const handleVerifyCode = async (values) => {
    await loginWithCode({ code: values.code, email });
  };

  const handleResendCode = async () => {
    await sendCode({ email });
    messageApi.success(t("New code sent!"));
  };

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

            {step === "email" ? (
              <>
                <Title level={3} className="text-white">
                  {t("Sign In to your account")}
                </Title>
                <Paragraph className="text-white">
                  {t("Enter your email address to receive a one-time password.")}
                </Paragraph>
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handleSendCode}
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
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="btn bg-dark-blue fs-16"
                    block
                    aria-labelledby="Send Code"
                    loading={state.status === "sending-code"}
                  >
                    {t("Send Code")}
                  </Button>
                </Form>
              </>
            ) : (
              <>
                <Title level={3} className="text-white">
                  {t("Verify your email")}
                </Title>
                <Paragraph className="text-white">
                  {t("Enter the 6-digit code we sent to")} {email}
                </Paragraph>
                <Form
                  layout="vertical"
                  form={form}
                  onFinish={handleVerifyCode}
                  requiredMark={false}
                >
                  <MyInput
                    label={t("Verification Code")}
                    name="code"
                    required
                    message={t("Please enter the verification code")}
                    placeholder={t("Enter 6-digit code")}
                    maxLength={6}
                    validator={{
                      pattern: /^\d{6}$/,
                      message: t("Please enter a valid 6-digit code"),
                    }}
                  />
                  <Button
                    htmlType="submit"
                    type="primary"
                    className="btn bg-dark-blue fs-16"
                    block
                    aria-labelledby="Verify"
                    loading={state.status === "submitting-code" || redirecting}
                  >
                    {t("Verify & Sign In")}
                  </Button>
                </Form>

                <Paragraph className="text-center mt-3 text-white">
                  {t("Didn't receive the code?")}{" "}
                  <Button
                    type="link"
                    onClick={handleResendCode}
                    loading={state.status === "sending-code"}
                    className="p-0 text-brand"
                  >
                    {t("Resend")}
                  </Button>
                </Paragraph>
              </>
            )}

            {/* <Paragraph className="text-center mt-3 text-white">
              {t("Don't have an account?")}{" "}
              <NavLink to={"/signup"}>{t("Sign Up")}</NavLink>
            </Paragraph> */}
          </div>
        </Col>
        <Col
          xs={0}
          md={12}
          lg={8}
          className="signup-visual-container"
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

export { PrivyLoginPage };