
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { AppState, StudentInput, WellnessResponse, GUIDES, EnergyLevel, TaskPreference, Note, Moment } from './types';
import { getWellnessGuidance } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [formData, setFormData] = useState<StudentInput>({
    guide: 'Capybara',
    mentalState: '',
    description: '',
    fieldOfStudy: '',
    energyLevel: 'medium',
    taskPreference: 'skip',
  });
  const [response, setResponse] = useState<WellnessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Persistence states
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('serene-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [moments, setMoments] = useState<Moment[]>(() => {
    const saved = localStorage.getItem('serene-moments');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentNote, setCurrentNote] = useState('');

  useEffect(() => {
    localStorage.setItem('serene-notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('serene-moments', JSON.stringify(moments));
  }, [moments]);

  const activeGuide = GUIDES.find(g => g.type === formData.guide);

  const handleFinalSubmit = async () => {
    setAppState(AppState.LOADING);
    setError(null);
    try {
      const result = await getWellnessGuidance(formData);
      setResponse(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      setError("I had a little trouble connecting. Let's try once more?");
      setAppState(AppState.STEP_PREFERENCE);
    }
  };

  const handleTaskDone = () => {
    if (response) {
      const newMoment: Moment = {
        id: Date.now().toString(),
        task: response.smallTask,
        timestamp: new Date().toLocaleString(),
        guideIcon: activeGuide?.icon || '✨',
        guideName: activeGuide?.name || 'Friend'
      };
      setMoments([newMoment, ...moments]);
      setAppState(AppState.FEEDBACK_DONE);
    }
  };

  const handleLighterTask = () => {
    setAppState(AppState.FEEDBACK_LIGHTER);
  };

  const addNote = () => {
    if (!currentNote.trim()) return;
    const newNote: Note = {
      id: Date.now().toString(),
      text: currentNote,
      timestamp: new Date().toLocaleString()
    };
    setNotes([newNote, ...notes]);
    setCurrentNote('');
  };

  const StepCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode; onNext?: () => void; nextLabel?: string; canSkip?: boolean; onSkip?: () => void }> = ({ title, subtitle, children, onNext, nextLabel = "Continue", canSkip, onSkip }) => (
    <div className="fade-in space-y-6 w-full max-w-xl mx-auto">
      <div className="space-y-1 text-center">
        <h2 className="text-3xl font-bold font-display text-indigo-950 dark:text-indigo-50">{title}</h2>
        {subtitle && <p className="text-indigo-600/80 dark:text-indigo-400 font-medium italic text-sm">{subtitle}</p>}
      </div>
      <div className="glass p-8 rounded-[2rem] shadow-xl space-y-6 card-lift">
        {children}
        <div className="flex flex-col gap-3 pt-4">
          {onNext && (
            <button
              onClick={onNext}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:opacity-90 transition-all transform active:scale-[0.98]"
            >
              {nextLabel}
            </button>
          )}
          {canSkip && onSkip && (
            <button
              onClick={onSkip}
              className="w-full py-2 text-slate-400 dark:text-slate-500 hover:text-indigo-500 transition-colors text-xs font-bold uppercase tracking-widest"
            >
              Skip this part
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Layout activeState={appState} onNavigate={(s) => setAppState(s as AppState)}>
      {appState === AppState.WELCOME && (
        <div className="fade-in text-center space-y-12 py-12 flex flex-col items-center">
          <div className="space-y-4">
            <h2 className="text-6xl font-bold font-display text-indigo-950 dark:text-indigo-50 tracking-tighter leading-none">
              Serene <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-400">Step</span>
            </h2>
            <p className="text-lg text-indigo-900/60 dark:text-slate-300 font-medium max-w-sm mx-auto leading-relaxed italic">
              A private, peaceful corner of the world designed to help you breathe when studies feel heavy.
            </p>
          </div>
          <button
            onClick={() => setAppState(AppState.CHOOSE_GUIDE)}
            className="group relative px-16 py-6 bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-full font-bold shadow-2xl transition-all hover:shadow-indigo-300/30 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 text-xl">Let's Begin <span className="group-hover:translate-x-1 transition-transform">→</span></span>
            <div className="absolute inset-0 bg-indigo-50 dark:bg-slate-800 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
        </div>
      )}

      {appState === AppState.CHOOSE_GUIDE && (
        <StepCard title="Select a Guide" subtitle="A friendly face for your journey.">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {GUIDES.map((g) => (
              <button
                key={g.type}
                onClick={() => {
                  setFormData({ ...formData, guide: g.type });
                  setAppState(AppState.STEP_FEELING);
                }}
                className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all group card-lift ${
                  formData.guide === g.type
                    ? 'bg-indigo-100/50 dark:bg-indigo-900/30 border-indigo-400 shadow-inner shadow-indigo-200/50'
                    : 'bg-white/40 dark:bg-slate-800 border-transparent hover:border-indigo-200'
                }`}
              >
                <span className="text-5xl mb-2 group-hover:scale-125 transition-transform duration-500">{g.icon}</span>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tighter">{g.name}</span>
                <span className="text-[10px] text-indigo-400 dark:text-indigo-300 text-center leading-tight mt-1 opacity-80 italic">
                  {g.personality}
                </span>
              </button>
            ))}
          </div>
        </StepCard>
      )}

      {/* Step Feeling, Description, Field, Energy, Preference remain logically similar but with refined card styles */}
      {appState === AppState.STEP_FEELING && (
        <StepCard title="How's your mood?">
          <div className="flex justify-center mb-4">
             <div className="w-24 h-24 bg-white/60 dark:bg-slate-800 rounded-full flex items-center justify-center text-5xl shadow-xl shadow-indigo-100/30 dark:shadow-none">
               {activeGuide?.icon}
             </div>
          </div>
          <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">"{activeGuide?.name} is listening. What's on your mind?"</p>
          <div className="grid grid-cols-2 gap-3">
            {['Burned out', 'Stressed', 'Anxious', 'Overwhelmed', 'Tired'].map(f => (
              <button
                key={f}
                onClick={() => {
                  setFormData({ ...formData, mentalState: f });
                  setAppState(AppState.STEP_DESCRIPTION);
                }}
                className="py-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-indigo-300 hover:bg-white dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold transition-all shadow-sm"
              >
                {f}
              </button>
            ))}
            <input 
              placeholder="Other..."
              className="px-4 py-3 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-transparent focus:border-indigo-300 outline-none text-center font-medium placeholder:text-slate-400"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                   setFormData({ ...formData, mentalState: (e.target as HTMLInputElement).value });
                   setAppState(AppState.STEP_DESCRIPTION);
                }
              }}
            />
          </div>
        </StepCard>
      )}

      {appState === AppState.STEP_DESCRIPTION && (
        <StepCard title="Deep Dive" subtitle="Share whatever is on your heart.">
          <textarea
            autoFocus
            rows={5}
            placeholder="Type here..."
            className="w-full px-6 py-5 bg-white/40 dark:bg-slate-800/40 border border-transparent focus:border-indigo-300 rounded-[2rem] transition-all outline-none resize-none text-slate-700 dark:text-slate-200"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex gap-4">
            <button
              onClick={() => setAppState(AppState.STEP_FIELD)}
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200/50 dark:shadow-none"
            >
              Continue
            </button>
          </div>
          <button onClick={() => setAppState(AppState.STEP_FIELD)} className="text-xs text-slate-400 font-bold uppercase tracking-widest text-center block w-full">I'd rather not say</button>
        </StepCard>
      )}

      {appState === AppState.STEP_FIELD && (
        <StepCard title="Field of Study" subtitle="This helps me relate to your growth.">
          <div className="grid grid-cols-2 gap-3">
            {['Medicine', 'Tech', 'Arts', 'Law', 'STEM', 'Humans'].map(field => (
              <button
                key={field}
                onClick={() => {
                  setFormData({ ...formData, fieldOfStudy: field });
                  setAppState(AppState.STEP_ENERGY);
                }}
                className="py-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-transparent hover:border-pink-300 text-slate-700 dark:text-slate-200 font-semibold transition-all shadow-sm"
              >
                {field}
              </button>
            ))}
          </div>
          <input
            placeholder="Or type your specific field..."
            className="w-full px-6 py-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-transparent focus:border-pink-300 outline-none transition-all text-center"
            value={formData.fieldOfStudy}
            onChange={(e) => setFormData({ ...formData, fieldOfStudy: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setAppState(AppState.STEP_ENERGY);
            }}
          />
        </StepCard>
      )}

      {appState === AppState.STEP_ENERGY && (
        <StepCard title="Internal Battery">
          <div className="grid grid-cols-3 gap-4">
            {(['low', 'medium', 'high'] as EnergyLevel[]).map((level) => {
              const icons = { low: '🕯️', medium: '🌱', high: '☀️' };
              const colors = { low: 'from-orange-50 to-orange-100 text-orange-600', medium: 'from-green-50 to-green-100 text-green-600', high: 'from-yellow-50 to-yellow-100 text-yellow-600' };
              return (
                <button
                  key={level}
                  onClick={() => {
                    setFormData({ ...formData, energyLevel: level });
                    setAppState(AppState.STEP_PREFERENCE);
                  }}
                  className={`flex flex-col items-center p-6 rounded-[2rem] border-2 transition-all card-lift ${
                    formData.energyLevel === level ? 'border-indigo-400 bg-white/80 dark:bg-slate-800' : 'border-transparent bg-white/30 dark:bg-slate-800/30'
                  }`}
                >
                  <span className={`text-4xl p-4 rounded-3xl mb-2 bg-gradient-to-br shadow-inner ${colors[level]}`}>{icons[level]}</span>
                  <span className="font-bold capitalize dark:text-slate-300">{level}</span>
                </button>
              );
            })}
          </div>
        </StepCard>
      )}

      {appState === AppState.STEP_PREFERENCE && (
        <StepCard title="Recovery Path" subtitle="What feels doable right now?" onNext={handleFinalSubmit} nextLabel="Show Guidance">
          <div className="grid grid-cols-2 gap-3">
            {(['creative/art', 'movement', 'reflection', 'focus'] as TaskPreference[]).map(p => (
              <button
                key={p}
                onClick={() => setFormData({ ...formData, taskPreference: p })}
                className={`py-4 rounded-2xl font-bold border-2 transition-all capitalize shadow-sm ${
                  formData.taskPreference === p ? 'bg-indigo-50/80 dark:bg-indigo-900/40 border-indigo-400 text-indigo-700 dark:text-indigo-200' : 'bg-white/40 dark:bg-slate-800/40 border-transparent text-slate-500'
                }`}
              >
                {p.replace('/', ' & ')}
              </button>
            ))}
          </div>
          <input
            placeholder="Something else?"
            className="w-full px-4 py-3 bg-white/40 dark:bg-slate-800/40 rounded-2xl border border-transparent focus:border-indigo-400 outline-none text-center"
            onChange={(e) => setFormData({ ...formData, taskPreference: e.target.value })}
          />
        </StepCard>
      )}

      {appState === AppState.LOADING && (
        <div className="fade-in flex flex-col items-center justify-center py-24 space-y-12">
          <div className="relative">
             <div className="w-40 h-40 border-4 border-indigo-100 dark:border-slate-800 border-t-pink-400 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-7xl animate-pulse">
                {activeGuide?.icon}
             </div>
          </div>
          <div className="text-center space-y-3">
            <h3 className="text-3xl font-bold font-display text-indigo-900 dark:text-indigo-50">Checking in with {activeGuide?.name}...</h3>
            <p className="text-indigo-400 dark:text-indigo-300 font-bold uppercase tracking-[0.2em] text-xs">Preparing a peaceful space</p>
          </div>
        </div>
      )}

      {appState === AppState.RESULT && response && (
        <div className="fade-in space-y-10 pb-24">
          <div className="relative pt-16">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 glass p-6 rounded-full shadow-2xl z-10 border-indigo-100 dark:border-indigo-900">
              <span className="text-7xl">{activeGuide?.icon}</span>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-700 text-white p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
               <div className="relative z-10 text-center space-y-4">
                 <h3 className="text-indigo-100 text-xs font-black uppercase tracking-[0.4em]">{activeGuide?.name}'s Thought</h3>
                 <p className="text-2xl font-display italic leading-relaxed font-light drop-shadow-md">"{response.validation}"</p>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass p-8 rounded-[2.5rem] space-y-4 shadow-xl card-lift">
              <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-black uppercase text-xs tracking-widest">
                <span className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl text-xl">🌱</span>
                Perspective
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{response.growthInsight}</p>
            </div>
            
            <div className="glass p-8 rounded-[2.5rem] space-y-4 shadow-xl card-lift border-indigo-200 dark:border-indigo-900">
              <div className="flex items-center gap-3 text-pink-600 dark:text-pink-400 font-black uppercase text-xs tracking-widest">
                <span className="p-2 bg-pink-50 dark:bg-pink-900/30 rounded-xl text-xl">📍</span>
                Your Step
              </div>
              <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-bold">{response.smallTask}</p>
            </div>
          </div>

          <div className="glass p-10 rounded-[3rem] shadow-2xl space-y-5 border-emerald-100 dark:border-emerald-950">
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 font-black uppercase text-xs tracking-widest">
              <span className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl text-xl">🌊</span>
              Recovery Flow
            </div>
            <p className="text-slate-800 dark:text-slate-100 text-xl leading-relaxed font-semibold italic">"{response.recoveryAction}"</p>
          </div>

          <div className="text-center space-y-12 py-8 glass rounded-[4rem]">
             <div className="space-y-4 px-8">
               <p className="text-indigo-900/70 dark:text-indigo-200 text-lg italic leading-relaxed">"{response.encouragingNote}"</p>
               <div className="flex flex-col items-center">
                 <div className="w-10 h-1 bg-indigo-100 dark:bg-slate-800 rounded-full mb-2"></div>
                 <p className="text-indigo-500 font-black font-display uppercase tracking-widest text-sm">— {activeGuide?.name}</p>
               </div>
             </div>
             
             <div className="pt-8 border-t border-indigo-100 dark:border-slate-800 space-y-8 px-8">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">{response.guideComment}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <button 
                    onClick={handleTaskDone}
                    className="flex-1 px-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    ✨ I did this
                  </button>
                  <button 
                    onClick={handleLighterTask}
                    className="flex-1 px-10 py-5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-300 border border-indigo-100 dark:border-slate-700 rounded-[2rem] font-bold hover:bg-indigo-50 transition-all card-lift"
                  >
                    I couldn't do this
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {appState === AppState.FEEDBACK_DONE && (
        <div className="fade-in flex flex-col items-center justify-center py-24 text-center space-y-12">
          <div className="relative">
            <div className="w-48 h-48 bg-white/40 dark:bg-slate-900 rounded-[4rem] flex items-center justify-center text-8xl shadow-2xl animate-pulse glass">
               {activeGuide?.icon}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-5 rounded-full text-3xl shadow-lg">✓</div>
          </div>
          <div className="space-y-6 max-w-sm">
            <h3 className="text-4xl font-bold font-display text-indigo-950 dark:text-indigo-50 tracking-tighter">Beautifully Done.</h3>
            <p className="text-indigo-900/60 dark:text-slate-400 leading-relaxed font-medium italic">
              "That small step means everything. I'm so proud of you for trying. I've added this to your Moments so we don't forget it."
            </p>
          </div>
          <div className="flex flex-col gap-4 w-full">
            <button
              onClick={() => setAppState(AppState.WELCOME)}
              className="px-12 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-bold shadow-2xl hover:scale-105 transition-all text-lg"
            >
              Back to Start
            </button>
            <button onClick={() => setAppState(AppState.MOMENTS)} className="text-indigo-500 font-bold text-sm underline underline-offset-4">See my moments</button>
          </div>
        </div>
      )}

      {appState === AppState.FEEDBACK_LIGHTER && (
        <div className="fade-in space-y-10 py-12">
          <div className="text-center space-y-4">
             <span className="text-6xl">{activeGuide?.icon}</span>
             <h3 className="text-3xl font-bold font-display text-indigo-950 dark:text-indigo-50">No worries at all.</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
               "Sometimes even the small steps feel like mountains. Let's try something even gentler."
             </p>
          </div>
          
          <div className="glass p-12 rounded-[3rem] text-center space-y-6 shadow-2xl border-indigo-200 dark:border-indigo-900">
             <div className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">Lighter Path</div>
             <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{response?.lighterTask}</p>
             <button
                onClick={handleTaskDone}
                className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-bold shadow-xl hover:scale-105 transition-all"
              >
                I'll try this instead
             </button>
          </div>
        </div>
      )}

      {appState === AppState.NOTES && (
        <div className="fade-in space-y-10 py-6">
          <div className="text-center space-y-1">
             <h2 className="text-4xl font-bold font-display text-indigo-950 dark:text-indigo-50 tracking-tighter">Notes</h2>
             <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">A private space for your thoughts</p>
          </div>
          
          <div className="glass p-6 rounded-[2.5rem] shadow-xl space-y-4 border-indigo-100 dark:border-indigo-900/30">
             <textarea
               value={currentNote}
               onChange={(e) => setCurrentNote(e.target.value)}
               placeholder="Write anything... there is no evaluation here."
               className="w-full h-40 bg-white/20 dark:bg-slate-800/20 rounded-2xl p-6 outline-none resize-none text-slate-700 dark:text-slate-200 placeholder:italic"
             />
             <button
               onClick={addNote}
               className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
             >
               Save Note <span>✨</span>
             </button>
          </div>

          <div className="space-y-4">
            {notes.length === 0 ? (
               <div className="text-center py-20 text-slate-400 italic font-light">Your canvas is waiting...</div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="glass p-8 rounded-3xl shadow-sm space-y-3 relative group">
                  <div className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">{note.timestamp}</div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{note.text}</p>
                  <button 
                    onClick={() => setNotes(notes.filter(n => n.id !== note.id))}
                    className="absolute top-6 right-6 text-slate-300 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {appState === AppState.MOMENTS && (
        <div className="fade-in space-y-10 py-6">
          <div className="text-center space-y-1">
             <h2 className="text-4xl font-bold font-display text-indigo-950 dark:text-indigo-50 tracking-tighter">Moments</h2>
             <p className="text-indigo-400 text-sm font-bold uppercase tracking-widest">Your journey of recovery</p>
          </div>

          <div className="grid grid-cols-1 gap-6 pb-12">
             {moments.length === 0 ? (
                <div className="text-center py-24 glass rounded-[3rem]">
                   <span className="text-6xl mb-6 block opacity-20">🌸</span>
                   <p className="text-slate-400 italic font-light">No moments recorded yet. They will bloom in time.</p>
                </div>
             ) : (
               moments.map(m => (
                 <div key={m.id} className="glass p-8 rounded-[2.5rem] flex items-center gap-6 card-lift">
                    <div className="w-20 h-20 bg-indigo-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                       {m.guideIcon}
                    </div>
                    <div className="flex-1 space-y-2">
                       <div className="flex justify-between items-start">
                         <span className="text-[10px] font-black text-indigo-400 tracking-widest uppercase">{m.timestamp}</span>
                         <span className="text-xs font-bold text-indigo-900/40 dark:text-indigo-400/40">with {m.guideName}</span>
                       </div>
                       <p className="text-slate-700 dark:text-slate-200 font-bold italic leading-snug">"{m.task}"</p>
                       <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                          <span className="text-lg">✨</span> Completed
                       </div>
                    </div>
                 </div>
               ))
             )}
          </div>

          {moments.length > 0 && activeGuide && (
            <div className="glass p-10 rounded-[3rem] text-center space-y-4 border-indigo-100 dark:border-indigo-900/40">
               <span className="text-6xl block">{activeGuide.icon}</span>
               <p className="text-indigo-900/60 dark:text-slate-400 italic font-medium">
                  "{activeGuide.name} looks at your moments with pride. Each one is a step towards feeling like yourself again."
               </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="fixed bottom-10 right-10 p-5 bg-rose-50 text-rose-600 rounded-[2rem] border border-rose-100 shadow-2xl z-[100] max-w-xs animate-bounce flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <span className="font-bold text-sm">{error}</span>
        </div>
      )}
    </Layout>
  );
};

export default App;
