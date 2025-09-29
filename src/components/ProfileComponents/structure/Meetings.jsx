import { Card, Col, Row, Tabs } from 'antd';
import { SellerSendRequestTable } from './SellerSenRequestTable';
import { SellerRecieveRequestTable } from './SellerRecieveRequestTable';
import { SellerAdminSchedulingTable } from './SellerAdminSchedulingTable';
import { SellerScheduledTable } from './SellerScheduledTable';
import { useTranslation } from 'react-i18next';

const Meetings = ({ isBuyer }) => {
  const { t } = useTranslation();

  const items = [
    {
      key: '1',
      label: t('Send Requests'),
      children: <SellerSendRequestTable isBuyer={isBuyer} />,
    },
    {
      key: '2',
      label: t('Receive Requests'),
      children: <SellerRecieveRequestTable isBuyer={isBuyer} />,
    },
    {
      key: '3',
      label: t('Admin Scheduling'),
      children: <SellerAdminSchedulingTable isBuyer={isBuyer} />,
    },
    {
      key: '4',
      label: t('Scheduled Meetings'),
      children: <SellerScheduledTable isBuyer={isBuyer} />,
    },
  ];

  return (
    <Card className='border-gray'>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Tabs
            className='tabs-fill'
            defaultActiveKey="1"
            items={items}
          />
        </Col>
      </Row>
    </Card>
  );
};

export { Meetings };
