import type { UserProgress } from "@/lib/types/roadmap";

const STORAGE_PREFIX = "skillorbit_progress_";

export function saveProgress(careerId: number, completedSubModules: string[], moduleProgress: Record<string, number>, overallProgress: number): void {
  const progress: UserProgress = {
    careerId,
    completedSubModules,
    moduleProgress,
    overallProgress,
    lastUpdated: new Date(),
  };

  localStorage.setItem(`${STORAGE_PREFIX}${careerId}`, JSON.stringify(progress));
}

export function loadProgress(careerId: number): UserProgress | null {
  const stored = localStorage.getItem(`${STORAGE_PREFIX}${careerId}`);
  if (!stored) return null;

  try {
    const progress = JSON.parse(stored);
    progress.lastUpdated = new Date(progress.lastUpdated);
    return progress;
  } catch {
    return null;
  }
}

export function calculateModuleProgress(completedCount: number, totalCount: number): number {
  if (totalCount === 0) return 0;
  return Math.round((completedCount / totalCount) * 100);
}

export function calculateOverallProgress(moduleProgress: Record<string, number>): number {
  const progressValues = Object.values(moduleProgress);
  if (progressValues.length === 0) return 0;

  const sum = progressValues.reduce((acc, val) => acc + val, 0);
  return Math.round(sum / progressValues.length);
}

export function updateModuleStatus(progress: number): 'pending' | 'in-progress' | 'completed' {
  if (progress === 0) return 'pending';
  if (progress === 100) return 'completed';
  return 'in-progress';
}

export function clearProgress(careerId: number): void {
  localStorage.removeItem(`${STORAGE_PREFIX}${careerId}`);
}

export function getAllProgress(): Record<number, UserProgress> {
  const allProgress: Record<number, UserProgress> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX)) {
      const careerId = parseInt(key.replace(STORAGE_PREFIX, ""));
      const progress = loadProgress(careerId);
      if (progress) {
        allProgress[careerId] = progress;
      }
    }
  }

  return allProgress;
}
