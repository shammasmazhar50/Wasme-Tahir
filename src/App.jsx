import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SmoothScroll from './components/SmoothScroll';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollToTop from './components/ScrollToTop';

/* ── Lazy-loaded pages ──────────────────── */
const Home          = lazy(() => import('./pages/Home'));
const About         = lazy(() => import('./pages/About'));
const Collaborations= lazy(() => import('./pages/Collaborations'));
const Editorial     = lazy(() => import('./pages/Editorial'));
const Press         = lazy(() => import('./pages/Press'));
const BlogPost      = lazy(() => import('./pages/BlogPost'));
const MediaKit      = lazy(() => import('./pages/MediaKit'));
const MediaKitPDF   = lazy(() => import('./pages/MediaKitPDF'));
const Contact       = lazy(() => import('./pages/Contact'));
const NotFound      = lazy(() => import('./pages/NotFound'));
const AdminLogin    = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard= lazy(() => import('./pages/admin/AdminDashboard'));

/* ── Page-level Loading Fallback ────────── */
const PageLoader = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-body)',
    color: '#999',
    fontSize: '0.875rem',
    gap: '12px',
  }}>
    <span style={{
      width: 18, height: 18, border: '2px solid #ddd',
      borderTopColor: '#1a1a18', borderRadius: '50%',
      display: 'inline-block',
      animation: 'spin 0.75s linear infinite',
    }} />
    Loading…
  </div>
);

function App() {
  return (
    <SmoothScroll>
      <Router>
        <ScrollToTop />
        {/* Page-level error boundary — catches errors in any lazy-loaded page */}
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Main Site with Layout */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/collaborations" element={<Collaborations />} />
                <Route path="/editorial" element={<Editorial />} />
                <Route path="/press" element={<Press />} />
                <Route path="/press/:slug" element={<BlogPost />} />
                <Route path="/media-kit" element={<MediaKit />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              {/* Admin Routes without Layout */}
              <Route path="/media-kit/pdf" element={<MediaKitPDF />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </SmoothScroll>
  );
}

export default App;
