import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography,message } from 'antd'
import { useMutation } from '@apollo/client';
import { UPDATE_DEAL } from '../../../graphql/mutation';
import { GETDEAL } from '../../../graphql';

const { Text } = Typography
const FinalDealsStep = ({inprogressdeal}) => {

const [messageApi, contextHolder] = message.useMessage();
const uploadDocs = inprogressdeal?.busines?.documents || [];
const allowedTitles = [
    "Commercial Registration (CR)",
    "Notarized Ownership Transfer Letter"
];
    
const documents = uploadDocs.filter(doc =>
    allowedTitles.includes(doc.title?.trim())
);

const [updatedeal] = useMutation(UPDATE_DEAL,{
    onCompleted: () => {
        messageApi.success("Deal marked as completed from your end. Jusoor will verify shortly.")
    },
    onError: (err) => {
        console.error("Error updating offer status:", err);
    },
    refetchQueries: [{ query: GETDEAL, variables: { getDealId: inprogressdeal?.key } }],
});

return (
    <>
    {contextHolder}
    <Row gutter={[16, 24]}>
        <Col span={24}>
            <Flex vertical gap={0} className='mb-3'>
                <Text className='fw-600 fs-14'>Document Received Confirmation</Text>
                <Text className='fs-13 text-gray'>The seller has uploaded final documents. Please review and confirm you’ve received all required legal materials before the deal is finalized.</Text>
            </Flex>
            {documents?.map((doc, i) => (
            <Card className="card-cs border-gray rounded-12 mb-2" key={i}>
                <Flex justify="space-between" align="center">
                    <Flex gap={15}>
                        <Image
                            src={"/assets/icons/file.png"}
                            preview={false}
                            width={20}
                            alt='file icon'
                        />
                        <Flex vertical>
                            <Text className="fs-13 text-gray">{doc.title}</Text>
                            <Text className="fs-13 text-gray">
                                {(doc.size / 1024 / 1024).toFixed(2)} MB
                            </Text>
                        </Flex>
                    </Flex>

                    <a href={doc.filePath} download target="_blank" rel="noopener noreferrer">
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
            ))}

        </Col>
        <>
            {!inprogressdeal?.isBuyerCompleted && (
                    <>
                        <Col span={24}>
                            <Checkbox>
                                I confirm that I’ve received and reviewed the final transfer documents.
                            </Checkbox>
                        </Col>
                        <Col span={24}>
                            <Flex>
                                <Button 
                                aria-labelledby='Notify Jusoor a Finalize' 
                                type="primary" 
                                className='btn bg-brand'
                                onClick={async () => {
                                    try {
                                      await updatedeal({
                                        variables: {
                                          input: {
                                            id: inprogressdeal?.key,
                                            status: "BUYERCOMPLETED",
                                            isBuyerCompleted: true,
                                            isDocVedifiedBuyer: true,
                                          },
                                        },
                                      });
                                      // ✅ optionally show success message
                                      console.log("Offer status updated");
                                    } catch (err) {
                                      // ❌ handle error
                                      console.error("Failed to update offer status", err);
                                    }
                                  }}
                                >
                                    Notify Jusoor to Finalize
                                </Button>
                            </Flex>
                        </Col>
                    </>
                )
            }
        </>
    </Row>
    </>
)
}

export {FinalDealsStep}