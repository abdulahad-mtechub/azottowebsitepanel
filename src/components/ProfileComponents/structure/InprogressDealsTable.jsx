import { Col, Form, Row, Table, Button } from 'antd';
import { SearchInput } from '../../Forms';
import { BUYERINPROGRESSDEALS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import React, { useMemo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const InprogressDealsTable = ({ setInprogressDeal }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const search = Form.useWatch('search', form);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const { data: offerDeals, loading, error, refetch } = useQuery(BUYERINPROGRESSDEALS, {
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
    { title: t('Offer Price'), dataIndex: 'offerprice' },
    { title: t('Date'), dataIndex: 'date' },
  ];

  const offerData = useMemo(() => {
    return offerDeals?.getBuyerInprogressDeals?.map((deal) => ({
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

  return (
    <Form form={form}>
      <Row gutter={[24, 12]} className='mt-2'>
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <Form.Item name="search" noStyle>
            <SearchInput
              placeholder={t("Search")}
              value={form.getFieldValue('name') || ''}
              prefix={<img src="/assets/icons/search.png" alt={t('search icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
            />
          </Form.Item>
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
            pagination={{
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: offerDeals?.getBuyerInprogressDeals?.length || 0,
              showTotal: (total) => (
                <Button aria-labelledby={t('Total')} className="brand-bg">{t('Total')}: {total}</Button>
              ),
              onChange: (page, pageSize) => {
                setPagination({ current: page, pageSize });
              },
            }}
          />
        </Col>
      </Row>
    </Form>
  )
}

export { InprogressDealsTable };
