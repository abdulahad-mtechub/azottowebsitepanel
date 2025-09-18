import React,{ useMemo,useEffect,useState } from 'react'
import { Col, Form, Row, Table } from 'antd'
import { SearchInput } from '../../Forms';
import {BUYERDEALS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const CompleteDealsTable = ({setCompleteDeal}) => {
    const [form] = Form.useForm()
    const search = Form.useWatch('search', form);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
      });

    const { data: offerDeals, loading, error, refetch } = useQuery(BUYERDEALS, {
    variables: {
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      search: search || '',
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch({ limit: 10, offset: 0, search: search || '' });
  }, [search, refetch]);

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Finalized Date', dataIndex: 'date' },
    ];

    const offerData = useMemo(() => {
        return offerDeals?.getBuyerCompletedDeals?.map((offer) => ({
            key: offer.id,
            title: offer.business.businessTitle,
            sellername: offer.business.seller.name,
            offerprice: offer.price,
            date: new Date(offer.createdAt).toLocaleString(),
        })) || [];
    }, [offerDeals]);

    return (
        <>    
            <Row gutter={[24,12]} className='mt-2'>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                    <SearchInput
                        placeholder="Search"
                        value={form.getFieldValue('name') || ''}
                        prefix={<img src="/assets/icons/search.png" alt='search-icon' className='mx-3-inline' width={12} fetchPriority="high" />}
                        onChange={(e) => form.setFieldValue("search", e.target.value)}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={offerData}
                        className="pagination table table-cs"
                        showSorterTooltip={false}
                        scroll={{ x: 800 }}
                        onRow={record => ({
                            onClick: () => {
                                if (record.key) {
                                    setCompleteDeal(record)
                                }
                            },
                        })}
                        // pagination={false}
                        pagination={{
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: offerDeals?.getBuyerCompletedDeals?.length || 0, // Replace with totalCount if available
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
        </>
    )
}

export {CompleteDealsTable}