import { useState } from 'react'
import { Col, Flex, Row, Typography } from 'antd'
import { Segmented } from 'antd'
import { Sellerwork } from './Sellerwork'
import { Buyework } from './Buyework'

const { Title } = Typography

const HowWork = () => {
    const [activeTab, setActiveTab] = useState('Seller')

    const handleTabChange = (value) => {
        setActiveTab(value)
    }

    return (
        <div className='feature bg-light-brand'>
            <div className='container'>
                <Row gutter={[24, 24]}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag bg-secondary fw-500 text-brand'>How Jusoor Works</div>
                            <Title className='m-0' level={2}>
                                A Simple Way to <span className='text-brand'>Buy or Sell a Business</span>
                            </Title>
                        </Flex>
                    </Col>
                    <Col span={24}>
                        <Flex justify="center">
                            <Segmented
                                className='custom-segment'
                                options={['Seller', 'Buyer']}
                                value={activeTab}
                                onChange={handleTabChange}
                                optionRender={(option) => <button type="button">{option}</button>}
                            />
                        </Flex>

                        <div className="text-center mt-4">
                            {activeTab === 'Seller' && <Sellerwork />}
                            {activeTab === 'Buyer' && <Buyework /> }
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { HowWork }
