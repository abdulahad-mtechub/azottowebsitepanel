import { Col, Form, Row, Table } from 'antd'
import { scheduledData } from '../../../data';
import { SearchInput } from '../../Forms';
import { NavLink } from 'react-router-dom';

const ScheduledMeetingTable = () => {
    const [form] = Form.useForm()

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Schedule Date & Time', dataIndex: 'scheduledatetime' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        {
            title: 'Meeting Link',
            dataIndex: 'meetinglink',
            render: (text, record) => (
                <NavLink>{text}</NavLink>
            )
        }
    ];


    return (
        <>
        <Row gutter={[24, 12]} className='mt-2'>
            <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
                <SearchInput
                    placeholder="Search"
                    value={form.getFieldValue('name') || ''}
                    prefix={<img src="/assets/icons/search.png" alt='search-icon' style={{ marginInline: 3 }} width={12} fetchpriority="high" />}
                />
            </Col>
            <Col span={24}>
                <Table
                    size="large"
                    columns={columns}
                    dataSource={scheduledData}
                    className="pagination table table-cs"
                    showSorterTooltip={false}
                    scroll={{ x: 1000 }}
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

export { ScheduledMeetingTable }