import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Context/AuthContext';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/dashboard';
import LoadingSpinner from './components/LoadingSpin';
import './App.css';

// Main App Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Show auth modal immediately if no user is logged in
    if (!loading && !user) {
      setShowAuthModal(true);
    }
  }, [user, loading]);

  // Handle successful authentication
  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  // Handle auth modal close (prevent closing without authentication)
  const handleAuthClose = () => {
    if (!user) {
      // Don't allow closing if not authenticated
      return;
    }
    setShowAuthModal(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-indigo-700 text-xl">Loading AEC Market Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {/* Authentication Modal - Always show if no user */}
        {(!user || showAuthModal) && (
          <AuthModal 
            mode="login" 
            onClose={handleAuthClose}
            onSuccess={handleAuthSuccess}
          />
        )}

        {/* Main Application Routes */}
        <Routes>
          <Route 
            path="/" 
            element={user ? <Navigate to="/dashboard" replace /> : <div />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;