import { Button, Col, Dropdown, Flex, Form, Row, Table, Tooltip, Typography } from 'antd'
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { DeleteModal } from '../../ui';
import { DownOutlined } from '@ant-design/icons';
import { SearchInput } from '../../Forms';
import { CounterOffer, ScheduleMeeting } from '../modal';
import { useQuery } from '@apollo/client';
import { GET_BUSINESS_OFFERS } from '../../../graphql/query/offer';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { RequestMeetingModal } from '../../Businesslistingcomponents';

const {Text} =Typography
const SellerOfferTable = ({ data }) => {
    const { t } = useTranslation();
    const userId = Cookies.get("userId");
    const [form] = Form.useForm();
    const [offermodal, setOfferModal] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [meeting, setMeeting] = useState(false);
    const [filterstatus, setFilterStatus] = useState();
    const [filtertype, setFilterType] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);

    const { data: offers } = useQuery(GET_BUSINESS_OFFERS, {
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
                } else {
                    return <Text className="fs-12 badge-cs fw-500">{status}</Text>;
                }
            },
        },
        { title: t('Offer Date'), dataIndex: 'createdAt' },
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

    const items = [
        { key: '1', label: t('Received') },
        { key: '2', label: t('Send') },
        { key: '3', label: t('Rejected') }
    ];

    const offertype = [
        { key: '1', label: t('Counter Offer') },
        { key: '2', label: t('Proceed to Purchase') },
    ];

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
                            placeholder={t("Search")}
                            value={form.getFieldValue('name') || ''}
                            prefix={<img src="/assets/icons/search.png" alt={t('search-icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
                        />
                        <Dropdown menu={{ items, handleStatusClick }} trigger={['click']}>
                            <Button aria-labelledby={t('Status filter')} className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
                                <Flex justify='space-between' className='w-100' gap={10}>
                                    {filterstatus === '1' ? t('Received') : filterstatus === '2' ? t('Send') : filterstatus === '3' ? t('Rejected') : t('Status')}
                                    <DownOutlined />
                                </Flex>
                            </Button>
                        </Dropdown>
                        <Dropdown menu={{ items: offertype, onClick: handleTypeClick }} trigger={['click']}>
                            <Button aria-labelledby={t('Offer type')} className='border-light-gray radius-8 pad-filter fs-13 h-auto'>
                                <Flex justify='space-between' className='w-100' gap={10}>
                                    {filtertype === '1' ? t('Counter Offer') : filtertype === '2' ? t('Proceed to Purchase') : t('Offer Type')}
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
                onClose={() => setDeleteModal(false)}
                type='danger'
                title={t('Are you sure?')}
                subtitle={t('This action cannot be undone. Are you sure you want to reject this offer?')}
            />
            <RequestMeetingModal
                businessId={selectedBusinessId}
                offerId={selectedOfferId}
                visible={endaVisible}
                onClose={()=>{setEndaVisible(false)}}
                refetch={() => {
                    // Refetch offers after modal closes
                }}
            />
        </>
    );
};

export { SellerOfferTable };