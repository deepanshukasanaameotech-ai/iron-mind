import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { supabase } from '../services/supabase';
import * as dataService from '../services/dataService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>; // Magic Link
  loginWithPassword: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>; // Not really needed if using Magic Link, but good for password flow
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  upgrade: () => Promise<void>;
  sendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapUser(session.user).then(setUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        mapUser(session.user).then(setUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapUser = async (sbUser: any): Promise<User> => {
    const appUser: User = {
      id: sbUser.id,
      name: sbUser.email?.split('@')[0] || 'User',
      email: sbUser.email || '',
      isPro: false,
      token: sbUser.access_token || '', // Supabase session token
      emailVerified: !!sbUser.email_confirmed_at // Check if confirmed
    };

    // Check Pro status from 'profiles' table
    if (appUser.emailVerified) {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('is_pro')
                .eq('id', appUser.id)
                .single();
            
            if (data && data.is_pro) {
                appUser.isPro = true;
            }
        } catch (e) {
            console.error("Error fetching profile", e);
        }
    }
    return appUser;
  };

  const login = async (email: string) => {
    // Magic Link Login
    const redirectUrl = window.location.origin + import.meta.env.BASE_URL;
    const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
            emailRedirectTo: redirectUrl
        }
    });
    if (error) throw error;
    alert("Check your email for the login link!");
  };

  const loginWithPassword = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };
  
  const register = async (email: string, password: string) => {
      // Check if user exists (optional, but requested behavior implies we should try to avoid sending link if exists)
      // Note: Supabase security often hides existence. We will try to signUp.
      // If we want to strictly "tell user and not send link", we'd need a way to check.
      // For now, we rely on signUp. If it fails (e.g. rate limit or config), we catch it.
      // However, to strictly "not send link" if exists, we might need to rely on the fact that 
      // if they exist, signUp might return a specific response or we should just use signIn.
      
      const redirectUrl = window.location.origin + import.meta.env.BASE_URL;
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
          if (error.message.includes("already registered") || error.status === 400) {
              throw new Error("User already exists. Please login.");
          }
          throw error;
      }
      
      // If data.user is defined but identities is empty, it means the user exists (Supabase security feature)
      if (data.user && data.user.identities && data.user.identities.length === 0) {
          throw new Error("User already exists. Please login.");
      }

      alert("Check your email to verify your account!");
  };

  const loginWithGoogle = async () => {
    const redirectUrl = window.location.origin + import.meta.env.BASE_URL;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    });
    if (error) throw error;
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const upgrade = async () => {
    if (user) {
      const updatedUser = { ...user, isPro: true };
      setUser(updatedUser);
      // Update 'profiles' table
      await supabase.from('profiles').update({ is_pro: true }).eq('id', user.id);
    }
  };

  const sendVerification = async () => {
    // Supabase handles this automatically on signup usually.
    // But we can resend if needed?
    // supabase.auth.resend({ type: 'signup', email: user.email })
    if (user?.email) {
        await supabase.auth.resend({ type: 'signup', email: user.email });
        alert("Verification email resent!");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithPassword, register, loginWithGoogle, logout, upgrade, sendVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
