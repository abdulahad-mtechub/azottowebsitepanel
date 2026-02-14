import {
    Form,
    Button,
    Typography,
    Row,
    Col,
    Flex,
    Image,
    message,
} from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useCoinbaseAuth } from "../hooks/useCoinbaseAuth";
import { useMutation, gql } from "@apollo/client";

const { Title, Paragraph } = Typography;

// Define the GraphQL mutation
const COINBASE_LOGIN = gql`
    mutation CoinbaseLogin($input: CoinbaseWalletLoginInput!) {
        coinbaseLogin(input: $input) {
            user {
                id
            }
            token
        }
    }
`;

const CoinbaseAuthWithHook = () => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const navigate = useNavigate();

    const {
        walletAddress,
        signature,
        isConnected,
        isLoading,
        error,
        signIn,
        disconnect,
    } = useCoinbaseAuth({
        appName: "Axottow",
        appLogoUrl: "https://example.com/logo.png",
        darkMode: true,
    });

    // Apollo mutation hook
    const [coinbaseLogin, { loading: mutationLoading }] = useMutation(COINBASE_LOGIN, {
        onCompleted: (data) => {
            if (data?.coinbaseLogin?.token) {
                localStorage.setItem("authToken", data.coinbaseLogin.token);
                localStorage.setItem("userId", data.coinbaseLogin.user.id);
                messageApi.success("Authentication successful!");
                setTimeout(() => navigate("/"), 1000);
            }
        },
        onError: (error) => {
            console.error("Login error:", error);
            messageApi.error(error.message || "Authentication failed");
                disconnect();
        },
    });

    const handleSubmit = async (values) => {
        try {
            // Get auth data from Coinbase wallet
            const authData = await signIn(values.email);
console.log(authData);

            // Call GraphQL mutation
            await coinbaseLogin({
                variables: {
                    input: {
                        email: authData.email,
                        address: authData.address,
                        message: authData.message,
                        signature: authData.signature,
                        timestamp: authData.timestamp,
                    },
                },
            });
        } catch (err) {
            console.error("Submission error:", err);
            messageApi.error(err.message || "Authentication failed");
            disconnect()
        }
    };

    return (
        <>
            {contextHolder}

            <Row className="signup-page" align="middle">
                {/* LEFT SIDE - FORM */}
                <Col xs={24} md={12} lg={16} className="signup-form-container">
                    <div className="form-inner">
                        <Button
                            shape="circle"
                            onClick={() => navigate("/")}
                            style={{
                                backgroundColor: "#1B1F41",
                                borderColor: "#1B1F41",
                            }}
                        >
                            <ArrowLeftOutlined style={{ color: "#0000FF" }} />
                        </Button>

                        <NavLink to="/">
                            <div className="logo">
                                <img src="/logo.png" alt="logo" height={70} />
                            </div>
                        </NavLink>

                        {!isConnected ? (
                            <>
                                <Title level={3} className="text-white">
                                    Connect Coinbase Wallet
                                </Title>

                                <Paragraph className="text-white">
                                    Enter your email to sign message with Coinbase Wallet.
                                </Paragraph>

                                <Form
                                    layout="vertical"
                                    form={form}
                                    onFinish={handleSubmit}
                                    requiredMark={false}
                                >
                                    <Form.Item
                                        label={<span className="text-white">Email Address</span>}
                                        name="email"
                                        rules={[
                                            { required: true, message: "Please enter email" },
                                            {
                                                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Enter valid email",
                                            },
                                        ]}
                                    >
                                        <input
                                            className="custom-dark-input"
                                            placeholder="Enter email address"
                                        />
                                    </Form.Item>

                                    {error && (
                                        <Paragraph style={{ color: "#ff4d4f" }}>
                                            {error}
                                        </Paragraph>
                                    )}

                                    <Button
                                        htmlType="submit"
                                        type="primary"
                                        block
                                        className="btn bg-dark-blue fs-16"
                                        loading={isLoading || mutationLoading}
                                    >
                                        Connect & Sign
                                    </Button>
                                </Form>
                            </>
                        ) : (
                            <>
                                <Title level={3} className="text-white">
                                    Wallet Connected
                                </Title>

                                <Paragraph className="text-white">
                                    <strong>Wallet:</strong>
                                    <br />
                                    {walletAddress}
                                </Paragraph>

                                <Paragraph className="text-white">
                                    <strong>Signature:</strong>
                                    <br />
                                    {signature?.slice(0, 20)}...
                                    {signature?.slice(-20)}
                                </Paragraph>

                                <Button
                                    danger
                                    block
                                    onClick={disconnect}
                                    className="fs-16"
                                >
                                    Disconnect
                                </Button>
                            </>
                        )}
                    </div>
                </Col>

                {/* RIGHT SIDE - VISUAL */}
                <Col xs={0} md={12} lg={8} className="signup-visual-container">
                    <Flex vertical justify="center" align="center" className="h-100">
                        <Image
                            src="/assets/images/logo.svg"
                            width={200}
                            preview={false}
                        />
                    </Flex>
                </Col>
            </Row>
        </>
    );
};

export default CoinbaseAuthWithHook;