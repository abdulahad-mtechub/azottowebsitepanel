import { useState } from 'react'
import { Breadcrumb, Button, Card, Col, Flex, Form, Row, Typography } from 'antd'
import { districtOp } from '../data/Lookups'
import { BusinesslistingFilterDrawer, Filter, MySelect, ProductCard } from '../components'
import { useNavigate } from 'react-router-dom';

const { Text, Title } = Typography;

const BusinessListingPage = () => {
    const [form] = Form.useForm(); 
    const [selectedDistrict, setSelectedDistrict] = useState('Select District');
    const [selectedCity, setSelectedCity] = useState('Select City');
    const [selectfilter, setSelectFilter] = useState('Sorting');
    const navigate = useNavigate();
    const [ isfilter, setIsFilter ] = useState(false)


    return (
        <div className='padd-1 mb-3'>
            <div className='bg-dark-blue bread-cs mb-3'>
                <div className='container'>
                    <Breadcrumb
                        separator=">"
                        items={[
                            {
                                title: <Text className='cursor text-gray' onClick={() => navigate('/')}>Home</Text>,
                            },
                            {
                                title: <Text className='fw-500 text-gray'>
                                    Browse Businesses By Category
                                </Text>,
                            },
                        ]}
                    />
                    <Flex vertical gap={30} className='w-100 search-cs'>
                        <Flex vertical gap={5} className='text-center'>
                            <Title level={2} className='text-white m-0'>Find the Right Business for You</Title>
                            <Text className='text-white'>Search by city or business type and explore verified listings that match your goals.</Text>
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
                                        Search Jobs
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
                            Category Name
                        </Title>
                        <Button type='button' onClick={()=>setIsFilter(true)} className='border-0 bg-transparent p-0 filter-btn'>
                            <img src='/assets/icons/filter.png' width={20} />
                        </Button>
                    </Flex>
                    <Flex gap={5} align='center'>
                        <Text className='text-gray fs-13'>
                            Showing 1-10 of 47 Businesses
                        </Text>
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
                <Row gutter={[24,24]}>
                    <Col lg={{span: 6}} md={{span:0}} sm={{span:0}} xs={{span: 0}}>
                        <Filter />
                    </Col>
                    <Col lg={{span: 18}} md={{span:24}} sm={{span:24}} xs={{span: 24}}>
                        <ProductCard />
                    </Col>
                </Row>   
            </div>
            <BusinesslistingFilterDrawer 
                visible={isfilter}
                onClose={()=>setIsFilter(false)}
            />
        </div>
    )
}

export { BusinessListingPage }
