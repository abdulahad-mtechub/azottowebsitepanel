import React,{useState} from 'react'
import { Button, Checkbox, Col, Flex, Row, Typography } from 'antd'
import {FINALIZE_DEAL} from '../../../graphql/mutation'
import { useMutation } from '@apollo/client'
import { message } from "antd";
import { GETDEAL } from '../../../graphql';

const { Text } = Typography
const SellerFinalDealsStep = ({details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [finalizDeal] = useMutation(FINALIZE_DEAL, {
        refetchQueries: [
            {query: GETDEAL, variables: { getDealId: details?.key }},
        ],
        awaitRefetchQueries: true,
    });
    console.log("details.....", details);
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
                    id: details.key,
                    status: "SELLERCOMPLETED",
                    isSellerCompleted: true
                },
            }
            });
          
      
          messageApi.success("All documents saved successfully");
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save documents");
        }
    };
    const dealBusiness = details?.busines?.documents;
    const uploadDocs = dealBusiness.length === 4;
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
                    !uploadDocs && (
                        <>
                            <Col span={24}>
                                <Checkbox 
                                 checked={isConfirmed || details?.isSellerCompleted}
                                 onChange={(e) => setIsConfirmed(e.target.checked)}
                                 disabled={details?.isSellerCompleted}
                                >
                                   I confirm that payment is received and documents have been submitted.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button aria-labelledby='Notify Jusoor to Finalize' type="primary" className='btn bg-brand' onClick={handleSubmit}
                                    disabled={details?.isSellerCompleted}
                                    >
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