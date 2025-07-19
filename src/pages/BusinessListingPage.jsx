import { useState } from 'react'
import { Breadcrumb, Button, Card, Col, Flex, Form, Image, Row, Typography } from 'antd'
import { districtOp } from '../data/Lookups'
import { BusinesslistingFilterDrawer, Filter, MySelect, ProductCard } from '../components'
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';


const { Text, Title } = Typography;

const BusinessListingPage = ({getcategory}) => {
    const [form] = Form.useForm(); 
    const [selectedDistrict, setSelectedDistrict] = useState('Select District');
    const [selectedCity, setSelectedCity] = useState('Select City');
    const [selectfilter, setSelectFilter] = useState('Sorting');
    const navigate = useNavigate();
    const [ isfilter, setIsFilter ] = useState(false)
    const [ isShow, setIsShow ] = useState(false)


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
                                        options={districtOp}
                                        className='w-100 select'
                                        value={selectedDistrict}
                                        onChange={(value) => setSelectedDistrict(value)}
                                    />
                                </Col>
                                <Col xl={{span: 9}} lg={{span: 8}} md={{span:12}} sm={{span: 24}} xs={{span: 24}}>
                                    <MySelect
                                        withoutForm
                                        showSearch 
                                        placeholder="Select City"
                                        options={districtOp}
                                        className='w-100 select'
                                        value={selectedCity}
                                        onChange={(value) => setSelectedCity(value)}
                                    />
                                </Col>
                                <Col xl={{span: 3}} lg={{span: 4}} md={{span:24}} sm={{span: 24}} xs={{span: 24}}>
                                    <Button className='btn bg-brand fs-14 fw-400 w-100'>
                                        <Image src="/assets/icons/search-w.png" preview={false} width={16} alt="" /> Search
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
                            Showing 1-10 of 47 Businesses
                        </Text>
                        <Button type='button' onClick={()=>setIsShow(!isShow)} icon={<img src='/assets/icons/filter-bar.png' width={14}/>} className='btn rounded-8 border-gray text-black sm-hide'>
                            Filter
                        </Button>
                        <MySelect 
                            withoutForm
                            showSearch
                            placeholder="Sorting"
                            options={[
                                {
                                    id: 1,
                                    name: 'Low to High'
                                },
                                {
                                    id: 2,
                                    name: 'High to Low'
                                }
                            ]}
                            className='select'
                            value={selectfilter}
                            onChange={(value) => setSelectFilter(value)}
                        />
                    </Flex>
                </Flex>   
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
                visible={isfilter}
                onClose={()=>setIsFilter(false)}
            />
        </div>
    )
}

export { BusinessListingPage }
