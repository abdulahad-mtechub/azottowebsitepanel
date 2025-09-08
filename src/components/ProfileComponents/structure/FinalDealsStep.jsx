import { Button, Card, Checkbox, Col, Flex, Image, Row, Typography } from 'antd'
import {GET_BUSINESS } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const { Text } = Typography
const FinalDealsStep = ({form,inprogressdeal}) => {
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
    const documents = dealBusiness?.documents || [];
    return (
        <Row gutter={[16, 24]}>
            <Col span={24}>
                <Flex vertical gap={0} className='mb-3'>
                    <Text className='fw-600 fs-14'>Document Received Confirmation</Text>
                    <Text className='fs-13 text-gray'>The seller has uploaded final documents. Please review and confirm you’ve received all required legal materials before the deal is finalized.</Text>
                </Flex>
                {documents.map((doc, i) => (
          <Card className="card-cs border-gray rounded-12 mb-2" key={i}>
            <Flex justify="space-between" align="center">
              <Flex gap={15}>
                <Image
                  src={"/assets/icons/file.png"}
                  preview={false}
                  width={20}
                />
                <Flex vertical>
                  <Text className="fs-13 text-gray">{doc.title}</Text>
                  <Text className="fs-13 text-gray">
                    {(doc.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </Flex>
              </Flex>

              {/* Download button */}
              <a href={doc.filePath} download target="_blank" rel="noopener noreferrer">
                <Image
                  src={"/assets/icons/download.png"}
                  preview={false}
                  width={16}
                  style={{ cursor: "pointer" }}
                />
              </a>
            </Flex>
          </Card>
        ))}

            </Col>
            <>
                {
                    !inprogressdeal && (
                        <>
                            <Col span={24}>
                                <Checkbox>
                                    I confirm that I’ve received and reviewed the final transfer documents.
                                </Checkbox>
                            </Col>
                            <Col span={24}>
                                <Flex>
                                    <Button aria-labelledby='Notify Jusoor a Finalize' type="primary" className='btn bg-brand'>
                                        Notify Jusoor to Finalize
                                    </Button>
                                </Flex>
                            </Col>
                        </>
                    )
                }
            </>
        </Row>
    )
}

export {FinalDealsStep}