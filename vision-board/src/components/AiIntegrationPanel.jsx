import React, { useState } from 'react';
import { generateStory, drawingToAnimation } from '../services/aiIntegrationService';

export default function AiIntegrationPanel() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState('dream');
  const [tts, setTts] = useState(false);
  const [story, setStory] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [drawing, setDrawing] = useState(null);
  const [animationUrl, setAnimationUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStory = async () => {
    setLoading(true); setError(''); setStory(''); setAudioUrl('');
    try {
      const res = await generateStory({ input, mode, tts });
      setStory(res.data?.story || '');
      setAudioUrl(res.data?.audioUrl || '');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrawing = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDrawing(file); setLoading(true); setError(''); setAnimationUrl('');
    try {
      const res = await drawingToAnimation(file);
      setAnimationUrl(res.animationUrl);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-6">
      <h2 className="text-2xl font-bold mb-2">AI Story & Animation Generator</h2>
      <div className="space-y-2">
        <textarea
          className="w-full border rounded p-2"
          rows={3}
          placeholder="Enter your dream, journal, or to-do..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <select value={mode} onChange={e => setMode(e.target.value)} className="border rounded p-1">
            <option value="dream">Dream</option>
            <option value="journal">Journal</option>
            <option value="todo">To-Do</option>
            <option value="suggestion">Suggestion</option>
          </select>
          <label className="flex items-center space-x-1">
            <input type="checkbox" checked={tts} onChange={e => setTts(e.target.checked)} />
            <span>Narrator TTS</span>
          </label>
          <button
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
            onClick={handleStory}
            disabled={loading || !input}
          >Generate Story</button>
        </div>
      </div>
      {story && (
        <div className="bg-gray-50 p-3 rounded border">
          <div className="font-semibold mb-1">Generated Story:</div>
          <div className="whitespace-pre-line mb-2">{story}</div>
          {audioUrl && (
            <audio controls src={audioUrl} className="w-full" />
          )}
        </div>
      )}
      <div className="space-y-2">
        <label className="block font-semibold">Upload Drawing for Animation:</label>
        <input type="file" accept="image/*" onChange={handleDrawing} disabled={loading} />
      </div>
      {animationUrl && (
        <div className="bg-gray-50 p-3 rounded border">
          <div className="font-semibold mb-1">Generated Animation:</div>
          <video src={animationUrl} controls className="w-full max-h-64" />
        </div>
      )}
      {loading && <div className="text-blue-600">Processing...</div>}
      {error && <div className="text-red-600">{error}</div>}
    </div>
  );
} 