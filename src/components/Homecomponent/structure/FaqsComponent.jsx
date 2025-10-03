import { useState } from 'react'
import { Col, Collapse, Flex, Row, Typography, Spin } from 'antd'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { GETFAQ } from '../../../graphql/query/queries'
import { useLazyQuery } from "@apollo/client";
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;
const { Panel } = Collapse;

const FaqsComponent = () => {
    const { t } = useTranslation();
    const [currentPanel, setCurrentPanel] = useState(['0']);
    const { data, loading, error, refetch } = useLazyQuery(GETFAQ, {
        variables: { search: "" },
    });

    const faqsData = data?.getFAQs?.faqs?.map(item => ({
        id: item.id,
        title: t(item.question),
        description: t(item.answer),
    })) || [];

    if (loading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <div className='feature'>
            <div className='container'>
                <Row gutter={[24, 64]} justify={'center'}>
                    <Col span={24}>
                        <Flex vertical justify='center' align='center' gap={15} className='mx-width'>
                            <div className='tag bg-secondary fw-500 text-brand'>{t("FAQs")}</div>
                            <Title className='m-0' level={2}>
                                {t("Everything You Need to")} <span className='text-brand'>{t("Know About Jusoor")}</span>
                            </Title>
                            <Text className='fs-14'>
                                {t("Learn how Jusoor works, how we verify businesses, and what to expect during the buying or selling process.")}
                            </Text>
                        </Flex>
                    </Col>
                    <Col lg={{ span: 20 }} md={{ span: 24 }} sm={{ span: 24 }} xs={{ span: 24 }}>
                        <Collapse
                            className="collapse-fq"
                            defaultActiveKey={['0']}
                            onChange={(keys) => setCurrentPanel(keys)}
                            ghost
                            items={faqsData?.map((faq, f) => ({
                                key: String(f),
                                className: currentPanel.includes(String(f)) ? 'panel-active panel' : 'panel',
                                label: (
                                    <Title
                                        level={3}
                                        className={`m-0 fw-500 fs-17 ${currentPanel.includes(String(f)) ? 'text-brand' : 'text-gray'}`}
                                    >
                                        <span className="mr-15">0{f + 1}</span>
                                        {faq?.title}
                                    </Title>
                                ),
                                extra: currentPanel?.findIndex((x) => x == f) > -1 ? (
                                    <MinusOutlined className="fs-18" />
                                ) : (
                                    <PlusOutlined className="fs-18" />
                                ),
                                children: (
                                    <Text className="fs-16">{faq?.description}</Text>
                                ),
                            }))}
                        />
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export { FaqsComponent }
