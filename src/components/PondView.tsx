import React, { useState } from 'react';
import { Task, FishSpecies, FishPosition } from '../types';
import { FISH_SPECIES, getFishForTask } from '../data/fishCatalog';
import { PixelFish } from './PixelFish';
import { ListPlus, Wifi, ArrowRight, Sparkles, Compass } from 'lucide-react';

interface PondViewProps {
  tasks: Task[];
  fishPositions: Record<string, FishPosition>;
  onFishForTask: () => void;
  onCatchSpecificFish: (fish: FishSpecies) => void;
  onSelectTask: (task: Task) => void;
  onOpenTasks: () => void;
  isNfcSupported: boolean;
  isScanningNfc: boolean;
  onToggleNfcScan: () => void;
}

export const PondView: React.FC<PondViewProps> = ({
  tasks,
  fishPositions,
  onFishForTask,
  onCatchSpecificFish,
  onSelectTask,
  onOpenTasks,
  isNfcSupported,
  isScanningNfc,
  onToggleNfcScan
}) => {
  const activeTasks = tasks.filter(t => !t.completed);
  const [selectedSpeciesId, setSelectedSpeciesId] = useState<string>(FISH_SPECIES[0].id);

  const selectedFish = FISH_SPECIES.find(f => f.id === selectedSpeciesId) || FISH_SPECIES[0];

  const getSpeciesDescription = (id: string): string => {
    switch (id) {
      case 'goldie':
        return 'Friendly & energetic. Reels in quick-win tasks (≤15 mins).';
      case 'puffer':
        return 'Cheerful & heavyweight. Tackles major, high-priority projects (≥45 mins).';
      case 'bluefin':
        return 'Swift & laser-focused. Hooks tasks with upcoming or urgent deadlines.';
      case 'jelly':
        return 'Calm & soothing. Ideal for health, self-care, and relaxed wellness tasks.';
      case 'clown':
        return 'Playful & bright. Sparks imaginative, creative, and artistic projects.';
      case 'whale':
        return 'Steady & deep. Perfect for deep focus and marathon work sessions.';
      default:
        return 'Swims peacefully in your pond.';
    }
  };

  return (
    <div className="space-y-2.5 max-w-2xl mx-auto select-none p-1 sm:p-2">
      
      {/* Header Bar: Status & Direct Screen Links (Guaranteed No Overlaps) */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="min-w-0 flex-1">
          <span className="font-pixel text-[8px] text-[#f8b800] tracking-wider uppercase block truncate">
            ▶ POND BASIN
          </span>
          <h2 className="text-xs sm:text-sm font-bold text-white leading-tight font-sans truncate">
            {activeTasks.length === 0 ? "Pond is calm and empty" : `${activeTasks.length} fish swimming in pond`}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isNfcSupported && (
            <button
              onClick={onToggleNfcScan}
              className={`min-h-[26px] px-2 py-0.5 text-[9px] font-pixel rounded border transition-colors flex items-center gap-1 ${
                isScanningNfc
                  ? 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
                  : 'gb-button'
              }`}
              title="Toggle Web NFC scanner"
              aria-label="Toggle NFC Scanner"
            >
              <Wifi className="w-3 h-3 text-[#f8b800]" />
              <span className="hidden xxs:inline">{isScanningNfc ? 'SCAN...' : 'NFC'}</span>
            </button>
          )}

          <button
            onClick={onOpenTasks}
            className="gb-button min-h-[26px] px-2.5 py-0.5 text-[9px] font-pixel rounded flex items-center gap-1 cursor-pointer"
          >
            <ListPlus className="w-3 h-3 text-stone-300" />
            <span>TASKS</span>
          </button>
        </div>
      </div>

      {/* Main Pond Basin (Water only, NO overlapping floating buttons!) */}
      <div className="gb-window p-2 shadow-sm rounded-xl">
        
        {/* Animated Open Water Basin */}
        <div className="relative w-full h-44 sm:h-52 md:h-56 rounded-lg border-2 border-[#1c2c3e] bg-gradient-to-b from-[#0d1e30] via-[#091624] to-[#050c14] overflow-hidden flex items-center justify-center p-2.5 shadow-inner">
          
          {/* Subtle retro water grid ripples */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1.5px,transparent_1.5px)] [background-size:18px_18px]" />

          {/* Top-Left: Cute 8-bit Lilypad with lotus flower */}
          <div className="absolute top-2.5 left-3.5 pointer-events-none opacity-85 select-none z-0">
            <svg viewBox="0 0 12 12" className="w-5 h-5 pixelated">
              <rect x="2" y="3" width="8" height="6" fill="#10b981" />
              <rect x="3" y="2" width="6" height="8" fill="#10b981" />
              <rect x="7" y="5" width="3" height="2" fill="#0d1e30" />
              <rect x="4" y="4" width="2" height="2" fill="#ff6584" />
              <rect x="5" y="3" width="1" height="1" fill="#ffffff" />
            </svg>
          </div>

          {/* Top-Right: Second Small Floating Lilypad */}
          <div className="absolute top-3.5 right-10 pointer-events-none opacity-75 select-none z-0">
            <svg viewBox="0 0 10 10" className="w-4 h-4 pixelated">
              <rect x="2" y="2" width="6" height="6" fill="#059669" />
              <rect x="3" y="1" width="4" height="8" fill="#10b981" />
              <rect x="1" y="3" width="8" height="4" fill="#059669" />
              <rect x="5" y="4" width="2" height="2" fill="#0d1e30" />
            </svg>
          </div>

          {/* Water Surface Sunlight Shimmer lines */}
          <div className="absolute top-7 left-1/4 pointer-events-none animate-shimmer select-none z-0">
            <div className="w-12 h-0.5 bg-sky-300/40 rounded-full" />
          </div>
          <div className="absolute top-12 right-1/4 pointer-events-none animate-shimmer select-none z-0" style={{ animationDelay: '1.5s' }}>
            <div className="w-9 h-0.5 bg-sky-300/30 rounded-full" />
          </div>

          {/* Water Sparkle */}
          <div className="absolute top-3 right-4 pointer-events-none opacity-70 animate-pulse z-0">
            <svg viewBox="0 0 8 8" className="w-3.5 h-3.5 pixelated">
              <rect x="3" y="1" width="2" height="6" fill="#7dd3fc" />
              <rect x="1" y="3" width="6" height="2" fill="#7dd3fc" />
              <rect x="3" y="3" width="2" height="2" fill="#ffffff" />
            </svg>
          </div>

          {/* Bottom-Left: Swaying Seaweed Reeds & Riverbed Pebbles */}
          <div className="absolute bottom-2 left-2.5 pointer-events-none select-none z-0">
            <svg viewBox="0 0 18 10" className="w-7 h-4 pixelated opacity-90 absolute -bottom-1 -left-1">
              <rect x="1" y="4" width="7" height="5" fill="#334155" />
              <rect x="2" y="3" width="5" height="7" fill="#475569" />
              <rect x="7" y="5" width="8" height="4" fill="#1e293b" />
              <rect x="8" y="4" width="6" height="5" fill="#334155" />
            </svg>

            <div className="animate-sway origin-bottom inline-block">
              <svg viewBox="0 0 10 26" className="w-3.5 h-9 pixelated">
                <rect x="4" y="2" width="2" height="24" fill="#059669" />
                <rect x="2" y="6" width="3" height="3" fill="#10b981" />
                <rect x="5" y="12" width="4" height="3" fill="#34d399" />
                <rect x="1" y="17" width="4" height="3" fill="#10b981" />
                <rect x="5" y="21" width="3" height="3" fill="#059669" />
              </svg>
            </div>

            <div className="animate-sway-slow origin-bottom inline-block -ml-1">
              <svg viewBox="0 0 8 18" className="w-3 h-6 pixelated">
                <rect x="3" y="2" width="2" height="16" fill="#047857" />
                <rect x="1" y="5" width="3" height="2" fill="#10b981" />
                <rect x="4" y="10" width="3" height="2" fill="#34d399" />
              </svg>
            </div>

            <div className="absolute bottom-6 left-2 pointer-events-none animate-bubble-1">
              <div className="w-1.5 h-1.5 rounded-full border border-sky-300/80 bg-sky-200/40" />
            </div>
          </div>

          {/* Bottom-Right: Swaying Plant, Pebbles, and Cute Snail */}
          <div className="absolute bottom-2 right-3 pointer-events-none select-none z-0">
            <svg viewBox="0 0 20 12" className="w-8 h-4.5 pixelated opacity-90 absolute -bottom-1 -right-1">
              <rect x="2" y="5" width="9" height="5" fill="#334155" />
              <rect x="3" y="4" width="7" height="6" fill="#475569" />
              <rect x="10" y="6" width="8" height="4" fill="#1e293b" />
              <rect x="4" y="2" width="4" height="3" fill="#f59e0b" />
              <rect x="5" y="1" width="2" height="4" fill="#fbbf24" />
              <rect x="2" y="4" width="2" height="2" fill="#d97706" />
            </svg>

            <div className="animate-sway-slow origin-bottom inline-block">
              <svg viewBox="0 0 10 24" className="w-3.5 h-8 pixelated">
                <rect x="4" y="2" width="2" height="22" fill="#047857" />
                <rect x="5" y="5" width="3" height="3" fill="#10b981" />
                <rect x="2" y="11" width="3" height="3" fill="#34d399" />
                <rect x="5" y="16" width="3" height="2" fill="#10b981" />
              </svg>
            </div>

            <div className="absolute bottom-5 right-2 pointer-events-none animate-bubble-2">
              <div className="w-1.5 h-1.5 rounded-full border border-sky-300/80 bg-sky-200/40" />
            </div>
          </div>

          {/* Swimming Fish (Completely unobstructed, generous click targets) */}
          <div className="absolute inset-0 p-2 overflow-hidden">
            {activeTasks.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <PixelFish type="goldie" size="md" animated={true} />
                <p className="font-pixel text-[9px] text-[#f8b800] mt-2">
                  POND IS PEACEFUL!
                </p>
                <p className="text-xs text-stone-300 font-sans mt-0.5">
                  Tap <span className="text-[#f8b800] font-bold">+ NEW</span> above to add tasks.
                </p>
              </div>
            ) : (
              activeTasks.map((task, idx) => {
                const fish = getFishForTask(task);
                const defaultX = 20 + ((idx * 27) % 55);
                const defaultY = 22 + ((idx * 22) % 48);
                const pos = fishPositions[task.id] || { 
                  x: defaultX, 
                  y: defaultY, 
                  facing: idx % 2 === 0 ? 'right' : 'left' 
                };

                return (
                  <button
                    key={task.id}
                    onClick={() => onSelectTask(task)}
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      transition: 'left 7.5s cubic-bezier(0.25, 1, 0.5, 1), top 7.5s cubic-bezier(0.25, 1, 0.5, 1)'
                    }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-white/10 hover:scale-125 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f8b800] group z-10 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center transition-transform"
                    title={`${task.title} (${task.estimatedMinutes}m)`}
                    aria-label={`Select task: ${task.title}`}
                  >
                    <PixelFish type={fish.type} size="sm" facing={pos.facing} />
                    
                    {/* Tooltip bubble on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1 gb-window rounded-md shadow-2xl pointer-events-none z-30 min-w-[120px] max-w-[180px]">
                      <p className="text-xs font-bold text-white font-sans truncate">{task.title}</p>
                      <p className="text-[10px] text-[#f8b800] font-sans mt-0.5">{task.estimatedMinutes}m · {fish.name}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Clear Command Strip: Separate Full-Width Banners (Zero Overlap!) */}
      {activeTasks.length > 0 && (
        <div className="space-y-1.5">
          
          {/* Action 1: Primary Reel & Catch Banner */}
          <button
            onClick={onFishForTask}
            className="gb-button-primary w-full min-h-[42px] px-3.5 py-2 rounded-xl flex items-center justify-between cursor-pointer shadow-md group"
            aria-label="Reel in a task from the pond"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-lg shrink-0">🎣</span>
              <div className="text-left min-w-0">
                <span className="font-pixel text-[9px] text-[#0b1219] block tracking-wide truncate">
                  [A] REEL IN A FISH
                </span>
                <span className="text-[11px] font-sans font-semibold text-[#0b1219]/80 block leading-tight truncate">
                  Catch recommended task from pond
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-[#0b1219] group-hover:rotate-12 transition-transform shrink-0 ml-2" />
          </button>

          {/* Action 2: Next Up Card */}
          <div className="gb-window p-2.5 rounded-xl flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              <div className="w-8 h-8 rounded-lg bg-[#0b1219] border border-[#2b3e54] flex items-center justify-center shrink-0">
                <PixelFish type={getFishForTask(activeTasks[0]).type} size="sm" animated={false} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="font-pixel text-[8px] text-[#f8b800] uppercase block truncate">
                  NEXT IN LINE:
                </span>
                <h4 className="text-xs font-bold text-white font-sans truncate leading-tight">
                  {activeTasks[0].title}
                </h4>
              </div>
            </div>

            <button
              onClick={() => onSelectTask(activeTasks[0])}
              className="gb-button min-h-[30px] px-3 py-1 text-[9px] font-pixel text-stone-200 rounded flex items-center gap-1 cursor-pointer shrink-0 ml-1"
              title="Focus on this task directly"
            >
              <span>FOCUS</span>
              <ArrowRight className="w-3 h-3 text-[#f8b800]" />
            </button>
          </div>

        </div>
      )}

      {/* Tangible Fish Species Explorer: Legible Names & Readable Descriptions */}
      <div className="gb-window p-2.5 sm:p-3 rounded-xl space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Compass className="w-3.5 h-3.5 text-[#f8b800] shrink-0" />
            <h3 className="font-pixel text-[9px] text-[#f8b800] tracking-wider uppercase truncate">
              SPECIES BESTIARY
            </h3>
          </div>
          <span className="text-[10px] font-sans text-stone-400 shrink-0">
            Select species
          </span>
        </div>

        {/* Species Quick Selector: 6 Columns with Strictly Constrained Text */}
        <div className="grid grid-cols-6 gap-1">
          {FISH_SPECIES.map((fish) => {
            const isSelected = selectedSpeciesId === fish.id;
            return (
              <button
                key={fish.id}
                onClick={() => setSelectedSpeciesId(fish.id)}
                className={`p-1 rounded-lg border transition-all flex flex-col items-center justify-center text-center cursor-pointer min-w-0 overflow-hidden ${
                  isSelected
                    ? 'bg-[#1e2f42] border-[#f8b800] shadow-sm scale-102'
                    : 'bg-[#0f1722] border-[#25374c] hover:bg-[#162332]'
                }`}
                title={fish.name}
              >
                <PixelFish type={fish.type} size="sm" animated={isSelected} />
                <span className="text-[10px] font-bold font-sans text-white mt-1 leading-none truncate max-w-full block">
                  {fish.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Species Card: Clear layout, full width button, no squishing! */}
        <div className="p-2.5 rounded-lg bg-[#0b1219] border border-[#233548] space-y-2">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#141f2c] border border-[#2b3e54] flex items-center justify-center shrink-0">
              <PixelFish type={selectedFish.type} size="md" animated={true} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-xs sm:text-sm font-bold text-white font-sans">
                  {selectedFish.name}
                </h4>
                <span className="font-pixel text-[8px] px-1.5 py-0.5 rounded bg-[#f8b800]/20 text-[#f8b800] uppercase shrink-0">
                  {selectedFish.tag}
                </span>
              </div>
              <p className="text-xs text-stone-300 font-sans mt-0.5 leading-relaxed">
                {getSpeciesDescription(selectedFish.id)}
              </p>
            </div>
          </div>

          <button
            onClick={() => onCatchSpecificFish(selectedFish)}
            className="gb-button w-full min-h-[34px] py-1 text-[9px] font-pixel text-[#f8b800] rounded flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
            aria-label={`Target and catch a ${selectedFish.name} task`}
          >
            <span>CAST FOR {selectedFish.name.toUpperCase()} ({selectedFish.tag.toUpperCase()})</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#f8b800]" />
          </button>
        </div>

      </div>

    </div>
  );
};
