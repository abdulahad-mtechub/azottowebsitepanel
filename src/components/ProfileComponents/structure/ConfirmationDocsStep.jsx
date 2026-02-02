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
  Input,
} from "antd";
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

  const [_documents, setDocuments] = useState({});
  const [crUploaded, setCrUploaded] = useState(false);
  const [sellerNote, setSellerNote] = useState("");

  const DOCUMENT_TITLES = {
    CR: ["Commercial Registration (CR)", "السجل التجاري"],
    NOTARIZED_TRANSFER: [
      "Notarized Ownership Transfer Letter",
      "خطاب نقل الملكية الموثق",
      "خطاب نقل الملكية موثق",
    ],
    BUYER_RECEIPT: ["Buyer Payment Receipt", "إيصال دفع المشتري"],
  };

  const findDocument = (key) =>
    details?.busines?.documents?.find((d) =>
      DOCUMENT_TITLES[key].includes(d.title)
    );

  const bankRecipt = findDocument("BUYER_RECEIPT");
  const existingCrDoc = findDocument("CR");
  const existingNotarizedDoc = findDocument("NOTARIZED_TRANSFER");

  useEffect(() => {
    if (existingCrDoc) setCrUploaded(true);
  }, [existingCrDoc]);

  const initialUploadsAllowed =
    details?.isPaymentVedifiedSeller === null
      ? undefined
      : details?.isPaymentVedifiedSeller === true
      ? "yes"
      : "no";

  const [uploadsAllowed, setUploadsAllowed] = useState(initialUploadsAllowed);

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

      const response = await fetch("https://backend-appolo-azotto.mtechub.org/upload", {
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

      if (DOCUMENT_TITLES.CR.includes(title)) setCrUploaded(true);

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
      let noteValue = "";
      modal.confirm({
        centered: true,
        title: t("Confirm No Payment"),
        content: (
          <Flex vertical gap={12}>
            <Text>
              {t(
                "Are you sure you have not received your payment? This action cannot be undone."
              )}
            </Text>
            <Input.TextArea
              placeholder={t("Add a note for the buyer") + " *"}
              rows={4}
              maxLength={500}
              showCount
              onChange={(e) => {
                noteValue = e.target.value;
                setSellerNote(e.target.value);
              }}
              defaultValue={sellerNote}
              style={{ marginBottom: "8px" }}
            />
          </Flex>
        ),
        okText: t("Yes"),
        okType: "danger",
        cancelText: t("Cancel"),
        onOk: async () => {
          try {
            if (!noteValue || noteValue.trim() === "") {
              messageApi.error(t("Please add a note for the buyer"));
              throw new Error("Note is required");
            }

            const titlesToDelete = [];
            if (bankRecipt)
              titlesToDelete.push(DOCUMENT_TITLES.BUYER_RECEIPT[0]);

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
                input: {
                  id: details.key,
                  isPaymentVedifiedSeller: false,
                  sellerNote: noteValue.trim(),
                },
              },
            });

            setSellerNote("");
          } catch (err) {
            console.error("delete error", err);
            throw err;
          }
        },
        onCancel: () => {
          setUploadsAllowed(undefined);
          setSellerNote("");
        },
      });
    } else {
      let noteValue = "";
      modal.confirm({
        centered: true,
        title: t("Confirm No Payment"),
        content: (
          <Flex vertical gap={12}>
            <Text>
              {t("Are you sure you have not received payment from the buyer?")}
            </Text>
            <Input.TextArea
              placeholder={t("Add a note for the buyer")}
              rows={4}
              maxLength={500}
              showCount
              onChange={(e) => {
                noteValue = e.target.value;
                setSellerNote(e.target.value);
              }}
              defaultValue={sellerNote}
              style={{ marginBottom: "8px" }}
            />
          </Flex>
        ),
        okText: t("Yes"),
        okType: "danger",
        cancelText: t("Cancel"),
        onOk: async () => {
          try {
            if (!noteValue || noteValue.trim() === "") {
              messageApi.error(t("Please add a note for the buyer"));
              throw new Error("Note is required");
            }

            await updateDeals({
              variables: {
                input: {
                  id: details.key,
                  isPaymentVedifiedSeller: false,
                  sellerNote: noteValue.trim(),
                },
              },
            });
            setUploadsAllowed("no");
            setSellerNote("");
          } catch (err) {
            console.error("Error updating payment verified:", err);
            messageApi.error(err?.message || t("Failed to update deal"));
            throw err;
          }
        },
        onCancel: () => {
          setUploadsAllowed(undefined);
          setSellerNote("");
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

        {uploadsAllowed === "yes" && (
          <>
            <Col span={24}>
              <Flex vertical gap={16} className="w-100">
                {[
                  { key: "CR", label: t("Commercial Registration (CR)") },
                  {
                    key: "NOTARIZED_TRANSFER",
                    label: t("Notarized Ownership Transfer Letter"),
                  },
                ].map(({ key, label }) => {
                  const existing = findDocument(key);

                  if (existing) {
                    return (
                      <div key={key}>
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
                    key === "NOTARIZED_TRANSFER" && !crUploaded;

                  return (
                    <div key={key}>
                      <Text className="fw-600 text-medium-gray fs-13">
                        {label}
                      </Text>
                      <Card className="card-cs border-gray rounded-12 mt-2">
                        <Flex vertical gap={12}>
                          <SingleFileUpload
                            form={form}
                            name={key === "CR" ? "crUpload" : "notarizedUpload"}
                            title={t("Upload")}
                            onUpload={(file) =>
                              handleSingleFileUpload(
                                file,
                                DOCUMENT_TITLES[key][0]
                              )
                            }
                            multiple={false}
                            message={message}
                            disabled={disableUpload}
                          />
                          {key === "NOTARIZED_TRANSFER" && !crUploaded && (
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
