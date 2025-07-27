import React, { useState } from 'react';

const DreamCard = ({ dream, onClick, onPlayAudio, onPlayAnimation, isSelected = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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
      regular: 'bg-blue-100 text-blue-800 border-blue-200',
      lucid: 'bg-purple-100 text-purple-800 border-purple-200',
      nightmare: 'bg-red-100 text-red-800 border-red-200',
      recurring: 'bg-orange-100 text-orange-800 border-orange-200',
      prophetic: 'bg-green-100 text-green-800 border-green-200',
      daydream: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    return colorMap[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getMoodColor = (mood) => {
    const colorMap = {
      joyful: 'from-yellow-400 to-orange-400',
      peaceful: 'from-blue-400 to-indigo-400',
      excited: 'from-purple-400 to-pink-400',
      neutral: 'from-gray-400 to-gray-500',
      confused: 'from-orange-400 to-red-400',
      anxious: 'from-red-400 to-pink-400',
      sad: 'from-indigo-400 to-purple-400'
    };
    return colorMap[mood] || 'from-gray-400 to-gray-500';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleAudioClick = (e) => {
    e.stopPropagation();
    setIsPlayingAudio(!isPlayingAudio);
    onPlayAudio && onPlayAudio(dream);
  };

  const handleAnimationClick = (e) => {
    e.stopPropagation();
    onPlayAnimation && onPlayAnimation(dream);
  };

  const handleCardClick = () => {
    onClick && onClick(dream);
  };

  return (
    <div
      className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected ? 'ring-4 ring-indigo-500' : 'hover:shadow-xl'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Card Container */}
      <div className={`bg-white rounded-xl overflow-hidden shadow-lg border-2 ${getDreamTypeColor(dream.metadata?.dreamType)}`}>
        
        {/* Header with Gradient */}
        <div className={`relative h-24 bg-gradient-to-r ${getMoodColor(dream.metadata?.mood)}`}>
          {/* Mood Emoji */}
          <div className="absolute top-3 left-3 text-2xl">
            {getMoodEmoji(dream.metadata?.mood)}
          </div>
          
          {/* Date */}
          <div className="absolute top-3 right-3 text-white text-sm font-medium">
            {formatDate(dream.created_at)}
          </div>
          
          {/* Dream Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-white bg-opacity-90 ${getDreamTypeColor(dream.metadata?.dreamType)}`}>
              {dream.metadata?.dreamType || 'regular'}
            </span>
          </div>

          {/* Special Indicators */}
          <div className="absolute bottom-3 right-3 flex space-x-1">
            {dream.metadata?.isLucid && (
              <span className="px-2 py-1 bg-purple-500 text-white rounded-full text-xs font-medium">
                Lucid
              </span>
            )}
            {dream.metadata?.isRecurring && (
              <span className="px-2 py-1 bg-orange-500 text-white rounded-full text-xs font-medium">
                Recurring
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
            {dream.title || 'Untitled Dream'}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {truncateText(dream.content || dream.story || 'No description available')}
          </p>

          {/* Tags */}
          {dream.metadata?.tags && (
            <div className="flex flex-wrap gap-1 mb-3">
              {dream.metadata.tags.split(',').slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                >
                  {tag.trim()}
                </span>
              ))}
              {dream.metadata.tags.split(',').length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                  +{dream.metadata.tags.split(',').length - 3}
                </span>
              )}
            </div>
          )}

          {/* Generated Content Indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {dream.story && (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Story
                </span>
              )}
              {dream.animation_url && (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Video
                </span>
              )}
              {dream.audio_url && (
                <span className="flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  Audio
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center space-x-4 transition-opacity duration-200">
            <button
              onClick={handleCardClick}
              className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              View Details
            </button>
            
            {dream.animation_url && (
              <button
                onClick={handleAnimationClick}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors"
              >
                Play Video
              </button>
            )}
            
            {dream.audio_url && (
              <button
                onClick={handleAudioClick}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isPlayingAudio 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isPlayingAudio ? 'Pause' : 'Play'} Audio
              </button>
            )}
          </div>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DreamCard; 