import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Typography,
  Row,
  Col,
  Image,
  Flex,
  message,
} from "antd";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  CREATE_USER,
  VERIFY_EMAIL,
  VERIFY_EMAIL_OTP,
} from "../graphql/mutation/login";
import { GETCUSTOMERROLE } from "../graphql/query";
import { useNavigate, NavLink } from "react-router-dom";
import { MyInput } from "../components";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { setAuthTokens } from "../utils/tokenManager";
import { startAutoRefresh } from "../utils/tokenRefreshService";

const { Title, Text, Paragraph } = Typography;

const SignupPage = () => {
  const { t, i18n } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [customerRole, setCustomerRole] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const [getCustomerRole] = useLazyQuery(GETCUSTOMERROLE, {
    fetchPolicy: "cache-first",
  });
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [verifyEmailOTP] = useMutation(VERIFY_EMAIL_OTP);

  useEffect(() => {
    const fetchCustomerRole = async () => {
      try {
        const { data } = await getCustomerRole();
        if (data?.getCustomerRole) {
          setCustomerRole(data.getCustomerRole);
        }
      } catch (error) {
        console.error("Error fetching customer role:", error);
      }
    };

    fetchCustomerRole();
  }, [getCustomerRole]);

  // OTP countdown timer
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  const handleSendOtp = async () => {
    try {
      // Check if timer is still running
      if (otpTimer > 0) {
        messageApi.warning(
          t("Please wait {{seconds}} seconds before requesting again", {
            seconds: otpTimer,
          })
        );
        return;
      }

      const email = form.getFieldValue("email")?.toLowerCase();
      if (!email) {
        messageApi.error(t("Please enter email address"));
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        messageApi.error(t("Please enter a valid email address"));
        return;
      }

      setSendingOtp(true);
      const { data } = await verifyEmail({ variables: { email } });

      if (data?.verifyEmail) {
        // Check if email already exists
        if (
          data.verifyEmail.includes("exists") ||
          data.verifyEmail.includes("already")
        ) {
          messageApi.warning(t("An account with that email already exists"));
          return;
        }

        setOtpSent(true);
        setVerifiedEmail(email);
        setOtpTimer(60); // Start 60 second countdown
        messageApi.success(t("OTP sent to your email"));
      }
    } catch (err) {
      const msg = err?.graphQLErrors?.[0]?.message || err?.message || "";
      console.error("❌ Send OTP Error:", msg);

      if (
        msg?.includes("email already exists") ||
        msg?.includes("already registered")
      ) {
        messageApi.error(t("The email already exists"));
      } else if (msg) {
        messageApi.error(msg);
      } else {
        messageApi.error(t("Failed to send OTP. Please try again."));
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      if (!otpValue || otpValue.length < 4) {
        messageApi.error(t("Please enter a valid OTP"));
        return;
      }

      setVerifyingOtp(true);
      const { data } = await verifyEmailOTP({
        variables: {
          email: verifiedEmail,
          otp: otpValue,
        },
      });

      if (data?.verifyEmailOTP?.success) {
        setOtpVerified(true);
        messageApi.success(t("Email verified successfully"));
      } else {
        const errorMsg = data?.verifyEmailOTP?.message;
        if (errorMsg) {
          messageApi.error(t(errorMsg));
        } else {
          messageApi.error(t("Invalid OTP"));
        }
      }
    } catch (err) {
      const msg = err?.graphQLErrors?.[0]?.message || err?.message || "";
      console.error("❌ Verify OTP Error:", msg);
      if (msg) {
        messageApi.error(t(msg));
      } else {
        messageApi.error(t("Failed to verify OTP. Please try again."));
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleFinish = async () => {
    try {
      // Check if email is verified
      if (!otpVerified) {
        messageApi.error(t("Please verify your email first"));
        return;
      }

      const formData = form.getFieldsValue(true);

      // Check if the verified email matches the form email
      if (formData.email.toLowerCase() !== verifiedEmail) {
        messageApi.error(t("Email has been changed. Please verify again."));
        setOtpSent(false);
        setOtpVerified(false);
        setOtpValue("");
        return;
      }

      const input = {
        name: formData.fullName,
        email: formData.email.toLowerCase(),
        district: formData.district,
        city: formData.city,
        phone: formData.phoneNo,
        password: formData.password,
        roleId: customerRole?.id,
      };

      const { data, errors } = await createUser({ variables: { input } });

      // Handle GraphQL errors from the response
      if (errors && errors.length > 0) {
        const msg =
          errors[0]?.message || "Something went wrong. Please try again.";
        console.error("❌ GraphQL Errors:", msg);

        if (msg.includes("The email already exists")) {
          messageApi.error(t("The email already exists"));
        } else if (msg) {
          messageApi.error(msg);
        } else {
          messageApi.error(t("Something went wrong. Please try again."));
        }
        return;
      }

      if (data?.createUser?.token && data?.createUser?.refreshToken) {
        const success = setAuthTokens(
          data.createUser.token,
          data.createUser.refreshToken,
          data.createUser.user
        );

        if (success) {
          startAutoRefresh();
          messageApi.success(t("Account created successfully!"));
          form.resetFields();
          setTimeout(() => {
            navigate("/");
          }, 1000);
        } else {
          console.error("❌ Failed to store tokens");
        }
      } else {
        console.error("❌ Invalid server response:", data);
      }
    } catch (err) {
      const msg = err?.graphQLErrors?.[0]?.message || err?.message || "";
      console.error("❌ Signup Error:", msg);

      if (msg?.includes("The email already exists")) {
        messageApi.error(t("The email already exists"));
      } else if (err?.networkError) {
        messageApi.error(t("Network error. Please check your connection."));
      } else if (msg) {
        messageApi.error(msg);
      } else {
        messageApi.error(t("Something went wrong. Please try again."));
      }
    }
  };


  return (
    <>
      {contextHolder}
      <Row className="signup-page" align="middle">
        <Col xs={24} sm={24} md={12} lg={16} className="signup-form-container">
          <div className="form-inner">
            <Button
              aria-label="Arrow left"
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
                  ...(i18n.language === "ar" ? { transform: "rotate(180deg)" } : {}),
                }}
              />
            </Button>
            <NavLink to="/">
              <div className="logo">
                <img
                  src="/logo.png"
                  alt="azotto-logo"
                  height={70}
                  fetchPriority="high"
                />
              </div>
            </NavLink>
            <Title level={3} className="text-white">{t("Verify Your Identity")}</Title>
            <Paragraph className="text-white">
              {t(
                "To ensure the safety of all users, we require identity verification before creating a seller account."
              )}
            </Paragraph>
            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              requiredMark={false}
            >
                <Row gutter={[12, 0]}>
          <Col span={24}>
            <MyInput
              label={t("Full Name")}
              name="fullName"
              required
              message={t("Please enter full name")}
              placeholder={t("Enter full name")}
              validator={{
                pattern: /^[A-Za-z\u0600-\u06FF\s]+$/,
                message: t(
                  "Name should only contain letters (English or Arabic) and spaces"
                ),
              }}
            />
          </Col>
          <Col span={24}>
            <Row gutter={8} align="middle">
              <Col flex="auto">
                <MyInput
                  label={t("Email Address")}
                  name="email"
                  required
                  message={t("Please enter email address")}
                  placeholder={t("Enter email address")}
                  disabled={otpVerified}
                  validator={{
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("Please enter a valid email address"),
                  }}
                  onChange={() => {
                    // Reset OTP state if email changes
                    if (otpSent || otpVerified) {
                      setOtpSent(false);
                      setOtpVerified(false);
                      setOtpValue("");
                    }
                  }}
                />
              </Col>
              <Col>
                <Button
                  className={`btn ${
                    otpVerified ? "bg-green" : "bg-dark-blue"
                  } mt-1`}
                  onClick={handleSendOtp}
                  loading={sendingOtp}
                  disabled={otpVerified || sendingOtp || otpTimer > 0}
                >
                  {otpVerified
                    ? t("Verified")
                    : otpTimer > 0
                    ? `${t("Resend in")} ${otpTimer}s`
                    : otpSent
                    ? t("Resend OTP")
                    : t("Send OTP")}
                </Button>
              </Col>
            </Row>
          </Col>
          {otpSent && !otpVerified && (
            <Col span={24}>
              <Row gutter={8} align="middle">
                <Col flex="auto">
                <MyInput
                  withoutForm
                  label={t("Enter OTP")}
                  placeholder={t("Enter OTP sent to your email")}
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value)}
                  maxLength={6}
                />
                </Col>
                <Col>
                  <Button
                    className="btn bg-dark-blue mt-1"
                    onClick={handleVerifyOtp}
                    loading={verifyingOtp}
                    disabled={verifyingOtp || !otpValue}
                  >
                    {t("Verify")}
                  </Button>
                </Col>
              </Row>
            </Col>
          )}
          <Col
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
           <MyInput
            label={t("Wallet Address")}
            name="walletAddress"
            required
            message={t("Please enter Wallet Address")}
            placeholder={t("Enter Wallet Address")}
            validator={{
              pattern: /^[a-zA-Z0-9]{20,60}$/,
              message: t("Please enter a valid wallet address"),
            }}
          />
          </Col>
        </Row>
            <Paragraph className="text-center text-white">
              {t("Don't have an account?")}{" "}
                <NavLink to="/login">{t("Sign In")}</NavLink>
              </Paragraph>
            </Form>
          </div>
        </Col>
        {/* Right visual part */}
        <Col xs={0} sm={0} md={12} lg={8} className="signup-visual-container">
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

export { SignupPage };
