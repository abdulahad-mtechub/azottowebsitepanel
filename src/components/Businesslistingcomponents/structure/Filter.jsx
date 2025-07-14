import { Card, Checkbox, Col, Collapse, Flex, Input, Radio, Row, Typography } from 'antd';
import { MySelect } from '../../Forms';
import { DoubleLeftOutlined, DoubleRightOutlined, LineOutlined } from '@ant-design/icons';
import { categoriesData, multipleOp, teamsizeFilter, yearOper } from '../../../data';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CustomProgressBar from '../../ui/CustomProgress';

const { Text, Title } = Typography
const Filter = () => {

    const [activeStep, setActiveStep] = useState(0);
    const steps = ["1x", "2x", "3x", "4x", "5x", "5x+"];
    const onChange = checkedValues => {
        console.log('checked = ', checkedValues);
    };
    const itemsNest = [
        {
            key: '1',
            label: <Text>Price Range</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs'/>
                <LineOutlined />
                <Input placeholder='Max' className='input-cs'/>
            </Flex>,
        },
        {
            key: '2',
            label: <Text>Annual Revenue</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs'/>
                <LineOutlined />
                <Input placeholder='Max' className='input-cs'/>
            </Flex>,
        },
        {
            key: '3',
            label: <Text>Annual Profit</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs'/>
                <LineOutlined />
                <Input placeholder='Max' className='input-cs'/>
            </Flex>,
        },
        {
            key: '4',
            label: <Text>Profit Margin (%)</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs'/>
                <LineOutlined />
                <Input placeholder='Max' className='input-cs'/>
            </Flex>,
        },
        {
            key: '5',
            label: <Text>Multiple</Text>,
            children: <CustomProgressBar
        steps={steps}
        activeStep={activeStep}
        onChange={setActiveStep}
      />
        },
        {
            key: '6',
            label: <Text>Time Size</Text>,
            children: <Checkbox.Group className='w-100' onChange={onChange}>
                <Row gutter={[12,8]}>
                {teamsizeFilter.map((item, _) => (
                    <Col span={24} key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                ))}
                </Row>
            </Checkbox.Group>
        },
        {
            key: '7',
            label: <Text>Years in Operation</Text>,
            children: <Checkbox.Group className='w-100' onChange={onChange}>
                <Row gutter={[12,8]}>
                {yearOper.map((item, _) => (
                    <Col span={24} key={item.value}>
                        <Checkbox value={item.value}>{item.label}</Checkbox>
                    </Col>
                ))}
                </Row>
            </Checkbox.Group>
        },
        {
            key: '8',
            label: <Text>Assets Included</Text>,
            children: <Radio.Group>
                <Flex vertical>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={2}>No</Radio>
                </Flex>
            </Radio.Group>
        },
    ];

    const items = [
        {
            key: '1',
            label: <Title level={5} className='m-0 py-2'>Filter By</Title>,
            children: <Collapse ghost defaultActiveKey={["1",'2','3','4','5','6','7','8']} items={itemsNest} />,
        },
    ];

    const categoryItems = [
        {
            key: '1',
            label:  <Title level={5} className='m-0 py-2'>Categories</Title>,
            children: <Flex vertical>
                {
                    categoriesData?.map((list,i)=>
                        <Link to={list?.path} className='cate-filter' key={i}>
                            {
                                list?.name
                            }
                        </Link>
                    )
                }
                
            </Flex>
        }
    ]

    return (
        <>
            <Card className='mb-3'>
                <Collapse defaultActiveKey={['1']} ghost items={items} className='collapse-cs' 
                    expandIcon={({ isActive }) => 
                        isActive ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
                    }
                    showArrow={false}
                />
            </Card>
            <Card>
                <Collapse defaultActiveKey={['1']} ghost items={categoryItems} className='collapse-cs'/>
            </Card>
        </>
    )
}

export {Filter}