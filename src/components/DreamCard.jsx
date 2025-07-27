import React from 'react';

const DreamCard = ({ title, description, icon }) => (
  <div className="dream-card">
    <div className="dream-card-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

export default DreamCard;