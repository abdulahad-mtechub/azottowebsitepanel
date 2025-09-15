import { Col, Form, Row, Table } from 'antd'
import { adminsechedulingData } from '../../../data';
import { SearchInput } from '../../Forms';

const AdminSchedulingTable = () => {

    const [form] = Form.useForm()

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Prefered Date & Time', dataIndex: 'prefereddatetime' },
    ];


    return (
        <Row gutter={[24,12]} className='mt-2'>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                <SearchInput
                    placeholder="Search"
                    value={form.getFieldValue('name') || ''}
                    prefix={<img src="/assets/icons/search.png" style={{marginInline: 3}} width={12} alt='search-icon' fetchPriority="high" />}
                />
            </Col>
            <Col span={24}>
                <Table
                    size="large"
                    columns={columns}
                    dataSource={adminsechedulingData}
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
    )
}

export {AdminSchedulingTable}