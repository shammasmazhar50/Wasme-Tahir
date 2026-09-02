import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SmoothScroll from './components/SmoothScroll';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Collaborations = lazy(() => import('./pages/Collaborations'));
const Editorial = lazy(() => import('./pages/Editorial'));
const Press = lazy(() => import('./pages/Press'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const MediaKit = lazy(() => import('./pages/MediaKit'));
const Contact = lazy(() => import('./pages/Contact'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <SmoothScroll>
      <Router>
        <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'var(--font-body)' }}>Loading...</div>}>
          <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="collaborations" element={<Collaborations />} />
            <Route path="editorial" element={<Editorial />} />
            <Route path="press" element={<Press />} />
            <Route path="press/:slug" element={<BlogPost />} />
            <Route path="media-kit" element={<MediaKit />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          </Routes>
        </Suspense>
      </Router>
    </SmoothScroll>
  );
}

export default App;
