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
import { Elements } from '@stripe/react-stripe-js';
import stripePromise from './services/stripe';
import { PaymentForm } from './components/PaymentForm';
import { supabase } from './services/supabase';

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
  const Paywall = () => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      const initializePayment = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
           try {
             const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.access_token}`
              },
              body: JSON.stringify({}), 
            });
            if (!res.ok) throw new Error('Failed to initialize payment');
            const data = await res.json();
            setClientSecret(data.clientSecret);
           } catch (err) {
             console.error("Payment init error:", err);
             // Optional: handle error state in UI
           }
        } else {
            // Handle case where session is missing (shouldn't happen if behind auth guard)
            console.error("No active session for payment");
        }
      };

      initializePayment();
    }, []);

    const appearance = {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#10b981',
        colorBackground: '#171717',
        colorText: '#ffffff',
      },
    };
    const options = {
      clientSecret,
      appearance,
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
        <div className="bg-neutral-900 border border-emerald-500 max-w-lg w-full p-8 text-center relative max-h-[90vh] overflow-y-auto">
          <button onClick={() => setShowPaywall(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">✕</button>
          <h2 className="text-3xl font-black italic text-white mb-2">GO <span className="text-emerald-500">PRO</span></h2>
          <p className="text-neutral-400 font-mono text-sm mb-6">UNLOCK UNLIMITED POTENTIAL. NO LIMITS.</p>
          
          {!clientSecret ? (
             <div className="text-white font-mono animate-pulse">Initializing Secure Payment...</div>
          ) : (
            <Elements options={options} stripe={stripePromise}>
              <PaymentForm onSuccess={async () => {
                  // Wait for webhook to update DB
                  // In a real app, we would listen to realtime changes or poll
                  // For now, we will just close the modal and let the user refresh or wait for the next session check
                  // Ideally: Show a "Confirming..." spinner here while polling profiles table
                  alert("Payment successful! Upgrading your account... (this may take a moment)");
                  setShowPaywall(false);
                  window.location.reload(); // Force reload to get new claims
              }} onCancel={() => setShowPaywall(false)} />
            </Elements>
          )}

          <div className="flex justify-center gap-4 mt-8 opacity-50">
            <span className="text-[10px] text-white">STRIPE</span>
            <span className="text-[10px] text-white">SSL SECURE</span>
          </div>
        </div>
      </div>
    );
  };

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
