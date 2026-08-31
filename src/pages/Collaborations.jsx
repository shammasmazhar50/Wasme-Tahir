import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import './Collaborations.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
};

const Collaborations = () => {
  return (
    <motion.div 
      className="collab-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <section className="collab-header">
          <motion.h1 
            className="heading-lg text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Brands I've had the pleasure<br/>of working with
          </motion.h1>
          <motion.div 
            className="collab-categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            <span>Fashion</span>
            <span>Beauty</span>
            <span>Lifestyle</span>
            <span>Food & Beverage</span>
            <span>Finance / Services</span>
            <span>Travel</span>
          </motion.div>
        </section>

        <section className="collab-logos">
          <div className="logo-grid">
            {/* Placeholder for logos */}
            {[...Array(12)].map((_, i) => (
              <motion.div 
                key={i} 
                className="logo-item"
                {...fadeUp}
                transition={{ delay: (i % 4) * 0.1 }}
              >
                BRAND {i + 1}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="case-studies">
          <motion.h2 
            className="heading-lg text-center case-studies-title"
            {...fadeUp}
          >
            Case Studies
          </motion.h2>

          <div className="case-study-list">
            {/* Case Study 1 */}
            <motion.div className="case-study-card" {...fadeUp}>
              <div className="case-img" style={{ backgroundImage: 'url(/images/7E924B31-AAB3-41E3-B6B0-24E65BFABF81.png)' }}></div>
              <div className="case-content">
                <div className="case-meta">
                  <span className="subheading">SENDWAVE</span>
                  <h3 className="heading-md">Connecting people across borders</h3>
                </div>
                
                <div className="case-details">
                  <div className="detail-item">
                    <h4>The Brief</h4>
                    <p>What the brand wanted to achieve with the Pakistani-American demographic.</p>
                  </div>
                  <div className="detail-item">
                    <h4>The Concept</h4>
                    <p>How Wasme integrated the brand naturally into her typical family and lifestyle content.</p>
                  </div>
                </div>

                <div className="case-results">
                  <div className="result-stat">
                    <strong>185K+</strong>
                    <span>Views</span>
                  </div>
                  <div className="result-stat">
                    <strong>3.1K+</strong>
                    <span>Likes</span>
                  </div>
                </div>
                
                <button className="view-case-btn">Full Case Study <ArrowRight size={16} /></button>
              </div>
            </motion.div>
            
            {/* Case Study 2 */}
            <motion.div className="case-study-card reverse" {...fadeUp}>
              <div className="case-img" style={{ backgroundImage: 'url(/images/24230D23-EA10-4D64-B521-27B9642A07BA.jpg)' }}></div>
              <div className="case-content">
                <div className="case-meta">
                  <span className="subheading">FASHION BRAND</span>
                  <h3 className="heading-md">Fall/Winter Collection Launch</h3>
                </div>
                
                <div className="case-details">
                  <div className="detail-item">
                    <h4>The Concept</h4>
                    <p>A multi-part styling series blending traditional elements with contemporary streetwear.</p>
                  </div>
                </div>

                <div className="case-results">
                  <div className="result-stat">
                    <strong>210K+</strong>
                    <span>Reach</span>
                  </div>
                  <div className="result-stat">
                    <strong>5.2%</strong>
                    <span>Engagement</span>
                  </div>
                </div>
                
                <button className="view-case-btn">Full Case Study <ArrowRight size={16} /></button>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Collaborations;
