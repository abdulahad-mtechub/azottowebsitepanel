import { Card, Col, Flex, Row, Table, Typography } from 'antd'

const { Title } = Typography
const PreviewTableContent = ({title,columns,data}) => {

    
    return (
        <Card className='shadow-d radius-12 border-gray mb-3'>
            <Row gutter={[24,24]}>
                <Col span={24}>
                    <Flex gap={4}>
                        <Title level={5} className='m-0'>
                            {title}
                        </Title>
                    </Flex>
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
        </Card>
    )
}

export {PreviewTableContent}