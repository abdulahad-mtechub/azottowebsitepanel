import { Button, Card, Col, Dropdown, Flex, Form, Row, Table, Tooltip, Typography } from 'antd'
import { allbussinesData } from '../../../data';
import { NavLink } from 'react-router-dom';
import { OfferSellerModal, RequestMeetingModal } from '../../Businesslistingcomponents';
import { useState } from 'react';
import { DeleteModal } from '../../ui';
import { DownOutlined } from '@ant-design/icons';
import { SearchInput } from '../../Forms';
import { CounterOffer, ScheduleMeeting } from '../modal';

const { Text } = Typography
const SellerOfferTable = () => {

    const [form] = Form.useForm()
    const [offermodal, setOfferModal] = useState(false)
    const [deletemodal, setDeleteModal] = useState(false)
    const [meeting, setMeeting] = useState(false)
    const [filterstatus, setFilterStatus] = useState()
    const [filtertype, setFilterType] = useState(null)

    const offerdata = allbussinesData[0]?.offerData;

    const columns = [
        { title: 'Buyer Name', dataIndex: 'buyername' },
        { title: 'Business Price', dataIndex: 'businessprice' },
        {
            title: 'Offer Price',
            dataIndex: 'offerprice',
            render: (offer) => {
                return (
                    <Flex gap={10} align="center">
                        SAR {parseInt(offer.amount).toLocaleString()}
                        {
                            offer?.type === 'CO' ?
                                <Tooltip title="CO - Counteroffer">
                                    <Text className='bg-brand radius-4 p-1 fs-11 text-white'>CO</Text>
                                </Tooltip>
                            :
                                <Tooltip title="PP - Proceed to Purchase">
                                    <Text className='bg-orange bg radius-4 p-1 fs-11 text-white'>PP</Text>
                                </Tooltip>
                        } 
                    </Flex>
                );
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            render: (status) => {
                if (status === 'Received') {
                    return <Text className='received fs-12 badge-cs fw-500'>{status}</Text>;
                } else if (status === 'Rejected') {
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
            render: (_, row) => {
                const offerType = row?.offerprice?.type;
                const items = [
                    // Counter Offer case
                    offerType === 'CO' && { label: <NavLink onClick={() => {}}>Accept Offer</NavLink>, key: 0 },
                    offerType === 'CO' && { label: <NavLink onClick={() => setDeleteModal(true)}>Reject Offer</NavLink>, key: 1 },
                    offerType === 'CO' && { label: <NavLink onClick={() => setOfferModal(true)}>Counter Offer</NavLink>, key: 2 },
                    offerType === 'CO' && { label: <NavLink onClick={() => setMeeting(true)}>Request For Virtual Meeting</NavLink>, key: 3 },

                    // Proceed to Purchase case
                    offerType === 'PP' && { label: <NavLink onClick={() => {}}>Accept Offer</NavLink>, key: 4 },
                    offerType === 'PP' && { label: <NavLink onClick={() => setDeleteModal(true)}>Reject Offer</NavLink>, key: 5 },
                ].filter(Boolean);

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button className="bg-transparent border-0 p-0">
                            <img src="/assets/icons/dots.png" alt="" width={16} />
                        </Button>
                    </Dropdown>
                );
            },
        }

    ];

    const items = [
        { key: '1', label: 'Received' },
        { key: '2', label: 'Send' },
        { key: '3', label: 'Rejected' }
    ]

    const offertype = [
        { key: '1', label: 'Counter Offer' },
        { key: '2', label: 'Proceed to Purchase' },
    ]

    const handleStatusClick = ({ key }) => {
        setFilterStatus(key)
    }

    const handleTypeClick = ({ key }) => {
        setFilterType(key)
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
                                handleStatusClick
                            }}
                            trigger={['click']}
                        >
                            <Button className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
                                <Flex justify='space-between' className='w-100' gap={10}>
                                    {
                                        filterstatus === '1' ? 'Received' :
                                        filterstatus === '2' ? 'Send' :
                                        filterstatus === '3' ? 'Rejected' : 'Status'
                                    }
                                    <DownOutlined />
                                </Flex>
                            </Button>
                        </Dropdown>
                        <Dropdown
                            menu={{
                                items: offertype, onClick: handleTypeClick 
                            }}
                            trigger={['click']}
                        >
                            <Button className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
                                <Flex justify='space-between' className='w-100' gap={10}>
                                    {
                                        filtertype === '1' ? 'Counter Offer' :
                                        filtertype === '2' ? 'Proceed to Purchase' : 'Offer Type'
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
            <CounterOffer
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