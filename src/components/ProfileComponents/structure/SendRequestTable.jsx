import { Col, Form, Row, Table } from 'antd'
import { offerData } from '../../../data';
import { SearchInput } from '../../Forms';

const SendRequestTable = () => {

    const [form] = Form.useForm()

    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        { title: 'Requested Date', dataIndex: 'date' },
    ];


    return (
        <Row gutter={[24,12]} className='mt-2'>
            <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                <SearchInput
                    placeholder="Search"
                    value={form.getFieldValue('name') || ''}
                    prefix={<img src="/assets/icons/search.png" alt='search-icon' style={{marginInline: 3}} width={12}  fetchPriority="high"/>}
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
    )
}

export {SendRequestTable}