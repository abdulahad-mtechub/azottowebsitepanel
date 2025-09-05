import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons'
import { Breadcrumb, Button, Card, Col, Flex, Row, Typography } from 'antd'
import { SellerSingleInprogressSteps } from './SellerSingleInProgressSteps'
import { GETDEAL, ME } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import Cookies from "js-cookie";

const { Title, Text } = Typography
const SellerSingleInProgressDeals = ({inprogressdeal, setInprogressDeal}) => {
    const userId = Cookies.get("userId"); // read userId from cookie
    const dealId = inprogressdeal.key;
    const { data, loading, error } = useQuery(GETDEAL, {
      variables: { getDealId: dealId },
      fetchPolicy: 'network-only', // always fetch fresh data
    });

    const { data:userData, loading:userLoading, error:userError } = useQuery(ME, {
        variables: { getUserId: userId },
    });
    const user = userData?.getUser;

    // if (loading) return <Spin tip="Loading deal..." />;
    if (error) return <Text type="danger">Error loading deal: {error.message}</Text>;
  
    const deal = data?.getDeal;
  
    if (!deal) return <Text>No deal found</Text>;
 
    const sellerdealsData = [
        {
          title:'Seller Name',
          desc:deal?.business?.seller?.name
        },
        {
          title:'Buyer Name',
          desc:deal?.buyer?.name
        },
        {
          title:'Finalized Offer',
          desc:deal.price
        },
        {
          title:'Status',
          desc:deal.status
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
                        title: <Text className='fw-500 fs-13 text-black'>{deal?.business?.businessTitle}</Text>,
                    },
                ]}
            />
        </Flex>
        <Flex gap={15} align='center'>
            <Button className='border-0 p-0 bg-transparent' onClick={() => setInprogressDeal(null)}>
                <ArrowLeftOutlined />
            </Button>
            <Title level={4} className='m-0'>
                {deal?.business?.businessTitle}
            </Title>
        </Flex>
        <Card className='radius-12 border-gray'>
            <div className='deals-status'>
                <Row gutter={[16, 16]}>
                    {
                        sellerdealsData?.map((list,index)=>
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
            <SellerSingleInprogressSteps user={user} deal={deal}/>
        </Card>
    </Flex>
  )
}

export {SellerSingleInProgressDeals}