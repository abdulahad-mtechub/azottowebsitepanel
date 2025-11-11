import { useState, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Flex,
  Image,
  Row,
  Typography,
  message,
  Spin,
  Modal,
  Radio,
} from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import {
  UPDATE_DEAL,
  UPLOAD_DOCUMENT,
  DELETE_DOCUMENTS,
} from "../../../graphql/mutation";
import { useMutation } from "@apollo/client";
import { SingleFileUpload } from "../../Forms/SingleFileUpload";
import { GETDEAL } from "../../../graphql";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

const ConfirmationDocsStep = ({ form, details }) => {
  const { t } = useTranslation();
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();
  // eslint-disable-next-line no-unused-vars
  const [documents, setDocuments] = useState({});
  const [crUploaded, setCrUploaded] = useState(false);

  const bankRecipt = details?.busines?.documents?.find(
    (d) =>
      d.title === "Buyer Payment Receipt" || d.title === "إيصال دفع المشتري"
  );

  const existingCrDoc = details?.busines?.documents?.find(
    (d) =>
      d.title === "Commercial Registration (CR)" || d.title === "السجل التجاري"
  );
  const existingNotarizedDoc = details?.busines?.documents?.find(
    (d) =>
      d.title === "Notarized Ownership Transfer Letter" ||
      d.title === "خطاب نقل الملكية الموثق"
  );

  // Initialize based on the actual boolean value: null, true, or false
  const initialUploadsAllowed =
    details?.isPaymentVedifiedSeller === null
      ? undefined
      : details?.isPaymentVedifiedSeller === true
      ? "yes"
      : "no";

  const [uploadsAllowed, setUploadsAllowed] = useState(initialUploadsAllowed);
  useEffect(() => {
    if (existingCrDoc) setCrUploaded(true);
  }, [existingCrDoc]);

  const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
    refetchQueries: [
      { query: GETDEAL, variables: { getDealId: details?.key } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => messageApi.success(t("Status changed successfully!")),
    onError: (err) =>
      messageApi.error(err.message || t("Something went wrong!")),
  });

  const [uploadDocument, { loading: uploading }] = useMutation(
    UPLOAD_DOCUMENT,
    {
      refetchQueries: [
        { query: GETDEAL, variables: { getDealId: details?.key } },
      ],
      onCompleted: () =>
        messageApi.success(t("Document uploaded successfully!")),
      onError: (err) =>
        messageApi.error(err.message || t("Something went wrong!")),
    }
  );

  const [deleteDocuments, { loading: deleting }] = useMutation(
    DELETE_DOCUMENTS,
    {
      refetchQueries: [
        { query: GETDEAL, variables: { getDealId: details?.key } },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => {
        messageApi.success(t("Documents deleted successfully"));
        setDocuments({});
        setCrUploaded(false);
        setUploadsAllowed("no");
      },
      onError: (err) => {
        messageApi.error(err?.message || t("Failed to delete documents"));
      },
    }
  );

  const handleSingleFileUpload = async (file, title) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://verify.jusoor-sa.co/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error(t("Upload failed"));

      const result = await response.json();

      setDocuments((prev) => ({
        ...prev,
        [title]: {
          fileName: file.name,
          fileType: file.type,
          filePath: result.fileUrl || result.url,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
      }));

      if (title === t("Commercial Registration (CR)")) setCrUploaded(true);

      await uploadDocument({
        variables: {
          input: {
            title,
            businessId: details?.busines?.id,
            filePath: result.fileUrl || result.url,
            fileName: file.name,
            fileType: file.type,
          },
        },
      });

      return false;
    } catch (error) {
      console.error("Error uploading file:", error);
      messageApi.error(error.message || t("Upload failed!"));
      return false;
    }
  };

  const handleMarkVerified = async () => {
    if (!details?.key) return;
    await updateDeals({
      variables: { input: { id: details.key, isDocVedifiedSeller: true } },
    });
  };
  const handleNoSelected = () => {
    const anyDocsExist = Boolean(
      existingCrDoc || existingNotarizedDoc || bankRecipt
    );

    if (anyDocsExist) {
      modal.confirm({
        centered: true,
        content: t(
          "Are you sure you have not receiving your payment? This action cannot be undone."
        ),
        okText: t("Yes"),
        okType: "danger",
        cancelText: t("Cancel"),
        onOk: async () => {
          try {
            const titlesToDelete = [];
            if (bankRecipt) titlesToDelete.push(t("Buyer Payment Receipt"));

            if (titlesToDelete.length === 0) {
              messageApi.info(t("No documents to delete."));
              setUploadsAllowed("no");
              return;
            }
            await deleteDocuments({
              variables: { deleteDocumentId: bankRecipt?.id },
            });

            await updateDeals({
              variables: {
                input: { id: details.key, isPaymentVedifiedSeller: false },
              },
            });
          } catch (err) {
            console.error("delete error", err);
          }
        },
        onCancel: () => {
          setUploadsAllowed(undefined);
        },
      });
    } else {
      // No documents exist, just update payment verification to false
      modal.confirm({
        centered: true,
        title: t("Confirm No Payment"),
        content: t(
          "Are you sure you have not received payment from the buyer?"
        ),
        okText: t("Yes"),
        okType: "danger",
        cancelText: t("Cancel"),
        onOk: async () => {
          try {
            await updateDeals({
              variables: {
                input: { id: details.key, isPaymentVedifiedSeller: false },
              },
            });
            setUploadsAllowed("no");
          } catch (err) {
            console.error("Error updating payment verified:", err);
            messageApi.error(err?.message || t("Failed to update deal"));
          }
        },
        onCancel: () => {
          setUploadsAllowed(undefined);
        },
      });
    }
  };

  const onRadioChange = async (e) => {
    const val = e.target.value;

    if (val === "no") {
      handleNoSelected();
      return;
    }

    if (val === "yes") {
      if (details?.isPaymentVerifiedSeller) {
        messageApi.info(t("Payment already marked as verified by seller."));
        return;
      }

      if (!details?.key) {
        messageApi.error(t("Deal ID not found."));
        return;
      }

      try {
        await updateDeals({
          variables: {
            input: { id: details.key, isPaymentVedifiedSeller: true },
          },
        });
        setUploadsAllowed(val);
      } catch (err) {
        console.error("Error updating payment verified:", err);
        messageApi.error(err?.message || t("Failed to update deal"));
      }
    }
  };

  if (updating || uploading || deleting) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <>
      {contextHolder}
      {modalContextHolder}
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Flex vertical gap={8} className="mb-2">
            <Text className="fw-600 text-medium-gray fs-13">
              {t("Have you received the buyer payment?")}
            </Text>
            <Radio.Group
              disabled={uploadsAllowed !== undefined}
              onChange={onRadioChange}
              value={uploadsAllowed}
            >
              <Radio value="yes" checked={details?.isPaymentVedifiedSeller}>
                {t("Yes")}
              </Radio>
              <Radio value="no">{t("No")}</Radio>
            </Radio.Group>
          </Flex>

          {/* Show payment receipt when: null (undefined) or yes. Hide when no */}
          {uploadsAllowed !== "no" &&
            (bankRecipt ? (
              <>
                <Text className="fw-600 text-medium-gray fs-13">
                  {t(bankRecipt.title)}
                </Text>
                <Card className="card-cs border-gray rounded-12 mt-2">
                  <Flex justify="space-between" align="center">
                    <Flex gap={15}>
                      <Image
                        src={"/assets/icons/file.png"}
                        alt={t("file icon")}
                        preview={false}
                        width={20}
                      />
                      <Flex vertical>
                        <Text className="fs-13 text-gray">
                          {t(bankRecipt.title)}
                        </Text>
                        {/* <Text className="fs-13 text-gray">{bankRecipt.fileSize || '5.3 MB'}</Text> */}
                      </Flex>
                    </Flex>
                    <a
                      href={bankRecipt.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={"/assets/icons/download.png"}
                        alt={t("download icon")}
                        preview={false}
                        width={20}
                      />
                    </a>
                  </Flex>
                </Card>
              </>
            ) : (
              <Text className="fs-13 text-gray">
                {t("No receipt uploaded")}
              </Text>
            ))}
        </Col>

        {/* Only show upload sections when YES is selected */}
        {uploadsAllowed === "yes" && (
          <>
            <Col span={24}>
              <Flex vertical gap={16} className="w-100">
                {[
                  t("Commercial Registration (CR)"),
                  t("Notarized Ownership Transfer Letter"),
                ].map((expectedTitle) => {
                  const existing = details?.busines?.documents?.find(
                    (d) =>
                      d.title === expectedTitle ||
                      d.title === expectedTitle.replace(t(""), "")
                  );

                  if (existing) {
                    return (
                      <div key={expectedTitle}>
                        <Text className="fw-600 text-medium-gray fs-13">
                          {t(existing.title)}
                        </Text>
                        <Card className="card-cs border-gray rounded-12 mt-2">
                          <Flex justify="space-between" align="center">
                            <Flex gap={15}>
                              <Image
                                src={"/assets/icons/file.png"}
                                alt={t("file icon")}
                                preview={false}
                                width={20}
                              />
                              <Flex vertical>
                                <Text className="fs-13 text-gray">
                                  {t(existing?.title)}
                                </Text>
                                {/* <Text className="fs-13 text-gray">{existing?.fileSize || '—'}</Text> */}
                              </Flex>
                            </Flex>

                            <Flex gap={8} align="center">
                              <a
                                href={existing.filePath}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Image
                                  src={"/assets/icons/download.png"}
                                  alt={t("download icon")}
                                  preview={false}
                                  width={20}
                                />
                              </a>
                            </Flex>
                          </Flex>
                        </Card>
                      </div>
                    );
                  }

                  const disableUpload =
                    expectedTitle === t("Notarized Ownership Transfer Letter")
                      ? (!crUploaded && !existingCrDoc) ||
                        uploadsAllowed !== "yes"
                      : uploadsAllowed !== "yes";

                  return (
                    <div key={expectedTitle}>
                      <Text className="fw-600 text-medium-gray fs-13">
                        {expectedTitle}
                      </Text>
                      <Card className="card-cs border-gray rounded-12 mt-2">
                        <Flex vertical gap={12}>
                          <SingleFileUpload
                            form={form}
                            name={
                              expectedTitle ===
                              t("Commercial Registration (CR)")
                                ? "crUpload"
                                : "notarizedUpload"
                            }
                            title={t("Upload")}
                            onUpload={(file) =>
                              handleSingleFileUpload(file, expectedTitle)
                            }
                            multiple={false}
                            message={message}
                            disabled={disableUpload}
                          />
                          {expectedTitle ===
                            t("Notarized Ownership Transfer Letter") &&
                            !crUploaded &&
                            !existingCrDoc && (
                              <Text type="secondary" className="fs-12 mt-1">
                                {t(
                                  "Please upload Commercial Registration first to enable this upload"
                                )}
                              </Text>
                            )}
                        </Flex>
                      </Card>
                    </div>
                  );
                })}
              </Flex>
            </Col>
            <Col span={24}>
              <Flex vertical gap={10}>
                {/* <Flex gap={5} className={details?.isPaymentVerifiedSeller ? 'badge-cs success fs-12 fit-content' : 'badge-cs pending fs-12 fit-content'} align="center">
                  <CheckCircleOutlined className="fs-14" />
                  {details?.isPaymentVerifiedSeller ? t('Seller marked "Payment Received"') : t('"Payment Received" Seller Confirmation pending')}
                </Flex> */}

                <Flex>
                  <Button
                    type="primary"
                    className={`btnsave ${
                      details?.isDocVedifiedSeller
                        ? "bg-gray text-white cursor-not-allowed"
                        : "bg-brand text-white"
                    }`}
                    onClick={handleMarkVerified}
                    disabled={details?.isDocVedifiedSeller}
                  >
                    {t("Mark as Verified")}
                  </Button>
                </Flex>
              </Flex>
            </Col>
          </>
        )}
      </Row>
    </>
  );
};

export { ConfirmationDocsStep };
