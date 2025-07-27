import React from 'react';
import { useState } from 'react';
import { Card, Col, Row, Typography, Tabs } from 'antd'
import { SellerSendRequestTable } from './SellerSenRequestTable';
import { SellerRecieveRequestTable } from './SellerRecieveRequestTable';
import { SellerAdminSchedulingTable } from './SellerAdminSchedulingTable';
import { SellerScheduledTable } from './SellerScheduledTable';
const { Title, Text } = Typography;

const Meetings = () => {
    // const [activeKey, setActiveKey] = useState('1');
    const items = [
        {
            key:'1',
            label:'Send Request',
            children:<SellerSendRequestTable/>
        },
        {
            key:'2',
            label:'Recieve Request',
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
