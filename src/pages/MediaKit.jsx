import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Download } from 'lucide-react';
import './MediaKit.css';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
});

const MediaKit = () => {
  const [stats, setStats] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com');
    fetch(`${API}/api/stats`).then(res => res.json()).then(data => setStats(data));
    fetch(`${API}/api/collab/demographics`).then(res => res.json()).then(data => setDemographics(data));
    fetch(`${API}/api/collab/brands`).then(res => res.json()).then(data => setBrands(data));
  }, []);

  return (
    <motion.div 
      className="media-kit-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        <section className="mk-header">
          <div className="mk-header-text">
            <motion.span className="subheading" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>MEDIA KIT 2026</motion.span>
            <motion.h1 className="heading-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              Wasme Tahir
            </motion.h1>
            <motion.p className="body-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              Digital Creator bridging the gap between high fashion, lifestyle, and cultural authenticity.
            </motion.p>
            <motion.button className="download-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              Download PDF Version <Download size={16} />
            </motion.button>
          </div>
          <motion.div className="mk-header-img" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 1 }}>
             <img src="/images/IMG_4244_main.webp" alt="Wasme Tahir" />
          </motion.div>
        </section>

        <section className="mk-stats-grid">
          <motion.div className="mk-stat-box dark" {...fadeUp()}>
            <span className="subheading">TOTAL REACH</span>
            <h2 className="heading-lg">155K+</h2>
            <p>Across all platforms</p>
          </motion.div>
          {stats.slice(0, 2).map((s, i) => (
             <motion.div key={s.id} className="mk-stat-box" {...fadeUp((i+1)*0.1)}>
               <span className="subheading">{s.platform.toUpperCase()}</span>
               <h2 className="heading-md">{s.value}</h2>
               <p>{s.label}</p>
             </motion.div>
          ))}
        </section>

        <section className="mk-audience">
          <motion.h3 className="heading-md" {...fadeUp()}>Audience Demographics</motion.h3>
          <div className="audience-grid">
            {demographics.map((d, i) => (
              <motion.div key={d.id} className="audience-card" {...fadeUp(i*0.1)}>
                <h4>{d.category}</h4>
                {d.category.toLowerCase().includes('age') || d.category.toLowerCase().includes('gender') ? (
                  <div className="demo-bar"><div className="demo-fill" style={{ width: '75%' }}></div></div>
                ) : null}
                <p style={{whiteSpace: 'pre-line'}}>{d.data}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        <section className="mk-partnerships">
          <motion.h3 className="heading-md text-center" {...fadeUp()}>Selected Partnerships</motion.h3>
          <motion.div className="mk-logos" {...fadeUp()}>
            {brands.map(b => (
              <span key={b.id}>{b.name}</span>
            ))}
          </motion.div>
        </section>

        <section className="mk-contact">
          <motion.div className="mk-contact-box" {...fadeUp()}>
            <h3 className="heading-md">Ready to collaborate?</h3>
            <p className="body-lg">For rates, availability, and custom campaign proposals, please reach out directly.</p>
            <a href="/contact" className="mk-contact-btn">Get in Touch <ArrowRight size={16} /></a>
          </motion.div>
        </section>
      </div>
    </motion.div>
  );
};

export default MediaKit;
