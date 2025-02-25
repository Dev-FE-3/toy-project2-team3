import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reset-css';
import App from './App.tsx';
import Calendar from './pages/calendar/Calendar.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Calendar />
  </StrictMode>
);
