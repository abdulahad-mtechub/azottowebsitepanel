import React from 'react';
import { Button, Card, Col, Divider, Flex, Image, Pagination, Row, Select, Typography, Tag, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import { CREATE_SAVE_BUSINESS } from "../../../graphql";
import { useMutation } from '@apollo/client';
import { message } from "antd";
import { useTranslation } from 'react-i18next';

const { Title, Text, Paragraph } = Typography;

const ProductCard = ({
    exploreData,
    refetchBusinesses,
    totalCount,
    currentPage,
    onPageChange,
    limit,
    onLimitChange,
    isLoading
}) => {
    const { t } = useTranslation();
    const [saveBusiness] = useMutation(CREATE_SAVE_BUSINESS);
    const navigate = useNavigate();
    const [messageApi, contextHolder] = message.useMessage();

    const saveBusinessHandler = async (businessId) => {
        try {
          const res = await saveBusiness({
            variables: {
              saveBusinessId: businessId,
            },
          });
          messageApi.success(t("Business saved successfully!"));
          refetchBusinesses(); 
        } catch (err) {
          console.error("Save mutation error:", err);
          messageApi.error(t("Save failed: ") + err.message);
        }
      };

    if (isLoading) {
        return (
            <Flex justify="center" align="center" className='h-200'>
                <Spin size="large" />
            </Flex>
        );
    }

    return (
        <>
        {contextHolder}
        <Row gutter={[16,16]}>
            {
                exploreData?.map((pro,i) =>
                    <Col lg={{span: 6}} md={{span: 8}} sm={{span: 24}} xs={{span: 24}} key={i}>
                        <Card className='h-100 border-gray rounded-12 card-cs cursor' 
                            onClick={() => {
                                if (pro?.id) {
                                    navigate(`/singleviewlisting/${pro.id}`);
                                } else {
                                    console.warn("Business ID is undefined", pro);
                                }
                            }}
                        >
                            <Flex vertical gap={20}>
                                <Flex justify='space-between' align='center'>
                                    <Flex gap={4}>
                                        <Tag color="default" className="fs-12">
                                            {pro.categoryName.split(/\s+/).slice(0, 2).join(' ') + '...'}
                                        </Tag>
                                        <Tag 
                                            className="fs-12 bg-brand"
                                            color={pro.isByTakbeer ? "bg-black" : "bg-blue"}
                                        >
                                            {pro.isByTakbeer ? t("Taqbeel") : t("Acquiring")}
                                        </Tag>
                                    </Flex>
                                    <Button 
                                        aria-labelledby='bookmarked-btn'
                                        className='border-0 bg-transparent p-0'
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            saveBusinessHandler(pro?.id);
                                        }}
                                    >
                                        {
                                            pro?.isSaved
                                            ? <img src='/assets/icons/bk-bl-d.png' alt={t('bookmarked-image')} width={22} fetchPriority="high" />
                                            : <img src='/assets/icons/bk-bl.png' alt={t('un-bookmarked-image')} width={22} fetchPriority="high" />
                                        }
                                    </Button>
                                </Flex>
                                <div>
                                    <div className='w-full card-img mb-2 rounded-12'>
                                        <img src="/assets/images/card-1.webp" width={'100%'} height={'100%'} alt={t("product-image")} fetchPriority="high" />
                                    </div>
                                    <Title strong className="fs-16">{pro?.title}</Title>
                                    <div className='h-80'>
                                        <Paragraph ellipsis={{ rows: 3, expandable: false, symbol: 'more' }} className='fs-14 text-gray'>
                                            {pro?.description}
                                        </Paragraph>
                                    </div>
                                    <Divider className='my-1' />
                                    <Row justify={'space-between'}>
                                        {
                                            pro?.child?.map((item, c) => (
                                                <React.Fragment key={c}>
                                                    <Col span={7}>
                                                        <Flex vertical>
                                                            <Title level={5} className='text-brand m-0 fs-13 fw-500'>
                                                                {c !== 2 && <img src="/assets/icons/reyal-b.png" width={10} alt={t("currency-symbol")} fetchPriority="high" />} {item?.subtitle}
                                                            </Title>
                                                            <Text className='text-gray fs-12'>
                                                                {item?.subdesc}
                                                            </Text>
                                                        </Flex>
                                                    </Col>
                                                    {
                                                        c < pro.child.length - 1 && (
                                                            <Divider type='vertical' className='m-0 h-auto' />
                                                        )
                                                    }
                                                </React.Fragment>
                                            ))
                                        }
                                    </Row>
                                    <Divider className='my-1' />
                                    <Flex gap={3} align='center'>
                                        <Image src='/assets/icons/reyal.png' alt={t("currency-symbol")} preview={false} width={20} />
                                        <Title level={4} className='m-0'>{pro?.amount}</Title>
                                    </Flex>
                                </div>
                            </Flex>
                        </Card>
                    </Col>
                )
            }
            {
                exploreData?.length > 5 &&
                <Col span={24} className='mt-3'>
                    <Row justify="space-between" align="middle">
                        <Col span={6}>
                            <Flex gap={5} align='center'>
                                <Text>{t("Rows Per Page:")}</Text>
                                <Select
                                    className='select-filter'
                                    value={limit}
                                    onChange={onLimitChange}
                                    options={[
                                        { value: 5, label: 5 },
                                        { value: 10, label: 10 },
                                        { value: 20, label: 20 },
                                        { value: 50, label: 50 },
                                    ]}
                                />
                            </Flex>
                        </Col>
                        <Col span={6}>
                            <Flex justify='end'>
                                <Pagination
                                    className='pagination'
                                    current={currentPage}
                                    total={totalCount}
                                    pageSize={limit}
                                    onChange={onPageChange}
                                    showSizeChanger={false}
                                />
                            </Flex>
                        </Col>
                    </Row>
                </Col>
            }
        </Row>
        </>
    )
}

export { ProductCard };
