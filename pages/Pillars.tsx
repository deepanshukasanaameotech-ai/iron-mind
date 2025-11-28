import React, { useState } from 'react';
import { Card, Input, Button } from '../components/UIComponents';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { generateBrutalAdvice } from '../services/aiService';
import { useData } from '../contexts/DataContext';

export const Pillars: React.FC = () => {
  const { pillars, updatePillars, loading } = useData();
  const [aiAnalysis, setAiAnalysis] = useState('');

  if (loading) return <div className="text-white">Loading Pillars...</div>;

  const updateScore = async (idx: number, val: string) => {
    const newPillars = [...pillars];
    newPillars[idx] = { ...newPillars[idx], score: Math.min(100, Math.max(0, Number(val))) };
    await updatePillars(newPillars);
  };

  const getInsights = async () => {
    const context = pillars.map(p => `${p.name}: ${p.score}%`).join(', ');
    const res = await generateBrutalAdvice(context, "Life Balance Audit");
    setAiAnalysis(res);
  };

  const COLORS = ['#10B981', '#059669', '#34D399', '#064E3B', '#6EE7B7', '#047857'];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-3xl font-black uppercase text-white">Life Pillars</h2>
        <Card className="">
          <div className="w-full h-64 min-h-[256px]">
            <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pillars}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="score"
                stroke="none"
                label={({ name, score }) => `${name}: ${score}%`}
                labelLine={{ stroke: '#555', strokeWidth: 1 }}
              >
                {pillars.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#121212', borderColor: '#333' }}
                itemStyle={{ color: '#fff', fontFamily: 'monospace' }}
              />
            </PieChart>
          </ResponsiveContainer>
          </div>
        </Card>
        <Button onClick={getInsights} className="w-full">Audit My Life</Button>
        {aiAnalysis && (
          <div className="bg-neutral-900 border border-emerald-900 p-4 text-sm font-mono text-emerald-100">
             {aiAnalysis}
          </div>
        )}
      </div>

      <div className="space-y-4">
        {pillars.map((p, idx) => (
          <div key={p.name} className="flex items-center gap-4">
            <span className="w-32 text-sm font-bold text-neutral-400 uppercase">{p.name}</span>
            <div className="flex-1 bg-neutral-900 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-500 h-full transition-all duration-500" 
                style={{ width: `${p.score}%` }}
              />
            </div>
            <Input 
              type="number" 
              value={p.score} 
              onChange={(e) => updateScore(idx, e.target.value)}
              className="w-20 text-center"
            />
            <span className="text-neutral-600 font-mono">%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
