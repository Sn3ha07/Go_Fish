import { Task, UserStats, UserPreferences, CaughtRecord } from '../types';

const STORAGE_KEYS = {
  TASKS: 'gofish_tasks_v3',
  STATS: 'gofish_stats_v3',
  PREFS: 'gofish_prefs_v3',
  JOURNAL: 'gofish_journal_v3'
};

const LEGACY_STORAGE_KEYS = {
  TASKS: 'little_catch_tasks_v2',
  STATS: 'little_catch_stats_v2',
  PREFS: 'little_catch_prefs_v2',
  JOURNAL: 'little_catch_journal_v2'
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 't-1',
    title: 'Review team project roadmap',
    description: 'Outline key weekly milestones and priorities.',
    dueDate: new Date().toISOString().split('T')[0],
    dueTime: '16:00',
    estimatedMinutes: 30,
    importance: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 1,
    assignedFishSpeciesId: 'bluefin'
  },
  {
    id: 't-2',
    title: 'Morning reset routine',
    description: 'Multi-action sequence to recharge body and mind.',
    estimatedMinutes: 10,
    importance: 'medium',
    category: 'health',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 0,
    assignedFishSpeciesId: 'jelly',
    subtasks: [
      { id: 'st-1', title: 'Hydrate with a tall glass of water', completed: false },
      { id: 'st-2', title: 'Stretch neck, shoulders & spine for 3m', completed: false },
      { id: 'st-3', title: 'Review today’s top priority tasks', completed: false }
    ]
  },
  {
    id: 't-3',
    title: 'Organize desktop and clear downloads',
    description: 'Archive old files and tidy up workspace.',
    estimatedMinutes: 15,
    importance: 'medium',
    category: 'personal',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 0,
    assignedFishSpeciesId: 'goldie'
  },
  {
    id: 't-4',
    title: 'Write draft for creative project',
    description: 'Sunk teeth into big ideas and concept storyboard.',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedMinutes: 45,
    importance: 'high',
    category: 'creative',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 0,
    assignedFishSpeciesId: 'shark'
  },
  {
    id: 't-5',
    title: 'Extended deep cleanup & system backup',
    description: 'Long multi-step session to organize project archives.',
    estimatedMinutes: 35,
    importance: 'high',
    category: 'work',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 0,
    assignedFishSpeciesId: 'longfish'
  }
];

export const INITIAL_STATS: UserStats = {
  pearls: 60,
  totalCompleted: 4
};

export const INITIAL_PREFERENCES: UserPreferences = {
  soundEnabled: false, // Quiet by default!
  reducedMotion: false,
  prioritization: {
    mode: 'combined',
    durationPreference: 'balanced',
    dueWeight: 50,
    importanceWeight: 30,
    durationWeight: 20
  }
};

export const INITIAL_JOURNAL: CaughtRecord[] = [
  {
    id: 'log-1',
    taskId: 'seed-1',
    taskTitle: 'Plan quarterly project roadmap',
    taskCategory: 'work',
    fishSpeciesId: 'longfish',
    fishName: 'Noodle',
    caughtAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    pearlsEarned: 15,
    selectionReason: 'Extended task reeled in by Noodle!'
  },
  {
    id: 'log-2',
    taskId: 'seed-2',
    taskTitle: 'Tidy up workbench',
    taskCategory: 'home',
    fishSpeciesId: 'goldie',
    fishName: 'Goldie',
    caughtAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    pearlsEarned: 10,
    selectionReason: 'Quick 10m sprint'
  },
  {
    id: 'log-3',
    taskId: 'seed-3',
    taskTitle: 'Design playful brand moodboard',
    taskCategory: 'creative',
    fishSpeciesId: 'shark',
    fishName: 'Chomp',
    caughtAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    pearlsEarned: 20,
    selectionReason: 'Chomp took a big bite out of creative design!'
  }
];

function normalizeFishId(id?: string): string | undefined {
  if (id === 'clown') return 'shark';
  if (id === 'puffer') return 'longfish';
  return id;
}

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      // Check legacy migration
      const legacy = localStorage.getItem(LEGACY_STORAGE_KEYS.TASKS);
      if (legacy) {
        const parsed: Task[] = JSON.parse(legacy);
        const migrated = parsed.map(t => ({
          ...t,
          assignedFishSpeciesId: normalizeFishId(t.assignedFishSpeciesId)
        }));
        saveTasks(migrated);
        return migrated;
      }
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    const parsed: Task[] = JSON.parse(raw);
    return parsed.map(t => ({
      ...t,
      assignedFishSpeciesId: normalizeFishId(t.assignedFishSpeciesId)
    }));
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: Task[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch {
    // Ignore
  }
}

export function loadStats(): UserStats {
  if (typeof window === 'undefined') return INITIAL_STATS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS) || localStorage.getItem(LEGACY_STORAGE_KEYS.STATS);
    if (!raw) return INITIAL_STATS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_STATS;
  }
}

export function saveStats(stats: UserStats) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {
    // Ignore
  }
}

export function loadPreferences(): UserPreferences {
  if (typeof window === 'undefined') return INITIAL_PREFERENCES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS) || localStorage.getItem(LEGACY_STORAGE_KEYS.PREFS);
    if (!raw) return INITIAL_PREFERENCES;
    return JSON.parse(raw);
  } catch {
    return INITIAL_PREFERENCES;
  }
}

export function savePreferences(prefs: UserPreferences) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(prefs));
  } catch {
    // Ignore
  }
}

export function loadJournal(): CaughtRecord[] {
  if (typeof window === 'undefined') return INITIAL_JOURNAL;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.JOURNAL);
    if (!raw) {
      saveJournal(INITIAL_JOURNAL);
      return INITIAL_JOURNAL;
    }
    const parsed: CaughtRecord[] = JSON.parse(raw);
    return parsed.map(j => ({
      ...j,
      fishSpeciesId: normalizeFishId(j.fishSpeciesId) || 'goldie',
      fishName: j.fishSpeciesId === 'clown' ? 'Chomp' : j.fishSpeciesId === 'puffer' ? 'Noodle' : j.fishName
    }));
  } catch {
    return INITIAL_JOURNAL;
  }
}

export function saveJournal(journal: CaughtRecord[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(journal));
  } catch {
    // Ignore
  }
}

export function resetAllStorage() {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    Object.values(LEGACY_STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
  } catch {
    // Ignore
  }
}
