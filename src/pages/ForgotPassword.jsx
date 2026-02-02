import {
  Form,
  Button,
  Typography,
  Row,
  Col,
  Image,
  Flex,
  Dropdown,
  Space,
  message,
} from "antd";
import { MyInput } from "../components";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useMutation } from "@apollo/client";
import {
  REQUEST_PASSWORD_RESET,
  VERIFY_PASSWORD_RESET_OTP,
  RESET_PASSWORD_WITH_TOKEN,
} from "../graphql/mutation";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
  const { t } = useTranslation();
  const isArabic = localStorage.getItem("lang") === "ar";
  const [form] = Form.useForm();
  const [requestState, setRequestState] = useState("request");
  const [emailValue, setEmailValue] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.webp",
  });

  const [requestPasswordReset, { loading: requestLoading }] = useMutation(
    REQUEST_PASSWORD_RESET
  );
  const [verifyPasswordResetOTP, { loading: verifyLoading }] = useMutation(
    VERIFY_PASSWORD_RESET_OTP
  );
  const [resetPasswordWithToken, { loading: resetLoading }] = useMutation(
    RESET_PASSWORD_WITH_TOKEN
  );

  // Helper function to mask email
  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    if (localPart.length <= 3) {
      return `${localPart[0]}***@${domain}`;
    }
    const visibleStart = localPart.slice(0, 3);
    const visibleEnd = localPart.slice(-1);
    return `${visibleStart}***${visibleEnd}@${domain}`;
  };

  const handleRequestOTP = async (values) => {
    try {
      const { data } = await requestPasswordReset({
        variables: { email: values.email },
      });

      if (data?.requestPasswordReset?.success) {
        setEmailValue(values.email);
        setMaskedEmail(maskEmail(values.email));
        setRequestState("otp");
        messageApi.success(t("OTP has been sent to your email address."));
      }
    } catch (error) {
      messageApi.error(
        error.message || t("Failed to send OTP. Please try again.")
      );
    }
  };

  const handleVerifyOTP = async (values) => {
    try {
      const { data } = await verifyPasswordResetOTP({
        variables: {
          email: emailValue,
          otp: values.otp,
        },
      });

      if (data?.verifyPasswordResetOTP?.success) {
        // Store the reset token
        setResetToken(data.verifyPasswordResetOTP.resetToken);
        setRequestState("reset");
        messageApi.success(
          t("OTP verified successfully. You may now reset your password.")
        );
      } else {
        const errorMsg = data?.verifyPasswordResetOTP?.message;
        if (errorMsg) {
          messageApi.error(t(errorMsg));
        } else {
          messageApi.error(t("Invalid or expired OTP. Please try again."));
        }
      }
    } catch (error) {
      const errorMsg = error?.graphQLErrors?.[0]?.message || error?.message;
      if (errorMsg) {
        messageApi.error(t(errorMsg));
      } else {
        messageApi.error(t("Invalid or expired OTP. Please try again."));
      }
    }
  };

  const handleResetPassword = async (values) => {
    try {
      const { data } = await resetPasswordWithToken({
        variables: {
          resetToken: resetToken,
          newPassword: values.password,
        },
      });

      if (data?.resetPasswordWithToken?.success) {
        messageApi.success(t("Password has been reset successfully."));
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.message || t("Failed to reset password. Please try again.");
      messageApi.error(errorMessage);

      // If token is expired, go back to email step
      if (error.message?.toLowerCase().includes("token")) {
        setTimeout(() => {
          setRequestState("request");
          form.resetFields();
        }, 2000);
      }
    }
  };

  const handleResendOTP = async () => {
    try {
      const { data } = await requestPasswordReset({
        variables: { email: emailValue },
      });

      if (data?.requestPasswordReset?.success) {
        messageApi.success(t("OTP has been resent to your email address."));
      }
    } catch (error) {
      messageApi.error(
        error.message || t("Failed to resend OTP. Please try again.")
      );
    }
  };

  const onFinish = (values) => {
    if (requestState === "request") {
      handleRequestOTP(values);
    } else if (requestState === "otp") {
      handleVerifyOTP(values);
    } else if (requestState === "reset") {
      handleResetPassword(values);
    }
  };

  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image
            src="assets/icons/en.webp"
            width={20}
            alt={t("English")}
            preview={false}
          />
          <Text className="fs-13">EN</Text>
        </Space>
      ),
      onClick: () =>
        setSelectedLang({
          key: "1",
          label: "EN",
          icon: "assets/icons/en.webp",
          alt: t("English"),
        }),
    },
    {
      key: "2",
      label: (
        <Space>
          <Image
            src="assets/icons/ar.png"
            width={20}
            alt={t("Arabic")}
            preview={false}
          />
          <Text className="fs-13">AR</Text>
        </Space>
      ),
      onClick: () =>
        setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
    },
  ];

  return (
    <Row className="signup-page">
      {contextHolder}
      <Col xs={24} sm={24} md={14} lg={16} className="signup-form-container">
        <div className="form-inner">
          <Button
            aria-labelledby="Arrow left"
            shape="circle"
            onClick={() => navigate("/")}
          >
            <ArrowLeftOutlined
              style={{ transform: isArabic ? "scaleX(-1)" : "none" }}
            />
          </Button>
          <NavLink to={"/"}>
            <div className="logo">
              <img
                src="/assets/images/logo-1.png"
                alt="azotto-logo"
                height={70}
                fetchPriority="high"
              />
            </div>
          </NavLink>
          <div>
            {requestState === "otp" && (
              <Button
                aria-labelledby="Arrow left"
                type="button"
                onClick={() => setRequestState("request")}
                ghost
                className="text-black fs-18 p-0 border-0"
              >
                <ArrowLeftOutlined />
              </Button>
            )}
            {requestState === "reset" && (
              <Button
                aria-labelledby="Arrow left"
                type="button"
                onClick={() => setRequestState("otp")}
                ghost
                className="text-black fs-18 p-0 border-0"
              >
                <ArrowLeftOutlined />
              </Button>
            )}
          </div>
          <Title level={3}>
            {requestState === "request" && t("Forgot Password")}
            {requestState === "otp" && t("OTP")}
            {requestState === "reset" && t("Reset Password")}
          </Title>
          <Paragraph>
            {requestState === "request" &&
              t("Enter the email address to send you the OTP code.")}
            {requestState === "otp" &&
              t("Enter the 4 digit OTP code sent to your email") +
                " " +
                maskedEmail}
            {requestState === "reset" && null}
          </Paragraph>
          <Form
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Row>
              {requestState === "request" && (
                <Col span={24}>
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
                </Col>
              )}
              {requestState === "otp" && (
                <Col span={24} className="mb-4">
                  <MyInput
                    oTp
                    length={4}
                    size="large"
                    label={t("OTP")}
                    name="otp"
                    type="number"
                    required
                    message={t("Please enter the OTP sent to your email")}
                    placeholder={t("Enter OTP")}
                    onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-100"
                    id="otpcs"
                    style={{ justifyContent: "center" }}
                  />
                </Col>
              )}
              {requestState === "reset" && (
                <>
                  <Col span={24}>
                    <MyInput
                      label={t("New Password")}
                      type="password"
                      name="password"
                      size="large"
                      required
                      message={() => {}}
                      validator={() => ({
                        validator: (_, value) => {
                          const reg =
                            /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                          if (!reg.test(value)) {
                            return Promise.reject(
                              new Error(
                                t(
                                  "Password should contain at least 8 characters, one uppercase letter, one number, one special character"
                                )
                              )
                            );
                          } else {
                            return Promise.resolve();
                          }
                        },
                      })}
                    />
                  </Col>
                  <Col span={24}>
                    <MyInput
                      label={t("Confirm Password")}
                      type="password"
                      name="confirmationPassword"
                      size="large"
                      dependencies={["password"]}
                      required
                      message={t("Please enter confirm password")}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue("password") === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error(
                                t("The password that you entered do not match!")
                              )
                            );
                          },
                        }),
                      ]}
                      validator={({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              t("The password that you entered do not match!")
                            )
                          );
                        },
                      })}
                    />
                  </Col>
                </>
              )}
              <Col span={24}>
                <Button
                  aria-labelledby="Forgot state button"
                  htmlType="submit"
                  className="btn bg-dark-blue fs-16"
                  block
                  loading={requestLoading || verifyLoading || resetLoading}
                >
                  {requestState === "request" && t("Send OTP")}
                  {requestState === "otp" && t("Verify OTP")}
                  {requestState === "reset" && t("Reset Password")}
                </Button>
              </Col>
              <Col span={24}>
                <Paragraph className="text-center mt-3">
                  {requestState === "request" && (
                    <>
                      {t("Remember Password?")}{" "}
                      <NavLink to={"/login"}>{t("Sign In")}</NavLink>
                    </>
                  )}
                  {requestState === "otp" && (
                    <>
                      {t("Didn't receive code?")}{" "}
                      <Button
                        type="link"
                        onClick={handleResendOTP}
                        className="p-0"
                      >
                        {t("Resend")}
                      </Button>
                    </>
                  )}
                  {requestState === "reset" && null}
                </Paragraph>
              </Col>
            </Row>
          </Form>
        </div>
      </Col>

      <Col xs={0} sm={0} md={10} lg={8} className="signup-visual-container">
        <Dropdown
          menu={{ items: lang }}
          trigger={["click"]}
          className="lang-dropdown"
        >
          <Button
            onClick={(e) => e.preventDefault()}
            className="bg-transparent btn-outline btn p-2 border-white"
            aria-labelledby="Language button"
          >
            <Space align="center">
              <Image
                src={selectedLang.icon}
                width={20}
                alt={selectedLang.label}
                preview={false}
              />
              <Text className="text-white fs-13">{selectedLang.label}</Text>
              <DownOutlined className="text-white" />
            </Space>
          </Button>
        </Dropdown>
        <Flex vertical justify="space-between" className="h-100">
          <Flex vertical justify="center" align="center" className="logo-sp">
            <Image
              src="/assets/images/logo.webp"
              alt={t("Azottologo")}
              width={200}
              preview={false}
              fetchPriority="high"
            />
            <Title level={5} className="m-0 text-white text-center">
              {t("Shorten the path")}
            </Title>
          </Flex>
          <div className="bg-shade">
            <img
              src="/assets/images/login.gif"
              alt={t("azotto-gif-image")}
              className="w-100 opacity-7"
              fetchPriority="high"
            />
          </div>
        </Flex>
      </Col>
    </Row>
  );
};

export { ForgotPassword };
