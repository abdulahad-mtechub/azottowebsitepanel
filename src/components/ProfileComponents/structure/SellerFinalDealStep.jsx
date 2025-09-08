import React,{useState} from 'react'
import { Button, Checkbox, Col, Flex, Row, Typography } from 'antd'
import {FINALIZE_DEAL} from '../../../graphql/mutation'
import { useMutation } from '@apollo/client'
import { message } from "antd";

const { Text } = Typography
const SellerFinalDealsStep = ({form,completedeal,deal}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [finalizDeal] = useMutation(FINALIZE_DEAL);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isConfirmed) {
            messageApi.error('Please confirm payment and documents before submitting.');
            return;
          }
        try {

            setLoading(true);
            await finalizDeal({
                variables:{
                input: {
                    id: deal.id, // replace with real ID if needed
                    status: "WAITING",
                },
            }
            });
          
      
          messageApi.success("All documents saved successfully");
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save documents");
        }
      };
    return (
        <Row gutter={[16, 24]}>
            {contextHolder}
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Confirmation</Text>
                    <Text className='fs-13 text-gray'>Once you’ve received payment and uploaded all required documents, you can now mark this deal as completed. The Jusoor admin will verify everything before finalizing.</Text>
                </Flex>
            </Col>
            <>
                {
                    !completedeal && (
                        <>
                            <Col span={24}>
                                <Checkbox 
                                 checked={isConfirmed}
                                 onChange={(e) => setIsConfirmed(e.target.checked)}
                                >
                                   I confirm that payment is received and documents have been submitted.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button aria-labelledby='Notify Jusoor to Finalize' type="primary" className='btn bg-brand' onClick={handleSubmit}>
                                        Notify Jusoor to Finalize
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

export {SellerFinalDealsStep}