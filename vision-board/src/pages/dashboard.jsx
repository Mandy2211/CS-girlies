import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../Context/AuthContext';
import UploadSection from '../components/UploadSection';
import ProjectGallery from '../components/ProjectGallery';
import LoadingSpinner from '../components/LoadingSpin';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showUploadSection, setShowUploadSection] = useState(false);

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    };
    input.click();
  };

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
    };
    input.click();
  };

  const handleProcessingStart = () => {
    setProcessingStatus('Processing your dream...');
    setIsLoading(true);
  };

  const handleProcessingComplete = (result) => {
    setProcessingStatus('Dream processed successfully!');
    setIsLoading(false);
    // Refresh the gallery to show the new project
    setTimeout(() => {
      setProcessingStatus('');
      setShowUploadSection(false);
    }, 2000);
  };

  const handleProcessingError = (error) => {
    setProcessingStatus(`Error: ${error}`);
    setIsLoading(false);
    setTimeout(() => {
      setProcessingStatus('');
    }, 3000);
  };

  const handleSignOut = async () => {
    try {
      await apiService.supabase?.auth.signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cyan-100 to-cyan-200 p-4">
      {/* Navigation Header */}
      <header className="max-w-6xl mx-auto py-4">
        <div className="flex justify-between items-center mb-8">
          {/* Navigation Tabs */}
          <div className="flex space-x-4">
            <button
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeTab === 'create' 
                  ? 'bg-pink-200 text-gray-800' 
                  : 'bg-white bg-opacity-60 text-gray-700 hover:bg-opacity-80'
              }`}
              onClick={() => setActiveTab('create')}
            >
              Home
            </button>
            <button
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeTab === 'gallery' 
                  ? 'bg-pink-200 text-gray-800' 
                  : 'bg-white bg-opacity-60 text-gray-700 hover:bg-opacity-80'
              }`}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center my-20">
            <LoadingSpinner />
            <p className="ml-4 text-gray-700 text-xl">Creating magic...</p>
          </div>
        ) : activeTab === 'create' ? (
          <div className="text-center">
            {/* Main Heading */}
            <div className="mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
                Realise your dream
              </h1>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                Create your story
              </h2>
            </div>

            {/* Start Creation Button */}
            {!showUploadSection && (
              <div className="text-center mb-8">
                <button
                  onClick={() => setShowUploadSection(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all duration-300"
                >
                  Start Creating Your Dream
                </button>
              </div>
            )}

            {/* Upload Section */}
            {showUploadSection && (
              <UploadSection
                onProcessingStart={handleProcessingStart}
                onProcessingComplete={handleProcessingComplete}
                onError={handleProcessingError}
              />
            )}

            {/* Processing Status */}
            {processingStatus && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">{processingStatus}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <ProjectGallery />
        )}
      </div>
    </div>
  );
};

export default Dashboard;