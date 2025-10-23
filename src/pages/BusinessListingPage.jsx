import React, { useState,useEffect,useMemo } from 'react';
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography, Image } from 'antd';
import { useDistricts, useCities } from '../data/';
import { BusinesslistingFilterDrawer, Filter, MySelect, ProductCard } from '../components';
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useLazyQuery } from '@apollo/client';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {GET_ALL_BUSINESSES, GET_BUSINESS_BY_CATEGORY, GET_BUSINESS_BY_CITY, GET_BUSINESS_BY_REVENUE, GET_BUSINESS_BY_PROFIT,GET_BUSINESS_BY_DISTRICT } from '../graphql/query/business';
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const BusinessListingPage = ({getcategory}) => {
    
    const {t,i18n}= useTranslation()
    const lang = localStorage.getItem("lang") || i18n.language || "en";
    const isArabic = lang.toLowerCase() === "ar";
    const district = useDistricts();
    const cities = useCities();
    const [params] = useSearchParams();
    const rawCategoryParam = params.get('category');
    const categoryParam = rawCategoryParam && rawCategoryParam !== 'undefined' ? rawCategoryParam : null;
    const cityParam = params.get('city');
    const [limit, setLimit] = useState(12);
    const [currentPage, setCurrentPage] = useState(1);
    const [ isShow, setIsShow ] = useState(false);

    const [fetchBusinesses, { data: businesses, loading: isLoading, refetch }] = useLazyQuery(GET_ALL_BUSINESSES,
        { variables:{ limit: null, offSet: null, search: null, sort: { price: null }, filter: {} } }
    );
    const options = [
        { id: 1, key: t('Low to High')},
        { id: 2, key: t('High to Low') },
      ];
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedDistrictId, setSelectedDistrictId] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchSelectedCity, setsearchSelectedCity] = useState(null);
    const [cityOptions, setCityOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOrder, setSortOrder] = useState(null); // null by default

    // Clear selectedCategory when URL params change to Browse All
    useEffect(() => {
        if (!categoryParam && !getcategory) {
            setSelectedCategory('');
        }
    }, [categoryParam, getcategory]);
    
    const categoryParamLabel = categoryParam ? decodeURIComponent(categoryParam) : null;
    const activeCategoryLabel = getcategory || categoryParamLabel || (selectedCategory || null);
    
    // Determine breadcrumb path based on URL params
    const getBreadcrumbItems = () => {
        const items = [
            { title: <Text className='cursor text-gray' onClick={() => navigate('/')}>{t('Home')}</Text> }
        ];

        if (revenue) {
            // Browse by Revenue
            items.push({ title: <Text className='text-gray'>{t('Browse by Revenue')}</Text> });
            const [min, max] = revenue;
            items.push({ 
                title: <Text className='fw-500 text-white'>
                    {max >= 9999999 
                        ? t('SAR {{min}}+', { min: min?.toLocaleString() })
                        : t('SAR {{min}} - SAR {{max}}', { min: min?.toLocaleString(), max: max?.toLocaleString() })
                    }
                </Text> 
            });
        } else if (profit) {
            // Browse by Profit
            items.push({ title: <Text className='text-gray'>{t('Browse by Profit')}</Text> });
            const [min, max] = profit;
            items.push({ 
                title: <Text className='fw-500 text-white'>
                    {t('SAR {{min}} - SAR {{max}}', { min: min?.toLocaleString(), max: max?.toLocaleString() })}
                </Text> 
            });
        } else if (activeCategoryLabel) {
            // Browse by Category
            items.push({ title: <Text className='text-gray'>{t('Browse by Categories')}</Text> });
            items.push({ title: <Text className='fw-500 text-white'>{activeCategoryLabel}</Text> });
        } else if (cityParam) {
            // Browse by City
            items.push({ title: <Text className='text-gray'>{t('Browse by City')}</Text> });
            items.push({ title: <Text className='fw-500 text-white'>{decodeURIComponent(cityParam)}</Text> });
        } else {
            // Browse All
            items.push({ title: <Text className='fw-500 text-white'>{t('Browse All')}</Text> });
        }

        return items;
    };

    const listingHeading = activeCategoryLabel || t('All Businesses');

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
          sort: sortOrder !== null ? { price: sortOrder === 'Low to High' ? 'ASC' : 'DESC' } : null,
        };
    };

    // 🟩 Fetch correct query based on search params
    useEffect(() => {
        let variables = getFilterVariables();
        let query = GET_ALL_BUSINESSES;
        if (categoryParam || selectedCategory) {
            query = GET_BUSINESS_BY_CATEGORY;
            variables = { category: selectedCategory || categoryParam, limit, offSet: 0 };
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        categoryParam, cityParam, profit, revenue, limit, currentPage,
        employeesRange, operationalYearRange, hasAssets,
        priceRange, profitRange, profitMargenRange, revenueRange,
        multipleStep, sortOrder, selectedCategory
    ]);

    const businessList =
        businesses?.getAllBusinesses?.businesses ||
        businesses?.getAllBusinessesByCategory?.businesses ||
        businesses?.getAllBusinessesByDistrict?.businesses ||
        businesses?.getAllBusinessesByCity?.businesses ||
        businesses?.getAllBusinessesByProfit?.businesses ||
        businesses?.getAllBusinessesByRevenue?.businesses ||
        [];

    const totalCount =
        businesses?.getAllBusinesses?.totalCount ||
        businesses?.getAllBusinessesByDistrict?.totalCount ||
        businesses?.getAllBusinessesByCategory?.totalCount ||
        businesses?.getAllBusinessesByCity?.totalCount ||
        businesses?.getAllBusinessesByProfit?.totalCount ||
        businesses?.getAllBusinessesByRevenue?.totalCount ||
        0;
      
    const handleDistrictChange = (value) => {
        if (!value) {
            setSelectedDistrict(null);
            setSelectedDistrictId(null);
            setsearchSelectedCity(null);
            setSelectedCity(null);
            setCityOptions([]);
            return;
        }
        
        const selectedDistObj = district.find(d => d.id === value);
        if (selectedDistObj) {
            setSelectedDistrict(selectedDistObj.name);
            setSelectedDistrictId(selectedDistObj.id);
            // Update city options based on selected district
            setCityOptions(cities[selectedDistObj.id] || []);
            // Clear city selection when district changes
            setsearchSelectedCity(null);
            setSelectedCity(null);
        }
    };
      
    const handleCityChange = (value) => {
        if (!value) {
            setsearchSelectedCity(null);
            setSelectedCity(null);
            return;
        }

        setsearchSelectedCity(value);
        
        // Find city from current district's cities or all cities
        const cityList = selectedDistrictId ? (cities[selectedDistrictId] || []) : Object.values(cities).flat();
        const selectedCityObj = cityList.find(city => city.id === Number(value));
        setSelectedCity(selectedCityObj?.name || null);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page
        
        if (searchSelectedCity && selectedCity) {
            // Search by city
            const query = GET_BUSINESS_BY_CITY;
            const variables = { 
                city: selectedCity, 
                limit, 
                offSet: 0,
                filter: getFilterVariables().filter,
                sort: getFilterVariables().sort
            };
            fetchBusinesses({ query, variables });
        } else if (selectedDistrict && !searchSelectedCity) {
            // Search by district only
            const query = GET_BUSINESS_BY_DISTRICT;
            const variables = { 
                district: selectedDistrict, 
                limit, 
                offSet: 0,
                filter: getFilterVariables().filter,
                sort: getFilterVariables().sort
            };
            fetchBusinesses({ query, variables });
        } else {
            // No district/city selected, fetch all
            const variables = getFilterVariables();
            fetchBusinesses({ query: GET_ALL_BUSINESSES, variables });
        }
    };


    return (
        <div className='padd-1 mb-3'>
            <div className='bg-dark-blue bread-cs mb-3'>
                <div className='container'>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={getBreadcrumbItems()}
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
                                        placeholder={t('Select District')}
                                        options={district}
                                        className='w-100 select'
                                        value={selectedDistrictId}
                                        onChange={handleDistrictChange}
                                        allowClear
                                    />
                                </Col>
                                <Col xl={{span: 9}} lg={{span: 8}} md={{span:12}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        withoutForm
                                        placeholder={t('Select City')}
                                        options={cityOptions}
                                        className='w-100 select'
                                        value={searchSelectedCity}
                                        onChange={handleCityChange}
                                        allowClear
                                    />
                                </Col>
                                <Col xl={{span: 3}} lg={{span: 4}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                                    <Button 
                                        aria-labelledby={t('Search')} 
                                        className='btn bg-brand fs-14 fw-400 w-100'
                                        onClick={handleSearch}
                                    >
                                        <Image src="/assets/icons/search-w.png" preview={false} width={16} alt={t('search icon')} /> {t('Search')}
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
                        <Title level={4} className='m-0'>{listingHeading}</Title>
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
                            placeholder={t('Sort By')}
                            options={options.map(opt => ({ ...opt, name: t(opt.key) }))}
                            className='select'
                            value={sortOrder}
                            allowClear
                            onChange={(id) => {
                                setSortOrder(id === 1 ? 'Low to High' : id === 2 ? 'High to Low' : null);
                            }}
                            style={{ minWidth: 120 }}
                        />
                    </Flex>
                </Flex>
                <Flex gap={isShow ?24:0} align="stretch" className="mb-4">
                    <div className='sm-hide'>
                        <AnimatePresence>
                            {isShow && (
                                <Motion.div
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
                                </Motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <Motion.div
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
                                categoryName: isArabic? biz.category.arabicName:biz.category.name,
                                description: biz.description,
                                isSaved: biz.isSaved,
                                isByTakbeer: biz.isByTakbeer,
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
                    </Motion.div>
                </Flex>
            </div>
            <BusinesslistingFilterDrawer visible={isFilter} onClose={()=>setIsFilter(false)} />
        </div>
    );
};

export { BusinessListingPage };
