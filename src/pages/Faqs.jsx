import { Breadcrumb, Flex, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { Contactform, FaqsComponent } from '../components';
import { useTranslation } from "react-i18next";

const { Text, Title } = Typography;

const Faqs = () => {
    const {t,i18n}= useTranslation()
    const navigate = useNavigate();
    return (
        <>
            <div className='padd-1'>
                <div className='bg-dark-blue bread-cs mb-3'>
                    <div className='container'>
                        <Breadcrumb
                            separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                            items={[
                                {
                                    title: <Text className='cursor text-gray' onClick={() => navigate('/')}>{t('Home')}</Text>,
                                },
                                {
                                    title: <Text className='fw-500 text-white'>{t('FAQs')}</Text>,
                                },
                            ]}
                        />
                        <Flex vertical gap={15} className='w-100 search-cs text-center'>
                            <Title level={2} className='text-white m-0'>{t("Frequently Asked Questions")}</Title>
                            <Text className='text-light-gray fs-16'>
                                {t('Find answers to the most common questions about how Jusoor works, business verification, payments, and more.')}
                            </Text>
                        </Flex>
                    </div>
                </div>
                <FaqsComponent /> 
            </div>
            <Contactform />
        </>
    );
}

export { Faqs };
