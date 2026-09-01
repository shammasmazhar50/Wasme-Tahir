import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-100px" }
};

const About = () => {
  const editorialRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: editorialRef,
    offset: ["start end", "end start"]
  });

  // Parallax shifts for subtle depth
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -30]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -10]);

  // Option 1 Swap Logic: Highlight active picture based on scroll
  const z1 = useTransform(scrollYProgress, p => p < 0.35 ? 10 : 1);
  const z2 = useTransform(scrollYProgress, p => p >= 0.35 && p < 0.65 ? 10 : 2);
  const z3 = useTransform(scrollYProgress, p => p >= 0.65 ? 10 : 3);
  
  const scale1 = useTransform(scrollYProgress, [0, 0.35, 0.4, 1], [1.05, 1.05, 1, 1]);
  const scale2 = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 0.7, 1], [1, 1, 1.05, 1.05, 1, 1]);
  const scale3 = useTransform(scrollYProgress, [0, 0.6, 0.65, 1], [1, 1, 1.05, 1.05]);
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.35, 0.4, 1], [1, 1, 0.6, 0.6]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.3, 0.35, 0.65, 0.7, 1], [0.6, 0.6, 1, 1, 0.6, 0.6]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.6, 0.65, 1], [0.6, 0.6, 1, 1]);

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
            <img src="/images/IMG_4542.webp" alt="Wasme Tahir portrait" />
          </motion.div>
        </section>

        {/* EDITORIAL CONTENT */}
        <section className="about-editorial" ref={editorialRef}>
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
              <motion.div 
                className="gallery-img" 
                style={{ y: y1, zIndex: z1, scale: scale1, opacity: opacity1 }}
              >
                <img src="/images/IMG_8144.webp" alt="Gallery image 1" />
              </motion.div>

              <motion.div 
                className="gallery-img" 
                style={{ y: y2, zIndex: z2, scale: scale2, opacity: opacity2 }}
              >
                <img src="/images/IMG_4347.webp" alt="Gallery image 2" />
              </motion.div>

              <motion.div 
                className="gallery-img" 
                style={{ y: y3, zIndex: z3, scale: scale3, opacity: opacity3 }}
              >
                <img src="/images/IMG_0609.webp" alt="Gallery image 3" />
              </motion.div>
            </div>

          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default About;
