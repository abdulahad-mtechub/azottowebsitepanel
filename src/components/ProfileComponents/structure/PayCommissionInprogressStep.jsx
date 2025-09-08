import { Button, Card, Col, Flex, Image, Row, Typography,message } from 'antd'
import { SingleFileUpload } from '../../Forms/SingleFileUpload'
import { useQuery ,useMutation} from '@apollo/client';
import React,{useState} from 'react'
import {GETADMINACTIVEBANK,GET_BUSINESS } from '../../../graphql/query';
import { UPDATE_DEAL, UPLOAD_DOCUMENT } from '../../../graphql/mutation';


const { Text } = Typography
const PayCommissionInprogressStep = ({ form, inprogressdeal, details, selectedOfferId, setMeeting }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState(null);
    // Query active admin bank
    const { loading:adminBankLoad, error:bankError, data } = useQuery(GETADMINACTIVEBANK);
    const { data:business, loading:businessLoading, error:businessError } = useQuery(GET_BUSINESS, {
        variables: { 
            getBusinessByIdId: inprogressdeal?.businessId,
            limit: null,
            offset: null,
            search: null,
            status: null
        },
    });
  const dealBusiness = business?.getBusinessById?.business

  const jasoorCommmission = dealBusiness?.documents?.find(
    (doc) => doc.title === "Jasoor Commission"
  );

    // Mutation to update offer status
    const [updateOfferStatus] = useMutation(UPDATE_DEAL, {
      onCompleted: () => {
        messageApi.success("Offer accepted");
        setMeeting(true);
      },
      onError: (err) => messageApi.error(err.message || "Something went wrong"),
    });
  
    // Mutation to upload document
    const [uploadDocument, { loading: uploading }] = useMutation(UPLOAD_DOCUMENT, {
      onCompleted: () => messageApi.success("Document uploaded successfully!"),
      onError: (err) => messageApi.error(err.message || "Upload failed!"),
    });
  
    // Handle accepting the offer
    // const handleAcceptOffer = async () => {
    //   try {
        
    //   } catch (err) {
    //     console.error("Error accepting offer:", err);
    //   }
    // };
  
    const commission = inprogressdeal?.offerprice * 0.16;
  
    const paycommissionData = [
      {
        title: "Jusoor Bank Name",
        desc: data?.getActiveAdminBank?.accountTitle || "N/A",
      },
      {
        title: "IBAN Number",
        desc: data?.getActiveAdminBank?.iban || "N/A",
      },
      {
        title: "Commission Amount to Pay",
        desc: commission || 0,
      },
    ];
  
    // File upload handler
    const handleSingleFileUpload = async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        // Upload file to server
        const response = await fetch("https://220.152.66.148.host.secureserver.net/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) throw new Error("Upload failed");
  
        const result = await response.json();
        const fileUrl = result.fileUrl || result.url;
  
        // Save uploaded file info to state
        setDocuments({
          fileName: file.name,
          fileType: file.type,
          filePath: fileUrl,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        });
  
        // Call GraphQL mutation to save file info
        await uploadDocument({
          variables: {
            input: {
              title: "Buyer Payment Receipt",
              businessId: details?.businessId,
              filePath: fileUrl,
              fileName: file.name,
              fileType: file.type,
            },
          },
        });

        await updateOfferStatus({
            variables: {
              input: {
                id: inprogressdeal?.key,
                status: "COMMISSION_VERIFICATION_PENDING",
              },
            },
        });
  
        return false; // Prevent default upload behavior
      } catch (error) {
        messageApi.error(error || "Upload failed!");
        return false;
      }
    };
  
    return (
      <>
       {contextHolder}
       <Row gutter={[16, 24]}>
        {/* Display bank + commission info */}
        {paycommissionData?.map((list, index) => (
          <Col xs={24} sm={12} md={6} lg={8} key={index}>
            <Flex vertical gap={0}>
              <Text className="fw-500 fs-14">{list?.title}</Text>
              <Text className="fs-14 text-gray">{list?.desc}</Text>
            </Flex>
          </Col>
        ))}
  
        <Col span={24}>
          {jasoorCommmission ? (
            <Card className="card-cs border-gray rounded-12">
              <Flex justify="space-between" align="center">
                <Flex gap={15}>
                  <Image src="/assets/icons/file.png" preview={false} width={20} />
                  <Flex vertical>
                    <Text className="fs-13 text-gray">{jasoorCommmission.title}</Text>
                  </Flex>
                </Flex>
                <a
                  href={jasoorCommmission.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="fs-13 text-blue-500 underline"
                >
                  <Image
                    src={"/assets/icons/download.png"}
                    preview={false}
                    width={16}
                    style={{ cursor: "pointer" }}
                />
                </a>
              </Flex>
            </Card>
          ) : (
            <Flex vertical gap={5} className="w-100">
              <Flex vertical>
                <Text className="fw-500 fs-14">Upload a bank statement or screenshot</Text>
                <Text className="text-gray">
                  Accepted formats: JPG, PNG, PDF. Max size: 5MB per file.
                </Text>
              </Flex>
              <Flex className="w-100">
              <SingleFileUpload
                    form={form}
                    name="uploadimge"
                    title="Upload"
                    onUpload={handleSingleFileUpload}
                    multiple={false}
                />
              </Flex>
            </Flex>
          )}
        </Col>
  
        {/* {!inprogressdeal && (
          <Col span={24}>
            <Flex>
              <Button
                type="primary"
                className="btn bg-brand"
                onClick={handleAcceptOffer}
                disabled={uploading || !documents}
              >
                Submit Payment
              </Button>
            </Flex>
          </Col>
        )} */}
      </Row>
      </>
     
    );
  };

export {PayCommissionInprogressStep}