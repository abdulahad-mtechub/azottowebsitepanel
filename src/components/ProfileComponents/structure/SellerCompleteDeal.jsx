import { Col, Form, Row, Table, Space, Typography } from 'antd';
import { SearchInput } from '../../Forms';
import { SELLERDEALS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import { useMemo, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const SellerCompleteDeal = ({ setCompleteDeal }) => {
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [fetchDeals, { data: offerDeals, loading }] = useLazyQuery(SELLERDEALS, {
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

  const columns = [
    { title: t('Business Title'), dataIndex: 'title' },
    { title: t('Buyer Name'), dataIndex: 'buyername' },
    { 
      title: t('Finalized Price'), 
      dataIndex: 'finalizedprice',
      render: (finalizedprice) => (
        <Space size={5} align="center">
            {finalizedprice != null && finalizedprice !== '' ? (
            <>
                <img
                src="/assets/icons/reyal-b.png"
                width={16}
                alt="currency-symbol"
                fetchPriority="high"
                />
                <Text>{finalizedprice}</Text>
            </>
            ) : (
            <Text>-</Text>
            )}
        </Space>
      )
    },
    { title: t('Finalized Date'), dataIndex: 'date' },
  ];

  const sellercompletedealData = useMemo(() => {
    return (
      offerDeals?.getSellerCompletedDeals?.deals?.map((offer) => ({
        key: offer?.id,
        title: offer?.business?.businessTitle,
        buyername: offer?.buyer?.name,
        finalizedprice: offer?.price,
        date: new Date(offer?.createdAt).toLocaleString(),
      })) || []
    );
  }, [offerDeals]);

  const totalCount = offerDeals?.getSellerCompletedDeals?.totalCount || 0;

  return (
    <>
      <Row gutter={[24, 12]} className='mt-2'>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <SearchInput
            withoutForm={true}
            placeholder={t('Search')}
            onDebouncedChange={handleDebouncedSearch}
            debounceDelay={500}
            prefix={
              <img
                src="/assets/icons/search.png"
                alt='search-icon'
                className='mx-3-inline'
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
            dataSource={sellercompletedealData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
            onRow={record => ({
              onClick: () => {
                if (record.key) {
                  setCompleteDeal(record);
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
  );
};

export { SellerCompleteDeal };
