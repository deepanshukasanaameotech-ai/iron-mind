import React, { useState } from 'react';
import { HabitIntensity, Habit } from '../types';
import { Card, Button, Badge, Input } from '../components/UIComponents';
import { generateBrutalAdvice } from '../services/aiService';
import { useData } from '../contexts/DataContext';

export const Habits: React.FC = () => {
  const { habits, updateHabits, loading } = useData();
  const [advice, setAdvice] = useState<string>('');
  
  // New Habit State
  const [newHabitTitle, setNewHabitTitle] = useState('');
  const [newHabitIntensity, setNewHabitIntensity] = useState<HabitIntensity>(HabitIntensity.MED);

  if (loading) return <div className="text-white">Loading Habits...</div>;

  const toggleHabit = async (id: string) => {
    const newHabits = habits.map(h => {
      if (h.id === id) {
        const completed = !h.completedToday;
        return { ...h, completedToday: completed, streak: completed ? h.streak + 1 : Math.max(0, h.streak - 1) };
      }
      return h;
    });
    await updateHabits(newHabits);
  };

  const addHabit = async () => {
    if (!newHabitTitle.trim()) return;
    const newHabit: Habit = {
      id: Date.now().toString(),
      title: newHabitTitle,
      intensity: newHabitIntensity,
      streak: 0,
      completedToday: false
    };
    await updateHabits([...habits, newHabit]);
    setNewHabitTitle('');
    setNewHabitIntensity(HabitIntensity.MED);
  };

  const deleteHabit = async (id: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      const newHabits = habits.filter(h => h.id !== id);
      await updateHabits(newHabits);
    }
  };

  const getIntensityColor = (i: HabitIntensity) => {
    switch(i) {
      case 'HIGH': return 'bg-red-900 text-red-100';
      case 'MED': return 'bg-yellow-900 text-yellow-100';
      default: return 'bg-neutral-800 text-neutral-400';
    }
  };

  const fixMe = async () => {
    const context = habits.map(h => `${h.title} (${h.completedToday ? 'DONE' : 'FAILED'})`).join(', ');
    const res = await generateBrutalAdvice(context, "Habit Discipline");
    setAdvice(res);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black uppercase text-white">Discipline Lab</h2>
        <Button onClick={fixMe} variant="outline" className="text-xs">
          Fix This
        </Button>
      </div>

      {advice && (
        <div className="bg-red-900/10 border border-red-900 p-4 text-red-200 font-mono text-sm animate-pulse">
          <span className="font-bold mr-2">COMMAND:</span>{advice}
        </div>
      )}

      {/* Add Habit Form */}
      <Card title="New Protocol">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs text-neutral-500 mb-1 block">HABIT NAME</label>
            <Input 
              value={newHabitTitle}
              onChange={(e) => setNewHabitTitle(e.target.value)}
              placeholder="e.g. Cold Shower"
            />
          </div>
          <div className="w-full md:w-auto">
             <label className="text-xs text-neutral-500 mb-1 block">INTENSITY</label>
             <select 
                value={newHabitIntensity}
                onChange={(e) => setNewHabitIntensity(e.target.value as HabitIntensity)}
                className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 p-3 font-mono text-sm focus:border-emerald-500 focus:outline-none h-[46px]"
             >
                <option value={HabitIntensity.LOW}>LOW</option>
                <option value={HabitIntensity.MED}>MED</option>
                <option value={HabitIntensity.HIGH}>HIGH</option>
             </select>
          </div>
          <Button onClick={addHabit} className="w-full md:w-auto h-[46px]">
            INITIATE
          </Button>
        </div>
      </Card>

      {habits.length === 0 && (
        <div className="text-center py-10 text-neutral-500 font-mono">
          NO HABITS TRACKED. START NOW.
        </div>
      )}

      <div className="grid gap-4">
        {habits.map(habit => (
          <Card key={habit.id} className="flex items-center justify-between p-4 py-6 hover:bg-neutral-900/80 transition-colors group">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => toggleHabit(habit.id)}
                className={`w-8 h-8 flex items-center justify-center border transition-all ${
                  habit.completedToday ? 'bg-emerald-600 border-emerald-500' : 'border-neutral-700'
                }`}
              >
                {habit.completedToday && '✓'}
              </button>
              <div>
                <div className="flex items-center space-x-2">
                  <span className={`font-bold uppercase tracking-wide ${habit.completedToday ? 'text-neutral-500 line-through' : 'text-white'}`}>
                    {habit.title}
                  </span>
                  <Badge color={getIntensityColor(habit.intensity)}>{habit.intensity}</Badge>
                </div>
                <p className="text-xs text-neutral-500 font-mono mt-1">
                  STREAK: {habit.streak}
                </p>
              </div>
            </div>
            <button 
              onClick={() => deleteHabit(habit.id)}
              className="text-neutral-700 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-2"
              title="Delete Habit"
            >
              ✕
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
