import React, { useState } from 'react';
import { List, Typography } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';

const { Text } = Typography;

const CustomTabs = ({ items, activeKey, onChange }) => {
  const [openKeys, setOpenKeys] = useState([]);

  const toggleOpen = (key) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  return (
    <List
      size="small"
      dataSource={items}
      renderItem={(item) => {
        const isParentActive = item.key === activeKey;
        const isOpen = openKeys.includes(item.key);
        const hasChildren = !!item.children?.length;
        
        // Check if any child is selected
        const isChildSelected = hasChildren && item.children.some(child => child.key === activeKey);
        
        // Parent is active only if it's directly selected OR one of its children is selected
        const isActive = isParentActive || isChildSelected;

        return (
          <List.Item
            style={{
              background: 'transparent',
              padding: 0,
              border: 'none',
              borderRadius: 8,
              display: 'block',
              marginBottom: 4,
            }}
          >
            {/* Parent item */}
            <div
              onClick={() => {
                if (hasChildren) {
                  toggleOpen(item.key);
                } else {
                  onChange(item.key);
                }
              }}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 16px',
                fontWeight: 500,
                borderLeft: isActive ? '4px solid #2F54EB' : '4px solid transparent',
                background: isActive ? '#f0f5ff' : 'transparent',
                borderRadius: 8,
                cursor: 'pointer',
                color: isActive ? '#1a1a1a' : '#595959',
                transition: 'all 0.3s',
              }}
            >
              <Text strong={isActive}>{item.label}</Text>
              {hasChildren && (isOpen ? <DownOutlined /> : <RightOutlined />)}
            </div>

            {/* Child items */}
            {hasChildren && isOpen && (
              <List
                size="small"
                style={{
                  borderLeft: '2px solid #2F54EB',
                  paddingLeft: 12,
                  background:'white'
                }}
                bordered={false}
                dataSource={item.children}
                renderItem={(child) => {
                  const isChildActive = child.key === activeKey;
                  return (
                    <List.Item
                      style={{
                        padding: '6px 0',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        margin:4
                      }}
                      onClick={() => onChange(child.key)}
                    >
                      <Text
                        style={{
                          color: isChildActive ? '#1D4ED8' : '#595959',
                          fontWeight: isChildActive ? 600 : 400,
                        }}
                      >
                        {child.label}
                      </Text>
                    </List.Item>
                  );
                }}
              />
            )}
          </List.Item>
        );
      }}
    />
  );
};

export { CustomTabs };
