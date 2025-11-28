import React, { useState } from 'react';
import { Card, Button, Input, Badge } from '../components/UIComponents';
import { RunLog, PushupLog, PullupLog } from '../types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { analyzePerformance } from '../services/aiService';
import { useData } from '../contexts/DataContext';

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 font-mono text-sm uppercase font-bold tracking-widest border-b-2 transition-colors ${
      active ? 'border-emerald-500 text-white' : 'border-transparent text-neutral-600 hover:text-neutral-400'
    }`}
  >
    {label}
  </button>
);

export const Performance: React.FC = () => {
  const { runs, addRun, pushups, addPushup, pullups, addPullup, loading } = useData();
  const [tab, setTab] = useState<'RUN' | 'PUSH' | 'PULL'>('RUN');
  const [advice, setAdvice] = useState('');

  // --- RUNNING LOGIC ---
  const [newRun, setNewRun] = useState({ dist: '', time: '' });

  const handleAddRun = async () => {
    if (!newRun.dist || !newRun.time) return;
    const dist = parseFloat(newRun.dist);
    const time = parseFloat(newRun.time);
    const run: RunLog = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
      distanceKm: dist,
      timeMinutes: time,
      pace: parseFloat((time / dist).toFixed(2))
    };
    await addRun(run);
    setNewRun({ dist: '', time: '' });
  };
  
  const displayRuns = runs.slice(-7); // Show last 7

  // --- PUSHUP LOGIC ---
  const todayPush = pushups.find(p => p.date === new Date().toISOString().split('T')[0])?.count || 0;

  const handleAddPushups = async (amount: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: PushupLog = { date: today, count: todayPush + amount };
    await addPushup(newLog);
  };
  
  const displayPushups = pushups.slice(-7);

  // --- PULLUP LOGIC ---
  const todayPullLog = pullups.find(p => p.date === new Date().toISOString().split('T')[0]) || { date: '', sets: 0, reps: 0, maxSet: 0 };

  const handleAddPullupSet = async (reps: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newLog: PullupLog = {
      date: today,
      sets: todayPullLog.sets + 1,
      reps: todayPullLog.reps + reps,
      maxSet: Math.max(todayPullLog.maxSet, reps)
    };
    await addPullup(newLog);
  };

  // --- AI ---
  const handleAnalyze = async () => {
    let data;
    if (tab === 'RUN') data = runs;
    if (tab === 'PUSH') data = pushups;
    if (tab === 'PULL') data = pullups;
    setAdvice("Analyzing weakness...");
    const res = await analyzePerformance(data, tab);
    setAdvice(res);
  };

  if (loading) return <div className="text-white">Loading Performance Data...</div>;

  return (
    <div className="space-y-6">
      <div className="border-b border-neutral-800 flex space-x-2">
        <TabButton active={tab === 'RUN'} onClick={() => setTab('RUN')} label="Running" />
        <TabButton active={tab === 'PUSH'} onClick={() => setTab('PUSH')} label="Push-ups" />
        <TabButton active={tab === 'PULL'} onClick={() => setTab('PULL')} label="Pull-ups" />
      </div>

      <div className="min-h-[400px]">
        {/* RUNNING VIEW */}
        {tab === 'RUN' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card title="Add Run">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-xs text-neutral-500">Distance (km)</label>
                      <Input type="number" value={newRun.dist} onChange={e => setNewRun({...newRun, dist: e.target.value})} />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-neutral-500">Time (min)</label>
                      <Input type="number" value={newRun.time} onChange={e => setNewRun({...newRun, time: e.target.value})} />
                    </div>
                  </div>
                  <Button onClick={handleAddRun} className="w-full">Log Run</Button>
                </div>
              </Card>
              <Card title="Pace Trend (Last 7)">
                <div className="h-40 w-full min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={displayRuns}>
                      <XAxis dataKey="date" stroke="#333" fontSize={10} tickLine={false} />
                      <YAxis stroke="#333" fontSize={10} tickLine={false} domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #333' }} />
                      <Line type="monotone" dataKey="pace" stroke="#10B981" strokeWidth={2} dot={{fill: '#10B981'}} label={{ fill: '#fff', fontSize: 10, dy: -10 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
            {runs.length < 2 && <div className="p-4 bg-yellow-900/20 text-yellow-500 text-xs font-mono border border-yellow-900">WARNING: STAY HARD MODE REQUIRES 2x RUNS WEEKLY.</div>}
          </div>
        )}

        {/* PUSHUPS VIEW */}
        {tab === 'PUSH' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center py-10">
              <h1 className="text-8xl font-black text-white">{todayPush}</h1>
              <p className="text-emerald-500 font-mono tracking-widest uppercase">Repetitions Today</p>
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => handleAddPushups(10)} variant="outline">+10</Button>
              <Button onClick={() => handleAddPushups(20)} variant="outline">+20</Button>
              <Button onClick={() => handleAddPushups(50)} variant="primary">+50</Button>
            </div>
            <Card title="Volume History">
               <div className="h-40 min-h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={displayPushups}>
                      <XAxis dataKey="date" stroke="#333" fontSize={10} />
                      <Bar dataKey="count" fill="#34D399" label={{ position: 'top', fill: '#fff', fontSize: 10 }} />
                    </BarChart>
                  </ResponsiveContainer>
               </div>
            </Card>
            <p className="text-center text-xs text-neutral-600 font-mono uppercase">Don't cheat yourself. Chest to floor.</p>
          </div>
        )}

        {/* PULLUPS VIEW */}
        {tab === 'PULL' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card title="Log Set">
                 <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <label className="text-xs text-neutral-500">Reps in set</label>
                      <Input id="pullReps" type="number" placeholder="0" />
                    </div>
                    <Button onClick={() => {
                      const val = (document.getElementById('pullReps') as HTMLInputElement).value;
                      if(val) handleAddPullupSet(parseInt(val));
                    }}>Add</Button>
                 </div>
              </Card>
              <Card title="Today's Metrics">
                <div className="flex justify-between text-center">
                   <div>
                      <p className="text-2xl text-white font-bold">{todayPullLog.reps}</p>
                      <p className="text-[10px] text-neutral-500 uppercase">Total Reps</p>
                   </div>
                   <div>
                      <p className="text-2xl text-white font-bold">{todayPullLog.sets}</p>
                      <p className="text-[10px] text-neutral-500 uppercase">Sets</p>
                   </div>
                   <div>
                      <p className="text-2xl text-emerald-500 font-bold">{todayPullLog.maxSet}</p>
                      <p className="text-[10px] text-neutral-500 uppercase">Max Reps</p>
                   </div>
                </div>
              </Card>
            </div>
             <div className="p-4 border border-red-900 bg-red-900/10 text-red-400 text-center font-mono text-xs">
                STOP BABYING YOURSELF. FULL EXTENSION.
             </div>
          </div>
        )}
      </div>

      <div className="pt-8 border-t border-neutral-800">
        <div className="flex justify-between items-center mb-4">
           <h3 className="text-emerald-500 font-mono uppercase">AI Performance Coach</h3>
           <Button onClick={handleAnalyze} variant="outline" className="text-xs">Analyze {tab}</Button>
        </div>
        {advice && (
          <div className="bg-neutral-950 p-4 border-l-2 border-emerald-500 text-sm font-mono text-neutral-300">
            {advice}
          </div>
        )}
      </div>
    </div>
  );
};
