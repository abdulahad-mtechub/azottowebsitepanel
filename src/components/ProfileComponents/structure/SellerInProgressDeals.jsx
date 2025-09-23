import React,{ useMemo,useEffect,useState } from 'react'
import { Col, Form, Row, Table, Button } from 'antd'
import { SearchInput } from '../../Forms';
import {SELLERINPROGRESSDEALS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const SellerInProgressDeals = ({setInprogressDeal}) => {
    const [form] = Form.useForm()
    const search = Form.useWatch('search', form);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
      });
    const { data: offerDeals, loading, error, refetch } = useQuery(
        SELLERINPROGRESSDEALS,
        {
          variables: {
            limit: pagination.pageSize,
            offset: (pagination.current - 1) * pagination.pageSize,
            search: search || '',
          },
          fetchPolicy: 'network-only',
        }
    );

    useEffect(() => {
        refetch({ limit: 10, offset: 0, search: search || '' });
    }, [search, refetch]);

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Buyer Name', dataIndex: 'buyername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Finalized Date', dataIndex: 'date' },
    ];

    const sellerofferData = useMemo(() => {
        return offerDeals?.getSellerInprogressDeals?.map((deal) => ({
            key: deal.id,
            title: deal.business.businessTitle,
            buyername: deal.buyer.name,
            businessprice: deal.price,
            date: new Date(deal.createdAt).toLocaleString(),
            isDsaSeller: deal?.isDsaSeller,
        })) || [];
    }, [offerDeals]);


    return (
        <Form form={form}>    
            <Row gutter={[24,12]} className='mt-2'>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                <Form.Item name="search" noStyle>
                    <SearchInput
                        placeholder="Search"
                        value={form.getFieldValue('name') || ''}
                        prefix={<img src="/assets/icons/search.png" alt='search-icon' className='mx-3-inline' width={12} fetchPriority="high" />}
                    />
                </Form.Item>
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={sellerofferData}
                        className="pagination table table-cs"
                        showSorterTooltip={false}
                        scroll={{ x: 800 }}
                        onRow={record => ({
                            onClick: () => {
                                if (record.key) {
                                    setInprogressDeal(record)
                                }
                            },
                        })}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: offerDeals?.getBuyerInprogressDeals?.length || 0,
                            showTotal: (total) => (
                                <Button aria-labelledby='Total' className="brand-bg">Total: {total}</Button>
                              ),
                            onChange: (page, pageSize) => {
                                setPagination({ current: page, pageSize });
                            },
                        }}
                    />
                </Col>
            </Row>
        </Form>    
    )
}

export {SellerInProgressDeals}