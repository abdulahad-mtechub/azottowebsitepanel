import React, { useEffect } from 'react'
import { Card, Col, Flex, Form, Row, Select, Typography,Input, Image } from 'antd'
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

    const foundedYear = new Date(data?.foundedDate).getFullYear();
    const currentYear = new Date().getFullYear();

    // Create the year options array from foundedYear to currentYear
    const yearOp = [];
    for (let y = foundedYear; y <= currentYear; y++) {
    yearOp.push({ id: String(y), name: y });
    }

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
        const adjustedRevenuePeriod = Number(revenuePeriod);
        const adjustedProfitPeriod = Number(profitPeriod);
        let adjustedRevenue = Number(revenue) || 0;
        let adjustedProfit = Number(profit) || 0;
    
        // Adjust periods to match
        if (adjustedProfitPeriod !== adjustedRevenuePeriod) {
            if (adjustedProfitPeriod === 1 && adjustedRevenuePeriod === 2) {
                // Profit = 6 months, Revenue = 12 → scale revenue down
                adjustedRevenue = adjustedRevenue / 2;
            } else if (adjustedProfitPeriod === 2 && adjustedRevenuePeriod === 1) {
                // Profit = 12 months, Revenue = 6 → scale profit down
                adjustedProfit = adjustedProfit / 2;
            }
        }
    
        // Multiples calculation: avg monthly profit
        const months = adjustedProfitPeriod === 1 ? 6 : 12;
        const avgMonthlyProfit = adjustedProfit / months;
    
        const multiple =
            price && avgMonthlyProfit && Number(avgMonthlyProfit) !== 0
                ? (Number(price) / avgMonthlyProfit)
                : '';
    
        const scaledMultiple = multiple
            ? Number(String(Math.floor(Math.abs(multiple)))[0])
            : null;
    
        const profitMargin =
            adjustedRevenue && adjustedProfit && Number(adjustedRevenue) !== 0
                ? ((adjustedProfit / adjustedRevenue) * 100).toFixed(2)
                : '';
    
        const annualProfit = adjustedProfitPeriod === 1 ? adjustedProfit * 2 : adjustedProfit;
    
        const recoveryTime =
            price && annualProfit && Number(annualProfit) !== 0
                ? (Number(price) / Number(annualProfit)).toFixed(2)
                : '';
    
        setData(prev => ({
            ...prev,
            multiple: scaledMultiple,
            profitMargen: profitMargin,
            recoveryTime,
        }));
    
        form.setFieldsValue({
            multiple: scaledMultiple,
            profitMargin,
            recoveryTime,
        });
    
    }, [price, profit, revenue, profitPeriod, revenuePeriod]);

    return (
        <>
            <Flex justify='space-between' className='mb-3' gap={10} wrap align='flex-start'>
                 <Flex vertical gap={1}>
                    <ModuleTopHeading level={4} name='Share your business numbers & potential' />
                    <Text className='text-gray'>These numbers help buyers understand your business value.</Text>
                </Flex>
                <Flex className='pill-round' gap={8} align='center'>
                    <Image src="/assets/icons/info-b.png" preview={false} width={16} alt="" />
                    <Text className='fs-12 text-sky'>For any query, contact us on +966 543 543 654</Text>
                </Flex>
            </Flex>
            <Form layout="vertical" form={form} requiredMark={false} onValuesChange={handleFormChange}
            >
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <Row gutter={24}>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                        <Form.Item label="Revenue" className="w-100">
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
                                type='number'
                                placeholder="Enter revenue"
                                className="w-100 "
                                prefix={<img src="/assets/icons/reyal-g.png" width={15} />}
                                />
                            </Form.Item>
                            </Flex>
                        </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }}>
                            <Form.Item label="Profit" className="w-100">
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
                                    type='number'
                                    placeholder="Enter profit"
                                    className="w-100"
                                    prefix={<img src="/assets/icons/reyal-g.png" width={14} />}
                                    />
                                </Form.Item>
                                </Flex>
                            </Form.Item>
                        </Col>
                        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 24 }}>
                        {profitPeriod && revenuePeriod && profitPeriod !== revenuePeriod && (
                        <Text type="danger">
                            Revenue is for {revenuePeriod === 1 ? '6 months' : '12 months'}, but Profit is for {profitPeriod === 1 ? '6 months' : '12 months'}. Profit Margin is adjusted accordingly.
                        </Text>
                        )}
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
                                label={<Flex align='center' gap={5}>
                                    Multiples of Revenue & Profit <Image preview={false} src="/assets/icons/info-outline.png" width={15} alt="" />
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