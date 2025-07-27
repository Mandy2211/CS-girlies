import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import LoadingSpinner from './LoadingSpin';

const LoginForm = ({ onSwitch, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Login successful! Redirecting...');
        if (onSuccess) onSuccess();
      }
    } catch {
      setMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }

          .dream-input {
            background: rgba(255, 255, 255, 0.9);
            border: 2px solid rgba(182, 226, 211, 0.3);
            transition: all 0.3s ease;
          }

          .dream-input:focus {
            outline: none;
            border-color: #b6e2d3;
            box-shadow: 0 0 20px rgba(182, 226, 211, 0.4);
            background: rgba(255, 255, 255, 1);
          }

          .dream-button {
            background: linear-gradient(90deg, #ffb6a3, #ffd6b0, #b6e2d3, #ffb6a3);
            background-size: 400% 100%;
            animation: shimmer 3s ease-in-out infinite;
          }
        `}
      </style>

      <div style={{ 
        padding: '32px',
        background: 'linear-gradient(135deg, #fff6b7 0%, #f7c6e0 100%)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(182, 226, 211, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(20px)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '2.2rem',
            fontFamily: 'Pacifico, cursive',
            color: '#3a4ca8',
            marginBottom: '8px',
            textShadow: '0 2px 8px rgba(182, 226, 211, 0.3)'
          }}>
            Welcome Back! ✨
          </h2>
          <p style={{
            color: '#1e3576',
            fontSize: '1.1rem',
            opacity: 0.8
          }}>
            Continue your magical journey
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#3a4ca8',
              marginBottom: '8px'
            }}>
              ✉️ Email Address
            </label>
            <input
              className="dream-input"
              type="email"
              placeholder="Enter your magical email..."
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '20px',
                fontSize: '1rem',
                color: '#1e3576'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '1rem',
              fontWeight: '600',
              color: '#3a4ca8',
              marginBottom: '8px'
            }}>
              🔐 Password
            </label>
            <input
              className="dream-input"
              type="password"
              placeholder="Enter your secret key..."
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '20px',
                fontSize: '1rem',
                color: '#1e3576'
              }}
            />
          </div>

          <button 
            className="dream-button"
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              border: 'none',
              borderRadius: '25px',
              fontSize: '1.1rem',
              fontWeight: '700',
              color: '#222',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 24px rgba(182, 226, 211, 0.4)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 32px rgba(182, 226, 211, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 24px rgba(182, 226, 211, 0.4)';
              }
            }}
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Entering dreamland...</span>
              </>
            ) : (
              '🌟 Enter DreamCanvas'
            )}
          </button>

          {message && (
            <div style={{
              textAlign: 'center',
              padding: '16px',
              borderRadius: '16px',
              fontSize: '0.95rem',
              fontWeight: '500',
              background: message.includes('successful') || message.includes('Redirecting')
                ? 'linear-gradient(135deg, #b6e2d3 0%, #a7ffeb 100%)'
                : 'linear-gradient(135deg, #ffb6a3 0%, #ff8a80 100%)',
              color: message.includes('successful') || message.includes('Redirecting')
                ? '#1e3576'
                : '#8b0000',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              boxShadow: '0 4px 16px rgba(182, 226, 211, 0.2)'
            }}>
              {message}
            </div>
          )}
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <p style={{ color: '#1e3576', fontSize: '1rem' }}>
            New to DreamCanvas?{' '}
            <button
              onClick={onSwitch}
              disabled={isLoading}
              style={{
                color: '#3a4ca8',
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                fontWeight: '600',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                opacity: isLoading ? 0.5 : 1
              }}
            >
              Create Your Account ✨
            </button>
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginForm;
