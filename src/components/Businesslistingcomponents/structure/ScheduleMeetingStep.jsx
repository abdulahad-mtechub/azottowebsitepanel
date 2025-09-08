import { CloseOutlined } from '@ant-design/icons'
import { Button, Col, Flex, Form, Row, Typography } from 'antd'
import { MyDatepicker } from '../../Forms'
import { useMutation } from '@apollo/client'
import { BUSINESS_MEETING } from '../../../graphql'

const { Title, Text } = Typography
const ScheduleMeetingStep = ({form,onClose}) => {
    const handleSubmit = async (values) => {
        try {
          const { date, time } = values;
    
          if (!date || !time) {
            message.error("Please select both date and time");
            return;
          }
    
          // Combine date & time into a single Date object
          const combinedDateTime = new Date(date);
          combinedDateTime.setHours(time.hour());
          combinedDateTime.setMinutes(time.minute());
    
          await businessMeeting({
            variables: {
              input: {
                businessId,
                requestedDate: combinedDateTime.toISOString(),
              },
            },
          });
    
          message.success("Meeting request sent successfully!");
          onClose();
        } catch (error) {
          console.error(error);
          message.error("Failed to send meeting request");
        }
      };
    const [businessMeeting, { loading }] = useMutation(BUSINESS_MEETING);

  return (
    <div>
        <Flex vertical className='mb-3' gap={0}>
            <Flex justify='space-between' gap={6}>
                <Title level={5} className='m-0'>
                    Schedule Virtual Meeting
                </Title>
                <Button type='button' aria-labelledby='Close' onClick={onClose} className='p-0 border-0 bg-transparent'>
                    <CloseOutlined className='fs-18' />
                </Button>
            </Flex>                
            <Text>
                Please share your availability to meet with the Seller for final deal discussion.
            </Text>
        </Flex>
        <Form
            layout='vertical'
            form={form}
            requiredMark={false}
            onFinish={handleSubmit}
        >
            <Row>
                <Col span={24}>
                    <MyDatepicker
                        datePicker
                        label='Meeting Date'
                        name='date'
                        className='w-100'
                    />
                </Col>
                <Col span={24}>
                    <MyDatepicker
                        label='Meeting Time'
                        name='time'
                        className='w-100'
                    />
                </Col>
            </Row>
        </Form>
    </div>
  )
}

export {ScheduleMeetingStep}