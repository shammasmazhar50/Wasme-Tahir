import React from 'react';
import { motion } from 'framer-motion';
import { Download, ArrowRight } from 'lucide-react';
import './Press.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
};

const Press = () => {
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
          <motion.p className="subheading text-center" {...fadeUp}>Featured In</motion.p>
          <motion.div className="press-logos" {...fadeUp} transition={{ delay: 0.2 }}>
            <span>VOGUE</span>
            <span>GQ</span>
            <span>ALLURE</span>
            <span>HARPER'S BAZAAR</span>
          </motion.div>
        </section>

        <section className="press-articles">

          <motion.div className="article-row" {...fadeUp}>
            <div className="article-img">
              <img src="/images/IMG_1383.webp" alt="Press Feature" style={{ objectPosition: '50% 20%' }} />
            </div>
            <div className="article-content">
              <span className="subheading">VOGUE DIGITAL</span>
              <h3 className="heading-md">How Wasme Tahir is redefining the modern creator economy.</h3>
              <a href="#" className="read-more">Read Feature <ArrowRight size={16} /></a>
            </div>
          </motion.div>

          <motion.div className="article-row" {...fadeUp}>
            <div className="article-img">
              <img src="/images/IMG_4981.webp" alt="Press Feature" />
            </div>
            <div className="article-content">
              <span className="subheading">ALLURE</span>
              <h3 className="heading-md">The Pakistani-American influencer blending tradition with New York street style.</h3>
              <a href="#" className="read-more">Read Feature <ArrowRight size={16} /></a>
            </div>
          </motion.div>

        </section>

        <section className="press-downloads">
          <motion.h3 className="heading-md text-center" {...fadeUp}>Press Assets</motion.h3>

          <div className="download-grid">
            <motion.a href="#" className="download-card" {...fadeUp}>
              <Download size={24} />
              <h4>Download Media Kit</h4>
              <p>PDF, 2.4MB</p>
            </motion.a>

            <motion.a href="#" className="download-card" {...fadeUp} transition={{ delay: 0.1 }}>
              <Download size={24} />
              <h4>High-Resolution Images</h4>
              <p>ZIP, 145MB</p>
            </motion.a>

            <motion.a href="#" className="download-card" {...fadeUp} transition={{ delay: 0.2 }}>
              <Download size={24} />
              <h4>Download Bio</h4>
              <p>PDF, 120KB</p>
            </motion.a>

            <motion.a href="#" className="download-card" {...fadeUp} transition={{ delay: 0.3 }}>
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
