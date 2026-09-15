import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './MediaKitPDF.css';

const MediaKitPDF = () => {
  const [stats, setStats] = useState([]);
  const [demographics, setDemographics] = useState([]);
  const [brands, setBrands] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const pdfRef = useRef(null);

  useEffect(() => {
    // Set body background to a neutral color for generation
    document.body.style.backgroundColor = '#f9f9f6'; // Warm ivory
    
    const API = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:6002' : 'https://api.wasmetahir.com');
    
    Promise.all([
      fetch(`${API}/api/stats`).then(res => res.json()),
      fetch(`${API}/api/collab/demographics`).then(res => res.json()),
      fetch(`${API}/api/collab/brands`).then(res => res.json())
    ]).then(([statsData, demoData, brandsData]) => {
      setStats(Array.isArray(statsData) ? statsData : (statsData?.data || []));
      setDemographics(Array.isArray(demoData) ? demoData : (demoData?.data || []));
      setBrands(Array.isArray(brandsData) ? brandsData : (brandsData?.data || []));
      setDataLoaded(true);
    }).catch(err => {
      console.error(err);
      setDataLoaded(true);
    });

    return () => {
      document.body.style.backgroundColor = '';
    }
  }, []);

  useEffect(() => {
    if (dataLoaded && pdfRef.current) {
      setTimeout(() => {
        const element = pdfRef.current;
        const opt = {
          margin:       0,
          filename:     'Wasme_Tahir_Media_Kit_2026.pdf',
          image:        { type: 'jpeg', quality: 1 },
          html2canvas:  { 
            scale: 2, 
            useCORS: true, 
            logging: false,
            windowWidth: 816,
            width: 816,
            height: 1056,
            scrollY: 0
          },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
          setTimeout(() => {
            // Uncomment to auto-close after generation
            window.close();
          }, 1000);
        });
      }, 1000); // Wait for fonts and images
    }
  }, [dataLoaded]);

  if (!dataLoaded) {
    return <div className="pdf-loading">TYPESETTING MEDIA KIT...</div>;
  }

  return (
    <div className="pdf-container">
      <div className="pdf-page" ref={pdfRef}>
        
        {/* HERO SECTION - FULL BLEED */}
        <div className="pdf-hero">
           <div 
             className="pdf-hero-img" 
             style={{ backgroundImage: 'url(/opt-img/IMG_8380.webp)' }}
           ></div>
           <div className="pdf-hero-overlay"></div>
           <div className="pdf-hero-content">
             <div className="pdf-meta-top">
               <span>MEDIA KIT 2026</span>
               <span>NEW YORK</span>
             </div>
             <h1 className="pdf-title">WASME<br/>TAHIR</h1>
             <p className="pdf-subtitle">
               Digital Creator bridging the gap between high fashion, lifestyle, and cultural authenticity.
             </p>
           </div>
        </div>

        {/* EDITORIAL GRID SYSTEM */}
        <div className="pdf-body">
          
          {/* STATS ROW */}
          <div className="pdf-grid-row border-bottom">
            <div className="pdf-grid-col border-right stat-primary">
              <span className="pdf-label">TOTAL REACH</span>
              <h2>155K+</h2>
            </div>
            
            {Array.isArray(stats) && stats.slice(0, 3).map((s, idx) => (
               <div key={s.id} className={`pdf-grid-col stat-secondary ${idx < 2 ? 'border-right' : ''}`}>
                 <span className="pdf-label">{(s.platform || s.label || '').toUpperCase()}</span>
                 <h3>{s.value}</h3>
               </div>
            ))}
          </div>

          {/* SPLIT SECTION: AUDIENCE & BRAND */}
          <div className="pdf-grid-row split-section">
            
            {/* LEFT: DEMOGRAPHICS */}
            <div className="pdf-split-left border-right">
              <h4 className="pdf-section-head">AUDIENCE INSIGHTS</h4>
              <div className="pdf-demo-list">
                {Array.isArray(demographics) && demographics.map((d) => (
                  <div key={d.id} className="pdf-demo-item">
                    <span className="pdf-demo-label">{d.category}</span>
                    <span className="pdf-demo-val">{d.data.replace(/\n/g, ' • ')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: PARTNERSHIPS */}
            <div className="pdf-split-right">
              <h4 className="pdf-section-head">SELECTED PARTNERSHIPS</h4>
              <div className="pdf-brand-grid">
                {Array.isArray(brands) && brands.slice(0, 16).map(b => (
                  <div key={b.id} className="pdf-brand-item">{b.name}</div>
                ))}
              </div>
            </div>

          </div>
          
        </div>

        {/* FOOTER */}
        <div className="pdf-footer border-top">
          <div className="pdf-footer-left">WASMETAHIR.COM</div>
          <div className="pdf-footer-right">CONTACT FOR RATES & PROPOSALS</div>
        </div>

      </div>
    </div>
  );
};

export default MediaKitPDF;
