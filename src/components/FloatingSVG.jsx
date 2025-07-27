import React from 'react';

const FloatingSVG = ({ style }) => (
  <svg
    style={{ ...style, position: 'absolute', zIndex: 0, opacity: 0.18, animation: 'floatShape 8s infinite alternate' }}
    width="80"
    height="80"
    viewBox="0 0 80 80"
    fill="none"
  >
    <circle cx="40" cy="40" r="36" fill="#b6e2d3" />
    <ellipse cx="40" cy="40" rx="24" ry="12" fill="#f7c6e0" />
    <circle cx="40" cy="40" r="8" fill="#ffb6a3" />
  </svg>
);

export default FloatingSVG;