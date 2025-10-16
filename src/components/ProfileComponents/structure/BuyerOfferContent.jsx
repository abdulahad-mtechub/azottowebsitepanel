import { Button, Card, Col, Dropdown, Flex, Row, Table, Typography, Tooltip } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { NavLink } from 'react-router-dom';
import { OfferSellerModal, RequestMeetingModal } from '../../Businesslistingcomponents';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { DeleteModal } from '../../ui';
import { SearchInput, MySelect } from '../../Forms';
import { GET_BUYER_OFFER } from '../../../graphql/query'
import { useLazyQuery } from '@apollo/client';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';

const { Text } = Typography
const BuyerOfferContent = () => {

    const { t } = useTranslation();
    const userId = Cookies.get("userId"); 
    const [offermodal, setOfferModal] = useState(false);
    const [requestPop, setRequestPop] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [filterstatus, setFilterStatus] = useState(null);
    const [filtertype, setFilterType] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [fetchOffers, { data, loading }] = useLazyQuery(GET_BUYER_OFFER, {
        fetchPolicy: 'network-only',
    });

    // Clean search text by removing extra spaces
    const cleanSearchText = useCallback((text) => {
        if (!text) return '';
        return text.trim().replace(/\s+/g, ' ');
    }, []);

    const handleSearchChange = useCallback((e) => {
        const rawValue = e?.target?.value || '';
        setSearchValue(rawValue);
        // Reset to first page when searching
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    useEffect(() => {
        const cleanedSearch = cleanSearchText(searchValue);
        fetchOffers({
            variables: {
                status: filterstatus || null,
                search: cleanedSearch || null,
                limit: pagination.pageSize,
                offSet: pagination.current - 1,
                isProceedToPay: filtertype || null,
            },
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchOffers, filterstatus, searchValue, pagination.current, pagination.pageSize, cleanSearchText, filtertype]);

    const offers = useMemo(() => data?.getOffersByUser?.offers || [], [data]);
    const totalCount = data?.getOffersByUser?.count || 0;

    const tableData = offers?.map((offer) => ({
        key: offer.id,
        title: offer.business.businessTitle,
        sellername: offer.business.seller?.name
            ? `${offer.business.seller.name.slice(0, 3)}*****`
            : null,
        businessprice: offer.business.price,
        offerprice: offer.price,
        status: offer.status,
        date: new Date(offer.createdAt).toLocaleString(),
        business: offer.business, 
        buyer: offer.buyer, 
        createdBy: offer.createdBy, 
        isProceedToPay: offer.isProceedToPay,
        commission: offer.commission,
    }));

    const columns = [
        { title: t('Business Title'), dataIndex: 'title' },
        { title: t('Seller Name'), dataIndex: 'sellername' },
        { 
            title: t('Business Price'),
            dataIndex: 'businessprice',
            render: (row) => (
                <Flex gap={10} align="center">
                    <img src="/assets/icons/reyal-b.png" width={12} alt={t("currency-symbol")} fetchPriority="high" /> {row}
                </Flex>
            )
         },
        { 
            title: t('Offer Price'), 
            dataIndex: 'offerprice',
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
            title: t('Commission'), dataIndex: 'commission',
            render: (commission) => {
                return (
                    <Flex gap={10} align="center">
                        <img src="/assets/icons/reyal-b.png" width={12} alt={t("currency-symbol")} fetchPriority="high" />
                        <Text className=''>{commission || 0}</Text>
                    </Flex>
                );
            },
        },
        {
            title: t('Status'), dataIndex: 'status',
            render: (status, record) => {
                if (status === 'PENDING') {
                  if (record.createdBy === userId) return <Text className="sendstatus fs-12 badge-cs fw-500">{t('Send')}</Text>;
                  return <Text className="sendstatus fs-12 badge-cs fw-500">{t('Received')}</Text>;
                } else if (status === 'REJECTED') return <Text className="inactive fs-12 badge-cs fw-500">{t('Rejected')}</Text>;
                else if (status === 'APPROVED') return <Text className="received fs-12 badge-cs fw-500">{t('Approved')}</Text>;
                return <Text className="fs-12 badge-cs fw-500">{status}</Text>;
            },
        },
        { title: t('Date'), dataIndex: 'date' },
        {
            title: t('Action'), key: 'action', fixed: 'right', width: 100, align: 'center',
            render: (record) => {
              // Hide action button if user created the offer (sent by buyer)
              if (record.createdBy === userId) return null;

              // Hide action button if status is ACCEPTED or REJECTED
              if (record.status === 'ACCEPTED' || record.status === 'REJECTED') return null;

              // Check if this is a "Received" offer (created by seller, not by current user)
              const isReceivedOffer = record.createdBy !== userId;
              
              let items = [];
              if (record.status === 'PENDING') {
                items = [
                  { label: <NavLink onClick={() => { setSelectedOfferId(record.key); setSelectedBusinessId(record.business.id); setRequestPop(true); }}>{t('Accept Offer')}</NavLink>, key: 0 },
                  { label: <NavLink onClick={() => { setSelectedOfferId(record.key); setDeleteModal(true); }}>{t('Reject Offer')}</NavLink>, key: 1 },
                ];

                // Handle Counter Offer button based on isProceedToPay
                if (record.isProceedToPay) {
                  // If Proceed to Purchase - completely remove Counter Offer button
                  // Don't add it to items array at all
                } else {
                  const disableCounterOffer = isReceivedOffer && !record.isProceedToPay;
                  
                  items.push({
                    label: disableCounterOffer ? (
                      <Text style={{ opacity: 0.5, cursor: 'not-allowed' }}>{t('Counter Offer')}</Text>
                    ) : (
                      <NavLink onClick={() => { setSelectedBusinessId(record.business.id); setSelectedOfferId(record.key); setOfferModal(true); }}>{t('Counter Offer')}</NavLink>
                    ),
                    key: 2,
                    disabled: disableCounterOffer,
                  });
                }

                // Always add Request Meeting option
                items.push({
                  label: <NavLink onClick={() => { setSelectedBusinessId(record.business.id); setRequestPop(true); }}>{t('Request For Virtual Meeting')}</NavLink>,
                  key: 3,
                });
              }
              
              return (
                <Dropdown menu={{ items }} trigger={['click']}>
                  <Button aria-labelledby={t('dropdown icon')} className="bg-transparent border-0 p-0">
                    <img src="/assets/icons/dots.png" alt={t("dropdown-icon")} width={16} fetchPriority="high" />
                  </Button>
                </Dropdown>
              );
            },
        }
    ];

    const statusOptions = [
        { id: 'PENDING', name: t('Pending') },
        { id: 'APPROVED', name: t('Approved') },
        { id: 'REJECTED', name: t('Rejected') },
        { id: 'ACCEPTED', name: t('Accepted') },
    ];

    const offerTypeOptions = [
        { id: false, name: t('Counter Offer') },
        { id: true, name: t('Proceed to Purchase') },
    ];

    const handleTableChange = (paginationConfig) => {
        setPagination({
            current: paginationConfig.current,
            pageSize: paginationConfig.pageSize,
        });
    };

    const refetch = useCallback(() => {
        const cleanedSearch = cleanSearchText(searchValue);
        fetchOffers({
            variables: {
                status: filterstatus || null,
                search: cleanedSearch || null,
                limit: pagination.pageSize,
                offset: pagination.current - 1,
                isProceedToPay: filtertype || null,
            },
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchOffers, filterstatus, searchValue, pagination.current, pagination.pageSize, cleanSearchText, filtertype]);

    return (
        <>
            <Flex vertical gap={20}>
                <ModuleTopHeading level={4} name={t('Offer')} />
                <Card className='radius-12 border-gray'>
                    <Row gutter={[24,24]}>
                        <Col span={24}>
                            <Flex gap={5} align='center' wrap>
                                <SearchInput
                                    placeholder={t('Search by business title or seller')}
                                    value={searchValue}
                                    onChange={handleSearchChange}
                                    prefix={<img src="/assets/icons/search.png" alt={t('search-icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
                                    style={{ minWidth: '250px' }}
                                />
                                <MySelect
                                    withoutForm
                                    value={filterstatus}
                                    options={statusOptions}
                                    allowClear
                                    placeholder={t('Status')}
                                    onChange={(value) => {
                                        setFilterStatus(value === 'all' ? null : value);
                                        setPagination(prev => ({ ...prev, current: 1 }));
                                    }}
                                    showKey
                                    style={{ minWidth: '150px' }}
                                    className='border-light-gray radius-8'
                                />
                                <MySelect
                                    withoutForm
                                    value={filtertype}
                                    options={offerTypeOptions}
                                    allowClear
                                    placeholder={t('Offer Type')}
                                    onChange={(value) => {
                                        setFilterType(value === 'all' ? null : value);
                                        setPagination(prev => ({ ...prev, current: 1 }));
                                    }}
                                    showKey
                                    style={{ minWidth: '180px' }}
                                    className='border-light-gray radius-8'
                                />
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Table
                                size="large"
                                columns={columns}
                                dataSource={tableData}
                                className="pagination table table-cs"
                                showSorterTooltip={false}
                                scroll={{ x: 1300 }}
                                loading={loading}
                                onChange={handleTableChange}
                                pagination={{
                                    current: pagination.current,
                                    pageSize: pagination.pageSize,
                                    total: totalCount,
                                    showSizeChanger: true,
                                    showTotal: (total) => t(`Total ${total} offers`),
                                    pageSizeOptions: ['10', '20', '50', '100'],
                                }}
                            />
                        </Col>
                    </Row>
                </Card>
            </Flex>
            <OfferSellerModal refetch={refetch} businessId={selectedBusinessId} offerId={selectedOfferId} visible={offermodal} onClose={()=>setOfferModal(false)} />
            <RequestMeetingModal refetch={refetch} offerId={selectedOfferId} businessId={selectedBusinessId} visible={requestPop} onClose={()=>setRequestPop(false)} />
            <DeleteModal refetch={refetch} offerId={selectedOfferId} visible={deletemodal} onClose={()=>setDeleteModal(false)} type='danger'
                title={t('Are you sure?')}
                subtitle={t('This action cannot be undone. Are you sure you want to reject this offer?')}
            />
        </>
    )
}

export { BuyerOfferContent }
