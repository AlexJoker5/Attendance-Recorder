import { AppEntry } from '@/app/AppEntry';
import '@/lib/i18n';
import '@/styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppEntry />
    </BrowserRouter>
  </StrictMode>,
);
