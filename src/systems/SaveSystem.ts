import type { SaveData } from '../types';

const STORAGE_KEY = 'meteor-bike-rush-save-v1';

const DEFAULT_SAVE: SaveData = {
  version: 1,
  unlockedRiders: ['r_akane', 'r_rei', 'r_tsubasa'],
  unlockedBikes: ['b_comet', 'b_nova', 'b_ion'],
  clearedCups: [],
  bestTimesByTrack: {},
  settings: {
    masterVolume: 0.8,
    seVolume: 0.9,
    bgmVolume: 0.7,
    difficulty: 'normal'
  }
};

export class SaveSystem {
  load(): SaveData {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return structuredClone(DEFAULT_SAVE);
      }
      const parsed = JSON.parse(raw) as Partial<SaveData>;
      return {
        version: 1,
        unlockedRiders: parsed.unlockedRiders ?? [...DEFAULT_SAVE.unlockedRiders],
        unlockedBikes: parsed.unlockedBikes ?? [...DEFAULT_SAVE.unlockedBikes],
        clearedCups: parsed.clearedCups ?? [],
        bestTimesByTrack: parsed.bestTimesByTrack ?? {},
        settings: {
          masterVolume: parsed.settings?.masterVolume ?? DEFAULT_SAVE.settings.masterVolume,
          seVolume: parsed.settings?.seVolume ?? DEFAULT_SAVE.settings.seVolume,
          bgmVolume: parsed.settings?.bgmVolume ?? DEFAULT_SAVE.settings.bgmVolume,
          difficulty: parsed.settings?.difficulty ?? DEFAULT_SAVE.settings.difficulty
        }
      };
    } catch {
      return structuredClone(DEFAULT_SAVE);
    }
  }

  save(data: SaveData): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  setBestTime(trackId: string, timeMs: number): SaveData {
    const save = this.load();
    const prev = save.bestTimesByTrack[trackId];
    if (typeof prev !== 'number' || timeMs < prev) {
      save.bestTimesByTrack[trackId] = timeMs;
      this.save(save);
    }
    return save;
  }

  markCupCleared(cupId: string): SaveData {
    const save = this.load();
    if (!save.clearedCups.includes(cupId)) {
      save.clearedCups.push(cupId);
      this.save(save);
    }
    return save;
  }
}
