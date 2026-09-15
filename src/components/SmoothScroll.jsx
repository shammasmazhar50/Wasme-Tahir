import React, { useEffect } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';

// Tuned for consistent feel across 60hz, 120hz, low-end and high-end devices.
// lerp: 0.1 is the Lenis recommended default.
// Higher lerp = fewer frames to settle = prevents the "shoots fast in the middle" effect.
const LENIS_OPTIONS = {
  lerp: 0.07, // Smoother deceleration
  smoothWheel: true,
  wheelMultiplier: 0.8, // Tone down raw scroll speed
  normalizeWheel: true, // Prevents trackpad momentum from stacking and becoming too fast
  touchMultiplier: 1.5,
  syncTouch: false,
  infinite: false,
};

// Expose the Lenis instance ONCE on mount, not on every animation frame.
// Calling window.__lenis = lenis inside useLenis runs 60-120x/sec — wasteful.
const LenisExposer = () => {
  const lenis = useLenis(); // no callback → just returns the current lenis instance
  useEffect(() => {
    if (lenis) {
      window.__lenis = lenis;
    }
    return () => {
      window.__lenis = null;
    };
  }, [lenis]);
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
