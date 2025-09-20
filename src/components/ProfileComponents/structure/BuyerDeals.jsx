import { Card, Flex, Spin, Tabs } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { useState, useMemo } from 'react'
import { lazy, Suspense } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { SingleCompleteDeal } from './SingleCompleteDeal';

const InprogressDealsTable = lazy(() => import('./InprogressDealsTable').then(module => ({ default: module.InprogressDealsTable })))
const SingleInProgressDeals = lazy(() => import('./SingleInProgressDeals').then(module => ({ default: module.SingleInProgressDeals })))
const CompleteDealsTable = lazy(() => import('./CompleteDealsTable').then(module => ({ default: module.CompleteDealsTable })))


const BuyerDeals = () => {

    const [ inprogressdeal, setInprogressDeal ] = useState()
    const [ completedeal, setCompleteDeal ] = useState()

    const singleTab = useMemo(() => [
        {
            key: '1',
            label: 'In-Progress Deals',
            children: (
                <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                    <InprogressDealsTable setInprogressDeal={setInprogressDeal} />
                </Suspense>
            )
        },
        {
            key: '2',
            label: 'Completed Deals',
            children: (
                <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                    <CompleteDealsTable setCompleteDeal={setCompleteDeal} />
                </Suspense>
            )
        },
    ], [setCompleteDeal,setInprogressDeal])

    if (inprogressdeal && !completedeal) {
        return (
            <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                <SingleInProgressDeals 
                    inprogressdeal={inprogressdeal} 
                    setInprogressDeal={setInprogressDeal} 
                />
            </Suspense>
        )
    }

    if (completedeal && !inprogressdeal) {
        return (
            <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                <SingleCompleteDeal 
                    completedeal={completedeal} 
                    setCompleteDeal={setCompleteDeal} 
                />
            </Suspense>
        )
    }
    else {
        return (
            <>
                <Flex vertical gap={20}>
                    <ModuleTopHeading level={4} name={'Deals'} />
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
}

export {BuyerDeals}