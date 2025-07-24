import { useState } from "react";
import { Form, Button, Upload, Typography, Row, Col, Radio, Space, Select, Divider, Checkbox, Image, Flex, Steps } from "antd";
import { message } from "antd";
import { useMutation } from "@apollo/client";
import { CREATE_USER } from "../graphql/mutation/login";
import { useNavigate } from "react-router-dom";
import { MyInput, MySelect } from "../components";
import { NavLink } from "react-router-dom";
import { district, cities  } from '../data';
import imageCompression from 'browser-image-compression';
import { ArrowLeftOutlined, CheckOutlined } from "@ant-design/icons";

const { Title, Paragraph } = Typography;
const SignupPage = () => {
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

    const [createUser, { loading:userLoading, error }] = useMutation(CREATE_USER);

    const handleFinish = async () => {
        try {
            const formData = form.getFieldsValue(true);
            const input = {
                name: formData.fullName,
                email: formData.email,
                district: formData.district,
                city: formData.city,
                phone: formData.phoneNo,
                password: formData.password,
                documents: documents.length > 0 ? documents : undefined,
            };
            console.log("input",input)
    
            const { data } = await createUser({ variables: { input } });
    
            messageApi.success("Account created successfully!");
            // redirect or reset form
            form.resetFields();
            setTimeout(() => {
                navigate("/");
              }, 1000); // 1 second delay
        } catch (err) {
            messageApi.error("Failed to create user. Please try again.");
        }
    };

    const handleUpload = async ({ file,title }) => {
        try {
            setLoading(true); 
            let compressedFile = file;
            if (file.type.startsWith('image/')) {
                compressedFile = await imageCompression(file, {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1024,
                  useWebWorker: true,
                });
            }
            const formData = new FormData();
            formData.append('file', file);
        
            // Call your upload API
            const res = await fetch('https://220.152.66.148.host.secureserver.net/upload', {
                method: 'POST',
                body: formData,
            });
        
            if (!res.ok) throw new Error('Upload failed');
            const data = await res.json();
        
            // Update documents state for front side
            setDocuments(prevDocs => {
                // Remove existing 'front' doc if any
                // Add new
                const filtered = prevDocs.filter(doc => doc.title !== title);
                return [...filtered, {
                title: 'front',
                fileName: data.fileName,
                filePath: data.fileUrl,
                fileType: data.fileType,
                }];
            });

            if (title === 'front') setFrontFileName(data.fileName);
            else if (title === 'back') setBackFileName(data.fileName);
            else if (title === 'passport') setPassportFileName(data.fileName);
      
        } catch (err) {
          console.error(err);
          messageApi.error('Failed to upload front file');
        }finally {
            setLoading(false); // Stop loading
        }
    };
      

    const [current, setCurrent] = useState(0);

    const onChange = (value) => {
        setCurrent(value);
    };

    const next =async () => {
        if (current < steps.length - 1) {

            await form.validateFields();
            setCurrent(current + 1);
        }
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const steps = [
        {
            title: 'Basic Information',
            content:  <Row gutter={[12, 0]}>                
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
                        options={district}
                        onChange={(val) => setSelectedDistrict(val)}
                    />
                </Col>
                <Col lg={{span: 12}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                    <MySelect
                        label='Select City'
                        name='city'
                        required
                        message="Please enter city"
                        placeholder='select city'
                        options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
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
            </Row>,
        },
        {
            title: 'Identity & Security',
            content: <Row gutter={[12, 0]}>
                <Col span={24}>
                    <Form.Item label="Upload National ID or Passport" required>
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
                                <Radio value="national_id">National ID</Radio>
                                <Radio value="passport">Passport</Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                </Col>

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
                                        onChange={(info) => handleUpload({ file: info.file, title: 'front' })}
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
                                        onChange={(info) => handleUpload({ file: info.file, title: 'back' })}
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
                                    onChange={(info) => handleUpload({ file: info.file, title: 'passport' })}
                                >
                                    <Button className='btn text-black bg-gray border-gray'>Upload</Button>
                                </Upload>
                            </Col>
                        </Row>
                    </Col>
                )}
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
                    <Checkbox>
                        I agree to <NavLink to={'/termofuse'}>Terms of Service</NavLink> and <NavLink to={''}>Privacy Policy</NavLink>
                    </Checkbox>
                </Col>
            </Row>,
        },
    ];

     

    const items = steps.map((item, index) => ({
        key: item.title,
        title: (
            <span className={`custom-step-title ${current >= index ? 'completed' : ''}`}>
                {item.title}
            </span>
        ),
    }));

    return (
        <>
        {contextHolder}
        <Row className="signup-page" >
            <Col xs={24} sm={24} md={14} lg={16}>
                <div className="signup-form-container ">
                    <div className="form-inner">
                        <Button shape="circle" onClick={()=>navigate('/')}>
                            <ArrowLeftOutlined />
                        </Button>
                        <NavLink to={'/'}>
                            <div className="logo">
                                <img src="/assets/images/logo-1.png" style={{ height: "70px" }} />
                            </div>
                        </NavLink>
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
                            <Steps
                                current={current}
                                onChange={onChange}
                                items={items}
                                progressDot={(dot, { status, index }) => (
                                    <span className={`custom-dot ${current > index ? 'completed' : ''} ${current === index ? 'active' : ''}`}>
                                        {current > index ? (
                                            <CheckOutlined />
                                        ) : (
                                            dot
                                        )}
                                    </span>
                                )}
                                className='mt-2 mb-2'
                            />
                            <div className="step-content">{steps[current].content}</div>
                            <Flex gap={10} justify='end'>
                                <Button type="button" className="btn bg-transparent border-gray text-black fs-14 my-2" 
                                    onClick={prev}
                                    disabled={current === 0 ? true: false}
                                    block
                                >
                                    Back
                                </Button>    
                                {current < steps.length - 1 && (
                                    <Button className="btn bg-dark-blue fs-14 my-2" 
                                        block onClick={next}>
                                        Next
                                    </Button>
                                )}
    
                                {current === steps.length - 1 && (
                                    <Button type="primary" 
                                        htmlType="submit" 
                                        className="btn bg-dark-blue fs-14 my-2" 
                                        block>
                                        Signup
                                    </Button>
                                )}
                            </Flex>
                            <Paragraph className="text-center">
                                Don't have an account? <NavLink to={'/login'}>Signin</NavLink>
                            </Paragraph>
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
        </>
        
    );
};

export { SignupPage };