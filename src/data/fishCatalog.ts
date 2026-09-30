import { Task, PrioritizationSettings, TaskCategory } from '../types';
import { CuteFishData, CUTE_FISH_ROSTER, CuteFishType } from '../components/PixelFish';

export interface FishSpecies {
  id: string;
  name: string;
  type: CuteFishType;
  color: string;
  tag: string;
  personality: string;
  nfcTagUid: string;
  vibe: string;
}

export const FISH_SPECIES: FishSpecies[] = CUTE_FISH_ROSTER.map(f => ({
  id: f.id,
  name: f.name,
  type: f.type,
  color: f.color,
  tag: f.tag,
  personality: f.personality,
  nfcTagUid: f.nfcUid,
  vibe: f.tag
}));

export function getFishById(id: string): FishSpecies {
  const normalized = id === 'puffer' ? 'longfish' : id === 'clown' ? 'shark' : id;
  return FISH_SPECIES.find(f => f.id === normalized) || FISH_SPECIES[0];
}

export function getFishByNfcUid(uid: string): FishSpecies | undefined {
  const clean = uid.trim().toUpperCase();
  return FISH_SPECIES.find(f => f.nfcTagUid.toUpperCase() === clean || f.id.toUpperCase() === clean);
}

export function getFishForTask(task: Task): FishSpecies {
  // 1. Explicit user assignment
  if (task.assignedFishSpeciesId) {
    const matched = FISH_SPECIES.find(f => f.id === task.assignedFishSpeciesId);
    if (matched) return matched;
    if (task.assignedFishSpeciesId === 'puffer') return getFishById('longfish');
    if (task.assignedFishSpeciesId === 'clown') return getFishById('shark');
  }

  // 2. Multi-Action Checklist / Staged Tasks -> Boba the Jellyfish
  if (task.subtasks && task.subtasks.length > 0) {
    return getFishById('jelly');
  }

  // 3. Urgent Deadlines (due date set) -> Finn the Bluefin
  if (task.dueDate) {
    return getFishById('bluefin');
  }

  // 4. Hard / High-Stakes / Big Bites / Creative -> Chomp the Shark
  if (task.importance === 'high' || task.category === 'creative') {
    return getFishById('shark');
  }

  // 5. Deep Marathon Immersion (>= 45m) -> Moby the Whale
  if (task.estimatedMinutes >= 45) {
    return getFishById('whale');
  }

  // 6. Extended Duration Tasks (25m - 44m) -> Noodle the Long Fish
  if (task.estimatedMinutes >= 25) {
    return getFishById('longfish');
  }

  // 7. Quick Sprint (<= 15m) -> Goldie
  if (task.estimatedMinutes <= 15) {
    return getFishById('goldie');
  }

  // 8. Study / structured category default -> Boba
  if (task.category === 'study') {
    return getFishById('jelly');
  }

  return getFishById('goldie');
}

export interface CatchSelectionResult {
  task: Task;
  fish: FishSpecies;
  reason: string;
}

export function selectCatchTask(
  availableTasks: Task[],
  settings: PrioritizationSettings,
  specificFish?: FishSpecies
): CatchSelectionResult | null {
  const uncompleted = availableTasks.filter(t => !t.completed);
  if (uncompleted.length === 0) return null;

  // If a specific fish was scanned / hooked:
  if (specificFish) {
    // 1. Check if pinned
    const pinned = uncompleted.find(t => 
      t.assignedFishSpeciesId === specificFish.id ||
      (specificFish.id === 'longfish' && t.assignedFishSpeciesId === 'puffer') ||
      (specificFish.id === 'shark' && t.assignedFishSpeciesId === 'clown')
    );
    if (pinned) {
      return {
        task: pinned,
        fish: specificFish,
        reason: `Linked directly to ${specificFish.name}!`
      };
    }

    // 2. Or pick task matching fish's vibe
    let candidates = uncompleted;
    if (specificFish.id === 'goldie') {
      candidates = uncompleted.filter(t => t.estimatedMinutes <= 15);
    } else if (specificFish.id === 'bluefin') {
      candidates = uncompleted.filter(t => !!t.dueDate);
    } else if (specificFish.id === 'longfish' || specificFish.id === 'puffer') {
      candidates = uncompleted.filter(t => t.importance === 'high' || t.estimatedMinutes >= 30);
    } else if (specificFish.id === 'jelly') {
      candidates = uncompleted.filter(t => (t.subtasks && t.subtasks.length > 0) || t.category === 'study');
    } else if (specificFish.id === 'shark' || specificFish.id === 'clown') {
      candidates = uncompleted.filter(t => t.category === 'creative' || t.category === 'personal');
    }

    const chosen = (candidates.length > 0 ? candidates : uncompleted)[0];
    return {
      task: chosen,
      fish: specificFish,
      reason: `Hooked by ${specificFish.name} (${specificFish.tag})`
    };
  }

  // Sort based on simple mode
  const sorted = [...uncompleted].sort((a, b) => {
    if (settings.mode === 'due_date') {
      if (a.dueDate && !b.dueDate) return -1;
      if (!a.dueDate && b.dueDate) return 1;
      return (a.dueDate || '').localeCompare(b.dueDate || '');
    }
    if (settings.mode === 'importance') {
      const impWeight = { high: 3, medium: 2, low: 1 };
      return impWeight[b.importance] - impWeight[a.importance];
    }
    if (settings.mode === 'duration') {
      return a.estimatedMinutes - b.estimatedMinutes;
    }
    if (settings.mode === 'random') {
      return 0.5 - Math.random();
    }
    // Combined / default:
    const impWeight = { high: 20, medium: 10, low: 0 };
    const scoreA = impWeight[a.importance] + (a.dueDate ? 15 : 0) - (a.estimatedMinutes > 40 ? 5 : 0);
    const scoreB = impWeight[b.importance] + (b.dueDate ? 15 : 0) - (b.estimatedMinutes > 40 ? 5 : 0);
    return scoreB - scoreA;
  });

  const chosenTask = sorted[0];
  const fish = getFishForTask(chosenTask);

  let reason = 'Next priority in your pond';
  if (chosenTask.dueDate) {
    reason = `Due soon: ${chosenTask.dueDate}`;
  } else if (chosenTask.importance === 'high') {
    reason = 'Important task waiting for you';
  } else if (chosenTask.estimatedMinutes <= 15) {
    reason = `Quick ${chosenTask.estimatedMinutes}m sprint`;
  }

  return {
    task: chosenTask,
    fish,
    reason
  };
}
