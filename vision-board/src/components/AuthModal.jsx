import { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import { useAuth } from '../Context/AuthContext';

const AuthModal = ({ mode = 'login', onClose, onSuccess }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [isAnimating, setIsAnimating] = useState(false);
  const { user } = useAuth();

  // Handle successful authentication
  useEffect(() => {
    if (user && onSuccess) {
      // Add a small delay for better UX
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  }, [user, onSuccess]);

  const handleModeSwitch = (newMode) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentMode(newMode);
      setIsAnimating(false);
    }, 150);
  };

  // Prevent closing modal without authentication
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && user) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Content */}
        <div className="p-6">
          {user ? (
            <div className="text-center py-8">
              <div className="animate-bounce text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Welcome!</h3>
              <p className="text-gray-600 mt-2">Authentication successful. Loading your dashboard...</p>
            </div>
          ) : (
            <>
              {currentMode === 'login' ? (
                <LoginForm onSwitch={() => handleModeSwitch('signup')} />
              ) : (
                <SignupForm onSwitch={() => handleModeSwitch('login')} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;