import React, { useState,useEffect,useMemo } from 'react';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography, Image } from 'antd';
import { useDistricts, useCities } from '../data/';
import { BusinesslistingFilterDrawer, Filter, MySelect, ProductCard } from '../components';
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useLazyQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {GET_ALL_BUSINESSES, GET_BUSINESS_BY_CATEGORY, GET_BUSINESS_BY_CITY, GET_BUSINESS_BY_REVENUE, GET_BUSINESS_BY_PROFIT,GET_BUSINESS_BY_DISTRICT } from '../graphql/query/business';
import { t } from 'i18next';

const { Text, Title } = Typography;

const BusinessListingPage = ({getcategory}) => {

    const district = useDistricts();
    const cities = useCities();
    const [params] = useSearchParams();
    const category = params.get('category');
    const cityParam = params.get('city');
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [ isShow, setIsShow ] = useState(false);

    const [fetchBusinesses, { data: businesses, loading: isLoading, refetch }] = useLazyQuery(GET_ALL_BUSINESSES,
        { variables:{ limit: null, offSet: null, search: null, sort: { price: null }, filter: {} } }
    );

    const [selectedDistrict, setSelectedDistrict] = useState(t('Select District'));
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchSelectedCity, setsearchSelectedCity] = useState([]);
    const [cityOptions, setCityOptions] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectfilter, setSelectFilter] = useState(t('Low to High'));

    const [multipleStep, setMultipleStep] = useState(null);
    const [priceRange, setPriceRange] = useState([null, null]);
    const [revenueRange, setRevenueRange] = useState([null, null]);
    const [profitRange, setProfitRange] = useState([null, null]);
    const [profitMargenRange, setProfitMargenRange] = useState([null, null]);
    const [employeesRange, setEmployeesRange] = useState(null);
    const [operationalYearRange, setOperationalYearRange] = useState(null);
    const [hasAssets, setHasAssets] = useState(null);
    const [isFilter, setIsFilter] = useState(false);
  
    const navigate = useNavigate();
    const profit = useMemo(() => {
        const val = params.get('profit');
        return val ? val.split(',').map(Number) : null;
    }, [params]);
      
    const revenue = useMemo(() => {
        const val = params.get('revenue');
        return val ? val.split(',').map(Number) : null;
    }, [params]);

    const getFilterVariables = () => {
        const sanitizeRange = (range) => Array.isArray(range) && (range[0] != null || range[1] != null)
            ? range.map((val) => (val != null ? Number(val) : null))
            : null;
        const sanitizeSingle = (val) => val != null && val !== '' && val !== t('Select City') && val !== t('Select District') ? val : null;
      
        return {
          limit,
          offSet: (currentPage - 1) * limit,
          filter: {
            city: sanitizeSingle(selectedCity),
            district: sanitizeSingle(selectedDistrict),
            employeesRange: sanitizeRange(employeesRange),
            operationalYearRange: sanitizeRange(operationalYearRange),
            hasAssets: hasAssets !== null ? hasAssets : null,
            priceRange: sanitizeRange(priceRange),
            profitMargenRange: sanitizeRange(profitMargenRange),
            profitRange: profit || sanitizeRange(profitRange),
            revenueRange: revenue || sanitizeRange(revenueRange),
            multiple: multipleStep !== null ? Number(multipleStep) : null,
          },
          sort: { price: selectfilter === t('Low to High') ? 'ASC' : 'DESC' },
        };
    };

    // 🟩 Fetch correct query based on search params
    useEffect(() => {
        let variables = getFilterVariables();
        let query = GET_ALL_BUSINESSES;
        if (category || selectedCategory) {
            query = GET_BUSINESS_BY_CATEGORY;
            variables = { category: selectedCategory || category, limit, offSet: 0 };
        } else if (cityParam) {
            query = GET_BUSINESS_BY_CITY;
            variables = { city: cityParam, limit, offSet: 0 };
        } else if (revenue) {
            query = GET_BUSINESS_BY_REVENUE;
            variables = { revenue, limit, offSet: 0 };
        } else if (profit) {
            query = GET_BUSINESS_BY_PROFIT;
            variables = { profit, limit, offSet: 0 };
        } else if(employeesRange || operationalYearRange) {
            query = GET_ALL_BUSINESSES;
        }
        fetchBusinesses({ query, variables });
    }, [
        category, cityParam, profit, revenue, limit, currentPage,
        employeesRange, operationalYearRange, hasAssets,
        priceRange, profitRange, profitMargenRange, revenueRange,
        multipleStep, selectfilter, selectedCategory,
    ]);

    const businessList =
        businesses?.getAllBusinesses?.businesses ||
        businesses?.getAllBusinessesByCategory?.businesses ||
        businesses?.getAllBusinessesByCity?.businesses ||
        businesses?.getAllBusinessesByProfit?.businesses ||
        businesses?.getAllBusinessesByRevenue?.businesses ||
        [];

    const totalCount =
        businesses?.getAllBusinesses?.totalCount ||
        businesses?.getAllBusinessesByCategory?.totalCount ||
        businesses?.getAllBusinessesByCity?.totalCount ||
        businesses?.getAllBusinessesByProfit?.totalCount ||
        businesses?.getAllBusinessesByRevenue?.totalCount ||
        0;
      
    const handleDistrictChange = (value) => {
        const selectedDistObj = district.find(d => d.id === value);
        setSelectedDistrict(selectedDistObj?.name || t('Select District'));
    };
      
    const handleCityChange = (value) => setsearchSelectedCity(value);

    const handleSearch = () => {
        let query, variables;
        if (searchSelectedCity) {
            const allCities = Object.values(cities).flat();
            const selectedCityObj = allCities.find(city => city.id === Number(searchSelectedCity));
            if (selectedCityObj) {
                query = GET_BUSINESS_BY_CITY;
                variables = { city: selectedCityObj.name, limit, offSet: 0 };
            } else if(selectedDistrict) {
                query = GET_BUSINESS_BY_DISTRICT;
                variables = { district: selectedDistrict, limit, offSet: 0 };
            }
            fetchBusinesses({ query, variables });
        } else if (selectedDistrict && selectedDistrict !== t('Select District')) {
            query = GET_BUSINESS_BY_DISTRICT;
            variables = { district: selectedDistrict, limit, offSet: 0 };
            fetchBusinesses({ query, variables });
        }
    };

    return (
        <div className='padd-1 mb-3'>
            <div className='bg-dark-blue bread-cs mb-3'>
                <div className='container'>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            { title: <Text className='cursor text-gray' onClick={() => navigate('/')}>{t('Home')}</Text> },
                            { title: <Text className='fw-500 text-white'>{t('Browse Businesses By Category')}</Text> },
                        ]}
                    />
                    <Flex vertical gap={30} className='w-100 search-cs'>
                        <Flex vertical gap={5} className='text-center'>
                            <Title level={2} className='text-white m-0'>{t('Find the Right Business for You')}</Title>
                            <Text className='text-light-gray fs-16'>{t('Search by city or business type and explore verified listings that match your goals.')}</Text>
                        </Flex>
                        <Card className='shadow-c rounded'>
                            <Row gutter={[24,24]} align={'middle'}>
                                <Col lg={{span: 12}} md={{span:12}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        withoutForm
                                        showSearch
                                        placeholder={t('Select District')}
                                        options={district}
                                        className='w-100 select'
                                        value={selectedDistrict}
                                        onChange={handleDistrictChange}
                                    />
                                </Col>
                                <Col xl={{span: 9}} lg={{span: 8}} md={{span:12}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        withoutForm
                                        showSearch 
                                        placeholder={t('Select City')}
                                        options={cityOptions}
                                        className='w-100 select'
                                        value={searchSelectedCity}
                                        onChange={handleCityChange}
                                        onFocus={() => {
                                            if (selectedDistrict && selectedDistrict !== t('Select District')) {
                                                const selectedDistObj = district.find(d => d.name === selectedDistrict);
                                                setCityOptions(selectedDistObj ? cities[selectedDistObj.value] || [] : []);
                                            } else setCityOptions(Object.values(cities).flat());
                                        }}
                                    />
                                </Col>
                                <Col xl={{span: 3}} lg={{span: 4}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                                    <Button aria-labelledby={t('Search')} className='btn bg-brand fs-14 fw-400 w-100'>
                                        <Image src="/assets/icons/search-w.png" preview={false} width={16} alt={t('search icon')} onClick={handleSearch}/> {t('Search')}
                                    </Button>
                                </Col>
                            </Row>
                        </Card>
                    </Flex>
                </div>
            </div>
            <div className='container'>
                <Flex gap={10} justify='space-between' wrap align='center' className='mb-3'>
                    <Flex gap={5} align='center'>
                        <Title level={4} className='m-0'>{getcategory || t('All Businesses')}</Title>
                        <Button aria-labelledby={t('Filter icon')} type='button' onClick={()=>setIsFilter(true)} className='border-0 bg-transparent p-0 filter-btn'>
                            <img src='/assets/icons/filter.png' alt={t('filter-icon')} width={20} fetchPriority="high" />
                        </Button>
                    </Flex>
                    <Flex gap={5} align='center'>
                        <Text className='text-gray fs-13'>
                            {t('Showing {{start}}–{{end}} of {{total}} Businesses', {
                                start: ((currentPage - 1) * limit) + 1,
                                end: Math.min(currentPage * limit, totalCount || 0),
                                total: totalCount || 0
                            })}
                        </Text>
                        <Button aria-labelledby={t('Filter')} type='button' onClick={()=>setIsShow(!isShow)} className='btn rounded-8 border-gray text-black sm-hide'>
                            <Flex align='center' gap={3}>
                                <img src='/assets/icons/filter-bar.png' alt={t('filter-icon')} width={14} fetchPriority="high"/> {t('Filter')}
                            </Flex>
                        </Button>
                        <MySelect 
                            withoutForm
                            showSearch
                            placeholder={t('Sorting')}
                            options={[
                                { id: 1, name: t('Low to High') },
                                { id: 2, name: t('High to Low') }
                            ]}
                            className='select'
                            value={selectfilter}
                            onChange={(id) => {
                                const selected = id === 1 ? t('Low to High') : t('High to Low');
                                setSelectFilter(selected);
                            }}
                        />
                    </Flex>
                </Flex>
                <Flex gap={isShow ?24:0} align="stretch" className="mb-4">
                    <div className='sm-hide'>
                        <AnimatePresence>
                            {isShow && (
                                <motion.div
                                    key="filter"
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 250, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    style={{ overflow: 'hidden', flexShrink: 0 }}
                                >
                                    <Filter 
                                        multipleStep={multipleStep}
                                        setMultipleStep={setMultipleStep}
                                        setPriceRange={setPriceRange}
                                        setRevenueRange={setRevenueRange}
                                        setProfitRange={setProfitRange}
                                        setProfitMargenRange={setProfitMargenRange}
                                        setEmployeesRange={setEmployeesRange}
                                        setOperationalYearRange={setOperationalYearRange}
                                        setHasAssets={setHasAssets} 
                                        setSelectedCategory={setSelectedCategory}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <motion.div
                        key="product"
                        animate={{ width: isShow ? 'calc(100% - 250px)' : '100%' }}
                        transition={{ duration: 0.4 }}
                        style={{ minWidth: 0 }}
                        className='mobile-100'
                    >
                        <ProductCard
                            exploreData={businessList?.map((biz) => ({
                                id: biz.id,
                                title: biz.businessTitle,
                                categoryName: biz.category.name,
                                description: biz.description,
                                isSaved: biz.isSaved,
                                amount: `${biz.price?.toLocaleString()}`,
                                save: 'no',
                                child: [
                                    { subtitle: `${biz.revenue?.toLocaleString()}`, subdesc: t('Revenue/month') },
                                    { subtitle: `${biz.profit?.toLocaleString()}`, subdesc: t('Profit/month') },
                                    { subtitle: `${biz.capitalRecovery?.toLocaleString()} months`, subdesc: t('Capital Recovery') },
                                ]
                            }))}
                            refetchBusinesses={refetch}
                            totalCount={totalCount || 0}
                            currentPage={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                            limit={limit}
                            onLimitChange={(value) => {
                                setLimit(value);
                                setCurrentPage(1);
                            }}
                            isLoading={isLoading}
                        />
                    </motion.div>
                </Flex>
            </div>
            <BusinesslistingFilterDrawer visible={isFilter} onClose={()=>setIsFilter(false)} />
        </div>
    );
};

export { BusinessListingPage };
