import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Result, Button, Typography, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

const ProtectedRoute = ({ children }) => {
  const authToken = Cookies.get('authToken');
  const userStatus = Cookies.get('userStatus');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // If no token, redirect to home
  if (!authToken) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

 const rawPath = location.pathname || '/';
  const pathname = rawPath.replace(/\/+$/, '') || '/';

  const isProfileDashboard =
    pathname === '/profiledashboard' ||
    pathname === '/sellbusinesscreate'  
  const isUserInactive = userStatus === "pending" || userStatus === "inactive";
  
  if (isUserInactive && isProfileDashboard) {
    return (
      <div className='padd-1 relative'>
        <div className='container'>
        <Result
          icon={<ExclamationCircleOutlined style={{ color: '#faad14' }} />}
          title={t("Account Verification Pending")}
          subTitle={
            <Text style={{ fontSize: '16px' }}>
              {t("Your account is not verified yet. Please contact support to verify your account. Once your account is verified, you will get full access to all features.")}
            </Text>
          }
          extra={[
            <Flex gap={5} justify='center'>
            <Button 
              type="primary" 
              key="home" 
              onClick={() => navigate('/')}
              className='bg-brand'
            >
              {t("Go to Home")}
            </Button>,
            <Button 
              key="profile" 
              onClick={() => navigate('/businesslisting')}
            >
              {t("View Business Listings")}
            </Button>
            </Flex>
          ]}
        />
      </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
