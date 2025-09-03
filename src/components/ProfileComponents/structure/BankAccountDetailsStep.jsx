import React,{ useState } from 'react'
import { Button, Card, Checkbox, Col, Flex, Image, Radio, Row, Typography,message,Spin } from 'antd'
import { SEND_BANK, UPDATE_DEAL} from '../../../graphql/mutation/mutations';
import { GETBANKSFORDEAL } from '../../../graphql/query';
import { useMutation,useQuery } from '@apollo/client';
import {MaskedAccount} from '../../ui/MaskedAccount'

const { Text } = Typography
const BankAccountDetailsStep = ({form,completedeal,user,details}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [sendBank, { loading: sending }] = useMutation(SEND_BANK, {
      onCompleted: () => {
          messageApi.success("Status changed successfully!");
      },
      onError: (err) => {
          messageApi.error(err.message || "Something went wrong!");
      },
  });
  const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
      onCompleted: () => {
          messageApi.success("Status changed successfully!");
      },
      onError: (err) => {
          messageApi.error(err.message || "Something went wrong!");
      },
  });

  const { data, loading: fetching } = useQuery(GETBANKSFORDEAL, {
    variables: { dealId: details?.key },
    fetchPolicy: "network-only", // ensures fresh data
  });
  const buyerBanks = data?.getBankDetailsByDealId ?? [];

  const handleSendAccount = async (bank) => {
      try {
          await sendBank({
              variables: {
                  sendBankToBuyerId: bank.id,        // assuming bank has `id`
              },
          });
          await updateDeals({
              variables: {
                  input: {
                      id: details.key,
                      status: "SELLER_PAYMENT_VERIFICATION_PENDING", // Example status
                  },
              },
          });
      } catch (error) {
          console.error("Send bank error:", error);
      }
  };

  if (updating || sending) {
      return (
          <Flex justify="center" align="center" style={{ height: "200px" }}>
              <Spin size="large" />
          </Flex>
      );
  }
  return (
    <>
    {contextHolder}
    <Flex vertical gap={10}>
        <Text className="fw-600 text-medium-gray fs-13">Bank Account</Text>
        {buyerBanks.length > 0 ? (
            buyerBanks.map((bank, index) => (
                <div key={index} className="deals-status w-100 sky-lightest rounded-12">
                    <Flex vertical gap={6}>
                        <Text className="fs-15 fw-500 text-gray">
                            {bank.bankName}
                        </Text>
                        <Text className="fs-13 text-gray">
                            Account Title: {bank.accountTitle}
                        </Text>
                        <MaskedAccount
                            iban={bank.iban}
                            className="fs-13 text-gray"
                        />
                        <Button
                            type="primary"
                            className="btnsave bg-brand mt-2"
                            onClick={() => handleSendAccount(bank)}
                            disabled={data?.getBankDetailsByDealId?.isSend} 
                        >
                            {data?.getBankDetailsByDealId?.isSend ? "Sent to Buyer" : "Send Account to Buyer"}
                        </Button>
                    </Flex>
                </div>
            ))
        ) : (
            <Text className="fs-13 text-gray">No bank accounts available</Text>
        )}
    </Flex>
    </>
  )
}
export {BankAccountDetailsStep}