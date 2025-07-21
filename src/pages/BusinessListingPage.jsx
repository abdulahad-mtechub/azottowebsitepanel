import React, { useState,useEffect,useMemo } from 'react'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography,Form, Image, } from 'antd'
import { cities,district } from '../data/'
import { BusinesslistingFilterDrawer, Filter, MySelect, ProductCard } from '../components'
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { useLazyQuery } from '@apollo/client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import {GET_ALL_BUSINESSES, GET_BUSINESS_BY_CATEGORY, GET_BUSINESS_BY_CITY, GET_BUSINESS_BY_REVENUE, GET_BUSINESS_BY_PROFIT,GET_BUSINESS_BY_DISTRICT } from '../graphql/query/business';

const { Text, Title } = Typography;

const BusinessListingPage = ({getcategory}) => {
    const [params] = useSearchParams();
    const category = params.get('category');
    const cityParam = params.get('city');
    const [limit, setLimit] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [ isShow, setIsShow ] = useState(false)

    const [fetchBusinesses, { data: businesses, loading: isLoading, refetch }] = useLazyQuery(GET_ALL_BUSINESSES);
console.log("businesses",businesses)
    const [selectedDistrict, setSelectedDistrict] = useState('Select District');
    const [selectedCity, setSelectedCity] = useState(null);
    const [searchSelectedCity, setsearchSelectedCity] = useState([]);
    const [cityOptions, setCityOptions] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectfilter, setSelectFilter] = useState('Low to High');

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
        const sanitizeRange = (range) => {
          return Array.isArray(range) && (range[0] != null || range[1] != null)
            ? range.map((val) => (val != null ? Number(val) : null))
            : null;
        };
      
        const sanitizeSingle = (val) =>
          val != null && val !== '' && val !== 'Select City' && val !== 'Select District' ? val : null;
      
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
          sort: {
            price: selectfilter === 'Low to High' ? 'ASC' : 'DESC',
          },
        };
    };
      
    // 🟩 Fetch correct query based on search params
    useEffect(() => {
        let variables = getFilterVariables();
        let query = GET_ALL_BUSINESSES;
        if (category || selectedCategory) {
            if (selectedCategory) {
                query = GET_BUSINESS_BY_CATEGORY;
                variables = { category: selectedCategory, limit, offSet: 0 };
            }else{
                query = GET_BUSINESS_BY_CATEGORY;
            variables = { category, limit, offSet: 0 };
            }
        } else if (cityParam) {
          query = GET_BUSINESS_BY_CITY;
          variables = { city: cityParam, limit, offSet: 0 };
        } else if (revenue) {
          query = GET_BUSINESS_BY_REVENUE;
          variables = { revenue, limit, offSet: 0 };
        } else if (profit) {
          query = GET_BUSINESS_BY_PROFIT;
          variables = { profit, limit, offSet: 0 };
        }
        
    
        fetchBusinesses({ query, variables });
      }, [
        category,
        cityParam,
        profit,
        revenue,
        limit,
        currentPage,
        employeesRange,
        operationalYearRange,
        hasAssets,
        priceRange,
        profitRange,
        profitMargenRange,
        revenueRange,
        multipleStep,
        selectfilter,
        selectedCategory,
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
        setSelectedDistrict(selectedDistObj.name);
      };
      
      const handleCityChange = (value) => {
        setsearchSelectedCity(value);
      };
      
      const handleSearch = () => {
        let variables;
        let query ;
        if (searchSelectedCity) {
            // Case 1 & 3: City selected → always use GET_BUSINESS_BY_CITY
            const allCities = Object.values(cities).flat();
            const selectedCityObj = allCities.find(city => city.id === Number(searchSelectedCity));
            if (selectedCityObj) {
            console.log("selectedCityObj",selectedCityObj)
              query = GET_BUSINESS_BY_CITY;
              variables = { city: selectedCityObj.name, limit, offSet: 0 };
              fetchBusinesses({ query, variables });
            } else {
                if(selectedDistrict){
                    console.log("selectedDistrict",selectedDistrict)
                    // Case 2: Only District selected
                    query = GET_BUSINESS_BY_DISTRICT;
                    variables = { district: selectedDistrict, limit, offSet: 0 };
                    fetchBusinesses({ query, variables });
                }
                else{
                    console.warn("City not found in the list");

                }
            }
          } else if (selectedDistrict && selectedDistrict !== "Select District") {
            console.log("selectedDistrict",selectedDistrict)
            // Case 2: Only District selected
            query = GET_BUSINESS_BY_DISTRICT;
            variables = { district: selectedDistrict, limit, offSet: 0 };
            fetchBusinesses({ query, variables });
          } else {
            // Nothing selected, optionally do nothing or reset
            console.log("No city or district selected.");
          }
      };

    return (
  
        <div className='padd-1 mb-3'>
            <div className='bg-dark-blue bread-cs mb-3'>
                <div className='container'>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            {
                                title: <Text className='cursor text-gray' onClick={() => navigate('/')}>Home</Text>,
                            },
                            {
                                title: <Text className='fw-500 text-white'>
                                    Browse Businesses By Category
                                </Text>,
                            },
                        ]}
                    />
                    <Flex vertical gap={30} className='w-100 search-cs'>
                        <Flex vertical gap={5} className='text-center'>
                            <Title level={2} className='text-white m-0'>Find the Right Business for You</Title>
                            <Text className='text-light-gray fs-16'>Search by city or business type and explore verified listings that match your goals.</Text>
                        </Flex>
                        <Card className='shadow-c rounded'>
                            <Row gutter={[24,24]} align={'middle'}>
                                <Col lg={{span: 12}} md={{span:12}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        withoutForm
                                        showSearch
                                        placeholder="Select District"
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
                                        placeholder="Select City"
                                        options={cityOptions}
                                        className='w-100 select'
                                        value={searchSelectedCity}
                                        onChange={handleCityChange}
                                        onFocus={() => {
                                            if (selectedDistrict && selectedDistrict !== 'Select District') {
                                              // Find selected district object by name
                                              const selectedDistObj = district.find(d => d.name === selectedDistrict);
                                              // If found, set city options for that district, else empty array
                                              if (selectedDistObj) {
                                                setCityOptions(cities[selectedDistObj.value] || []);
                                              } else {
                                                setCityOptions([]);
                                              }
                                            } else {
                                              // If no district selected, show all cities
                                              const allCities = Object.values(cities).flat();
                                              setCityOptions(allCities);
                                            }
                                          }}
                                    />
                                </Col>
                                <Col xl={{span: 3}} lg={{span: 4}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                                    <Button className='btn bg-brand fs-14 fw-400 w-100'>
                                        <Image src="/assets/icons/search-w.png" preview={false} width={16} alt=""  onClick={handleSearch}/> Search
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
                        <Title level={4} className='m-0'>
                            {getcategory ? getcategory : 'Category Name'}
                        </Title>
                        <Button type='button' onClick={()=>setIsFilter(true)} className='border-0 bg-transparent p-0 filter-btn'>
                            <img src='/assets/icons/filter.png' width={20} />
                        </Button>
                    </Flex>
                    <Flex gap={5} align='center'>
                        <Text className='text-gray fs-13'>
                        {`Showing ${((currentPage - 1) * limit) + 1}–${Math.min(currentPage * limit, totalCount || 0)} of ${totalCount || 0} Businesses`}
                        </Text>
                        <Button type='button' onClick={()=>setIsShow(!isShow)} icon={<img src='/assets/icons/filter-bar.png' width={14}/>} className='btn rounded-8 border-gray text-black sm-hide'>
                            Filter
                        </Button>
                        <MySelect 
                            withoutForm
                            showSearch
                            placeholder="Sorting"
                            options={[
                                { id: 1, name: 'Low to High' },
                                { id: 2, name: 'High to Low' }
                            ]}
                            className='select'
                            value={selectfilter}
                            onChange={(id) => {
                                const selected = id === 1 ? 'Low to High' : 'High to Low';
                                setSelectFilter(selected);

                                setFilterVars(prev => ({
                                ...prev,
                                sort: {
                                    price: selected === 'Low to High' ? 'ASC' : 'DESC'
                                }
                                }));
                            }}
                        />
                    </Flex>
                </Flex>   
                <Row gutter={[24,24]}>
                    <Col lg={{span: 6}} md={{span:0}} sm={{span:0}} xs={{span: 0}}>
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
                    </Col>
                    <Col lg={{span: 18}} md={{span:24}} sm={{span:24}} xs={{span: 24}}>
                        <ProductCard
                        exploreData={
                            businessList?.map((biz) => ({
                              id: biz.id,
                              title: biz.businessTitle,
                              categoryName: biz.category.name,
                              description: biz.description,
                              isSaved: biz.isSaved,
                              amount: `SAR ${biz.price?.toLocaleString()}`,
                              save: 'no', // or logic to check if saved
                              child: [
                                {
                                  subtitle: `SAR ${biz.revenue?.toLocaleString()}`,
                                  subdesc: 'Revenue/month'
                                },
                                {
                                  subtitle: `SAR ${biz.profit?.toLocaleString()}`,
                                  subdesc: 'Profit/month'
                                },
                                {
                                    subtitle: `${biz.recoveryTime?.toLocaleString()} months`,
                                  subdesc: 'Capital Recovery'
                                },
                              ]
                            }))
                        } 
                        refetchBusinesses={refetch}
                        totalCount={totalCount || 0}
                        currentPage={currentPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        limit={limit}
                        onLimitChange={(value) => {
                            setLimit(value);
                            setCurrentPage(1); // reset page on limit change
                        }}
                        />
                    </Col>
                </Row>   
                <Flex gap={24} align="stretch" className="mb-4">
                    {/* FILTER SECTION */}
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
                            <Filter />
                        </motion.div>
                        )}
                    </AnimatePresence>

                    {/* PRODUCT SECTION */}
                    <motion.div
                        key="product"
                        animate={{ width: isShow ? 'calc(100% - 250px)' : '100%' }}
                        transition={{ duration: 0.4 }}
                        style={{ minWidth: 0 }}
                    >
                        <ProductCard />
                    </motion.div>
                </Flex>
            </div>
            <BusinesslistingFilterDrawer 
                visible={isFilter}
                onClose={()=>setIsFilter(false)}
            />
        </div>
    )
}

export { BusinessListingPage }
