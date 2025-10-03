import { Col, Row, Table, Spin } from 'antd';
import { SearchInput } from '../../Forms';
import { BUYERINPROGRESSDEALS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import React, { useMemo, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const InprogressDealsTable = ({ setInprogressDeal }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [fetchDeals, { data: offerDeals, loading }] = useLazyQuery(BUYERINPROGRESSDEALS, {
    fetchPolicy: 'network-only',
  });

  const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
    setPagination(prev => ({ ...prev, current: 1 })); // Reset to first page on search
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

  const columns = [
    { title: t('Business Title'), dataIndex: 'title' },
    { title: t('Seller Name'), dataIndex: 'sellername' },
    { title: t('Offer Price'), dataIndex: 'offerprice' },
    { title: t('Date'), dataIndex: 'date' },
  ];

  const offerData = useMemo(() => {
    return offerDeals?.getBuyerInprogressDeals?.deals?.map((deal) => ({
      key: deal?.id,
      title: deal?.business?.businessTitle,
      businessId: deal?.business?.id,
      sellername: deal?.business.seller.name,
      sellerId: deal?.business.seller.id,
      buyerId: deal?.buyer?.id,
      buyername: deal?.buyer?.name,
      status: deal?.status,
      offerprice: deal?.price,
      date: new Date(deal?.createdAt).toLocaleString(),
      isDsaBuyer: deal?.isDsaBuyer,
      isDsaSeller: deal?.isDsaSeller,
      isCommissionVerified: deal?.isCommissionVerified,
    })) || [];
  }, [offerDeals]);

  const totalCount = offerDeals?.getBuyerInprogressDeals?.totalCount || 0;
  if (loading) {
    return (
        <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
        </Flex>
    );
}
  return (
    <>
      <Row gutter={[24, 12]} className='mt-2'>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <SearchInput
            withoutForm={true}
            placeholder={t("Search")}
            onDebouncedChange={handleDebouncedSearch}
            debounceDelay={500}
            prefix={<img src="/assets/icons/search.png" alt={t('search icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
          />
        </Col>

        <Col span={24}>
          <Table
            size="large"
            columns={columns}
            dataSource={offerData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
            onRow={record => ({
              onClick: () => {
                if (record.key) {
                  setInprogressDeal(record);
                }
              },
            })}
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
  )
}

export { InprogressDealsTable };
