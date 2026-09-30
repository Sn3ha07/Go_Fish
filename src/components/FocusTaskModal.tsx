import React, { useState, useEffect } from 'react';
import { Task, FishSpecies } from '../types';
import { PixelFish } from './PixelFish';
import { Play, Pause, X, Check, Plus } from 'lucide-react';
import { playTaskComplete, playReelClick } from '../utils/audio';

interface FocusTaskModalProps {
  task: Task;
  fish: FishSpecies;
  soundEnabled: boolean;
  onCompleteTask: (task: Task, fish: FishSpecies) => void;
  onClose: () => void;
}

export const FocusTaskModal: React.FC<FocusTaskModalProps> = ({
  task,
  fish,
  soundEnabled,
  onCompleteTask,
  onClose
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(task.estimatedMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsRemaining]);

  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  const handleFinish = () => {
    playTaskComplete(soundEnabled);
    onCompleteTask(task, fish);
  };

  return (
    <div className="absolute inset-0 z-30 bg-[#0d1620]/95 gb-window flex flex-col justify-between p-3 overflow-y-auto animate-pop select-none">
      
      {/* Top Bar with Close Button */}
      <div className="flex items-center justify-between border-b-2 border-[#2b3e54] pb-1.5">
        <span className="font-pixel text-[9px] text-[#f8b800] tracking-wider uppercase">
          ▶ FOCUS SESSION
        </span>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1"
          title="Pause and return to pond"
          aria-label="Close focus session"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Companion & Title */}
      <div className="space-y-1.5 text-center my-auto py-1">
        <div className="flex justify-center">
          <PixelFish type={fish.type} size="md" animated={isRunning} />
        </div>
        <h2 className="text-xs font-bold text-white px-2 leading-snug">
          {task.title}
        </h2>
        <span className="text-[9px] font-pixel text-[#78d8a0] uppercase tracking-wider block">
          {task.category} · {task.importance}
        </span>

        {/* Big Bold 8-Bit Digital Timer Window */}
        <div className="py-2.5 px-4 rounded-lg bg-[#080d13] border-2 border-[#2b3e54] max-w-[210px] mx-auto mt-1 shadow-inner">
          <span className="font-pixel text-2xl sm:text-3xl font-bold tracking-widest text-[#f8b800] tabular-nums block drop-shadow-sm">
            {timeStr}
          </span>
          <span className="text-[8px] font-pixel text-stone-400 mt-1 block uppercase">
            {isRunning ? '▶ SESSION RUNNING' : '⏸ PAUSED'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 pt-1.5">
          <button
            onClick={() => {
              playReelClick(soundEnabled);
              setIsRunning(!isRunning);
            }}
            className="gb-button min-h-[30px] px-3 py-1 text-[9px] font-pixel rounded flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {isRunning ? (
              <>
                <Pause className="w-2.5 h-2.5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-2.5 h-2.5 fill-current text-[#f8b800]" />
                <span>RESUME</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              playReelClick(soundEnabled);
              setSecondsRemaining(prev => prev + 300);
            }}
            className="gb-button min-h-[30px] px-2.5 py-1 text-[9px] font-pixel rounded flex items-center gap-1 transition-colors cursor-pointer text-stone-300"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>+5M</span>
          </button>
        </div>
      </div>

      {/* Complete Task Primary Button */}
      <div className="pt-1.5">
        <button
          onClick={handleFinish}
          className="gb-button-primary w-full min-h-[38px] py-1.5 text-[10px] font-pixel rounded flex items-center justify-center gap-1.5 cursor-pointer bg-[#78d8a0] text-[#081820] hover:bg-[#8aecb0]"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>[A] TASK COMPLETE!</span>
        </button>
      </div>

    </div>
  );
};
