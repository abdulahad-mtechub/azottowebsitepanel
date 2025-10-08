import { Button,  Flex, Form, Modal } from 'antd'
import { ScheduleMeetingStep, SignJusoorEndaStep } from '../structure'
import { useState } from 'react'
import { useQuery } from '@apollo/client';
import { ME } from '../../../graphql/query';
import { message } from "antd";
import { useMutation } from '@apollo/client'
import { CREATE_ENDA,BUSINESS_MEETING } from '../../../graphql'
import { UPDATE_OFFER } from '../../../graphql/mutation/mutations';
import Cookies from "js-cookie";

const RequestMeetingModal = ({businessId,visible,onClose,offerId,refetch}) => {
    const userId = Cookies.get("userId");
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm(); 
    const [current, setCurrent] = useState(0);
    const { data } = useQuery(ME, {
        variables: { getUserDetailsId: userId },
    });

    const user = data?.getUserDetails;
    const [acceptEnda] = useMutation(CREATE_ENDA);
    const [businessMeeting, { loading: meetingLoading }] = useMutation(BUSINESS_MEETING);
    const [updateOffer, { loading: offerLoading }] = useMutation(UPDATE_OFFER);
    
    const loading = meetingLoading || offerLoading;

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
    
            // Only accept E-NDA terms here
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
    
            messageApi.success("E-NDA Agreement accepted successfully");
            setCurrent(current + 1);
          } catch (error) {
            console.error(error);
            messageApi.error("Failed to accept E-NDA agreement.");
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
                  
                          // ✅ Call both APIs together: Meeting Request + Offer Acceptance
                          await Promise.all([
                            businessMeeting({
                              variables: {
                                input: {
                                  businessId,
                                  offerId,
                                  requestedDate: combinedDateTime.toISOString(),
                                  requestedEndDate: combinedEndDateTime.toISOString(),
                                },
                              },
                            }),
                            updateOffer({
                              variables: {
                                input: {
                                  id: offerId,
                                  status: "ACCEPTED"
                                },
                              },
                            })
                          ]);
                  
                          messageApi.success("Meeting request sent and offer accepted successfully!");
                          onClose(); // close modal
                          refetch && refetch();
                        } catch (error) {
                          console.error(error);
                          messageApi.error("Failed to schedule meeting or accept offer.");
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