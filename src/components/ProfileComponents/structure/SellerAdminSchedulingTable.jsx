import { Col, Form, Row, Table, Typography } from 'antd';
import { SearchInput } from '../../Forms';
import { READYSCHEDULEDMEETINGS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const SellerAdminSchedulingTable = ({ isBuyer }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [fetchMeetings, { data, loading }] = useLazyQuery(READYSCHEDULEDMEETINGS, {
    fetchPolicy: 'network-only',
  });
  
  const handleDebouncedSearch = useCallback((debouncedSearchValue) => {
    setSearchValue(debouncedSearchValue);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const selleradminsechedulingData =
    data?.getMeetingsReadyForScheduling?.items?.map((meeting) => {
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
        prefereddatetime: new Date(meeting.receiverAvailabilityDate).toLocaleString(),
      };
    }) || [];

  const totalCount = data?.getMeetingsReadyForScheduling?.totalCount || 0;

  const columns = [
    { title: t('Business Title'), dataIndex: 'title' },
    { title: t('Buyer Name'), dataIndex: 'buyername' },
    { title: t('Business Price'), dataIndex: 'businessprice' },
    { title: t('Offer Price'), dataIndex: 'offerprice' },
    { title: t('Preferred Date & Time'), dataIndex: 'prefereddatetime' },
  ];

  const handleTableChange = (paginationInfo) => {
    const newPagination = {
      current: paginationInfo.current,
      pageSize: paginationInfo.pageSize
    };
    setPagination(newPagination);
    
    const offset = (paginationInfo.current - 1) * paginationInfo.pageSize;
    fetchMeetings({ 
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
    fetchMeetings({ 
      variables: { 
        search: searchValue || "", 
        isBuyer,
        limit: pagination.pageSize,
        offset
      } 
    });
  }, [searchValue, fetchMeetings, isBuyer, pagination]);

  return (
    <>
      <Row gutter={[24, 12]} className="mt-2">
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <SearchInput
            withoutForm={true}
            placeholder={t('Search')}
            onDebouncedChange={handleDebouncedSearch}
            debounceDelay={500}
            prefix={
              <img
                src="/assets/icons/search.png"
                alt={t('search-icon')}
                className="mx-3-inline"
                width={12}
                fetchPriority="high"
              />
            }
          />
        </Col>
        <Col span={24}>
          <Table
            size="large"
            columns={columns}
            dataSource={selleradminsechedulingData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
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
};

export { SellerAdminSchedulingTable };
