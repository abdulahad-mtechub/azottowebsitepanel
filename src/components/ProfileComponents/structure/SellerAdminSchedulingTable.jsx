import {  Col, Form, Row, Table, Typography } from 'antd'
import { SearchInput } from '../../Forms';
import {READYSCHEDULEDMEETINGS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import React,{useEffect} from 'react'

const { Text } = Typography
const SellerAdminSchedulingTable = ({ isBuyer }) => {

    const [form] = Form.useForm()
    const [fetchMeetings,{ data, loading }] = useLazyQuery(READYSCHEDULEDMEETINGS, { fetchPolicy: 'network-only' });
    const search = Form.useWatch("search", form);

    const selleradminsechedulingData = data?.getMeetingsReadyForScheduling?.map((meeting) => {
        const buyerName = meeting.requestedTo?.name || '';
        const maskedName =
            buyerName.length > 3
                ? buyerName.substring(0, 3) + '*'.repeat(10)
                : buyerName + '*'.repeat(10 - buyerName.length);

        return {
            key: meeting.id,
        title: meeting.business?.businessTitle,
        buyername: maskedName,
        businessprice: meeting.business?.price,
        offerprice: meeting.offer?.price,
        prefereddatetime: new Date(meeting.receiverAvailabilityDate).toLocaleString(),
        };
    }) || [];

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Buyer Name', dataIndex: 'buyername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Prefered Date & Time', dataIndex: 'prefereddatetime' },
    ];

    useEffect(() => {
        fetchMeetings({ variables: { search: search || "", isBuyer } });
    }, [search]);

    return (
         <Form form={form}>
        <Row gutter={[24,12]} className='mt-2'>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
            <Form.Item name="search" noStyle>
                <SearchInput
                    placeholder="Search"
                    value={form.getFieldValue('name') || ''}
                    prefix={<img src="/assets/icons/search.png" alt='search-icon' className='mx-3-inline' width={12} fetchPriority="high" />}
                    onChange={(e) => form.setFieldValue("search", e.target.value)}
                />
                </Form.Item>
            </Col>
            <Col span={24}>
                <Table
                    size="large"
                    columns={columns}
                    dataSource={selleradminsechedulingData}
                    className="pagination table table-cs"
                    showSorterTooltip={false}
                    scroll={{ x: 800 }}
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

export {SellerAdminSchedulingTable}