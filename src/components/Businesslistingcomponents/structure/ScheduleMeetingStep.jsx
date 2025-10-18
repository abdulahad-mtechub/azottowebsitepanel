import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Flex, Form, Row, Typography } from 'antd';
import { MyDatepicker } from '../../Forms';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const ScheduleMeetingStep = ({ form, onClose }) => {
    const { t } = useTranslation();

    return (
        <div>
            <Flex vertical className='mb-3' gap={0}>
                <Flex justify='space-between' gap={6}>
                    <Title level={5} className='m-0'>
                        {t('Schedule Virtual Meeting')}
                    </Title>
                    <Button type='button' aria-labelledby={t('Close')} onClick={onClose} className='p-0 border-0 bg-transparent'>
                        <CloseOutlined className='fs-18' />
                    </Button>
                </Flex>                
                <Text>
                    {t('Please share your availability to meet with the Seller for final deal discussion.')}
                </Text>
            </Flex>
            <Form
                layout='vertical'
                form={form}
                requiredMark={false}
            >
                <Row>
                    <Col span={24}>
                        <MyDatepicker
                            datePicker
                            label={t('Meeting Date')}
                            name='date'
                            className='w-100'
                            required
                            message={t('Please select meeting date')}
                        />
                    </Col>
                    <Col span={24}>
                        <MyDatepicker
                            timerangePicker
                            label={t('Meeting Time')}
                            name='time'
                            className='w-100'
                            required
                            message={t('Please select meeting time')}
                        />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export { ScheduleMeetingStep };
