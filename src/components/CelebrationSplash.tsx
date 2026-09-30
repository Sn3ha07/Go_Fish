import React, { useEffect } from 'react';
import { FishSpecies } from '../types';
import { PixelFish } from './PixelFish';
import { X } from 'lucide-react';

interface CelebrationSplashProps {
  taskTitle: string;
  fish: FishSpecies;
  pearlsEarned: number;
  onDismiss: () => void;
}

export const CelebrationSplash: React.FC<CelebrationSplashProps> = ({
  taskTitle,
  fish,
  onDismiss
}) => {
  useEffect(() => {
    const t = setTimeout(() => {
      onDismiss();
    }, 3200);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="absolute inset-0 z-30 bg-[#0d1620]/95 gb-window flex flex-col items-center justify-center p-4 text-center space-y-2.5 animate-pop select-none">
      
      <button
        onClick={onDismiss}
        className="absolute top-2.5 right-2.5 text-stone-400 hover:text-white p-1"
        aria-label="Close celebration"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#091017] rounded-lg border-2 border-[#78d8a0] shadow-inner">
        <PixelFish type={fish.type} size="md" animated={true} />
      </div>

      <div className="space-y-1">
        <span className="font-pixel text-[10px] text-[#78d8a0] uppercase block tracking-wider">
          ★ TASK COMPLETE! ★
        </span>
        <h3 className="text-xs font-bold text-white px-2 truncate max-w-[240px]">
          {taskTitle}
        </h3>
        <p className="text-[10px] text-stone-400 font-pixel">
          SAVED TO FISH BESTIARY!
        </p>
      </div>

      <div className="pt-2 w-full max-w-[190px]">
        <button
          onClick={onDismiss}
          className="gb-button-primary w-full min-h-[34px] py-1 text-[9px] font-pixel rounded cursor-pointer"
        >
          <span>[A] CONTINUE</span>
        </button>
      </div>

    </div>
  );
};
