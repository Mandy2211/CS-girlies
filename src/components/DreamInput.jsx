import React, { useState } from 'react';

const DreamInput = ({ onSend }) => {
  const [text, setText] = useState('');
  return (
    <div style={{ marginBottom: '24px' }}>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Write your dream or story here..."
        style={{
          width: '100%',
          minHeight: '80px',
          borderRadius: '12px',
          border: '1px solid #a7bfff',
          padding: '12px',
          fontSize: '1rem',
          background: '#fff',
          boxShadow: '0 2px 8px #ffd6b0'
        }}
      />
      <button
        onClick={() => { onSend(text); setText(''); }}
        style={{
          marginTop: '8px',
          padding: '8px 24px',
          borderRadius: '18px',
          background: 'linear-gradient(90deg, #ffb6a3, #ffd6b0)',
          color: '#222',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 2px 8px #b6e2d3'
        }}
      >
        Send
      </button>
    </div>
  );
};

export default DreamInput;