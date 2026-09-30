import React from 'react';
import { Menu, X, BookOpen, Settings, Volume2, VolumeX, Plus, RotateCcw } from 'lucide-react';
import { UserStats } from '../types';
import { PixelFish } from './PixelFish';

export type ActiveTab = 'pond' | 'tasks' | 'journal' | 'settings';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: UserStats;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenNewTask: () => void;
  onResetData: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  onToggleSound,
  onOpenNewTask,
  onResetData,
  isMenuOpen,
  setIsMenuOpen
}) => {
  return (
    <header className="relative w-full border-b-2 border-[#2b3e54] bg-[#0f1722] select-none shrink-0 z-20">
      <div className="px-2.5 sm:px-3 h-11 flex items-center justify-between gap-1.5">
        
        {/* Brand with small cute sprite */}
        <button 
          onClick={() => {
            setActiveTab('pond');
            setIsMenuOpen(false);
          }}
          className="flex items-center gap-1.5 text-left focus:outline-none rounded py-0.5 px-1 group shrink-0 min-w-0"
          aria-label="Go Fish Home"
        >
          <PixelFish type="goldie" size="sm" animated={true} />
          <span className="font-pixel text-[9px] sm:text-[10px] text-[#f8b800] tracking-wider drop-shadow-sm truncate">
            GO FISH
          </span>
        </button>

        {/* Primary Screen Tabs: [ POND ] & [ TASKS ] */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => {
              setActiveTab('pond');
              setIsMenuOpen(false);
            }}
            className={`min-h-[28px] px-2 py-0.5 text-[10px] font-pixel rounded transition-colors ${
              activeTab === 'pond' && !isMenuOpen
                ? 'bg-[#22354a] text-[#f8b800] border-b-2 border-[#f8b800] shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-[#182330]'
            }`}
          >
            {activeTab === 'pond' && !isMenuOpen ? '▶POND' : 'POND'}
          </button>

          <button
            onClick={() => {
              setActiveTab('tasks');
              setIsMenuOpen(false);
            }}
            className={`min-h-[28px] px-2 py-0.5 text-[10px] font-pixel rounded transition-colors ${
              activeTab === 'tasks' && !isMenuOpen
                ? 'bg-[#22354a] text-[#f8b800] border-b-2 border-[#f8b800] shadow-sm'
                : 'text-stone-400 hover:text-white hover:bg-[#182330]'
            }`}
          >
            {activeTab === 'tasks' && !isMenuOpen ? '▶TASKS' : 'TASKS'}
          </button>
        </nav>

        {/* Right side: New Task Button + Hamburger Menu */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Add Task Button */}
          <button
            onClick={onOpenNewTask}
            className="gb-button-primary min-h-[28px] px-2 py-0.5 text-[9px] rounded flex items-center gap-0.5 cursor-pointer"
            title="Add task"
            aria-label="Add task"
          >
            <Plus className="w-3 h-3 stroke-[3]" />
            <span className="hidden xs:inline">NEW</span>
          </button>

          {/* Hamburger Menu Toggle Button */}
          <button
            onClick={() => setIsMenuOpen(prev => !prev)}
            className={`w-7 h-7 rounded border transition-colors flex items-center justify-center cursor-pointer ${
              isMenuOpen
                ? 'bg-[#f8b800] border-[#f8b800] text-[#0b1219]'
                : 'gb-button text-stone-200'
            }`}
            title="Menu"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? (
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            ) : (
              <Menu className="w-3.5 h-3.5 stroke-[2.2]" />
            )}
          </button>

        </div>

      </div>

      {/* Hamburger Dropdown Drawer (Retro RPG Game Boy Window) */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 z-40 gb-window border-t-2 border-[#384d66] p-2.5 animate-pop">
          <div className="space-y-1.5 max-w-sm mx-auto">
            
            <button
              onClick={() => {
                setActiveTab('journal');
                setIsMenuOpen(false);
              }}
              className={`w-full min-h-[36px] px-2.5 py-1.5 rounded text-left text-[11px] transition-colors flex items-center justify-between border ${
                activeTab === 'journal'
                  ? 'bg-[#23374e] border-[#f8b800] text-[#f8b800]'
                  : 'bg-[#152230] border-[#293d54] text-stone-200 hover:bg-[#1d2d40]'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-[#f8b800]" />
                <span className="font-pixel text-[9px]">FISH LOGBOOK</span>
              </div>
              <span className="text-[10px] text-stone-400">BESTIARY</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMenuOpen(false);
              }}
              className={`w-full min-h-[36px] px-2.5 py-1.5 rounded text-left text-[11px] transition-colors flex items-center justify-between border ${
                activeTab === 'settings'
                  ? 'bg-[#23374e] border-[#f8b800] text-[#f8b800]'
                  : 'bg-[#152230] border-[#293d54] text-stone-200 hover:bg-[#1d2d40]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-stone-300" />
                <span className="font-pixel text-[9px]">OPTIONS</span>
              </div>
              <span className="text-[10px] text-stone-400">SETTINGS</span>
            </button>

            <button
              onClick={onToggleSound}
              className="w-full min-h-[36px] px-2.5 py-1.5 rounded text-left text-[11px] transition-colors flex items-center justify-between bg-[#152230] border border-[#293d54] text-stone-200 hover:bg-[#1d2d40]"
            >
              <div className="flex items-center gap-2">
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-[#78d8a0]" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                )}
                <span className="font-pixel text-[9px]">SFX: {soundEnabled ? 'ON' : 'OFF'}</span>
              </div>
              <span className="text-[10px] text-stone-400 font-pixel">[TOGGLE]</span>
            </button>

            <div className="pt-1.5 border-t border-[#293d54] flex justify-between items-center px-1">
              <span className="text-[8px] font-pixel text-stone-500">
                GBC EDITION v2.1
              </span>
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onResetData();
                }}
                className="text-[9px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-pixel p-1"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>RESET</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};
