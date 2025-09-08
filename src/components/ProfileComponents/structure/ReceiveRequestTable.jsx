import { Button, Col, Dropdown, Form, Row, Table } from 'antd'
import { offerData } from '../../../data';
import { SearchInput } from '../../Forms';
import { NavLink } from 'react-router-dom';
import { ScheduleMeeting } from '../modal';
import { useState } from 'react';
import { DeleteModal } from '../../ui';

const ReceiveRequestTable = () => {

    const [form] = Form.useForm()
    const [ isaccept, setIsAccept ] = useState(false)
    const [ deletemodal, setDeleteModal ] = useState(false)

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Requested Date', dataIndex: 'date' },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (record) => {
                const items = [
                    { label: <NavLink onClick={()=>setIsAccept(true)}>Accept Offer</NavLink>, key: 0 },
                    { label: <NavLink onClick={()=>setDeleteModal(true)}>Reject Offer</NavLink>, key: 1 },
                ].filter(Boolean);
    
                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button className="bg-transparent border-0 p-0">
                            <img src="/assets/icons/dots.png"  alt="dropdown-icon" width={16} />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];


    return (
        <>    
            <Row gutter={[24,12]} className='mt-2'>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                    <SearchInput
                        placeholder="Search"
                        value={form.getFieldValue('name') || ''}
                        prefix={<img src="/assets/icons/search.png" alt='search-icon' style={{marginInline: 3}} width={12} />}
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
            />
            <DeleteModal 
                visible={deletemodal}
                onClose={()=>setDeleteModal(false)}
                type='danger'
                title='Are you sure?'
                subtitle='Rejecting this meeting request will remove it from your request list. Are you sure you want to proceed?'
            />
        </>
    )
}

export {ReceiveRequestTable}