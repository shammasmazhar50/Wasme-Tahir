import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLenis } from 'lenis/react';
import SEO from '../components/SEO';
import './About.css';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  viewport: { once: true, margin: "-100px" }
};

const About = () => {
  const img1Ref = useRef(null);
  const img2Ref = useRef(null);
  const img3Ref = useRef(null);
  const editorialRef = useRef(null);

  // Single Lenis listener — directly sets CSS transforms on refs.
  // This is far cheaper than 12 framer-motion useTransform subscriptions
  // and doesn't conflict with Lenis because it reads Lenis scroll, not native.
  useLenis(({ scroll }) => {
    const el = editorialRef.current;
    if (!el) return;
    // CSS resets transforms on tablet/mobile — skip JS parallax there
    if (window.innerWidth <= 992) return;

    const rect = el.getBoundingClientRect();
    // clientHeight is accurate on mobile rotation; window.innerHeight can lag
    const viewH = el.ownerDocument.documentElement.clientHeight;
    // Progress 0 (el enters viewport from bottom) → 1 (el exits viewport from top)
    const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + rect.height)));

    if (img1Ref.current) {
      img1Ref.current.style.transform = `translateY(${progress * -30}px)`;
      img1Ref.current.style.opacity = progress < 0.4 ? '1' : '0.65';
    }
    if (img2Ref.current) {
      img2Ref.current.style.transform = `translateY(${progress * 20}px)`;
      img2Ref.current.style.opacity = progress >= 0.35 && progress < 0.65 ? '1' : '0.65';
    }
    if (img3Ref.current) {
      img3Ref.current.style.transform = `translateY(${progress * -10}px)`;
      img3Ref.current.style.opacity = progress >= 0.6 ? '1' : '0.65';
    }
  });

  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <SEO 
        title="About | Wasme Tahir" 
        url="https://wasmetahir.com/about" 
      />
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

            {/* Right Column: Gallery — uses refs + useLenis, no framer-motion scroll bindings */}
            <div className="editorial-gallery">
              <div className="gallery-img" ref={img1Ref} style={{ willChange: 'transform, opacity', transition: 'opacity 0.4s ease' }}>
                <img src="/images/IMG_8144.webp" alt="Gallery image 1" loading="lazy" decoding="async" />
              </div>

              <div className="gallery-img" ref={img2Ref} style={{ willChange: 'transform, opacity', transition: 'opacity 0.4s ease' }}>
                <img src="/images/IMG_4347.webp" alt="Gallery image 2" loading="lazy" decoding="async" />
              </div>

              <div className="gallery-img" ref={img3Ref} style={{ willChange: 'transform, opacity', transition: 'opacity 0.4s ease' }}>
                <img src="/images/IMG_0609.webp" alt="Gallery image 3" loading="lazy" decoding="async" />
              </div>
            </div>

          </div>
        </section>

      </div>
    </motion.div>
  );
};

export default About;
