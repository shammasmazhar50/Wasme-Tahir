import React from 'react';
import { motion } from 'framer-motion';
import './Editorial.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
});

const Editorial = () => {
  return (
    <motion.div
      className="editorial-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <section className="editorial-header">
          <motion.h1
            className="heading-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Editorial Archive
          </motion.h1>
          <motion.p
            className="body-lg text-center header-desc"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            A visual documentation of style, travel, and life.
          </motion.p>
        </section>

        <section className="gallery-archive">

          <motion.div className="archive-item full-width" {...fadeUp()}>
            <img src="/images/IMG_6904.webp" alt="Editorial" />
            <div className="archive-caption">
              <span className="caption-cat">FASHION</span>
              <p>Summer in the City</p>
              <span className="caption-date">Aug 2026</span>
            </div>
          </motion.div>

          <div className="archive-row two-col">
            <motion.div className="archive-item" {...fadeUp()}>
              <img src="/images/IMG_6535.webp" alt="Editorial" />
              <div className="archive-caption">
                <span className="caption-cat">TRAVEL</span>
                <p>Postcards from Italy</p>
                <span className="caption-date">Jul 2026</span>
              </div>
            </motion.div>
            <motion.div className="archive-item" {...fadeUp(0.2)}>
              <img src="/images/IMG_7665.webp" alt="Editorial" />
              <div className="archive-caption">
                <span className="caption-cat">BEAUTY</span>
                <p>The Minimalist Routine</p>
                <span className="caption-date">Jun 2026</span>
              </div>
            </motion.div>
          </div>

          <motion.div className="archive-item full-width" {...fadeUp()}>
            <img src="/images/IMG_9182.webp" alt="Editorial" />
            <div className="archive-caption">
              <span className="caption-cat">CULTURE</span>
              <p>Eid Celebrations</p>
              <span className="caption-date">Apr 2026</span>
            </div>
          </motion.div>

        </section>
      </div>
    </motion.div>
  );
};

export default Editorial;
