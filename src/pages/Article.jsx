import { Breadcrumb, Col, Flex, Row, Typography,Spin } from 'antd'
import { useNavigate } from 'react-router-dom';
import { ArtticleCards, MyInput, MySelect } from '../components';
import { useState,useRef } from 'react';
import { RightOutlined } from '@ant-design/icons';
import {GETARTICLES} from '../graphql/query/queries';
import { useQuery } from "@apollo/client";

const { Text, Title } = Typography;
const Article = () => {
    const navigate = useNavigate();
    const [selectfilter, setSelectFilter] = useState('Sorting');
    const handlePageChange = (page, size) => {
        setCurrent(page);
        setPageSize(size);
    };
    const  {data, loading , error,refetch} = useQuery(GETARTICLES,{
        variables: { search: "" },
    });

    const total = data?.getArticles?.totalCount || 0;
    const articleData = data?.getArticles?.articles.map(item => ({
        id: item.id,
        img: item.image,
        title: item.title,
        desc: item.body,
        date: item.createdAt,
      })) || [];
    const searchTimeout = useRef(null);

    const handleSearchChange = (e) => {
        const value = e.target.value;

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            refetch({ search: value });
            setCurrent(1); // reset pagination
        }, 500); // 500ms delay
    };

    if (loading) {
        return (
            <Flex justify="center" align="center" style={{ height: "200px" }}>
                <Spin size="large" />
            </Flex>
        );
    }

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
                                    title: <Text className='fw-500 text-white'>
                                        Articles
                                    </Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>Articles</Title>
                            <Text className='text-light-gray fs-16'>
                                Explore expert advice, seller guides, and tips for buying and selling businesses in Saudi Arabia.
                            </Text>
                        </Flex>
                    </div>
                </div>
                <div className='feature'>
                    <div className='container'>
                        <Row gutter={[24, 12]} justify={'center'}>
                            <Col span={24} className='mb-3'>
                                <Flex vertical justify='center' align='center' gap={15}>
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
                                    prefix={<img src='/assets/icons/search.png' alt='search-icon' width={14} />}
                                    onChange={handleSearchChange} 
                                />
                            </Col>
                            <Col lg={{span: 18}} md={{span: 24}} sm={{span: 24}} xs={{span: 24}}>
                                <Flex justify='end' gap={10} align='center'>
                                    <Text className='text-gray fs-14'>
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
