import { supabase } from './supabase';
import { 
  User, 
  Habit, 
  BattleLog, 
  PillarData, 
  IdentityData, 
  RunLog, 
  PushupLog, 
  PullupLog 
} from '../types';
import { PILLARS_DEFAULT } from '../constants';

// Helper to get current user ID or throw error
const getUid = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");
  return user.id;
};

// --- User Profile ---
export const getUser = async (): Promise<User | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    // Fetch profile data
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return {
        id: user.id,
        email: user.email || '',
        name: user.email?.split('@')[0] || 'User',
        isPro: data?.is_pro || false,
        token: '', // Not needed for Supabase client usage
        emailVerified: !!user.email_confirmed_at
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
};

export const saveUser = async (user: User): Promise<void> => {
  // Profiles are usually auto-created on signup via trigger, but we can update
  await supabase
    .from('profiles')
    .update({ is_pro: user.isPro })
    .eq('id', user.id);
};

export const upgradeUser = async (): Promise<User | null> => {
  const uid = await getUid();
  await supabase
    .from('profiles')
    .update({ is_pro: true })
    .eq('id', uid);
  return getUser();
};

// --- Battle Log (Daily) ---
export const getBattleLog = async (): Promise<BattleLog> => {
  const uid = await getUid();
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_logs')
    .select('data')
    .eq('user_id', uid)
    .eq('date', today)
    .maybeSingle();

  if (data) {
    return data.data as BattleLog;
  }

  // Return default empty log if not found
  return {
    date: today,
    topGoal: '',
    essentialTask: '',
    dailyRule: '',
    completed: false,
    streak: 0,
    mood: 5,
    sleep: 7,
    notes: '',
    completedHabits: []
  };
};

export const saveBattleLog = async (log: BattleLog): Promise<void> => {
  const uid = await getUid();
  const today = new Date().toISOString().split('T')[0];
  const dateKey = log.date || today;

  await supabase
    .from('daily_logs')
    .upsert({ 
        user_id: uid, 
        date: dateKey, 
        data: log 
    }, { onConflict: 'user_id, date' });
};

export const getAllLogs = async (): Promise<BattleLog[]> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('daily_logs')
    .select('data')
    .eq('user_id', uid)
    .order('date', { ascending: false })
    .limit(30);
    
  return data?.map(d => d.data as BattleLog) || [];
};

// --- Habits ---
export const getHabits = async (): Promise<Habit[]> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('app_data')
    .select('data')
    .eq('user_id', uid)
    .eq('key', 'habits')
    .maybeSingle();

  if (data) {
    return data.data as Habit[];
  }
  return [];
};

export const saveHabits = async (habits: Habit[]): Promise<void> => {
  const uid = await getUid();
  await supabase
    .from('app_data')
    .upsert({ 
        user_id: uid, 
        key: 'habits', 
        data: habits 
    }, { onConflict: 'user_id, key' });
};

// --- Pillars ---
export const getPillars = async (): Promise<PillarData[]> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('app_data')
    .select('data')
    .eq('user_id', uid)
    .eq('key', 'pillars')
    .maybeSingle();

  if (data) {
    return data.data as PillarData[];
  }
  return PILLARS_DEFAULT;
};

export const savePillars = async (pillars: PillarData[]): Promise<void> => {
  const uid = await getUid();
  await supabase
    .from('app_data')
    .upsert({ 
        user_id: uid, 
        key: 'pillars', 
        data: pillars 
    }, { onConflict: 'user_id, key' });
};

// --- Identity ---
export const getIdentity = async (): Promise<IdentityData> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('app_data')
    .select('data')
    .eq('user_id', uid)
    .eq('key', 'identity')
    .maybeSingle();

  if (data) {
    return data.data as IdentityData;
  }
  return {
    values: [],
    goals: [],
    antiGoals: [],
    statement: '',
    map: []
  };
};

export const saveIdentity = async (data: IdentityData): Promise<void> => {
  const uid = await getUid();
  await supabase
    .from('app_data')
    .upsert({ 
        user_id: uid, 
        key: 'identity', 
        data: data 
    }, { onConflict: 'user_id, key' });
};

// --- Performance Logs (Runs, Pushups, Pullups) ---

export const getRunLogs = async (): Promise<RunLog[]> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('performance_logs')
    .select('data')
    .eq('user_id', uid)
    .eq('type', 'RUN')
    .order('date', { ascending: false })
    .limit(50);
    
  return data?.map(d => d.data as RunLog) || [];
};

export const saveRunLog = async (log: RunLog): Promise<void> => {
  const uid = await getUid();
  const id = log.id || Date.now().toString();
  
  await supabase
    .from('performance_logs')
    .upsert({
        user_id: uid,
        id: id,
        type: 'RUN',
        date: log.date,
        data: { ...log, id }
    }, { onConflict: 'user_id, id' });
};

export const getPushupLogs = async (): Promise<PushupLog[]> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('performance_logs')
    .select('data')
    .eq('user_id', uid)
    .eq('type', 'PUSHUP')
    .order('date', { ascending: false })
    .limit(50);
    
  return data?.map(d => d.data as PushupLog) || [];
};

export const savePushupLog = async (log: PushupLog): Promise<void> => {
  const uid = await getUid();
  const id = log.id || Date.now().toString();
  
  await supabase
    .from('performance_logs')
    .upsert({
        user_id: uid,
        id: id,
        type: 'PUSHUP',
        date: log.date,
        data: { ...log, id }
    }, { onConflict: 'user_id, id' });
};

export const getPullupLogs = async (): Promise<PullupLog[]> => {
  const uid = await getUid();
  const { data } = await supabase
    .from('performance_logs')
    .select('data')
    .eq('user_id', uid)
    .eq('type', 'PULLUP')
    .order('date', { ascending: false })
    .limit(50);
    
  return data?.map(d => d.data as PullupLog) || [];
};

export const savePullupLog = async (log: PullupLog): Promise<void> => {
  const uid = await getUid();
  const id = log.id || Date.now().toString();
  
  await supabase
    .from('performance_logs')
    .upsert({
        user_id: uid,
        id: id,
        type: 'PULLUP',
        date: log.date,
        data: { ...log, id }
    }, { onConflict: 'user_id, id' });
};
