import { useState } from 'react';
import { Card, Row, Col, Typography, Dropdown, Button, Image, message, Modal } from 'antd';
import { GETUSERBANK } from '../../../graphql/query';
import { useQuery, useMutation } from '@apollo/client';
import { AddWalletModal } from '../modal';
import { ACTIVEBANK, DELETEBANK } from '../../../graphql/mutation/mutations';

const { Title, Text } = Typography;

const SellerWallet = ({ addwalletvisible, setAddWalletVisible }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [deletemodal, setDeleteModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);

  const { data: bankData } = useQuery(GETUSERBANK);

  const [activateBankMutate] = useMutation(ACTIVEBANK, {
    refetchQueries: [{ query: GETUSERBANK }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success('Bank status updated successfully');
    },
    onError: (err) => {
      messageApi.error(err.message);
    },
  });

  const [deleteBankMutate, { loading: deleting }] = useMutation(DELETEBANK, {
    refetchQueries: [{ query: GETUSERBANK }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success('Bank deleted successfully');
      setDeleteModal(false);
      setSelectedBankId(null);
    },
    onError: (err) => {
      messageApi.error(err.message);
    },
  });

  const data = (bankData?.getUserBanks || []).map((bank, index) => ({
    key: bank?.id || index,
    bankname: bank?.bankName,
    title: bank?.accountTitle || 'N/A',
    accountnumber: bank?.accountNumber,
    expirydate: bank?.createdAt,
    isActive: Boolean(bank?.isActive),
  }));

  const handleSetActive = (bankId) => {
    activateBankMutate({ variables: { setActiveBankId: bankId } });
  };

  const handleDeleteBank = (bankId) => {
    if (!bankId) {
      messageApi.error('No bank selected for deletion');
      return;
    }
    deleteBankMutate({ variables: { deleteBankId: bankId } });
  };

  return (
    <>
      {contextHolder}
      <Card className="border-gray">
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Title level={5} className="m-0">
              Saved Accounts
            </Title>
          </Col>

          {data?.map((wallet) => {
            const items = [
              {
                key: 'remove',
                label: (
                  <Text>
                    Remove Account
                  </Text>
                ),
                onClick: () => {
                  setSelectedBankId(wallet.key);
                  setDeleteModal(true);
                },
              },
              {
                key: 'toggleActive',
                label: (
                  <Text>
                    {wallet.isActive ? 'Inactive' : 'Active'}
                  </Text>
                ),
                onClick: () => handleSetActive(wallet.key),
              },
            ];

            return (
              <Col xs={24} sm={24} md={12} lg={12} key={wallet.key}>
                <Card className="walletCard">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Image src="/assets/icons/home.png" width={35} preview={false} alt="bank-icon" />
                        <Title level={5} className="m-0 text-white fw-normal">
                          {wallet.bankname}
                        </Title>
                      </div>

                      <Dropdown menu={{ items }} trigger={['click']}>
                        <Button aria-label="dropdown icon" className="bg-transparent border-0 p-0">
                          <img src="/assets/icons/line-dot.png" alt="dropdown-icon" width={25} />
                        </Button>
                      </Dropdown>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Title level={5} className="m-0 text-white fw-500">
                          {wallet.title}
                        </Title>
                        <Text className="fs-16 text-white">{wallet.accountnumber}</Text>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Text className="text-white fs-14">Expires</Text>
                        <Text className="fs-12 text-white">{wallet.expirydate}</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>
      <AddWalletModal visible={addwalletvisible} onClose={() => setAddWalletVisible(false)} />
      <Modal
        title="Remove Bank Account?"
        visible={deletemodal}
        centered
        onCancel={() => {
          setDeleteModal(false);
          setSelectedBankId(null);
        }}
        onOk={() => handleDeleteBank(selectedBankId)}
        okText="Yes, Remove Account"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete this bank account? This action cannot be undone, and any active deals won’t be able to send payments to this account.
        </p>
      </Modal>
    </>
  );
};

export { SellerWallet };