import React, { useState, useRef, useEffect } from 'react';
import { CloudRain, Zap, Flame, Bird, Moon, Waves, Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface Sound {
  id: string;
  name: string;
  icon: React.ElementType;
  url: string;
  color: string;
}

const SOUNDS: Sound[] = [
  {
    id: 'rain',
    name: 'Heavy Rain',
    icon: CloudRain,
    url: 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg',
    color: 'text-blue-400'
  },
  {
    id: 'thunder',
    name: 'Thunderstorm',
    icon: Zap,
    url: 'https://actions.google.com/sounds/v1/weather/thunder_crack.ogg',
    color: 'text-yellow-400'
  },
  {
    id: 'fire',
    name: 'Crackling Fire',
    icon: Flame,
    url: 'https://actions.google.com/sounds/v1/ambiences/fire.ogg',
    color: 'text-orange-500'
  },
  {
    id: 'birds',
    name: 'Forest Birds',
    icon: Bird,
    url: 'https://actions.google.com/sounds/v1/animals/woodpecker_eating_distant.ogg',
    color: 'text-green-400'
  },
  {
    id: 'night',
    name: 'Night Crickets',
    icon: Moon,
    url: 'https://actions.google.com/sounds/v1/animals/afternoon_crickets_long.ogg',
    color: 'text-indigo-400'
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    icon: Waves,
    url: 'https://actions.google.com/sounds/v1/water/waves_crashing.ogg',
    color: 'text-cyan-400'
  }
];

const SoundCard: React.FC<{ sound: Sound }> = ({ sound }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const Icon = sound.icon;

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 flex flex-col items-center gap-4 transition-all hover:border-neutral-700 hover:bg-neutral-900">
      <audio 
        ref={audioRef} 
        src={sound.url} 
        loop 
        onError={(e) => console.error(`Error loading sound ${sound.name}:`, e)}
      />
      
      <div className={`p-4 rounded-full bg-neutral-950 border border-neutral-800 ${isPlaying ? 'animate-pulse ring-2 ring-emerald-500/20' : ''}`}>
        <Icon size={32} className={sound.color} />
      </div>

      <div className="text-center">
        <h3 className="font-bold text-neutral-200">{sound.name}</h3>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">{isPlaying ? 'Active' : 'Paused'}</p>
      </div>

      <div className="w-full space-y-4 mt-2">
        <button 
          onClick={togglePlay}
          className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
            isPlaying 
              ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? 'PAUSE' : 'PLAY'}
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => setVolume(0)} className="text-neutral-500 hover:text-neutral-300">
            {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={volume} 
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

const SoundSanctuary: React.FC = () => {
  return (
    <div className="space-y-8 p-6 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase text-white">Sound Sanctuary</h2>
          <p className="text-emerald-500 font-mono text-sm tracking-widest">AMBIENT FOCUS MIXER</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOUNDS.map(sound => (
          <SoundCard key={sound.id} sound={sound} />
        ))}
      </div>
    </div>
  );
};

export default SoundSanctuary;
