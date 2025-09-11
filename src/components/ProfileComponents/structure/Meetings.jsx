import { Card, Col, Row, Tabs } from 'antd'
import { SellerSendRequestTable } from './SellerSenRequestTable';
import { SellerRecieveRequestTable } from './SellerRecieveRequestTable';
import { SellerAdminSchedulingTable } from './SellerAdminSchedulingTable';
import { SellerScheduledTable } from './SellerScheduledTable';

const Meetings = () => {
    // const [activeKey, setActiveKey] = useState('1');
    const items = [
        {
            key:'1',
            label:'Send Requests',
            children:<SellerSendRequestTable/>
        },
        {
            key:'2',
            label:'Recieve Requests',
            children:<SellerRecieveRequestTable />,
        },
        {
            key:'3',
            label:'Admin Scheduling',
            children:<SellerAdminSchedulingTable/>
        },
        {
            key:'4',
            label:'Scheduled Meetings',
            children:<SellerScheduledTable/>
        }
    ]
    
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
    )
}

export { Meetings } 
