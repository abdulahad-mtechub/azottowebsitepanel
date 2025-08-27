import { Form, Button, Typography, Row, Col, Divider, Checkbox, Flex, Image, Dropdown, Space,Spin,message } from "antd";
import { MyInput } from "../components";
import { NavLink } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../graphql/mutation/login";
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";

const { Title, Text, Paragraph } = Typography;
const LoginPage = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();
    const [loginUser, { loading:userLoading, error }] = useMutation(LOGIN);
    const [form] = Form.useForm();
    const [selectedLang, setSelectedLang] = useState({
        key: "1",
        label: "EN",
        icon: "assets/icons/en.png",
      });
    const [redirecting, setRedirecting] = useState(false);

    const handleFinish = async (values) => {
      try {
        const { email, password } = values;
    
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

    const lang = [
      {
        key: "1",
        label: (
          <Space>
            <Image src="assets/icons/en.png" width={20} alt="English" preview={false} />
            <Text className='fs-13'>EN</Text>
          </Space>
        ),
        onClick: () =>
          setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.png" }),
      },
      {
        key: "2",
        label: (
          <Space>
            <Image src="assets/icons/ar.png" width={20} alt="Arabic" preview={false} />
            <Text className='fs-13'>AR</Text>
          </Space>
        ),
        onClick: () =>
          setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
      },
    ];
    if (userLoading || redirecting) {
      return (
          <Flex justify="center" align="center" style={{ height: "200px" }}>
              <Spin size="large" />
          </Flex>
      );
    }
    return (
      <>
      {contextHolder}
      <Row className="signup-page" align={"middle"}>
            <Col  xs={24} sm={24} md={14} lg={16} className="signup-form-container">
                <div className="form-inner">
                    <Button shape="circle" onClick={()=>navigate('/')}>
                      <ArrowLeftOutlined />
                    </Button>
                    <NavLink to={'/'}>
                      <div className="logo">
                        <img src="/assets/images/logo-1.png" style={{ height: "70px" }} />
                      </div>
                    </NavLink>

                    <Title level={3}>Signin to your account</Title>
                    <Paragraph>Enter your credentials to login to your account.</Paragraph>

                    <Button className="btn bg-nafth fs-16" block>
                        Signin via Nafath
                    </Button>
                    <Divider className="text-gray">Or</Divider>

                    <Form 
                      layout="vertical" 
                      form={form} 
                      onFinish={handleFinish}
                      requiredMark={false}
                    >
                      <MyInput
                        label='Email Address'
                        name='email'
                        required
                        message="Please enter Email Address"
                        placeholder='Enter Email Address'
                      />
                      <MyInput
                        label='Password'
                        type='password'
                        name='password'
                        required
                        message="Please enter password"
                        placeholder='Enter Password'
                      />
                      <Flex justify="space-between" className="mb-3">
                        <Checkbox>Remember Me</Checkbox>
                        <NavLink to={'/forgotpass'} className="fs-13 text-brand">
                            Forget Password?
                        </NavLink>
                      </Flex>
                      <Button
                        htmlType="submit"
                        type="primary"
                        className="btn bg-dark-blue fs-16"
                        block
                        userLoading={userLoading}
                      >
                        Signin
                      </Button>
                    </Form>

                    <Paragraph className="text-center mt-3">
                        Don’t have an account? <NavLink to={'/signup'}>Sign Up</NavLink>
                    </Paragraph>
                </div>
            </Col>
            <Col
                xs={0}
                md={10}
                lg={8}
                className="signup-visual-container"
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
                    <Image src="/assets/images/logo.png" width={200} preview={false} />
                    <Title level={5} className="m-0 text-white text-center">Shorten the path</Title>
                  </Flex>
                  <div className="bg-shade">
                    <img src="/assets/images/login.gif" alt="Signup Visual" style={{ width: "100%",opacity:.7 }} />
                  </div>
                </Flex>
            </Col>
        </Row>
      </>
        
    );
};

export { LoginPage };
