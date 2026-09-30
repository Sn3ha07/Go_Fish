import { Task } from '../types';
import { getFishForTask } from '../data/fishCatalog';

/**
 * Generates a distinct direct URL specifically for any Chomp (Shark) task.
 * When visited, this URL bypasses the app dashboard and opens straight into
 * the Chomp task focus session.
 */
export function getChompDirectUrl(taskId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin + window.location.pathname);
  url.searchParams.set('chomp', taskId);
  return url.toString();
}

/**
 * Checks if a task is a Chomp task.
 */
export function isChompTask(task: Task): boolean {
  if (task.assignedFishSpeciesId === 'shark' || task.assignedFishSpeciesId === 'clown') {
    return true;
  }
  const fish = getFishForTask(task);
  return fish.id === 'shark';
}

/**
 * Copies the distinct Chomp task link to the clipboard.
 */
export async function copyChompDirectUrl(taskId: string): Promise<boolean> {
  const url = getChompDirectUrl(taskId);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  } catch (err) {
    console.error('Failed to copy direct Chomp URL', err);
    return false;
  }
}
