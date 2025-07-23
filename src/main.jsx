import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ApolloProvider } from '@apollo/client';
import { client } from './config/apolloClient'; 
import { AuthProvider } from './context/AuthContext';

createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <AuthProvider>
  <StrictMode>
    <App />
  </StrictMode>
  </AuthProvider>
  </ApolloProvider>
)
