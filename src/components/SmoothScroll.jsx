import React from 'react';
import { ReactLenis } from 'lenis/react';

const SmoothScroll = ({ children }) => {
  return (
    <ReactLenis root options={{
      lerp: 0.08, // Frame-rate independent linear interpolation
      smoothWheel: true,
      wheelMultiplier: 1,
      direction: 'vertical',
      gestureDirection: 'vertical',
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    }}>
      {children}
    </ReactLenis>
  );
};

export default SmoothScroll;
