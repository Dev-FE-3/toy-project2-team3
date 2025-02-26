import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'reset-css';
import Dropdown from './widgets/dropdown/dropdownSample';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Dropdown />
  </StrictMode>
);
