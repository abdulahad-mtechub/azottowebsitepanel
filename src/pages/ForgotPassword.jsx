import { Form, Button, Typography, Row, Col, Image, Flex, Dropdown, Space } from "antd";
import { MyInput } from "../components";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined, DownOutlined } from "@ant-design/icons";
import { useState } from "react";
import { t } from "i18next";

const { Title, Text, Paragraph } = Typography;

const ForgotPassword = () => {
    const [form] = Form.useForm();
    const [requestState, setRequestState] = useState('request');
    const navigate = useNavigate();
    const [selectedLang, setSelectedLang] = useState({
        key: "1",
        label: "EN",
        icon: "assets/icons/en.webp",
    });

    const forgotpass = () => {
        if (requestState === "request") {
            console.log('Request send on email');
            setRequestState('otp');
        } 
        if (requestState === "otp") {
            console.log('Otp receive by email');
            setRequestState('reset');
        }
        if (requestState === "reset") {
            console.log('Now enter password and confirm password');
            setRequestState('request');
        }
    };

    const lang = [
      {
        key: "1",
        label: (
          <Space>
            <Image src="assets/icons/en.webp" width={20} alt={t("English")} preview={false} />
            <Text className='fs-13'>EN</Text>
          </Space>
        ),
        onClick: () =>
          setSelectedLang({ key: "1", label: "EN", icon: "assets/icons/en.webp", alt: t("English") }),
      },
      {
        key: "2",
        label: (
          <Space>
            <Image src="assets/icons/ar.png" width={20} alt={t("Arabic")} preview={false} />
            <Text className='fs-13'>AR</Text>
          </Space>
        ),
        onClick: () =>
          setSelectedLang({ key: "2", label: "AR", icon: "assets/icons/ar.png" }),
      },
    ];

    return (
        <Row className="signup-page">
            <Col xs={24} sm={24} md={14} lg={16} className="signup-form-container">
                <div className="form-inner">
                    <Button aria-labelledby='Arrow left' shape="circle" onClick={()=>navigate('/')}>
                      <ArrowLeftOutlined />
                    </Button>
                    <NavLink to={'/'}>
                      <div className="logo">
                        <img src="/assets/images/logo-1.png" alt="jusoor-logo" height={70} fetchPriority="high" />
                      </div>
                    </NavLink>
                    <div>
                        {requestState === 'otp' && 
                            <Button aria-labelledby='Arrow left' type='button' onClick={()=>setRequestState('request')} ghost className="text-black fs-18 p-0 border-0"><ArrowLeftOutlined /></Button>
                        }
                    </div>
                    <Title level={3}>
                        {requestState === 'request' && t('Forgot Password')}
                        {requestState === 'otp' && t('OTP')}
                        {requestState === 'reset' && t('Reset Password')}
                    </Title>
                    <Paragraph>
                        {requestState === 'request' && t('Enter the email address to send you the OTP code.')}
                        {requestState === 'otp' && t('Enter the 5 digit OTP code sent to your email abc****4@gmail.com')}
                        {requestState === 'reset' && null}
                    </Paragraph>
                    <Form layout="vertical" form={form} requiredMark={false}>
                      <Row>
                        {requestState === 'request' && (
                            <Col span={24}>
                                <MyInput
                                    label={t('Email Address')}
                                    name='email'
                                    required
                                    message={t('Please enter Email Address')}
                                    placeholder={t('Enter Email Address')}
                                />
                            </Col>
                        )}
                        {requestState === 'otp' && (
                            <Col span={24}>
                                <MyInput
                                    oTp
                                    label={t('OTP')}
                                    name='otp'
                                    type='number'
                                    required
                                    message={t('Please enter the OTP sent to your email')}
                                    placeholder={t('Enter OTP')}
                                    onKeyPress={(e) => {
                                        if (!/[0-9]/.test(e.key)) {
                                        e.preventDefault();
                                        }
                                    }}
                                    className='w-100'
                                    id='otpcs'
                                />
                            </Col>
                        )}
                        {requestState === 'reset' && (
                            <>
                                <Col span={24}>
                                    <MyInput
                                        label={t("New Password")}
                                        type="password"
                                        name="password"
                                        size='large'
                                        required
                                        message={() => {}}
                                        validator={({ getFieldValue }) => ({
                                            validator: (_, value) => {
                                                const reg = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                                                if (!reg.test(value)) {
                                                    return Promise.reject(new Error(t('Password should contain at least 8 characters, one uppercase letter, one number, one special character')));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            }
                                        })}
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        label={t("Confirm Password")}
                                        type="password"
                                        name="confirmationPassword"
                                        size='large'
                                        dependencies={['password']}
                                        required
                                        message={t('Please enter confirm password')}
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error(t('The password that you entered do not match!')));
                                                },
                                            }),
                                        ]}
                                        validator={({ getFieldValue }) => ({
                                            validator(_, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error(t('The password that you entered do not match!')));
                                            },
                                        })}
                                    />
                                </Col>
                            </>
                        )}
                        <Col span={24}>
                            <Button aria-labelledby='Forgot state button' htmlType="submit" className="btn bg-dark-blue fs-16" block onClick={forgotpass}>
                                {requestState === 'request' && t('Next')}
                                {requestState === 'otp' && t('Verify OTP')}
                                {requestState === 'reset' && t('Reset Password')}
                            </Button>
                        </Col>
                        <Col span={24}>
                            <Paragraph className="text-center mt-3">
                                {requestState === 'request' && <>{t('Remember Password?')} <NavLink to={'/login'}>{t('Signin')}</NavLink></>}
                                {requestState === 'otp' && <>{t('Didn’t receive code?')} <NavLink to={''}>{t('Resend')}</NavLink></>}
                                {requestState === 'reset' && null}
                            </Paragraph>
                        </Col>
                      </Row>
                    </Form>
                </div>
            </Col>

            <Col xs={0} sm={0} md={10} lg={8} className="signup-visual-container">
                <Dropdown menu={{ items: lang }} trigger={["click"]} className="lang-dropdown">
                  <Button
                    onClick={(e) => e.preventDefault()}
                    className="bg-transparent btn-outline btn p-2 border-white"
                    aria-labelledby='Language button'
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
                        <Image src="/assets/images/logo.webp" alt={t("jusoor logo")} width={200} preview={false} fetchPriority="high"/>
                        <Title level={5} className="m-0 text-white text-center">{t('Shorten the path')}</Title>
                    </Flex>
                    <div className="bg-shade">
                        <img src="/assets/images/login.gif" alt={t("jusoor-gif-image")} className="w-100 opacity-7" fetchPriority="high" />
                    </div>
                </Flex>
            </Col>
        </Row>
    );
};

export { ForgotPassword };
