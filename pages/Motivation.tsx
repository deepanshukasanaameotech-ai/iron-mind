import React, { useState, useEffect } from 'react';
import { videos, getVideosByCategory, Video } from '../data/videos';
import { Button } from '../components/UIComponents';

const CATEGORIES = ['All', 'Goggins', 'Jocko', 'Running', 'War Mode'];

export const Motivation = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    setFilteredVideos(getVideosByCategory(selectedCategory));
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="p-8 border-b border-neutral-900 bg-neutral-950">
        <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">FUEL <span className="text-red-600">STATION</span></h1>
        <p className="text-neutral-500 font-mono text-sm">PURE MOTIVATION. NO DISTRACTIONS.</p>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-neutral-800 p-4 overflow-x-auto">
        <div className="flex gap-2 max-w-7xl mx-auto">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat 
                  ? 'bg-red-600 text-white' 
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredVideos.map(video => (
          <div 
            key={video.id} 
            className="group relative aspect-[9/16] bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-all"
          >
            {playingVideo === video.id ? (
              <iframe
                src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
                title={video.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div 
                onClick={() => setPlayingVideo(video.id)}
                className="w-full h-full cursor-pointer relative"
              >
                {/* Thumbnail */}
                <img 
                  src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`} 
                  alt={video.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                  onError={(e) => {
                    // Fallback if maxres doesn't exist
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                  }}
                />
                
                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center pl-1 shadow-lg shadow-red-600/20 group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                  <h3 className="font-bold text-lg leading-tight text-white mb-1">{video.title}</h3>
                  <span className="text-xs font-mono text-red-500 uppercase tracking-wider">{video.category}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
