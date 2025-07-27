import { Button, Card, Col, Dropdown, Flex, Form, Row, Table, Typography } from 'antd'
import { allbussinesData } from '../../../data';
import { NavLink } from 'react-router-dom';
import { OfferSellerModal, RequestMeetingModal } from '../../Businesslistingcomponents';
import { useState } from 'react';
import { DeleteModal } from '../../ui';
import { DownOutlined } from '@ant-design/icons';
import { SearchInput } from '../../Forms';
import { ScheduleMeeting } from '../modal';

const { Text } = Typography
const SellerOfferTable = () => {

    const [form] = Form.useForm()
    const [offermodal, setOfferModal] = useState(false)
    const [deletemodal, setDeleteModal] = useState(false)
    const [meeting, setMeeting] = useState(false)
    const [filterstatus, setFilterStatus] = useState()

    const offerdata = allbussinesData[0]?.offerData;

    const columns = [
        { title: 'Buyer Name', dataIndex: 'buyername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        {
            title: 'Offer Price',
            dataIndex: 'offerprice',
            render: (offer) => {
                const badgeColor = offer.type === 'CO' ? '#2f54eb' : '#faad14'; // blue for CO, gold for PP
                const badgeText = offer.type;

                return (
                    <div>
                        SAR {parseInt(offer.amount).toLocaleString()}
                        <span style={{
                            marginLeft: 8,
                            backgroundColor: badgeColor,
                            color: '#fff',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500
                        }}>
                            {badgeText}
                        </span>
                    </div>
                );
            }
        },
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
                    { label: <NavLink>Accept Offer</NavLink>, key: 0 },
                    { label: <NavLink onClick={() => setDeleteModal(true)}>Reject Offer</NavLink>, key: 1 },
                    { label: <NavLink onClick={() => setOfferModal(true)}>Counter Offer</NavLink>, key: 2 },
                    { label: <NavLink onClick={() => setMeeting(false)}>Request For Virtual Meeting</NavLink>, key: 3 },
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
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Flex gap={5} align='center'>
                        <SearchInput
                            placeholder="Search"
                            value={form.getFieldValue('name') || ''}
                            prefix={<img src="/assets/icons/search.png" style={{ marginInline: 3 }} width={12} />}
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
                        dataSource={offerdata}
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
            <OfferSellerModal
                visible={offermodal}
                onClose={() => setOfferModal(false)}
            />
            <ScheduleMeeting visible={meeting} onClose={() => setMeeting(false)} />
            <DeleteModal
                visible={deletemodal}
                onClose={() => setDeleteModal(false)}
                type='danger'
                title='Are you sure?'
                subtitle='This action cannot be undone. Are you sure you want to reject this offer?'
            />
        </>
    )
}

export { SellerOfferTable }