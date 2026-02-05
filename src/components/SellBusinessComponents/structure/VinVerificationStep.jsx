import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Card,
  Col,
  Flex,
  Form,
  Row,
  Radio,
  Typography,
  Image,
  Table,
} from "antd";
import { MyInput } from "../../Forms";
import { ModuleTopHeading } from "../../Pagecomponents";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;

const VinVerificationStep = forwardRef(({ data, setData, readOnly }, ref) => {
  const { formatPhone } = useFormatNumber();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [conditionForm] = Form.useForm();
  const [isAccess, setIsAccess] = useState(data.isByTakbeer === true);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      await form.validateFields();
      await conditionForm.validateFields();
    },
  }));

  const columns = [
    { title: t("Mileage Score"), dataIndex: "title" },
    { title: t("Vehicle Age Score"), dataIndex: "sellername" },
    { title: t("Engine Condition"), dataIndex: "date" },
    { title: t("Exterior Condition"), dataIndex: "date" },
    { title: t("Overall Condition Score"), dataIndex: "date" },
  ];

  const handleRadioChange = (e) => {
    if (readOnly) return;
    setIsAccess(e.target.value === 2);
  };

  const handleConditionChange = (_, allValues) => {
    if (readOnly) return;
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
    conditionForm.setFieldsValue({
      supportDuration: data.supportDuration || undefined,
      noSession: data.supportSession || undefined,
      growthOpportunities: data.growthOpportunities,
      businessPrice: data.price || undefined,
      reasonSelling: data.reason,
    });
  }, [data, conditionForm]);

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
            name={t(
              "Verification checkpoint before a vehicle goes live on the marketplace",
            )}
          />
        </Flex>
        <Flex className="pill-round" gap={8} align="center">
          <Image
            src="/assets/icons/info-b.png"
            preview={false}
            width={16}
            alt={t("info icon")}
          />
          <Text className="fs-12 text-sky">
            {t("For any query, contact us on")} {formatPhone("+090078601")}
          </Text>
        </Flex>
      </Flex>
      <Form layout="vertical" form={form} requiredMark={false}>
        <Card className="shadow-d radius-12 border-gray mb-3">
          <Row gutter={24}>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
              <MyInput
                label={
                  <Flex align="center" gap={5}>
                    {t("Vin Verification")}
                    <Text className="fw-500">*</Text>
                  </Flex>
                }
                name="businessPrice"
                type="number"
                disabled={true}
                className="w-100"
              />
            </Col>
            {!readOnly && (
              <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                <Col xs={24} sm={24} md={24}>
                  <Text>Status</Text>
                  <Flex>
                    <Radio.Group className="mb-3 margintop-5">
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
              </Col>
            )}
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
              <Table
                size="large"
                columns={columns}
                className="pagination table table-cs"
                showSorterTooltip={false}
                scroll={{ x: 800 }}
                pagination={{
                  hideOnSinglePage: true,
                  current: 1,
                  pageSize: 10,
                  total: 10,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  pageSizeOptions: ["10", "20", "50", "100"],
                }}
              />
            </Col>
          </Row>
        </Card>
      </Form>

      <Flex
        justify="space-between"
        className="mb-3"
        gap={10}
        wrap
        align="flex-start"
      >
        <Flex vertical gap={1}>
          <ModuleTopHeading level={4} name={t("Condition Matrix")} />
          <Text className="text-gray">
            {t(
              "Help buyers understand the future potential and your exit strategy",
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
            {t("For any query, contact us on")} {formatPhone("+090078601")}
          </Text>
        </Flex>
      </Flex>

      <Form
        layout="vertical"
        form={conditionForm}
        requiredMark={false}
        onValuesChange={handleConditionChange}
      >
        <Card className="shadow-d radius-12 border-gray">
          <Form
            layout="vertical"
            form={conditionForm}
            onValuesChange={handleConditionChange}
          >
            <Row gutter={24}>
              <Col xs={24} sm={24} md={24}>
                <Text>Status</Text>
                <Flex>
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={isAccess ? 2 : 1}
                    className="mb-3 margintop-5"
                    disabled={readOnly}
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
                  disabled={readOnly}
                />
              </Col>
              <Col xs={24} sm={24} md={24}>
                <MyInput
                  label={t("Description")}
                  name="description"
                  required
                  message={t("Please enter Description")}
                  placeholder={t("Write Description")}
                  disabled={readOnly}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </Form>
    </>
  );
});

export { VinVerificationStep };
