import React, { useState, useEffect } from 'react'; 
import { useAuth } from '../Context/AuthContext';
import UploadSection from '../components/UploadSection';
import DreamEntry from '../components/DreamEntry';
import DreamList from '../components/DreamList';
import VisionBoard from '../components/VisionBoard';
import DreamDetail from '../components/DreamDetail';
import LoadingSpinner from '../components/LoadingSpin';
import apiService from '../services/apiService';
import AiIntegrationPanel from '../components/AiIntegrationPanel';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [showDreamEntry, setShowDreamEntry] = useState(false);
  const [selectedDream, setSelectedDream] = useState(null);



  const handleProcessingStart = () => {
    setProcessingStatus('Processing your dream...');
    setIsLoading(true);
  };

  const handleProcessingComplete = (result) => {
    setProcessingStatus('Dream processed successfully!');
    setIsLoading(false);
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

  const handleDreamSaved = (dream) => {
    setProcessingStatus('Dream saved successfully!');
    setShowDreamEntry(false);
    setTimeout(() => {
      setProcessingStatus('');
    }, 2000);
  };

  const handleDreamSelect = (dream) => {
    setSelectedDream(dream);
  };

  const handleDreamClose = () => {
    setSelectedDream(null);
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
              Create
            </button>
            <button
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeTab === 'journal' 
                  ? 'bg-pink-200 text-gray-800' 
                  : 'bg-white bg-opacity-60 text-gray-700 hover:bg-opacity-80'
              }`}
              onClick={() => setActiveTab('journal')}
            >
              Journal
            </button>
            <button
              className={`py-2 px-6 rounded-full font-medium transition-colors ${
                activeTab === 'vision-board' 
                  ? 'bg-pink-200 text-gray-800' 
                  : 'bg-white bg-opacity-60 text-gray-700 hover:bg-opacity-80'
              }`}
              onClick={() => setActiveTab('vision-board')}
            >
              Vision Board
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
            {!showUploadSection && !showDreamEntry && (
              <div className="text-center mb-8 space-y-4">
                <button
                  onClick={() => setShowUploadSection(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all duration-300 mr-4"
                >
                  Quick Create
                </button>
                <button
                  onClick={() => setShowDreamEntry(true)}
                  className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-full text-xl shadow-lg transition-all duration-300"
                >
                  Log Dream
                </button>
              </div>
            )}

            {activeTab === 'create' && (
              <>
                <AiIntegrationPanel />
                <UploadSection 
                  onProcessingStart={handleProcessingStart}
                  onProcessingComplete={handleProcessingComplete}
                  onProcessingError={handleProcessingError}
                  show={showUploadSection}
                  setShow={setShowUploadSection}
                />
              </>
            )}

            {/* Dream Entry Section */}
            {showDreamEntry && (
              <DreamEntry
                onDreamSaved={handleDreamSaved}
                onCancel={() => setShowDreamEntry(false)}
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
        ) : activeTab === 'journal' ? (
          <DreamList 
            onDreamSelect={handleDreamSelect}
            onRefresh={() => setProcessingStatus('')}
          />
        ) : activeTab === 'vision-board' ? (
          <VisionBoard />
        ) : null}
      </div>

      {/* Dream Detail Modal */}
      {selectedDream && (
        <DreamDetail
          dream={selectedDream}
          onClose={handleDreamClose}
          onUpdate={(updatedDream) => setSelectedDream(updatedDream)}
        />
      )}
    </div>
  );
};

export default Dashboard;