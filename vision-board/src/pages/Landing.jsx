import { useState } from 'react';
import { Navigate } from 'react-router-dom'; // Added import
import { useAuth } from '../Context/AuthContext';
import AuthModal from '../components/AuthModal'; // Added import

const Landing = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col items-center justify-center">
      <div className="text-center p-8 bg-white/90 backdrop-blur-lg rounded-3xl shadow-xl max-w-2xl">
        <h1 className="text-5xl font-bold text-indigo-700 mb-6">DreamCanvas</h1>
        <p className="text-xl text-gray-600 mb-10">
          Bring your dreams to life with AI-powered stories and animations
        </p>
        
        <div className="space-y-4">
          <button
            onClick={() => setShowModal('login')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Dreaming
          </button>
          
          <p className="text-gray-500 mt-8">
            Already have an account?{' '}
            <button
              onClick={() => setShowModal('login')}
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>

      {showModal && (
        <AuthModal mode={showModal} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Landing;