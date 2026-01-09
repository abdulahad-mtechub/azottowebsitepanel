import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Modal,
  Row,
  Select,
  Typography,
  message,
} from "antd";
import { MyInput, MySelect } from "../../Forms";
import { CloseOutlined } from "@ant-design/icons";
import { UPDATE_USER } from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useDistricts, useCities } from "../../../data";
import { useTranslation } from "react-i18next";
import { NAVUSERDATA } from "../../../graphql";

const { Title, Text } = Typography;

const Editprofile = ({ visible, onClose, userData }) => {
  const district = useDistricts();
  const cities = useCities();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const userId = Cookies.get("userId");
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER, {
    refetchQueries: [
      { query: NAVUSERDATA, variables: { getNavUserId: userId } },
    ],
  });

  // Reset initialization when modal opens/closes
  useEffect(() => {
    if (visible) {
      setIsInitialized(false);
    } else {
      // Reset form and state when modal closes
      form.resetFields();
      setSelectedDistrict(null);
    }
  }, [visible, form]);

  useEffect(() => {
    if (userData && district.length > 0 && visible && !isInitialized) {
      // Map of common Arabic/English names to IDs
      const districtNameToId = {
        riyadh: "riyadh",
        الرياض: "riyadh",
        Riyadh: "riyadh",
        makkah: "makkah",
        "مكة المكرمة": "makkah",
        Makkah: "makkah",
        madinah: "madinah",
        "المدينة المنورة": "madinah",
        Madinah: "madinah",
        "eastern-province": "eastern-province",
        "المنطقة الشرقية": "eastern-province",
        "Eastern Province": "eastern-province",
        qassim: "qassim",
        القصيم: "qassim",
        Qassim: "qassim",
        asir: "asir",
        عسير: "asir",
        Asir: "asir",
        tabuk: "tabuk",
        تبوك: "tabuk",
        Tabuk: "tabuk",
        hail: "hail",
        حائل: "hail",
        Hail: "hail",
        "northern-borders": "northern-borders",
        "الحدود الشمالية": "northern-borders",
        "Northern Borders": "northern-borders",
        "al-jouf": "al-jouf",
        الجوف: "al-jouf",
        "Al Jouf": "al-jouf",
        jazan: "jazan",
        جازان: "jazan",
        Jazan: "jazan",
        najran: "najran",
        نجران: "najran",
        Najran: "najran",
        "al-baha": "al-baha",
        الباحة: "al-baha",
        "Al Baha": "al-baha",
      };

      const cityNameToId = {
        // Makkah cities
        jeddah: "jeddah",
        جدة: "jeddah",
        Jeddah: "jeddah",
        makkah: "makkah",
        مكة: "makkah",
        Makkah: "makkah",
        taif: "taif",
        الطائف: "taif",
        Taif: "taif",
        // Madinah cities
        madinah: "madinah",
        المدينة: "madinah",
        Madinah: "madinah",
        yanbu: "yanbu",
        ينبع: "yanbu",
        Yanbu: "yanbu",
        // Riyadh cities
        riyadh: "riyadh",
        الرياض: "riyadh",
        Riyadh: "riyadh",
        // Add more cities as needed
      };

      const findDistrictId = (districtName) => {
        if (!districtName) return null;

        // Try direct ID lookup
        const lowerName = districtName.toLowerCase();
        if (district.find((d) => d.id === lowerName)) {
          return lowerName;
        }

        // Try name mapping
        if (districtNameToId[districtName]) {
          return districtNameToId[districtName];
        }

        // Try current language match
        const foundByName = district.find((d) => d.name === districtName);
        return foundByName ? foundByName.id : null;
      };

      const findCityId = (cityName, districtId) => {
        if (!cityName || !districtId) return null;

        const districtCities = cities[districtId] || [];

        // Try direct ID lookup
        const lowerName = cityName.toLowerCase();
        if (districtCities.find((c) => c.id === lowerName)) {
          return lowerName;
        }

        // Try name mapping
        if (cityNameToId[cityName]) {
          return cityNameToId[cityName];
        }

        // Try current language match
        const foundByName = districtCities.find((c) => c.name === cityName);
        return foundByName ? foundByName.id : null;
      };

      const districtId = findDistrictId(userData.district);
      setSelectedDistrict(districtId);

      const cityId = findCityId(userData.city, districtId);

      form.setFieldsValue({
        email: userData.email,
        phoneNo: userData.phone,
        district: districtId,
        city: cityId,
      });

      // Mark as initialized so form values don't reset when user makes changes
      setIsInitialized(true);
    }
  }, [userData, form, district, cities, visible, isInitialized]);

  const handleSubmit = async (values) => {
    try {
      // Convert IDs back to names for backend storage
      const districtObj = district.find((d) => d.id === values.district);
      const cityObj = cities[values.district]?.find(
        (c) => c.id === values.city
      );

      await updateUser({
        variables: {
          input: {
            id: userId,
            email: values.email,
            phone: values.phoneNo,
            district: districtObj ? districtObj.name : values.district,
            city: cityObj ? cityObj.name : values.city,
          },
        },
      });

      messageApi.success(t("Profile updated successfully ✅"));

      onClose();
    } catch (err) {
      messageApi.error(t(`Failed to update profile ❌ ${err.message}`));
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={null}
        open={visible}
        onCancel={onClose}
        closeIcon={false}
        centered
        footer={
          <Flex justify="end" gap={5}>
            <Button
              type="button"
              className="btn text-black border-gray"
              onClick={onClose}
              aria-labelledby={t("Cancel")}
            >
              {t("Cancel")}
            </Button>
            <Button
              type="primary"
              className="btn bg-brand"
              loading={updateLoading}
              onClick={() => form.submit()}
              aria-labelledby={t("Update")}
            >
              {t("Update")}
            </Button>
          </Flex>
        }
        width={600}
      >
        <Flex vertical className="mb-3" gap={0}>
          <Flex justify="space-between" gap={6}>
            <Title level={5} className="m-0">
              {t("Edit Profile")}
            </Title>
            <Button
              type="button"
              onClick={onClose}
              className="p-0 border-0 bg-transparent"
              aria-labelledby={t("Close")}
            >
              <CloseOutlined className="fs-14" />
            </Button>
          </Flex>
          <Text className="fs-14">
            {t(
              "Update your personal information to keep your account accurate and up to date."
            )}
          </Text>
        </Flex>

        <Form
          layout="vertical"
          form={form}
          requiredMark={false}
          onFinish={handleSubmit}
        >
          <Row gutter={[12, 12]}>
            <Col span={24}>
              <MyInput
                label={t("Email Address")}
                name="email"
                placeholder={t("Enter Email Address")}
              />
            </Col>
            <Col span={24}>
              <MyInput
                name="phoneNo"
                label={t("Mobile Number")}
                addonBefore={
                  <Select
                    defaultValue="SA"
                    className="w-80px"
                    onChange={(value) =>
                      form.setFieldsValue({ countryCode: value })
                    }
                  >
                    <Select.Option value="sa">{t("SA")}</Select.Option>
                    <Select.Option value="ae">{t("AE")}</Select.Option>
                  </Select>
                }
                placeholder={t("3445592382")}
                className="w-100"
              />
            </Col>
            <Col span={24}>
              <MySelect
                label={t("Region")}
                name="district"
                placeholder={t("Select region")}
                options={district}
                showKey={true}
                onChange={(val) => {
                  setSelectedDistrict(val);
                  form.setFieldValue("city", undefined);
                }}
              />
            </Col>
            <Col span={24}>
              <MySelect
                label={t("City")}
                name="city"
                placeholder={t("Select city")}
                disabled={!selectedDistrict}
                options={
                  selectedDistrict
                    ? cities[selectedDistrict.toLowerCase()] || []
                    : []
                }
                showKey={true}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export { Editprofile };
