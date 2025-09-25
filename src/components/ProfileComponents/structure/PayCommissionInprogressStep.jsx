import { Card, Col, Flex, Image, Row, Typography,message } from 'antd'
import { SingleFileUpload } from '../../Forms/SingleFileUpload'
import { useQuery ,useMutation} from '@apollo/client';
import {useState} from 'react'
import { GETADMINACTIVEBANK,GETDEAL } from '../../../graphql/query';
import { UPDATE_DEAL, UPLOAD_DOCUMENT } from '../../../graphql/mutation';


const { Text } = Typography
const PayCommissionInprogressStep = ({ form, inprogressdeal }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const [documents, setDocuments] = useState(null);
    const { data } = useQuery(GETADMINACTIVEBANK);

  const jasoorCommmission = inprogressdeal?.busines?.documents?.find(
    (doc) => doc.title === "Jasoor Commission"
  );

    const [updateOfferStatus] = useMutation(UPDATE_DEAL);
  
    const [uploadDocument] = useMutation(UPLOAD_DOCUMENT, {
      refetchQueries: [
        { query: GETDEAL, variables: { getDealId: inprogressdeal?.key } },
      ],
      awaitRefetchQueries: true,
      onCompleted: () => messageApi.success("Document uploaded successfully!"),
      onError: (err) => messageApi.error(err.message || "Upload failed!"),
    });

    function calculateCommission(price) {
      if (!price) return 0;
    
      if (price < 50000) {
        return 2000;
      }
    
      let commission = 0;
    
      if (price > 2000000) {
        commission += (price - 2000000) * 0.015;
        price = 2000000;
      }
      if (price > 500000) {
        commission += (price - 500000) * 0.025;
        price = 500000;
      }
      if (price > 100000) {
        commission += (price - 100000) * 0.03;
        price = 100000;
      }
      if (price > 0) {
        commission += price * 0.04;
      }
      return commission;
    }
    
    const commission = calculateCommission(inprogressdeal?.offerprice);
  
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
  
    const handleSingleFileUpload = async (file) => {
      try {
        const formData = new FormData();
        formData.append("file", file);
  
        const response = await fetch("https://verify.jusoor-sa.co/upload", {
          method: "POST",
          body: formData,
        });
  
        if (!response.ok) throw new Error("Upload failed");
  
        const result = await response.json();
        const fileUrl = result.fileUrl || result.url;
  
        setDocuments({
          fileName: file.name,
          fileType: file.type,
          filePath: fileUrl,
          fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        });

        await uploadDocument({
          variables: {
            input: {
              title: "Jasoor Commission",
              businessId: inprogressdeal?.busines?.id,
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
  
        return false;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        messageApi.error(errorMsg || "Upload failed!");
        return false;
      }
    };

    return (
      <>
       {contextHolder}
       <Row gutter={[16, 24]}>
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
                  <Image src="/assets/icons/file.png" alt='file icon' preview={false} width={20} />
                  <Flex vertical>
                    <Text className="fs-13 text-gray">{jasoorCommmission?.title}</Text>
                  </Flex>
                </Flex>
                <a
                  href={jasoorCommmission?.filePath}
                  target="_blank"
                  rel="noreferrer"
                  className="fs-13 text-blue-500 underline"
                >
                  <Image
                    src={"/assets/icons/download.png"}
                    preview={false}
                    width={16}
                    alt='download icon'
                    className='cursor'
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