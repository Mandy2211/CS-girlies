import React, { useState } from 'react'; 
import { useAuth } from '../Context/AuthContext';
import UploadSection from '../components/UploadSection';
import ProjectGallery from '../components/ProjectGallery';
import LoadingSpinner from '../components/LoadingSpin';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Dashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const navigate = useNavigate();

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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
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

  const handleAIGenerateImage = async (file) => {
    if (!file) return;
    setIsLoading(true);
    try {
      // Call your backend/Replicate API for image-to-animation
      const result = await apiService.generateAnimationFromImage(file);
      navigate('/preview', { state: { output: result.data || result } });
    } catch (e) {
      alert('Failed to generate animation: ' + e.message);
      setIsLoading(false);
    }
  };

  // AI prompt handler (OpenAI)
  const handleAIPrompt = async () => {
    if (!userInput.trim()) return;
    setAiLoading(true);
    navigate('/loading');
    try {
      // Call your OpenAI backend (example: generateStory)
      const result = await apiService.generateStory(userInput);
      navigate('/preview', { state: { output: result.data || result } });
    } catch (e) {
      alert('Failed to generate: ' + e.message);
      navigate('/preview', { state: { output: { story: userInput } } });
    }
    setAiLoading(false);
  };

  // Replicate image upload handler
  const handleReplicateImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiLoading(true);
    navigate('/loading');
    try {
      // Call your Replicate backend (example: generateAnimationFromImage)
      const result = await apiService.generateAnimationFromImage(file);
      navigate('/preview', { state: { output: result.data || result } });
    } catch (e) {
      alert('Failed to generate animation: ' + e.message);
      navigate('/preview', { state: { output: {} } });
    }
    setAiLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    console.log('Signed out, user:', await supabase.auth.getUser());
    navigate('/'); // Redirect to home/login page
  };

  if (!user) return <LoadingSpinner />;

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #fff6b7 0%, #f7c6e0 50%, #b6e2d3 100%)',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    padding: '16px'
  };

  const headerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    paddingTop: '24px',
    paddingBottom: '24px'
  };

  const navContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  };

  const tabsStyle = {
    display: 'flex',
    gap: '16px'
  };

  const getTabStyle = (isActive) => ({
    padding: '12px 32px',
    borderRadius: '50px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isActive 
      ? 'linear-gradient(90deg, #ffb6a3, #ffd6b0)' 
      : 'rgba(255, 255, 255, 0.6)',
    color: isActive ? 'white' : '#374151',
    boxShadow: '0 2px 12px rgba(182, 226, 211, 0.6)',
    fontFamily: 'inherit'
  });

  const signOutStyle = {
    padding: '12px 24px',
    borderRadius: '50px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(90deg, #a7bfff, #b6e2d3)',
    color: '#1f2937',
    boxShadow: '0 2px 12px rgba(182, 226, 211, 0.6)',
    fontFamily: 'inherit'
  };

  const mainContentStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 16px'
  };

  const centerContentStyle = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  };

  const headingContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const titleStyle = {
    fontSize: '3rem',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
    fontFamily: '"Pacifico", cursive, -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    color: '#3a4ca8',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
  };

  const subtitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0',
    color: '#374151',
    fontFamily: 'inherit'
  };

  const descriptionStyle = {
    fontSize: '1rem',
    color: '#6b7280',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6',
    fontFamily: 'inherit'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: '16px',
    flexWrap: 'wrap'
  };

  const uploadButtonStyle = (gradient) => ({
    padding: '12px 32px',
    borderRadius: '50px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: gradient,
    color: '#1f2937',
    boxShadow: '0 4px 20px rgba(255, 182, 163, 0.4)',
    fontFamily: 'inherit',
    minWidth: '160px'
  });

  const textareaStyle = {
    width: '100%',
    maxWidth: '700px',
    height: '120px',
    padding: '16px',
    borderRadius: '16px',
    resize: 'none',
    border: '2px solid transparent',
    outline: 'none',
    background: 'linear-gradient(135deg, #fff6b7 0%, #f7c6e0 100%)',
    color: '#3a4ca8',
    fontFamily: 'inherit',
    fontSize: '1rem',
    margin: '0 auto',
    display: 'block',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale'
  };

  const submitButtonStyle = {
    padding: '12px 40px',
    borderRadius: '50px',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    border: 'none',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    background: isLoading 
      ? 'linear-gradient(90deg, #d1d5db, #9ca3af)' 
      : 'linear-gradient(90deg, #ff6b95, #ff9472, #ffcd56)',
    color: isLoading ? '#6b7280' : 'white',
    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
    boxShadow: isLoading 
      ? '0 4px 20px rgba(0,0,0,0.1)' 
      : '0 8px 32px rgba(255, 107, 149, 0.4)',
    fontFamily: 'inherit'
  };

  const loadingStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    gap: '16px'
  };

  const filesContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px'
  };

  const fileTagsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center'
  };

  const fileTagStyle = {
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '0.9rem',
    fontWeight: '500',
    background: '#fff6b7',
    color: '#3a4ca8',
    border: '2px solid #f7c6e0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={navContainerStyle}>
          <div style={tabsStyle}>
            <button
              style={getTabStyle(activeTab === 'create')}
              onClick={() => setActiveTab('create')}
            >
              Home
            </button>
            <button
              style={getTabStyle(activeTab === 'gallery')}
              onClick={() => setActiveTab('gallery')}
            >
              Gallery
            </button>
            <button
              style={getTabStyle(activeTab === 'ai')}
              onClick={() => setActiveTab('ai')}
            >
              AI Generator
            </button>
          </div>
          <button
            onClick={handleSignOut}
            style={signOutStyle}
          >
            Sign Out
          </button>
        </div>
      </header>

      <div style={mainContentStyle}>
        {isLoading ? (
          <div style={loadingStyle}>
            <LoadingSpinner />
            <p style={{ color: '#374151', fontSize: '1.25rem', margin: 0 }}>Creating magic...</p>
          </div>
        ) : activeTab === 'create' ? (
          <div style={centerContentStyle}>
            <div style={headingContainerStyle}>
              <h1 style={titleStyle}>DreamCanvas ✨</h1>
              <h2 style={subtitleStyle}>Realise your dream</h2>
              <h3 style={subtitleStyle}>Create your story</h3>
              <p style={descriptionStyle}>
                Welcome to your magical journaling space. Write your dreams, stories, and sketches. 
                Let our AI bring them to life with animation and creativity! 🎨
              </p>
            </div>

            <div style={buttonsContainerStyle}>
              <button 
                onClick={handleImageUpload}
                style={uploadButtonStyle('linear-gradient(90deg, #ffb6a3, #ffd6b0)')}
              >
                🖼️ Upload images
              </button>
              <button 
                onClick={handleFileUpload}
                style={uploadButtonStyle('linear-gradient(90deg, #a7bfff, #b6e2d3)')}
              >
                📁 Upload files
              </button>
            </div>

            {selectedFiles.length > 0 && (
              <div style={filesContainerStyle}>
                <h3 style={{ color: '#3a4ca8', fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>
                  Selected Files: ✨
                </h3>
                <div style={fileTagsStyle}>
                  {selectedFiles.map((file, index) => (
                    <span key={index} style={fileTagStyle}>
                      📎 {file.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="✨ Enter your thoughts, ideas, dreams... Let your imagination flow! 🌟"
                style={textareaStyle}
                onFocus={(e) => {
                  e.target.style.border = '2px solid #a7bfff';
                  e.target.style.boxShadow = '0 8px 32px rgba(167, 191, 255, 0.3)';
                }}
                onBlur={(e) => {
                  e.target.style.border = '2px solid transparent';
                  e.target.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                }}
              />
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                style={submitButtonStyle}
              >
                {isLoading ? '✨ Creating magic...' : '🚀 Create Dream'}
              </button>
            </div>
          </div>
        ) : activeTab === 'ai' ? (
          <div style={centerContentStyle}>
            <h2 style={titleStyle}>AI Story/Animation Generator</h2>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowAIPrompt((v) => !v)}
                style={submitButtonStyle}
                disabled={aiLoading}
              >
                Generate Story with AI
              </button>
              <label style={{ ...submitButtonStyle, cursor: aiLoading ? 'not-allowed' : 'pointer', marginBottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'fit-content' }}>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleReplicateImage}
                  disabled={aiLoading}
                />
                Image to Animation
              </label>
            </div>
            {showAIPrompt && (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Enter your prompt for AI story/animation..."
                  style={textareaStyle}
                />
                <button
                  onClick={handleAIPrompt}
                  style={{ ...submitButtonStyle, marginTop: '12px' }}
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Generating...' : 'Submit to AI'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(247,198,224,0.2) 100%)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
          }}>
            <ProjectGallery />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;