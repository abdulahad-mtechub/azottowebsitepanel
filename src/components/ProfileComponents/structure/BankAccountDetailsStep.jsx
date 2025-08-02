import React from 'react'
import { useState } from 'react'
import { Button, Card, Checkbox, Col, Flex, Image, Radio, Row, Typography } from 'antd'

const { Text } = Typography
const BankAccountDetailsStep = ({form,completedeal}) => {
  const [selectedCard, setSelectedCard] = useState('Master Card');

  const cards = ['Master Card', 'Visa Card', 'Debit Card'];
    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Select Bank Account</Text>
                    <Text className='fs-13 text-gray'>Choose one of your saved bank accounts to receive the payment from the buyer. This account will be shared with the buyer after platform commission is confirmed.</Text>
                </Flex>
               <Radio.Group 
      value={selectedCard} 
      onChange={(e) => setSelectedCard(e.target.value)}
      style={{ width: '100%' }}
    >
      {cards.map((card, i) => (
        <Card className='card-cs border-gray rounded-12 mb-2' key={i}>
          <Flex justify='space-between' align='center'>
            <Flex vertical>
              <Text className='fs-13 text-gray'>{card}</Text>
              <Text className='fs-13 text-gray'>
                DE89 **** **** **** **** 00
              </Text>
            </Flex>
            <Radio value={card} />
          </Flex>
        </Card>
      ))}
    </Radio.Group>
            </Col>
            <>
                {
                    !completedeal && (
                        <>
                            <Col span={24}>
                                <Flex>
                                    <Button type="primary" className='btn bg-brand'>
                                       Send Bank Details
                                    </Button>
                                </Flex>
                            </Col>
                        </>
                    )
                }
            </>
        </Row>
    )
}

export {BankAccountDetailsStep}