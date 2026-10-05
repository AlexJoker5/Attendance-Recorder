import { App } from '@/app/App';
import { AppProviders } from '@/app/providers';
import { ConnectionBoundary } from '@/features/connection/components/ConnectionBoundary';
import '@/lib/i18n';
import '@/styles/globals.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConnectionBoundary>
        <AppProviders>
          <App />
        </AppProviders>
      </ConnectionBoundary>
    </BrowserRouter>
  </StrictMode>,
);
