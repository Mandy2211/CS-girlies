import React, { useState } from 'react'; // Added React import
import { useAuth } from '../Context/AuthContext';
import UploadSection from '../components/UploadSection';
import ProjectGallery from '../components/ProjectGallery';
import LoadingSpinner from '../components/LoadingSpin';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-100 p-4">
      <header className="max-w-6xl mx-auto py-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-800">Dream Studio</h1>
        <div className="flex items-center space-x-4">
          <span className="text-indigo-600">Hi, {user.email}</span>
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 py-2 px-4 rounded-full transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto mt-8">
        <div className="flex border-b border-indigo-200 mb-8">
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'create' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
            onClick={() => setActiveTab('create')}
          >
            Create New
          </button>
          <button
            className={`py-3 px-6 font-medium ${activeTab === 'gallery' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-indigo-500'}`}
            onClick={() => setActiveTab('gallery')}
          >
            My Projects
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-20">
            <LoadingSpinner />
            <p className="ml-4 text-indigo-700 text-xl">Creating magic...</p>
          </div>
        ) : activeTab === 'create' ? (
          <UploadSection onProcessingStart={() => setIsLoading(true)} />
        ) : (
          <ProjectGallery />
        )}
      </div>
    </div>
  );
};

export default Dashboard;