import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import LoadingSpinner from './LoadingSpin';

const SignupForm = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Password validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            company: 'AEC Industry'
          }
        }
      });
      
      if (error) {
        setMessage(error.message);
      } else {
        setMessage('Account created! Please check your email to verify your account.');
      }
    } catch (err) {
      setMessage('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
        <p className="text-gray-600 mt-2">Visualise Your thoughts</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            type="email"
            placeholder="your.email@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            type="password"
            placeholder="Create a secure password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <button 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              <span className="ml-2">Creating Account...</span>
            </>
          ) : (
            'Create Account'
          )}
        </button>

        {message && (
          <div className={`text-center p-3 rounded-lg text-sm ${
            message.includes('created') || message.includes('check your email')
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            {message}
          </div>
        )}
      </form>

      <div className="text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <button
            onClick={onSwitch}
            className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;