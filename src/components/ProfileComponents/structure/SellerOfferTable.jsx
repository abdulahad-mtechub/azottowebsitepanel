import { Button, Col, Dropdown, Flex, Row, Table, Tooltip, Typography } from 'antd'
import { useState, useMemo } from 'react';
import { DeleteModal } from '../../ui';
import { SearchInput, MySelect } from '../../Forms';
import { CounterOffer, ScheduleMeeting } from '../modal';
import { useQuery } from '@apollo/client';
import { GET_BUSINESS_OFFERS } from '../../../graphql/query/offer';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { RequestMeetingModal } from '../../Businesslistingcomponents';
import moment from 'moment';

const {Text} =Typography
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

    const { data: offers, refetch } = useQuery(GET_BUSINESS_OFFERS, {
        variables: { 
            getOfferByBusinessIdId: data?.id,
            limit: null,
            offset: null,
            search: null,
            status: null
        },
        fetchPolicy: 'network-only',
    });
    const [endaVisible, setEndaVisible] = useState(false);

    const handleAcceptOffer = async (offerId, businessId) => {
        setSelectedOfferId(offerId);
        setSelectedBusinessId(businessId);
        setEndaVisible(true);
    };

    const offerdata = offers?.getOfferByBusinessId?.offers;

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
                if (row?.createdBy === userId) return null;

                const isChild = row?.isProceedToPay ? true : false;

                const items = [
                    !isChild && { key: '0', label: t('Accept Offer'), onClick: () => handleAcceptOffer(row.id, row.business?.id) },
                    !isChild && { key: '1', label: t('Reject Offer'), onClick: () => { setDeleteModal(true); setSelectedOfferId(row.id); } },
                    !isChild && { key: '2', label: t('Counter Offer'), onClick: () => { setOfferModal(true); setSelectedOfferId(row.id); } },
                    !isChild && { key: '3', label: t('Request For Virtual Meeting'), onClick: () => { setMeeting(true); setSelectedOfferId(row.id); setSelectedBusinessId(row.business.id); } },
                    isChild && { key: '4', label: t('Accept Offer'), onClick: () => { setSelectedOfferId(row.id); handleAcceptOffer(); setSelectedBusinessId(row.business.id); } },
                    isChild && { key: '5', label: t('Reject Offer'), onClick: () => { setDeleteModal(true); setSelectedOfferId(row.id); } },
                ].filter(Boolean);

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button aria-labelledby={t("dropdown icon")} className="bg-transparent border-0 p-0">
                            <img src="/assets/icons/dots.png" alt={t("dropdown-icon")} width={16} fetchPriority="high" />
                        </Button>
                    </Dropdown>
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

    // Filter offers based on status, type, and search
    const filteredOffers = useMemo(() => {
        if (!offerdata) return [];
        
        return offerdata.filter(offer => {
            if (filterstatus && filterstatus !== 'all') {
                if (filterstatus === 'received' && offer.createdBy === userId) return false;
                if (filterstatus === 'send' && offer.createdBy !== userId) return false;
                if (filterstatus === 'rejected' && offer.status !== 'REJECTED') return false;
                if (filterstatus === 'approved' && offer.status !== 'APPROVED') return false;
                if (filterstatus === 'accepted' && offer.status !== 'ACCEPTED') return false;
            }

            if (filtertype && filtertype !== 'all') {
                if (filtertype === 'counter' && offer.isProceedToPay) return false;
                if (filtertype === 'proceed' && !offer.isProceedToPay) return false;
            }

            if (searchText) {
                const searchLower = searchText.toLowerCase();
                const buyerName = offer?.buyer?.name?.toLowerCase() || '';
                const price = offer?.price?.toString() || '';
                
                return buyerName.includes(searchLower) || price.includes(searchLower);
            }

            return true;
        });
    }, [offerdata, filterstatus, filtertype, searchText, userId]);

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
                        />
                        <MySelect
                            withoutForm
                            value={filterstatus || 'all'}
                            options={statusOptions}
                            placeholder={t('Status')}
                            onChange={(value) => setFilterStatus(value)}
                            showKey
                            style={{ minWidth: '150px' }}
                            className='border-light-gray radius-8'
                        />
                        <MySelect
                            withoutForm
                            value={filtertype || 'all'}
                            options={offerTypeOptions}
                            placeholder={t('Offer Type')}
                            onChange={(value) => setFilterType(value)}
                            showKey
                            style={{ minWidth: '150px' }}
                            className='border-light-gray radius-8'
                        />
                    </Flex>
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={filteredOffers}
                        className="pagination table table-cs"
                        showSorterTooltip={false}
                        scroll={{ x: 1300 }}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => t(`Total ${total} offers`),
                        }}
                    />
                </Col>
            </Row>
            <CounterOffer
                visible={offermodal}
                selectedOfferId={selectedOfferId}
                onClose={() => setOfferModal(false)}
                title={t('Counter Offer to Buyer')}
            />
            <ScheduleMeeting
                visible={meeting}
                onClose={() => setMeeting(false)}
                offerId={selectedOfferId}
                businessId={selectedBusinessId}
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