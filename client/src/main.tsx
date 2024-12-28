import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import "@fontsource/poppins";
import { ThemeProvider } from '@mui/material';
import theme from './themes/themes.ts';
import { Provider } from 'react-redux';
import { persistor, store } from './store/store.ts';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
    </PersistGate>
  </Provider>
  
)
