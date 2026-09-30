import React, { useState, useEffect } from 'react';
import { Task, FishSpecies, SubTask } from '../types';
import { PixelFish } from './PixelFish';
import { Play, Pause, X, Check, Plus, CheckCircle, Circle, ListOrdered } from 'lucide-react';
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
  const [subtasks, setSubtasks] = useState<SubTask[]>(task.subtasks || []);
  const [newStepText, setNewStepText] = useState<string>('');
  const [showAddStep, setShowAddStep] = useState<boolean>(false);

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

  const handleToggleStep = (stepId: string) => {
    playReelClick(soundEnabled);
    setSubtasks(prev =>
      prev.map(st => (st.id === stepId ? { ...st, completed: !st.completed } : st))
    );
  };

  const handleAddLiveStep = () => {
    if (!newStepText.trim()) return;
    playReelClick(soundEnabled);
    const newStep: SubTask = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title: newStepText.trim(),
      completed: false
    };
    setSubtasks(prev => [...prev, newStep]);
    setNewStepText('');
    setShowAddStep(false);
  };

  const handleFinish = () => {
    playTaskComplete(soundEnabled);
    const updatedTask: Task = {
      ...task,
      subtasks: subtasks.length > 0 ? subtasks : undefined
    };
    onCompleteTask(updatedTask, fish);
  };

  const completedCount = subtasks.filter(s => s.completed).length;

  return (
    <div className="absolute inset-0 z-30 bg-[#0d1620]/95 gb-window flex flex-col justify-between p-3 overflow-y-auto animate-pop select-none">
      
      {/* Top Bar with Close Button */}
      <div className="flex items-center justify-between border-b-2 border-[#2b3e54] pb-1.5 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="font-pixel text-[9px] text-[#f8b800] tracking-wider uppercase">
            ▶ FOCUS SESSION
          </span>
          {fish.id === 'jelly' && (
            <span className="font-pixel text-[8px] px-1 py-0.5 rounded bg-[#2ec4b6]/20 text-[#2ec4b6]">
              BOBA's ACTIONS
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-stone-400 hover:text-white p-1 cursor-pointer"
          title="Pause and return to pond"
          aria-label="Close focus session"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Focus Body */}
      <div className="space-y-1.5 text-center my-auto py-1">
        <div className="flex justify-center">
          <PixelFish type={fish.type} size="md" animated={isRunning} />
        </div>
        <h2 className="text-xs sm:text-sm font-bold text-white px-2 leading-snug font-sans">
          {task.title}
        </h2>
        <span className="text-[9px] font-pixel text-[#78d8a0] uppercase tracking-wider block">
          {task.category} · {task.importance}
        </span>

        {/* Big Bold 8-Bit Digital Timer Window */}
        <div className="py-2 px-4 rounded-lg bg-[#080d13] border-2 border-[#2b3e54] max-w-[200px] mx-auto shadow-inner">
          <span className="font-pixel text-2xl sm:text-3xl font-bold tracking-widest text-[#f8b800] tabular-nums block drop-shadow-sm">
            {timeStr}
          </span>
          <span className="text-[8px] font-pixel text-stone-400 mt-0.5 block uppercase">
            {isRunning ? '▶ SESSION RUNNING' : '⏸ PAUSED'}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => {
              playReelClick(soundEnabled);
              setIsRunning(!isRunning);
            }}
            className="gb-button min-h-[28px] px-3 py-1 text-[9px] font-pixel rounded flex items-center gap-1.5 transition-colors cursor-pointer"
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
            className="gb-button min-h-[28px] px-2.5 py-1 text-[9px] font-pixel rounded flex items-center gap-1 transition-colors cursor-pointer text-stone-300"
          >
            <Plus className="w-2.5 h-2.5" />
            <span>+5M</span>
          </button>
        </div>

        {/* Boba's Interactive Multi-Action Checklist */}
        <div className="gb-window p-2 rounded-xl text-left space-y-1.5 my-2 max-h-36 overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[9px] font-pixel text-[#2ec4b6]">
              <ListOrdered className="w-3 h-3" />
              <span>ACTION STEPS ({completedCount}/{subtasks.length})</span>
            </div>
            {subtasks.length > 0 && subtasks.every(s => s.completed) && (
              <span className="font-pixel text-[8px] text-[#f8b800]">ALL COMPLETE! ★</span>
            )}
          </div>

          {subtasks.length === 0 ? (
            <p className="text-[11px] text-stone-400 font-sans italic">
              No sub-actions added yet. Tap below to break this task down into bite-sized steps!
            </p>
          ) : (
            <div className="space-y-1">
              {subtasks.map((step) => (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => handleToggleStep(step.id)}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 text-left text-xs font-sans transition-colors cursor-pointer border border-transparent hover:border-[#2b3e54]"
                >
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-[#2ec4b6] shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-stone-500 shrink-0" />
                  )}
                  <span className={`flex-1 truncate ${step.completed ? 'line-through text-stone-500' : 'text-stone-200'}`}>
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Quick inline step addition */}
          {showAddStep ? (
            <div className="flex items-center gap-1 pt-1 border-t border-[#23354a]">
              <input
                type="text"
                autoFocus
                placeholder="Action step title..."
                value={newStepText}
                onChange={(e) => setNewStepText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddLiveStep();
                  }
                }}
                className="flex-1 h-7 px-2 bg-[#080d13] border border-[#2b3e54] rounded text-xs font-sans text-white focus:outline-none focus:border-[#2ec4b6]"
              />
              <button
                type="button"
                onClick={handleAddLiveStep}
                className="gb-button h-7 px-2 text-[9px] font-pixel text-[#2ec4b6] rounded cursor-pointer"
              >
                ADD
              </button>
              <button
                type="button"
                onClick={() => setShowAddStep(false)}
                className="text-stone-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddStep(true)}
              className="text-[10px] font-pixel text-[#2ec4b6] hover:text-[#5eead4] flex items-center gap-1 pt-0.5 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>+ ADD ACTION STEP</span>
            </button>
          )}
        </div>
      </div>

      {/* Complete Task Primary Button */}
      <div className="pt-1 shrink-0">
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
