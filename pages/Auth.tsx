import React, { useState } from 'react';
import { Card, Button, Input } from '../components/UIComponents';
import { useAuth } from '../contexts/AuthContext';

export const Auth: React.FC = () => {
  const { login, loginWithPassword, register, loginWithGoogle } = useAuth();
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('LOGIN');
  const [loginMethod, setLoginMethod] = useState<'PASSWORD' | 'MAGIC_LINK'>('PASSWORD');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (authMode === 'REGISTER') {
        if (!password) { setError("Password required for registration"); setLoading(false); return; }
        await register(email, password);
      } else {
        // Login Mode
        if (loginMethod === 'MAGIC_LINK') {
            await login(email);
        } else {
            if (!password) { setError("Password required for login"); setLoading(false); return; }
            await loginWithPassword(email, password);
        }
      }
    } catch (err: any) {
      console.error("Auth failed", err);
      setError(err.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
      <Card className="w-full max-w-md bg-neutral-950 border-neutral-800">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black italic text-white mb-2">IRON<span className="text-emerald-500">MIND</span>.</h1>
          
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-900 text-red-200 text-xs font-mono text-center">
            {error}
          </div>
        )}

        <div className="flex justify-center mb-6 border-b border-neutral-800 pb-2">
            <button 
                onClick={() => setAuthMode('LOGIN')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${authMode === 'LOGIN' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
                Login
            </button>
            <button 
                onClick={() => setAuthMode('REGISTER')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider ${authMode === 'REGISTER' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-neutral-500 hover:text-neutral-300'}`}
            >
                Register
            </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            placeholder="Email Address" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)}
          />
          
          {(authMode === 'REGISTER' || loginMethod === 'PASSWORD') && (
             <Input 
                placeholder="Password" 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
              />
          )}

          <Button className="w-full py-4 mt-4" disabled={loading}>
            {loading ? 'Processing...' : (authMode === 'REGISTER' ? 'Create Account' : (loginMethod === 'MAGIC_LINK' ? 'Send Magic Link' : 'Login'))}
          </Button>
        </form>

        {authMode === 'LOGIN' && (
            <div className="mt-4 text-center">
                <button 
                    onClick={() => setLoginMethod(loginMethod === 'PASSWORD' ? 'MAGIC_LINK' : 'PASSWORD')}
                    className="text-[10px] text-neutral-500 hover:text-emerald-500 underline uppercase font-mono"
                >
                    {loginMethod === 'PASSWORD' ? 'Use Magic Link instead' : 'Use Password instead'}
                </button>
            </div>
        )}

        <div className="mt-8">
          <button 
            onClick={loginWithGoogle}
            className="w-full bg-white text-black py-3 font-bold uppercase text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27c3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12c0 5.05 4.13 10 10.22 10c5.35 0 9.25-3.67 9.25-9.09c0-1.15-.15-1.81-.15-1.81z"/></svg>
            Continue with Google
          </button>
        </div>

        
      </Card>
    </div>
  );
};
