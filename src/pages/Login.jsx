import { Form, Button, Typography, Row, Col, Divider, Checkbox, Flex, Image } from "antd";
import { MyInput } from "../components";
import { NavLink } from "react-router-dom";

const { Title, Paragraph } = Typography;

const LoginPage = () => {
    const [form] = Form.useForm();

    const handleFinish = (values) => {
        console.log("Form values:", values);
    };

    return (
        <Row className="signup-page" align={"middle"}>
            <Col xs={24} sm={24} md={14} lg={16} className="signup-form-container">
                <div className="form-inner overflow-style">
                    <div className="logo">
                        <img src="/assets/images/logo-1.png" style={{ height: "70px" }} />
                    </div>

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
                      <Button type="submit" className="btn bg-dark-blue fs-16" block>
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
    );
};

export { LoginPage };
