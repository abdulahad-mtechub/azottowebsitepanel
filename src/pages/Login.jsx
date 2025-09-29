import { Form, Button, Typography, Row, Col, Divider, Checkbox, Flex, Image, Dropdown, Space,Spin,message } from "antd";
import { MyInput } from "../components";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutation/login";
import { useNavigate } from "react-router-dom";
import { useState,useEffect } from 'react';
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";

const { Title, Text, Paragraph } = Typography;
const LoginPage = () => {
  const {t, i18n}= useTranslation()
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();
  const [loginUser, { loading:userloading, error }] = useMutation(LOGIN);
  const [form] = Form.useForm();
  const [selectedLang, setSelectedLang] = useState({
      key: "1",
      label: "EN",
      icon: "assets/icons/en.png",
    });
  const [redirecting, setRedirecting] = useState(false);
  const [language, setLanguage]= useState()
  useEffect(() => {
    let lang = localStorage.getItem("lang") || "en";
    setLanguage(lang);
    i18n.changeLanguage(lang); // ✅ now works
    setSelectedLang(
      lang === "ar"
        ? { key: "2", label: "AR", icon: "assets/icons/ar.png" }
        : { key: "1", label: "EN", icon: "assets/icons/en.png" }
    );
  }, []);
  const handleFinish = async (values) => {
    try {
      const email = values.email.toLowerCase(); // convert to lowercase
      const password = values.password;
  
      const { data } = await loginUser({ variables: { email, password } });
  
      if (data?.login?.token) {
        Cookies.set("userId", data.login.user.id, { expires: 7 }); // expires in 7 days
        Cookies.set("authToken", data.login.token, { expires: 7, secure: true }); 
        messageApi.success("Login successful!");
        setRedirecting(true); 
        setTimeout(() => navigate("/"), 1000);
      } else {
        messageApi.error("Login failed: Somthing went Wrong");
      }
    } catch (error) {
      console.error("Login error:", error);
      messageApi.error(`Login failed: ${error}`);
    }
  };
  const handleChange= (value)=>{
      setLanguage(value)
      localStorage.setItem("lang", value)
      i18n?.changeLanguage(value)
  }
  const lang = [
    {
      key: "1",
      label: (
        <Space>
          <Image src="assets/icons/en.png" width={20} alt="English" preview={false} />
          <Text className='fs-13'>EN</Text>
        </Space>
      ),
      onClick: () =>{
        setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png",alt: "Jusoor language logo" }),
        setLanguage("en")
        handleChange("en")
      }

    },
    {
      key: "2",
      label: (
        <Space>
          <Image src="assets/icons/ar.png" width={20} alt="Arabic" preview={false} />
          <Text className='fs-13'>AR</Text>
        </Space>
      ),
      onClick: () =>{
        setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
        setLanguage("ar")
        handleChange("ar")  
      }
    },
  ];
  if (userloading || redirecting) {
    return (
        <Flex justify="center" align="center" className="h-200">
            <Spin size="large" />
        </Flex>
    );
  }
  return (
    <>
    {contextHolder}
    <Row className="signup-page" align={"middle"}>
          <Col  xs={24} sm={24} md={12} lg={16} className="signup-form-container">
              <div className="form-inner">
                  <Button aria-labelledby='Arrow left' shape="circle" onClick={()=>navigate('/')}>
                    <ArrowLeftOutlined />
                  </Button>
                  <NavLink to={'/'}>
                    <div className="logo">
                      <img src="/assets/images/logo-1.png" alt="jusoor-logo" height={70} fetchPriority="high" />
                    </div>
                  </NavLink>

                  <Title level={3}>{t("Sign In to your account")}</Title>
                  <Paragraph>{t("Enter your credentials to login to your account")}</Paragraph>

                  <Button aria-labelledby='Sign In' className="btn bg-nafth fs-16" block>
                     {t("Sign In via Nafath")}
                  </Button>
                  <Divider className="text-gray">{t("Or")}</Divider>

                  <Form 
                    layout="vertical" 
                    form={form} 
                    onFinish={handleFinish}
                    requiredMark={false}
                  >
                    <MyInput
                      label={t("Email Address")}
                      name='email'
                      required
                      message={t("Please enter Email Address")}
                      placeholder={t("Enter Email Address")}
                    />
                    <MyInput
                      label={t("Password")}
                      type='password'
                      name='password'
                      required
                      message={t("Please enter password")}
                      placeholder={t("Enter Password")}
                    />
                    <Flex justify="space-between" className="mb-3">
                      <Checkbox>{t("Remember Me")}</Checkbox>
                      <NavLink to={'/forgotpass'} className="fs-13 text-brand">
                         {t('Forget Password?')}
                      </NavLink>
                    </Flex>
                    <Button
                      htmlType="submit"
                      type="primary"
                      className="btn bg-dark-blue fs-16"
                      block
                      aria-labelledby='Signin'
                    >
                      {t('Sign In')}
                    </Button>
                  </Form>

                  <Paragraph className="text-center mt-3">
                      {t("Don’t have an account?")} <NavLink to={'/signup'}>{t("Sign Up")}</NavLink>
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
              <Dropdown menu={{ items: lang }} trigger={["click"]} className="lang-dropdown">
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
                  <Image src="/assets/images/logo.png" alt="jusoor logo" width={200} preview={false} />
                  <Title level={5} className="m-0 text-white text-center">Shorten the path</Title>
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

export { LoginPage };
