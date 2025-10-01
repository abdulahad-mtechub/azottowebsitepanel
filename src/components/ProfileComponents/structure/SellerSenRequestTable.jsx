import { Col, Form, Row, Table } from 'antd';
import { SearchInput } from '../../Forms';
import { SENTMEETINGS } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SellerSendRequestTable = ({ isBuyer }) => {
    const { t } = useTranslation();
    const [form] = Form.useForm();
    const [fetchMeetings, { data, loading }] = useLazyQuery(SENTMEETINGS, { fetchPolicy: 'network-only' });
    const search = Form.useWatch("search", form);

    const columns = [
        { title: t('Business Title'), dataIndex: 'title' },
        { title: t('Buyer Name'), dataIndex: 'buyername' },
        { title: t('Business Price'), dataIndex: 'businessprice' },
        { title: t('Offer Price'), dataIndex: 'offerprice' },
        { title: t('Requested Date'), dataIndex: 'requestedDate' },
    ];

    const sendrequestData = data?.getMySentMeetingRequests?.items?.map((meeting) => {
        const buyerName = meeting.requestedTo?.name || '';
        const maskedName =
            buyerName.length > 3
                ? buyerName.substring(0, 3) + '*'.repeat(10)
                : buyerName + '*'.repeat(10 - buyerName.length);
    
        return {
            key: meeting.id,
            title: meeting.business?.businessTitle,
            buyername: maskedName,
            businessprice: meeting.business?.price,
            offerprice: meeting.offer?.price,
            requestedDate: new Date(meeting.requestedDate).toLocaleString(),
        };
    }) || [];

    useEffect(() => {
        fetchMeetings({ variables: { search: search || "", isBuyer } });
    }, [search]);

    return (
        <Form form={form}>
            <Row gutter={[24,12]} className='mt-2'>
                <Col xs={{span: 24}} sm={{span: 24}} md={{span: 12}} lg={{span: 8}}>
                    <Form.Item name="search" noStyle>
                        <SearchInput
                            placeholder={t('Search')}
                            value={form.getFieldValue('search') || ''}
                            prefix={<img src="/assets/icons/search.png" alt={t('search-icon')} className='mx-3-inline' width={12} fetchPriority="high" />}
                            onChange={(e) => form.setFieldValue("search", e.target.value)}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Table
                        size="large"
                        columns={columns}
                        dataSource={sendrequestData}
                        className="pagination table table-cs"
                        showSorterTooltip={false}
                        scroll={{ x: 800 }}
                        pagination={false}
                    />
                </Col>
            </Row>
        </Form>
    );
}

export { SellerSendRequestTable };
