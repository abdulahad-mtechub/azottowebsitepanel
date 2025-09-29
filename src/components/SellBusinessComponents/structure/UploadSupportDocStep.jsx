import React, { useEffect, useState } from 'react'
import { Card, Flex, Form, Image, Tooltip, Typography } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { SingleFileUpload } from '../../Forms';
import imageCompression from 'browser-image-compression';

const { Title, Text } = Typography

const UploadSupportDocStep = ({ data, setData },ref) => {

  React.useImperativeHandle(ref, () => ({
    validate: () => form.validateFields(),
  }));
  const [form] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [initialCrList, setInitialCrList] = useState([]);
  const [initialSupportList, setInitialSupportList] = useState([]);
  const docToUploadItem = (doc, idx) => ({
    uid: doc.serverId || `doc-${idx}-${Date.now()}`,
    name: doc.fileName || (doc.filePath ? doc.filePath.split("/").pop() : `file-${idx}`),
    size: doc.size || 0,
    status: "done",
    url: doc.filePath || null,
    originFileObj: null,
  });


  useEffect(() => {
    const docs = Array.isArray(data?.documents) ? data.documents : [];
    const crDoc = docs.length > 0 ? docs[0] : null;
    const supportDocs = crDoc ? docs.slice(1) : docs.slice(0);

    setInitialCrList(crDoc ? [docToUploadItem(crDoc, 0)] : []);
    setInitialSupportList(supportDocs.map((d, i) => docToUploadItem(d, i + 1)));
    try {
      form.setFieldsValue({
        uploadcr: crDoc ? (crDoc.filePath || crDoc.fileName) : null,
        uploadmult: supportDocs.length > 0 ? supportDocs.map(d => d.filePath || d.fileName) : [],
      });
    } catch (err) {
      console.warn("setFieldsValue failed:", err);
    }
  }, [data, form]);

  const uploadFileToServer = async (file) => {
    setUploading(true);
    try {
      let compressedFile = file;

      if (file.type.startsWith('image/')) {
        compressedFile = await imageCompression(file, {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        });
      }

      const formData = new FormData();
      formData.append('file', compressedFile);

      const res = await fetch('https://verify.jusoor-sa.co/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');

      const data = await res.json();

      return {
        fileName: data.fileName,
        fileType: data.fileType,
        filePath: data.fileUrl,
      };
    } catch (err) {
      console.error(err);
      throw err;
    } finally {
      setUploading(false);
    }
  };

const handleSingleFileUpload = async (fileOrFiles) => {
  // SingleFileUpload will pass a File (not an array) for multiple=false
  try {
    const file = fileOrFiles; // single File
    // perform upload in parent (uploadFileToServer already exists in your code)
    const fileInfo = await uploadFileToServer(file);

    const updatedDocs = Array.isArray(data.documents) ? [...data.documents] : [];
    updatedDocs[0] = {
      title: 'Commercial Registration (CR)',
      ...fileInfo,
    };

    const updated = { ...data, documents: updatedDocs };
    setData(updated);
  } catch (err) {
    console.error('handleSingleFileUpload error:', err);
  }
};


// multiple supporting docs
const handleMultipleFileUpload = async (fileOrFiles) => {
  // SingleFileUpload will pass an Array<File> for multiple=true
  const normalized = Array.isArray(fileOrFiles) ? fileOrFiles : normalizeFiles(fileOrFiles);
  if (!normalized || normalized.length === 0) return;

  try {
    // Parent uploads all files in parallel
    const uploadedFiles = await Promise.all(
      normalized.map((file) =>
        uploadFileToServer(file).catch((err) => {
          console.error('One file failed to upload:', file.name, err);
          return null;
        })
      )
    );

    const successful = uploadedFiles.filter(Boolean);
    if (successful.length === 0) {
      message.warn('No files uploaded successfully');
      return;
    }

    const otherDocs = successful.map((fileInfo) => ({
      title: 'Supporting Document',
      fileName: fileInfo.fileName,
      filePath: fileInfo.filePath,
      fileType: fileInfo.fileType,
      size: fileInfo.size,
      serverId: fileInfo.serverId || null,
    }));

    // Preserve CR (index 0) if exists
    const firstDoc = Array.isArray(data.documents) && data.documents.length > 0 ? data.documents[0] : null;
    const newDocs = firstDoc ? [firstDoc, ...otherDocs] : [...otherDocs];

    const updated = { ...data, documents: newDocs };
    setData(updated);

  } catch (err) {
    console.error('handleMultipleFileUpload error:', err);
  }
};
  return (
    <>
      <Flex justify='space-between' className='mb-3' gap={5} wrap align='flex-start'>
        <Flex vertical gap={1}>
          <ModuleTopHeading level={4} name='Upload supporting documents' />
          <Text className='text-gray'>Verified data builds buyer confidence.</Text>
        </Flex>
        <Flex className='pill-round' gap={8} align='center'>
          <Image src="/assets/icons/info-b.png" preview={false} width={16} alt="info icon" />
          <Text className='fs-12 text-sky'>For any query, contact us on +966 543 543 654</Text>
        </Flex>
      </Flex>

      <Form layout="vertical" form={form} requiredMark={false}>
        <Card className="shadow-d radius-12 border-gray mb-3">
          <Flex vertical gap={5} className="w-100">
            <Flex vertical>
              <Title level={5} className="m-0 fw-500">
                Commercial Registration (CR)
              </Title>
              <Text className="text-gray">
                Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleFileUpload
                form={form}
                name={'uploadcr'}
                title={'Upload'}
                onUpload={handleSingleFileUpload}
                uploading={uploading}
                multiple={false}
                initialFileList={initialCrList}
              />
            </Flex>
          </Flex>
        </Card>

        <Card className="shadow-d radius-12 border-gray mb-3">
          <Flex vertical gap={5} className="w-100">
            <Flex vertical>
              <Title level={5} className="m-0 fw-500">
                Upload Other Supporting Documents{' '}
                <Tooltip title="Info">
                  <img src="/assets/icons/info-outline.png"  width={14} alt="info-icon" fetchPriority="high" />
                </Tooltip>
              </Title>
              <Text className="text-gray">
                Accepted formats: PDF, JPG, PNG, DOCX, XLSX. Max size: 10MB per file.
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleFileUpload
                form={form}
                name={'uploadmult'}
                title={'Upload'}
                onUpload={handleMultipleFileUpload}
                uploading={uploading}
                multiple={true}
                initialFileList={initialSupportList}
              />
            </Flex>
          </Flex>
        </Card>
      </Form>
    </>
  );
};

export {UploadSupportDocStep}