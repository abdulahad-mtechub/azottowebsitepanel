import { useState, useEffect } from "react";
import { Form, Button, Upload, Typography, Row, Col, Radio, Space, Select, Divider, Checkbox, Image, Flex, Steps, Dropdown } from "antd";
import { message } from "antd";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphql/mutation/login";
import { GETCUSTOMERROLE } from "../graphql/query";
import { useNavigate, NavLink } from "react-router-dom";
import { MyInput, MySelect } from "../components";
import { useDistricts, useCities } from '../data';
import imageCompression from 'browser-image-compression';
import { ArrowLeftOutlined, CheckOutlined, DownOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;

const SignupPage = () => {
  const { t } = useTranslation();

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
  const [loading, setLoading] = useState(false);
  const [customerRole, setCustomerRole] = useState(null);
  const [selectedLang, setSelectedLang] = useState({
    key: "1",
    label: "EN",
    icon: "assets/icons/en.png",
  });

  const [getCustomerRole] = useLazyQuery(GETCUSTOMERROLE, {fetchPolicy:"cache-first"});
  const [createUser] = useMutation(CREATE_USER);

  useEffect(() => {
    const fetchCustomerRole = async () => {
      try {
        const { data } = await getCustomerRole();
        if (data?.getCustomerRole) {
          setCustomerRole(data.getCustomerRole);
        }
      } catch (error) {
        console.error('Error fetching customer role:', error);
      }
    };

    fetchCustomerRole();
  }, [getCustomerRole]);

  const handleFinish = async () => {
    try {
      const formData = form.getFieldsValue(true);
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

      const { data } = await createUser({ variables: { input } });

      messageApi.success(t("Account created successfully!"));
      form.resetFields();
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      messageApi.error(t("Failed to create user. Please try again."));
    }
  };

  const handleUpload = async ({ file, title }) => {
    try {
      setLoading(true);
      let compressedFile = file;
      if (file.type.startsWith("image/")) {
        compressedFile = await imageCompression(file, {
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

      if (title === "front") setFrontFileName(data.fileName);
      else if (title === "back") setBackFileName(data.fileName);
      else if (title === "passport") setPassportFileName(data.fileName);
    } catch (err) {
      console.error(err);
      messageApi.error(t("Failed to upload file"));
    } finally {
      setLoading(false);
    }
  };

  const [current, setCurrent] = useState(0);

  const onChange = (value) => setCurrent(value);

  const next = async () => {
    if (current < steps.length - 1) {
      await form.validateFields();
      setCurrent(current + 1);
    }
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
              placeholder={t("Enter Full Name")}
            />
          </Col>
          <Col span={24}>
            <MyInput
              label={t("Email Address")}
              name="email"
              required
              message={t("Please enter Email Address")}
              placeholder={t("Enter Email Address")}
            />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
            <MySelect
              label={t("Select District")}
              name="district"
              required
              message={t("Please enter district")}
              placeholder={t("Select district")}
              options={district}
              onChange={(val) => setSelectedDistrict(val)}
            />
          </Col>
          <Col lg={{ span: 12 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
            <MySelect
              label={t("Select City")}
              name="city"
              required
              message={t("Please enter city")}
              placeholder={t("Select city")}
              options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
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
                  onChange={(value) => form.setFieldsValue({ countryCode: value })}
                >
                  <Select.Option value="sa">SA</Select.Option>
                  <Select.Option value="ae">AE</Select.Option>
                </Select>
              }
              placeholder={t("Enter mobile number")}
              value={form.getFieldValue("phoneNo") || ""}
              className="w-100"
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
          {/* ... rest of file upload fields (wrap placeholders, button texts with t) */}
          <Col span={24}>
            <MyInput
              label={t("New Password")}
              type="password"
              name="password"
              size="large"
              required
              placeholder={t("Enter Password")}
              rules={[
                { required: true, message: t("Please enter password") },
                {
                  pattern: /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/,
                  message: t("Password should contain at least 8 characters, one uppercase letter, one number, one special character"),
                },
              ]}
              validateTrigger={["onChange", "onBlur"]}
            />
          </Col>
          <Col span={24}>
            <MyInput
              label={t("Confirm Password")}
              type="password"
              name="confirmationPassword"
              size="large"
              required
              placeholder={t("Enter Confirm Password")}
              dependencies={["password"]}
              validateTrigger={["onChange", "onBlur"]}
              rules={[
                { required: true, message: t("Please confirm your password") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(t("The password that you entered do not match!")));
                  },
                }),
              ]}
            />
          </Col>
          <Col span={24}>
            <Checkbox>
              {t("I agree to")} <NavLink to="/termofuse">{t("Terms of Service")}</NavLink> {t("and")}{" "}
              <NavLink to="">{t("Privacy Policy")}</NavLink>
            </Checkbox>
          </Col>
        </Row>
      ),
    },
  ];

  const items = steps.map((item, index) => ({
    key: item.title,
    title: (
      <span className={`custom-step-title ${current >= index ? "completed" : ""}`}>
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
          <Image src="assets/icons/en.png" width={20} alt="English" preview={false} />
          <Text className="fs-13">EN</Text>
        </Space>
      ),
      onClick: () => setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png" }),
    },
    {
      key: "2",
      label: (
        <Space>
          <Image src="assets/icons/ar.png" width={20} alt="Arabic" preview={false} />
          <Text className="fs-13">AR</Text>
        </Space>
      ),
      onClick: () => setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
    },
  ];

  return (
    <>
      {contextHolder}
      <Row className="signup-page">
        <Col xs={24} sm={24} md={12} lg={16}>
          <div className="signup-form-container ">
            <div className="form-inner">
              <Button aria-label="Arrow left" shape="circle" onClick={() => navigate("/")}>
                <ArrowLeftOutlined />
              </Button>
              <NavLink to="/">
                <div className="logo">
                  <img src="/assets/images/logo-1.png" alt="jusoor-logo" height={70} fetchPriority="high" />
                </div>
              </NavLink>
              <Title level={3}>{t("Verify Your Identity")}</Title>
              <Paragraph>
                {t("To ensure the safety of all users, we require identity verification before creating a seller account.")}
              </Paragraph>

              <Button aria-label="Sign Up via Nafath" className="btn bg-nafth fs-16" block>
                {t("Sign Up via Nafath")}
              </Button>
              <Divider className="text-gray">{t("Or")}</Divider>

              <Form layout="vertical" form={form} onFinish={handleFinish} requiredMark={false}>
                <Steps
                  current={current}
                  onChange={onChange}
                  items={items}
                  progressDot={(dot, { status, index }) => (
                    <span className={`custom-dot ${current > index ? "completed" : ""} ${current === index ? "active" : ""}`}>
                      {current > index ? <CheckOutlined /> : dot}
                    </span>
                  )}
                  className="mt-2 mb-2"
                />
                <div className="step-content">{steps[current].content}</div>
                <Flex gap={10} justify="end">
                  <Button
                    aria-label="Back"
                    type="button"
                    className="btn bg-transparent border-gray text-black fs-14 my-2"
                    onClick={prev}
                    disabled={current <= 0}
                    block
                  >
                    {t("Back")}
                  </Button>
                  {current < steps.length - 1 && (
                    <Button aria-label="Next" className="btn bg-dark-blue fs-14 my-2" block onClick={next}>
                      {t("Next")}
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button
                      aria-label="Signup"
                      type="primary"
                      htmlType="submit"
                      className="btn bg-dark-blue fs-14 my-2"
                      block
                    >
                      {t("Sign Up")}
                    </Button>
                  )}
                </Flex>
                <Paragraph className="text-center">
                  {t("Don't have an account?")} <NavLink to="/login">{t("Sign In")}</NavLink>
                </Paragraph>
              </Form>
            </div>
          </div>
        </Col>

        {/* Right visual part */}
        <Col xs={0} sm={0} md={12} lg={8} className="signup-visual-container">
          <Dropdown menu={{ items: lang }} trigger={["click"]} className="lang-dropdown">
            <Button onClick={(e) => e.preventDefault()} className="bg-transparent btn-outline btn p-2 border-white">
              <Space align="center">
                <Image src={selectedLang.icon} width={20} alt={selectedLang.label} preview={false} />
                <Text className="text-white fs-13">{selectedLang.label}</Text>
                <DownOutlined className="text-white" />
              </Space>
            </Button>
          </Dropdown>
          <Flex vertical justify="space-between" className="h-100">
            <Flex vertical justify="center" align="center" className="logo-sp">
              <Image src="/assets/images/logo.png" alt="jusoor logo" width={200} preview={false} />
              <Title level={5} className="m-0 text-white text-center">
                {t("Shorten the path")}
              </Title>
            </Flex>
            <div className="bg-shade">
              <img src="/assets/images/login.gif" alt="jusoor-gif-image" className="w-100 opacity-7" fetchPriority="high" />
            </div>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export { SignupPage };
