import React, { useState,useEffect } from 'react'
import { Card, Col, Flex, Form, Radio, Row, Typography } from 'antd'
import { MyDatepicker, MyInput, MySelect } from '../../Forms'
import { ModuleTopHeading } from '../../Pagecomponents'
import { teamsizeOp,district, cities  } from '../../../data'
import { GET_CATEGORIES } from "../../../graphql/query/business";
import { useQuery } from '@apollo/client';

const { Title, Text } = Typography
const BusinessDetailStep = ({ data, setData }) => {
    const { data: categoryData } = useQuery(GET_CATEGORIES);
    const [form] = Form.useForm();
    const [isAccess, setIsAccess] = useState(data.isByTakbeer === true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const categories = categoryData?.getAllCategories?.map(cat => ({
      id: cat.id,
      name: cat.name,
      isDigital: cat.isDigital,
    })) || [];
  
    const handleRadioChange = (e) => {
      setIsAccess(e.target.value === 2);
    };

    const handleFormChange = (_, allValues) => {
        const selected = categories.find(c => c.name === allValues.category);
        const id = selected?.id;
  
      
      setSelectedCategory(allValues.category);
      setData(prev => ({
        ...prev,
        isByTakbeer: isAccess,
        businessTitle: allValues.title,
        categoryName:allValues.category,
        categoryId:id,
        district: allValues.district,
        city: allValues.city,
        foundedDate: allValues.dob,
        numberOfEmployees: allValues.teamSize,
        description: allValues.description,
        url: allValues.url,
      }));
    };
  
    useEffect(() => {
      form.setFieldsValue({
        title: data.businessTitle,
        category: data.categoryName,
        district: data.district,
        city: data.city,
        dob: data.foundedDate,
        teamSize: data.numberOfEmployees,
        description: data.description,
        url: data.url,
      });
  
      if (data.categoryId) {
        const cat = categories.find(cat => cat.id === data.categoryId);
        setSelectedCategory(cat);
      }
    }, [data]);

    return (
      <>
        <Flex vertical gap={1} className="mb-3">
          <ModuleTopHeading level={4} name="Tell us about your business" />
          <Text className="text-gray">Let’s start with the basic business information</Text>
        </Flex>
  
        <Card className="shadow-d radius-12 border-gray">
          <Form layout="vertical" form={form} onValuesChange={handleFormChange}>
            <Row gutter={24}>
              <Col span={24}>
                <Flex>
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={isAccess ? 2 : 1}
                    className="mb-3 margintop-5"
                  >
                    <Radio value={1} className="fs-14">
                      <Flex gap={3} align="center">
                        Sell business by Acquiring <img src="/assets/icons/info.png" width={20} alt="" />
                      </Flex>
                    </Radio>
                    <Radio value={2} className="fs-14">
                      <Flex gap={3} align="center">
                        Sell business by Takbeel <img src="/assets/icons/info.png" width={20} alt="" />
                      </Flex>
                    </Radio>
                  </Radio.Group>
                </Flex>
              </Col>
  
              <Col xs={24} sm={24} md={12}>
                <MyInput
                  label="Business Title"
                  name="title"
                  required
                  message="Please enter title"
                  placeholder="Write business name"
                />
              </Col>
  
              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label="Business Category"
                  name="category"
                  required
                  message="Choose business category"
                  options={categories}
                  placeholder="Choose business category"
                />
                
              </Col>
  
              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label="District"
                  name="district"
                  required
                  message="Choose district"
                  placeholder="Choose district"
                  options={district}
                  onChange={(val) => setSelectedDistrict(val)}
                />
              </Col>
  
              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label="City"
                  name="city"
                  required
                  message="Choose city"
                  options={selectedDistrict ? cities[selectedDistrict.toLowerCase()] || [] : []}
                  placeholder="Choose city"
                />
              </Col>
  
              <Col xs={24} sm={24} md={12}>
                <MyDatepicker
                  datePicker
                  label="Foundation Date"
                  name="dob"
                  required
                  message="Please enter foundation date"
                  placeholder="Enter foundation date"
                />
              </Col>
  
              <Col xs={24} sm={24} md={12}>
                <MySelect
                  label="Team Size"
                  name="teamSize"
                  required
                  message="Choose team size"
                  options={teamsizeOp}
                  placeholder="Enter team size"
                  
                />
              </Col>
  
              <Col span={24}>
                <MyInput
                  textArea
                  label="Description"
                  name="description"
                  placeholder="Write description about your business"
                  rows={5}
                />
              </Col>
  
              <Col span={24}>
                <MyInput
                  label="Business Website Url"
                  name="url"
                  placeholder="Add website url"
                  required={selectedCategory?.isDigital}
                />
              </Col>
            </Row>
          </Form>
        </Card>
      </>
    );
  };
  

export {BusinessDetailStep}