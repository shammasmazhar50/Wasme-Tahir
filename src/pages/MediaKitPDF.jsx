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
    // Set body background to avoid dark mode issues in PDF
    document.body.style.backgroundColor = '#f4f4f4';
    
    const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    
    Promise.all([
      fetch(`${API}/api/stats`).then(res => res.json()),
      fetch(`${API}/api/collab/demographics`).then(res => res.json()),
      fetch(`${API}/api/collab/brands`).then(res => res.json())
    ]).then(([statsData, demoData, brandsData]) => {
      setStats(statsData);
      setDemographics(demoData);
      setBrands(brandsData);
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
          filename:     'Wasme_Tahir_Media_Kit.pdf',
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true },
          jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save().then(() => {
          setTimeout(() => {
            window.close();
          }, 500);
        });
      }, 800); // slight delay for images/fonts to render
    }
  }, [dataLoaded]);

  if (!dataLoaded) {
    return <div className="pdf-loading">Generating your live Media Kit PDF... Please wait.</div>;
  }

  return (
    <div className="pdf-container">
      <div className="pdf-page" ref={pdfRef}>
        <div className="pdf-header">
           <div 
             className="pdf-hero-bg" 
             style={{ backgroundImage: 'url(/images/IMG_8380.webp)' }}
           ></div>
           <div className="pdf-header-text">
             <h2>MEDIA KIT 2026</h2>
             <h1>Wasme Tahir</h1>
             <p>Digital Creator bridging the gap between high fashion, lifestyle, and cultural authenticity.</p>
           </div>
        </div>

        <div className="pdf-section">
          <div className="pdf-stats-grid">
            <div className="pdf-stat-box dark">
              <span className="pdf-subheading">TOTAL REACH</span>
              <h2>155K+</h2>
              <p>Across all platforms</p>
            </div>
            {Array.isArray(stats) && stats.slice(0, 3).map((s) => (
               <div key={s.id} className="pdf-stat-box">
                 <span className="pdf-subheading">{s.platform.toUpperCase()}</span>
                 <h2>{s.value}</h2>
                 <p>{s.label}</p>
               </div>
            ))}
          </div>
        </div>

        <div className="pdf-section">
          <h3 className="pdf-section-title">Audience Demographics</h3>
          <div className="pdf-audience-grid">
            {Array.isArray(demographics) && demographics.map((d) => (
              <div key={d.id} className="pdf-audience-card">
                <h4>{d.category}</h4>
                <p style={{whiteSpace: 'pre-line'}}>{d.data}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="pdf-section">
          <h3 className="pdf-section-title">Selected Partnerships</h3>
          <div className="pdf-logos">
            {Array.isArray(brands) && brands.map(b => (
              <span key={b.id}>{b.name}</span>
            ))}
          </div>
        </div>

        <div className="pdf-footer">
          <p>wasmetahir.com | Contact for rates, availability, and custom campaign proposals.</p>
        </div>
      </div>
    </div>
  );
};

export default MediaKitPDF;
