import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Collaborations.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-50px" }
};

const Collaborations = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [caseStudies, setCaseStudies] = useState([]);

  useEffect(() => {
    const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com');
    fetch(`${API}/api/collab/brands`).then(res => res.json()).then(data => setBrands(data));
    fetch(`${API}/api/collab/cases`).then(res => res.json()).then(data => setCaseStudies(data));
  }, []);

  return (
    <motion.div
      className="collab-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SEO 
        title="Collaborations | Wasme Tahir" 
        url="https://wasmetahir.com/collaborations" 
      />
      <div className="container">
        <section className="collab-header">
          <motion.h1 className="heading-lg text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            Brands I've had the pleasure<br />of working with
          </motion.h1>
          <motion.div className="collab-categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
            <span>Fashion</span><span>Beauty</span><span>Lifestyle</span><span>Food & Beverage</span><span>Finance / Services</span><span>Travel</span>
          </motion.div>
        </section>

        <section className="collab-logos">
          <div className="logo-grid">
            {brands.map((b, i) => (
              <motion.div key={b.id} className="logo-item" {...fadeUp} transition={{ delay: (i % 4) * 0.1 }}>
                {b.name}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="case-studies">
          <motion.h2 className="heading-lg text-center case-studies-title" {...fadeUp}>
            Case Studies
          </motion.h2>

          <div className="case-study-list">
            {caseStudies.map((cs, i) => (
              <motion.div key={cs.id} className={`case-study-card ${i % 2 !== 0 ? 'reverse' : ''}`} {...fadeUp}>
                <div className="case-img" style={{ backgroundImage: `url(${cs.coverImage})` }}></div>
                <div className="case-content">
                  <div className="case-meta">
                    <span className="subheading">{cs.brandName}</span>
                    <h3 className="heading-md">{cs.campaignTitle}</h3>
                  </div>

                  <div className="case-details">
                    {cs.theBrief && (
                      <div className="detail-item">
                        <h4>The Brief</h4>
                        <p>{cs.theBrief}</p>
                      </div>
                    )}
                    {cs.theConcept && (
                      <div className="detail-item">
                        <h4>The Concept</h4>
                        <p>{cs.theConcept}</p>
                      </div>
                    )}
                  </div>

                  <div className="case-results">
                    {cs.stat1Value && (
                      <div className="result-stat">
                        <strong>{cs.stat1Value}</strong>
                        <span>{cs.stat1Label}</span>
                      </div>
                    )}
                    {cs.stat2Value && (
                      <div className="result-stat">
                        <strong>{cs.stat2Value}</strong>
                        <span>{cs.stat2Label}</span>
                      </div>
                    )}
                  </div>

                  <button className="view-case-btn" onClick={() => navigate('/contact')} style={{ cursor: 'pointer' }}>Full Case Study <ArrowRight size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Collaborations;
