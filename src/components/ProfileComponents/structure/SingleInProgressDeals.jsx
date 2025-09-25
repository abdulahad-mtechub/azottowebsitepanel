import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { SingleInprogressSteps } from './SingleInprogressSteps'
import { GETDEAL, ME } from '../../../graphql';
import { useQuery } from '@apollo/client';
import Cookies from "js-cookie";


const { Title, Text } = Typography
const SingleInProgressDeals = ({inprogressdeal, setInprogressDeal}) => {

    const userId = Cookies.get("userId"); 
    const dealId = inprogressdeal.key;
    console.log('inprogressdeal...',inprogressdeal)
    const { data, loading, error } = useQuery(GETDEAL, {
        variables: { getDealId: dealId },
        fetchPolicy: 'network-only',
    });

    const { data:userData, loading:userLoading, error:userError } = useQuery(ME, {
        variables: { getUserId: userId },
    });
    const user = userData?.getUser;

    // if (loading) return <Spin tip="Loading deal..." />;
    if (error) return <Text type="danger">Error loading deal: {error.message}</Text>;
  
    const deal = data?.getDeal
    ? {
        key: data?.getDeal?.id,
        businessTitle: data?.getDeal?.business?.businessTitle || '-',
        buyerName: data?.getDeal?.buyer?.name || '-',
        sellerName: data?.getDeal?.business?.seller?.name || '-',
        finalizedOffer: data?.getDeal?.offer?.price ? `SAR ${data?.getDeal?.offer?.price.toLocaleString()}` : '-',
        status: data?.getDeal?.status || 0,
        date: data?.getDeal?.createdAt ? new Date(data?.getDeal?.createdAt).toLocaleDateString() : '-',
        busines: data?.getDeal?.business || '-',
        banks: data?.getDeal?.buyer?.banks || '-',
        isCommissionVerified: data?.getDeal?.isCommissionVerified || false,
        isDsaSeller: data?.getDeal?.isDsaSeller || false,
        isDsaBuyer: data?.getDeal?.isDsaBuyer || false,
        isDocVedifiedSeller : data?.getDeal?.isDocVedifiedSeller || false,
        isSellerCompleted : data?.getDeal?.isSellerCompleted || false,
    }: null;
  
    if (!deal) return <Text>No deal found</Text>;
    console.log('deal............',deal)
const buyerdealsData = [
    {
      title:'Seller Name',
      desc:deal?.sellerName
    },
    {
      title:'Buyer Name',
      desc:deal?.buyerName
    },
    {
      title:'Finalized Offer',
      desc:`SAR ${deal?.finalizedOffer}`
    },
    {
      title:'Status',
      desc:deal?.status
    },
  ]
  return (
    <Flex vertical gap={20}>
        <Flex vertical gap={25}>
            <Breadcrumb
                separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                items={[
                    {
                        title: <Text className='fs-13 text-gray cursor' onClick={() => setInprogressDeal(null)}>Deals</Text>,
                    },
                    {
                        title: <Text className='fw-500 fs-13 text-black'>{inprogressdeal?.title}</Text>,
                    },
                ]}
            />
        </Flex>
        <Flex gap={15} align='center'>
            <Button aria-labelledby='Arrow left' className='border-0 p-0 bg-transparent' onClick={() => setInprogressDeal(null)}>
                <ArrowLeftOutlined />
            </Button>
            <Title level={4} className='m-0'>
                {inprogressdeal?.title}
            </Title>
        </Flex>
        <Card className='radius-12 border-gray'>
            <div className='deals-status'>
                <Row gutter={[16, 16]}>
                    {
                        buyerdealsData?.map((list,index)=>
                            <Col xs={24} sm={12} md={6} lg={6} key={index}>
                                <Flex vertical gap={0}>
                                    <Text className='fw-600 fs-14'>{list?.title}</Text>
                                    {
                                    (list?.title === 'Status') ? (
                                        list.desc === 'In-progress' ?
                                        <Text className='bg-brand text-white fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>:
                                        <Text className='sendstatus fs-12 badge-cs fw-500 fit-content'>{list?.desc}</Text>
                                    ) : (
                                        <Text className='fs-14 fw-normal'>{list?.desc}</Text>
                                    )}
                                </Flex>
                            </Col>
                        )
                    }
                </Row>
            </div>
            <SingleInprogressSteps inprogressdeal={deal} />
        </Card>
    </Flex>
  )
}

export {SingleInProgressDeals}