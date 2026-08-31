import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-100px" }
};

const About = () => {
  return (
    <motion.div 
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container">
        
        {/* HERO SECTION */}
        <section className="about-hero">
          <motion.h1 
            className="heading-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Meet Wasme
          </motion.h1>
          
          <motion.div 
            className="about-main-portrait"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
          >
            <img src="/images/75D4C60D-DA06-47C7-870F-3FF20936254B.jpg" alt="Wasme Tahir portrait" />
          </motion.div>
        </section>

        {/* EDITORIAL CONTENT */}
        <section className="about-editorial">
          <div className="editorial-grid">
            
            {/* Left Column: Text */}
            <div className="editorial-text">
              <motion.div className="editorial-block" {...fadeUp}>
                <h3 className="subheading">Where I come from</h3>
                <h2 className="heading-md">Rooted in dual cultures.</h2>
                <p className="body-lg">
                  Navigating the world as a Pakistani-American has profoundly shaped the lens through which I see life, style, and storytelling. My heritage isn't just a backdrop; it's the foundation of my identity, heavily influencing my personal aesthetic and the narratives I choose to amplify.
                </p>
              </motion.div>

              <motion.div className="editorial-block" {...fadeUp}>
                <h3 className="subheading">What I create</h3>
                <h2 className="heading-md">Content that connects.</h2>
                <p className="body-lg">
                  I believe in the power of authenticity. From highly stylized fashion editorials to candid family moments that resonate universally, my work is a tapestry of my daily life. I strive to create spaces where high fashion meets accessibility, and where cultural nuance is celebrated without explanation.
                </p>
              </motion.div>

              <motion.div className="editorial-block" {...fadeUp}>
                <h3 className="subheading">What inspires me</h3>
                <h2 className="heading-md">The intersection of tradition and modernity.</h2>
                <p className="body-lg">
                  I find endless inspiration in the juxtaposition of my mother's vintage heirlooms against contemporary New York street style. Inspiration is everywhere—in the textures of traditional fabrics, the rhythm of a bustling city, and the quiet, humorous moments shared with family.
                </p>
              </motion.div>
              
              <motion.div className="editorial-block" {...fadeUp}>
                <h3 className="subheading">Why culture matters</h3>
                <h2 className="heading-md">It is the language we speak.</h2>
                <p className="body-lg">
                  Culture is the heartbeat of connection. In a digital space often curated to perfection, embracing cultural realities provides grounding and genuine connection with a global community that sees their own stories reflected in mine.
                </p>
              </motion.div>
              
              <motion.div className="editorial-block" {...fadeUp}>
                <h3 className="subheading">What I believe about influence</h3>
                <h2 className="heading-md">Influence is responsibility.</h2>
                <p className="body-lg">
                  True influence isn't about metrics; it's about the trust earned and the community built. It's about using this platform to tell meaningful stories, foster empathy, and present a multifaceted view of what it means to be a modern creator.
                </p>
              </motion.div>
            </div>

            {/* Right Column: Gallery */}
            <div className="editorial-gallery">
              <motion.div className="gallery-img" {...fadeUp}>
                <img src="/images/62DBBB6D-00CF-4025-B66D-CD0A0F948E77.jpg" alt="Gallery image 1" />
              </motion.div>
              
              <motion.div className="gallery-img gallery-img-offset" {...fadeUp}>
                <img src="/images/5D2BE0DA-759F-468C-B889-C5367998DB6E.jpg" alt="Gallery image 2" />
              </motion.div>
              
              <motion.div className="gallery-img" {...fadeUp}>
                <img src="/images/58C224F3-6E3A-41C4-871B-60A52F068701.jpg" alt="Gallery image 3" />
              </motion.div>
            </div>
            
          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default About;
