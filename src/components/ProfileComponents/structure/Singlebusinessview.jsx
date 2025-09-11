import { Card, Row, Col, Flex, Typography, Breadcrumb, Space, Button, Image, Tabs } from 'antd'
import { ArrowLeftOutlined, RightOutlined } from '@ant-design/icons';
import { SellerOfferTable } from './SellerOfferTable';
import { SellerDealDetails } from './SellerDealDetails';
import { useQuery } from '@apollo/client';
import { GET_BUSINESS } from '../../../graphql/query/business';

const { Text, Title } = Typography;
const Singlebusinessview = ({setSingleDetail, singledetail}) => {
    const { data, loading:businessLoading, error:businessError } = useQuery(GET_BUSINESS, {
        variables: { getBusinessByIdId: singledetail },
        skip: !singledetail, // in case id is undefined
    });

    const business = data?.getBusinessById?.business
    const items = [
        {
            key:'1',
            label:'Details',
            children: <SellerDealDetails data={business} />
        },
        {
            key:'2',
            label:'Offer',
            children:<SellerOfferTable data={business}/>
        },
    ]
   

function mapBusinessPayloadToUI(payload) {
    return {
      id: payload?.id,
      ref: payload?.reference, // from backend
      title: payload?.businessTitle,
      description: payload?.description,
      amount: `SAR ${payload?.price?.toLocaleString()}`, // format nicely
      status: payload?.isSupportVerified ? "Active" : "Under-review", // adjust logic
      type: payload?.isByTakbeer ? "Taqbeel" : "Acquiring",
  
      // Revenue / Profit / Capital Recovery
      child: [
        {
          id: 1,
          icon: '/assets/icons/year-p.png',
          subtitle: `SAR ${payload?.revenue.toLocaleString()}`,
          subdesc: `${payload?.revenueTime}`,
        },
        {
          id: 2,
          icon: '/assets/icons/revenue.png',
          subtitle: `SAR ${payload?.profit.toLocaleString()}`,
          subdesc: `${payload?.profittime}`,
        },
        {
          id: 3,
          icon: '/assets/icons/team.png',
          subtitle: `${payload?.recoveryTime} months`,
          subdesc: 'Capital Recovery',
        },
      ],
  
      // Aggregates (dummy since backend does not send yet)
      detailinfo: [
        {
          id: 1,
          img: '/assets/icons/total-view.png',
          title: 'Total Views',
          numbers: data?.getBusinessById?.totalViews ?? '0'
        },
        {
          id: 2,
          img: '/assets/icons/noofoffer.png',
          title: 'Number of Offers',
          numbers: data?.getBusinessById?.numberOfOffers ?? '0'
        },
        {
          id: 3,
          img: '/assets/icons/favorite-ic.png',
          title: 'Number of Favorites',
          numbers: data?.getBusinessById?.numberOfFavorites ?? '0'
        },
      ],
  
      // Offers if returned
      offerData: payload?.offers?.map((offer, i) => ({
        key: String(i + 1),
        buyername: offer?.buyer?.name ?? "N/A",
        businessprice: `SAR ${payload?.price?.toLocaleString()}`,
        offerprice: {
          amount: offer?.price,
          type: offer?.type ?? "PP"
        },
        status: offer?.status,
        date: new Date(offer?.createdAt).toLocaleString(),
      })) ?? []
    };
  }
  const uiBusiness = mapBusinessPayloadToUI(business);

    return (
        <div className='mb-2'>
            <Flex vertical gap={20}>
                    <Breadcrumb
                        separator={<Text className='text-gray'><RightOutlined className='fs-10' /></Text>}
                        items={[
                            {
                                title: <Text className='fs-13 text-gray' italic>Business Listing</Text>,
                            },
                            {
                                title: <Text className='fw-500 fs-13 text-black' italic>{business?.businessTitle}</Text>,
                            },
                        ]}
                    />
                    <Flex justify='space-between'>
                        <Space>
                            <Button aria-labelledby='Arrow left' type='button' className='p-0 border-0 bg-transparent' onClick={()=>setSingleDetail(null)}>
                                <ArrowLeftOutlined />
                            </Button>
                            <Title level={5} className='m-0'>{business?.businessTitle}</Title>
                        </Space>
                        <Space>
                            <Button aria-labelledby='Edit' className='btn bg-brand rounded-8' type='button'>
                                Edit
                            </Button>
                            <Button aria-labelledby='Inactivate Business' className='btn bg-red rounded-8' type='button'>
                                Inactivate Business
                            </Button>
                        </Space>
                    </Flex>
                    <Card className='radius-12 border-gray card-cs'>
                        <Row gutter={[16, 16]}>
                            {
                                uiBusiness.detailinfo.map((data, i) => (
                                    <Col lg={{ span: 8 }} md={{ span: 12 }} sm={{ span: 12 }} xs={{ span: 12 }} key={i}>
                                        <Card className='h-100 border-gray rounded-12' >
                                            <Flex vertical gap={15}>
                                                <Image src={data?.img} alt='image' preview={false} width={40} />
                                                <div>
                                                    <Text className='fs-14 text-gray'>
                                                        {data?.title}
                                                    </Text>
                                                    <Title className='m-0' level={5}>
                                                        {data?.numbers}
                                                    </Title>

                                                </div>
                                            </Flex>
                                        </Card>
                                    </Col>
                                ))
                            }

                            <Col span={24}>
                                <Tabs 
                                    className='tabs-fill'
                                    defaultActiveKey="1"
                                    items={items}
                                />
                            </Col>

                        </Row>
                    </Card>
                </Flex>
        </div>
    )
}

export { Singlebusinessview } 
