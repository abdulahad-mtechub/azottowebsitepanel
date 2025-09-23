import { Button, Col, Flex, Form, Image, Modal, Row, Typography,message,Spin } from 'antd'
import { MyInput, MySelect } from '../../Forms';
import { CloseOutlined } from '@ant-design/icons';
import { ADD_BANK } from '../../../graphql/mutation'
import { useMutation } from '@apollo/client'
import { GETUSERBANK } from '../../../graphql/query'
import Cookies from 'js-cookie';

const { Title, Text } = Typography
const AddWalletModal = ({ visible, onClose }) => {
    const userId = Cookies.get("userId"); // read userId from cookie
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm();
    
    const [addBank, { loading }] = useMutation(ADD_BANK, {
        refetchQueries: [{ query: GETUSERBANK, variables: { getUserBanksId: userId } }],
        awaitRefetchQueries: true,
    });

    const onFinish = (values) => {
        addBank({
        variables: {
            input: {
            bankName: values.bankName,
            accountTitle: values.accountHoldername,
            iban: values.ibanNumber,
            },
        },
        });
        messageApi.success('Bank account added successfully!');
        onClose();     
    };  
    if (loading) {
        return (
          <Flex justify="center" align="center" className='h-200'>
            <Spin size="large" />
          </Flex>
        );
    }
    return (
      <>
      {contextHolder}
        <Modal
            title={null}
            open={visible}
            onCancel={onClose}
            closeIcon={false}
            footer={
                <Flex justify="end" gap={5}>
                    <Button
                        type="button"
                        className="btn text-black border-gray"
                        onClick={onClose}
                        aria-labelledby='Cancel'
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        className="btn bg-brand"
                        // loading={loading}
                        onClick={() => form.submit()}
                        aria-labelledby='Update'
                    >
                        Save Account
                    </Button>
                </Flex>
            }
            width={600}
        >
            <Flex vertical className="mb-3" gap={0}>
                <Flex justify="space-between" gap={6}>
                    <Title level={5} className="m-0">
                        Add New Bank Account
                    </Title>
                    <Button
                        type="button"
                        onClick={onClose}
                        className="p-0 border-0 bg-transparent"
                        aria-labelledby='Close'
                    >
                        <CloseOutlined className="fs-14" />
                    </Button>
                </Flex>
                <Text className="fs-14">
                    Securely link your bank account to receive payments for completed deals. Make sure the IBAN is correct to avoid payout delays.
                </Text>
            </Flex>
  
            <Form
                layout="vertical"
                form={form}
                requiredMark={false}
                onFinish={onFinish}
            >
                <Row gutter={[12, 12]}>
                    <Col span={24}>
                        <MySelect
                            label='Bank Name'
                            name='bankName'
                            required
                            message="Please choose bank name"
                            placeholder='select bank'
                            options={[
                                {
                                    id: 1,
                                    name: 'The Saudi Investment Bank'
                                }
                            ]}
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            label="Account Holder Name"
                            name="accountHoldername"
                            required
                            message="Please enter account holder name"
                            placeholder="Enter account holder name"
                        />
                    </Col>
                    <Col span={24}>
                        <MyInput
                            label="IBAN Number"
                            name="ibanNumber"
                            required
                            message="Please enter iban nummber"
                            placeholder="Enter iban nummber"
                        />
                    </Col>
                    <Col span={24}>
                        <Flex className='pad-12 rounded-8 pill-brand' gap={8} align='center'>
                            <Image src="/assets/icons/info-b.png" preview={false} width={20} alt="info icon" />
                            <Text className='fs-13 text-sky'>
                                Your banking details are encrypted and used only for secure payouts through Jusoor.
                            </Text>
                        </Flex>
                    </Col>
                </Row>
            </Form>
        </Modal>
      </>
    );
};

export { AddWalletModal } 
