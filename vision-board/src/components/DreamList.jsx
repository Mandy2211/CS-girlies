import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import apiService from '../services/apiService';
import LoadingSpinner from './LoadingSpin';

const DreamList = ({ onDreamSelect, onRefresh }) => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterMood, setFilterMood] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const dreamTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'regular', label: 'Regular Dream' },
    { value: 'lucid', label: 'Lucid Dream' },
    { value: 'nightmare', label: 'Nightmare' },
    { value: 'recurring', label: 'Recurring Dream' },
    { value: 'prophetic', label: 'Prophetic Dream' },
    { value: 'daydream', label: 'Daydream' }
  ];

  const moodOptions = [
    { value: 'all', label: 'All Moods' },
    { value: 'joyful', label: '😊 Joyful' },
    { value: 'peaceful', label: '😌 Peaceful' },
    { value: 'excited', label: '🤩 Excited' },
    { value: 'neutral', label: '😐 Neutral' },
    { value: 'confused', label: '😕 Confused' },
    { value: 'anxious', label: '😰 Anxious' },
    { value: 'sad', label: '😢 Sad' }
  ];

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const result = await apiService.getProjects();
      if (result.success) {
        setDreams(result.projects || []);
      }
    } catch (error) {
      console.error('Error fetching dreams:', error);
    } finally {
      setLoading(false);
    }
  };

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
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  // Filter and sort dreams
  const filteredAndSortedDreams = dreams
    .filter(dream => {
      const matchesSearch = dream.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dream.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dream.story?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || dream.metadata?.dreamType === filterType;
      const matchesMood = filterMood === 'all' || dream.metadata?.mood === filterMood;
      
      return matchesSearch && matchesType && matchesMood;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.created_at) - new Date(a.created_at);
          break;
        case 'title':
          comparison = (a.title || '').localeCompare(b.title || '');
          break;
        case 'type':
          comparison = (a.metadata?.dreamType || '').localeCompare(b.metadata?.dreamType || '');
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'desc' ? comparison : -comparison;
    });

  const handleDreamClick = (dream) => {
    onDreamSelect && onDreamSelect(dream);
  };

  const handleRefresh = () => {
    fetchDreams();
    onRefresh && onRefresh();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dream Journal</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <input
              type="text"
              placeholder="Search dreams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Dream Type Filter */}
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {dreamTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mood Filter */}
          <div>
            <select
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {moodOptions.map(mood => (
                <option key={mood.value} value={mood.value}>
                  {mood.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="flex space-x-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="type">Type</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {sortOrder === 'desc' ? '↓' : '↑'}
            </button>
          </div>
        </div>
      </div>

      {/* Dreams List */}
      <div className="space-y-4">
        {filteredAndSortedDreams.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No dreams found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || filterMood !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by logging your first dream!'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedDreams.map(dream => (
            <div
              key={dream.id}
              onClick={() => handleDreamClick(dream)}
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    {dream.title || 'Untitled Dream'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(dream.created_at)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Mood */}
                  <span className="text-xl">
                    {getMoodEmoji(dream.metadata?.mood)}
                  </span>
                  
                  {/* Dream Type */}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDreamTypeColor(dream.metadata?.dreamType)}`}>
                    {dream.metadata?.dreamType || 'regular'}
                  </span>
                  
                  {/* Lucid/Recurring indicators */}
                  {dream.metadata?.isLucid && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Lucid
                    </span>
                  )}
                  {dream.metadata?.isRecurring && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                      Recurring
                    </span>
                  )}
                </div>
              </div>

              {/* Dream Content */}
              <div className="mb-3">
                <p className="text-gray-700 text-sm">
                  {truncateText(dream.content || dream.story || 'No description available')}
                </p>
              </div>

              {/* Tags */}
              {dream.metadata?.tags && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {dream.metadata.tags.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Generated Content Indicators */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                {dream.story && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Story
                  </span>
                )}
                {dream.animation_url && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Animation
                  </span>
                )}
                {dream.audio_url && (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Audio
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredAndSortedDreams.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          Showing {filteredAndSortedDreams.length} of {dreams.length} dreams
        </div>
      )}
    </div>
  );
};

export default DreamList; 