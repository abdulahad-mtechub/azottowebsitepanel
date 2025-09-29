import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Flex, Typography, Divider } from 'antd';
import { NOTIFICATION } from '../../../graphql/query';
import { useQuery } from '@apollo/client';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';

const { Text, Title } = Typography;

const SellerAlerts = ({ data }) => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userId = Cookies.get("userId");
    if (userId) {
      try {
        const parsedUser = JSON.parse(userId);
        setUserId(parsedUser?.id || parsedUser?.userId);
      } catch (err) {
        console.error("Invalid user JSON in localStorage");
      }
    }
  }, []);

  const { data: notification, loading, error, refetch } = useQuery(NOTIFICATION, {
    variables: { userId },
    skip: !userId,
    fetchPolicy: "network-only"
  });

  const notifications = notification?.getNotifications || [];

  return (
    <Row>
      <Col span={24}>
        <Card className='bg-light-white border-gray overflow-style'>
          {loading ? (
            <Text>{t('Loading...')}</Text>
          ) : error ? (
            <Text type="danger">{t('Error fetching notifications.')}</Text>
          ) : !notifications || notifications.length === 0 ? (
            <Text>{t('No Alerts')}</Text>
          ) : (
            notifications.map((alert, index) => (
              <Flex vertical gap={15} key={index}>
                <Text className='fs-15'>{alert?.name}</Text>
                <Flex vertical className='mt-2' gap={4}>
                  <Flex justify='space-between'>
                    <Title level={5} className='m-0 fw-500'>
                      {alert?.message}
                    </Title>
                    <Text className='text-gray fs-12'>
                      {alert?.isRead ? t('Read') : t('Unread')}
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
  );
};

export { SellerAlerts };
