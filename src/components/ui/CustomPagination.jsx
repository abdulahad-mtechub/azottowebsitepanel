import { Col, Flex, Typography, Select, Pagination, Grid } from 'antd';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;
const { useBreakpoint } = Grid; 

const CustomPagination = ({
  totalItems,
  limit,
  setLimit,
  currentPage,
  setCurrentPage,
}) => {
  const screens = useBreakpoint();
  const { t } = useTranslation(); 

  return (
    <Col span={24} className='mt-3'>
      <Flex
        justify={screens.md ? 'space-between' : 'center'}
        align="center"
        wrap="wrap" 
        gap={screens.xs ? 16 : 24} 
      >
        <Flex gap={8} align='center' justify={screens.xs ? 'center' : 'flex-start'} style={{ flexShrink: 0, minWidth: screens.xs ? '100%' : 'auto' }}>
          <Text>{t('Rows Per Page')}:</Text>
          <Select
            className="select-filter"
            value={limit}
            onChange={(value) => {
              setLimit(value);
              setCurrentPage(1);
            }}
            options={[
              { value: 6, label: 6 },
              { value: 10, label: 10 },
              { value: 20, label: 20 },
              { value: 50, label: 50 },
            ]}
            style={{ width: 70 }}
          />
        </Flex>

        <Flex justify={screens.xs ? 'center' : 'flex-end'} style={{ flexGrow: 1, minWidth: screens.xs ? '100%' : 'auto' }}>
          <Pagination
            className='pagination'
            current={currentPage}
            pageSize={limit}
            total={totalItems}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} ${t('of')} ${total} ${t('items')}`}
            simple={screens.xs} 
            responsive={true}
            size={screens.sm ? 'default' : 'small'}
          />
        </Flex>
      </Flex>
    </Col>
  );
};

export { CustomPagination };