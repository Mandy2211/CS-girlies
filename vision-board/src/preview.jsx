import React, { useRef } from 'react';
import './preview.css';

const PreviewScreen = () => {
  const audioRef = useRef(null);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="preview-wrapper">
      <h1><span role="img" aria-label="video">🎥</span> Your Preview</h1>

      <div className="preview-box" onClick={handlePlay}>
        <div className="play-button">&#9658;</div>
      </div>

      <audio ref={audioRef} controls className="narration-audio">
        <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="button-row">
        <button>Regenerate</button>
        <button>Download</button>
        <button>Go back</button>
      </div>
    </div>
  );
};

export default PreviewScreen;
