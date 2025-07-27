import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import apiService from '../services/apiService';

const DreamEntry = ({ onDreamSaved, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    dreamDate: new Date().toISOString().split('T')[0],
    mood: 'neutral',
    dreamType: 'regular',
    tags: '',
    isLucid: false,
    isRecurring: false
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files).filter(file => 
      ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
    );
    setFiles(prev => [...prev, ...newFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }))]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type)
      );
      setFiles(prev => [...prev, ...newFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      }))]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.content.trim() && files.length === 0) {
      alert('Please enter a dream description or upload images');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiService.processDream(
        formData.content,
        formData.title || 'Untitled Dream',
        files
      );

      if (result.success) {
        onDreamSaved && onDreamSaved(result.data);
        // Reset form
        setFormData({
          title: '',
          content: '',
          dreamDate: new Date().toISOString().split('T')[0],
          mood: 'neutral',
          dreamType: 'regular',
          tags: '',
          isLucid: false,
          isRecurring: false
        });
        setFiles([]);
      }
    } catch (error) {
      console.error('Error saving dream:', error);
      alert('Failed to save dream. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Log Your Dream</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dream Title (Optional)
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Give your dream a title..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dream Date
            </label>
            <input
              type="date"
              name="dreamDate"
              value={formData.dreamDate}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Dream Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dream Description *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            placeholder="Describe your dream in detail... What happened? How did you feel? What did you see?"
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            required
          />
        </div>

        {/* Dream Classification */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Mood */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How did this dream make you feel?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {moodOptions.map(mood => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, mood: mood.value }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    formData.mood === mood.value
                      ? `${mood.color} border-current`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dream Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dream Type
            </label>
            <select
              name="dreamType"
              value={formData.dreamType}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {dreamTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dream Characteristics */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isLucid"
              checked={formData.isLucid}
              onChange={handleInputChange}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Lucid Dream (I knew I was dreaming)</span>
          </label>
          
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isRecurring"
              checked={formData.isRecurring}
              onChange={handleInputChange}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-gray-700">Recurring Dream</span>
          </label>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            placeholder="flying, water, childhood, etc."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Images (Optional)
          </label>
          <div 
            className={`border-2 rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive ? 'border-indigo-400 bg-indigo-50' : 'border-dashed border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <input 
              id="file-upload"
              type="file" 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/png, image/jpeg, image/jpg"
              multiple
            />
            <div className="flex flex-col items-center">
              <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-gray-600">Click or drag images to upload</p>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB each</p>
            </div>
          </div>

          {/* Image Previews */}
          {files.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images:</h4>
              <div className="flex flex-wrap gap-2">
                {files.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Processing Dream...' : 'Save Dream'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DreamEntry; 