import React, { useState, useEffect, useCallback } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { PondView } from './components/PondView';
import { TaskDeckView } from './components/TaskDeckView';
import { FishJournalView } from './components/FishJournalView';
import { SettingsModal } from './components/SettingsModal';
import { CatchExperienceModal } from './components/CatchExperienceModal';
import { FocusTaskModal } from './components/FocusTaskModal';
import { CelebrationSplash } from './components/CelebrationSplash';
import { GameBoyConsole } from './components/GameBoyConsole';

import { Task, UserStats, UserPreferences, CaughtRecord, FishSpecies, FishPosition } from './types';
import { 
  loadTasks, 
  saveTasks, 
  loadStats, 
  saveStats, 
  loadPreferences, 
  savePreferences, 
  loadJournal, 
  saveJournal,
  INITIAL_TASKS,
  INITIAL_STATS,
  INITIAL_PREFERENCES,
  INITIAL_JOURNAL
} from './utils/storage';
import { selectCatchTask, getFishForTask, CatchSelectionResult } from './data/fishCatalog';
import { isWebNfcSupported, startRealNfcScan, stopNfcScan } from './utils/nfc';
import { playWaterSplash, playReelClick } from './utils/audio';

// Helper to seed initial spread-out positions
function createInitialPositions(taskList: Task[]): Record<string, FishPosition> {
  const positions: Record<string, FishPosition> = {};
  const active = taskList.filter(t => !t.completed);
  active.forEach((task, idx) => {
    // Spread naturally across the expanded pond bounds (x: 16-80%, y: 16-76%)
    const x = 16 + ((idx * 27) % 58);
    const y = 16 + ((idx * 23) % 56);
    positions[task.id] = {
      x,
      y,
      facing: idx % 2 === 0 ? 'right' : 'left'
    };
  });
  return positions;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [stats, setStats] = useState<UserStats>(() => loadStats());
  const [preferences, setPreferences] = useState<UserPreferences>(() => loadPreferences());
  const [journal, setJournal] = useState<CaughtRecord[]>(() => loadJournal());

  // Persistent fish positions across screen navigation
  const [fishPositions, setFishPositions] = useState<Record<string, FishPosition>>(() => createInitialPositions(tasks));

  const [activeTab, setActiveTab] = useState<ActiveTab>('pond');
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isAddingTask, setIsAddingTask] = useState<boolean>(false);
  const [activeCatch, setActiveCatch] = useState<CatchSelectionResult | null>(null);
  const [focusedTask, setFocusedTask] = useState<{ task: Task; fish: FishSpecies } | null>(null);
  const [celebration, setCelebration] = useState<{
    taskTitle: string;
    fish: FishSpecies;
    pearlsEarned: number;
  } | null>(null);

  // NFC scanning state
  const [isNfcSupported, setIsNfcSupported] = useState<boolean>(false);
  const [isScanningNfc, setIsScanningNfc] = useState<boolean>(false);

  useEffect(() => {
    setIsNfcSupported(isWebNfcSupported());
  }, []);

  // Save changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveStats(stats);
  }, [stats]);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  useEffect(() => {
    saveJournal(journal);
  }, [journal]);

  // Very calm, slow swimming loop in the background:
  // Every 7.5 seconds, each fish glides gently by a small offset (3-8%)
  useEffect(() => {
    const interval = setInterval(() => {
      setFishPositions(prev => {
        const next: Record<string, FishPosition> = { ...prev };
        const active = tasks.filter(t => !t.completed);

        active.forEach((task, idx) => {
          // If a new task doesn't have a position yet, assign a gentle spot
          const current = next[task.id] || {
            x: 22 + ((idx * 27) % 54),
            y: 24 + ((idx * 21) % 44),
            facing: 'right'
          };

          // Very small, gentle drift (±5-8% max)
          const deltaX = (Math.random() - 0.5) * 14;
          const deltaY = (Math.random() - 0.5) * 10;
          const newX = Math.min(80, Math.max(15, current.x + deltaX));
          const newY = Math.min(76, Math.max(14, current.y + deltaY));
          const facing: 'left' | 'right' = newX >= current.x ? 'right' : 'left';

          next[task.id] = { x: newX, y: newY, facing };
        });

        return next;
      });
    }, 7500);

    return () => clearInterval(interval);
  }, [tasks]);

  // Audio toggle
  const handleToggleSound = useCallback(() => {
    setPreferences(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  // Task actions
  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt' | 'caughtCount'>) => {
    const newId = `task-${Date.now()}`;
    const newTask: Task = {
      ...newTaskData,
      id: newId,
      createdAt: new Date().toISOString(),
      caughtCount: 0
    };
    
    // Assign position for the new fish naturally
    setFishPositions(prev => ({
      ...prev,
      [newId]: {
        x: 25 + Math.random() * 48,
        y: 25 + Math.random() * 40,
        facing: Math.random() > 0.5 ? 'right' : 'left'
      }
    }));

    setTasks(prev => [newTask, ...prev]);
    playReelClick(preferences.soundEnabled);
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setFishPositions(prev => {
      const copy = { ...prev };
      delete copy[taskId];
      return copy;
    });
    if (focusedTask?.task.id === taskId) {
      setFocusedTask(null);
    }
  };

  // Fishing Catch triggers
  const handleFishForTask = () => {
    playWaterSplash(preferences.soundEnabled);
    const result = selectCatchTask(tasks, preferences.prioritization);
    if (result) {
      setActiveCatch(result);
    }
  };

  const handleCatchSpecificFish = (fish: FishSpecies) => {
    playWaterSplash(preferences.soundEnabled);
    const result = selectCatchTask(tasks, preferences.prioritization, fish);
    if (result) {
      setActiveCatch(result);
    }
  };

  const handleToggleNfcScan = async () => {
    if (isScanningNfc) {
      stopNfcScan();
      setIsScanningNfc(false);
    } else {
      setIsScanningNfc(true);
      const success = await startRealNfcScan(
        () => {
          handleFishForTask();
        },
        () => {
          setIsScanningNfc(false);
        }
      );
      if (!success) {
        setIsScanningNfc(false);
      }
    }
  };

  // Catch modal choice handlers
  const handleKeepCatch = () => {
    if (!activeCatch) return;
    const { task, fish } = activeCatch;
    setActiveCatch(null);
    setFocusedTask({ task, fish });
  };

  const handleThrowBack = () => {
    setActiveCatch(null);
  };

  // Complete Task
  const handleCompleteTask = (completedTask: Task, fish: FishSpecies) => {
    const updated = {
      ...completedTask,
      completed: true,
      completedAt: new Date().toISOString()
    };
    handleUpdateTask(updated);

    const pearlsEarned = completedTask.importance === 'high' ? 25 : completedTask.importance === 'medium' ? 15 : 10;

    setStats(prev => ({
      pearls: prev.pearls + pearlsEarned,
      totalCompleted: prev.totalCompleted + 1
    }));

    const record: CaughtRecord = {
      id: `record-${Date.now()}`,
      taskId: completedTask.id,
      taskTitle: completedTask.title,
      taskCategory: completedTask.category,
      fishSpeciesId: fish.id,
      fishName: fish.name,
      caughtAt: new Date().toISOString(),
      pearlsEarned,
      selectionReason: `Completed in focus session (${completedTask.estimatedMinutes}m)`
    };
    setJournal(prev => [record, ...prev]);

    setFocusedTask(null);
    setCelebration({
      taskTitle: completedTask.title,
      fish,
      pearlsEarned
    });
  };

  // Direct focus from task list
  const handleFocusDirectly = (task: Task) => {
    const fish = getFishForTask(task);
    setFocusedTask({ task, fish });
  };

  // Reset demo
  const handleResetData = () => {
    if (window.confirm('Reset tasks and logbook to initial demo state?')) {
      setTasks(INITIAL_TASKS);
      setStats(INITIAL_STATS);
      setPreferences(INITIAL_PREFERENCES);
      setJournal(INITIAL_JOURNAL);
      setFishPositions(createInitialPositions(INITIAL_TASKS));
      setActiveTab('pond');
      setIsMenuOpen(false);
    }
  };

  // Game Boy Physical Controls Handlers
  const handlePressA = () => {
    playReelClick(preferences.soundEnabled);
    if (celebration) {
      setCelebration(null);
    } else if (activeCatch) {
      handleKeepCatch();
    } else if (focusedTask) {
      handleCompleteTask(focusedTask.task, focusedTask.fish);
    } else if (activeTab === 'pond') {
      handleFishForTask();
    }
  };

  const handlePressB = () => {
    playReelClick(preferences.soundEnabled);
    if (celebration) {
      setCelebration(null);
    } else if (activeCatch) {
      handleThrowBack();
    } else if (focusedTask) {
      setFocusedTask(null);
    } else if (isMenuOpen) {
      setIsMenuOpen(false);
    } else if (activeTab !== 'pond') {
      setActiveTab('pond');
    }
  };

  const handlePressSelect = () => {
    playReelClick(preferences.soundEnabled);
    setIsMenuOpen(false);
    setActiveTab(prev => (prev === 'pond' ? 'tasks' : 'pond'));
  };

  const handlePressStart = () => {
    playReelClick(preferences.soundEnabled);
    setIsMenuOpen(prev => !prev);
  };

  const handlePressDpad = (dir: 'up' | 'down' | 'left' | 'right') => {
    playReelClick(preferences.soundEnabled);
    if (dir === 'left') {
      setActiveTab('pond');
      setIsMenuOpen(false);
    } else if (dir === 'right') {
      setActiveTab('tasks');
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="h-screen h-[100dvh] max-h-screen overflow-hidden bg-[#0e0f12] text-[#f4f4f5] flex items-center justify-center p-1 sm:p-2 select-none">
      
      {/* Handheld Game Boy Console Wrapper */}
      <GameBoyConsole
        onPressA={handlePressA}
        onPressB={handlePressB}
        onPressSelect={handlePressSelect}
        onPressStart={handlePressStart}
        onPressDpad={handlePressDpad}
        activeTab={activeTab}
      >
        {/* Top Navbar with Hamburger Menu */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          stats={stats}
          soundEnabled={preferences.soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenNewTask={() => {
            setActiveTab('tasks');
            setIsAddingTask(true);
            setIsMenuOpen(false);
          }}
          onResetData={handleResetData}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
        />

        {/* Screen Viewport */}
        <div className="relative flex-1 min-h-0 p-2 sm:p-2.5 overflow-y-auto">
          {activeTab === 'pond' && (
            <PondView
              tasks={tasks}
              fishPositions={fishPositions}
              onFishForTask={handleFishForTask}
              onCatchSpecificFish={handleCatchSpecificFish}
              onSelectTask={handleFocusDirectly}
              onOpenTasks={() => setActiveTab('tasks')}
              isNfcSupported={isNfcSupported}
              isScanningNfc={isScanningNfc}
              onToggleNfcScan={handleToggleNfcScan}
            />
          )}

          {activeTab === 'tasks' && (
            <TaskDeckView
              tasks={tasks}
              prioritization={preferences.prioritization}
              soundEnabled={preferences.soundEnabled}
              isAddingTask={isAddingTask}
              onCloseAddingTask={() => setIsAddingTask(false)}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onFocusTask={handleFocusDirectly}
              onOpenSettings={() => setActiveTab('settings')}
            />
          )}

          {activeTab === 'journal' && (
            <FishJournalView
              stats={stats}
              journal={journal}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsModal
              preferences={preferences}
              onUpdatePreferences={setPreferences}
              onResetData={handleResetData}
              onClose={() => setActiveTab('pond')}
            />
          )}

          {/* In-GameBoy Catch Experience Screen */}
          {activeCatch && (
            <CatchExperienceModal
              task={activeCatch.task}
              fish={activeCatch.fish}
              reason={activeCatch.reason}
              soundEnabled={preferences.soundEnabled}
              onKeepCatch={handleKeepCatch}
              onThrowBack={handleThrowBack}
            />
          )}

          {/* In-GameBoy Focus Session Screen */}
          {focusedTask && (
            <FocusTaskModal
              task={focusedTask.task}
              fish={focusedTask.fish}
              soundEnabled={preferences.soundEnabled}
              onCompleteTask={handleCompleteTask}
              onClose={() => setFocusedTask(null)}
            />
          )}

          {/* In-GameBoy Celebration Splash */}
          {celebration && (
            <CelebrationSplash
              taskTitle={celebration.taskTitle}
              fish={celebration.fish}
              pearlsEarned={celebration.pearlsEarned}
              onDismiss={() => setCelebration(null)}
            />
          )}
        </div>
      </GameBoyConsole>
    </div>
  );
}
