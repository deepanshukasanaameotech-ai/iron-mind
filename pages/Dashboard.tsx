import React, { useState } from 'react';
import { generateBrutalAdvice } from '../services/aiService';
import { Card, Button, Input } from '../components/UIComponents';
import { useData } from '../contexts/DataContext';

export const Dashboard: React.FC = () => {
  const { battleLog, updateBattleLog, loading } = useData();
  const [loadingAi, setLoadingAi] = useState(false);

  if (loading || !battleLog) {
    return <div className="text-white">Loading Battle Log...</div>;
  }

  const handleAiRoast = async () => {
    setLoadingAi(true);
    const context = `
      Goal: ${battleLog.topGoal}. 
      Task: ${battleLog.essentialTask}. 
      Rule: ${battleLog.dailyRule}. 
      Completed: ${battleLog.completed}. 
      Streak: ${battleLog.streak}.
    `;
    const summary = await generateBrutalAdvice(context, "Daily Accountability");
    await updateBattleLog({ ...battleLog, aiSummary: summary });
    setLoadingAi(false);
  };

  const toggleComplete = async () => {
    const newVal = !battleLog.completed;
    await updateBattleLog({
      ...battleLog,
      completed: newVal,
      streak: newVal ? battleLog.streak + 1 : Math.max(0, battleLog.streak - 1)
    });
  };

  const updateField = (field: keyof typeof battleLog, value: string) => {
    updateBattleLog({ ...battleLog, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase text-white">Battle Log</h2>
          <p className="text-emerald-500 font-mono text-sm tracking-widest">{new Date().toDateString()}</p>
        </div>
        <div className="text-right">
          <p className="text-neutral-500 text-xs uppercase">Current Streak</p>
          <p className="text-4xl font-mono font-bold text-white">{battleLog.streak} <span className="text-emerald-600 text-lg">DAYS</span></p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card title="Mission Parameters" className="space-y-4">
          <div>
            <label className="text-xs text-neutral-500 uppercase mb-1 block">Top Goal</label>
            <Input 
              value={battleLog.topGoal} 
              onChange={e => updateField('topGoal', e.target.value)} 
              placeholder="What is the one thing?"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase mb-1 block">Essential Task</label>
            <Input 
              value={battleLog.essentialTask} 
              onChange={e => updateField('essentialTask', e.target.value)} 
              placeholder="Must do today..."
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 uppercase mb-1 block">Daily Rule</label>
            <Input 
              value={battleLog.dailyRule} 
              onChange={e => updateField('dailyRule', e.target.value)} 
              placeholder="e.g. No social media..."
            />
          </div>
        </Card>

        <Card title="Execution Status" className="flex flex-col justify-between">
          <div className="flex items-center justify-between bg-neutral-950 p-4 border border-neutral-800">
            <span className="uppercase font-bold text-sm text-neutral-300">Mission Complete?</span>
            <button 
              onClick={toggleComplete}
              className={`w-12 h-12 border flex items-center justify-center transition-all ${
                battleLog.completed 
                  ? 'bg-emerald-600 border-emerald-500 text-white' 
                  : 'bg-transparent border-neutral-700 text-transparent hover:border-emerald-500'
              }`}
            >
              ✓
            </button>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono uppercase text-emerald-500">A.I. Accountability</span>
              <Button onClick={handleAiRoast} disabled={loadingAi} className="text-xs py-1">
                {loadingAi ? 'Thinking...' : 'Report In'}
              </Button>
            </div>
            <div className="bg-neutral-950 p-4 border border-neutral-800 min-h-[100px] text-sm font-mono text-neutral-400">
              {battleLog.aiSummary || "No report generated. Are you afraid of the truth?"}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
