import { useState } from "react";
import { Form, Button, Upload, Typography, Row, Col, Radio, Space, Select, Divider, Checkbox, Image, Flex } from "antd";
import { MyInput, MySelect } from "../components";
import { districtOp } from "../data";
import { NavLink } from "react-router-dom";

const { Title, Paragraph } = Typography;
const SignupPage = () => {
    const [form] = Form.useForm();
    const [idType, setIdType] = useState("national_id");
    const [frontFileName, setFrontFileName] = useState("");
    const [backFileName, setBackFileName] = useState("");
    const [passportFileName, setPassportFileName] = useState("");

    const handleFrontChange = (info) => {
        const file = info.fileList[0];
        setFrontFileName(file ? file.name : "");
    };

    const handleBackChange = (info) => {
        const file = info.fileList[0];
        setBackFileName(file ? file.name : "");
    };

    const handlePassportChange = (info) => {
        const file = info.fileList[0];
        setPassportFileName(file ? file.name : "");
    };

    const handleFinish = (values) => {
        console.log("Form submitted:", values);
        console.log("Front File:", frontFileName);
        console.log("Back File:", backFileName);
        console.log("Passport File:", passportFileName);
    };

    return (
        <Row className="signup-page" >
            <Col xs={24} sm={24} md={14} lg={16} className="overflow-style">
                <div className="signup-form-container ">
                    <div className="form-inner">
                        <div className="logo" style={{ textAlign: "center", marginBottom: 24 }}>
                            <img src="/assets/images/logo-1.png" style={{ height: "70px" }} alt="Logo" />
                        </div>
                        <Title level={3}>Verify Your Identity</Title>
                        <Paragraph>To ensure the safety of all users, we require identity verification before creating a seller account.</Paragraph>

                        <Button className="btn bg-nafth fs-16" block>
                            Signup via Nafath
                        </Button>
                        <Divider className="text-gray">Or</Divider>

                        <Form 
                            layout="vertical" 
                            form={form} 
                            onFinish={handleFinish}
                            requiredMark={false}
                        >
                            <Row gutter={[12, 0]}>
                                <Col span={24}>
                                    <MyInput
                                        label='Full Name'
                                        name='fullName'
                                        required
                                        message="Please enter full name"
                                        placeholder='Enter Full Name'
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        label='Email Address'
                                        name='email'
                                        required
                                        message="Please enter Email Address"
                                        placeholder='Enter Email Address'
                                    />
                                </Col>
                                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        label='Select District'
                                        name='district'
                                        required
                                        message="Please enter district"
                                        placeholder='select district'
                                        options={districtOp}
                                    />
                                </Col>
                                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        label='Select City'
                                        name='city'
                                        required
                                        message="Please enter city"
                                        placeholder='select city'
                                        options={districtOp}
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        name="phoneNo"
                                        label="Mobile Number" 
                                        required 
                                        message="Please enter a valid phone number" 
                                        addonBefore={
                                            <Select 
                                                defaultValue="SA" 
                                                style={{ width: 80 }} 
                                                onChange={(value) => form.setFieldsValue({ countryCode: value })}
                                            >
                                                <Select.Option value="sa">SA</Select.Option>
                                                <Select.Option value="ae">AE</Select.Option>
                                            </Select>
                                        }
                                        placeholder="3445592382" 
                                        value={form.getFieldValue("phoneNo") || ""}
                                        className='w-100'
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        label="New Password"
                                        type="password"
                                        name="password"
                                        size='large'
                                        required
                                        message={()=>{}}
                                        placeholder={'Enter Password'}
                                        validator={({ getFieldValue }) => ({
                                            validator: (_, value) => {
                                                const reg = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*\d).{8,}$/;
                                                if (!reg.test(value)) {
                                                    return Promise.reject(new Error('Password should contain at least 8 characters, one uppercase letter, one number, one special character'));
                                                } else {
                                                    return Promise.resolve();
                                                }
                                            }
                                        })}
                                    />
                                </Col>
                                <Col span={24}>
                                    <MyInput
                                        label="Confirm Password"
                                        type="password"
                                        name="confirmationPassword"
                                        size='large'
                                        dependencies={['password']}
                                        required
                                        message='Please enter confirm password'
                                        placeholder={'Enter Confirm Password'}
                                        rules={[
                                            ({ getFieldValue }) => ({
                                                validator(_, value) {
                                                    if (!value || getFieldValue('password') === value) {
                                                        return Promise.resolve();
                                                    }
                                                    return Promise.reject(new Error('The password that you entered do not match!'));
                                                },
                                            }),
                                        ]}
                                    />
                                </Col>
                                <Col span={24}>
                                    <Form.Item label="Upload National ID or Passport" required>
                                        <Radio.Group 
                                            value={idType} 
                                            onChange={(e) => {
                                                setIdType(e.target.value);
                                                // Clear existing files when changing type
                                                setFrontFileName("");
                                                setBackFileName("");
                                                setPassportFileName("");
                                            }}
                                        >
                                            <Space>
                                                <Radio value="national_id">National ID</Radio>
                                                <Radio value="passport">Passport</Radio>
                                            </Space>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>

                                {/* Conditional rendering based on ID type */}
                                {idType === "national_id" ? (
                                    <>
                                        <Col span={24}>
                                            <Row gutter={8}>
                                                <Col flex="auto">
                                                    <MyInput 
                                                        withoutForm 
                                                        size={'large'} 
                                                        className='m-0' 
                                                        placeholder="Upload Front Side" 
                                                        readOnly 
                                                        value={frontFileName} 
                                                    />
                                                </Col>
                                                <Col>
                                                    <Upload 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                        maxCount={1} 
                                                        onChange={handleFrontChange}
                                                    >
                                                        <Button className='btn text-black bg-gray border-gray'>Upload</Button>
                                                    </Upload>
                                                </Col>
                                            </Row>
                                        </Col>
                                        <Col span={24}>
                                            <Row gutter={8}>
                                                <Col flex="auto">
                                                    <MyInput 
                                                        withoutForm 
                                                        size={'large'} 
                                                        className='m-0' 
                                                        placeholder="Upload Back Side" 
                                                        readOnly 
                                                        value={backFileName} 
                                                    />
                                                </Col>
                                                <Col>
                                                    <Upload 
                                                        beforeUpload={() => false} 
                                                        showUploadList={false} 
                                                        maxCount={1} 
                                                        onChange={handleBackChange}
                                                    >
                                                        <Button className='btn text-black bg-gray border-gray'>Upload</Button>
                                                    </Upload>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </>
                                ) : (
                                    <Col span={24}>
                                        <Row gutter={8}>
                                            <Col flex="auto">
                                                <MyInput 
                                                    withoutForm 
                                                    size={'large'} 
                                                    className='m-0' 
                                                    placeholder="Upload Passport" 
                                                    readOnly 
                                                    value={passportFileName} 
                                                />
                                            </Col>
                                            <Col>
                                                <Upload 
                                                    beforeUpload={() => false} 
                                                    showUploadList={false} 
                                                    maxCount={1} 
                                                    onChange={handlePassportChange}
                                                >
                                                    <Button className='btn text-black bg-gray border-gray'>Upload</Button>
                                                </Upload>
                                            </Col>
                                        </Row>
                                    </Col>
                                )}

                                <Col span={24}>
                                    <Checkbox>
                                        I agree to <NavLink to={''}>Terms of Service</NavLink> and <NavLink to={''}>Privacy Policy</NavLink>
                                    </Checkbox>
                                </Col>
                                <Col span={24}>
                                    <Button 
                                        type="primary" 
                                        htmlType="submit" 
                                        className="btn bg-dark-blue fs-16 my-2" 
                                        block
                                    >
                                        Signup
                                    </Button>
                                </Col>
                                <Col span={24}>
                                    <Paragraph className="text-center">
                                        Don't have an account? <NavLink to={'/login'}>Signin</NavLink>
                                    </Paragraph>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Col>

            <Col
                xs={0}
                sm={0}
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

export { SignupPage };