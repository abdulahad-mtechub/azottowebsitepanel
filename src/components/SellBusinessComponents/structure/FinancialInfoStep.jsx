import React, { useEffect } from 'react'
import { Card, Col, Flex, Form, Row, Select, Typography,Input } from 'antd'
import { MyInput } from '../../Forms'
import { ModuleTopHeading } from '../../Pagecomponents'
import { revenueLookups, yearOp } from '../../../data'
import { FormReplicate } from '../../Header'

const { Text } = Typography
const FinancialInfoStep = ({ data, setData }) => {

    const [price , setPrice] = React.useState(data.price || '');
    const [profit, setProfit] = React.useState(data.profit || '');
    const [profitPeriod, setProfitPeriod] = React.useState(data.profittime || '');
    const [revenue, setRevenue] = React.useState(data.revenue || '');
    const [revenuePeriod, setRevenuePeriod] = React.useState(data.revenueTime || '');
    const [form] = Form.useForm();    

    const handleFormChange = (_, allValues) => {
        const newPrice = allValues.businessPrice ?? price;
        const newProfit = allValues.profit ?? profit;
        const newProfitPeriod = allValues.profittime ?? profitPeriod;
        const newRevenue = allValues.revenue ?? revenue;
        const newRevenuePeriod = allValues.revenueTime ?? revenuePeriod;

        setPrice(newPrice);
        setProfit(newProfit);
        setProfitPeriod(newProfitPeriod);
        setRevenue(newRevenue);
        setRevenuePeriod(newRevenuePeriod);

        setData(prev => ({
            ...prev,
            revenueTime: allValues.revenueTime || prev.revenueTime,
            revenue: allValues.revenue || prev.revenue,
            profittime: allValues.profittime || prev.profittime,
            profit: allValues.profit || prev.profit,
            price: allValues.businessPrice || prev.price,
            profitMargen: allValues.profitMargin || prev.profitMargen,
            assets: allValues.keyassets?.map(item => ({
            name: item?.assetName || '',
            quantity: item?.noItems || '',
            purchaseYear: item?.purchaseYear || '',
            price: item?.price || '',
            })) || prev.assets,

            liabilities: allValues.liability?.map(item => ({
            name: item?.liabilityName || '',
            quantity: item?.quantity || '',
            purchaseYear: item?.liabilitypurchaseYear || '',
            price: item?.liabilityPrice || '',
            })) || prev.liabilities,

            inventoryItems: allValues.inventory?.map(item => ({
            name: item?.inventoryName || '',
            quantity: item?.inventoryquantity || '',
            purchaseYear: item?.inventoryypurchaseYear || '',
            price: item?.inventoryPrice || '',
            })) || prev.inventoryItems,
        }));
    };

    useEffect(() => {
        form.setFieldsValue({
            revenueTime: data.revenueTime,
            revenue: data.revenue,
            profitTime: data.profittime,
            profit: data.profit,
            businessPrice: data.price,
            profitMargin: data.profitMargen,
            keyassets: data.assets?.map(item => ({
                assetName: item.name,
                noItems: item.quantity,
                purchaseYear: item.purchaseYear,
                price: item.price
            })),
            liability: data.liabilities?.map(item => ({
                liabilityName: item.name,
                quantity: item.quantity,
                liabilitypurchaseYear: item.purchaseYear,
                liabilityPrice: item.price
            })),
            inventory: data.inventoryItems?.map(item => ({
                inventoryName: item.name,
                inventoryquantity: item.quantity,
                inventoryypurchaseYear: item.purchaseYear,
                inventoryPrice: item.price
            }))
        });
    }, [data]);

    useEffect(() => {
        let avgMonthlyProfit = 0;
        let annualProfit = 0;
        let adjustedRevenue = revenue;

        // Calculate average monthly profit & annual profit
        if (profitPeriod === 0) {
            avgMonthlyProfit = profit / 6;
            annualProfit = profit * 2;
        } else if (profitPeriod === 1) {
            avgMonthlyProfit = profit / 12;
            annualProfit = profit;
        }
    
        // Adjust revenue to monthly for margin calculation
        if (revenuePeriod === 0) {
            adjustedRevenue = adjustedRevenue / 6;
        } else if (revenuePeriod === 1) {
            adjustedRevenue = adjustedRevenue / 12;
        }
    console.log("price",price)
    console.log("avgMonthlyProfit",avgMonthlyProfit)
        const multiple =
            price && avgMonthlyProfit && Number(avgMonthlyProfit) !== 0
                ? (Number(price) / Number(avgMonthlyProfit))
                : '';
        console.log("multiple",multiple)
        // rount to 1 digit
        const scaledMultiple = multiple !== null ? Number(String(Math.floor(Math.abs(multiple)))[0]) : null;

        const profitMargen =
            adjustedRevenue && profit && Number(adjustedRevenue) !== 0
                ? ((Number(profit) / Number(adjustedRevenue)) * 100).toFixed(2)
                : '';
    
        const recoveryTime =
            price && annualProfit && Number(annualProfit) !== 0
                ? (Number(price) / Number(annualProfit)).toFixed(2)
                : '';
    
        setData(prev => ({
            ...prev,
            multiple:scaledMultiple,
            profitMargen,
            recoveryTime,
        }));
    
        form.setFieldsValue({
            multiple:scaledMultiple,
            profitMargin: profitMargen,
            recoveryTime,
        });
    }, [price, profit, revenue, profitPeriod, revenuePeriod]);
    
console.log("data",data.multiple)
    return (
        <>
            <Flex vertical gap={1} className='mb-3'>
                <ModuleTopHeading level={4} name='Share your business numbers & potential' />
                <Text className='text-gray'>These numbers help buyers understand your business value.</Text>
            </Flex>
            <Form layout="vertical" form={form} requiredMark={false} onValuesChange={handleFormChange}
            >
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item label="Revenue" className="w-100" style={{ marginBottom: 0 }}>
                            <Flex gap={2} className="w-100">
                            <Form.Item name="revenueTime" noStyle>
                                <Select
                                placeholder="Select period"
                                className="addonselect fs-14"
                                style={{ width: 180 }}
                                >
                                {revenueLookups?.map((list, index) => (
                                    <Select.Option value={list?.id} key={index}>
                                    {list?.name}
                                    </Select.Option>
                                ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="revenue"
                                rules={[{ required: true, message: "Please enter revenue" }]}
                                noStyle
                            >
                                <Input
                                placeholder="Enter revenue"
                                className="w-100 "
                                prefix={<img src="/assets/icons/reyal-g.png" width={15} />}
                                />
                            </Form.Item>
                            </Flex>
                        </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                            <Form.Item label="Profit" className="w-100" style={{ marginBottom: 0 }}>
                                <Flex gap={2} className="w-100">
                                <Form.Item name="profittime" noStyle>
                                    <Select
                                    placeholder="Select period"
                                    className="addonselect fs-14"
                                    style={{ width: 180 }}
                                    >
                                    {revenueLookups?.map((list, index) => (
                                        <Select.Option value={list?.id} key={index}>
                                        {list?.name}
                                        </Select.Option>
                                    ))}
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="profit"
                                    rules={[{ required: true, message: "Please enter profit" }]}
                                    noStyle
                                >
                                    <Input
                                    placeholder="Enter profit"
                                    className="w-100"
                                    prefix={<img src="/assets/icons/reyal-g.png" width={14} />}
                                    />
                                </Form.Item>
                                </Flex>
                            </Form.Item>
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
                        <Col span={24}>
                            <MyInput
                                label={<Flex>
                                    Multiples of Revenue & Profit <img src="/assets/icons/info-outline.png" width={20} alt="" />
                                </Flex>}
                                name='multiple'
                                required
                                message="Please enter multiple revenue & profit"
                                className='w-100'
                                readOnly
                                value={data.multiple}
                            />
                        </Col>
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