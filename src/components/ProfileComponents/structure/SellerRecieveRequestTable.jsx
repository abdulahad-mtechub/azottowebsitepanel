import { useEffect, useState, useCallback } from 'react';
import { Button, Col, Dropdown, Row, Table, Tooltip, Flex, Typography } from 'antd';
import { SearchInput } from '../../Forms';
import { NavLink } from 'react-router-dom';
import { ScheduleMeeting } from '../modal';
import { DeleteModal } from '../../ui';
import { RECEIVEDMEETINGS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const SellerRecieveRequestTable = ({ isBuyer }) => {

    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [isaccept, setIsAccept] = useState(false);
    const [deletemodal, setDeleteModal] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);

    const [refetchMeetings, { data, loading }] = useLazyQuery(RECEIVEDMEETINGS, { fetchPolicy: 'network-only' });
    
    const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
        setSearchValue(debouncedSearchValue);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    const getStatusBadgeClass = (status) => {
        const statusUpper = status?.toUpperCase();
        switch (statusUpper) {
            case 'SCHEDULED':
            case 'ACCEPTED':
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
            case 'PENDING_APPROVAL':
            case 'READY_FOR_SCHEDULING':
                return 'sendstatus';
            case 'REJECTED':
            case 'CANCELLED':
                return 'inactive';
            default:
                return 'received';
        }
    };

    const sellerrecievedrequestData = data?.getReceivedMeetingRequests?.items?.map((meeting) => {
        const buyerName = meeting.requestedTo?.name || '';
        const maskedName =
            buyerName.length > 3
                ? buyerName.substring(0, 3) + '*'.repeat(10)
                : buyerName + '*'.repeat(10 - buyerName.length);

        return {
            key: meeting.id,
            title: meeting.business?.businessTitle,
            buyername: maskedName,
            businessprice: meeting.business?.price,
            offerprice: meeting.offer?.price,
            date: new Date(meeting.requestedDate).toLocaleString(),
            offerId: meeting.offer?.id,
            business: meeting.business,
            status: meeting.status,
            businessStatus: meeting.business?.businessStatus
        };
    }) || [];

    const totalCount = data?.getReceivedMeetingRequests?.totalCount || 0;

    const columns = [
        { 
            title: t('Business Title'), 
            dataIndex: 'title',
            render: (title, record) => {
                const isInactive = record.businessStatus === 'INACTIVE';
                
                if (isInactive) {
                    return (
                        <Flex gap={8} align="center">
                            <Text>{title}</Text>
                            <Tooltip title={t('Seller has marked this business as inactive')}>
                                <Text className='inactive fs-12 badge-cs fw-500 fit-content'>
                                    {t('Inactive')}
                                </Text>
                            </Tooltip>
                        </Flex>
                    );
                }
                return <Text>{title}</Text>;
            }
        },
        { title: t('Buyer Name'), dataIndex: 'buyername' },
        { title: t('Business Price'), dataIndex: 'businessprice' },
        { title: t('Offer Price'), dataIndex: 'offerprice' },
        { 
            title: t('Status'), 
            dataIndex: 'status',
            render: (status) => (
                <Text className={`${getStatusBadgeClass(status)} fs-12 badge-cs fw-500`}>
                    {t(status)}
                </Text>
            )
        },
        { title: t('Requested Date'), dataIndex: 'date' },
        {
            title: t('Action'),
            key: 'action',
            fixed: 'right',
            width: 100,
            align: 'center',
            render: (record) => {
                if (record.businessStatus === 'INACTIVE') {
                    return null;
                }

                const items = [
                    { 
                        label: <NavLink 
                            onClick={() => {
                                setSelectedMeetingId(record.key);
                                setSelectedBusinessId(record.business.id);
                                setSelectedOfferId(record.offerId);
                                setIsAccept(true);
                            }}
                        >
                            {t('Accept')}
                        </NavLink>, 
                        key: 0 
                    },
                    { 
                        label: <NavLink onClick={() => {setDeleteModal(true); setSelectedMeetingId(record.key);}}>{t('Reject')}</NavLink>, 
                        key: 1 
                    },
                ].filter(Boolean);

                return (
                    <Dropdown menu={{ items }} trigger={["click"]}>
                        <Button aria-labelledby={t('dropdown icon')} className="bg-transparent border-0 p-0">
                            <img src="/assets/icons/dots.png" alt="dropdown-icon" width={16} fetchPriority="high" />
                        </Button>
                    </Dropdown>
                );
            },
        },
    ];

    const handleTableChange = (paginationInfo) => {
        const newPagination = {
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize
        };
        setPagination(newPagination);
        
        const offset = (paginationInfo.current - 1) * paginationInfo.pageSize;
        refetchMeetings({ 
            variables: { 
                search: searchValue || "", 
                isBuyer,
                limit: paginationInfo.pageSize,
                offset
            } 
        });
    };

    useEffect(() => {
        const offset = (pagination.current - 1) * pagination.pageSize;
        refetchMeetings({ 
            variables: { 
                search: searchValue || "", 
                isBuyer,
                limit: pagination.pageSize,
                offset
            } 
        });
    }, [searchValue, refetchMeetings, isBuyer, pagination]);

    return (
        <>
            <Row gutter={[24, 12]} className='mt-2'>
                <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
                    <SearchInput
                        withoutForm={true}
                        placeholder={t('Search')}
                        onDebouncedChange={handleDebouncedSearch}
                        debounceDelay={500}
                        prefix={<img src="/assets/icons/search.png" alt={t('search-icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
                    />
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={sellerrecievedrequestData}
                        className="pagination table table-cs"
                        showSorterTooltip={false}
                        scroll={{ x: 1300 }}
                        loading={loading}
                        pagination={{
                            hideOnSinglePage: true,
                            current: pagination.current,
                            pageSize: pagination.pageSize,
                            total: totalCount,
                            showSizeChanger: true,
                            showQuickJumper: true,
                            showTotal: (total, range) => 
                                `${range[0]}-${range[1]} ${t('of')} ${total} ${t('items')}`,
                            pageSizeOptions: ['10', '20', '50', '100']
                        }}
                        onChange={handleTableChange}
                    />
                </Col>
            </Row>

            <ScheduleMeeting 
                visible={isaccept}
                onClose={() => setIsAccept(false)}
                meetingId={selectedMeetingId}
                offerId={selectedOfferId}
                refetchMeetings={() => {
                    const offset = (pagination.current - 1) * pagination.pageSize;
                    refetchMeetings({ 
                        variables: { 
                            search: searchValue || "", 
                            isBuyer,
                            limit: pagination.pageSize,
                            offset
                        } 
                    });
                }}
                businessId={selectedBusinessId}
            />

            <DeleteModal 
                meetingId={selectedMeetingId}
                visible={deletemodal}
                onClose={() => setDeleteModal(false)}
                type='danger'
                title={t('Are you sure?')}
                subtitle={t('Rejecting this meeting request will remove it from your request list. Are you sure you want to proceed?......')}
                refetch={() => refetchMeetings({ 
                    variables: { 
                        search: searchValue || "", 
                        isBuyer,
                        limit: pagination.pageSize,
                        offset: (pagination.current - 1) * pagination.pageSize
                    } 
                })}
            />
        </>
    );
}

export { SellerRecieveRequestTable };
