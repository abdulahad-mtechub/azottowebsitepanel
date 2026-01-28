import { forwardRef, useEffect, useImperativeHandle,useState } from "react";
import { Card, Radio, Col, Flex, Form, Image, Row, Typography } from "antd";
import { MyInput } from "../../Forms";
import { ModuleTopHeading } from "../../Pagecomponents";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;
const ConditionMatrix = forwardRef(({ data, setData }, ref) => {
  const { t } = useTranslation();
  const { formatPhone } = useFormatNumber();
  const [form] = Form.useForm();
  useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));
  const [isAccess, setIsAccess] = useState(data.isByTakbeer === true);

  const handleRadioChange = (e) => {
    setIsAccess(e.target.value === 2);
  };

  const handleFormChange = (_, allValues) => {
    const { supportDuration, noSession, growthOpportunities, reasonSelling } =
      allValues;

    setData((prev) => {
      const updated = {
        ...prev,
        supportDuration,
        supportSession: noSession,
        growthOpportunities,
        reason: reasonSelling,
      };

      return JSON.stringify(updated) !== JSON.stringify(prev) ? updated : prev;
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      supportDuration: data.supportDuration || undefined,
      noSession: data.supportSession || undefined,
      growthOpportunities: data.growthOpportunities,
      businessPrice: data.price || undefined,
      reasonSelling: data.reason,
    });
  }, [data, form]);
  return (
    <>
      <Flex
        justify="space-between"
        className="mb-3"
        gap={10}
        wrap
        align="flex-start"
      >
        <Flex vertical gap={1}>
          <ModuleTopHeading
            level={4}
            name={t("Condition Matrix")}
          />
          <Text className="text-gray">
            {t(
              "Help buyers understand the future potential and your exit strategy"
            )}
          </Text>
        </Flex>
        <Flex className="pill-round" gap={8} align="center">
          <Image
            src="/assets/icons/info-b.png"
            preview={false}
            width={16}
            alt={t("info icon")}
          />
          <Text className="fs-12 text-sky">
            {t("For any query, contact us on")}{" "}
            {formatPhone("+090078601")}
          </Text>
        </Flex>
      </Flex>
      <Form
        layout="vertical"
        form={form}
        requiredMark={false}
        onValuesChange={handleFormChange}
      >
        <Card className="shadow-d radius-12 border-gray">
          <Form layout="vertical" form={form} onValuesChange={handleFormChange}>
            <Row gutter={24}>
            <Col xs={24} sm={24} md={24}>
            <Text>Status</Text>
              <Flex>
                <Radio.Group
                  onChange={handleRadioChange}
                  value={isAccess ? 2 : 1}
                  className="mb-3 margintop-5"
                >
                  <Radio value={1} className="fs-14">
                    <Flex gap={3} align="center">
                      {t("Draft")}
                    </Flex>
                  </Radio>
                  <Radio value={2} className="fs-14">
                    <Flex gap={3} align="center">
                      {t("Active")}
                    </Flex>
                  </Radio>
                  <Radio value={2} className="fs-14">
                    <Flex gap={3} align="center">
                      {t("Paused")}
                    </Flex>
                  </Radio>
                  <Radio value={2} className="fs-14">
                    <Flex gap={3} align="center">
                      {t("Sold")}
                    </Flex>
                  </Radio>
                </Radio.Group>
              </Flex>
              </Col>
              <Col xs={24} sm={24} md={12}>
                <MyInput
                  label={t("Listing Status")}
                  name="vinNumber"
                  required
                  disabled={true}
                />
              </Col>
  
              <Col xs={24} sm={24} md={12}>
              <MyInput
                  label={t("Vehicle Price")}
                  name="vehicleprice"
                  required
                  message={t("Please enter vehicle price")}
                  placeholder={t("Write vehicle price")}
                />
              </Col>
              <Col xs={24} sm={24} md={24}>
              <MyInput
                  label={t("Description")}
                  name="description"
                  required
                  message={t("Please enter Description")}
                  placeholder={t("Write Description")}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </Form>
    </>
  );
});

export { ConditionMatrix };
