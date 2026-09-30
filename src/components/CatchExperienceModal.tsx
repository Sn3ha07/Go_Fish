import React from 'react';
import { Task, FishSpecies } from '../types';
import { PixelFish } from './PixelFish';
import { Clock, ArrowRight, RotateCcw, Calendar } from 'lucide-react';
import { playCatchFanfare, playThrowBack } from '../utils/audio';

interface CatchExperienceModalProps {
  task: Task;
  fish: FishSpecies;
  reason: string;
  soundEnabled: boolean;
  onKeepCatch: () => void;
  onThrowBack: () => void;
}

export const CatchExperienceModal: React.FC<CatchExperienceModalProps> = ({
  task,
  fish,
  reason,
  soundEnabled,
  onKeepCatch,
  onThrowBack
}) => {
  const handleThrow = () => {
    playThrowBack(soundEnabled);
    onThrowBack();
  };

  const handleKeep = () => {
    playCatchFanfare(soundEnabled);
    onKeepCatch();
  };

  return (
    <div className="absolute inset-0 z-30 bg-[#0d1620]/95 gb-window flex flex-col justify-between p-3.5 sm:p-4 overflow-y-auto animate-pop select-none">
      
      {/* Top Catch Header: Classic RPG Encounter Style */}
      <div className="text-center space-y-2 pt-1">
        <div className="w-16 h-16 mx-auto flex items-center justify-center bg-[#091017] rounded-xl border-2 border-[#2b3e54] shadow-inner">
          <PixelFish type={fish.type} size="md" animated={true} />
        </div>

        <div>
          <span className="font-pixel text-[10px] sm:text-xs text-[#f8b800] block tracking-wider">
            ★ HOOKED {fish.name.toUpperCase()}! ★
          </span>
          <p className="text-xs text-stone-300 font-sans mt-0.5 max-w-sm mx-auto">
            {reason}
          </p>
        </div>
      </div>

      {/* Task Details Dialogue Box */}
      <div className="gb-window p-3 rounded-xl space-y-1.5 my-2">
        <div className="flex items-center gap-2 text-[11px] font-sans text-stone-400">
          <span className="uppercase font-pixel text-[8px] text-[#78d8a0]">{task.category}</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-[#f8b800]">
            <Clock className="w-3 h-3" />
            {task.estimatedMinutes}m
          </span>
          <span>·</span>
          <span className="capitalize">{task.importance} Priority</span>
        </div>

        <h3 className="text-sm sm:text-base font-bold text-white font-sans leading-snug">
          {task.title}
        </h3>

        {task.description && (
          <p className="text-xs text-stone-300 font-sans leading-relaxed pt-1.5 border-t border-[#23354a]">
            {task.description}
          </p>
        )}

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="pt-2 border-t border-[#23354a] space-y-1">
            <span className="font-pixel text-[8px] text-[#2ec4b6] uppercase block">
              ⚡ MULTI-ACTION STEPS ({task.subtasks.length}):
            </span>
            <div className="space-y-0.5">
              {task.subtasks.slice(0, 3).map((st) => (
                <div key={st.id} className="text-xs text-stone-300 font-sans flex items-center gap-1.5 truncate">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ec4b6] shrink-0" />
                  <span className="truncate">{st.title}</span>
                </div>
              ))}
              {task.subtasks.length > 3 && (
                <span className="text-[10px] text-stone-400 font-sans pl-3 block">
                  +{task.subtasks.length - 3} more actions
                </span>
              )}
            </div>
          </div>
        )}

        {task.dueDate && (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-sans pt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>Due: {task.dueDate} {task.dueTime ? `@ ${task.dueTime}` : ''}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1 max-w-sm mx-auto w-full">
        <button
          onClick={handleKeep}
          className="gb-button-primary w-full min-h-[42px] py-2 text-xs font-pixel rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
          aria-label="Keep and Start Task"
        >
          <span>[A] KEEP & START FOCUS</span>
          <ArrowRight className="w-4 h-4 stroke-[3]" />
        </button>

        <button
          onClick={handleThrow}
          className="gb-button w-full min-h-[36px] py-1.5 text-[10px] font-pixel text-stone-300 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
          aria-label="Throw It Back into pond"
        >
          <RotateCcw className="w-3 h-3" />
          <span>[B] THROW BACK</span>
        </button>
      </div>

    </div>
  );
};
