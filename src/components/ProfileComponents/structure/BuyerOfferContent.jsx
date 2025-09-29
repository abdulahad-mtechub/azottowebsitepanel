import { Button, Card, Col, Dropdown, Flex, Form, Row, Table, Typography, message, Spin } from 'antd'
import { ModuleTopHeading } from '../../Pagecomponents'
import { NavLink } from 'react-router-dom';
import { OfferSellerModal, RequestMeetingModal } from '../../Businesslistingcomponents';
import { useState, useEffect } from 'react';
import { DeleteModal } from '../../ui';
import { SearchInput } from '../../Forms';
import { DownOutlined } from '@ant-design/icons';
import { GET_BUYER_OFFER } from '../../../graphql/query'
import { useQuery } from '@apollo/client';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';

const { Text } = Typography
const BuyerOfferContent = () => {
    const { t } = useTranslation();
    const userId = Cookies.get("userId"); 
    const [messageApi, contextHolder] = message.useMessage();
    const [form] = Form.useForm()
    const [ offermodal, setOfferModal ] = useState(false)
    const [ requestPop, setRequestPop ] = useState(false)
    const [ deletemodal, setDeleteModal ] = useState(false)
    const [ filterstatus, setFilterStatus] = useState()
    const [selectedBusinessId, setSelectedBusinessId] = useState(null);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const search = Form.useWatch('search', form);

    const { data, loading, error, refetch } = useQuery(GET_BUYER_OFFER, {
        variables: {
          status: filterstatus ? filterstatus : null,
          search: search,
        },
    });

    const tableData = data?.getOffersByUser?.map((offer, idx) => ({
        key: offer.id,
        title: offer.business.businessTitle,
        sellername: offer.business.seller?.name
        ? `${offer.business.seller.name.slice(0, 3)}*****`
        : null,
        businessprice: offer.business.price,
        offerprice: offer.price,
        status: offer.status,
        date: new Date(offer.createdAt).toLocaleString(),
        business: offer.business, 
        buyer: offer.buyer, 
        createdBy:offer.createdBy
    })) || [];

    const columns = [
        { title: t('Business Title'), dataIndex: 'title' },
        { title: t('Seller Name'), dataIndex: 'sellername' },
        { title: t('Business Price'), dataIndex: 'businessprice' },
        { title: t('Offer Price'), dataIndex: 'offerprice' },
        {
            title: t('Status'), dataIndex: 'status',
            render: (status, record) => {
                if (status === 'PENDING') {
                  if (record.createdBy === userId) return <Text className="sendstatus fs-12 badge-cs fw-500">{t('Send')}</Text>;
                  return <Text className="sendstatus fs-12 badge-cs fw-500">{t('Received')}</Text>;
                } else if (status === 'REJECTED') return <Text className="inactive fs-12 badge-cs fw-500">{t('Rejected')}</Text>;
                else if (status === 'APPROVED') return <Text className="received fs-12 badge-cs fw-500">{t('Approved')}</Text>;
                return <Text className="fs-12 badge-cs fw-500">{status}</Text>;
            },
        },
        { title: t('Date'), dataIndex: 'date' },
        {
            title: t('Action'), key: 'action', fixed: 'right', width: 100, align: 'center',
            render: (record) => {
              if (record.createdBy !== userId) {
                let items = [];
                if (record.status === 'PENDING') {
                  items = [
                    { label: <NavLink onClick={() => { setSelectedOfferId(record.key); setSelectedBusinessId(record.business.id); setRequestPop(true); }}>{t('Accept Offer')}</NavLink>, key: 0 },
                    { label: <NavLink onClick={() => { setSelectedOfferId(record.key); setDeleteModal(true); }}>{t('Reject Offer')}</NavLink>, key: 1 },
                    { label: <NavLink onClick={() => { setSelectedBusinessId(record.business.id); setSelectedOfferId(record.key); setOfferModal(true); }}>{t('Counter Offer')}</NavLink>, key: 2 },
                    { label: <NavLink onClick={() => { setSelectedBusinessId(record.business.id); setRequestPop(true); }}>{t('Request For Virtual Meeting')}</NavLink>, key: 3 },
                  ];
                }
                return (
                  <Dropdown menu={{ items }} trigger={['click']}>
                    <Button aria-labelledby='dropdown icon' className="bg-transparent border-0 p-0">
                      <img src="/assets/icons/dots.png" alt="dropdown-icon" width={16} fetchPriority="high" />
                    </Button>
                  </Dropdown>
                );
              }
              return null;
            },
        }
    ];

    const items = [
        { key: '1', label: t('Received') },
        { key: '2', label: t('Send') },
        { key: '3', label: t('Inactive') }
    ];

    const onClick = ({ key }) => setFilterStatus(key);

    useEffect(() => { refetch({ limit: 10, offset: 0, search: search || '' }); }, [search, refetch]);

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
            <Flex vertical gap={20}>
                <ModuleTopHeading level={4} name={t('Offer')} />
                <Card className='radius-12 border-gray'>
                    <Form form={form}>    
                    <Row gutter={[24,24]}>
                        <Col span={24}>
                            <Flex gap={5} align='center'>
                                <Form.Item name="search" noStyle>
                                    <SearchInput
                                        placeholder={t('Search')}
                                        value={form.getFieldValue('name') || ''}
                                        prefix={<img src="/assets/icons/search.png" alt='search-icon' className='mx-3-inline' width={12} fetchPriority="high" />}
                                    />
                                </Form.Item>
                                <Dropdown menu={{ items, onClick }} trigger={['click']}>
                                    <Button aria-labelledby='status filter' className='border-light-gray radius-8 p-2 fs-13 h-auto'>
                                        <Flex justify='space-between' className='w-100' gap={10}>
                                            {filterstatus === '1' ? t('Received') :
                                             filterstatus === '2' ? t('Send') :
                                             filterstatus === '3' ? t('Inactive') : t('Status')}
                                            <DownOutlined />
                                        </Flex>
                                    </Button>
                                </Dropdown>
                            </Flex>
                        </Col>
                        <Col span={24}>
                            <Table
                                size="large"
                                columns={columns}
                                dataSource={tableData}
                                className="pagination table table-cs"
                                showSorterTooltip={false}
                                scroll={{ x: 1300 }}
                                pagination={false}
                            />
                        </Col>
                    </Row>
                    </Form>
                </Card>
            </Flex>
            <OfferSellerModal refetch={refetch} businessId={selectedBusinessId} offerId={selectedOfferId} visible={offermodal} onClose={()=>setOfferModal(false)} />
            <RequestMeetingModal refetch={refetch} offerId={selectedOfferId} businessId={selectedBusinessId} visible={requestPop} onClose={()=>setRequestPop(false)} />
            <DeleteModal refetch={refetch} offerId={selectedOfferId} visible={deletemodal} onClose={()=>setDeleteModal(false)} type='danger'
                title={t('Are you sure?')}
                subtitle={t('This action cannot be undone. Are you sure you want to reject this offer?')}
            />
        </>
    )
}

export { BuyerOfferContent }
