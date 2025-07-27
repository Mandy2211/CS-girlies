import React, { useState } from 'react';
import LoginModal from '../components/LoginModal';

const mockUser = {
  name: "Dreamer",
  avatar: "https://ui-avatars.com/api/?name=Dreamer&background=f7c6e0&color=3a4ca8&size=128"
};

const ProfilePage = () => {
  const [signedIn, setSignedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = () => {
    setSignedIn(true);
    setShowLogin(false);
  };

  return (
    <div style={{ position: 'relative', minHeight: '400px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
        {signedIn ? (
          <div style={{ position: 'relative' }}>
            <img
              src={mockUser.avatar}
              alt="Profile"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                boxShadow: '0 2px 12px #b6e2d3',
                cursor: 'pointer',
                border: '3px solid #a7bfff'
              }}
              onClick={() => setShowSidebar(s => !s)}
              title="Open sidebar"
            />
            <span style={{ marginLeft: 16, fontSize: '1.3rem', color: '#3a4ca8', fontFamily: 'Pacifico, cursive' }}>
              {mockUser.name}
            </span>
          </div>
        ) : (
          <button
            style={{
              padding: '12px 28px',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, #ffb6a3, #ffd6b0)',
              color: '#222',
              border: 'none',
              fontWeight: '600',
              boxShadow: '0 2px 12px #b6e2d3',
              cursor: 'pointer'
            }}
            onClick={() => setShowLogin(true)}
          >
            Login
          </button>
        )}
      </div>

      {/* Sidebar */}
      {signedIn && showSidebar && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 120,
            width: 240,
            background: 'linear-gradient(135deg, #fff6b7 0%, #f7c6e0 100%)',
            borderRadius: '0 24px 24px 0',
            boxShadow: '0 4px 24px #b6e2d3',
            padding: '32px 16px',
            zIndex: 10,
            animation: 'fadeIn 0.5s'
          }}
        >
          <h3 style={{ color: '#3a4ca8', fontFamily: 'Pacifico, cursive', marginBottom: 18 }}>Menu</h3>
          <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', color: '#222' }}>
            <li style={{ marginBottom: 16, cursor: 'pointer' }}>📝 Journal</li>
            <li style={{ marginBottom: 16, cursor: 'pointer' }}>🖼️ Gallery</li>
            <li style={{ marginBottom: 16, cursor: 'pointer' }}>✅ To-Do List</li>
            <li style={{ marginBottom: 16, cursor: 'pointer' }}>⚙️ Settings</li>
            <li style={{ marginBottom: 16, cursor: 'pointer', color: '#ffb6a3' }} onClick={() => setSignedIn(false)}>Logout</li>
          </ul>
        </div>
      )}

      {/* Login Modal */}
      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />
      {/* Simulate login for demo */}
      {showLogin && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 }}>
          <button
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              padding: '16px 32px', borderRadius: '24px', background: '#b6e2d3', color: '#222', border: 'none'
            }}
            onClick={handleLogin}
          >
            Demo Login (Click to Sign In)
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;