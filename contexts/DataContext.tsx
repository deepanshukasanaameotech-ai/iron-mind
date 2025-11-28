import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { BattleLog, Habit, PillarData, IdentityData, RunLog, PushupLog, PullupLog } from '../types';
import * as dataService from '../services/dataService';
import { useAuth } from './AuthContext';

interface DataContextType {
  battleLog: BattleLog | null;
  habits: Habit[];
  pillars: PillarData[];
  identity: IdentityData;
  runs: RunLog[];
  pushups: PushupLog[];
  pullups: PullupLog[];
  loading: boolean;
  refreshData: () => Promise<void>;
  updateBattleLog: (log: BattleLog) => Promise<void>;
  updateHabits: (habits: Habit[]) => Promise<void>;
  updatePillars: (pillars: PillarData[]) => Promise<void>;
  updateIdentity: (data: IdentityData) => Promise<void>;
  addRun: (run: RunLog) => Promise<void>;
  addPushup: (log: PushupLog) => Promise<void>;
  addPullup: (log: PullupLog) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [battleLog, setBattleLog] = useState<BattleLog | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [pillars, setPillars] = useState<PillarData[]>([]);
  const [identity, setIdentity] = useState<IdentityData>({ values: [], goals: [], antiGoals: [], statement: '', map: [] });
  const [runs, setRuns] = useState<RunLog[]>([]);
  const [pushups, setPushups] = useState<PushupLog[]>([]);
  const [pullups, setPullups] = useState<PullupLog[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshData = async () => {
    if (!user || !user.emailVerified) return;
    setLoading(true);
    try {
      const [b, h, p, i, r, pu, pl] = await Promise.all([
        dataService.getBattleLog(),
        dataService.getHabits(),
        dataService.getPillars(),
        dataService.getIdentity(),
        dataService.getRunLogs(),
        dataService.getPushupLogs(),
        dataService.getPullupLogs()
      ]);
      setBattleLog(b);
      setHabits(h);
      setPillars(p);
      setIdentity(i);
      setRuns(r);
      setPushups(pu);
      setPullups(pl);
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.emailVerified) {
      refreshData();
    } else {
      // Reset data on logout
      setBattleLog(null);
      setHabits([]);
      setPillars([]);
      setIdentity({ values: [], goals: [], antiGoals: [], statement: '', map: [] });
      setRuns([]);
      setPushups([]);
      setPullups([]);
    }
  }, [user]);

  const updateBattleLog = async (log: BattleLog) => {
    await dataService.saveBattleLog(log);
    setBattleLog(log);
  };

  const updateHabits = async (newHabits: Habit[]) => {
    await dataService.saveHabits(newHabits);
    setHabits(newHabits);
  };

  const updatePillars = async (newPillars: PillarData[]) => {
    await dataService.savePillars(newPillars);
    setPillars(newPillars);
  };

  const updateIdentity = async (data: IdentityData) => {
    await dataService.saveIdentity(data);
    setIdentity(data);
  };

  const addRun = async (run: RunLog) => {
    await dataService.saveRunLog(run);
    setRuns(prev => [...prev, run]);
  };

  const addPushup = async (log: PushupLog) => {
    await dataService.savePushupLog(log);
    // Optimistic update or re-fetch? Let's re-fetch for simplicity or implement smart merge locally
    // For now, simple re-fetch of that specific list to ensure consistency
    const logs = await dataService.getPushupLogs();
    setPushups(logs);
  };

  const addPullup = async (log: PullupLog) => {
    await dataService.savePullupLog(log);
    const logs = await dataService.getPullupLogs();
    setPullups(logs);
  };

  return (
    <DataContext.Provider value={{
      battleLog, habits, pillars, identity, runs, pushups, pullups,
      loading, refreshData,
      updateBattleLog, updateHabits, updatePillars, updateIdentity,
      addRun, addPushup, addPullup
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
