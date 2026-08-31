import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import './Home.css';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
};

const Home = () => {
  const { scrollY } = useScroll();
  const heroBgY = useTransform(scrollY, [0, 1000], ['0%', '30%']);

  return (
    <motion.div 
      className="home-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 01 - HERO */}
      <section className="hero-section">
        {/* Placeholder for video */}
        <motion.div 
          className="hero-bg" 
          style={{ 
            backgroundImage: 'url(/images/24230D23-EA10-4D64-B521-27B9642A07BA.jpg)',
            y: heroBgY 
          }}
        >
          <div className="hero-overlay"></div>
        </motion.div>
        
        <div className="hero-content">
          <motion.h1 
            className="heading-xl hero-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            WASME TAHIR
          </motion.h1>
          <motion.p 
            className="subheading hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Digital Creator · Fashion · Lifestyle · Culture
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <span>Explore My Work</span>
            <ArrowDown size={20} className="bounce" />
          </motion.div>
        </div>
      </section>

      {/* 02 - THE INTRODUCTION */}
      <section className="intro-section container">
        <div className="intro-grid">
          <motion.div 
            className="intro-image"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <img src="/images/75D4C60D-DA06-47C7-870F-3FF20936254B.jpg" alt="Wasme Tahir Portrait" />
          </motion.div>
          
          <div className="intro-text-content">
            <motion.h2 
              className="heading-lg intro-heading"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              More than content.<br/>A point of view.
            </motion.h2>
            
            <motion.div 
              className="intro-body"
              variants={fadeUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <p>Wasme Tahir is a Pakistani-American digital creator whose content sits at the intersection of fashion, lifestyle, family and culture.</p>
              <p>From fashion and beauty to the everyday moments that make life relatable, Wasme creates content that feels personal, expressive and distinctly her own.</p>
            </motion.div>
            
            <motion.div 
              className="category-tags"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {['Fashion', 'Lifestyle', 'Culture', 'Family', 'Beauty', 'Travel'].map(cat => (
                <motion.span key={cat} className="cat-tag" variants={fadeUp}>{cat}</motion.span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 03 - SOCIAL REACH */}
      <section className="stats-section">
        <div className="container">
          <motion.div 
            className="stats-header"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <h3 className="subheading">A community that follows the story</h3>
          </motion.div>
          
          <motion.div 
            className="stats-grid"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { num: '139K+', label: 'Instagram' },
              { num: '119K+', label: 'TikTok' },
              { num: 'X.XM+', label: 'Total video views' },
              { num: 'X.X%', label: 'Engagement' },
              { num: 'X.XM+', label: 'Highest-performing content' },
              { num: 'XX+', label: 'Brand collaborations' }
            ].map((stat, i) => (
              <motion.div key={i} className="stat-item" variants={fadeUp}>
                <h4 className="stat-num">{stat.num}</h4>
                <span className="stat-label">{stat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 04 - CONTENT WORLD */}
      <section className="content-world container">
        <motion.h2 
          className="section-title text-center heading-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          What I Create
        </motion.h2>
        
        <div className="world-grid">
          {/* Fashion */}
          <motion.div className="world-card large-card" whileHover="hover" initial="initial" whileInView="animate" variants={fadeUp} viewport={{ once: true }}>
            <div className="card-img" style={{ backgroundImage: 'url(/images/62DBBB6D-00CF-4025-B66D-CD0A0F948E77.jpg)' }}></div>
            <div className="card-content">
              <h3>FASHION</h3>
              <p>Style, GRWM, Pakistani fashion, contemporary looks and personal expression.</p>
              <span className="explore-link">Explore Fashion <ArrowRight size={16} /></span>
            </div>
          </motion.div>
          
          {/* Lifestyle */}
          <motion.div className="world-card" whileHover="hover" initial="initial" whileInView="animate" variants={fadeUp} viewport={{ once: true }}>
            <div className="card-img" style={{ backgroundImage: 'url(/images/5D2BE0DA-759F-468C-B889-C5367998DB6E.jpg)' }}></div>
            <div className="card-content">
              <h3>LIFESTYLE</h3>
              <p>The places, experiences and everyday moments that make up life beyond the feed.</p>
            </div>
          </motion.div>
          
          {/* Family & Culture */}
          <motion.div className="world-card" whileHover="hover" initial="initial" whileInView="animate" variants={fadeUp} viewport={{ once: true }}>
            <div className="card-img" style={{ backgroundImage: 'url(/images/58C224F3-6E3A-41C4-871B-60A52F068701.jpg)' }}></div>
            <div className="card-content">
              <h3>FAMILY & CULTURE</h3>
              <p>Family, relationships, Pakistani-American culture and the moments that people recognize.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 05 - SIGNATURE CONTENT */}
      <section className="signature-section">
        <div className="container">
          <motion.div 
            className="signature-header"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-md">The World of Wasme</h2>
            <p className="body-lg">Recurring series & personal touchpoints.</p>
          </motion.div>
          
          <div className="signature-list">
            {['GRWM', 'MIL STORIES', 'MARRIED LIFE', 'DESI LIFE', 'EVERYDAY WASME'].map((item, i) => (
              <motion.div 
                key={i} 
                className="sig-item"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 06 - FEATURED WORK */}
      <section className="featured-section container">
        <motion.h2 
          className="section-title text-center heading-md"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Selected Work
        </motion.h2>
        
        <div className="campaign-cards">
          <motion.div 
            className="campaign-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="campaign-img" style={{ backgroundImage: 'url(/images/7E924B31-AAB3-41E3-B6B0-24E65BFABF81.png)' }}></div>
            <div className="campaign-info">
              <h4 className="subheading">SENDWAVE</h4>
              <h3 className="heading-md">Connecting people across borders</h3>
              <p className="campaign-desc">Campaign content created around everyday communication, family and connection.</p>
              <div className="campaign-stats">
                <span><strong>185K+</strong> Views</span>
                <span><strong>3.1K+</strong> Likes</span>
                <span><strong>97</strong> Comments</span>
              </div>
              <button className="campaign-link">View Campaign <ArrowRight size={16} /></button>
            </div>
          </motion.div>
        </div>
      </section>

    </motion.div>
  );
};

export default Home;
