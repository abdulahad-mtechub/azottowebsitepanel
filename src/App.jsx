import { ConfigProvider } from 'antd'
import { RouteF } from './RouteF'
import '@ant-design/v5-patch-for-react-19';
import { useEffect, useState } from 'react';
import i18n from './i18n';
import { startAutoRefresh, stopAutoRefresh } from './utils/tokenRefreshService';
import { hasValidSession } from './utils/tokenManager';

import enUS from 'antd/locale/en_US';
import arEG from 'antd/locale/ar_EG';
const getAntdLocale = (lang) => (lang === 'ar' ? arEG : enUS);
import 'dayjs/locale/ar';
import dayjs from 'dayjs';
dayjs.locale('ar');
function App() {


  const [dir, setDir] = useState(i18n.language === 'ar' ? 'rtl' : 'ltr');
  const isArabic = i18n.language === 'ar';
  const [antdLocale, setAntdLocale] = useState(getAntdLocale(i18n.language));

  // Initialize auto token refresh on app mount
  // This handles token recovery when access token expired but refresh token exists
  useEffect(() => {
    const initAuth = async () => {
      // Check if user has any valid session (access OR refresh token)
      if (hasValidSession()) {
        console.log('🔐 Session detected - initializing auth...');
        await startAutoRefresh();
      } else {
        console.log('ℹ️ No session found - user not logged in');
      }
    };

    initAuth();

    // Cleanup on unmount
    return () => {
      stopAutoRefresh();
    };
  }, []);

  useEffect(() => {

    const handleLanguageChange = (lang) => {
      const newDir = lang === 'ar' ? 'rtl' : 'ltr';
      setDir(newDir);
      setAntdLocale(getAntdLocale(lang));
      document.documentElement.lang = lang;
      document.documentElement.dir = newDir;
    };
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
     dayjs.locale(isArabic ? 'ar' : 'en');
  }, [isArabic]);

  return (
    <ConfigProvider
      direction={dir}
      locale={antdLocale}
      theme={{
        token: {
          colorPrimary: '#1D4ED8',
          colorError: '#BC302F',
        },
        components:{
          Timeline: {
            dotBg: 'transparent',
          },
        }
      }}
    >
      <RouteF />
    </ConfigProvider>
  )
}

export default App
