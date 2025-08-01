import { Col, Form, Row, Table } from 'antd'
import { SearchInput } from '../../Forms';
import React,{ useMemo,useEffect, } from 'react'
import { useLazyQuery } from '@apollo/client';
import {OFFERBYSELLER } from '../../../graphql/query';

const CompleteDealsTable = ({setCompleteDeal}) => {
    const [form] = Form.useForm()
    const search = Form.useWatch('search', form);
    const [fetchDeals, { data: offerDeals, loading }] = useLazyQuery(OFFERBYSELLER);


    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Finalized Date', dataIndex: 'date' },
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
        fetchDeals({ variables: { status: 'ACCEPTED', search: search || '' } });
    }, [search]);

    return (
        <>    
            <Row gutter={[24,12]} className='mt-2'>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                    <SearchInput
                        placeholder="Search"
                        value={form.getFieldValue('name') || ''}
                        prefix={<img src="/assets/icons/search.png" style={{marginInline: 3}} width={12} />}
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
        </>
    )
}

export {CompleteDealsTable}