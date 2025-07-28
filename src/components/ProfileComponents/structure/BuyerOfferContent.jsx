import { Button, Card, Col, Dropdown, Flex, Form, Row, Table, Typography } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { offerData } from '../../../data';
import { NavLink } from 'react-router-dom';
import { OfferSellerModal, RequestMeetingModal } from '../../Businesslistingcomponents';
import { useState } from 'react';
import { DeleteModal } from '../../ui';
import { MySelect, SearchInput } from '../../Forms';
import { DownOutlined } from '@ant-design/icons';

const { Text } = Typography
const BuyerOfferContent = () => {

    const [form] = Form.useForm()
    const [ offermodal, setOfferModal ] = useState(false)
    const [ requestPop, setRequestPop ] = useState(false)
    const [ deletemodal, setDeleteModal ] = useState(false)
    const [ filterstatus, setFilterStatus] = useState()


    const columns = [
        { title: 'Business Title', dataIndex: 'title' },
        { title: 'Seller Name', dataIndex: 'sellername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        { title: 'Offer Price', dataIndex: 'offerprice' },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                if (status === 'Received') {
                    return <Text className='received fs-12 badge-cs fw-500'>{status}</Text>;
                } else if (status === 'Inactive') {
                    return <Text className='inactive fs-12 badge-cs fw-500'>{status}</Text>;
                } else {
                    return <Text className='sendstatus fs-12 badge-cs fw-500'>{status}</Text>
                }
            },
        },
        { title: 'Date', dataIndex: 'date' },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (record) => {
                const items = [
                    { label: <NavLink onClick={()=>setRequestPop(true)}>Accept Offer</NavLink>, key: 0 },
                    { label: <NavLink onClick={()=>setDeleteModal(true)}>Reject Offer</NavLink>, key: 1 },
                    { label: <NavLink onClick={()=>setOfferModal(true)}>Counter Offer</NavLink>, key: 2 },
                    { label: <NavLink onClick={()=>setRequestPop(true)}>Request For Virtual Meeting</NavLink>, key: 3 },
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

    const items = [
        { key: '1', label: 'Received' },
        { key: '2', label: 'Send' },
        { key: '3', label: 'Inactive' }
    ]

    const onClick = ({ key }) => {
        setFilterStatus(key)
    }

    return (
        <>
            <Flex vertical gap={20}>
                <ModuleTopHeading level={4} name={'Offer'} />
                <Card className='radius-12 border-gray'>
                    <Row gutter={[24,24]}>
                        <Col span={24}>
                            <Flex gap={5} align='center'>
                                <SearchInput
                                    placeholder="Search"
                                    value={form.getFieldValue('name') || ''}
                                    prefix={<img src="/assets/icons/search.png" style={{marginInline: 3}} width={12} />}
                                />
                                <Dropdown
                                    menu={{
                                        items,
                                        onClick
                                    }}
                                    trigger={['click']}
                                >
                                    <Button className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
                                        <Flex justify='space-between' className='w-100' gap={10}>
                                            {
                                                filterstatus === '1' ? 'Received' :
                                                filterstatus === '2' ? 'Send' :
                                                filterstatus === '3' ? 'Inactive' : 'Status'
                                            }
                                            <DownOutlined />
                                        </Flex>
                                    </Button>
                                </Dropdown>
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Table
                                size="large"
                                columns={columns}
                                dataSource={offerData}
                                className="pagination table table-cs"
                                showSorterTooltip={false}
                                scroll={{ x: 1300 }}
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
            </Flex>
            <OfferSellerModal 
                visible={offermodal}
                onClose={()=>setOfferModal(false)}
            />
            <RequestMeetingModal 
                visible={requestPop}
                onClose={()=>setRequestPop(false)}
            />
            <DeleteModal 
                visible={deletemodal}
                onClose={()=>setDeleteModal(false)}
                type='danger'
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to reject this offer?'
            />
        </>
    )
}

export {BuyerOfferContent}