import React, { useState } from 'react';
import { Screen, User } from '../types';
import { Button } from './UIComponents';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: Screen;
  setScreen: (s: Screen) => void;
  user: User | null;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, setScreen, user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ screen, label, icon }: { screen: Screen; label: string; icon: string }) => (
    <button
      onClick={() => { setScreen(screen); setMobileMenuOpen(false); }}
      className={`w-full text-left p-3 font-mono text-sm uppercase tracking-widest transition-all border-l-2 ${
        currentScreen === screen 
          ? 'border-emerald-500 text-emerald-500 bg-emerald-900/10' 
          : 'border-transparent text-neutral-500 hover:text-neutral-300'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-charcoal text-neutral-300 flex flex-col md:flex-row font-sans selection:bg-emerald-500 selection:text-black">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-neutral-950 border-r border-neutral-900 fixed h-full z-20">
        <div className="p-6 border-b border-neutral-900">
          <h1 className="text-2xl font-black italic tracking-tighter text-white">IRON<span className="text-emerald-500">MIND</span>.</h1>
          <p className="text-[10px] text-neutral-600 mt-1 uppercase font-mono">No Excuses. No Limits.</p>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <NavItem screen="DASHBOARD" label="Battle Log" icon="⚔️" />
          <NavItem screen="HABITS" label="Discipline Lab" icon="⛓️" />
          <NavItem screen="PILLARS" label="Life Pillars" icon="🏛️" />
          <NavItem screen="IDENTITY" label="Identity Map" icon="🆔" />
          <NavItem screen="PERFORMANCE" label="Performance" icon="📈" />
          <NavItem screen="FOCUS" label="Deep Work" icon="⏱️" />
          <NavItem screen="WISDOM" label="Daily Wisdom" icon="📜" />
        </nav>

        <div className="p-4 border-t border-neutral-900">
           {user ? (
             <div className="space-y-2">
               <div className="text-xs font-mono text-neutral-500 truncate">{user.email}</div>
               {user.isPro && <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1">PRO OPERATOR</span>}
               <Button variant="outline" onClick={onLogout} className="w-full text-xs">Disengage</Button>
             </div>
           ) : (
             <Button onClick={() => setScreen('AUTH')} className="w-full">Initialize</Button>
           )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-neutral-950 border-b border-neutral-900 sticky top-0 z-30">
        <span className="font-black italic text-white">IRON<span className="text-emerald-500">MIND</span></span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-neutral-400">
          {mobileMenuOpen ? '✖' : '☰'}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-20 bg-neutral-950 pt-16">
          <nav className="flex flex-col space-y-2 p-4">
             <NavItem screen="DASHBOARD" label="Battle Log" icon="⚔️" />
             <NavItem screen="HABITS" label="Discipline Lab" icon="⛓️" />
             <NavItem screen="PILLARS" label="Life Pillars" icon="🏛️" />
             <NavItem screen="PERFORMANCE" label="Performance" icon="📈" />
             <NavItem screen="FOCUS" label="Deep Work" icon="⏱️" />
             <NavItem screen="WISDOM" label="Daily Wisdom" icon="📜" />
             <div className="h-px bg-neutral-900 my-4" />
             <Button variant="outline" onClick={onLogout}>Logout</Button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
};
