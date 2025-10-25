import { Col, Row, Space, Table, Typography } from 'antd';
import { SearchInput } from '../../Forms';
import { SCHEDULEDMEETINGS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const SellerScheduledTable = ({ isBuyer }) => {
    
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
    const [fetchMeetings, { data, loading }] = useLazyQuery(SCHEDULEDMEETINGS, { fetchPolicy: 'network-only' });
    
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

    const sellerscheduledData = data?.getScheduledMeetings?.items?.map((meeting) => {
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
            scheduledatetime: new Date(meeting.receiverAvailabilityDate).toLocaleString(),
            meetinglink: meeting.meetingLink,
            status: meeting.status
        };
    }) || [];

    const totalCount = data?.getScheduledMeetings?.totalCount || 0;

    const columns = [
        { title: t('Business Title'), dataIndex: 'title' },
        { title: isBuyer ? t('Seller Name') : t('Buyer Name'), dataIndex: 'buyername' },
        { title: t('Scheduled Date & Time'), dataIndex: 'scheduledatetime' },
        { 
            title: t('Business Price'), 
            dataIndex: 'businessprice',
            render: (businessprice) => (
                <Space size={5} align="center">
                    {businessprice != null && businessprice !== '' ? (
                    <>
                        <img
                        src="/assets/icons/reyal-b.png"
                        width={16}
                        alt="currency-symbol"
                        fetchPriority="high"
                        />
                        <Text>{businessprice}</Text>
                    </>
                    ) : (
                    <Text>-</Text>
                    )}
                </Space>
            )
        },
        { 
            title: t('Offer Price'), 
            dataIndex: 'offerprice',
            render: (offerprice) => (
                <Space size={5} align="center">
                    {offerprice != null && offerprice !== '' ? (
                    <>
                        <img
                        src="/assets/icons/reyal-b.png"
                        width={16}
                        alt="currency-symbol"
                        fetchPriority="high"
                        />
                        <Text>{offerprice}</Text>
                    </>
                    ) : (
                    <Text>-</Text>
                    )}
                </Space>
            )
        },
        { 
            title: t('Status'), 
            dataIndex: 'status',
            render: (status) => (
                <Text className={`${getStatusBadgeClass(status)} fs-12 badge-cs fw-500`}>
                    {t(status)}
                </Text>
            )
        },
        {
            title: t('Meeting Link'),
            dataIndex: 'meetinglink',
            render: (text) => (
                <a
                    href={text}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                >
                    {text}
                </a>
            )
        }
    ];

    const handleTableChange = (paginationInfo) => {
        const newPagination = {
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize
        };
        setPagination(newPagination);
        
        const offSet = (paginationInfo.current - 1) * paginationInfo.pageSize;
        fetchMeetings({ 
            variables: { 
                search: searchValue || "", 
                isBuyer,
                limit: paginationInfo.pageSize,
                offSet
            } 
        });
    };

    useEffect(() => {
        const offSet = (pagination.current - 1) * pagination.pageSize;
        fetchMeetings({ 
            variables: { 
                search: searchValue || "", 
                isBuyer,
                limit: pagination.pageSize,
                offSet
            } 
        });
    }, [searchValue, fetchMeetings, isBuyer, pagination]);

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
                        dataSource={sellerscheduledData}
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
        </>
    );
}

export { SellerScheduledTable };
