import { Button, Col, Dropdown, Flex, Row, Table, Tooltip, Typography, Alert } from 'antd'
import { useState, useMemo } from 'react';
import { DeleteModal } from '../../ui';
import { SearchInput, MySelect } from '../../Forms';
import { CounterOffer, ScheduleMeeting } from '../modal';
import { useQuery } from '@apollo/client';
import { GET_BUSINESS_OFFERS } from '../../../graphql/query/offer';
import { CHECKMEETINGEXISTS } from '../../../graphql/query/meeting';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { RequestMeetingModal } from '../../Businesslistingcomponents';
import moment from 'moment';

const {Text} =Typography

// Component to check meeting existence for each offer row
const OfferActionDropdown = ({ row, t, handleAcceptOffer, setDeleteModal, setOfferModal, setMeeting, setSelectedOfferId, setSelectedBusinessId, userId, setMeetingRefetch }) => {
    const { data: meetingExistsData, refetch: refetchMeetingExists } = useQuery(CHECKMEETINGEXISTS, {
        variables: { 
            businessId: row?.business?.id,
            buyerId: userId
        },
        skip: !row?.business?.id || !userId,
        fetchPolicy: 'network-only',
    });

    const meetingExists = meetingExistsData?.checkMeetingExists || false;
    const isChild = row?.isProceedToPay ? true : false;

    const items = [
        !isChild && { key: '0', label: t('Accept Offer'), onClick: () => handleAcceptOffer(row?.id, row?.business?.id) },
        !isChild && { key: '1', label: t('Reject Offer'), onClick: () => { setDeleteModal(true); setSelectedOfferId(row.id); } },
        !isChild && { key: '2', label: t('Counter Offer'), onClick: () => { setOfferModal(true); setSelectedOfferId(row.id); } },
        !isChild && { 
            key: '3', 
            label: t('Request For Virtual Meeting'), 
            disabled: meetingExists,
            onClick: () => { 
                if (!meetingExists) {
                    setMeeting(true); 
                    setSelectedOfferId(row.id); 
                    setSelectedBusinessId(row.business.id);
                    setMeetingRefetch(() => refetchMeetingExists);
                }
            } 
        },
        isChild && { key: '4', label: t('Accept Offer'), onClick: () => {handleAcceptOffer(row?.id, row?.business?.id) } },
        isChild && { key: '5', label: t('Reject Offer'), onClick: () => { setDeleteModal(true); setSelectedOfferId(row.id); } },
    ].filter(Boolean);

    return (
        <Dropdown menu={{ items }} trigger={['click']}>
            <Button aria-labelledby={t("dropdown icon")} className="bg-transparent border-0 p-0">
                <img src="/assets/icons/dots.png" alt={t("dropdown-icon")} width={16} fetchPriority="high" />
            </Button>
        </Dropdown>
    );
};

