import { Button, Col, Dropdown, Form, Row, Table } from 'antd';
import { offerData } from '../../../data';
import { SearchInput } from '../../Forms';
import { NavLink } from 'react-router-dom';
import { ScheduleMeeting } from '../modal';
import { useState } from 'react';
import { DeleteModal } from '../../ui';
import { useTranslation } from 'react-i18next';

const ReceiveRequestTable = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [isaccept, setIsAccept] = useState(false);
  const [deletemodal, setDeleteModal] = useState(false);

  const columns = [
    { title: t('Business Title'), dataIndex: 'title' },
    { title: t('Seller Name'), dataIndex: 'sellername' },
    { title: t('Business Price'), dataIndex: 'businessprice' },
    { title: t('Offer Price'), dataIndex: 'offerprice' },
    { title: t('Requested Date'), dataIndex: 'date' },
    {
      title: t('Action'),
      key: 'action',
      fixed: 'right',
      width: 100,
      align: 'center',
      render: (record) => {
        const items = [
          { label: <NavLink onClick={() => setIsAccept(true)}>{t('Accept Offer')}</NavLink>, key: 0 },
          { label: <NavLink onClick={() => setDeleteModal(true)}>{t('Reject Offer')}</NavLink>, key: 1 },
        ].filter(Boolean);

        return (
          <Dropdown menu={{ items }} trigger={['click']}>
            <Button aria-labelledby={t('dropdown icon')} className="bg-transparent border-0 p-0">
              <img src="/assets/icons/dots.png" alt={t('dropdown-icon')} width={16} fetchPriority="high" />
            </Button>
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Row gutter={[24, 12]} className="mt-2">
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
          <SearchInput
            placeholder={t('Search')}
            value={form.getFieldValue('name') || ''}
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
            dataSource={offerData}
            className="pagination table table-cs"
            showSorterTooltip={false}
            scroll={{ x: 800 }}
            pagination={false}
          />
        </Col>
      </Row>

      <ScheduleMeeting visible={isaccept} onClose={() => setIsAccept(false)} />
      <DeleteModal
        visible={deletemodal}
        onClose={() => setDeleteModal(false)}
        type="danger"
        title={t('Are you sure?')}
        subtitle={t('Rejecting this meeting request will remove it from your request list. Are you sure you want to proceed?')}
      />
    </>
  );
};

export { ReceiveRequestTable };
