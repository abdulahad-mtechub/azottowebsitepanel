import { Col, Form, Row, Table } from 'antd'
import { SearchInput } from '../../Forms';
import {OFFERBYSELLER } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import React,{ useMemo,useEffect } from 'react'

const InprogressDealsTable = ({setInprogressDeal}) => {
    const [form] = Form.useForm()
     const search = Form.useWatch('search', form);
    const [fetchDeals, { data: offerDeals, loading, error, refetch }] = useLazyQuery(OFFERBYSELLER);

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Requested Date', dataIndex: 'date' },
    ];

    const offerData = useMemo(() => {
            return offerDeals?.getOffersBySeller?.map((offer) => ({
                key: offer.id,
                title: offer.business.businessTitle,
                sellername: offer.business.seller.name,
                offerprice: offer.price,
                date: new Date(offer.createdAt).toLocaleString(),
            })) || [];
        }, [offerDeals]);
    
        useEffect(() => {
            fetchDeals({ variables: { status: 'PENDING', search: search || '' } });
        }, [search]);

    return (
        <Form form={form}>    
            <Row gutter={[24,12]} className='mt-2'>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                    <Form.Item name="search" noStyle>
                        <SearchInput
                            placeholder="Search"
                            value={form.getFieldValue('name') || ''}
                            prefix={<img src="/assets/icons/search.png" style={{marginInline: 3}} width={12} />}
                        />
                    </Form.Item>
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
                                    setInprogressDeal(record)
                                }
                            },
                        })}
                        pagination={false}
                        // pagination={{
                        //     hideOnSinglePage: true,
                        //     total: 12,
                        //     // pageSize: pagination?.pageSize,
                        //     // defaultPageSize: pagination?.pageSize,
                        //     // current: pagination?.pageNo,
                        //     // size: "default",
                        //     // pageSizeOptions: ['10', '20', '50', '100'],
                        //     // onChange: (pageNo, pageSize) => call(pageNo, pageSize),
                        //     showTotal: (total) => <Button className='brand-bg'>Total: {total}</Button>,
                        // }}
                    />
                </Col>
            </Row>
         </Form>    
    )
}

export {InprogressDealsTable}