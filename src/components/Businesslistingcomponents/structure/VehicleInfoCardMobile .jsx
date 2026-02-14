import { Button, Card, Flex, Image, message, Typography } from 'antd';
import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client'
import { useFormatNumber } from '../../../hooks'

const { Title, Text } = Typography;

const VehicleInfoCardMobile = ({ data }) => {
  return (
    <>
      {contextHolder}
      <Card className='border0 mobile-view-info'>
        <div className='flex-card no-display-scroll mb-2'>
          {/* // vehile info section */}
        </div>
      </Card>
    </>
  )
}

export { VehicleInfoCardMobile };
