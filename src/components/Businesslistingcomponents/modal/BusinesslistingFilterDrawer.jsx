import { CloseOutlined } from '@ant-design/icons'
import { Button, Drawer, Flex } from 'antd'
import { Filter } from '../structure';

const BusinesslistingFilterDrawer = ({visible,onClose}) => {

    return (
        <Drawer
            onClose={onClose}
            open={visible}
            title={null}
            closeIcon={false}
            placement='left'
            className='drawer-no-p'
        >
            <Flex justify='end'>
                <Button onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>
            <Filter />
        </Drawer>
    )
}

export {BusinesslistingFilterDrawer}