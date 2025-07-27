import { Card, Flex, Tabs } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { SendRequestTable } from './SendRequestTable'
import { ReceiveRequestTable } from './ReceiveRequestTable'
import { AdminSchedulingTable } from './AdminSchedulingTable'
import { ScheduledMeetingTable } from './ScheduledMeetingTable'
const BuyerMeetingContent = () => {

    const singleTab = [
        {
            key:'1',
            label: 'Send Request',
            children: <SendRequestTable />,
        },
        {
            key:'2',
            label: 'Received Request',
            children: <ReceiveRequestTable />,
        },
        {
            key:'3',
            label: 'Admin Scheduling',
            children: <AdminSchedulingTable/>,
        },
        {
            key:'4',
            label: 'Scheduled Meetings',
            children: <ScheduledMeetingTable/>,
        },
    ]
    
    return (
        <>
            <Flex vertical gap={20}>
                <ModuleTopHeading level={4} name={'Meetings'} />
                <Card className='radius-12 border-gray'>
                    <Tabs 
                        className='tabs-fill'
                        defaultActiveKey="1" items={singleTab}
                    />
                </Card>
            </Flex>
        </>
    )
}

export {BuyerMeetingContent}