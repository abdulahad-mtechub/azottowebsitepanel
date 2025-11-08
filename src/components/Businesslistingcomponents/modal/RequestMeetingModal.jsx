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
import { useTranslation } from 'react-i18next';

const RequestMeetingModal = ({ businessId, visible, onClose, offerId, onlyMeeting, refetch }) => {
    const userId = Cookies.get("userId");
    const { t } = useTranslation();
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm(); 
    const [current, setCurrent] = useState(0);
    const [allTermsAgreed, setAllTermsAgreed] = useState(false);
    const { data } = useQuery(ME, {
        variables: { getUserDetailsId: userId },
    });

    const user = data?.getUserDetails;
    const [acceptEnda] = useMutation(CREATE_ENDA);
    const [businessMeeting, { loading: meetingLoading }] = useMutation(BUSINESS_MEETING);
    const [updateOffer, { loading: offerLoading }] = useMutation(UPDATE_OFFER);
    
    const loading = meetingLoading || offerLoading;

    // Check if all checkboxes are checked
    const checkAllTerms = () => {
        const values = form.getFieldsValue(['ndaAgree', 'termsAgree', 'commissionAgree']);
        const allChecked = values.ndaAgree && values.termsAgree && values.commissionAgree;
        setAllTermsAgreed(allChecked);
    };
    
    const steps = [
        {
            title: null,
            content: <SignJusoorEndaStep form={form} onClose={onClose} user={user} onCheckboxChange={checkAllTerms} />,

        },
        {
            title: null,
            content: <ScheduleMeetingStep form={form} onClose={onClose} />,
        },
    ];
  
    const next = async () => {
        if (current === 0) {
          try {
            const values = await form.validateFields();
    
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
    
            setCurrent(current + 1);
          } catch (error) {
            console.error(error);
            messageApi.error("Failed to accept E-NDA agreement.");
          }
        } else {
          setCurrent(current + 1);
        }
    };

    const prev = () => onClose();

    return (
        <Modal
          title={null}
          open={visible}
          onCancel={onClose}
          closeIcon={false}
          footer={null}
          width={600}
          centered
        >  
        {contextHolder}
          <div className="step-content mb-3">{steps[current].content}</div>
          <Flex gap={10} justify='end'>
              <Button aria-labelledby='Cancel' className='btn text-black border-gray' onClick={prev}>
                {t('Cancel')}
              </Button>
              {current < steps.length - 1 && (
                  <Button 
                      type="primary" 
                      aria-labelledby='Next' 
                      className='btn bg-brand' 
                      onClick={next}
                      disabled={!allTermsAgreed}
                  >
                      {t('Next')}
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
                          !onlyMeeting && updateOffer({
                            variables: {
                              input: {
                                id: offerId,
                                status: "ACCEPTED"
                              },
                            },
                          })
                        ]);

                        messageApi.success("Jusoor E-NDA signed & meeting request sent successfully!");
                        onClose();
                        refetch && refetch();
                      } catch (error) {
                        console.error(error);
                        // Check if it's a validation error
                        if (error.errorFields && error.errorFields.length > 0) {
                          // Validation failed - don't show error message, validation UI handles it
                          return;
                        }
                        // API error - show error message
                        messageApi.error("Failed to schedule meeting or accept offer.");
                      }
                    }}
                    loading={loading}
                  >
                      {t('Send Meeting Request')}
                  </Button>
              )}
          </Flex>
        </Modal>
    )
}

export {RequestMeetingModal}