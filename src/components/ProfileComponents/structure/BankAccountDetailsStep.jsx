import { Flex, Typography,Spin } from 'antd';
import { GETUSERACTIVEBANK } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import { MaskedAccount } from '../../ui/MaskedAccount';
import { useTranslation } from 'react-i18next';
import Cookies from "js-cookie";
const { Text } = Typography;

const BankAccountDetailsStep = () => {

  const { t } = useTranslation();
  const userId = Cookies.get("userId");
  const { data:userBank, loading:bankloading } = useQuery(GETUSERACTIVEBANK, {
    variables: { getUserActiveBanksId: userId },
    fetchPolicy: 'network-only',
  });
  const banks=userBank?.getUserActiveBanks

  if (bankloading) {
    return (
        <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
        </Flex>
    );
}
  return (
    <>
      <Flex vertical gap={10}>
        <Text className="fw-600 text-medium-gray fs-13">{t('Bank Account')}</Text>
        {banks ? (
          <div className="deals-status w-100 sky-lightest rounded-12">
            <Flex vertical gap={6}>
              <Text className="fs-15 fw-500 text-gray">{banks.bankName}</Text>
              <Text className="fs-13 text-gray">
                {t('Account Title')}: {banks.accountTitle}
              </Text>
              <MaskedAccount
                iban={banks.iban}
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
