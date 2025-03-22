import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './redux/store';
import 'reset-css';

import App from './App';
import ThemeProvider from './providers/ThemeProvider';
import GlobalStyle from './styles/createGlobalStyle';
import { ToastContainer } from 'react-toastify';

if (!document.getElementById('modal-root')) {
  const modalRoot = document.createElement('div');
  modalRoot.id = 'modal-root';
  document.body.appendChild(modalRoot);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyle />
        <App />
        <ToastContainer autoClose={2000} />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
