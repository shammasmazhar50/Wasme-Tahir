import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SmoothScroll from './components/SmoothScroll';
import Home from './pages/Home';
import About from './pages/About';
import Collaborations from './pages/Collaborations';
import Editorial from './pages/Editorial';
import Press from './pages/Press';
import MediaKit from './pages/MediaKit';
import Contact from './pages/Contact';

function App() {
  return (
    <SmoothScroll>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="collaborations" element={<Collaborations />} />
            <Route path="editorial" element={<Editorial />} />
            <Route path="press" element={<Press />} />
            <Route path="media-kit" element={<MediaKit />} />
            <Route path="contact" element={<Contact />} />
          </Route>
        </Routes>
      </Router>
    </SmoothScroll>
  );
}

export default App;
