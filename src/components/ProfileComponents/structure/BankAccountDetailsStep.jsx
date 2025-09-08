import { useState } from 'react'
import { Button, Card, Col, Flex, Radio, Row, Typography } from 'antd'

const { Text } = Typography
const BankAccountDetailsStep = ({form,completedeal,user}) => {
  const [selectedCard, setSelectedCard] = useState('Master Card');
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
      {user?.banks.map((card, i) => (
        <Card className='card-cs border-gray rounded-12 mb-2' key={i}>
          <Flex justify='space-between' align='center'>
            <Flex vertical>
              <Text className='fs-13 text-gray'>{card?.cardType}</Text>
              <Text className='fs-13 text-gray'>
              {maskCardNumber(card?.cardNumber)}
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
                                    <Button aria-labelledby='Send Bank Details' type="primary" className='btn bg-brand'>
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

function maskCardNumber(cardNumber = '') {
  if (cardNumber.length < 6) return cardNumber; // too short to mask properly

  const first4 = cardNumber.slice(0, 4);
  const last2 = cardNumber.slice(-2);

  // replace middle digits with groups of stars and spaces for better readability
  return `${first4} **** **** **${last2}`;
}