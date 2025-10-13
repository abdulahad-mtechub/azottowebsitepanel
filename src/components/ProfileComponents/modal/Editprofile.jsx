import React,{useEffect,useState} from 'react';
import { Button, Col, Flex, Form, Modal, Row, Select, Typography, message } from 'antd';
import { MyInput, MySelect } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
import { UPDATE_USER } from '../../../graphql/mutation';
import { useMutation } from "@apollo/client";
import Cookies from "js-cookie";
import { useDistricts, useCities } from '../../../data';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Editprofile = ({ visible, onClose, userData, refetchUser }) => {

  const district = useDistricts();
  const cities = useCities();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const userId = Cookies.get("userId"); // get stored id
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (userData) {
      const districtValue = userData.district;
      setSelectedDistrict(districtValue);
      
      form.setFieldsValue({
        email: userData.email,
        phoneNo: userData.phone,
        district: districtValue,
        city: userData.city,
      });
    }
  }, [userData, form]);

  const handleSubmit = async (values) => {
    try {
      await updateUser({
        variables: {
          input: {
            id: userId,
            email: values.email,
            phone: values.phoneNo,
            district: values.district,
            city: values.city,
          },
        },
      });

      messageApi.success(t("Profile updated successfully ✅"));
      
      if (refetchUser) {
        refetchUser();
      }
      
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
        footer={
          <Flex justify="end" gap={5}>
            <Button
              type="button"
              className="btn text-black border-gray"
              onClick={onClose}
              aria-labelledby={t('Cancel')}
            >
              {t('Cancel')}
            </Button>
            <Button
              type="primary"
              className="btn bg-brand"
              loading={updateLoading}
              onClick={() => form.submit()}
              aria-labelledby={t('Update')}
            >
              {t('Update')}
            </Button>
          </Flex>
        }
        width={600}
      >
        <Flex vertical className="mb-3" gap={0}>
          <Flex justify="space-between" gap={6}>
            <Title level={5} className="m-0">
              {t('Edit Profile')}
            </Title>
            <Button
              type="button"
              onClick={onClose}
              className="p-0 border-0 bg-transparent"
              aria-labelledby={t('Close')}
            >
              <CloseOutlined className="fs-14" />
            </Button>
          </Flex>
          <Text className="fs-14">
            {t('Update your personal information to keep your account accurate and up to date.')}
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
                label={t('Email Address')}
                name="email"
                required
                message={t('Please enter Email Address')}
                placeholder={t('Enter Email Address')}
              />
            </Col>
            <Col span={24}>
              <MyInput
                name="phoneNo"
                label={t('Mobile Number')}
                required
                message={t('Please enter a valid phone number')}
                addonBefore={
                  <Select
                    defaultValue="SA"
                    className='w-80px'
                    onChange={(value) =>
                      form.setFieldsValue({ countryCode: value })
                    }
                  >
                    <Select.Option value="sa">{t('SA')}</Select.Option>
                    <Select.Option value="ae">{t('AE')}</Select.Option>
                  </Select>
                }
                placeholder={t('3445592382')}
                className="w-100"
              />
            </Col>
            <Col span={24}>
              <MySelect
                label={t('Select District')}
                name='district'
                required
                message={t('Please enter district')}
                placeholder={t('select district')}
                options={district}
                onChange={(val) => {
                  setSelectedDistrict(val);
                  form.setFieldValue('city', undefined);
                }}
              />
            </Col>
            <Col span={24}>
              <MySelect
                label={t('Select City')}
                name='city'
                required
                message={t('Please enter city')}
                placeholder={t('select city')}
                disabled={!selectedDistrict}
                options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export { Editprofile };
