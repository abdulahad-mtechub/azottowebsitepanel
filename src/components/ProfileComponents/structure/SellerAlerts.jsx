import { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col, Card, Flex, Typography, Divider, Spin, Badge } from 'antd';
import { NOTIFICATION } from '../../../graphql/query';
import { useLazyQuery } from '@apollo/client';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useFormatNumber } from '../../../hooks';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const PAGE_SIZE = 10;

const SellerAlerts = () => {

  const { formatNumber } = useFormatNumber();
  const { t } = useTranslation();
  const [userId, setUserId] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const scrollContainerRef = useRef(null);
  const isFetchingRef = useRef(false);

  const [loadNotifications] = useLazyQuery(NOTIFICATION, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const cookieUserId = Cookies.get('userId');
    if (cookieUserId) {
      setUserId(cookieUserId);
    }
  }, []);

  const loadAlerts = useCallback(async (offset = 0) => {
    if (!userId || isFetchingRef.current) {
      return;
    }

    isFetchingRef.current = true;
    setFetchError('');

    if (offset === 0) {
      setIsInitialLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const { data } = await loadNotifications({
        variables: {
          userId,
          limit: PAGE_SIZE,
          offSet: offset,
        },
      });

      const payload = data?.getNotifications;
      const nextAlerts = payload?.notifications ?? [];

      setTotalCount(payload?.count ?? 0);
      setAlerts((prev) => (offset === 0 ? nextAlerts : [...prev, ...nextAlerts]));
    } catch (err) {
      console.error('Error fetching notifications', err);
      setFetchError(t('Error fetching notifications.'));
    } finally {
      isFetchingRef.current = false;
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  }, [userId, loadNotifications, t]);

  useEffect(() => {
    if (!userId) {
      return;
    }

    setAlerts([]);
    setTotalCount(0);
    loadAlerts(0);
  }, [userId, loadAlerts]);

  const hasMore = alerts.length < totalCount;

  const handleScroll = useCallback((event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isNearBottom = scrollHeight - scrollTop - clientHeight <= 16;

    if (isNearBottom && hasMore && !isFetchingRef.current) {
      loadAlerts(alerts.length);
    }
  }, [alerts.length, hasMore, loadAlerts]);

  return (
    <Row>
      <Col span={24}>
        <Card className='border-gray overflow-style' style={{backgroundColor: "#FCFCFD"}}>
          {/* Header with Total Count */}
          {!isInitialLoading && alerts.length > 0 && (
            <Flex justify='space-between' align='center' className='mb-3'>
              <Title level={5} className='m-0 fw-500'>
                {t('Alerts')}
              </Title>
              <Badge 
                count={formatNumber(totalCount)} 
                showZero 
                style={{ backgroundColor: '#52c41a' }}
                overflowCount={999}
              />
            </Flex>
          )}

          {isInitialLoading ? (
            <Flex align='center' justify='center' style={{ minHeight: 300 }}>
              <Spin size='default' tip={t('Loading alerts...')} />
            </Flex>
          ) : alerts.length === 0 ? (
            <Flex align='center' justify='center' style={{ minHeight: 200 }} vertical gap={10}>
              {fetchError ? (
                <>
                  <img src='/assets/icons/info-outline.png' width={48} alt='error' />
                  <Text type='danger' className='fs-15'>{fetchError}</Text>
                </>
              ) : (
                <>
                  <img src='/assets/icons/notification.png' width={48} alt='no alerts' />
                  <Text className='fs-15 text-gray'>{t('No Alerts')}</Text>
                </>
              )}
            </Flex>
          ) : (
            <>
              <div
                ref={scrollContainerRef}
                className='overflowstyle'
                onScroll={handleScroll}
                style={{ 
                  maxHeight: 520, 
                  overflowY: 'auto', 
                  paddingRight: 8,
                  marginTop: 12
                }}
              >
                {alerts.map((alert, index) => (
                  <>
                  <Flex 
                    vertical 
                    gap={12} 
                    key={alert?.id ?? index}
                    className='p-3 rounded-8'
                    style={{ 
                      backgroundColor: alert?.isRead ? 'transparent' : '#f0f7ff',
                      border: alert?.isRead ? 'none' : '1px solid #d6e4ff',
                    }}
                  >
                    <Flex justify='space-between' align='flex-start' gap={8}>
                      <Flex vertical gap={6} style={{ flex: 1 }}>
                        <Flex align='center' gap={8}>
                          {!alert?.isRead && (
                            <Badge status='processing' />
                          )}
                          <Title level={5} className='m-0'>{alert?.name}</Title>
                        </Flex>
                        <Text className='m-0 text-gray fw-400' style={{ lineHeight: 1.5 }}>
                          {alert?.message}
                        </Text>
                      </Flex>
                      {alert?.createdAt && (
                        <Text className='text-gray fs-12'>
                          {dayjs(alert.createdAt).format('MMM DD, YYYY • hh:mm A')}
                        </Text>
                      )}
                    </Flex>
                    
                  </Flex>
                  <Divider className='m-0' />
                  </>
                ))}

                {isLoadingMore && (
                  <Flex justify='center' className='py-3 mt-2'>
                    <Spin size='small' />
                  </Flex>
                )}

                {fetchError && !isLoadingMore && (
                  <Flex justify='center' className='py-3 mt-2'>
                    <Text type='danger' className='fs-13'>{fetchError}</Text>
                  </Flex>
                )}
              </div>

              {/* Footer showing loaded count */}
              <Divider className='my-3' />
              <Flex justify='center'>
                <Text className='text-gray fs-12'>
                  {t('Showing')} {formatNumber(alerts.length)} {t('of')} {formatNumber(totalCount)} {t('alerts')}
                  {hasMore && ` • ${t('Scroll for more')}`}
                </Text>
              </Flex>
            </>
          )}
        </Card>
      </Col>
    </Row>
  );
};

export { SellerAlerts };
