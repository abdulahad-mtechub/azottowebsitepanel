import { Card, Checkbox, Col, Collapse, Flex, Input, Radio, Row, Typography } from 'antd';
import { LineOutlined } from '@ant-design/icons';
import { categoriesData, teamsizeFilter, yearOper } from '../../../data';
import { Link } from 'react-router-dom';
import { useState,useEffect } from 'react';
import {CustomProgressBar} from '../../ui';

const { Text, Title } = Typography
const Filter = ({ 
    multipleStep, setMultipleStep,
    setPriceRange, setRevenueRange, setProfitRange,
    setProfitMargenRange, setEmployeesRange,
    setOperationalYearRange, setHasAssets,setSelectedCategory
    }) => {

        
    const [activeStep, setActiveStep] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    // for filter it multiple with type number send just 1,instedc of 1x and 2 insted of 2x and so on
    const steps = ["1x", "2x", "3x", "4x", "5x", "5x+"]; 
    const onStepChange = (step) => {
        const isSame = activeStep === step;
        const newStep = isSame ? null : step;
      
        setActiveStep(newStep);
        setMultipleStep(newStep); // <-- Send to parent
      };
    const itemsNest = [
        {
            key: '1',
            label: <Text>Price Range</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs' onChange={(e) => setPriceRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder='Max' className='input-cs' onChange={(e) => setPriceRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '2',
            label: <Text>Annual Revenue</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs' onChange={(e) => setRevenueRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder='Max' className='input-cs' onChange={(e) => setRevenueRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '3',
            label: <Text>Annual Profit</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs' onChange={(e) => setProfitRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder='Max' className='input-cs' onChange={(e) => setProfitRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '4',
            label: <Text>Profit Margin (%)</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder='Min' className='input-cs' onChange={(e) => setProfitMargenRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder='Max' className='input-cs' onChange={(e) => setProfitMargenRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '5',
            label: <Text>Multiple</Text>,
            children: <CustomProgressBar
            steps={steps}
            activeStep={activeStep ?? 0}
            onChange={onStepChange}
      />
        },
        {
            key: '6',
            label: <Text>Team Size</Text>,
            children: <Checkbox.Group className='w-100' 
            onChange={(checkedValues) => {
                if (checkedValues?.length > 0) {
                  setEmployeesRange(checkedValues[0]); // e.g. "10-50"
                } else {
                  setEmployeesRange(null);
                }
            }}
            >
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
            children: <Checkbox.Group className='w-100' 
            onChange={(checkedValues) => {
                if (checkedValues?.length > 0) {
                    setOperationalYearRange(checkedValues[0]); // or map to year
                } else {
                    setOperationalYearRange(null);
                }
              }}
            >
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
            children: <Radio.Group 
            onChange={(e) => {
                const val = e.target.value;
                setHasAssets(val === 1 ? true : val === 2 ? false : null);
              }}
            >
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
            label: <Title level={5} className='m-0 py-2 fw-500'>Filter By</Title>,
            children: <Collapse ghost defaultActiveKey={["1",'2','3','4','5','6','7','8']} items={itemsNest} />,
        },
    ];

    const categoryItems = [
        {
            key: '1',
            label:  <Title level={5} className='m-0 py-2 fw-500'>Categories</Title>,
            children: <Flex vertical>
                {
                    categoriesData?.map((list,i)=>
                        <Link to={list?.path} className='cate-filter' key={i} onClick={() => {
                            setSelectedCategory(list?.name); // or list?.slug or list?.id based on your GraphQL
                          }}>
                            {
                                list?.name
                            }
                        </Link>
                    )
                }
                
            </Flex>
        }
    ]

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1199);
    
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const classoverflow = isMobile ? null : 'custom-overflow-style fix-height'

    return (
        <div className={classoverflow}>
            <Card className='mb-1 border-gray card-cs' >
                <Collapse defaultActiveKey={['1']} ghost items={items} className='collapse-cs' 
                    // expandIcon={({ isActive }) => 
                    //     isActive ? <DoubleRightOutlined /> : <DoubleLeftOutlined />
                    // }
                    // showArrow={false}
                />
            </Card>
            <Card className='border-gray card-cs' >
                <Collapse defaultActiveKey={['1']} ghost items={categoryItems} className='collapse-cs'/>
            </Card>
        </div>
    )
}

export {Filter}