import React from 'react';
import FloatingSVG from '../components/FloatingSVG';
import DreamCard from '../components/DreamCard';

const HomePage = () => (
  <div style={{ position: 'relative', width: '100%' }}>
    <FloatingSVG style={{ top: '12%', left: '6%' }} />
    <FloatingSVG style={{ bottom: '10%', right: '8%', transform: 'scale(0.8)' }} />
    <h1>DreamCanvas</h1>
    <p>
      Welcome to your magical journaling space.<br />
      Write your dreams, stories, and sketches.<br />
      Let our AI bring them to life with animation and creativity!
    </p>
    <div className="dream-card-grid">
      <DreamCard
        title="AI Dream Animator"
        description="Watch your written dreams come alive with magical animations."
        icon="✨"
      />
      <DreamCard
        title="Creative Journal"
        description="Write, sketch, and save your stories in a beautiful, private space."
        icon="📓"
      />
      <DreamCard
        title="Drawing to Life"
        description="Draw your imagination and let AI animate your art."
        icon="🎨"
      />
      <DreamCard
        title="To-Do List"
        description="Organize your tasks and dreams with a playful to-do list."
        icon="📝"
      />
    </div>
  </div>
);

export default HomePage;