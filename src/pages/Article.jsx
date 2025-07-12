import { Breadcrumb, Col, Flex, Row, Typography } from 'antd'
import { useNavigate } from 'react-router-dom';
import { ArtticleCards, MyInput, MySelect } from '../components';
import { useState } from 'react';
import { RightOutlined } from '@ant-design/icons';
import { articleData } from '../data';

const { Text, Title } = Typography;
const Article = () => {
    const navigate = useNavigate();
    const [selectfilter, setSelectFilter] = useState('Sorting');

    return (
        <>
            <div className='padd-1'>
                <div className='bg-dark-blue bread-cs mb-3'>
                    <div className='container'>
                        <Breadcrumb
                            separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                            items={[
                                {
                                    title: <Text className='cursor text-gray' onClick={() => navigate('/')}>Home</Text>,
                                },
                                {
                                    title: <Text className='fw-500 text-gray'>
                                        Articles
                                    </Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>Articles</Title>
                            <Text className='text-white'>
                                Explore expert advice, seller guides, and tips for buying and selling businesses in Saudi Arabia.
                            </Text>
                        </Flex>
                    </div>
                </div>
                <div className='feature'>
                    <div className='container'>
                        <Row gutter={[24, 24]} justify={'center'}>
                            <Col span={24}>
                                <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                                    <div className='tag bg-secondary fw-500 text-brand'>Articles</div>
                                    <Title className='m-0' level={2}>
                                        Insights & Ideas to Help You Make <span className='text-brand'>Better Business Decisions</span>
                                    </Title>
                                    <Text className='fs-14'>
                                        Explore articles on buying, selling, valuation, and trends in Saudi Arabia  with expert tips from entrepreneurs and analysts.
                                    </Text>
                                </Flex>
                            </Col>
                            <Col lg={{span: 6}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                                <MyInput 
                                    withoutForm
                                    placeholder='Search'
                                    prefix={<img src='/assets/icons/search.png' width={14} />}
                                />
                            </Col>
                            <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                                <Flex justify='end' gap={10} align='center'>
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
                            </Col>
                            <Col span={24}>
                                <ArtticleCards data={articleData} loadmore={true} />
                            </Col>
                        </Row>
                    </div>
                </div> 
            </div>
        </>
    )
}

export { Article }
