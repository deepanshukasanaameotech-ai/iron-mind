import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Habits } from './pages/Habits';
import { Pillars } from './pages/Pillars';
import { Identity } from './pages/Identity';
import { Performance } from './pages/Performance';
import { Focus } from './pages/Focus';
import { Auth } from './pages/Auth';
import { Screen } from './types';
import { Button } from './components/UIComponents';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

function AppContent() {
  const [screen, setScreen] = useState<Screen>('DASHBOARD');
  const [showPaywall, setShowPaywall] = useState(false);
  const { user, logout, upgrade, loading } = useAuth();

  // Redirect to Auth if not logged in
  useEffect(() => {
    if (!loading && !user) {
      setScreen('AUTH');
    } else if (user && screen === 'AUTH') {
      setScreen('DASHBOARD');
    }
  }, [user, loading, screen]);

  const handleLogout = async () => {
    await logout();
    setScreen('AUTH');
  };

  const handleUpgrade = async () => {
    // Simulate secure payment gateway
    alert("Simulating Stripe Checkout...");
    await upgrade();
    setShowPaywall(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading Iron Mind...</div>;
  }

  if (!user) {
    return <Auth />;
  }

  if (!user.emailVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-charcoal p-4">
        <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-4">VERIFY YOUR EMAIL</h2>
          <p className="text-neutral-400 mb-6 text-sm font-mono">
            Access restricted. Verification required to prevent unauthorized storage usage.
          </p>
          <div className="p-4 bg-emerald-900/10 border border-emerald-900/30 text-emerald-200 font-mono text-xs mb-6">
            Link sent to: {user.email}
          </div>
          <div className="space-y-4">
             <Button onClick={() => window.location.reload()} className="w-full">
               I Verified It
             </Button>
             <button onClick={logout} className="text-neutral-500 text-xs hover:text-white underline">
               Logout
             </button>
          </div>
        </div>
      </div>
    );
  }

  // Paywall Modal Overlay
  const Paywall = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-neutral-900 border border-emerald-500 max-w-lg w-full p-8 text-center relative">
        <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">✕</button>
        <h2 className="text-3xl font-black italic text-white mb-2">GO <span className="text-emerald-500">PRO</span></h2>
        <p className="text-neutral-400 font-mono text-sm mb-6">UNLOCK UNLIMITED POTENTIAL. NO LIMITS.</p>
        <ul className="text-left text-sm space-y-2 mb-8 text-neutral-300 font-mono mx-auto max-w-xs">
          <li>✓ Unlimited Habits</li>
          <li>✓ Deep Analytics</li>
          <li>✓ Cloud Sync</li>
          <li>✓ Full AI Coaching</li>
        </ul>
        <Button onClick={handleUpgrade} className="w-full">Upgrade - $9.99/mo</Button>
        <div className="flex justify-center gap-4 mt-4 opacity-50">
          <span className="text-[10px] text-white">STRIPE</span>
          <span className="text-[10px] text-white">SSL SECURE</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Layout currentScreen={screen} setScreen={setScreen} user={user} onLogout={handleLogout}>
        {screen === 'DASHBOARD' && <Dashboard />}
        {screen === 'HABITS' && <Habits />}
        {screen === 'PILLARS' && <Pillars />}
        {screen === 'IDENTITY' && <Identity />}
        {screen === 'PERFORMANCE' && <Performance />}
        {screen === 'FOCUS' && <Focus />}
        
        {/* Simple Pro Trigger for Demo */}
        {!user?.isPro && screen !== 'AUTH' && (
          <div className="mt-12 border-t border-neutral-800 pt-6 text-center">
            <p className="text-xs text-neutral-500 mb-2">RUNNING ON FREE TIER.</p>
            <button onClick={() => setShowPaywall(true)} className="text-emerald-500 text-xs font-bold uppercase underline">
              Upgrade to Pro
            </button>
          </div>
        )}
      </Layout>
      {showPaywall && <Paywall />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}
