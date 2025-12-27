import { useState } from "react";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Image,
  message,
  Modal,
  Switch,
  Flex,
  Spin,
} from "antd";
import { GETUSERBANK } from "../../../graphql/query";
import { useQuery, useMutation } from "@apollo/client";
import { AddWalletModal } from "../modal";
import { ACTIVEBANK, DELETEBANK } from "../../../graphql/mutation/mutations";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

const SellerWallet = ({ addwalletvisible, setAddWalletVisible }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const [deletemodal, setDeleteModal] = useState(false);
  const [selectedBankId, setSelectedBankId] = useState(null);
  const [activatingBankId, setActivatingBankId] = useState(null);

  const { data: bankData } = useQuery(GETUSERBANK);

  const [activateBankMutate] = useMutation(ACTIVEBANK, {
    refetchQueries: [{ query: GETUSERBANK }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Bank status updated successfully"));
      setActivatingBankId(null);
    },
    onError: (err) => {
      messageApi.error(err.message);
      setActivatingBankId(null);
    },
  });

  const [deleteBankMutate, { loading: deleting }] = useMutation(DELETEBANK, {
    refetchQueries: [{ query: GETUSERBANK }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success(t("Bank deleted successfully"));
      setDeleteModal(false);
      setSelectedBankId(null);
    },
    onError: (err) => messageApi.error(err.message),
  });

  const data = (bankData?.getUserBanks || []).map((bank, index) => ({
    key: bank?.id || index,
    bankname: bank?.bankName,
    title: bank?.accountTitle || t("N/A"),
    accountnumber: bank?.accountNumber,
    iban: bank?.iban,
    isActive: Boolean(bank?.isActive),
  }));

  const handleSetActive = (bankId) => {
    setActivatingBankId(bankId);
    activateBankMutate({ variables: { setActiveBankId: bankId } });
  };

  const handleDeleteBank = (bankId) => {
    if (!bankId) {
      messageApi.error(t("No bank selected for deletion"));
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
              {t("Saved Accounts")}
            </Title>
          </Col>

          {data?.map((wallet) => {
            const isLoading = activatingBankId === wallet.key;

            return (
              <Col xs={24} sm={24} md={12} lg={12} key={wallet.key}>
                <Card
                  className="walletCard"
                  style={{
                    position: "relative",
                    opacity: isLoading ? 0.6 : 1,
                    pointerEvents: isLoading ? "none" : "auto",
                  }}
                >
                  {isLoading && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(16, 23, 40, 0.5)",
                        borderRadius: "12px",
                        zIndex: 10,
                      }}
                    >
                      <Spin size="large" />
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 30,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <Image
                          src="/assets/icons/home.png"
                          width={35}
                          preview={false}
                          alt="bank-icon"
                        />
                        <Title level={5} className="m-0 text-white fw-normal">
                          {wallet?.bankname}
                        </Title>
                      </div>

                      <Flex gap={10} align="center">
                        <Switch
                          checkedChildren={t("Active")}
                          unCheckedChildren={t("Inactive")}
                          checked={wallet.isActive}
                          disabled={wallet.isActive || isLoading}
                          onChange={() => handleSetActive(wallet.key)}
                          style={{
                            backgroundColor: "#101728",
                          }}
                        />
                        <Button
                          aria-label="delete bank account"
                          className="bg-transparent border-0 p-0"
                          disabled={isLoading}
                          onClick={() => {
                            setSelectedBankId(wallet.key);
                            setDeleteModal(true);
                          }}
                        >
                          <Image
                            src="/assets/icons/delete.png"
                            alt="delete-icon"
                            width={30}
                            preview={false}
                            style={{
                              cursor: isLoading ? "not-allowed" : "pointer",
                            }}
                          />
                        </Button>
                      </Flex>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 5,
                        }}
                      >
                        <Title level={5} className="m-0 text-white fw-500">
                          {wallet.title}
                        </Title>
                        <Text className="fs-16 text-white">{wallet.iban}</Text>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Card>

      <AddWalletModal
        visible={addwalletvisible}
        onClose={() => setAddWalletVisible(false)}
      />

      <Modal
        title={t("Remove Bank Account?")}
        visible={deletemodal}
        centered
        onCancel={() => {
          setDeleteModal(false);
          setSelectedBankId(null);
        }}
        onOk={() => handleDeleteBank(selectedBankId)}
        okText={t("Yes, Remove Account")}
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText={t("Cancel")}
      >
        <p>
          {t(
            "Are you sure you want to delete this bank account? This action cannot be undone, and any active deals won’t be able to send payments to this account."
          )}
        </p>
      </Modal>
    </>
  );
};

export { SellerWallet };
