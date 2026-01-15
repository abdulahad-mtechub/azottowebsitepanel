import { Breadcrumb, Flex, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { RightOutlined } from "@ant-design/icons";
import {
  AboutComponent,
  CounterSection,
  OurMission,
  Whatwedo,
} from "../components";
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const Aboutus = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <div className="padd-1">
        <div className="bg-dark-blue bread-cs">
          <div className="container">
            <Breadcrumb
              separator={
                <Text className="text-gray">
                  <RightOutlined className="fs-10" />
                </Text>
              }
              items={[
                {
                  title: (
                    <Text
                      className="cursor text-gray"
                      onClick={() => navigate("/")}
                    >
                      {t("Home")}
                    </Text>
                  ),
                },
                {
                  title: (
                    <Text className="fw-500 text-white">
                      {t("About Jusoor")}
                    </Text>
                  ),
                },
              ]}
            />
            <Flex vertical gap={15} className="w-100 search-cs text-center">
              <Title level={2} className="text-white m-0">
                {t("About Jusoor")}
              </Title>
              <Text className="text-light-gray fs-16">
                {t(
                  "Start your journey with Jusoor by gaining a clear understanding of our vision, services, and what makes us stand out."
                )}
              </Text>
            </Flex>
          </div>
        </div>
        <div>
          <AboutComponent />
          <OurMission />
          <CounterSection />
          <Whatwedo />
        </div>
      </div>
    </>
  );
};

export { Aboutus };
