import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UIComponents';

export const Focus: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState(25);
  const [distractions, setDistractions] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const setTimer = (min: number) => {
    setMode(min);
    setTimeLeft(min * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
      <div className="flex gap-4">
        {[25, 40, 60].map(m => (
          <button 
            key={m}
            onClick={() => setTimer(m)}
            className={`text-sm font-mono font-bold px-4 py-2 border ${mode === m ? 'border-emerald-500 text-emerald-500' : 'border-neutral-800 text-neutral-500'}`}
          >
            {m} MIN
          </button>
        ))}
      </div>

      <div className="relative w-80 h-80 flex items-center justify-center border-4 border-neutral-800 rounded-full bg-neutral-950">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-500 opacity-20 animate-pulse"></div>
        <span className="text-7xl font-black font-mono text-white tracking-tighter">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex gap-4">
        <Button onClick={() => setIsActive(!isActive)} className="w-32">
          {isActive ? 'PAUSE' : 'START'}
        </Button>
        <Button variant="danger" onClick={() => setDistractions(d => d + 1)}>
          Distraction Log
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Distraction Count</p>
        <p className={`text-2xl font-bold ${distractions > 0 ? 'text-red-500' : 'text-emerald-500'}`}>{distractions}</p>
        {distractions > 0 && <p className="text-[10px] text-red-400 mt-2 font-mono">REGAIN FOCUS. STAY HARD.</p>}
      </div>
    </div>
  );
};
