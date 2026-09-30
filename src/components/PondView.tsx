import React, { useState } from 'react';
import { Task, FishSpecies, FishPosition } from '../types';
import { FISH_SPECIES, getFishForTask } from '../data/fishCatalog';
import { PixelFish } from './PixelFish';
import { ListPlus, Wifi, ArrowRight, Sparkles, Compass, Radio } from 'lucide-react';

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
        return 'Friendly & energetic. Reels in quick-win sprint tasks (≤15 mins).';
      case 'longfish':
      case 'puffer':
        return 'Noodle the Long Fish! Slender & patient. Stretches out extended, high-priority tasks and multi-step projects.';
      case 'bluefin':
        return 'Swift & laser-focused. Hooks tasks with upcoming or urgent deadlines.';
      case 'jelly':
        return 'Boba the Jelly! Multi-tentacled & organized. Specializes in multi-action tasks, checklists, and staged workflows.';
      case 'shark':
      case 'clown':
        return 'Chomp the Shark! Bold & fearless. Sinks its teeth into creative, ambitious, and high-impact projects.';
      case 'whale':
        return 'Steady & deep. Perfect for deep focus and marathon work sessions.';
      default:
        return 'Swims peacefully in your pond.';
    }
  };

  const getActiveTasksForSpecies = (speciesId: string) => {
    return activeTasks.filter(t => {
      const f = getFishForTask(t);
      return f.id === speciesId;
    });
  };

  const speciesTasks = getActiveTasksForSpecies(selectedFish.id);

  return (
    <div className="space-y-2.5 max-w-2xl mx-auto select-none p-1 sm:p-2">
      
      {/* Header Bar: Status & Direct Screen Links */}
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

      {/* Main Pond Basin (Water with swimming fish) */}
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

          {/* Ambient Rising Bubbles */}
          <div className="absolute bottom-2 left-10 pointer-events-none opacity-40 animate-bubble select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-cyan-300 border border-white/60" />
          </div>
          <div className="absolute bottom-3 right-16 pointer-events-none opacity-50 animate-bubble select-none" style={{ animationDelay: '1.2s' }}>
            <div className="w-2 h-2 rounded-full bg-sky-200 border border-white/80" />
          </div>
          <div className="absolute bottom-1 left-1/2 pointer-events-none opacity-30 animate-bubble select-none" style={{ animationDelay: '2.4s' }}>
            <div className="w-1 h-1 rounded-full bg-cyan-200" />
          </div>

          {/* Pond Bottom Seaweed */}
          <div className="absolute bottom-0 left-6 pointer-events-none opacity-40 select-none z-0">
            <div className="w-2 h-8 bg-emerald-700/80 rounded-t-full transform -rotate-6" />
          </div>
          <div className="absolute bottom-0 right-8 pointer-events-none opacity-40 select-none z-0">
            <div className="w-2.5 h-10 bg-teal-800/80 rounded-t-full transform rotate-3" />
          </div>

          {/* Empty State Overlay */}
          {activeTasks.length === 0 ? (
            <div className="text-center z-10 p-3 bg-[#08101a]/85 backdrop-blur-xs rounded-xl border border-[#1e2f42] max-w-xs shadow-lg">
              <div className="w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-[#122336] mb-1.5 border border-[#2b3e54]">
                <PixelFish type="goldie" size="sm" animated={true} />
              </div>
              <p className="font-pixel text-[9px] text-[#f8b800] tracking-wide mb-1 uppercase">
                ALL FISH REELED IN!
              </p>
              <p className="text-xs text-stone-300 font-sans leading-snug">
                Your pond is serene and clear. Add a task to populate it with lively swimming fish!
              </p>
            </div>
          ) : (
            /* Swimming Fish Layer */
            activeTasks.map((task) => {
              const fish = getFishForTask(task);
              const pos = fishPositions[task.id] || { x: 50, y: 50, facing: 'right' };

              return (
                <div
                  key={task.id}
                  className="absolute cursor-pointer transition-all duration-700 ease-out hover:scale-115 hover:z-20 group"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onClick={() => onSelectTask(task)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Inspect ${task.title}, represented by ${fish.name}`}
                >
                  <PixelFish
                    type={fish.type}
                    size="sm"
                    animated={true}
                    facing={pos.facing}
                    className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                  />

                  {/* Cute Hover Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                    <div className="bg-[#0b1219]/95 text-white text-[10px] font-sans font-semibold px-2 py-0.5 rounded border border-[#2b3e54] shadow-lg whitespace-nowrap max-w-[140px] truncate">
                      {task.title}
                    </div>
                    <div className="w-1.5 h-1.5 bg-[#0b1219] border-r border-b border-[#2b3e54] transform rotate-45 -mt-1" />
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Prominently Featured: Tangible Species Bestiary Showcase */}
      <div className="gb-window p-3 rounded-xl space-y-2.5 shadow-sm">
        
        {/* Bestiary Header with Species Count */}
        <div className="flex items-center justify-between gap-2 border-b border-[#1f2f42] pb-2">
          <div className="flex items-center gap-2 min-w-0">
            <Compass className="w-4 h-4 text-[#f8b800] shrink-0" />
            <div>
              <h3 className="font-pixel text-[10px] text-[#f8b800] tracking-wider uppercase truncate">
                SPECIES BESTIARY
              </h3>
              <span className="text-[10px] font-sans text-stone-400 block -mt-0.5">
                All 6 species discovered · Tap to inspect
              </span>
            </div>
          </div>

          <div className="px-2 py-0.5 rounded bg-[#0b1219] border border-[#2b3e54] text-right shrink-0">
            <span className="font-pixel text-[8px] text-[#78d8a0]">
              6 / 6 SPECIES
            </span>
          </div>
        </div>

        {/* Species Quick Selector Grid: 6 Distinct 8-Bit Fish Tiles */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
          {FISH_SPECIES.map((fish) => {
            const isSelected = selectedSpeciesId === fish.id;
            const inPondCount = getActiveTasksForSpecies(fish.id).length;

            return (
              <button
                key={fish.id}
                onClick={() => setSelectedSpeciesId(fish.id)}
                className={`p-2 rounded-xl border transition-all flex flex-col items-center justify-center text-center cursor-pointer min-w-0 ${
                  isSelected
                    ? 'bg-[#1b2b3d] border-[#f8b800] shadow-md ring-1 ring-[#f8b800]/50 scale-102'
                    : 'bg-[#0c141d] border-[#223548] hover:bg-[#14202e] hover:border-[#2f4660]'
                }`}
                title={`${fish.name} (${fish.tag})`}
              >
                <div className="w-9 h-9 flex items-center justify-center">
                  <PixelFish type={fish.type} size="sm" animated={isSelected} />
                </div>
                
                <span className="text-[11px] font-bold font-sans text-white mt-0.5 leading-tight truncate max-w-full block">
                  {fish.name}
                </span>

                {/* Swimming in Pond Badge */}
                <span className={`text-[7.5px] font-pixel mt-1 px-1 py-0.2 rounded leading-none block truncate max-w-full ${
                  inPondCount > 0
                    ? 'bg-[#78d8a0]/20 text-[#78d8a0]'
                    : 'bg-stone-800/80 text-stone-500'
                }`}>
                  {inPondCount > 0 ? `● ${inPondCount} SWIMMING` : 'IDLE'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Showcased Species Detailed Specimen Card */}
        <div className="p-3 rounded-xl bg-[#091018] border border-[#1e2f42] space-y-2.5">
          
          {/* Top: Large Sprite Preview & Archetype Bio */}
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#0e1925] border-2 border-[#2b3e54] flex items-center justify-center shrink-0 shadow-inner">
              <PixelFish type={selectedFish.type} size="md" animated={true} />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-white font-sans">
                  {selectedFish.name}
                </h4>
                <span className="font-pixel text-[8px] px-2 py-0.5 rounded bg-[#f8b800]/20 text-[#f8b800] uppercase shrink-0">
                  {selectedFish.tag}
                </span>
              </div>

              <span className="text-[10px] font-pixel text-[#78d8a0] block mt-0.5 uppercase tracking-wide">
                {selectedFish.personality}
              </span>

              <p className="text-xs text-stone-300 font-sans mt-1 leading-relaxed">
                {getSpeciesDescription(selectedFish.id)}
              </p>
            </div>
          </div>

          {/* Active Swimming Tasks matching this species */}
          {speciesTasks.length > 0 ? (
            <div className="space-y-1 pt-2 border-t border-[#1a293a]">
              <span className="text-[8px] font-pixel text-[#78d8a0] uppercase block">
                SWIMMING IN POND ({speciesTasks.length}):
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {speciesTasks.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-[#0e1722] border border-[#1e2d3e] text-xs font-sans"
                  >
                    <span className="truncate text-stone-200 font-medium">{t.title}</span>
                    <button
                      onClick={() => onSelectTask(t)}
                      className="gb-button px-2 py-0.5 text-[8px] font-pixel text-[#f8b800] rounded shrink-0 cursor-pointer"
                    >
                      FOCUS
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[11px] text-stone-400 font-sans italic pt-1 border-t border-[#1a293a]">
              No {selectedFish.name} tasks currently swimming. Add one in Tasks to watch them swim!
            </div>
          )}

          {/* Cast Specifically for Selected Fish Button */}
          <button
            onClick={() => onCatchSpecificFish(selectedFish)}
            className="gb-button-primary w-full min-h-[38px] py-1.5 px-3 text-[9px] font-pixel text-[#0b1219] bg-[#f8b800] hover:bg-[#ffc820] rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            aria-label={`Cast for ${selectedFish.name}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAST FOR {selectedFish.name.toUpperCase()} ({selectedFish.tag.toUpperCase()})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
