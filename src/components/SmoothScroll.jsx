import React from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

// Tuned for consistent feel across 60hz, 120hz, low-end and high-end devices.
// lerp: 0.1 is the Lenis recommended default.
// Higher lerp = fewer frames to settle = prevents the "shoots fast in the middle" effect.
const LENIS_OPTIONS = {
  lerp: 0.1,
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
  syncTouch: false,
  infinite: false,
};

const LenisExposer = () => {
  // Expose lenis instance globally so any component can call lenis.scrollTo()
  useLenis((lenis) => {
    window.__lenis = lenis;
  });
  return null;
};

const SmoothScroll = ({ children }) => {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <LenisExposer />
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
