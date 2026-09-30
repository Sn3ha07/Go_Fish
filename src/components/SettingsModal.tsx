import React from 'react';
import { UserPreferences, PrioritizationMode } from '../types';
import { RotateCcw } from 'lucide-react';

interface SettingsModalProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  preferences,
  onUpdatePreferences,
  onResetData
}) => {
  const modes: { id: PrioritizationMode; label: string; desc: string }[] = [
    { id: 'combined', label: 'BALANCED CURRENT', desc: 'Balances due dates, priority, & time.' },
    { id: 'due_date', label: 'DEADLINE FIRST', desc: 'Prioritizes closest imminent deadlines.' },
    { id: 'importance', label: 'HIGH PRIORITY FIRST', desc: 'Surfaces heavyweight critical tasks.' },
    { id: 'duration', label: 'QUICK BITES FIRST', desc: 'Shortest duration tasks for fast momentum.' },
    { id: 'random', label: 'LUCKY CAST', desc: 'Picks a serendipitous task from pond.' }
  ];

  return (
    <div className="space-y-2.5 max-w-lg mx-auto select-none">
      <div className="gb-window p-2.5 sm:p-3 space-y-3 rounded-lg shadow-sm">
        
        {/* Header */}
        <div>
          <span className="font-pixel text-[8px] text-[#f8b800] tracking-wider uppercase block">
            ▶ SYSTEM CONFIG
          </span>
          <h2 className="text-xs font-bold text-white font-pixel mt-0.5">
            POND CURRENT RULES
          </h2>
        </div>

        {/* Prioritization Modes */}
        <div className="space-y-1.5">
          <label className="font-pixel text-[8px] text-stone-300 uppercase tracking-wider block">
            SELECT CATCH ALGORITHM:
          </label>

          <div className="space-y-1.5">
            {modes.map((m) => {
              const isSelected = preferences.prioritization.mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onUpdatePreferences({
                    ...preferences,
                    prioritization: { ...preferences.prioritization, mode: m.id }
                  })}
                  className={`w-full p-2 rounded border text-left transition-colors flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-[#f8b800] bg-[#1a2d42] text-[#f8b800]'
                      : 'border-[#233548] bg-[#0c141d] text-stone-200 hover:bg-[#152332]'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <h4 className={`text-[10px] font-pixel ${isSelected ? 'text-[#f8b800]' : 'text-white'}`}>
                      {isSelected ? `▶ ${m.label}` : m.label}
                    </h4>
                    <p className="text-[9px] text-stone-400 mt-0.5 leading-tight">
                      {m.desc}
                    </p>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#f8b800] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Reset Demo Data Button */}
        <div className="pt-2 border-t border-[#233548] flex justify-between items-center">
          <span className="font-pixel text-[8px] text-stone-500">
            RESET ALL LOCAL DATA
          </span>
          <button
            onClick={onResetData}
            className="gb-button min-h-[28px] px-2.5 py-1 text-[9px] font-pixel text-rose-300 hover:text-rose-100 rounded flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>RESET</span>
          </button>
        </div>

      </div>
    </div>
  );
};
