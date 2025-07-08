import { CloseOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Collapse, Drawer, Flex, Image, Typography } from 'antd'
import { mobilemenuData } from '../../../data';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const { Title } = Typography
const { Panel } = Collapse;
const MobileNavbar = ({visible,onClose}) => {

    const [currentPanel,setCurrentPanel]=useState([])
    const [currentPanels,setCurrentPanels]=useState([])

    return (
        <Drawer
            onClose={onClose}
            open={visible}
            title={null}
            closeIcon={false}
            className='bg-dark-blue'
            placement='left'
        >
            <Flex justify='space-between' align='center'>
                <Image src='/assets/images/logo.png' width={120} />
                <Button className='bg-transparent border-0 p-0' onClick={onClose}>
                    <CloseOutlined className='text-white fs-18' />
                </Button>
            </Flex>
            <div className='mt-3'>
                <Collapse
                    activeKey={currentPanel}
                    onChange={(keys)=>{setCurrentPanel(keys)}}
                    ghost
                >
                    {
                        mobilemenuData?.map((menu,f)=>
                            <Panel className={currentPanel.includes(String(f)) ? 'panel-active panel' : 'panel'}  showArrow={false} header={<Title level={5} className='text-white m-0'>{menu?.name}</Title>} key={f} 
                                extra={((currentPanel?.findIndex(x=>x==f))>-1) ?
                                <MinusOutlined className='text-white' 
                                    style={{transition: 'transform 0.2s ease-in-out', fontSize: 14}} />
                                :
                                <PlusOutlined className='text-white' 
                                    style={{transition: 'transform 0.2s ease-in-out', fontSize: 14}}/>}
                                    
                            >
                                <div>
                                    <Collapse
                                        activeKey={currentPanels}
                                        onChange={(keys)=>{setCurrentPanels(keys)}}
                                        ghost
                                    >
                                        {
                                            menu?.children?.map((menuchild,f)=>
                                                <Panel className={currentPanels.includes(String(f)) ? 'panel-active panel' : 'panel'}  showArrow={false} header={<Title level={5} className='text-white m-0'>{menuchild?.name}</Title>} key={f} 
                                                    extra={((currentPanels?.findIndex(x=>x==f))>-1) ?
                                                    <MinusOutlined className='text-white' 
                                                        style={{transition: 'transform 0.2s ease-in-out', fontSize: 14}} />
                                                    :
                                                    <PlusOutlined className='text-white' 
                                                        style={{ transition: 'transform 0.2s ease-in-out', fontSize: 14}}/>}
                                                        
                                                >
                                                    <Flex vertical gap={10}>
                                                        {
                                                            menuchild?.innerchildren?.map((innerLink,i)=>
                                                                <NavLink to={innerLink?.path} className='text-white fs-14'>
                                                                    {innerLink?.title}
                                                                </NavLink>
                                                            )
                                                        }
                                                    </Flex>
                                                </Panel>
                                            )
                                        }
                                    </Collapse>
                                </div>
                            </Panel>
                        )
                    }
                </Collapse>

                <Flex justify='center'>
                    <Button className='btn bg-brand mt-3'>
                        <PlusOutlined /> Sell a Business
                    </Button>
                </Flex>
            </div>
        </Drawer>
    )
}

export {MobileNavbar}