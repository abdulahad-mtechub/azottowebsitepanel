import React, { useEffect, useState } from 'react'
import { Card, Flex, Form, Image, message, Tooltip, Typography } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { SingleFileUpload } from '../../Forms';
import imageCompression from 'browser-image-compression';

const { Title, Text } = Typography

const UploadSupportDocStep = ({ data, setData },ref) => {

  const [messageApi, contextHolder] = message.useMessage()
  const [form] = Form.useForm();
  const [uploadingCR, setUploadingCR] = useState(false);
  const [uploadingSupport, setUploadingSupport] = useState(false);
  const [initialCrList, setInitialCrList] = useState([]);
  const [initialSupportList, setInitialSupportList] = useState([]);

  React.useImperativeHandle(ref, () => ({
    validate: async () => {
      // Just validate form fields, CR check is done in parent
      try {
        await form.validateFields();
      } catch (err) {
        console.error('Form validation failed:', err);
        throw err;
      }
      return true;
    },
  }));
  const docToUploadItem = (doc, idx) => ({
    uid: doc.serverId || `doc-${idx}-${Date.now()}`,
    name: doc.fileName || (doc.filePath ? doc.filePath.split("/").pop() : `file-${idx}`),
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
    const docs = Array.isArray(data?.documents) ? data.documents.filter(d => 
      d && (d.filePath || d.fileName) && Object.values(d).some(val => val !== null && val !== '' && val !== undefined)
    ) : [];
    
    // Only find documents that are explicitly titled as CR or Supporting Document
    const crDoc = docs.find(d => d.title === 'Commercial Registration (CR)') || null;
    const supportDocs = docs.filter(d => d.title === 'Supporting Document');

    const crList = crDoc ? [docToUploadItem(crDoc, 0)] : [];
    const supportList = supportDocs.map((d, i) => docToUploadItem(d, i + 1));
    
    setInitialCrList(crList);
    setInitialSupportList(supportList);
    
    setTimeout(() => {
      try {
        form.setFieldsValue({
          uploadcr: crDoc ? [crDoc] : null,
          uploadmult: supportDocs.length > 0 ? supportDocs : [],
        });
      } catch (err) {
        console.warn("setFieldsValue failed:", err);
      }
    }, 0);
  }, [data?.documents, form]);

  const uploadFileToServer = async (file) => {
    try {
      let compressedFile = file;

      if (file.type.startsWith('image/')) {
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
        const extension = fileToUpload.type?.split('/')?.[1] ? `.${fileToUpload.type.split('/')[1]}` : '';
        fileToUpload = new File([fileToUpload], `${file.name || `upload-${Date.now()}`}${extension}`, {
          type: fileToUpload.type || file.type,
        });
      }

      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);

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
        size: file.size,
      };
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

const handleSingleFileUpload = async (fileOrFiles) => {
  setUploadingCR(true);
  try {
    const file = fileOrFiles;
    const fileInfo = await uploadFileToServer(file);

    const crDocument = {
      title: 'Commercial Registration (CR)',
      ...fileInfo,
    };

    const existingDocs = Array.isArray(data.documents) ? [...data.documents] : [];
    const supportDocs = existingDocs.filter(d => d.title !== 'Commercial Registration (CR)');
    
    const updatedDocs = [crDocument, ...supportDocs];

    const updated = { ...data, documents: updatedDocs };
    setData(updated);
    
    setInitialCrList([docToUploadItem(crDocument, 0)]);
    
    form.setFieldsValue({ uploadcr: [crDocument] });
    messageApi.success('Commercial Registration uploaded successfully');
  } catch (err) {
    console.error('handleSingleFileUpload error:', err);
    messageApi.error('Failed to upload Commercial Registration');
  } finally {
    setUploadingCR(false);
  }
};

const handleSingleFileRemove = () => {
  try {
    const existingDocs = Array.isArray(data.documents) ? [...data.documents] : [];
    const supportDocs = existingDocs.filter(d => d.title !== 'Commercial Registration (CR)');
    
    const updated = { ...data, documents: supportDocs };
    setData(updated);
    
    form.setFieldsValue({ uploadcr: null });
  } catch (err) {
    console.error('handleSingleFileRemove error:', err);
  }
};


const handleMultipleFileUpload = async (fileOrFiles) => {
  const normalized = Array.isArray(fileOrFiles) ? fileOrFiles : normalizeFiles(fileOrFiles);
  if (!normalized || normalized.length === 0) return;

  setUploadingSupport(true);
  
  try {
    const uploadPromises = normalized.map(async (file) => {
      try {
        return await uploadFileToServer(file);
      } catch (err) {
        console.error('One file failed to upload:', file.name, err);
        messageApi.error(`Failed to upload ${file.name}`);
        return null;
      }
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    const successful = uploadedFiles.filter(Boolean);
    
    if (successful.length === 0) {
      messageApi.warn('No files uploaded successfully');
      return;
    }

    const newSupportDocs = successful.map((fileInfo) => ({
      title: 'Supporting Document',
      fileName: fileInfo.fileName,
      filePath: fileInfo.filePath,
      fileType: fileInfo.fileType,
      size: fileInfo.size,
    }));

    const existingDocs = Array.isArray(data.documents) ? [...data.documents] : [];
    const crDoc = existingDocs.find(d => d.title === 'Commercial Registration (CR)');
    const existingSupportDocs = existingDocs.filter(d => d.title === 'Supporting Document');
    
    // Merge existing support docs with new ones
    const allSupportDocs = [...existingSupportDocs, ...newSupportDocs];
    const finalDocs = crDoc ? [crDoc, ...allSupportDocs] : allSupportDocs;

    const updated = { ...data, documents: finalDocs };
    setData(updated);

    // Update supporting documents list for UI
    const updatedSupportList = allSupportDocs.map((d, i) => docToUploadItem(d, i + 1));
    setInitialSupportList(updatedSupportList);
    
    // Update form field
    form.setFieldsValue({ uploadmult: allSupportDocs });
    
    messageApi.success(`${successful.length} file(s) uploaded successfully`);
  } catch (err) {
    console.error('handleMultipleFileUpload error:', err);
    messageApi.error('Failed to upload supporting documents');
  } finally {
    setUploadingSupport(false);
  }
};

const handleMultipleFileRemove = (removedFile) => {
  try {
    const updatedDocs = Array.isArray(data.documents) ? [...data.documents] : [];
    const crDoc = updatedDocs.find(d => d.title === 'Commercial Registration (CR)');
    const existingSupportDocs = updatedDocs.filter(d => d.title !== 'Commercial Registration (CR)');
    
    // Find and remove the document by matching file name or path
    const remainingSupportDocs = existingSupportDocs.filter(doc => {
      return !(doc.fileName === removedFile.name || 
               doc.filePath === removedFile.url ||
               doc.filePath === removedFile.name ||
               (removedFile.uid && doc.serverId === removedFile.uid));
    });
    
    // Reconstruct documents array
    const finalDocs = crDoc ? [crDoc, ...remainingSupportDocs] : remainingSupportDocs;
    
    const updated = { ...data, documents: finalDocs };
    setData(updated);
    
    // Update supporting documents list for UI
    const updatedSupportList = remainingSupportDocs.map((d, i) => docToUploadItem(d, i + 1));
    setInitialSupportList(updatedSupportList);
    
    // Update form state with the remaining support documents
    form.setFieldsValue({ uploadmult: remainingSupportDocs });
  } catch (err) {
    console.error('handleMultipleFileRemove error:', err);
  }
};
  return (
    <>
      {contextHolder}
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
              <Flex align='center' gap={5}>
                <Title level={5} className="m-0 fw-500">
                  Commercial Registration (CR)
                </Title>
                <Text type='danger' className='fw-500'>*</Text>
              </Flex>
              <Text className="text-gray">
                Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.
              </Text>
            </Flex>
            <Flex className="w-100">
              <SingleFileUpload
                name={'uploadcr'}
                title={'Upload'}
                onUpload={handleSingleFileUpload}
                onRemove={handleSingleFileRemove}
                uploading={uploadingCR}
                multiple={false}
                required={true}
                message={'Please upload Commercial Registration (CR)'}
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
                name={'uploadmult'}
                title={'Upload'}
                onUpload={handleMultipleFileUpload}
                onRemove={handleMultipleFileRemove}
                uploading={uploadingSupport}
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