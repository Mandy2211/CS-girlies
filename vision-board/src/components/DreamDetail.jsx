import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import apiService from '../services/apiService';

const DreamDetail = ({ dream, onClose, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioElement, setAudioElement] = useState(null);
  const [editForm, setEditForm] = useState({
    title: dream?.title || '',
    content: dream?.content || '',
    mood: dream?.metadata?.mood || 'neutral',
    dreamType: dream?.metadata?.dreamType || 'regular',
    tags: dream?.metadata?.tags || '',
    isLucid: dream?.metadata?.isLucid || false,
    isRecurring: dream?.metadata?.isRecurring || false
  });

  const moodOptions = [
    { value: 'joyful', label: '😊 Joyful', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'peaceful', label: '😌 Peaceful', color: 'bg-blue-100 text-blue-800' },
    { value: 'excited', label: '🤩 Excited', color: 'bg-purple-100 text-purple-800' },
    { value: 'neutral', label: '😐 Neutral', color: 'bg-gray-100 text-gray-800' },
    { value: 'confused', label: '😕 Confused', color: 'bg-orange-100 text-orange-800' },
    { value: 'anxious', label: '😰 Anxious', color: 'bg-red-100 text-red-800' },
    { value: 'sad', label: '😢 Sad', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const dreamTypes = [
    { value: 'regular', label: 'Regular Dream' },
    { value: 'lucid', label: 'Lucid Dream' },
    { value: 'nightmare', label: 'Nightmare' },
    { value: 'recurring', label: 'Recurring Dream' },
    { value: 'prophetic', label: 'Prophetic Dream' },
    { value: 'daydream', label: 'Daydream' }
  ];

  const getMoodEmoji = (mood) => {
    const moodMap = {
      joyful: '😊',
      peaceful: '😌',
      excited: '🤩',
      neutral: '😐',
      confused: '😕',
      anxious: '😰',
      sad: '😢'
    };
    return moodMap[mood] || '😐';
  };

  const getDreamTypeColor = (type) => {
    const colorMap = {
      regular: 'bg-blue-100 text-blue-800',
      lucid: 'bg-purple-100 text-purple-800',
      nightmare: 'bg-red-100 text-red-800',
      recurring: 'bg-orange-100 text-orange-800',
      prophetic: 'bg-green-100 text-green-800',
      daydream: 'bg-yellow-100 text-yellow-800'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      // Update dream metadata
      const updatedDream = {
        ...dream,
        title: editForm.title,
        content: editForm.content,
        metadata: {
          ...dream.metadata,
          mood: editForm.mood,
          dreamType: editForm.dreamType,
          tags: editForm.tags,
          isLucid: editForm.isLucid,
          isRecurring: editForm.isRecurring
        }
      };

      const result = await apiService.updateProject(dream.id, updatedDream);
      if (result.success) {
        onUpdate && onUpdate(updatedDream);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating dream:', error);
      alert('Failed to update dream. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this dream? This action cannot be undone.')) {
      try {
        const result = await apiService.deleteProject(dream.id);
        if (result.success) {
          onClose();
        }
      } catch (error) {
        console.error('Error deleting dream:', error);
        alert('Failed to delete dream. Please try again.');
      }
    }
  };

  const handleAudioPlay = () => {
    if (!audioElement) {
      const audio = new Audio(dream.audio_url);
      audio.addEventListener('ended', () => setIsPlayingAudio(false));
      setAudioElement(audio);
      audio.play();
      setIsPlayingAudio(true);
    } else {
      if (isPlayingAudio) {
        audioElement.pause();
        setIsPlayingAudio(false);
      } else {
        audioElement.play();
        setIsPlayingAudio(true);
      }
    }
  };

  if (!dream) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditing ? 'Edit Dream' : 'Dream Details'}
          </h2>
          <div className="flex space-x-2">
            {!isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dream Title
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              ) : (
                <h3 className="text-xl font-semibold text-gray-800">
                  {dream.title || 'Untitled Dream'}
                </h3>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created
              </label>
              <p className="text-gray-600">{formatDate(dream.created_at)}</p>
            </div>
          </div>

          {/* Dream Classification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Mood
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2">
                  {moodOptions.map(mood => (
                    <button
                      key={mood.value}
                      type="button"
                      onClick={() => setEditForm(prev => ({ ...prev, mood: mood.value }))}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        editForm.mood === mood.value
                          ? `${mood.color} border-current`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {mood.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getMoodEmoji(dream.metadata?.mood)}</span>
                  <span className="text-gray-700">
                    {moodOptions.find(m => m.value === dream.metadata?.mood)?.label.split(' ')[1] || 'Neutral'}
                  </span>
                </div>
              )}
            </div>

            {/* Dream Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Dream Type
              </label>
              {isEditing ? (
                <select
                  name="dreamType"
                  value={editForm.dreamType}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {dreamTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className={`px-3 py-2 rounded-full text-sm font-medium ${getDreamTypeColor(dream.metadata?.dreamType)}`}>
                  {dreamTypes.find(t => t.value === dream.metadata?.dreamType)?.label || 'Regular Dream'}
                </span>
              )}
            </div>
          </div>

          {/* Dream Characteristics */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dream Characteristics
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isLucid"
                  checked={editForm.isLucid}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">Lucid Dream</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="isRecurring"
                  checked={editForm.isRecurring}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="rounded text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
                />
                <span className="text-sm text-gray-700">Recurring Dream</span>
              </label>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            {isEditing ? (
              <input
                type="text"
                name="tags"
                value={editForm.tags}
                onChange={handleInputChange}
                placeholder="flying, water, childhood, etc."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {dream.metadata?.tags ? (
                  dream.metadata.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {tag.trim()}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No tags</span>
                )}
              </div>
            )}
          </div>

          {/* Dream Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dream Description
            </label>
            {isEditing ? (
              <textarea
                name="content"
                value={editForm.content}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
              />
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {dream.content || dream.story || 'No description available'}
                </p>
              </div>
            )}
          </div>

          {/* Generated Content */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Generated Content</h3>
            
            {/* Story */}
            {dream.story && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Generated Story</h4>
                <p className="text-blue-700 whitespace-pre-wrap">{dream.story}</p>
              </div>
            )}

            {/* Animation */}
            {dream.animation_url && (
              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">Generated Animation</h4>
                <video
                  controls
                  className="w-full rounded-lg"
                  src={dream.animation_url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Audio */}
            {dream.audio_url && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Generated Narration</h4>
                <button
                  onClick={handleAudioPlay}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span>{isPlayingAudio ? 'Pause' : 'Play'} Audio</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DreamDetail; 