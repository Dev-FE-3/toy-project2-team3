import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reset-css';
import MyPage from './pages/mypage/MyPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MyPage />
  </StrictMode>
);
