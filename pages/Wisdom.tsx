import React, { useState, useEffect } from 'react';
import { quotes, getDailyQuote, getQuotesByCategory, Quote } from '../data/quotes';
import { Button } from '../components/UIComponents';

const CATEGORIES = ['All', 'Stoicism', 'War', 'Discipline', 'Mindset', 'Fitness', 'Masculinity'];

// High-quality aesthetic backgrounds mapped to categories
const CATEGORY_IMAGES: Record<string, string> = {
  'Stoicism': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=2070&auto=format&fit=crop', // Landscape/Nature
  'War': 'https://images.unsplash.com/photo-1533613220915-609f661a6fe1?q=80&w=2070&auto=format&fit=crop', // Dark texture/Armor vibe
  'Discipline': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop', // Gym/Weights
  'Mindset': 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2070&auto=format&fit=crop', // Abstract/Brain
  'Fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop', // Runner/Action
  'Masculinity': 'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?q=80&w=2070&auto=format&fit=crop', // Mountains/Peak
  'All': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop' // Ocean
};

export const Wisdom = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [filteredQuotes, setFilteredQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    setDailyQuote(getDailyQuote());
  }, []);

  useEffect(() => {
    setFilteredQuotes(getQuotesByCategory(selectedCategory));
  }, [selectedCategory]);

  const handleReminder = () => {
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notifications");
    } else if (Notification.permission === "granted") {
      new Notification("Iron Mind Reminder", { body: dailyQuote?.text });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification("Iron Mind Reminder", { body: dailyQuote?.text });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Hero Section - Daily Quote */}
      <div 
        className="relative h-[60vh] flex items-center justify-center p-8 text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${CATEGORY_IMAGES[dailyQuote?.category || 'All']})` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        
        <div className="relative z-10 max-w-4xl animate-fade-in-up">
          <div className="inline-block px-3 py-1 mb-6 border border-emerald-500/50 rounded-full bg-black/50 backdrop-blur-md">
            <span className="text-emerald-400 text-xs font-mono tracking-widest uppercase">Quote of the Day</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic mb-6 leading-tight font-serif">
            "{dailyQuote?.text}"
          </h1>
          <p className="text-xl text-neutral-300 font-mono">— {dailyQuote?.author}</p>
          
          <div className="mt-8 flex justify-center gap-4">
            <Button onClick={handleReminder} variant="outline" className="border-white/20 hover:bg-white/10">
              Set Daily Reminder
            </Button>
          </div>
        </div>
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
                  ? 'bg-emerald-500 text-black' 
                  : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Quote Grid */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredQuotes.map(quote => (
          <div 
            key={quote.id} 
            className="group relative p-8 bg-neutral-900/50 border border-neutral-800 hover:border-emerald-500/50 transition-all duration-300 hover:bg-neutral-900"
          >
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-mono text-emerald-500 border border-emerald-500/30 px-2 py-1 rounded">{quote.category}</span>
            </div>
            <p className="text-lg font-serif text-neutral-200 mb-4 leading-relaxed">"{quote.text}"</p>
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-800">
              <span className="text-sm font-bold text-neutral-400">— {quote.author}</span>
              {quote.source && <span className="text-xs text-neutral-600 italic">{quote.source}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
