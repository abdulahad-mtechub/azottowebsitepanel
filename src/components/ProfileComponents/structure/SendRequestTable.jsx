import { Col, Form, Row, Table } from 'antd';
import { offerData } from '../../../data';
import { SearchInput } from '../../Forms';
import { useTranslation } from 'react-i18next';

const SendRequestTable = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const columns = [
    { title: t('Business Title'), dataIndex: 'title' },
    { title: t('Seller Name'), dataIndex: 'sellername' },
    { title: t('Business Price'), dataIndex: 'businessprice' },
    { title: t('Offer Price'), dataIndex: 'offerprice' },
    { title: t('Requested Date'), dataIndex: 'date' },
  ];

  return (
    <Row gutter={[24, 12]} className='mt-2'>
      <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 12 }} lg={{ span: 8 }}>
        <SearchInput
          placeholder={t('Search')}
          value={form.getFieldValue('name') || ''}
          prefix={<img src="/assets/icons/search.png" alt={t('search-icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
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
  );
};

export { SendRequestTable };
