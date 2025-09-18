import React,{useEffect,useState} from 'react'
import { Button, Col, Flex, Form, Modal, Row, Select, Typography,message } from 'antd'
import { MyInput, MySelect } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
import {UPDATE_USER} from '../../../graphql/mutation'
import {ME} from '../../../graphql/query'
import { useMutation,useQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { district, cities  } from '../../../data';


const { Title, Text } = Typography

const Editprofile = ({ visible, onClose }) => {
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();
    const userId = Cookies.get("userId"); // get stored id
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    
    // ✅ Fetch user details
    const { data, loading: queryLoading } = useQuery(ME, {
      variables: { getUserId: userId }, // depends on your ME query structure
      skip: !userId,
      fetchPolicy: "network-only", // always get fresh data
    });
    const [updateUser, { loading: updateLoading }] = useMutation(UPDATE_USER);
    // ✅ Populate form when data arrives
    useEffect(() => {
      if (data?.getUser) {
        form.setFieldsValue({
          email: data.getUser.email,
          phoneNo: data.getUser.phone,
          district: data.getUser.district,
          city: data.getUser.city,
        });
      }
    }, [data, form]);
  
    // ✅ Handle submit
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
  
        messageApi.success("Profile updated successfully ✅");
        onClose();
      } catch (err) {
        messageApi.error(`Failed to update profile ❌ ${err.message}`);
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
                aria-labelledby='Cancel'
              >
                Cancel
              </Button>
              <Button
                type="primary"
                className="btn bg-brand"
                loading={updateLoading}
                onClick={() => form.submit()}
                aria-labelledby='Update'
              >
                Update
              </Button>
            </Flex>
          }
          width={600}
        >
          <Flex vertical className="mb-3" gap={0}>
            <Flex justify="space-between" gap={6}>
              <Title level={5} className="m-0">
                Edit Profile
              </Title>
              <Button
                type="button"
                onClick={onClose}
                className="p-0 border-0 bg-transparent"
                aria-labelledby='Close'
              >
                <CloseOutlined className="fs-14" />
              </Button>
            </Flex>
            <Text className="fs-14">
              Update your personal information to keep your account accurate and
              up to date.
            </Text>
          </Flex>
  
          <Form
            layout="vertical"
            form={form}
            requiredMark={false}
            onFinish={handleSubmit} // ✅ connect submit handler
          >
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <MyInput
                  label="Email Address"
                  name="email"
                  required
                  message="Please enter Email Address"
                  placeholder="Enter Email Address"
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
                      className='w-80px'
                      onChange={(value) =>
                        form.setFieldsValue({ countryCode: value })
                      }
                    >
                      <Select.Option value="sa">SA</Select.Option>
                      <Select.Option value="ae">AE</Select.Option>
                    </Select>
                  }
                  placeholder="3445592382"
                  className="w-100"
                />
              </Col>
              <Col span={24}>
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
              <Col span={24}>
              <MySelect
                    label='Select City'
                    name='city'
                    required
                    message="Please enter city"
                    placeholder='select city'
                    options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
      </>
    );
};

export { Editprofile } 
