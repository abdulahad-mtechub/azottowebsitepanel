import { Button, Card, Flex, Form, Tooltip, Typography } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { SingleFileUpload } from '../../Forms';

const { Title, Text } = Typography
const UploadSupportDocStep = () => {

    const [form] = Form.useForm();   
    return (
        <>
            <Flex vertical gap={1} className='mb-3'>
                <ModuleTopHeading level={4} name='Upload supporting documents' />
                <Text className='text-gray'>Verified data builds buyer confidence.</Text>
            </Flex>
            <Form
                layout="vertical"
                form={form}
                requiredMark={false}
            >
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <Flex vertical gap={5} className='w-100'>
                        <Flex vertical >
                            <Title level={5} className='m-0'>Commercial Registration (CR)</Title>
                            <Text className='text-gray'>
                                Accepted formats: PDF, JPG, PNG, DOCX. Max size: 10MB per file.
                            </Text>
                        </Flex>
                        <Flex  className='w-100'>
                            <SingleFileUpload form={form} name={'uploadimge'} title={'Upload'} />
                        </Flex>
                    </Flex>  
                </Card> 
                <Card className='shadow-d radius-12 border-gray mb-3'>
                    <Flex vertical gap={5} className='w-100'>
                        <Flex vertical >
                            <Title level={5} className='m-0'>
                                Upload Other Supporting Documents <Tooltip title='Info'>
                                    <img src="/assets/icons/info-outline.png" width={14} alt="" />
                                </Tooltip>
                            </Title>
                            <Text className='text-gray'>
                                Accepted formats: PDF, JPG, PNG, DOCX, XLSX. Max size: 10MB per file.
                            </Text>
                        </Flex>
                        <Flex  className='w-100'>
                            <SingleFileUpload form={form} name={'uploadmult'} title={'Upload'} multiple={true} />
                        </Flex>
                    </Flex>  
                </Card>  
            </Form>
        </>
    )
}

export {UploadSupportDocStep}