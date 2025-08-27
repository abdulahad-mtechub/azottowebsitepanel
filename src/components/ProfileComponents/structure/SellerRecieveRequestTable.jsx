import { Button, Col, Dropdown, Form, Row, Table } from 'antd'
import { SearchInput } from '../../Forms';
import { NavLink } from 'react-router-dom';
import { ScheduleMeeting } from '../modal';
import { DeleteModal } from '../../ui';
import {RECEIVEDMEETINGS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import React,{useState,useEffect} from 'react'

const SellerRecieveRequestTable = () => {

    const [form] = Form.useForm()
    const [ isaccept, setIsAccept ] = useState(false)
    const [ deletemodal, setDeleteModal ] = useState(false)
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);

    const [fetchMeetings,{ data, loading }] = useLazyQuery(RECEIVEDMEETINGS);
    const search = Form.useWatch("search", form);

    const sellerrecievedrequestData =data?.getReceivedMeetingRequests?.map((meeting) => {
        const buyerName = meeting.requestedBy?.name || '';
        const maskedName =
            buyerName.length > 3
                ? buyerName.substring(0, 3) + '*'.repeat(10)
                : buyerName + '*'.repeat(10 - buyerName.length);

        return {
            key: meeting.id,
            title: meeting.business?.businessTitle,
            buyername:maskedName,
            businessprice: meeting.business?.price,
            offerprice: meeting.offer?.price,
            date: new Date(meeting.requestedDate).toLocaleString(),
            offerId: meeting.offer?.id,
            business:meeting.business
        };
    }) || [];

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Buyer Name', dataIndex: 'buyername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Requested Date', dataIndex: 'createdAt' },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (record) => {
                const items = [
                    { label: <NavLink 
                        onClick={() => {
                            setSelectedMeetingId(record.key); // 🔹 store meeeting
                            setSelectedBusinessId(record.business.id)
                            setSelectedOfferId(record.offerId); // 🔹 store offerId
                            setIsAccept(true);
                        }}
                        >Accept Offer</NavLink>, key: 0 },
                    { label: <NavLink onClick={()=>setDeleteModal(true)}>Reject Offer</NavLink>, key: 1 },
                ].filter(Boolean);
    
                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button className="bg-transparent border-0 p-0">
                            <img src="/assets/icons/dots.png" alt="" width={16} />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    useEffect(() => {
        fetchMeetings({ variables: { search: search || "" } });
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
                        onChange={(e) => form.setFieldValue("search", e.target.value)}
                    />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={sellerrecievedrequestData}
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
            <ScheduleMeeting 
                visible={isaccept}
                onClose={()=>setIsAccept(false)}
                meetingId={selectedMeetingId}
                offerId={selectedOfferId}
                refetchMeetings={() => fetchMeetings({ variables: { search: search || "" } })}
                businessId={selectedBusinessId}
            />
            <DeleteModal 
                meetingId={selectedMeetingId}
                visible={deletemodal}
                onClose={()=>setDeleteModal(false)}
                type='danger'
                title='Are you sure?'
                subtitle='Rejecting this meeting request will remove it from your request list. Are you sure you want to proceed?'
            />
        </Form>    
    )
}

export {SellerRecieveRequestTable}