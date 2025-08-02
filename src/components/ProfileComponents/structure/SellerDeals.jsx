import { Card, Flex, Spin, Tabs } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { useState, useMemo, useCallback } from 'react'
import { lazy, Suspense } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { SellerSingleCompleteDeal } from './SellerSingleCompleteDeal';

const SellerInProgressDeals = lazy(() => import('./SellerInProgressDeals').then(module => ({ default: module.SellerInProgressDeals })))
const SellerSingleInProgressDeals = lazy(() => import('./SellerSingleInProgressDeal').then(module => ({ default: module.SellerSingleInProgressDeals })))
const SellerCompleteDeal = lazy(() => import('./SellerCompleteDeal').then(module => ({ default: module.SellerCompleteDeal })))

const SellerDeals = () => {

    const [ inprogressdeal, setInprogressDeal ] = useState()
    const [ completedeal, setCompleteDeal ] = useState()

    const singleTab = useMemo(() => [
        {
            key: '1',
            label: 'In-Progress Deals',
            children: (
                <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                    <SellerInProgressDeals setInprogressDeal={setInprogressDeal} />
                </Suspense>
            )
        },
        {
            key: '2',
            label: 'Completed Deals',
            children: (
                <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                    <SellerCompleteDeal setCompleteDeal={setCompleteDeal} />
                </Suspense>
            )
        },
    ], [setCompleteDeal,setInprogressDeal])

    if (inprogressdeal && !completedeal) {
        return (
            <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                <SellerSingleInProgressDeals 
                    inprogressdeal={inprogressdeal} 
                    setInprogressDeal={setInprogressDeal} 
                />
            </Suspense>
        )
    }

    if (completedeal && !inprogressdeal) {
        return (
            <Suspense fallback={<div><Spin indicator={<LoadingOutlined spin />} size="large" /></div>}>
                <SellerSingleCompleteDeal 
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

export {SellerDeals}