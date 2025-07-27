import React from 'react';
import './loading.css';

const LoadingScreen = () => {
  return (
    <div className="loading-screen">
      <div className="container">
        <h1>Dreams are loading…</h1>
        <p>Stirring up some magic for your story ✨</p>
        <div className="dot-loader">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
