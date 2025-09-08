import React,{useState} from 'react'
import { Button, Card, Col, Divider, Flex, Image, Radio, Row, Typography,Upload } from 'antd'
import { message } from "antd";
import {UPLOAD_DOC} from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';
import imageCompression from "browser-image-compression";

const { Text } = Typography
const ConfirmationDocsStep = ({ form, completedeal,deal }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [uploadingDoc, setUploadingDoc] = useState(null); // track which doc is loading
    const [documents, setDocuments] = useState([
      { title: "Commercial Registration (CR)", fileName: "", fileType: "", filePath: "" },
      { title: "Notarized Ownership Transfer Letter", fileName: "", fileType: "", filePath: "" },
    ]);
  
    const [uploadDoc] = useMutation(UPLOAD_DOC);
  
    const handleUpload = async ({ file, title }) => {
      try {
        setUploadingDoc(title);
  
        let processedFile = file;
        if (file.type.startsWith("image/")) {
          processedFile = await imageCompression(file, {
            maxSizeMB: 1,
            maxWidthOrHeight: 1024,
            useWebWorker: true,
          });
        }
  
        // Step 1: Upload to server
        const formData = new FormData();
        formData.append("file", processedFile);
  
        const res = await fetch("https://220.152.66.148.host.secureserver.net/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
  
       // Update state to show file
        setDocuments(prev =>
          prev.map(doc =>
            doc.title === title
              ? { ...doc, fileName: data.fileName, filePath: data.fileUrl, fileType: data.fileType }
              : doc
          )
        );
  
        messageApi.success("File uploaded successfully");
      } catch (err) {
        console.error(err);
        messageApi.error(`Error uploading ${title}`);
      } finally {
        setUploadingDoc(null);
      }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          for (const doc of documents) {
            if (!doc.fileName) continue; // skip empty docs
      
            await uploadDoc({
              variables: {
                input: {
                  businessId: deal?.business?.id, // replace with real ID if needed
                  fileName: doc.fileName,
                  filePath: doc.filePath,
                  fileType: doc.fileType,
                  title: doc.title,
                },
              },
            });
          }
      
          messageApi.success("All documents saved successfully");
        } catch (err) {
          console.error(err);
          messageApi.error("Failed to save documents");
        }
      };
  
    return (
      <Row gutter={[16, 24]}>
        {contextHolder}
  
        {/* Example Receipt */}
        <Col span={24}>
          <Flex vertical gap={10}>
            <Card className="card-cs border-gray rounded-12">
              <Flex justify="space-between" align="center">
                <Flex gap={15}>
                  <Image src="/assets/icons/file.png" preview={false} width={20} />
                  <Flex vertical>
                    <Text className="fs-13 text-gray">Business Transaction Receipt.pdf</Text>
                    <Text className="fs-13 text-gray">5.3 MB</Text>
                  </Flex>
                </Flex>
                <Image src="/assets/icons/download.png" preview={false} width={20} />
              </Flex>
            </Card>
            <Divider />
            <Text className="fs-13 text-gray">
              Have you received the payment in your bank account?
            </Text>
            <Radio.Group>
              <Radio value={1} className="fs-13 text-gray">Yes</Radio>
              <Radio value={2} className="fs-13 text-gray">No</Radio>
            </Radio.Group>
          </Flex>
        </Col>
  
        {/* Document Upload / View */}
        <Col span={24}>
          {completedeal ? (
            <Card className="card-cs border-gray rounded-12">
              <Flex justify="space-between" align="center">
                <Flex gap={15}>
                  <Image src="/assets/icons/file.png" preview={false} width={20} />
                  <Flex vertical>
                    <Text className="fs-13 text-gray">Bank-Statement.png</Text>
                    <Text className="fs-13 text-gray">5.3 MB</Text>
                  </Flex>
                </Flex>
                <Image src="/assets/icons/download.png" preview={false} width={20} />
              </Flex>
            </Card>
          ) : (
            documents.map(doc => (
              <Flex vertical gap={5} className="w-100 mt-2" key={doc.title}>
                <Flex vertical>
                  <Text className="fw-500 fs-14">{doc.title}</Text>
                  <Text className="text-gray">
                    Accepted formats: JPG, PNG, PDF — Max size: 5MB per file.
                  </Text>
                </Flex>
                <Flex className="w-100">
                  {doc.fileName ? (
                    <Card className="card-cs border-gray rounded-12 w-100">
                      <Flex justify="space-between" align="center">
                        <Flex gap={15}>
                          <Image src="/assets/icons/file.png" preview={false} width={20} />
                          <Flex vertical>
                            <Text className="fs-13 text-gray">{doc.fileName}</Text>
                            <Text className="fs-13 text-gray">{doc.fileType}</Text>
                          </Flex>
                        </Flex>
                        <a href={doc.filePath} target="_blank" rel="noopener noreferrer">
                          <Image src="/assets/icons/download.png" preview={false} width={20} />
                        </a>
                      </Flex>
                    </Card>
                  ) : (
                    <Upload
                      beforeUpload={() => false}
                      showUploadList={false}
                      maxCount={1}
                      onChange={info => handleUpload({ file: info.file, title: doc.title })}
                    >
                      <Button
                        className="btn text-black bg-gray border-gray"
                        loading={uploadingDoc === doc.title}
                        aria-labelledby='Upload'
                      >
                        Upload
                      </Button>
                    </Upload>
                  )}
                </Flex>
              </Flex>
            ))
          )}
        </Col>
  
        {!completedeal && (
          <Col span={24}>
            <Flex>
              <Button aria-labelledby='Submit Documents' type="primary" className="btn bg-brand" onClick={handleSubmit}>
                Submit Documents
              </Button>
            </Flex>
          </Col>
        )}
      </Row>
    );
  };

export { ConfirmationDocsStep }