const SellerOfferTable = ({ data }) => {
    
    const { t } = useTranslation();
    const userId = Cookies.get("userId");
    const [offermodal, setOfferModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [meeting, setMeeting] = useState(false);
    const [filterstatus, setFilterStatus] = useState(null);
    const [filtertype, setFilterType] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);
    const [endaVisible, setEndaVisible] = useState(false);
    const [meetingRefetch, setMeetingRefetch] = useState(null);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const { data: offers, refetch, loading } = useQuery(GET_BUSINESS_OFFERS, {
        variables: { 
            getOfferByBusinessIdId: data?.id,
            limit: pagination.pageSize,
            offSet: pagination.current - 1,
            search: searchText || null,
            status: null
        },
        fetchPolicy: 'network-only',
        skip: !data?.id,
    });
    const handleAcceptOffer = (offerId, businessId) => {
        console.log('Accepting offer:', offerId, 'for business:', businessId);
        setSelectedOfferId(offerId);
        setSelectedBusinessId(businessId);
        setEndaVisible(true);
    };

    const offerdata = useMemo(() => offers?.getOfferByBusinessId?.offers || [], [offers]);
    const totalCount = offers?.getOfferByBusinessId?.count || 0;
    const isBusinessInactive = data?.businessStatus === 'INACTIVE';

    const columns = [
        { title: t('Buyer Name'), dataIndex: ["buyer", "name"] },
        { title: t('Business Price'), dataIndex: ["business", "price"] },
        {
            title: t('Offer Price'),
            dataIndex: 'price',
            render: (row, record) => (
                <Flex gap={10} align="center">
                    <img src="/assets/icons/reyal-b.png" width={12} alt={t("currency-symbol")} fetchPriority="high" /> {row}
                    {record?.isProceedToPay ? (
                        <Tooltip title={t("PP - Proceed to Purchase")}>
                            <Text className='bg-brand radius-4 p-1 fs-11 text-white'>PP</Text>
                        </Tooltip>
                    ) : (
                        <Tooltip title={t("CO - Counter Offer")}>
                            <Text className='bg-orange bg radius-4 p-1 fs-11 text-white'>CO</Text>
                        </Tooltip>
                    )}
                </Flex>
            )
        },
        {
            title: t('Status'),
            dataIndex: 'status',
            render: (status, record) => {
                if (status === 'PENDING') {
                    return <Text className="sendstatus fs-12 badge-cs fw-500">{record?.createdBy === userId ? t('Send') : t('Received')}</Text>;
                } else if (status === 'REJECTED') {
                    return <Text className="inactive fs-12 badge-cs fw-500">{t('Rejected')}</Text>;
                } else if (status === 'APPROVED') {
                    return <Text className="received fs-12 badge-cs fw-500">{t('Approved')}</Text>;
                } else if (status === 'ACCEPTED') {
                    return <Text className="received fs-12 badge-cs fw-500">{t('Accepted')}</Text>;
                } else {
                    return <Text className="fs-12 badge-cs fw-500">{status}</Text>;
                }
            },
        },
        { 
            title: t('Offer Date'), 
            dataIndex: 'createdAt',  
            render: (createdAt) => moment(createdAt).format('DD-MM-YYYY'),
        },
        {
            title: t('Action'),
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (_, row) => {
                // Hide action button if user is the creator (sent offers)
                if (row?.createdBy === userId) return null;
                // Hide action button if status is ACCEPTED or REJECTED
                if (row?.status === 'ACCEPTED' || row?.status === 'REJECTED') return null;

                return (
                    <OfferActionDropdown 
                        row={row}
                        t={t}
                        handleAcceptOffer={handleAcceptOffer}
                        setDeleteModal={setDeleteModal}
                        setOfferModal={setOfferModal}
                        setMeeting={setMeeting}
                        setSelectedOfferId={setSelectedOfferId}
                        setSelectedBusinessId={setSelectedBusinessId}
                        userId={userId}
                        setMeetingRefetch={setMeetingRefetch}
                    />
                );
            },
        }
    ];

    const statusOptions = [
        { id: 'received', name: t('Received') },
        { id: 'send', name: t('Send') },
        { id: 'rejected', name: t('Rejected') },
    ];

    const offerTypeOptions = [
        { id: 'counter', name: t('Counter Offer') },
        { id: 'proceed', name: t('Proceed to Purchase') },
    ];

    // Filter offers based on status and type (client-side filtering)
    const filteredOffers = useMemo(() => {
        if (!offerdata || offerdata.length === 0) return [];
        
        return offerdata.filter(offer => {
            // Status filter
            if (filterstatus) {
                if (filterstatus === 'received' && offer.createdBy === userId) return false;
                if (filterstatus === 'send' && offer.createdBy !== userId) return false;
                if (filterstatus === 'rejected' && offer.status !== 'REJECTED') return false;
                if (filterstatus === 'approved' && offer.status !== 'APPROVED') return false;
                if (filterstatus === 'accepted' && offer.status !== 'ACCEPTED') return false;
            }

            // Type filter
            if (filtertype) {
                if (filtertype === 'counter' && offer.isProceedToPay) return false;
                if (filtertype === 'proceed' && !offer.isProceedToPay) return false;
            }

            return true;
        });
    }, [offerdata, filterstatus, filtertype, userId]);

    const handleTableChange = (paginationConfig) => {
        setPagination({
            current: paginationConfig.current,
            pageSize: paginationConfig.pageSize,
        });
    };

    return (
        <>
            <Row gutter={[24, 24]}>
                <Col span={24}>
                    <Flex gap={5} align='center' wrap>
                        <SearchInput
                            placeholder={t("Search by buyer name or price")}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            prefix={<img src="/assets/icons/search.png" alt={t('search-icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
                            style={{ minWidth: '250px' }}
                            disabled={isBusinessInactive}
                        />
                        
                        <MySelect
                            withoutForm
                            value={filterstatus}
                            options={statusOptions}
                            placeholder={t('Status')}
                            onChange={(value) => setFilterStatus(value)}
                            showKey
                            style={{ minWidth: '150px' }}
                            className='border-light-gray radius-8'
                            disabled={isBusinessInactive}
                        />
                        <MySelect
                            withoutForm
                            value={filtertype}
                            options={offerTypeOptions}
                            placeholder={t('Offer Type')}
                            onChange={(value) => setFilterType(value)}
                            showKey
                            style={{ minWidth: '180px' }}
                            className='border-light-gray radius-8'
                            disabled={isBusinessInactive}
                        />
                    </Flex>
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={isBusinessInactive ? [] : filteredOffers}
                        className="pagination table table-cs"
                        hideOnSinglePage={true}
                        showSorterTooltip={false}
                        scroll={{ x: 1300 }}
                        loading={loading}
                        onChange={handleTableChange}
                        pagination={{
                            hideOnSinglePage: true,
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: isBusinessInactive ? 0 : totalCount,
                            showSizeChanger: true,
                            showTotal: (total) => t(`Total ${total} offers`),
                            pageSizeOptions: ['10', '20', '50', '100'],
                        }}
                        locale={{
                            emptyText: isBusinessInactive 
                                ? t('Business is inactive. Please activate your business to view and manage offers.')
                                : t('No offers available')
                        }}
                    />
                </Col>
            </Row>
            <CounterOffer
                visible={offermodal}
                selectedOfferId={selectedOfferId}
                onClose={() => setOfferModal(false)}
                title={t('Counter Offer to Buyer')}
                refetch={refetch}
            />
            <ScheduleMeeting
                visible={meeting}
                onClose={() => setMeeting(false)}
                offerId={selectedOfferId}
                businessId={selectedBusinessId}
                refetchMeetings={() => {
                    refetch();
                    if (meetingRefetch) {
                        meetingRefetch();
                    }
                }}
            />
            <DeleteModal
                visible={deletemodal}
                offerId={selectedOfferId}
                onClose={() => setDeleteModal(false)}
                type='danger'
                title={t('Are you sure?')}
                subtitle={t('This action cannot be undone. Are you sure you want to reject this offer?')}
                refetch={refetch}
            />
            <RequestMeetingModal
                businessId={selectedBusinessId}
                offerId={selectedOfferId}
                visible={endaVisible}
                onClose={()=>{setEndaVisible(false)}}
                refetch={refetch}
            />
        </>
    );
};

export { SellerOfferTable };