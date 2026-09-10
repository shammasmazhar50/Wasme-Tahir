import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { Download, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Press.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
});

const Press = () => {
  const navigate = useNavigate();
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const [allBlogs, setAllBlogs] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  React.useEffect(() => {
    const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com');
    fetch(`${API}/api/posts`)
      .then(res => res.json())
      .then(data => {
        // filter published only
        setAllBlogs(data.filter(p => p.published));
      })
      .catch(console.error);
  }, []);

  const loadMore = () => {
    setVisibleBlogs(prev => prev + 6);
  };

  return (
    <motion.div
      className="press-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SEO 
        title="Press | Wasme Tahir" 
        url="https://wasmetahir.com/press" 
      />
      <div className="container">
        
        {/* Toast Notification */}
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              backgroundColor: 'var(--color-soft-black)',
              color: 'var(--color-warm-ivory)',
              padding: '1rem 2rem',
              borderRadius: '2rem',
              zIndex: 1000,
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
            }}
          >
            {toastMessage}
          </motion.div>
        )}

        <section className="press-header">
          <motion.h1
            className="heading-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Press & Features
          </motion.h1>
        </section>

        <section className="press-featured-in">
          <motion.p className="subheading text-center" {...fadeUp()}>Featured In</motion.p>
          <motion.div className="press-logos" {...fadeUp(0.2)}>
            <span>VOGUE</span>
            <span>GQ</span>
            <span>ALLURE</span>
            <span>HARPER'S BAZAAR</span>
          </motion.div>
        </section>

        <section className="press-articles">
          {allBlogs.slice(0, visibleBlogs).map((blog, index) => (
            <motion.div className="article-row" {...fadeUp(index * 0.1)} key={blog.slug || blog.fileSlug}>
              <div className="article-img">
                <img 
                  src={blog.coverImage || '/images/default-blog.webp'} 
                  alt={blog.title} 
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: 'center' }} 
                />
              </div>
              <div className="article-content">
                <span className="subheading">{blog.category || 'EDITORIAL'}</span>
                <h3 className="heading-md">{blog.title}</h3>
                <Link to={`/press/${blog.slug || blog.fileSlug}`} className="read-more">
                  Read Feature <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
          
          {visibleBlogs < allBlogs.length && (
            <div className="load-more-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}>
              <button onClick={loadMore} className="mk-contact-btn" style={{ background: 'transparent', color: 'var(--color-rich-charcoal)', border: '1px solid var(--color-rich-charcoal)', cursor: 'pointer' }}>
                Load More Articles
              </button>
            </div>
          )}
        </section>

        <section className="press-downloads">
          <motion.h3 className="heading-md text-center" {...fadeUp()}>Press Assets</motion.h3>

          <div className="download-grid">
            <motion.a href="/media-kit/pdf" target="_blank" rel="noopener noreferrer" className="download-card" style={{cursor: 'pointer'}} {...fadeUp()}>
              <Download size={24} />
              <h4>Download Media Kit</h4>
              <p>PDF, Auto-Generated</p>
            </motion.a>

            <motion.a onClick={(e) => { e.preventDefault(); showToast('High-Resolution Images ZIP will be available soon.'); }} href="#" className="download-card" {...fadeUp(0.1)}>
              <Download size={24} />
              <h4>High-Resolution Images</h4>
              <p>ZIP, 145MB</p>
            </motion.a>

            <motion.a onClick={(e) => { e.preventDefault(); showToast('Bio PDF will be available soon.'); }} href="#" className="download-card" {...fadeUp(0.2)}>
              <Download size={24} />
              <h4>Download Bio</h4>
              <p>PDF, 120KB</p>
            </motion.a>

            <motion.a onClick={(e) => { e.preventDefault(); showToast('Headshots ZIP will be available soon.'); }} href="#" className="download-card" {...fadeUp(0.3)}>
              <Download size={24} />
              <h4>Download Headshots</h4>
              <p>ZIP, 45MB</p>
            </motion.a>
          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default Press;
