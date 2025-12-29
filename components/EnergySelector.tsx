
import React from 'react';
import { EnergyLevel } from '../types';

interface EnergySelectorProps {
  value: EnergyLevel;
  onChange: (level: EnergyLevel) => void;
}

const EnergySelector: React.FC<EnergySelectorProps> = ({ value, onChange }) => {
  const options: { id: EnergyLevel; label: string; icon: string; color: string }[] = [
    { id: 'low', label: 'Low', icon: '🕯️', color: 'bg-indigo-50 border-indigo-200' },
    { id: 'medium', label: 'Medium', icon: '🌱', color: 'bg-emerald-50 border-emerald-200' },
    { id: 'high', label: 'High', icon: '☀️', color: 'bg-amber-50 border-amber-200' },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 ${
            value === opt.id 
              ? `${opt.color} border-indigo-500 ring-2 ring-indigo-500 ring-opacity-50` 
              : 'bg-white border-slate-100 hover:border-slate-200 grayscale opacity-60 hover:grayscale-0 hover:opacity-100'
          }`}
        >
          <span className="text-2xl mb-1">{opt.icon}</span>
          <span className="text-sm font-medium text-slate-700">{opt.label}</span>
        </button>
      ))}
    </div>
  );
};

export default EnergySelector;
