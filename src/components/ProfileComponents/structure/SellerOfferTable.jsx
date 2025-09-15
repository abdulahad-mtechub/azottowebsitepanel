import { Button, Col, Dropdown, Flex, Form, Row, Table, Tooltip, Typography,message } from 'antd'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { DeleteModal } from '../../ui';
import { DownOutlined } from '@ant-design/icons';
import { SearchInput } from '../../Forms';
import { CounterOffer, ScheduleMeeting } from '../modal';
import { useQuery,useMutation } from '@apollo/client';
import { GET_BUSINESS_OFFERS } from '../../../graphql/query/offer';
import { UPDATE_OFFER } from '../../../graphql/mutation/mutations';
import Cookies from "js-cookie";

const { Text } = Typography
const SellerOfferTable = ({data}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const userId = Cookies.get("userId"); 
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10); // default limit
    const offset = (currentPage - 1) * limit;
    const [form] = Form.useForm()
    const [offermodal, setOfferModal] = useState(false)
    const [deletemodal, setDeleteModal] = useState(false)
    const [meeting, setMeeting] = useState(false)
    const [filterstatus, setFilterStatus] = useState()
    const [filtertype, setFilterType] = useState(null)
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);

    const { data:offers, loading:businessLoading, error:businessError } = useQuery(GET_BUSINESS_OFFERS, {
        variables: { 
            getOfferByBusinessIdId: data?.id,
            limit: null,
            offset: null,
            search: null,
            status: null
        },
    });

    const [updateOfferStatus] = useMutation(UPDATE_OFFER);
    const handleAcceptOffer = async () => {
        try {
          await updateOfferStatus({
            variables: { input:{
                id:selectedOfferId,
                status: "ACCEPTED" 
            }},
          });
          messageApi.info(`offer accepted`)
          setMeeting(true)
        } catch (err) {
          console.error("Error accepting offer:", err);
        }
    };

    const offerdata = offers?.getOfferByBusinessId?.offers
    const total = offers?.getOfferByBusinessId?.count
    const columns = [
        { title: "Buyer Name", dataIndex: ["buyer", "name"] },
        { title: "Business Price", dataIndex: ["business", "price"] },
        {
            title: 'Offer Price',
            dataIndex: 'price',
            render: (row,record) => {
                return (
                    <Flex gap={10} align="center">
                        <img src="/assets/icons/reyal-b.png" width={12} alt="currency-symbol" fetchPriority="high" /> {row}
                        {// here if offerdata?.parentOffer?.id then it will be child offer else parent offer
                            record?.isProceedToPay ?
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
            render: (status, record) => {
                if (status === 'PENDING') {
                  if (record?.createdBy === userId) {
                    return (
                      <Text className="sendstatus fs-12 badge-cs fw-500">Send</Text>
                    );
                  } else {
                    return (
                      <Text className="sendstatus fs-12 badge-cs fw-500">Received</Text>
                    );
                  }
                } else if (status === 'REJECTED') {
                  return (
                    <Text className="inactive fs-12 badge-cs fw-500">Rejected</Text>
                  );
                } else if (status === 'APPROVED') {
                  return (
                    <Text className="received fs-12 badge-cs fw-500">Approved</Text>
                  );
                } else {
                  return (
                    <Text className="fs-12 badge-cs fw-500">{status}</Text>
                  ); // fallback in case of new status values
                }
            },
        },
        { title: 'Offer Date', dataIndex: 'createdAt' },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, row) => {
                if (row?.createdBy === userId) {
                    return null;
                }
                const isChild = row?.isProceedToPay ? true : false;
                const items = [
                    // Counter Offer case if isChild ture
                    isChild && { label: <NavLink onClick={() => {
                        setSelectedOfferId(row.id)
                        handleAcceptOffer()
                        setSelectedBusinessId(row.business.id)
                    }}>Accept Offer</NavLink>, key: 0 },
                    isChild && { label: <NavLink onClick={() =>{ 
                        setDeleteModal(true)
                        setSelectedOfferId(row.id)
                    }}>Reject Offer</NavLink>, key: 1 },
                    isChild && { label: <NavLink onClick={() => {
                        setOfferModal(true)
                        setSelectedOfferId(row.id)
                    }}>Counter Offer</NavLink>, key: 2 },
                    isChild && { label: <NavLink onClick={() => {
                        setMeeting(true)
                        setSelectedOfferId(row.id)
                    }}>Request For Virtual Meeting</NavLink>, key: 3 },

                    // Proceed to Purchase case if isChild false
                    !isChild && { label: <NavLink onClick={() => {
                        setSelectedOfferId(row.id)
                        handleAcceptOffer()
                        setSelectedBusinessId(row.business.id)
                    }}>Accept Offer</NavLink>, key: 4 },
                    !isChild && { label: <NavLink onClick={() =>{
                         setDeleteModal(true)
                         setSelectedOfferId(row.id)
                        } }> Reject Offer </NavLink>, key: 5 },
                ].filter(Boolean);

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button aria-labelledby='dropdown icon' className="bg-transparent border-0 p-0">
                            <img src="/assets/icons/dots.png" alt="dropdown-icon" width={16} fetchPriority="high" />
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
        {contextHolder}
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Flex gap={5} align='center'>
                        <SearchInput
                            placeholder="Search"
                            value={form.getFieldValue('name') || ''}
                            prefix={<img src="/assets/icons/search.png" alt='search-icon' style={{ marginInline: 3 }} width={12} fetchPriority="high" />}
                        />
                        <Dropdown
                            menu={{
                                items,
                                handleStatusClick
                            }}
                            trigger={['click']}
                        >
                            <Button aria-labelledby='Status filter' className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
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
                            <Button aria-labelledby='Offer type' className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
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
                selectedOfferId={selectedOfferId}
                onClose={() => setOfferModal(false)}
                title='Counter Offer to Buyer'
            />
            <ScheduleMeeting 
                visible={meeting} 
                onClose={() => setMeeting(false)} 
                offerId={selectedOfferId}
                businessId={selectedBusinessId}
            />
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