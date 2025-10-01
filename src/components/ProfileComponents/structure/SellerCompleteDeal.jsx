import { Col, Form, Row, Table, Button } from 'antd';
import { SearchInput } from '../../Forms';
import { SELLERDEALS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SellerCompleteDeal = ({ setCompleteDeal, completedeal }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const search = Form.useWatch('search', form);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data: offerDeals, loading, error, refetch } = useQuery(SELLERDEALS, {
    variables: {
      limit: pagination.pageSize,
      offset: (pagination.current - 1) * pagination.pageSize,
      search: search || '',
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    refetch({ limit: 10, offset: 0, search: search || '' });
  }, [search, refetch]);

  const columns = [
    { title: t('Business Title'), dataIndex: 'title' },
    { title: t('Seller Name'), dataIndex: 'sellername' },
    { title: t('Finalized Price'), dataIndex: 'finalizedprice' },
    { title: t('Finalized Date'), dataIndex: 'date' },
  ];

  const sellercompletedealData = useMemo(() => {
    return (
      offerDeals?.getSellerCompletedDeals?.deals?.map((offer) => ({
        key: offer?.id,
        title: offer?.business?.businessTitle,
        sellername: offer?.buyer?.name,
        finalizedprice: offer?.price,
        date: new Date(offer?.createdAt).toLocaleString(),
      })) || []
    );
  }, [offerDeals]);

  return (
    <Form form={form}>
      <Row gutter={[24, 12]} className='mt-2'>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <Form.Item name="search" noStyle>
            <SearchInput
              placeholder={t('Search')}
              value={form.getFieldValue('name') || ''}
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
          </Form.Item>
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
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: offerDeals?.getSellerCompletedDeals?.totalCount || 0,
              showTotal: (total) => (
                <Button aria-labelledby='Total' className="brand-bg">{t('Total')}: {total}</Button>
              ),
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
          />
        </Col>
      </Row>
    </Form>
  );
};

export { SellerCompleteDeal };
