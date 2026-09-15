import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Subtle developer credit — visible only in DevTools console
console.log(
  '%c  WT Portfolio  ',
  'background:#1a1a18;color:#b89a6a;font-size:12px;font-weight:700;padding:4px 8px;border-radius:4px;'
);
console.log('%cDesigned & Developed by Syvrox · syvrox.com', 'color:#888;font-size:11px;');

import { HelmetProvider } from 'react-helmet-async';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('[main.jsx] Root element #root not found in DOM!');

createRoot(rootEl).render(
  <HelmetProvider>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </HelmetProvider>
);
