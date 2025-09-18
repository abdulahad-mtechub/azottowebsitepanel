import { Button,  Flex, Form, Modal } from 'antd'
import { ScheduleMeetingStep, SignJusoorEndaStep } from '../structure'
import { useState } from 'react'
import { useQuery } from '@apollo/client';
import { ME } from '../../../graphql/query';
import { message } from "antd";
import { useMutation } from '@apollo/client'
import { ACCEPT_ENDA,BUSINESS_MEETING } from '../../../graphql'
import Cookies from "js-cookie";

const RequestMeetingModal = ({businessId,visible,onClose,offerId,refetch}) => {
  const userId = Cookies.get("userId"); // read userId from cookie
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm(); 
    const [current, setCurrent] = useState(0);
    const { data, loading:userLoading, error } = useQuery(ME, {
        variables: { getUserId: userId },
    });
    const user = data?.getUser;
    const [acceptEnda, { loading:acceptEndaLoading }] = useMutation(ACCEPT_ENDA);
    const [businessMeeting, { loading }] = useMutation(BUSINESS_MEETING);

    const steps = [
        {
            title: null,
            content: <SignJusoorEndaStep form={form} onClose={onClose} user={user} />,

        },
        {
            title: null,
            content: <ScheduleMeetingStep form={form} onClose={onClose} />,
        },
    ];
    // try {
      //     await updateOffer({
      //         variables: { input: { id: record.key, status: 'ACCEPTED' } }
      //     });
      //     messageApi.success('Offer accepted!');
      //     refetch();
      // } catch (err) {
      //     messageApi.error('Failed to accept offer');
      // }
    const next = async () => {
        if (current === 0) {
          try {
            const values = await form.validateFields();
    
            if (!values.ndaAgree || !values.termsAgree || !values.commissionAgree) {
              messageApi.error("You must agree to all terms to continue.");
              return;
            }
    
            await acceptEnda({
              variables: {
                input: {
                  userId: user.id,
                  businessId,
                  acceptNdaTerms: values.ndaAgree,
                  acceptPlatformTerms: values.termsAgree,
                  acceptCommission: values.commissionAgree,
                },
              },
            });
    
            messageApi.success("Agreement accepted successfully");
            setCurrent(current + 1);
          } catch (error) {
            console.error(error);
            messageApi.error("Failed to accept agreement.");
          }
        } else {
          setCurrent(current + 1);
        }
    };
    // const prev = () => setCurrent(current - 1);
    const prev = () => onClose()

    return (
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            footer={null}
            width={600}
        >  {contextHolder}
            <div className="step-content mb-3">{steps[current].content}</div>
            <Flex gap={10} justify='end'>
                <Button aria-labelledby='Cancel' disabled={current > 0 ? false: true} className='btn text-black border-gray' onClick={prev}>
                    Cancel
                </Button>
                {current < steps.length - 1 && (
                    <Button type="primary" aria-labelledby='Next' className='btn bg-brand' onClick={next}>
                        Next
                    </Button>
                )}
                {current === steps.length - 1 && (
                    <Button type="primary" aria-labelledby='Send meeting request' className='btn bg-brand'
                    onClick={async () => {
                        try {
                          const values = await form.validateFields();

                          const meetingDate = new Date(values.date?.toDate?.());
                          const [startTime, endTime] = values.time || []; // array of dayjs

                          // ✅ Combine Date + Time into single DateTime
                          const combinedDateTime = new Date(
                            meetingDate.getFullYear(),
                            meetingDate.getMonth(),
                            meetingDate.getDate(),
                            new Date(startTime).getHours(),
                            new Date(startTime).getMinutes(),
                            0
                          );

                          // ✅ Combine Date + End Time
                          const combinedEndDateTime = new Date(
                            meetingDate.getFullYear(),
                            meetingDate.getMonth(),
                            meetingDate.getDate(),
                            new Date(endTime).getHours(),
                            new Date(endTime).getMinutes(),
                            0
                          );
                  
                          await businessMeeting({
                            variables: {
                              input: {
                                businessId,
                                requestedDate: combinedDateTime.toISOString(), // or use ISO string
                                requestedEndDate: combinedEndDateTime.toISOString(),
                              },
                            },
                          });
                  
                          messageApi.success("Meeting request sent successfully!");
                          onClose(); // close modal
                          refetch && refetch();
                        } catch (error) {
                          console.error(error);
                          messageApi.error("Failed to schedule meeting.");
                        }
                      }}
                      loading={loading}
                    >
                        Send Meeting Request
                    </Button>
                )}
            </Flex>
        </Modal>
    )
}

export {RequestMeetingModal}