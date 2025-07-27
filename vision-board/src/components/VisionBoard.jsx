import React, { useState, useEffect } from 'react';
import { useAuth } from '../Context/AuthContext';
import apiService from '../services/apiService';
import DreamCard from './DreamCard';
import DreamDetail from './DreamDetail';
import LoadingSpinner from './LoadingSpin';

const VisionBoard = () => {
  const { user } = useAuth();
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDream, setSelectedDream] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline
  const [sortBy, setSortBy] = useState('date'); // date, mood, type
  const [filterMood, setFilterMood] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDreams, setSelectedDreams] = useState([]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);

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

  const dreamTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'regular', label: 'Regular Dream' },
    { value: 'lucid', label: 'Lucid Dream' },
    { value: 'nightmare', label: 'Nightmare' },
    { value: 'recurring', label: 'Recurring Dream' },
    { value: 'prophetic', label: 'Prophetic Dream' },
    { value: 'daydream', label: 'Daydream' }
  ];

  useEffect(() => {
    fetchDreams();
  }, []);

  const fetchDreams = async () => {
    try {
      setLoading(true);
      const result = await apiService.getProjects();
      console.log('[DEBUG] VisionBoard fetch result:', result);
      if (result.success) {
        setDreams(result.projects || []);
      }
    } catch (error) {
      console.error('Error fetching dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort dreams
  const filteredAndSortedDreams = dreams
    .filter(dream => {
      const matchesSearch = dream.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dream.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           dream.story?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMood = filterMood === 'all' || dream.metadata?.mood === filterMood;
      const matchesType = filterType === 'all' || dream.metadata?.dreamType === filterType;
      
      return matchesSearch && matchesMood && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(b.created_at) - new Date(a.created_at);
          break;
        case 'mood':
          comparison = (a.metadata?.mood || '').localeCompare(b.metadata?.mood || '');
          break;
        case 'type':
          comparison = (a.metadata?.dreamType || '').localeCompare(b.metadata?.dreamType || '');
          break;
        default:
          comparison = 0;
      }
      
      return comparison;
    });

  const handleDreamClick = (dream) => {
    setSelectedDream(dream);
  };

  const handleDreamClose = () => {
    setSelectedDream(null);
  };

  const handleDreamUpdate = (updatedDream) => {
    setDreams(prev => prev.map(dream => 
      dream.id === updatedDream.id ? updatedDream : dream
    ));
    setSelectedDream(updatedDream);
  };

  const handlePlayAudio = (dream) => {
    if (currentAudio && isPlayingAudio) {
      currentAudio.pause();
      setIsPlayingAudio(false);
      setCurrentAudio(null);
    }

    if (dream.audio_url) {
      const audio = new Audio(dream.audio_url);
      audio.addEventListener('ended', () => {
        setIsPlayingAudio(false);
        setCurrentAudio(null);
      });
      audio.play();
      setIsPlayingAudio(true);
      setCurrentAudio(audio);
    }
  };

  const handlePlayAnimation = (dream) => {
    if (dream.animation_url) {
      window.open(dream.animation_url, '_blank');
    }
  };

  const handleDreamSelect = (dream) => {
    setSelectedDreams(prev => {
      const isSelected = prev.find(d => d.id === dream.id);
      if (isSelected) {
        return prev.filter(d => d.id !== dream.id);
      } else {
        return [...prev, dream];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedDreams(filteredAndSortedDreams);
  };

  const handleClearSelection = () => {
    setSelectedDreams([]);
  };

  const getGridColumns = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
      case 'list':
        return 'grid-cols-1';
      case 'timeline':
        return 'grid-cols-1 md:grid-cols-2';
      default:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Vision Board</h1>
          <p className="text-gray-600">
            Visualize your dreams and explore your subconscious mind
          </p>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <button
            onClick={fetchDreams}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search dreams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* View Mode */}
          <div>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
              <option value="timeline">Timeline</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="mood">Sort by Mood</option>
              <option value="type">Sort by Type</option>
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

          {/* Type Filter */}
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
        </div>

        {/* Selection Controls */}
        {selectedDreams.length > 0 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <span className="text-sm text-gray-600">
              {selectedDreams.length} dream{selectedDreams.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={handleSelectAll}
                className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
              >
                Select All
              </button>
              <button
                onClick={handleClearSelection}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Dreams Grid */}
      <div className={`grid ${getGridColumns()} gap-6`}>
        {filteredAndSortedDreams.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-24 w-24 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No dreams found</h3>
            <p className="text-gray-500">
              {searchTerm || filterMood !== 'all' || filterType !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Start by logging your first dream!'
              }
            </p>
          </div>
        ) : (
          filteredAndSortedDreams.map(dream => (
            <DreamCard
              key={dream.id}
              dream={dream}
              onClick={handleDreamClick}
              onPlayAudio={handlePlayAudio}
              onPlayAnimation={handlePlayAnimation}
              isSelected={selectedDreams.some(d => d.id === dream.id)}
            />
          ))
        )}
      </div>

      {/* Results Count */}
      {filteredAndSortedDreams.length > 0 && (
        <div className="text-center py-6 text-sm text-gray-500">
          Showing {filteredAndSortedDreams.length} of {dreams.length} dreams
        </div>
      )}

      {/* Dream Detail Modal */}
      {selectedDream && (
        <DreamDetail
          dream={selectedDream}
          onClose={handleDreamClose}
          onUpdate={handleDreamUpdate}
        />
      )}
    </div>
  );
};

export default VisionBoard; 