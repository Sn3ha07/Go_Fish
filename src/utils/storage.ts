import { Task, UserStats, UserPreferences, CaughtRecord } from '../types';

const STORAGE_KEYS = {
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
    title: 'Water the plants & stretch for 5 mins',
    description: 'Quick breather away from screens.',
    estimatedMinutes: 5,
    importance: 'low',
    category: 'health',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 0,
    assignedFishSpeciesId: 'jelly'
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
    title: 'Write draft for creative essay',
    description: 'Jot down initial thoughts and outline.',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    estimatedMinutes: 45,
    importance: 'high',
    category: 'creative',
    completed: false,
    createdAt: new Date().toISOString(),
    caughtCount: 0,
    assignedFishSpeciesId: 'clown'
  }
];

export const INITIAL_STATS: UserStats = {
  pearls: 45,
  totalCompleted: 3
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
    taskTitle: 'Set up physical NFC fish tokens',
    taskCategory: 'work',
    fishSpeciesId: 'puffer',
    fishName: 'Puff',
    caughtAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    pearlsEarned: 15,
    selectionReason: 'Big task reeled in!'
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
  }
];

export function loadTasks(): Task[] {
  if (typeof window === 'undefined') return INITIAL_TASKS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveTasks(INITIAL_TASKS);
      return INITIAL_TASKS;
    }
    return JSON.parse(raw);
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
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
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
    const raw = localStorage.getItem(STORAGE_KEYS.PREFS);
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
    if (!raw) return INITIAL_JOURNAL;
    return JSON.parse(raw);
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
