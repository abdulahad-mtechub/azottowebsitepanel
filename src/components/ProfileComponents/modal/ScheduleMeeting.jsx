import { Button, Col, Flex, Form, Modal, Row, Typography, message } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { MyDatepicker } from '../../Forms';
import { useMutation } from '@apollo/client';
import { BUSINESS_MEETING, UPDATE_MEETING } from '../../../graphql';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const ScheduleMeeting = ({ visible, onClose, meetingId, offerId, refetchMeetings, businessId }) => {
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    const [meeting] = useMutation(BUSINESS_MEETING);
    const [updateMeeting] = useMutation(UPDATE_MEETING);

    const handleSubmit = async (values) => {
        try {
            const { date, time } = values;

            if (!date || !time) {
                message.error(t("Please select both date and time"));
                return;
            }

            const combinedDateTime = new Date(date);
            combinedDateTime.setHours(time.hour());
            combinedDateTime.setMinutes(time.minute());

            if (meetingId) {
                await updateMeeting({
                    variables: {
                        input: {
                            id: meetingId,
                            receiverAvailabilityDate: combinedDateTime.toISOString(),
                            status: "ACCEPTED"
                        },
                    },
                });
            } else {
                await meeting({
                    variables: {
                        input: {
                            businessId,
                            offerId,
                            requestedDate: combinedDateTime.toISOString(),
                        },
                    },
                });
            }

            messageApi.success(t("Meeting request sent successfully!"));
            onClose();
            await refetchMeetings({ variables: { search: "" } });
        } catch (error) {
            console.error(error);
            messageApi.error(t("Failed to send meeting request"));
        }
    };

    return (
        <>
            {contextHolder}
            <Modal
                title={null}
                open={visible}
                onCancel={onClose}
                closeIcon={false}
                centered
                footer={
                    <Flex justify='end' gap={5}>
                        <Button aria-labelledby={t('Cancel')} type='button' className='btn text-black border-gray' onClick={onClose}>
                            {t('Cancel')}
                        </Button>
                        <Button aria-labelledby={t('Send Meeting Request')} type="primary" className='btn bg-brand' onClick={() => form.submit()}>
                            {t('Send Meeting Request')}
                        </Button>
                    </Flex>
                }
                width={600}
            >
                <Flex vertical className='mb-3' gap={0}>
                    <Flex justify='space-between' gap={6}>
                        <Title level={5} className='m-0'>
                            {t('Schedule Virtual Meeting')}
                        </Title>
                        <Button aria-labelledby={t('Close')} type='button' onClick={onClose} className='p-0 border-0 bg-transparent'>
                            <CloseOutlined className='fs-18' />
                        </Button>
                    </Flex>
                    <Text className='fs-14'>
                        {t('Please share your availability to meet with the Seller for final deal discussion.')}
                    </Text>
                </Flex>
                <Form layout='vertical' form={form} requiredMark={false} onFinish={handleSubmit}>
                    <Row>
                        <Col span={24}>
                            <MyDatepicker
                                datePicker
                                label={t('Meeting Date')}
                                name='date'
                                className='w-100'
                            />
                        </Col>
                        <Col span={24}>
                            <MyDatepicker
                                label={t('Meeting Time')}
                                name='time'
                                className='w-100'
                            />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        </>
    );
};

export { ScheduleMeeting };
