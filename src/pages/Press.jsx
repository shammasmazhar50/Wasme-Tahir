import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBlogs } from '../utils/blogLoader';
import './Press.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
});

const Press = () => {
  const [visibleBlogs, setVisibleBlogs] = useState(6);
  const allBlogs = getBlogs();

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
      <div className="container">

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
                  src={blog.image} 
                  alt={blog.title} 
                  style={{ objectPosition: blog.imagePosition || 'center' }} 
                />
              </div>
              <div className="article-content">
                <span className="subheading">{blog.category}</span>
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
            <motion.a href="#" className="download-card" {...fadeUp()}>
              <Download size={24} />
              <h4>Download Media Kit</h4>
              <p>PDF, 2.4MB</p>
            </motion.a>

            <motion.a href="#" className="download-card" {...fadeUp(0.1)}>
              <Download size={24} />
              <h4>High-Resolution Images</h4>
              <p>ZIP, 145MB</p>
            </motion.a>

            <motion.a href="#" className="download-card" {...fadeUp(0.2)}>
              <Download size={24} />
              <h4>Download Bio</h4>
              <p>PDF, 120KB</p>
            </motion.a>

            <motion.a href="#" className="download-card" {...fadeUp(0.3)}>
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
