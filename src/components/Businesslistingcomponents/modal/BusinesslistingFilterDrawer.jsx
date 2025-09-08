import { CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Flex } from 'antd'
import { Filter } from '../structure';
import { useEffect, useState } from 'react';

const BusinesslistingFilterDrawer = ({visible,onClose}) => {

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
                <Button aria-label='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>
            <Filter />
        </Drawer>
    )
}

export {BusinesslistingFilterDrawer}