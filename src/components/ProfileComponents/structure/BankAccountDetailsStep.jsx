import React, { useState } from 'react';
import { Button, Card, Checkbox, Col, Flex, Image, Radio, Row, Typography, message, Spin } from 'antd';
import { SEND_BANK, UPDATE_DEAL } from '../../../graphql/mutation/mutations';
import { ME } from '../../../graphql/query';
import { useMutation, useQuery } from '@apollo/client';
import { MaskedAccount } from '../../ui/MaskedAccount';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const BankAccountDetailsStep = ({ form, completedeal, user, details }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, loading, error } = useQuery(ME, {
    variables: { getUserId: details?.busines?.seller.id },
  });

  const buyerBank = data?.getUser?.banks?.find(bank => bank.isActive);

  return (
    <>
      {contextHolder}
      <Flex vertical gap={10}>
        <Text className="fw-600 text-medium-gray fs-13">{t('Bank Account')}</Text>
        {buyerBank ? (
          <div className="deals-status w-100 sky-lightest rounded-12">
            <Flex vertical gap={6}>
              <Text className="fs-15 fw-500 text-gray">{buyerBank.bankName}</Text>
              <Text className="fs-13 text-gray">
                {t('Account Title')}: {buyerBank.accountTitle}
              </Text>
              <MaskedAccount
                iban={buyerBank.iban}
                className="fs-13 text-gray"
              />
            </Flex>
          </div>
        ) : (
          <Text className="fs-13 text-gray">{t('No bank accounts available')}</Text>
        )}
      </Flex>
    </>
  );
};

export { BankAccountDetailsStep };
