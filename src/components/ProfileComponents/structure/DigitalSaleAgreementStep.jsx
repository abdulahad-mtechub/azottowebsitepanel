import React from 'react'
import { Card, Checkbox, Col, Flex, Image, Row, Typography,message,Spin } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { GET_BUSINESS, UPDATE_DEAL } from '../../../graphql/';
import { useMutation } from '@apollo/client';
import Cookies from "js-cookie";

const { Text } = Typography
const DigitalSaleAgreementStep = ({form,completedeal,details}) => {
    const [messageApi, contextHolder] = message.useMessage();
    const userId = Cookies.get("userId"); 

    const isBuyer = userId === completedeal?.buyerId;
    let isSigned
    if (isBuyer) {
        isSigned = details?.isDsaBuyer;
    }
    else {
        isSigned = details?.isDsaSeller;
    }

    const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
        refetchQueries: [
            { query: GET_BUSINESS, variables: { getBusinessByIdId: details?.businessId, limit: null, offset: null, search: null, status: null } },
        ],
        awaitRefetchQueries: true,
        onCompleted: () => messageApi.success("Status changed successfully!"),
        onError: (err) => messageApi.error(err.message || "Something went wrong!"),
    });

    const handleTermsChange = (e) => {
      if (e.target.checked) {
        let newStatus;
        if (!details?.isDsaBuyer) {
            newStatus = 'DSA_FROM_SELLER_PENDING';
        } else if (!details?.isDsaSeller) {
            newStatus = 'DSA_FROM_BUYER_PENDING';
        } else {
            newStatus = 'BANK_DETAILS_FROM_SELLER_PENDING';
        }

        updateDeals({
            variables: {
                input: {
                    id: details?.key || null,
                    status: newStatus,
                    isDsaBuyer: isBuyer ? true : details?.isDsaBuyer,
                    isDsaSeller: !isBuyer ? true : details?.isDsaSeller,
                }
            }
        });
      }
    };
    if (updating) {
      return (
        <Flex justify="center" align="center" className='h-200'>
          <Spin size="large" />
        </Flex>
      );
    }
    return (
      <>
      {contextHolder}
        <Row gutter={[16, 24]}>
          <Col span={24}>
                    <Flex vertical gap={0} className='mb-3'>
                        <Text className='fw-600 fs-14'>Downloads Digital Sale Agreement</Text>
                        <Text className='fs-13 text-gray' italic>This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding.</Text>
                    </Flex>
                    <Card className='card-cs border-gray rounded-12' >
                        <Flex justify='space-between' align='center'>
                            <Flex gap={15}>
                                <Image src={'/assets/icons/file.png'} alt='file icon' preview={false} width={20} />
                                <Flex vertical>
                                    <Text className='fs-13 text-gray'>
                                        Digital Sale Agreement.pdf
                                    </Text>
                                    <Text className='fs-13 text-gray'>
                                        5.3 MB
                                    </Text>
                                </Flex>
                            </Flex>
                            <Image src={'/assets/icons/download.png'} alt='download icon' preview={false} width={20} />
                        </Flex>
                    </Card>
            </Col>
            <Col span={24}>
            <Flex vertical gap={3}>
              <Checkbox
                  className='fit-content'
                  checked={isSigned}
                  disabled={isSigned}
              >
                  I confirm the business details are correct.
              </Checkbox>
              <Checkbox
                  className='fit-content'
                  checked={isSigned}
                  disabled={isSigned}
                  onChange={handleTermsChange} // only this triggers the mutation
              >
                  I accept the terms of the agreement and agree to proceed.
              </Checkbox>
            </Flex>
          </Col>
          <Col span={24}>
            <Flex vertical gap={10}>
              {/* Case 1: Both signed → show nothing */}
              {details?.isDsaSeller && details?.isDsaBuyer ? null : (
                <>
                  {/* Case 2: Neither signed */}
                  {!details?.isDsaSeller && !details?.isDsaBuyer && (
                    <>
                      <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Waiting for seller to sign the sales agreement
                      </Flex>
                      <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Waiting for buyer to sign the sales agreement
                      </Flex>
                    </>
                  )}

                  {/* Case 3: Seller signed, buyer not signed */}
                  {details?.isDsaSeller && !details?.isDsaBuyer && (
                    <>
                      <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Waiting for buyer to sign the sales agreement
                      </Flex>
                      <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Seller accepted the "Sale Agreement"
                      </Flex>
                    </>
                  )}

                  {/* Case 4: Buyer signed, seller not signed */}
                  {!details?.isDsaSeller && details?.isDsaBuyer && (
                    <>
                      <Flex gap={5} className="badge-cs pending fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Waiting for seller to sign the sales agreement
                      </Flex>
                      <Flex gap={5} className="badge-cs success fs-12 fit-content" align="center">
                        <CheckCircleOutlined className="fs-14" /> Buyer accepted the "Sale Agreement"
                      </Flex>
                    </>
                  )}
                </>
              )}
            </Flex>
            </Col>
        </Row>
      </>
    )
}

export {DigitalSaleAgreementStep}