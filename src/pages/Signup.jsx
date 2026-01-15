import { useState, useEffect } from "react";
import {
  Form,
  Button,
  Typography,
  Row,
  Col,
  Radio,
  Space,
  Select,
  Divider,
  Checkbox,
  Image,
  Flex,
  Steps,
  Dropdown,
  Upload,
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
import { MyInput, MySelect } from "../components";
import { useDistricts, useCities } from "../data";
import imageCompression from "browser-image-compression";
import {
  ArrowLeftOutlined,
  CheckOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { setAuthTokens } from "../utils/tokenManager";
import { startAutoRefresh } from "../utils/tokenRefreshService";

const { Title, Text, Paragraph } = Typography;

const SignupPage = () => {
  const { t, i18n } = useTranslation();

  const district = useDistricts();
  const cities = useCities();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [idType, setIdType] = useState("national_id");
  const [frontFileName, setFrontFileName] = useState("");
  const [backFileName, setBackFileName] = useState("");
  const [passportFileName, setPassportFileName] = useState("");
  const [documents, setDocuments] = useState([]);
  const [customerRole, setCustomerRole] = useState(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const [errors, setErrors] = useState({
    front: "",
    back: "",
    passport: "",
  });
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.webp",
  });

  const [getCustomerRole] = useLazyQuery(GETCUSTOMERROLE, {
    fetchPolicy: "cache-first",
  });
  const [createUser, { loading }] = useMutation(CREATE_USER);
  const [verifyEmail] = useMutation(VERIFY_EMAIL);
  const [verifyEmailOTP] = useMutation(VERIFY_EMAIL_OTP);

  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    i18n.changeLanguage(lang);
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png" }
        : { key: "1", label: "EN", icon: "assets/icons/en.webp" }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        documents: documents.length > 0 ? documents : undefined,
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

  const handleUpload = async ({ file, title }) => {
    try {
      if (file.type.startsWith("image/")) {
        await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("https://verify.jusoor-sa.co/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();

      setDocuments((prevDocs) => {
        const filtered = prevDocs.filter((doc) => doc.title !== title);
        return [
          ...filtered,
          {
            title: title,
            fileName: data.fileName,
            filePath: data.fileUrl,
            fileType: data.fileType,
          },
        ];
      });
      setErrors((prev) => ({ ...prev, [title]: "" }));
      if (title === "front") setFrontFileName(data.fileName);
      else if (title === "back") setBackFileName(data.fileName);
      else if (title === "passport") setPassportFileName(data.fileName);
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to upload file"));
    }
  };

  const [current, setCurrent] = useState(0);

  const onChange = async (value) => {
    if (value <= current) {
      setCurrent(value);
    } else {
      // Try to validate current step before moving forward
      try {
        await form.validateFields();
        setCurrent(value);
      } catch {
        // Validation failed, don't move
        messageApi.warning(
          t("Please complete the current step before proceeding")
        );
      }
    }
  };

  const next = async () => {
    if (current < steps.length - 1) {
      await form.validateFields();

      // Check email verification on first step
      if (current === 0 && !otpVerified) {
        messageApi.warning(t("Please verify your email before proceeding"));
        return;
      }

      setCurrent(current + 1);
    }
  };
  const handleChange = (value) => {
    localStorage.setItem("lang", value);
    i18n?.changeLanguage(value);
  };
  const prev = () => setCurrent(current - 1);

  const steps = [
    {
      title: t("Basic Information"),
      content: (
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
            lg={{ span: 12 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <MySelect
              label={t("Region")}
              name="district"
              required
              message={t("Select region")}
              placeholder={t("Select region")}
              options={district}
              showKey
              onChange={(val) => setSelectedDistrict(val)}
            />
          </Col>
          <Col
            lg={{ span: 12 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <MySelect
              label={t("City")}
              name="city"
              required
              showKey
              message={t("Select city")}
              placeholder={t("Select city")}
              options={
                selectedDistrict
                  ? cities[selectedDistrict.toLowerCase()] || []
                  : []
              }
            />
          </Col>
          <Col span={24}>
            <MyInput
              name="phoneNo"
              label={t("Mobile Number")}
              required
              message={t("Please enter a valid phone number")}
              addonBefore={
                <Select
                  defaultValue="SA"
                  className="w-80px"
                  onChange={(value) =>
                    form.setFieldsValue({ countryCode: value })
                  }
                >
                  <Select.Option value="sa">SA</Select.Option>
                  <Select.Option value="ae">AE</Select.Option>
                </Select>
              }
              placeholder={t("Enter mobile number")}
              value={form.getFieldValue("phoneNo") || ""}
              className="w-100"
              validator={{
                pattern: /^[0-9\u0660-\u0669]{8,15}$/,
                message: t(
                  "Please enter a valid phone number (8–15 digits, Arabic or English)"
                ),
              }}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: t("Identity & Security"),
      content: (
        <Row gutter={[12, 0]}>
          <Col span={24}>
            <Form.Item label={t("Upload National ID or Passport")} required>
              <Radio.Group
                value={idType}
                onChange={(e) => {
                  setIdType(e.target.value);
                  setFrontFileName("");
                  setBackFileName("");
                  setPassportFileName("");
                }}
              >
                <Space>
                  <Radio value="national_id">{t("National ID")}</Radio>
                  <Radio value="passport">{t("Passport")}</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Col>
          {idType === "national_id" ? (
            <>
              <Col span={24}>
                <Row gutter={8} className="mb-2">
                  <Col flex="auto">
                    <MyInput
                      withoutForm
                      size={"large"}
                      placeholder={t("Upload Front Side")}
                      readOnly
                      value={frontFileName}
                    />
                  </Col>
                  <Col>
                    <Upload
                      beforeUpload={() => false}
                      showUploadList={false}
                      maxCount={1}
                      onChange={(info) =>
                        handleUpload({ file: info.file, title: "front" })
                      }
                    >
                      <Button
                        aria-labelledby="Upload"
                        className="btn btn-sm text-black border-gray"
                      >
                        {t("Upload")}
                      </Button>
                    </Upload>
                  </Col>
                  {errors.front && (
                    <Col span={24} className="mb-1">
                      <Text className="text-error text-12">{errors.front}</Text>
                    </Col>
                  )}
                </Row>
              </Col>
              <Col span={24}>
                <Row gutter={8} className="mb-2">
                  <Col flex="auto">
                    <MyInput
                      withoutForm
                      size={"large"}
                      className="m-0"
                      placeholder={t("Upload Back Side")}
                      readOnly
                      value={backFileName}
                      required
                      message={t("Please upload back side image")}
                    />
                  </Col>
                  <Col>
                    <Upload
                      beforeUpload={() => false}
                      showUploadList={false}
                      maxCount={1}
                      onChange={(info) =>
                        handleUpload({ file: info.file, title: "back" })
                      }
                    >
                      <Button
                        aria-labelledby="Upload"
                        className="btn btn-sm text-black border-gray"
                      >
                        {t("Upload")}
                      </Button>
                    </Upload>
                  </Col>
                  {errors.back && (
                    <Col span={24} className="mb-1">
                      <Text className="text-error text-12">{errors.back}</Text>
                    </Col>
                  )}
                </Row>
              </Col>
            </>
          ) : (
            <Col span={24}>
              <Row gutter={8} className="mb-2">
                <Col flex="auto">
                  <MyInput
                    withoutForm
                    size={"large"}
                    placeholder={t("Upload Passport")}
                    readOnly
                    value={passportFileName}
                    required
                    message={t("Please upload passport image")}
                  />
                </Col>
                <Col>
                  <Upload
                    beforeUpload={() => false}
                    showUploadList={false}
                    maxCount={1}
                    onChange={(info) =>
                      handleUpload({ file: info.file, title: "passport" })
                    }
                  >
                    <Button
                      aria-labelledby="Upload"
                      className="btn text-black border-gray"
                    >
                      {t("Upload")}
                    </Button>
                  </Upload>
                </Col>
                {errors.passport && (
                  <Col span={24} className="mb-1">
                    <Text className="text-error text-12">
                      {errors.passport}
                    </Text>
                  </Col>
                )}
              </Row>
            </Col>
          )}
          <Col span={24}>
            <MyInput
              label={t("New Password")}
              type="password"
              name="password"
              size="large"
              required
              placeholder={t("Enter password")}
              message={() => {}}
              validator={() => ({
                validator: (_, value) => {
                  const reg = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
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
              required
              placeholder={t("Enter confirm password")}
              dependencies={["password"]}
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
                    new Error(t("The password that you entered do not match!"))
                  );
                },
              })}
            />
          </Col>
          <Col span={24}>
            <Checkbox>
              {t("I agree to")}{" "}
              <NavLink to="/termofuse">{t("Terms of Service")}</NavLink>{" "}
              {t("and")}{" "}
              <NavLink to="/privacypolicy">{t("Privacy Policy")}</NavLink>
            </Checkbox>
          </Col>
        </Row>
      ),
    },
  ];

  const items = steps.map((item, index) => ({
    key: item.title,
    title: (
      <span
        className={`custom-step-title ${current >= index ? "completed" : ""}`}
      >
        {item.title}
      </span>
    ),
  }));

  // lang dropdown stays same
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
        }),
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
          handleChange("ar");
      },
    },
  ];

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
            >
              <ArrowLeftOutlined
                style={
                  i18n.language === "ar"
                    ? { transform: "rotate(180deg)" }
                    : undefined
                }
              />
            </Button>
            <NavLink to="/">
              <div className="logo">
                <img
                  src="/assets/images/logo-1.png"
                  alt="jusoor-logo"
                  height={70}
                  fetchPriority="high"
                />
              </div>
            </NavLink>
            <Title level={3}>{t("Verify Your Identity")}</Title>
            <Paragraph>
              {t(
                "To ensure the safety of all users, we require identity verification before creating a seller account."
              )}
            </Paragraph>

            <Button
              aria-label="Sign Up via Nafath"
              className="btn bg-nafth fs-16"
              block
              disabled
            >
              {t("Sign Up via Nafath (Coming Soon)")}
            </Button>
            <Divider className="text-gray">{t("Or")}</Divider>

            <Form
              layout="vertical"
              form={form}
              onFinish={handleFinish}
              requiredMark={false}
              onFinishFailed={() => {
                const newErrors = {
                  front: !frontFileName
                    ? t("Please upload front side image.")
                    : "",
                  back: !backFileName
                    ? t("Please upload back side image.")
                    : "",
                  passport: !passportFileName
                    ? t("Please upload passport image.")
                    : "",
                };
                setErrors(newErrors);
              }}
            >
              <Steps
                current={current}
                onChange={onChange}
                items={items}
                progressDot={(dot, { index }) => (
                  <span
                    className={`custom-dot ${
                      current > index ? "completed" : ""
                    } ${current === index ? "active" : ""}`}
                  >
                    {current > index ? <CheckOutlined /> : dot}
                  </span>
                )}
                className="mt-2 mb-2"
              />
              <div className="step-content">{steps[current].content}</div>
              <Flex gap={10} justify="end">
                {current > 0 && (
                  <Button
                    aria-label="Back"
                    type="button"
                    className="btn bg-transparent border-gray text-black fs-14 my-2"
                    onClick={prev}
                    block
                  >
                    {t("Back")}
                  </Button>
                )}
                {current < steps.length - 1 && (
                  <Button
                    aria-label="Next"
                    className="btn bg-dark-blue fs-14 my-2"
                    block
                    onClick={next}
                  >
                    {t("Next")}
                  </Button>
                )}
                {current === steps.length - 1 && (
                  <Button
                    aria-label="Signup"
                    type="primary"
                    htmlType="submit"
                    className="btn bg-dark-blue fs-14 my-2"
                    loading={loading}
                    disabled={loading}
                    block
                  >
                    {t("Sign Up")}
                  </Button>
                )}
              </Flex>
              <Paragraph className="text-center">
                {t("Don't have an account?")}{" "}
                <NavLink to="/login">{t("Sign In")}</NavLink>
              </Paragraph>
            </Form>
          </div>
        </Col>

        {/* Right visual part */}
        <Col xs={0} sm={0} md={12} lg={8} className="signup-visual-container">
          <Dropdown
            menu={{ items: lang }}
            trigger={["click"]}
            className="lang-dropdown"
          >
            <Button
              onClick={(e) => e.preventDefault()}
              className="bg-transparent btn-outline btn p-2 border-white"
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
                alt="jusoor logo"
                width={200}
                preview={false}
                fetchPriority="high"
              />
              <Title level={4} className="m-0 text-white text-center">
                {t("Shorten the path")}
              </Title>
            </Flex>
            <div className="bg-shade">
              <img
                src="/assets/images/login.gif"
                alt="jusoor-gif-image"
                className="w-100 opacity-7"
                fetchPriority="high"
              />
            </div>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export { SignupPage };
