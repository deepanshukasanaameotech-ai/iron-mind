import React, { useState } from 'react';
import { Card, Button, Input } from '../components/UIComponents';
import { generateBrutalAdvice } from '../services/aiService';
import { useData } from '../contexts/DataContext';

export const Identity: React.FC = () => {
  const { identity, updateIdentity, loading } = useData();
  const [newWeakness, setNewWeakness] = useState('');
  const [actionPlan, setActionPlan] = useState('');

  if (loading) return <div className="text-white">Loading Identity Map...</div>;

  const handleAddIdentity = async () => {
     if (!newWeakness) return;
     const newItem = {
       id: Date.now().toString(),
       weakness: newWeakness,
       strength: '...'
     };
     
     const currentMap = identity.map || [];
     const updatedMap = [...currentMap, newItem];
     
     // Update 1: Add new item
     await updateIdentity({ ...identity, map: updatedMap });
     setNewWeakness('');
     
     // Step 2: Generate Strength
     const strength = await generateBrutalAdvice(newWeakness, "Convert Weakness to Strength");
     const finalMap = updatedMap.map(i => i.id === newItem.id ? { ...i, strength } : i);
     
     // Update 2: Save strength
     await updateIdentity({ ...identity, map: finalMap });
  };

  const generatePlan = async () => {
    const map = identity.map || [];
    const context = map.map(i => `Weakness: ${i.weakness} -> Future: ${i.strength}`).join('; ');
    const plan = await generateBrutalAdvice(context, "Identity Transformation Action Plan");
    setActionPlan(plan);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
         <h2 className="text-3xl font-black uppercase text-white">Identity Map</h2>
         <Button onClick={generatePlan}>Generate Action Plan</Button>
      </div>

      <Card className="bg-neutral-950">
        <div className="flex gap-4">
          <Input 
            placeholder="Admit a weakness (e.g., I sleep in)" 
            value={newWeakness}
            onChange={e => setNewWeakness(e.target.value)}
          />
          <Button onClick={handleAddIdentity}>Confess</Button>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-neutral-500 uppercase tracking-widest text-xs mb-4">Current Weakness</h3>
          <div className="space-y-4">
            {(identity.map || []).map(i => (
              <div key={i.id} className="p-4 bg-red-900/10 border border-red-900/30 text-red-200 font-mono">
                {i.weakness}
              </div>
            ))}
          </div>
        </div>
        <div>
           <h3 className="text-emerald-500 uppercase tracking-widest text-xs mb-4">Future Strength</h3>
           <div className="space-y-4">
            {(identity.map || []).map(i => (
              <div key={i.id} className="p-4 bg-emerald-900/10 border border-emerald-900/30 text-emerald-200 font-mono">
                {i.strength === '...' ? <span className="animate-pulse">Analyzing...</span> : i.strength}
              </div>
            ))}
          </div>
        </div>
      </div>

      {actionPlan && (
        <Card title="The Path Forward" className="border-emerald-500 bg-neutral-900">
           <p className="font-mono text-sm leading-relaxed whitespace-pre-line">{actionPlan}</p>
        </Card>
      )}
    </div>
  );
};
