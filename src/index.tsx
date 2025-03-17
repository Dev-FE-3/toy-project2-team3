import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reset-css'; // 여기에 추가
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
