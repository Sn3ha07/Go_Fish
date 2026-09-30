import React, { useEffect } from 'react';

interface GameBoyConsoleProps {
  children: React.ReactNode;
  onPressA: () => void;
  onPressB: () => void;
  onPressSelect: () => void;
  onPressStart: () => void;
  onPressDpad: (dir: 'up' | 'down' | 'left' | 'right') => void;
  activeTab: string;
}

export const GameBoyConsole: React.FC<GameBoyConsoleProps> = ({
  children,
  onPressA,
  onPressB,
  onPressSelect,
  onPressStart,
  onPressDpad,
  activeTab
}) => {
  // Support physical keyboard controls for authentic console feel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        onPressDpad('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        onPressDpad('down');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        onPressDpad('left');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        onPressDpad('right');
      } else if (e.key === 'a' || e.key === 'A' || e.key === 'Enter') {
        e.preventDefault();
        onPressA();
      } else if (e.key === 'b' || e.key === 'B' || e.key === 'Escape') {
        e.preventDefault();
        onPressB();
      } else if (e.key === 'Tab') {
        e.preventDefault();
        onPressSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPressA, onPressB, onPressSelect, onPressDpad]);

  return (
    <div className="w-full h-full max-h-[96dvh] max-w-[500px] sm:max-w-[530px] mx-auto flex flex-col justify-between select-none p-1 sm:p-2">
      
      {/* Authentic Vertical Game Boy Color Chassis */}
      <div className="relative w-full h-full rounded-[2.2rem] sm:rounded-[2.5rem] border-4 border-[#161820] bg-[#22252e] shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-2.5 sm:p-3.5 flex flex-col justify-between flex-1 min-h-0">
        
        {/* Top Screen Section: Classic Game Boy Bezel */}
        <div className="rounded-2xl border-4 border-[#13151b] bg-[#12141a] p-2 sm:p-2.5 shadow-inner flex-1 min-h-0 flex flex-col">
          
          {/* Bezel Status Bar: Clean, No-Overlap Header */}
          <div className="flex items-center justify-between px-2 pb-1.5 text-[8px] font-pixel text-stone-500 select-none border-b border-[#1c1e26] mb-1 shrink-0">
            {/* Battery LED */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399] animate-pulse" />
              <span className="tracking-wider text-stone-400">BATTERY</span>
            </div>

            {/* Current screen indicator */}
            <div className="flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-0.5 bg-rose-500 inline-block" />
              <span className="w-1.5 h-0.5 bg-sky-500 inline-block" />
              <span className="tracking-widest uppercase text-[#f8b800] ml-1 font-bold">{activeTab}</span>
            </div>
          </div>

          {/* Screen Content Container: Full Scrollable Viewport */}
          <div className="relative rounded-lg overflow-hidden bg-[#0c141d] border-2 border-[#1c2c3e] flex-1 min-h-0 flex flex-col shadow-inner">
            {children}
            {/* Subtle retro Game Boy scanline overlay */}
            <div className="absolute inset-0 gb-scanlines pointer-events-none z-30" />
          </div>
        </div>

        {/* Bottom Hardware Controls Section (Classic Game Boy Color Layout) */}
        <div className="pt-2 sm:pt-3 pb-1 px-1 flex flex-col justify-between shrink-0">
          
          {/* Console Branding Line */}
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="font-pixel text-[9px] text-[#f8b800] tracking-wider">
              GO FISH
            </span>
            <div className="font-pixel text-[9px] font-bold tracking-widest flex items-center gap-0.5">
              <span className="text-[#f43f5e]">C</span>
              <span className="text-[#fbbf24]">O</span>
              <span className="text-[#34d399]">L</span>
              <span className="text-[#38bdf8]">O</span>
              <span className="text-[#a855f7]">R</span>
            </div>
          </div>

          {/* D-Pad, Center SELECT/START, and A/B Action Buttons */}
          <div className="flex items-center justify-between gap-2 px-1">
            
            {/* Left: Classic D-Pad */}
            <div className="relative w-20 h-20 sm:w-22 sm:h-22 flex items-center justify-center shrink-0">
              {/* Outer circular inset */}
              <div className="absolute inset-0 rounded-full bg-[#181a20]/70 pointer-events-none shadow-inner" />
              
              {/* Center Pivot */}
              <div className="absolute w-6 h-6 rounded-sm bg-[#181a22] border border-[#2e313d] z-10 pointer-events-none flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#121317]" />
              </div>

              {/* Up */}
              <button
                onClick={() => onPressDpad('up')}
                className="absolute top-0 w-6 h-7.5 bg-[#20222a] hover:bg-[#2a2c36] active:bg-[#15161b] border-t border-x border-[#343746] rounded-t flex items-center justify-center cursor-pointer shadow-sm group"
                aria-label="D-Pad Up"
              >
                <span className="w-0 h-0 border-x-3 border-x-transparent border-b-3 border-b-stone-400 group-hover:border-b-stone-200" />
              </button>

              {/* Down */}
              <button
                onClick={() => onPressDpad('down')}
                className="absolute bottom-0 w-6 h-7.5 bg-[#20222a] hover:bg-[#2a2c36] active:bg-[#15161b] border-b border-x border-[#343746] rounded-b flex items-center justify-center cursor-pointer shadow-sm group"
                aria-label="D-Pad Down"
              >
                <span className="w-0 h-0 border-x-3 border-x-transparent border-t-3 border-t-stone-400 group-hover:border-t-stone-200" />
              </button>

              {/* Left */}
              <button
                onClick={() => onPressDpad('left')}
                className="absolute left-0 h-6 w-7.5 bg-[#20222a] hover:bg-[#2a2c36] active:bg-[#15161b] border-l border-y border-[#343746] rounded-l flex items-center justify-center cursor-pointer shadow-sm group"
                aria-label="D-Pad Left"
              >
                <span className="w-0 h-0 border-y-3 border-y-transparent border-r-3 border-r-stone-400 group-hover:border-r-stone-200" />
              </button>

              {/* Right */}
              <button
                onClick={() => onPressDpad('right')}
                className="absolute right-0 h-6 w-7.5 bg-[#20222a] hover:bg-[#2a2c36] active:bg-[#15161b] border-r border-y border-[#343746] rounded-r flex items-center justify-center cursor-pointer shadow-sm group"
                aria-label="D-Pad Right"
              >
                <span className="w-0 h-0 border-y-3 border-y-transparent border-l-3 border-l-stone-400 group-hover:border-l-stone-200" />
              </button>
            </div>

            {/* Middle: Slanted Rubber SELECT & START Pills */}
            <div className="flex flex-col items-center justify-end pb-1 gap-2.5">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center -rotate-25">
                  <button
                    onClick={onPressSelect}
                    className="w-7 h-2.5 rounded-full bg-[#181a20] hover:bg-[#282c38] active:bg-[#101116] border border-[#343746] shadow-sm cursor-pointer"
                    title="Switch tab (Tab)"
                    aria-label="SELECT"
                  />
                  <span className="font-pixel text-[6px] text-stone-400 mt-1">SELECT</span>
                </div>

                <div className="flex flex-col items-center -rotate-25">
                  <button
                    onClick={onPressStart}
                    className="w-7 h-2.5 rounded-full bg-[#181a20] hover:bg-[#282c38] active:bg-[#101116] border border-[#343746] shadow-sm cursor-pointer"
                    title="Open Menu"
                    aria-label="START"
                  />
                  <span className="font-pixel text-[6px] text-stone-400 mt-1">START</span>
                </div>
              </div>
            </div>

            {/* Right: Angled A & B Maroon Action Buttons + Speaker */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2.5 -rotate-20">
                {/* Button B */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={onPressB}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#831843] hover:bg-[#9d174d] active:bg-[#500724] border border-[#be185d] shadow-[0_3px_0_#500724] active:shadow-none active:translate-y-0.5 flex items-center justify-center cursor-pointer transition-all"
                    aria-label="Button B (Back / Cancel)"
                  >
                    <span className="font-pixel text-[10px] sm:text-[11px] text-white">B</span>
                  </button>
                  <span className="font-pixel text-[7px] text-stone-400 mt-1">BACK</span>
                </div>

                {/* Button A */}
                <div className="flex flex-col items-center -translate-y-3">
                  <button
                    onClick={onPressA}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#be123c] hover:bg-[#e11d48] active:bg-[#881337] border border-[#f43f5e] shadow-[0_3px_0_#881337] active:shadow-none active:translate-y-0.5 flex items-center justify-center cursor-pointer transition-all"
                    aria-label="Button A (Select / Action)"
                  >
                    <span className="font-pixel text-[10px] sm:text-[11px] text-white">A</span>
                  </button>
                  <span className="font-pixel text-[7px] text-stone-400 mt-1">OK</span>
                </div>
              </div>

              {/* Speaker Grille in Bottom Right */}
              <div className="hidden xs:flex flex-col items-center gap-1 opacity-40 ml-1">
                <div className="flex items-center gap-1 rotate-35">
                  <span className="w-0.5 h-3.5 rounded-full bg-[#121318]" />
                  <span className="w-0.5 h-3.5 rounded-full bg-[#121318]" />
                  <span className="w-0.5 h-3.5 rounded-full bg-[#121318]" />
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
