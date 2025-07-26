import React, { useState } from 'react'; 
import { useAuth } from '../Context/AuthContext';
import UploadSection from '../components/UploadSection';
import ProjectGallery from '../components/ProjectGallery';
import LoadingSpinner from '../components/LoadingSpin';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);

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

  const handleSubmit = async () => {
    if (!userInput.trim() && selectedFiles.length === 0) {
      alert('Please enter some text or upload files');
      return;
    }

    setIsLoading(true);
    
    try {
      // Here you would integrate with your API
      // For now, let's simulate processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to Supabase
      const { data, error } = await supabase
        .from('projects')
        .insert([
          {
            user_id: user.id,
            content: userInput,
            type: 'dream',
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        console.error('Error saving project:', error);
        alert('Error saving project');
      } else {
        alert('Project created successfully!');
        setUserInput('');
        setSelectedFiles([]);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
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
            onClick={() => supabase.auth.signOut()}
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

            {/* Upload Buttons */}
            <div className="flex justify-center space-x-6 mb-8">
              <button 
                onClick={handleImageUpload}
                className="bg-pink-200 hover:bg-pink-300 text-gray-800 py-3 px-8 rounded-lg font-medium transition-colors"
              >
                Upload images
              </button>
              <button 
                onClick={handleFileUpload}
                className="bg-pink-200 hover:bg-pink-300 text-gray-800 py-3 px-8 rounded-lg font-medium transition-colors"
              >
                Upload files
              </button>
            </div>

            {/* Show selected files */}
            {selectedFiles.length > 0 && (
              <div className="max-w-2xl mx-auto mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-2">Selected Files:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <span key={index} className="bg-pink-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                      {file.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Text Input Area */}
            <div className="max-w-2xl mx-auto mb-8">
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Enter your thoughts, ideas, dreams (idk we can edit)"
                className="w-full h-32 p-4 bg-pink-100 border-none rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 placeholder-gray-600"
              />
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 px-8 rounded-lg font-medium transition-colors"
              >
                {isLoading ? 'Creating magic...' : 'Create Dream'}
              </button>
            </div>

            {/* Removed the problematic UploadSection component completely */}
          </div>
        ) : (
          <ProjectGallery />
        )}
      </div>
    </div>
  );
};

export default Dashboard;