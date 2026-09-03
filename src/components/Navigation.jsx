import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Navigation.css';

const InstagramIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const FacebookIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3.81l.39-4h-4.2V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

// Using a custom TikTok icon since lucide-react doesn't have one natively
const TikTokIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collaborations', path: '/collaborations' },
    { name: 'Editorial', path: '/editorial' },
    { name: 'Press', path: '/press' },
    { name: 'Media Kit', path: '/media-kit' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <header className={`navigation ${isScrolled ? 'scrolled' : ''} ${isHome && !isScrolled ? 'transparent' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="brand-logo">
            WASME TAHIR
          </Link>

          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="social-links desktop-social">
            <a href="https://instagram.com/wasmetahir?igsi=MXVndXRpa3pteGxodA==" target="_blank" rel="noreferrer"><InstagramIcon size={20} /></a>
            <a href="https://www.tiktok.com/@wasmetahir" target="_blank" rel="noreferrer"><TikTokIcon size={20} /></a>
            <a href="https://www.youtube.com/@wasmetahir" target="_blank" rel="noreferrer"><YoutubeIcon size={20} /></a>
            <a href="https://www.facebook.com/p/Wasme-Tahir-61578603143089/" target="_blank" rel="noreferrer"><FacebookIcon size={20} /></a>
          </div>

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-nav-overlay"
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className="mobile-nav">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                >
                  <Link to={link.path}>{link.name}</Link>
                </motion.div>
              ))}

              <motion.div
                className="social-links mobile-social"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navLinks.length * 0.1 + 0.2 }}
              >
                <a href="https://instagram.com/wasmetahir?igsi=MXVndXRpa3pteGxodA==" target="_blank" rel="noreferrer"><InstagramIcon size={24} /></a>
                <a href="https://www.tiktok.com/@wasmetahir" target="_blank" rel="noreferrer"><TikTokIcon size={24} /></a>
                <a href="https://www.youtube.com/@wasmetahir" target="_blank" rel="noreferrer"><YoutubeIcon size={24} /></a>
                <a href="https://www.facebook.com/p/Wasme-Tahir-61578603143089/" target="_blank" rel="noreferrer"><FacebookIcon size={24} /></a>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
