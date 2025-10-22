import { Card, Col, Flex, Image, Row, Typography, message } from 'antd';
import { SingleFileUpload } from '../../Forms/SingleFileUpload';
import { useQuery, useMutation } from '@apollo/client';
import { GETADMINACTIVEBANK, GETDEAL } from '../../../graphql/query';
import { UPDATE_DEAL, UPLOAD_DOCUMENT } from '../../../graphql/mutation';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const PayCommissionInprogressStep = ({ form, inprogressdeal }) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const { data } = useQuery(GETADMINACTIVEBANK, {fetchPolicy: 'network-only'});

  const jasoorCommmission = inprogressdeal?.busines?.documents?.find(
    (doc) => doc.title === "Jasoor Commission"
  );
  const [updateOfferStatus] = useMutation(UPDATE_DEAL);

  const [uploadDocument] = useMutation(UPLOAD_DOCUMENT, {
    refetchQueries: [
      { query: GETDEAL, variables: { getDealId: inprogressdeal?.key } },
    ],
    awaitRefetchQueries: true,
    onCompleted: () => messageApi.success(t("Document uploaded successfully!")),
    onError: (err) => messageApi.error(err.message || t("Upload failed!")),
  });

  const paycommissionData = [
    {
      title: t("Jusoor Bank Name"),
      desc: data?.getActiveAdminBank?.accountTitle || t("N/A"),
    },
    {
      title: t("IBAN Number"),
      desc: data?.getActiveAdminBank?.iban || t("N/A"),
    },
    {
      title: t("Commission Amount to Pay"),
      desc: inprogressdeal?.commission || 0,
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

      if (!response.ok) throw new Error(t("Upload failed"));

      const result = await response.json();
      const fileUrl = result.fileUrl || result.url;

      await uploadDocument({
        variables: {
          input: {
            title: t("Jasoor Commission"),
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
      messageApi.error(errorMsg || t("Upload failed!"));
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
                    <Text className="fs-13 text-gray">{t(jasoorCommmission?.title)}</Text>
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
                <Text className="fw-500 fs-14">{t("Upload a bank statement or screenshot")}</Text>
                <Text className="text-gray">
                  {t("Accepted formats: JPG, PNG, PDF. Max size: 5MB per file.")}
                </Text>
              </Flex>
              <Flex className="w-100">
                <SingleFileUpload
                  form={form}
                  name="uploadimge"
                  title={t("Upload")}
                  onUpload={handleSingleFileUpload}
                  multiple={false}
                />
              </Flex>
            </Flex>
          )}
        </Col>
      </Row>
    </>
  );
};

export { PayCommissionInprogressStep };
