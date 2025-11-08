import { Card, Col, Flex, Image, Row, Typography, message } from 'antd';
import { SingleFileUpload } from '../../Forms/SingleFileUpload';
import { GETDEAL } from '../../../graphql/query';
import { useMutation } from '@apollo/client';
import { UPDATE_DEAL, UPLOAD_DOCUMENT } from '../../../graphql/mutation';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PayBusinessAmountstep = ({ form, inprogressdeal, bank }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const bankRecipt = inprogressdeal?.busines?.documents?.find(
    (doc) => doc.title === t("Buyer Payment Receipt")
  );
  console.log("bankRecipt", inprogressdeal);
  const [updateOfferStatus] = useMutation(UPDATE_DEAL, {
    onError: (err) => console.error("Error updating offer status:", err),
  });

  const [uploadDocument] = useMutation(UPLOAD_DOCUMENT, {
    refetchQueries: [
      { query: GETDEAL, variables: { getDealId: inprogressdeal?.key } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => messageApi.success(t("Document uploaded successfully!")),
    onError: (err) => messageApi.error(err.message || t("Upload failed!")),
  });

  const paybusinessData = [
    { title: t("Seller’s Bank Name"), desc: bank?.bankName },
    { title: t("Seller’s IBAN"), desc: bank?.iban },
    { title: t("Account Holder Name"), desc: bank?.accountTitle },
    { title: t("Amount to Pay"), desc: inprogressdeal?.finalizedOffer },
  ];

  const handleSingleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("https://verify.jusoor-sa.co/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(t("Upload failed"));

      const result = await response.json();
      const fileUrl = result.fileUrl || result.url;

      await uploadDocument({
        variables: {
          input: {
            title: t("Buyer Payment Receipt"),
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
            isPaymentVedifiedSeller: null,
            status: "SELLER_PAYMENT_VERIFICATION_PENDING",
          },
        },
      });

      return false;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      messageApi.error(errorMsg || t("Upload failed!"));
      return false;
    }
  };

  return (
    <>
      {contextHolder}
      <Row gutter={[16, 24]}>
        {paybusinessData?.map((list, index) => (
          <Col xs={24} sm={12} md={6} lg={6} key={index}>
            <Flex vertical gap={4}>
              <Text className='fw-500 fs-14'>{list?.title}</Text>
              <Text className='fs-14 text-gray'>{list?.desc}</Text>
            </Flex>
          </Col>
        ))}

        <Col span={24}>
          {bankRecipt ? (
            <Card className='card-cs border-gray rounded-12'>
              <Flex justify='space-between' align='center'>
                <Flex gap={15}>
                  <Image src={'/assets/icons/file.png'} alt='file icon' preview={false} width={20} />
                  <Flex vertical>
                    <Text className="fs-13 text-gray">{t(bankRecipt.title)}</Text>
                  </Flex>
                </Flex>
                <a href={bankRecipt.filePath} target="_blank" rel="noreferrer" className="fs-13 text-blue-500 underline">
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
            <Flex vertical gap={5} className='w-100'>
              <Flex vertical>
                <Text className='fw-500 fs-14'>{t("Upload a bank statement or screenshot")}</Text>
                <Text className='text-gray'>
                  {t("Accepted formats: JPG, PNG, PDF. Max size: 5MB per file.")}
                </Text>
              </Flex>
              <Flex className='w-100'>
                <SingleFileUpload
                  form={form}
                  name={'uploadimge'}
                  title={t("Upload")}
                  onUpload={handleSingleFileUpload}
                  multiple={false}
                  message={message}
                />
              </Flex>
            </Flex>
          )}
        </Col>
      </Row>
    </>
  );
};

export { PayBusinessAmountstep };
