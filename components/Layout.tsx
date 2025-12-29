
import React from 'react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
  onNavigate?: (page: string) => void;
  activeState?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, onNavigate, activeState }) => {
  const isNavVisible = ['WELCOME', 'RESULT', 'FEEDBACK_DONE', 'FEEDBACK_LIGHTER', 'NOTES', 'MOMENTS'].includes(activeState || '');

  return (
    <div className="min-h-screen flex flex-col text-slate-800 dark:text-slate-200">
      <header className="px-6 py-4 flex items-center justify-between glass sticky top-0 z-50 shadow-sm transition-all duration-500">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate?.('WELCOME')}
        >
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-400 to-purple-400 dark:from-indigo-600 dark:to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 dark:shadow-none transition-transform group-hover:scale-110">
            <span className="text-xl">✨</span>
          </div>
          <h1 className="text-xl font-bold font-display text-indigo-900 dark:text-indigo-100 tracking-tight">Serene Step</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {isNavVisible && (
            <nav className="hidden md:flex items-center gap-2 mr-4 bg-white/20 dark:bg-slate-900/20 p-1 rounded-full border border-white/30 dark:border-slate-800/30">
              <button 
                onClick={() => onNavigate?.('WELCOME')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeState === 'WELCOME' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'hover:bg-white/40 text-slate-600 dark:text-slate-300'}`}
              >
                Journey
              </button>
              <button 
                onClick={() => onNavigate?.('NOTES')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeState === 'NOTES' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'hover:bg-white/40 text-slate-600 dark:text-slate-300'}`}
              >
                Notes
              </button>
              <button 
                onClick={() => onNavigate?.('MOMENTS')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeState === 'MOMENTS' ? 'bg-white dark:bg-slate-800 shadow-sm text-indigo-600' : 'hover:bg-white/40 text-slate-600 dark:text-slate-300'}`}
              >
                Moments
              </button>
            </nav>
          )}
          <ThemeToggle />
        </div>
      </header>
      
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-8 flex flex-col">
        {children}
      </main>

      {/* Mobile Nav */}
      {isNavVisible && (
        <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-full flex gap-8 z-50 shadow-2xl">
          <button onClick={() => onNavigate?.('WELCOME')} className={`text-xl ${activeState === 'WELCOME' ? 'text-indigo-600 scale-125' : 'text-slate-400'}`}>🗺️</button>
          <button onClick={() => onNavigate?.('NOTES')} className={`text-xl ${activeState === 'NOTES' ? 'text-indigo-600 scale-125' : 'text-slate-400'}`}>📝</button>
          <button onClick={() => onNavigate?.('MOMENTS')} className={`text-xl ${activeState === 'MOMENTS' ? 'text-indigo-600 scale-125' : 'text-slate-400'}`}>🌸</button>
        </nav>
      )}
      
      <footer className="p-8 text-center text-[10px] text-indigo-400 dark:text-slate-500 font-bold tracking-[0.3em] uppercase opacity-60">
        Recovery is a journey, not a race
      </footer>
    </div>
  );
};

export default Layout;
