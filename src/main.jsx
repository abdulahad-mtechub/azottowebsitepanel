import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client';
import { client } from './config/apolloClient'; 
import { AuthProvider } from './context/AuthContext';
import "./i18n"
// Dayjs plugins required by Ant Design DatePicker to handle weekdays/week start
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';

dayjs.extend(weekday);
dayjs.extend(localeData);
createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
   </AuthProvider>
   </ApolloProvider>
)
