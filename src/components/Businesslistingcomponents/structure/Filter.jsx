import { Card, Checkbox, Col, Collapse, Flex, Input, Radio, Row, Typography } from 'antd';
import { LineOutlined } from '@ant-design/icons';
import { teamsizeFilter, yearOper } from '../../../data';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CustomProgressBar } from '../../ui';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../../graphql/query';

const { Text, Title } = Typography;

const Filter = ({ 
    setMultipleStep,
    setPriceRange, setRevenueRange, setProfitRange,
    setProfitMargenRange, setEmployeesRange,
    setOperationalYearRange, setHasAssets, setSelectedCategory
}) => {
    const { t, i18n } = useTranslation();
    const isArabic = i18n.language === 'ar';
    const [activeStep, setActiveStep] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [activeCategoryId, setActiveCategoryId] = useState(null);

    const { data: categoryData } = useQuery(GET_CATEGORIES);
    const categories = categoryData?.getAllCategories?.categories?.map(cat => ({
        id: cat.id,
        title: cat.name,
        arabicTitle: cat.arabicName
    })) || [];

    const steps = ["1x", "2x", "3x", "4x", "5x", "5x+"];
    const onStepChange = (step) => {
        const isSame = activeStep === step;
        const newStep = isSame ? null : step;
        setActiveStep(newStep);
        setMultipleStep(newStep);
    };

    const itemsNest = [
        {
            key: '1',
            label: <Text>{t('Price Range')}</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder={t('Min')} className='input-cs' onChange={(e) => setPriceRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder={t('Max')} className='input-cs' onChange={(e) => setPriceRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '2',
            label: <Text>{t('Annual Revenue')}</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder={t('Min')} className='input-cs' onChange={(e) => setRevenueRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder={t('Max')} className='input-cs' onChange={(e) => setRevenueRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '3',
            label: <Text>{t('Annual Profit')}</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder={t('Min')} className='input-cs' onChange={(e) => setProfitRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder={t('Max')} className='input-cs' onChange={(e) => setProfitRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '4',
            label: <Text>{t('Profit Margin (%)')}</Text>,
            children: <Flex align='center' gap={4} className='w-100'>
                <Input placeholder={t('Min')} className='input-cs' onChange={(e) => setProfitMargenRange(prev => [e.target.value, prev?.[1]])} />
                <LineOutlined />
                <Input placeholder={t('Max')} className='input-cs' onChange={(e) => setProfitMargenRange(prev => [prev?.[0], e.target.value])} />
            </Flex>,
        },
        {
            key: '5',
            label: <Text>{t('Multiple')}</Text>,
            children: <CustomProgressBar steps={steps} activeStep={activeStep ?? 0} onChange={onStepChange} />,
        },
        {
            key: '6',
            label: <Text>{t('Team Size')}</Text>,
            children: <Checkbox.Group className='w-100' 
                onChange={(checkedValues) => setEmployeesRange(checkedValues?.length > 0 ? checkedValues[0] : null)}
            >
                <Row gutter={[12,8]}>
                    {teamsizeFilter.map((item) => (
                        <Col span={24} key={item.value}>
                            <Checkbox value={item.value}>{t(item.label)}</Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        },
        {
            key: '7',
            label: <Text>{t('Years in Operation')}</Text>,
            children: <Checkbox.Group className='w-100' 
                onChange={(checkedValues) => setOperationalYearRange(checkedValues?.length > 0 ? checkedValues[0] : null)}
            >
                <Row gutter={[12,8]}>
                    {yearOper.map((item) => (
                        <Col span={24} key={item.value}>
                            <Checkbox value={item.value}>{t(item.label)}</Checkbox>
                        </Col>
                    ))}
                </Row>
            </Checkbox.Group>
        },
        {
            key: '8',
            label: <Text>{t('Assets Included')}</Text>,
            children: <Radio.Group 
                onChange={(e) => {
                    const val = e.target.value;
                    setHasAssets(val === 1 ? true : val === 2 ? false : null);
                }}
            >
                <Flex vertical>
                    <Radio value={1}>{t('Yes')}</Radio>
                    <Radio value={2}>{t('No')}</Radio>
                </Flex>
            </Radio.Group>
        },
    ];

    const items = [
        {
            key: '1',
            label: <Title level={5} className='m-0 py-2 fw-500'>{t('Filter By')}</Title>,
            children: <Collapse ghost defaultActiveKey={["1",'2','3','4','5','6','7','8']} items={itemsNest} />,
        },
    ];

    const categoryItems = [
        {
            key: '1',
            label: <Title level={5} className='m-0 py-2 fw-500'>{t('Categories')}</Title>,
            children: <Flex vertical>
                {categories?.map((cat) => (
                    <Link 
                        to={`/businesslisting?category=${encodeURIComponent(cat.title)}`} 
                        className={`cate-filter ${activeCategoryId === cat.id ? 'active' : ''}`}
                        key={cat.id} 
                        onClick={() => {
                            setSelectedCategory(cat.title);
                            setActiveCategoryId(cat.id);
                        }}
                    >
                        {isArabic ? cat.arabicTitle : cat.title}
                    </Link>
                ))}
            </Flex>
        }
    ];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 1199);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const classoverflow = isMobile ? null : 'custom-overflow-style fix-height';

    return (
        <div className={classoverflow}>
            <Card className='mb-1 border-gray card-cs'>
                <Collapse defaultActiveKey={['1']} ghost items={items} className='collapse-cs' />
            </Card>
            <Card className='border-gray card-cs'>
                <Collapse defaultActiveKey={['1']} ghost items={categoryItems} className='collapse-cs'/>
            </Card>
        </div>
    );
};

export { Filter };
