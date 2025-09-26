// (full component — only important changes highlighted with comments)
import { useState, useEffect } from 'react';
import { Button, Card, Col, Flex, Image, Row, Typography, message,
  Spin, Modal, Radio } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { UPDATE_DEAL, UPLOAD_DOCUMENT, DELETE_DOCUMENTS } from '../../../graphql/mutation';
import { useMutation } from '@apollo/client';
import { SingleFileUpload } from '../../Forms/SingleFileUpload';
import { GETDEAL } from '../../../graphql';

const { Text } = Typography;

const ConfirmationDocsStep = ({ form, details }) => {
  const [modal, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const [documents, setDocuments] = useState({});
  const [crUploaded, setCrUploaded] = useState(false);

  // compute existing docs
  const bankRecipt = details?.busines?.documents?.find(d => d.title === 'Buyer Payment Receipt');
  const existingCrDoc = details?.busines?.documents?.find(d => d.title === 'Commercial Registration (CR)');
  const existingNotarizedDoc = details?.busines?.documents?.find(d => d.title === 'Notarized Ownership Transfer Letter');

  const initialUploadsAllowed = details?.isPaymentVedifiedSeller ? "yes" : 'no';
  const [uploadsAllowed, setUploadsAllowed] = useState(initialUploadsAllowed);

  useEffect(() => {
    if (existingCrDoc) setCrUploaded(true);
  }, [existingCrDoc]);

  const [updateDeals, { loading: updating }] = useMutation(UPDATE_DEAL, {
    refetchQueries: [{ query: GETDEAL, variables: { getDealId: details?.key } }],
    awaitRefetchQueries: true,
    onCompleted: () => messageApi.success('Status changed successfully!'),
    onError: (err) => messageApi.error(err.message || 'Something went wrong!'),
  });

  const [uploadDocument, { loading: uploading }] = useMutation(UPLOAD_DOCUMENT, {
    refetchQueries: [{ query: GETDEAL, variables: { getDealId: details?.key } }],
    onCompleted: () => messageApi.success('Document uploaded successfully!'),
    onError: (err) => messageApi.error(err.message || 'Something went wrong!'),
  });

  const [deleteDocuments, { loading: deleting }] = useMutation(DELETE_DOCUMENTS, {
    refetchQueries: [{ query: GETDEAL, variables: { getDealId: details?.key } }],
    awaitRefetchQueries: true,
    onCompleted: () => {
      messageApi.success('Documents deleted successfully');
      setDocuments({});
      setCrUploaded(false);
      setUploadsAllowed('no'); 
    },
    onError: (err) => {
      messageApi.error(err?.message || 'Failed to delete documents');
    },
  });

  const handleSingleFileUpload = async (file, title) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('https://verify.jusoor-sa.co/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();

      setDocuments(prev => ({
        ...prev,
        [title]: {
          fileName: file.name,
          fileType: file.type,
          filePath: result.fileUrl || result.url,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        }
      }));

      if (title === 'Commercial Registration (CR)') setCrUploaded(true);

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
      console.error('Error uploading file:', error);
      messageApi.error(error.message || 'Upload failed!');
      return false;
    }
  };

  const handleMarkVerified = async () => {
    if (!details?.key) return;
    await updateDeals({
      variables: {
        input: {
          id: details.key,
          isDocVedifiedSeller: true,
        },
      },
    });
  };

  const handleNoSelected = () => {
    modal.confirm({
      centered: true,
      title: 'Delete documents?',
      content: 'Are you sure you want to delete uploaded documents for this business? This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          const titlesToDelete = [];
          if (existingCrDoc) titlesToDelete.push('Commercial Registration (CR)');
          if (existingNotarizedDoc) titlesToDelete.push('Notarized Ownership Transfer Letter');
          if (bankRecipt) titlesToDelete.push('Buyer Payment Receipt');

          if (titlesToDelete.length === 0) {
            messageApi.info('No documents to delete.');
            setUploadsAllowed('no');
            return;
          }

          await deleteDocuments({
            variables: {
              input: {
                businessId: details?.busines?.id,
                titles: titlesToDelete,
              },
            },
          });
        } catch (err) {
          console.error('delete error', err);
        }
      },
      onCancel: () => {
        setUploadsAllowed(null);
      },
    });
  };

  const onRadioChange = async (e) => {
    const val = e.target.value;
    const anyDocsExist = Boolean(existingCrDoc || existingNotarizedDoc || bankRecipt);

    setUploadsAllowed(val);

    if (val === 'no' && anyDocsExist) {
      handleNoSelected();
      return;
    }

    if (val === 'yes') {
      if (details?.isPaymentVerifiedSeller) {
        messageApi.info('Payment already marked as verified by seller.');
        return;
      }

      if (!details?.key) {
        messageApi.error('Deal ID not found.');
        return;
      }

      try {
        await updateDeals({
          variables: {
            input: {
              id: details.key,
              isPaymentVedifiedSeller: true,
            },
          },
        });
      } catch (err) {
        console.error('Error updating payment verified:', err);
        messageApi.error(err?.message || 'Failed to update deal');
      }
    }
  }

  if (updating || uploading || deleting) {
    return (
      <Flex justify="center" align="center" className="h-200">
        <Spin size="large" />
      </Flex>
    );
  }
  console.log('details in ConfirmationDocsStep...', details);
  return (
    <>
      {contextHolder}
      {modalContextHolder}
      <Row gutter={[16, 24]}>
        <Col span={24}>
          <Flex vertical gap={8} className="mb-2">
            <Text className="fw-600 text-medium-gray fs-13">Have you received the buyer payment?</Text>
            <Radio.Group disabled={uploadsAllowed === 'yes'} onChange={onRadioChange} value={uploadsAllowed}>
              <Radio value="yes" checked={details?.isPaymentVedifiedSeller} >Yes</Radio>
              <Radio value="no">No</Radio>
            </Radio.Group>
          </Flex>

          {uploadsAllowed !== 'no' ? (
            bankRecipt ? (
              <>
                <Text className="fw-600 text-medium-gray fs-13">{bankRecipt.title}</Text>
                <Card className="card-cs border-gray rounded-12 mt-2">
                  <Flex justify="space-between" align="center">
                    <Flex gap={15}>
                      <Image src={'/assets/icons/file.png'} alt="file icon" preview={false} width={20} />
                      <Flex vertical>
                        <Text className="fs-13 text-gray">{bankRecipt.title}</Text>
                        <Text className="fs-13 text-gray">{bankRecipt.fileSize || '5.3 MB'}</Text>
                      </Flex>
                    </Flex>
                    <a href={bankRecipt.filePath} target="_blank" rel="noopener noreferrer">
                      <Image src={'/assets/icons/download.png'} alt="download icon" preview={false} width={20} />
                    </a>
                  </Flex>
                </Card>
              </>
            ) : (
              <Text className="fs-13 text-gray">No receipt uploaded</Text>
            )
          ) : null}
        </Col>

        {uploadsAllowed !== 'no' && (
            <>
                <Col span={24}>
                    <Flex vertical gap={16} className="w-100">
                    {['Commercial Registration (CR)', 'Notarized Ownership Transfer Letter'].map((expectedTitle) => {
                        const existing = details?.busines?.documents?.find((d) => d.title === expectedTitle);

                        if (existing) {
                        return (
                            <div key={expectedTitle}>
                            <Text className="fw-600 text-medium-gray fs-13">{existing.title}</Text>
                            <Card className="card-cs border-gray rounded-12 mt-2">
                                <Flex justify="space-between" align="center">
                                <Flex gap={15}>
                                    <Image src={'/assets/icons/file.png'} alt="file icon" preview={false} width={20} />
                                    <Flex vertical>
                                    <Text className="fs-13 text-gray">{existing?.title}</Text>
                                    <Text className="fs-13 text-gray">{existing?.fileSize || '—'}</Text>
                                    </Flex>
                                </Flex>

                                <Flex gap={8} align="center">
                                    <a href={existing.filePath} target="_blank" rel="noopener noreferrer">
                                    <Image src={'/assets/icons/download.png'} alt="download icon" preview={false} width={20} />
                                    </a>
                                </Flex>
                                </Flex>
                            </Card>
                            </div>
                        );
                        }

                        const disableUpload =
                        expectedTitle === 'Notarized Ownership Transfer Letter'
                            ? (!crUploaded && !existingCrDoc) || uploadsAllowed !== 'yes'
                            : uploadsAllowed !== 'yes';

                        return (
                        <div key={expectedTitle}>
                            <Text className="fw-600 text-medium-gray fs-13">{expectedTitle}</Text>
                            <Card className="card-cs border-gray rounded-12 mt-2">
                            <Flex vertical gap={12}>
                                <SingleFileUpload
                                form={form}
                                name={expectedTitle === 'Commercial Registration (CR)' ? 'crUpload' : 'notarizedUpload'}
                                title={"Upload"}
                                onUpload={(file) => handleSingleFileUpload(file, expectedTitle)}
                                multiple={false}
                                message={message}
                                disabled={disableUpload}
                                />
                                {expectedTitle === 'Notarized Ownership Transfer Letter' && (!crUploaded && !existingCrDoc) && (
                                <Text type="secondary" className="fs-12 mt-1">
                                    Please upload Commercial Registration first to enable this upload
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
                    <Flex gap={5} className={details?.isPaymentVerifiedSeller ? 'badge-cs success fs-12 fit-content' : 'badge-cs pending fs-12 fit-content'} align="center">
                    <CheckCircleOutlined className="fs-14" />
                    {details?.isPaymentVerifiedSeller ? 'Seller marked "Payment Received"' : '"Payment Received" Seller Confirmation pending'}
                    </Flex>

                    <Flex>
                    <Button type="primary" className="btnsave bg-brand" onClick={handleMarkVerified} disabled={details?.isDocVedifiedSeller}>
                        Mark as Verified
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