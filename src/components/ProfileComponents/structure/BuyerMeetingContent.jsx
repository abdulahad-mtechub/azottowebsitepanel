import { Card, Flex, Tabs } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { SendRequestTable } from './SendRequestTable'
import { ReceiveRequestTable } from './ReceiveRequestTable'
import { AdminSchedulingTable } from './AdminSchedulingTable'
import { ScheduledMeetingTable } from './ScheduledMeetingTable'
import { useTranslation } from 'react-i18next'

const BuyerMeetingContent = () => {
    const { t } = useTranslation();

    const singleTab = [
        {
            key:'1',
            label: t('Send Request'),
            children: <SendRequestTable />,
        },
        {
            key:'2',
            label: t('Received Request'),
            children: <ReceiveRequestTable />,
        },
        {
            key:'3',
            label: t('Admin Scheduling'),
            children: <AdminSchedulingTable/>,
        },
        {
            key:'4',
            label: t('Scheduled Meetings'),
            children: <ScheduledMeetingTable/>,
        },
    ]
    
    return (
        <Flex vertical gap={20}>
            <ModuleTopHeading level={4} name={t('Meetings')} />
            <Card className='radius-12 border-gray'>
                <Tabs 
                    className='tabs-fill'
                    defaultActiveKey="1" 
                    items={singleTab}
                />
            </Card>
        </Flex>
    )
}

export { BuyerMeetingContent }
