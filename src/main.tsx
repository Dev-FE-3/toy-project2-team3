import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reset-css';
import App from './App';
import ThemeProvider from './providers/ThemeProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
