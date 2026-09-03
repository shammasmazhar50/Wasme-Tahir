import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

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

const TikTokIcon = ({ size = 24, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <h2 className="footer-logo">WASME TAHIR</h2>
            <p className="footer-tagline">Digital Creator · Fashion · Lifestyle · Culture</p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <a href="https://instagram.com/wasmetahir?igsi=MXVndXRpa3pteGxodA==" target="_blank" rel="noreferrer"><InstagramIcon size={20} /> Instagram</a>
              <a href="https://www.tiktok.com/@wasmetahir" target="_blank" rel="noreferrer"><TikTokIcon size={20} /> TikTok</a>
              <a href="https://www.youtube.com/@wasmetahir" target="_blank" rel="noreferrer"><YoutubeIcon size={20} /> YouTube</a>
              <a href="https://www.facebook.com/p/Wasme-Tahir-61578603143089/" target="_blank" rel="noreferrer"><FacebookIcon size={20} /> Facebook</a>
            </div>
            <div className="footer-column">
              <Link to="/press">Press & PR</Link>
              <Link to="/collaborations">Brand Collaborations</Link>
              <Link to="/media-kit">Media Kit</Link>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Wasme Tahir. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
