import React, { useRef } from 'react';
import './preview.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateStory } from './services/aiIntegrationService';

const PreviewScreen = () => {
  const audioRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const output = location.state?.output;

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const handleGoBack = () => {
    window.location.href = 'http://localhost:3000/';
  };

  const handleRegenerate = async () => {
    if (!output || !output.story) return;
    navigate('/loading');
    try {
      const res = await generateStory({ input: output.story, mode: output.mode || 'dream', tts: !!output.audioUrl });
      navigate('/preview', { state: { output: res.data || res } });
    } catch (e) {
      alert('Failed to regenerate: ' + e.message);
      navigate('/preview', { state: { output } });
    }
  };

  const handleDownload = () => {
    if (output?.animationUrl) {
      // Download video
      const link = document.createElement('a');
      link.href = output.animationUrl;
      link.download = 'animation.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (output?.story) {
      // Download story as txt
      const blob = new Blob([output.story], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'story.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="preview-wrapper">
      <h1><span role="img" aria-label="video">🎥</span> Your Preview</h1>
      {output ? (
        <div>
          {output.story && <div className="preview-story">{output.story}</div>}
          {output.audioUrl && (
            <audio ref={audioRef} controls className="narration-audio">
              <source src={output.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}
          {output.animationUrl && (
            <div>
              <div>Remote Video Preview:</div>
              <video src={output.animationUrl} controls className="w-full max-h-64" />
            </div>
          )}
          {output.localVideoPath && (
            <div>
              <div>Local Video Preview:</div>
              <video src={output.localVideoPath} controls className="w-full max-h-64" />
            </div>
          )}
        </div>
      ) : (
        <div>No preview data available.</div>
      )}
      <div className="button-row">
        <button onClick={handleRegenerate}>Regenerate</button>
        <button onClick={handleDownload}>Download</button>
        <button onClick={handleGoBack}>Go back</button>
      </div>
    </div>
  );
};

export default PreviewScreen;
