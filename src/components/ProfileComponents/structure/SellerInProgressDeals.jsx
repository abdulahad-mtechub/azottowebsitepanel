import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { Col, Form, Row, Table, Button } from 'antd';
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

    // Helper function to get readable status
    const getStatusLabel = (status) => {
        const statusMap = {
            'COMMISSION_TRANSFER_FROM_BUYER_PENDING': t('Commission Pending'),
            'COMMISSION_VERIFIED': t('Commission Verified'),
            'DSA_FROM_SELLER_PENDING': t('DSA Seller Pending'),
            'DSA_FROM_BUYER_PENDING': t('DSA Buyer Pending'),
            'BANK_DETAILS_FROM_SELLER_PENDING': t('Bank Details Pending'),
            'SELLER_PAYMENT_VERIFICATION_PENDING': t('Payment Verification Pending'),
            'PAYMENT_APPROVAL_FROM_SELLER_PENDING': t('Payment Approval Pending'),
            'DOCUMENT_PAYMENT_CONFIRMATION': t('Document Confirmation'),
            'WAITING': t('Waiting'),
            'BUYERCOMPLETED': t('Buyer Completed'),
            'SELLERCOMPLETED': t('Seller Completed'),
            'COMPLETED': t('Completed'),
            'CANCEL': t('Cancelled'),
            'PENDING': t('Pending'),
        };
        return statusMap[status] || status;
    };

    const columns = [
        { title: t('Business Title'), dataIndex: 'title' },
        { title: t('Buyer Name'), dataIndex: 'buyername' },
        { title: t('Business Price'), dataIndex: 'businessprice' },
        { 
            title: t('Status'), 
            dataIndex: 'status',
            render: (status) => {
                const statusLabel = getStatusLabel(status);
                let badgeClass = 'sendstatus';
                
                if (status === 'CANCEL') {
                    badgeClass = 'inactive'; // Red
                } else if (status === 'COMPLETED' || status === 'BUYERCOMPLETED' || status === 'SELLERCOMPLETED') {
                    badgeClass = 'success'; // Green
                } else if (status === 'COMMISSION_VERIFIED' || status === 'DOCUMENT_PAYMENT_CONFIRMATION') {
                    badgeClass = 'received'; // Blue
                }
                
                return <span className={`${badgeClass} fs-12 badge-cs fw-500 fit-content`}>{statusLabel}</span>;
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
            status: deal.status,
            isDsaSeller: deal?.isDsaSeller,
        })) || [];
    }, [offerDeals]);

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
