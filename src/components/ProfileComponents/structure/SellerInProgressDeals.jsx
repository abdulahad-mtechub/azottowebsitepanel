import { useMemo, useEffect, useState, useCallback } from 'react';
import { Col, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { SELLERINPROGRESSDEALS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';

const SellerInProgressDeals = ({ setInprogressDeal }) => {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const [fetchDeals, { data: offerDeals }] = useLazyQuery(SELLERINPROGRESSDEALS, {
        fetchPolicy: 'network-only',
    });

    const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
        setSearchValue(debouncedSearchValue);
        setPagination(prev => ({ ...prev, current: 1 }));
    }, []);

    const handleTableChange = (paginationInfo) => {
        const newPagination = {
            current: paginationInfo.current,
            pageSize: paginationInfo.pageSize
        };
        setPagination(newPagination);
        
        const offset = (paginationInfo.current - 1) * paginationInfo.pageSize;
        fetchDeals({ 
            variables: {
                limit: paginationInfo.pageSize,
                offset,
                search: searchValue || ''
            }
        });
    };

    useEffect(() => {
        const offset = (pagination.current - 1) * pagination.pageSize;
        fetchDeals({ 
            variables: {
                limit: pagination.pageSize,
                offset,
                search: searchValue || ''
            }
        });
    }, [searchValue, fetchDeals, pagination]);

    // Determine status based on boolean fields (matching InprogressDealsTable logic)
    const getStatusLabel = useCallback((deal) => {
        if (!deal) return t('Pending');
        
        // Check if deal is cancelled
        if (deal.status === 'CANCEL') {
            return t('Cancelled');
        }
        
        // Step 4: Deal finalized by seller
        if (deal.isSellerCompleted) {
            return t('Seller Completed');
        }
        
        // Step 3: Payment verification
        if (deal.isDsaSeller && deal.isDsaBuyer) {
            if (deal.isPaymentVedifiedSeller) {
                return t('Payment Verified');
            } else {
                return t('Payment Verification Pending');
            }
        }
        
        // Step 2: DSA signing
        if (deal.isCommissionVerified) {
            if (!deal.isDsaSeller && !deal.isDsaBuyer) {
                return t('Seller & Buyer DSA Pending');
            } else if (!deal.isDsaSeller && deal.isDsaBuyer) {
                return t('Seller DSA Pending');
            } else if (deal.isDsaSeller && !deal.isDsaBuyer) {
                return t('Buyer DSA Pending');
            } else if (deal.isDsaSeller && deal.isDsaBuyer) {
                return t('DSA Verified');
            }
        }
        
        // Step 1: Commission verification
        if (!deal.isCommissionVerified) {
            return t('Commission Verification Pending');
        }
        
        return t('Pending');
    }, [t]);

    const columns = [
        { title: t('Business Title'), dataIndex: 'title' },
        { title: t('Buyer Name'), dataIndex: 'buyername' },
        { title: t('Business Price'), dataIndex: 'businessprice' },
        { 
            title: t('Status........'), 
            dataIndex: 'status',
            render: (status, record) => {
                const isCancelled = record.statusRaw === 'CANCEL';
                let badgeClass = 'sendstatus'; // Default: pending/orange
                
                if (isCancelled) {
                    badgeClass = 'inactive'; // Gray - Cancelled
                } else if (record.isSellerCompleted) {
                    badgeClass = 'success'; // Green - Seller completed
                } else if (
                    status === t('Payment Verified') ||
                    status === t('DSA Verified') ||
                    record.isPaymentVedifiedSeller ||
                    (record.isDsaSeller && record.isDsaBuyer)
                ) {
                    badgeClass = 'received'; // Blue - Verified states
                } else if (
                    status?.toLowerCase().includes('pending') || 
                    !record.isCommissionVerified
                ) {
                    badgeClass = 'sendstatus'; // Orange - Pending states
                }
                
                return <span className={`${badgeClass} fs-12 badge-cs fw-500 fit-content`}>{status}</span>;
            }
        },
        { title: t('Finalized Date'), dataIndex: 'date' },
    ];

    const sellerofferData = useMemo(() => {
        return offerDeals?.getSellerInprogressDeals?.deals?.map((deal) => ({
            key: deal.id,
            title: deal.business.businessTitle,
            buyername: deal.buyer.name,
            businessprice: deal.price,
            date: new Date(deal.createdAt).toLocaleString(),
            status: getStatusLabel(deal),
            statusRaw: deal.status,
            isBuyerCompleted: deal?.isBuyerCompleted,
            isSellerCompleted: deal?.isSellerCompleted,
            isCommissionVerified: deal?.isCommissionVerified,
            isPaymentVedifiedSeller: deal?.isPaymentVedifiedSeller,
            isDsaSeller: deal?.isDsaSeller,
            isDsaBuyer: deal?.isDsaBuyer,
        })) || [];
    }, [offerDeals, getStatusLabel]);

    const totalCount = offerDeals?.getSellerInprogressDeals?.totalCount || 0;

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
                        dataSource={sellerofferData}
                        className="pagination table table-cs"
                        showSorterTooltip={false}
                        scroll={{ x: 800 }}
                        onRow={record => ({
                            onClick: () => {
                                if (record.key) setInprogressDeal(record);
                            },
                        })}
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
};

export { SellerInProgressDeals };
