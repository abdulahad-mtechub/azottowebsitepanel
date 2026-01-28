import {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useMemo,
} from "react";
import {
  Card,
  Col,
  Flex,
  Form,
  Image,
  Radio,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { MyDatepicker, MyInput, MySelect } from "../../Forms";
import { ModuleTopHeading } from "../../Pagecomponents";
import { teamsizeOp, useCities, useDistricts } from "../../../data";
import { GET_CATEGORIES } from "../../../graphql/query/business";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";

const { Text } = Typography;
const VinDetailStep = forwardRef(({ data, setData }, ref) => {
  const { t } = useTranslation();
  const { formatPhone } = useFormatNumber();
  const district = useDistricts();
  const cities = useCities();
  const { data: categoryData } = useQuery(GET_CATEGORIES);
  const [form] = Form.useForm();
  const [isAccess, setIsAccess] = useState(data.isByTakbeer === true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get language from localStorage
  const isArabic = localStorage.getItem("lang") === "ar";

  useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));

  const categories = useMemo(
    () =>
      categoryData?.getAllCategories?.categories?.map((cat) => ({
        id: cat.id,
        name: isArabic ? cat.arabicName : cat.name,
        arabicName: cat.arabicName,
        isDigital: cat.isDigital,
      })) || [],
    [categoryData, isArabic]
  );

  const handleRadioChange = (e) => {
    setIsAccess(e.target.value === 2);
  };

  const handleFormChange = (_, allValues) => {
    const selected = categories.find((c) => c.name === allValues.category);
    const id = selected?.id;

    setSelectedCategory(allValues.category);
    setData((prev) => ({
      ...prev,
      isByTakbeer: isAccess,
      businessTitle: allValues.title,
      categoryName: allValues.category,
      categoryId: id,
      district: allValues.district,
      city: allValues.city,
      foundedDate: allValues.dob,
      numberOfEmployees: allValues.teamSize,
      description: allValues.description,
      url: allValues.url,
    }));
  };

  useEffect(() => {
    if (!isInitialized && data) {
      setIsAccess(data.isByTakbeer === true);

      const initialTeamSize = (() => {
        if (!data.numberOfEmployees) return undefined;
        const byName = teamsizeOp.find(
          (opt) => String(opt.name) === String(data.numberOfEmployees)
        );
        if (byName) return byName.name;
        const byId = teamsizeOp.find(
          (opt) => String(opt.id) === String(data.numberOfEmployees)
        );
        return byId ? byId.name : undefined;
      })();

      form.setFieldsValue({
        title: data.businessTitle,
        category: data.categoryName,
        district: data.district,
        city: data.city,
        dob: data.foundedDate,
        teamSize: initialTeamSize,
        description: data.description,
        url: data.url,
      });

      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isInitialized]);

  // After options load, derive dependent UI state (selected district/cat) without overwriting form values
  useEffect(() => {
    if (!data) return;
    if (data.district && district.length > 0) {
      const districtObj =
        district.find((d) => d.name === data.district) ||
        district.find((d) => d.id === String(data.district).toLowerCase());
      if (districtObj) setSelectedDistrict(districtObj.id);
    }
    if (data.categoryId && categories.length > 0) {
      const cat = categories.find((cat) => cat.id === data.categoryId);
      if (cat) setSelectedCategory(cat);
    }
  }, [data, district, categories]);

  // Once options are available, ensure ALL fields show initial values if they were set before options loaded
  useEffect(() => {
    if (!data) return;
    const current = form.getFieldsValue([
      "title",
      "category",
      "district",
      "city",
      "dob",
      "teamSize",
      "description",
      "url",
    ]);

    // Normalize team size to the label the Select expects
    const initialTeamSize = (() => {
      if (!data.numberOfEmployees) return undefined;
      const byName = teamsizeOp.find(
        (opt) => String(opt.name) === String(data.numberOfEmployees)
      );
      if (byName) return byName.name;
      const byId = teamsizeOp.find(
        (opt) => String(opt.id) === String(data.numberOfEmployees)
      );
      return byId ? byId.name : undefined;
    })();

    const patch = {};
    if (!current.title && data.businessTitle) patch.title = data.businessTitle;
    if (!current.category && data.categoryName)
      patch.category = data.categoryName;
    if (!current.district && data.district) patch.district = data.district;
    // Re-apply city once district options are ready
    if (!current.city && data.city && selectedDistrict) patch.city = data.city;
    if (!current.dob && data.foundedDate) patch.dob = data.foundedDate;
    if (!current.teamSize && initialTeamSize) patch.teamSize = initialTeamSize;
    if (!current.description && data.description)
      patch.description = data.description;
    if (!current.url && data.url) patch.url = data.url;

    if (Object.keys(patch).length > 0) form.setFieldsValue(patch);
  }, [categories.length, district.length, selectedDistrict, data, form]);

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
          <ModuleTopHeading level={4} name={t("Tell us about your vehicle")} />
          <Text className="text-gray">
            {t("Let's start with the basic vehicle information")}
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

      <Card className="shadow-d radius-12 border-gray">
        <Form layout="vertical" form={form} onValuesChange={handleFormChange}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12}>
              <MyInput
                label={t("VIN Number")}
                name="vinNumber"
                required
                message={t("Please enter vin number")}
                placeholder={t("Write vin number")}
                rules={[
                  { required: true, message: t("VIN is required") },
                  { min: 17, message: t("VIN must be 17 characters") },
                ]}
              />
            </Col>

            <Col xs={24} sm={24} md={12}>
            <MyInput
                label={t("Vehicle Make")}
                name="vehiclemake"
                required
                message={t("Please enter vehicle make")}
                placeholder={t("Write vehicle make")}
              />
            </Col>

            <Col xs={24} sm={24} md={12}>
            <MyInput
                label={t("Vehicle Model")}
                name="model"
                required
                message={t("Please enter vehicle model")}
                placeholder={t("Write vehicle model")}
              />
            </Col>

            <Col xs={24} sm={24} md={12}>
              <MyDatepicker
                datePicker
                picker="year"
                label={t("Model Year")}
                name="dob"
                required
                message={t("Please enter model year")}
                placeholder={t("Enter model year")}
              />
            </Col>

            <Col xs={24} sm={24} md={12}>
            <MyInput
                label={t("Engine Number")}
                name="engineNumber"
                required
                message={t("Please enter engine number")}
                placeholder={t("Write engine number")}
              />
            </Col>

            <Col xs={24} sm={24} md={12}>
            <MyInput
                label={t("Chassis Number")}
                name="chassisNumber"
                required
                message={t("Please enter chassis number")}
                placeholder={t("Write chassis number")}
              />
            </Col>

            <Col span={24}>
              <MyInput
                label={t("Current Mileage")}
                name="mileage"
                placeholder={t("Add current milage")}
                required={selectedCategory?.isDigital}
              />
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
});

export { VinDetailStep };
