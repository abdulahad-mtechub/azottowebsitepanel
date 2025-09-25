// Final version: DigitalSaleAgreementStep.jsx (JSX)
import React, { useEffect, useState } from 'react';
import { Card, Checkbox, Col, Flex, Image, Row, Typography, message, Spin } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { BUYERINPROGRESSDEALS, GETDEAL, UPDATE_DEAL } from '../../../graphql/';
import { useMutation } from '@apollo/client';
import Cookies from "js-cookie";

const { Text } = Typography;

const DigitalSaleAgreementStep = ({ details }) => {
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();
  const userId = Cookies.get("userId");
  const isBuyer = userId === details?.buyerId;
  console.log('details in DSA step...', details);
  const [buyerSigned, setBuyerSigned] = useState(!!details?.isDsaBuyer);
  const [sellerSigned, setSellerSigned] = useState(!!details?.isDsaSeller);

  useEffect(() => {
    setBuyerSigned(!!details?.isDsaBuyer); 
    setSellerSigned(!!details?.isDsaSeller);
  }, [details?.isDsaBuyer, details?.isDsaSeller]);

  const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
    refetchQueries: [
        isBuyer ?  { query: BUYERINPROGRESSDEALS,
          variables: {
            limit: 10,
            offset: 0,
            search: '',
          },
          fetchPolicy: 'network-only',
        } :
        { query: GETDEAL, variables: { getDealId: details?.key } }
    ],
    awaitRefetchQueries: true,
    onCompleted: () => messageApi.success("Status changed successfully!"),
    onError: (err) => messageApi.error(err.message || "Something went wrong!"),
  });

  const handleTermsChange = async (e) => {
    const checked = !!e.target.checked;
    const updatedBuyer = isBuyer ? checked : buyerSigned;
    const updatedSeller = !isBuyer ? checked : sellerSigned;

    if (isBuyer) setBuyerSigned(checked);
    else setSellerSigned(checked);
    const variables = {
      input: {
        id: details?.key || null,
        isDsaBuyer: updatedBuyer,
        isDsaSeller: updatedSeller,
      },
    };

    try {
      await updateDeals({ variables });
    } catch (err) {
      // rollback optimistic update on error
      if (isBuyer) setBuyerSigned(!!details?.isDsaBuyer);
      else setSellerSigned(!!details?.isDsaSeller);
      // onError will show message (because it's set in useMutation) but also show fallback:
      if (!err?.message) messageApi.error("Failed to update agreement status");
    }
  };

  if (updating) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }
   const handleConfirmChange = (e) => {
    setConfirmChecked(!!e.target.checked);
  };
  return (
    <>
      {contextHolder}
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Flex vertical gap={0} className="mb-3">
            <Text className="fw-600 fs-14">Downloads Digital Sale Agreement</Text>
            <Text className="fs-13 text-gray" italic>
              This agreement outlines the final terms of the business transfer. Please review the details carefully before proceeding.
            </Text>
          </Flex>

          <Card className="card-cs border-gray rounded-12">
            <Flex justify="space-between" align="center">
              <Flex gap={15}>
                <Image src={'/assets/icons/file.png'} alt="file icon" preview={false} width={20} />
                <Flex vertical>
                  <Text className="fs-13 text-gray">Digital Sale Agreement.pdf</Text>
                  <Text className="fs-13 text-gray">5.3 MB</Text>
                </Flex>
              </Flex>
              <Image src={'/assets/icons/download.png'} alt="download icon" preview={false} width={20} />
            </Flex>
          </Card>
        </Col>

        <Col span={24}>
          <Flex vertical gap={3}>
            <Checkbox
                className="fit-content"
                checked={(isBuyer ? buyerSigned : sellerSigned) || updating 
                   || confirmChecked }
                disabled={(isBuyer ? buyerSigned : sellerSigned) || updating} // keep disabled if already signed or updating
                onChange={handleConfirmChange} // CHANGED
            >
                I confirm the business details are correct.
            </Checkbox>

            {/* CHANGED: Accept terms checkbox - only the current actor can click it */}
            <Checkbox
              className="fit-content"
              checked={isBuyer ? buyerSigned : sellerSigned} // CHANGED
              disabled={ (isBuyer ? buyerSigned : sellerSigned) || updating || !confirmChecked } 
              onChange={handleTermsChange}
            >
              I accept the terms of the agreement and agree to proceed.
            </Checkbox>
          </Flex>
        </Col>

        <Col span={24}>
          <Flex vertical gap={10}>
            {/* Status badges: show both sides statuses */}
            {details?.isDsaSeller && details?.isDsaBuyer ? null : (
              <>
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
  );
};

export { DigitalSaleAgreementStep };