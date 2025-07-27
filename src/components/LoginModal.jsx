import React from 'react';

const LoginModal = ({ open, onClose }) => {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Login to DreamCanvas</h2>
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button>Login</button>
        <button onClick={onClose} style={{ background: 'transparent', color: '#3a4ca8' }}>Close</button>
      </div>
    </div>
  );
};

export default LoginModal;