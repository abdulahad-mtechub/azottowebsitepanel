import React,{useState,useEffect} from 'react'
import { Row, Col, Card, Flex, Typography, Divider } from 'antd'
const { Text, Title } = Typography;
import {NOTIFICATION } from '../../../graphql/query';
import { useQuery } from '@apollo/client';

const SellerAlerts = ({data}) => {
    const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user"); // adjust key as per your app
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser?.id || parsedUser?.userId);
      } catch (err) {
        console.error("Invalid user JSON in localStorage");
      }
    }
  }, []);

  const { data:notification, loading, error, refetch } = useQuery(NOTIFICATION, {
    variables: { userId },
    skip: !userId, // wait until userId is set
    fetchPolicy: "network-only" // optional, ensures fresh data
  });

  const notifications = notification?.getNotifications || [];

    return (
        <Row>
            <Col span={24}>
                <Card className='bg-light-white border-gray overflow-style'>
                {loading ? (
                    <Text>Loading...</Text>
                    ) : error ? (
                        <Text type="danger">Error fetching notifications.</Text>
                    ) : !notifications || notifications.length === 0 ? (
                        <Text>No Alerts</Text>
                    ) : (
                        notifications.map((alert, index) => (
                        <Flex vertical key={index}>
                            <Text className='fs-15'>{alert?.name}</Text>
                            <Flex vertical className='mt-2' gap={4} style={{ marginLeft: 15 }}>
                            <Flex justify='space-between'>
                                <Title level={5} className='m-0 fw-500'>
                                {alert?.message}
                                </Title>
                                <Text className='text-gray fs-12'>
                                {alert?.isRead ? 'Read' : 'Unread'}
                                </Text>
                            </Flex>
                            </Flex>
                            <Divider />
                        </Flex>
                        ))
                    )}
                </Card>
            </Col>
        </Row>
    )
}

export { SellerAlerts } 
