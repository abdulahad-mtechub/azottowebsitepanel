import { Card, Col, Flex, Form, Row, Select, Typography } from 'antd'
import { MyInput } from '../../Forms'
import { ModuleTopHeading } from '../../Pagecomponents'
import { revenueLookups, yearOp } from '../../../data'
import { FormReplicate } from '../../Header'

const { Text } = Typography
const FinancialInfoStep = () => {

    const [form] = Form.useForm();    


    return (
        <>
            <Flex vertical gap={1} className='mb-3'>
                <ModuleTopHeading level={4} name='Share your business numbers & potential' />
                <Text className='text-gray'>These numbers help buyers understand your business value.</Text>
            </Flex>
            <Form
                layout="vertical"
                form={form}
                requiredMark={false}
            >
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <Text className='fs-14 m-8x'>Revenue</Text>
                            <Flex gap={2} className='w-100'>
                                <Select 
                                    defaultValue="Last 6 Months" 
                                    className="addonselect fs-14" 
                                    style={{ width: 180 }} 
                                    onChange={(value) => form.setFieldsValue({ revenutype: value })}
                                >
                                    {
                                        revenueLookups?.map((list,index)=>
                                            <Select.Option value={list?.id} key={index}>{list?.name}</Select.Option>
                                        )
                                    }
                                </Select>    
                                <MyInput
                                    withoutForm
                                    required
                                    message="Please enter revenue"
                                    placeholder='Enter revenue'
                                    addonBefore={
                                        <img src='/assets/icons/reyal-g.png' width={14} />
                                    }
                                    className='w-100'
                                />
                            </Flex>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <Text className='fs-14 m-8x'>Profit</Text>
                            <Flex gap={2} className='w-100'>
                                <Select 
                                    defaultValue="Last Year" 
                                    className="addonselect fs-14" 
                                    style={{ width: 180 }} 
                                    onChange={(value) => form.setFieldsValue({ revenutype: value })}
                                >
                                    {
                                        revenueLookups?.map((list,index)=>
                                            <Select.Option value={list?.id} key={index}>{list?.name}</Select.Option>
                                        )
                                    }
                                </Select>    
                                <MyInput
                                    withoutForm
                                    required
                                    message="Please enter profit"
                                    placeholder='Enter profit'
                                    addonBefore={
                                        <img src='/assets/icons/reyal-g.png' width={14} />
                                    }
                                    className='w-100'
                                />
                            </Flex>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label="Profit Margin"
                                name="profitMargin"
                                required
                                message='Please enter profit margin'
                                placeholder='Enter profit margin'
                                suffix = '%'
                            />
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12}}>
                            <MyInput
                                label='Business Price'
                                name='businessPrice'
                                required
                                message="Please enter business price"
                                placeholder='Enter business price'
                                addonBefore={
                                    <img src='/assets/icons/reyal-g.png' width={14} />
                                }
                                className='w-100'
                            />
                        </Col>
                        {/* <Col span={24}>
                            <MyInput
                                label={<Flex>
                                    Multiples of Revenue & Profit <img src="/assets/icons/info-outline.png" width={10} alt="" />
                                </Flex>}
                                name='multipleprofile'
                                required
                                message="Please enter multiple revenue & profit"
                                className='w-100'
                            />
                        </Col> */}
                    </Row>   
                </Card> 
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <FormReplicate
                        dayKey="keyassets"
                        title="Key Assets (Optional)"
                        form={form}
                        fieldsConfig={[
                            {
                                name: "assetName",
                                label: "Asset Name",
                                placeholder: "Write asset name",
                                type: "input",
                            },
                            {
                                name: "noItems",
                                label: "Number of items",
                                placeholder: "Enter quantity",
                                type: "input",
                            },
                            {
                                name: "purchaseYear",
                                label: "Purchase Year",
                                placeholder: "Choose purchase year",
                                type: "select",
                                options: yearOp,
                            },
                            {
                                name: "price",
                                label: "Price",
                                placeholder: "Enter price",
                                type: "input",
                                addonBefore: <img src="/assets/icons/reyal-g.png" width={14} />,
                                className: "w-100 bg-white",
                            },
                        ]}
                    />
                </Card>
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <FormReplicate
                        dayKey="liability"
                        title="Outstanding Liabilities / Debt (Optional)"
                        form={form}
                        fieldsConfig={[
                            {
                                name: "liabilityName",
                                label: "Liabilities Name",
                                placeholder: "Write liability name",
                                type: "input",
                            },
                            {
                                name: "quantity",
                                label: "Number of items",
                                placeholder: "Enter quantity",
                                type: "input",
                            },
                            {
                                name: "liabilitypurchaseYear",
                                label: "Purchase Year",
                                placeholder: "Choose purchase year",
                                type: "select",
                                options: yearOp,
                            },
                            {
                                name: "liabilityPrice",
                                label: "Price",
                                placeholder: "Enter price",
                                type: "input",
                                addonBefore: <img src="/assets/icons/reyal-g.png" width={14} />,
                                className: "w-100 bg-white",
                            },
                        ]}
                    />
                </Card> 
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <FormReplicate
                        dayKey="inventory"
                        title="Inventory (Optional)"
                        form={form}
                        fieldsConfig={[
                            {
                                name: "inventoryName",
                                label: "Inventory Name",
                                placeholder: "Write inventory name",
                                type: "input",
                            },
                            {
                                name: "inventoryquantity",
                                label: "Number of items",
                                placeholder: "Enter quantity",
                                type: "input",
                            },
                            {
                                name: "inventoryypurchaseYear",
                                label: "Purchase Year",
                                placeholder: "Choose purchase year",
                                type: "select",
                                options: yearOp,
                            },
                            {
                                name: "inventoryPrice",
                                label: "Price",
                                placeholder: "Enter price",
                                type: "input",
                                addonBefore: <img src="/assets/icons/reyal-g.png" width={14} />,
                                className: "w-100 bg-white",
                            },
                        ]}
                    />
                </Card>  
            </Form>
        </>
    )
}

export {FinancialInfoStep}