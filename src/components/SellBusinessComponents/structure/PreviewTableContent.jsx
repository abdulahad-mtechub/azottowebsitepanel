import { Card, Col, Flex, Row, Table, Typography } from 'antd'

const { Title } = Typography
const PreviewTableContent = ({title,columns,data}) => {
    return (
            <Row gutter={[24,12]}>
                <Col span={24}>
                    <Title level={5} className='m-0'>
                        {title}
                    </Title>
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={data}
                        className="pagination table"
                        showSorterTooltip={false}
                        scroll={{ x: 500 }}
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

export {PreviewTableContent}