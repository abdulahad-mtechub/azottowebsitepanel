import { CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Flex } from 'antd'
import { Filter } from '../structure';
import { useEffect, useState } from 'react';

const BusinesslistingFilterDrawer = ({
    visible,
    onClose,
    setMultipleStep,
    setPriceRange,
    setRevenueRange,
    setProfitRange,
    setProfitMargenRange,
    setEmployeesRange,
    setOperationalYearRange,
    setHasAssets,
    setSelectedCategory
}) => {

    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 1199);

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (isDesktop) return null;

    return (
        <Drawer
            onClose={onClose}
            open={visible}
            title={null}
            closeIcon={false}
            placement='left'
            className={`drawer-no-p p-2`}
        >
            <Flex justify='end'>
                <Button aria-labelledby='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>
            <Filter 
                setMultipleStep={setMultipleStep}
                setPriceRange={setPriceRange}
                setRevenueRange={setRevenueRange}
                setProfitRange={setProfitRange}
                setProfitMargenRange={setProfitMargenRange}
                setEmployeesRange={setEmployeesRange}
                setOperationalYearRange={setOperationalYearRange}
                setHasAssets={setHasAssets}
                setSelectedCategory={setSelectedCategory}
            />
        </Drawer>
    )
}

export {BusinesslistingFilterDrawer}