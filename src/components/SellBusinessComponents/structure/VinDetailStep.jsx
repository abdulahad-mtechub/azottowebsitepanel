import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {
  Card,
  Col,
  Flex,
  Form,
  Image,
  Row,
  Tooltip,
  Typography,
  message,
} from "antd";
import { MyInput, SingleFileUpload } from "../../Forms";
import { ModuleTopHeading } from "../../Pagecomponents";
import imageCompression from "browser-image-compression";
import { useTranslation } from "react-i18next";
import { useFormatNumber } from "../../../hooks";
import { useMutation } from "@apollo/client";
import {
  CREATE_VIN_PASSPORT,
  CREATE_DOCUMENT,
} from "../../../graphql/mutation/mutations";

const { Title, Text } = Typography;

const VinDetailStep = forwardRef(({ data, setData }, ref) => {
  const { t } = useTranslation();
  const { formatPhone } = useFormatNumber();
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [uploadForm] = Form.useForm();
  const [uploadingCR, setUploadingCR] = useState(false);
  const [uploadingSupport, setUploadingSupport] = useState(false);
  const [initialCrList, setInitialCrList] = useState([]);
  const [initialSupportList, setInitialSupportList] = useState([]);
  const [createVinPassport] = useMutation(CREATE_VIN_PASSPORT);
  const [createDocument] = useMutation(CREATE_DOCUMENT);

  useImperativeHandle(ref, () => ({
    validate: async () => {
      await form.validateFields();
      await uploadForm.validateFields();

      const docs = Array.isArray(data?.documents) ? data.documents : [];
      const crDoc = docs.find(
        (d) => d.title === "Vehicle Registration" && d.filePath,
      );

      if (!crDoc) {
        messageApi.error(t("Please upload Vehicle Registration document"));
        throw new Error(t("Vehicle Registration document is required"));
      }

      if (!data?.vinNumber) {
        messageApi.error(t("Please enter VIN number"));
        throw new Error(t("VIN is required"));
      }

      let vinPassportId = data?.vinPassportId || null;
      if (!vinPassportId) {
        const { data: vinData } = await createVinPassport({
          variables: { input: { vin: data.vinNumber } },
        });
        vinPassportId = vinData?.createVinPassport?.id || null;
        if (!vinPassportId) {
          messageApi.error(t("Failed to create VIN passport"));
          throw new Error(t("VIN passport creation failed"));
        }
        setData((prev) => ({ ...prev, vinPassportId }));
      }

      const docsToCreate = docs.filter(
        (d) =>
          d &&
          (d.fileUrl || d.filePath) &&
          !d.documentId,
      );

      if (docsToCreate.length > 0) {
        const created = await Promise.all(
          docsToCreate.map(async (doc) => {
            const { data: docData } = await createDocument({
              variables: {
                input: {
                  vinPassportId,
                  fileName: doc.fileName || "",
                  fileType: doc.fileType || "",
                  fileUrl: doc.fileUrl || doc.filePath || "",
                },
              },
            });
            return {
              ...doc,
              documentId: docData?.createDocument?.id || null,
            };
          }),
        );

        const updatedDocs = docs.map((doc) => {
          const match = created.find(
            (c) =>
              (c.fileUrl || c.filePath) === (doc.fileUrl || doc.filePath) &&
              c.fileName === doc.fileName,
          );
          return match ? { ...doc, documentId: match.documentId } : doc;
        });

        setData((prev) => ({ ...prev, documents: updatedDocs }));
      }

      return true;
    },
  }));

  const handleFormChange = (_, allValues) => {
    setData((prev) => ({
      ...prev,
      vinNumber: allValues.vinNumber,
    }));
  };

  const docToUploadItem = (doc, idx) => ({
    uid: doc.serverId || `doc-${idx}-${Date.now()}`,
    name:
      doc.fileName ||
      (doc.filePath ? doc.filePath.split("/").pop() : `file-${idx}`),
    size: doc.size || 0,
    status: "done",
    url: doc.filePath || null,
    originFileObj: null,
  });

  const normalizeFiles = (fileOrFiles) => {
    if (!fileOrFiles) return [];
    return Array.isArray(fileOrFiles) ? fileOrFiles : [fileOrFiles];
  };

  useEffect(() => {
    const docs = Array.isArray(data?.documents)
      ? data.documents.filter(
          (d) =>
            d &&
            (d.filePath || d.fileName) &&
            Object.values(d).some(
              (val) => val !== null && val !== "" && val !== undefined,
            ),
        )
      : [];

    const crDoc = docs.find((d) => d.title === "Vehicle Registration") || null;
    const supportDocs = docs.filter((d) => d.title === "Supporting Document");

    const crList = crDoc ? [docToUploadItem(crDoc, 0)] : [];
    const supportList = supportDocs.map((d, i) => docToUploadItem(d, i + 1));

    setInitialCrList(crList);
    setInitialSupportList(supportList);

    setTimeout(() => {
      try {
        uploadForm.setFieldsValue({
          uploadcr: crDoc ? [crDoc] : null,
          uploadmult: supportDocs.length > 0 ? supportDocs : [],
        });
      } catch (err) {
        console.warn("setFieldsValue failed:", err);
      }
    }, 0);
  }, [data?.documents, uploadForm]);

  const uploadFileToServer = async (file) => {
    try {
      let compressedFile = file;

      if (file.type.startsWith("image/")) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }

      let fileToUpload = compressedFile;

      if (compressedFile && !(compressedFile instanceof File)) {
        fileToUpload = new File([compressedFile], file.name, {
          type: compressedFile.type || file.type,
        });
      }

      if (!fileToUpload.name) {
        const extension = fileToUpload.type?.split("/")?.[1]
          ? `.${fileToUpload.type.split("/")[1]}`
          : "";
        fileToUpload = new File(
          [fileToUpload],
          `${file.name || `upload-${Date.now()}`}${extension}`,
          {
            type: fileToUpload.type || file.type,
          },
        );
      }

      const formData = new FormData();
      formData.append("file", fileToUpload, fileToUpload.name);

      const res = await fetch(
        "https://backend-appolo-azotto.mtechub.org/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      return {
        fileName: data.fileName,
        fileType: data.fileType,
        filePath: data.fileUrl,
        fileUrl: data.fileUrl,
        size: file.size,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleSingleFileUpload = async (fileOrFiles) => {
    if (uploadingSupport) {
      messageApi.warning(
        t("Please wait for support documents to finish uploading"),
      );
      return;
    }

    setUploadingCR(true);
    try {
      const file = fileOrFiles;
      const fileInfo = await uploadFileToServer(file);

      const crDocument = {
        title: "Vehicle Registration",
        ...fileInfo,
        fileUrl: fileInfo.fileUrl || fileInfo.filePath,
      };

      const existingDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const supportDocs = existingDocs.filter(
        (d) => d.title === "Supporting Document",
      );

      const updatedDocs = [crDocument, ...supportDocs];

      setData({ ...data, documents: updatedDocs });
      setInitialCrList([docToUploadItem(crDocument, 0)]);
      uploadForm.setFieldsValue({ uploadcr: [crDocument] });
      messageApi.success(t("Vehicle Registration uploaded successfully"));
    } catch (err) {
      console.error("handleSingleFileUpload error:", err);
      messageApi.error(t("Failed to upload Vehicle Registration"));
    } finally {
      setUploadingCR(false);
    }
  };

  const handleSingleFileRemove = () => {
    if (uploadingSupport) {
      messageApi.warning(
        t("Please wait for support documents to finish uploading"),
      );
      return;
    }

    try {
      const existingDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const supportDocs = existingDocs.filter(
        (d) => d.title === "Supporting Document",
      );

      setData({ ...data, documents: supportDocs });
      setInitialCrList([]);
      uploadForm.setFieldsValue({ uploadcr: null });
    } catch (err) {
      console.error("handleSingleFileRemove error:", err);
    }
  };

  const handleMultipleFileUpload = async (fileOrFiles) => {
    if (uploadingCR) {
      messageApi.warning(
        t("Please wait for Commercial Registration to finish uploading"),
      );
      return;
    }

    const normalized = Array.isArray(fileOrFiles)
      ? fileOrFiles
      : normalizeFiles(fileOrFiles);
    if (!normalized || normalized.length === 0) return;

    setUploadingSupport(true);

    try {
      const uploadPromises = normalized.map(async (file) => {
        try {
          return await uploadFileToServer(file);
        } catch (err) {
          console.error("One file failed to upload:", file.name, err);
          messageApi.error(
            t("Failed to upload {{fileName}}", { fileName: file.name }),
          );
          return null;
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      const successful = uploadedFiles.filter(Boolean);

      if (successful.length === 0) {
        messageApi.warn(t("No files uploaded successfully"));
        return;
      }

      const newSupportDocs = successful.map((fileInfo) => ({
        title: "Supporting Document",
        fileName: fileInfo.fileName,
        filePath: fileInfo.filePath,
        fileUrl: fileInfo.fileUrl || fileInfo.filePath,
        fileType: fileInfo.fileType,
        size: fileInfo.size,
      }));

      const existingDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const crDoc = existingDocs.find(
        (d) => d.title === "Vehicle Registration",
      );
      const existingSupportDocs = existingDocs.filter(
        (d) => d.title === "Supporting Document",
      );

      const allSupportDocs = [...existingSupportDocs, ...newSupportDocs];
      const finalDocs = crDoc ? [crDoc, ...allSupportDocs] : allSupportDocs;

      setData({ ...data, documents: finalDocs });

      const updatedSupportList = allSupportDocs.map((d, i) =>
        docToUploadItem(d, i + 1),
      );
      setInitialSupportList(updatedSupportList);

      uploadForm.setFieldsValue({ uploadmult: allSupportDocs });

      messageApi.success(
        t("{{count}} file(s) uploaded successfully", {
          count: successful.length,
        }),
      );
    } catch (err) {
      console.error("handleMultipleFileUpload error:", err);
      messageApi.error(t("Failed to upload supporting documents"));
    } finally {
      setUploadingSupport(false);
    }
  };

  const handleMultipleFileRemove = (removedFile) => {
    if (uploadingCR) {
      messageApi.warning(
        t("Please wait for Commercial Registration to finish uploading"),
      );
      return;
    }

    try {
      const updatedDocs = Array.isArray(data.documents)
        ? [...data.documents]
        : [];
      const crDoc = updatedDocs.find(
        (d) => d.title === "Vehicle Registration",
      );
      const existingSupportDocs = updatedDocs.filter(
        (d) => d.title === "Supporting Document",
      );

      const remainingSupportDocs = existingSupportDocs.filter((doc) => {
        return !(
          doc.fileName === removedFile.name ||
          doc.filePath === removedFile.url ||
          doc.filePath === removedFile.name ||
          (removedFile.uid && doc.serverId === removedFile.uid)
        );
      });

      const finalDocs = crDoc
        ? [crDoc, ...remainingSupportDocs]
        : remainingSupportDocs;

      setData({ ...data, documents: finalDocs });

      const updatedSupportList = remainingSupportDocs.map((d, i) =>
        docToUploadItem(d, i + 1),
      );
      setInitialSupportList(updatedSupportList);

      uploadForm.setFieldsValue({ uploadmult: remainingSupportDocs });
    } catch (err) {
      console.error("handleMultipleFileRemove error:", err);
    }
  };

  return (
    <>
      {contextHolder}
      <Flex
        justify="space-between"
        className="mb-3"
        gap={10}
        wrap
        align="flex-start"
      >
        <Flex vertical gap={1}>
          <ModuleTopHeading level={4} name={t("Enter VIN")} />
          <Text className="text-gray">
            {t("Enter the vehicle VIN to begin verification")}
          </Text>
        </Flex>
        <Flex className="pill-round" gap={8} align="center">
          <Image
            src="/assets/icons/info-b.png"
            preview={false}
            width={16}
            alt={t("info icon")}
          />
          <Text className="fs-12 text-sky">
            {t("For any query, contact us on")} {formatPhone("+090078601")}
          </Text>
        </Flex>
      </Flex>

      <Card className="shadow-d radius-12 border-gray">
        <Form layout="vertical" form={form} onValuesChange={handleFormChange}>
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12}>
              <MyInput
                label={t("VIN Number")}
                labelClassName="text-black"
                name="vinNumber"
                required
                message={t("Please enter vin number")}
                placeholder={t("Write vin number")}
                rules={[
                  { required: true, message: t("VIN is required") },
                  { min: 17, message: t("VIN must be 17 characters") },
                ]}
              />
            </Col>
          </Row>
        </Form>
      </Card>

      <Flex
        justify="space-between"
        className="mb-3 mt-4"
        gap={5}
        wrap
        align="flex-start"
      >
        <Flex vertical gap={1}>
          <ModuleTopHeading
            level={4}
            name={t("Upload supporting documents")}
          />
          <Text className="text-gray">
            {t("Verified data builds buyer confidence.")}
          </Text>
        </Flex>
      </Flex>

      <Form layout="vertical" form={uploadForm} requiredMark={false}>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={12}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Vehicle Registration")}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t(
                      "Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.",
                    )}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadcr"}
                    title={t("Upload")}
                    onUpload={handleSingleFileUpload}
                    onRemove={handleSingleFileRemove}
                    uploading={uploadingCR}
                    multiple={false}
                    required={true}
                    message={t("Please upload Vehicle Registration")}
                    initialFileList={initialCrList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Ownership Proof")}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t(
                      "Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.",
                    )}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadcr"}
                    title={t("Upload")}
                    onUpload={handleSingleFileUpload}
                    onRemove={handleSingleFileRemove}
                    uploading={uploadingCR}
                    multiple={false}
                    required={true}
                    message={t("Please upload Ownership Proof")}
                    initialFileList={initialCrList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Insurance Certificate")}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t(
                      "Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.",
                    )}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadcr"}
                    title={t("Upload")}
                    onUpload={handleSingleFileUpload}
                    onRemove={handleSingleFileRemove}
                    uploading={uploadingCR}
                    multiple={false}
                    required={true}
                    message={t("Please upload Ownership Proof")}
                    initialFileList={initialCrList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Invoice / Purchase Bill")}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t(
                      "Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.",
                    )}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadcr"}
                    title={t("Upload")}
                    onUpload={handleSingleFileUpload}
                    onRemove={handleSingleFileRemove}
                    uploading={uploadingCR}
                    multiple={false}
                    required={true}
                    message={t("Please upload Invoice / Purchase Bill")}
                    initialFileList={initialCrList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={24}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Upload Other Supporting Documents")}{" "}
                      <Tooltip
                        title={t(
                          "Optional: Upload additional documents to support your listing",
                        )}
                      >
                        <img
                          src="/assets/icons/info-outline.png"
                          width={14}
                          alt={t("info-icon")}
                          fetchPriority="high"
                        />
                      </Tooltip>
                    </Title>
                  </Flex>
                  <Text className="text-gray">
                    {t(
                      "Accepted formats: PDF, JPG, PNG, DOCX, XLSX. Max size: 10MB per file.",
                    )}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
        </Row>
        <Title>Image Uploads</Title>
        <Row gutter={24}>
          <Col xs={24} sm={24} md={8}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Front View")}{" "}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t("Accepted formats: JPG, PNG. Max size: 10MB per file.")}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Back View")}{" "}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t("Accepted formats: JPG, PNG. Max size: 10MB per file.")}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Side Views")}{" "}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t("Accepted formats: JPG, PNG Max size: 10MB per file.")}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Interior View")}{" "}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t("Accepted formats: JPG, PNG. Max size: 10MB per file.")}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Engine / Odometer")}{" "}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t("Accepted formats: JPG, PNG. Max size: 10MB per file.")}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card className="shadow-d radius-12 border-gray mb-3">
              <Flex vertical gap={5} className="w-100">
                <Flex vertical>
                  <Flex align="center" gap={5}>
                    <Title level={5} className="m-0 fw-500">
                      {t("Additional Images")}{" "}
                    </Title>
                    <Text className="fw-500">*</Text>
                  </Flex>
                  <Text className="text-gray">
                    {t("Accepted formats: JPG, PNG. Max size: 10MB per file.")}
                  </Text>
                </Flex>
                <Flex className="w-100">
                  <SingleFileUpload
                    name={"uploadmult"}
                    title={t("Upload")}
                    onUpload={handleMultipleFileUpload}
                    onRemove={handleMultipleFileRemove}
                    uploading={uploadingSupport}
                    multiple={true}
                    required={false}
                    initialFileList={initialSupportList}
                  />
                </Flex>
              </Flex>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
});

export { VinDetailStep };
