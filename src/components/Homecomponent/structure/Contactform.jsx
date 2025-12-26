import {
  Button,
  Col,
  Divider,
  Flex,
  Form,
  Image,
  message,
  Row,
  Typography,
} from "antd";
import { WhatsAppOutlined } from "@ant-design/icons";
import { MyInput } from "../../Forms";
import { useTranslation } from "react-i18next";
import { useMutation } from "@apollo/client";
import { CREATE_CONTACT } from "../../../graphql";

const { Text, Title } = Typography;

const Contactform = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [createContact, { loading }] = useMutation(CREATE_CONTACT);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values) => {
    try {
      const result = await createContact({
        variables: {
          input: values,
        },
      });

      if (result?.errors) {
        const errorMsg = result.errors[0]?.message || "Failed to send message";
        messageApi.error(t(errorMsg));
        return;
      }

      if (result?.data?.createContactUs?.id) {
        form.resetFields();
        messageApi.success(t("Your message has been sent successfully!"));
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      const errorMessage =
        error?.graphQLErrors?.[0]?.message ||
        error?.message ||
        "Failed to send message. Please try again.";
      messageApi.error(t(errorMessage));
    }
  };

  return (
    <>
      {contextHolder}
      <div className="feature bg-light-brand">
        <div className="container">
          <Row gutter={[24, 24]} align={"middle"}>
            <Col span={24}>
              <Flex
                vertical
                justify="center"
                align="center"
                gap={10}
                className="mx-width"
              >
                <div className="tag fw-500 bg-secondary fw-500 text-brand">
                  {t("Contact With Jusoor")}
                </div>
                <Title className="m-0" level={2}>
                  {t("Reach Out to")}{" "}
                  <span className="text-brand">{t("Jusoor Team")}</span>
                </Title>
                <Text className="fs-14">
                  {t(
                    "Have a question about a listing or need help getting started? Our team is here to assist you at every stage — from browsing businesses to finalizing the deal. Get in touch and let us guide you through the process with confidence."
                  )}
                </Text>
              </Flex>
            </Col>

            <Col
              lg={{ span: 11 }}
              md={{ span: 0 }}
              sm={{ span: 0 }}
              xs={{ span: 0 }}
            >
              <Flex justify="center">
                <Image
                  src="/assets/images/contact.png"
                  alt={t("contact image")}
                  preview={false}
                />
              </Flex>
            </Col>

            <Col
              lg={{ span: 13 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                onFinish={handleSubmit}
              >
                <Row>
                  <Col span={24}>
                    <MyInput
                      label={t("Full Name")}
                      name="name"
                      required
                      message={t("Please enter name")}
                      placeholder={t("Enter your full name")}
                    />
                  </Col>
                  <Col span={24}>
                    <MyInput
                      label={t("Email")}
                      name="email"
                      required
                      message={t("Please enter email")}
                      placeholder={t("Enter your email address")}
                    />
                  </Col>
                  <Col span={24}>
                    <MyInput
                      textArea
                      label={t("Message")}
                      name="message"
                      required
                      message={t("Please enter message")}
                      placeholder={t("Write your question or message here...")}
                      rows={7}
                    />
                  </Col>
                  <Col span={24}>
                    <Button
                      aria-labelledby={t("Submit")}
                      type="button"
                      onClick={form.submit}
                      loading={loading}
                      className="btn btn-bg w-100"
                    >
                      {t("Submit")}
                    </Button>
                  </Col>
                  <Col span={24}>
                    <Divider className="my-2">{t("Or")}</Divider>
                  </Col>
                  <Col span={24}>
                    <Flex gap={10} align="center" justify="center">
                      <Text className="text-gray fs-13">
                        {t("Message Us on WhatsApp")}
                      </Text>
                      <Button
                        aria-labelledby={t("Whatsapp")}
                        className="bg-green text-white rounded-20 fs-13"
                      >
                        {t("WhatsApp")} <WhatsAppOutlined />
                      </Button>
                    </Flex>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export { Contactform };
