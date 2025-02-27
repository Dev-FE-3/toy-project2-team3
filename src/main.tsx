import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reset-css';
import App from './App';
import CalendarMain from './pages/calendar/CalendarMain';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <CalendarMain />
  </StrictMode>
);
