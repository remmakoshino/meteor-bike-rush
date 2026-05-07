export type GameMode = 'grandPrix' | 'timeAttack';
export type RacePhase = 'countdown' | 'running' | 'finished';
export type DriftLevel = 0 | 1 | 2 | 3;
export type Difficulty = 'normal' | 'hard' | 'expert';

export type ItemId =
  | 'sparkBolt'
  | 'slipMist'
  | 'pulseRing'
  | 'fluxShield'
  | 'reflectCore'
  | 'cometBooster'
  | 'twinTurbo'
  | 'overdrive'
  | 'gravityField'
  | 'noisePulse';

export interface RiderSpec {
  id: string;
  name: string;
  weightClass: 'light' | 'middle' | 'heavy';
  color: string;
  baseSkill: {
    handlingBonus: number;
    itemLuck: number;
  };
}

export interface BikeSpec {
  id: string;
  name: string;
  stats: {
    maxSpeed: number;
    acceleration: number;
    handling: number;
    drift: number;
    weight: number;
    offroad: number;
    boostEfficiency: number;
  };
}

export interface DriverRuntime {
  driverId: string;
  riderId: string;
  bikeId: string;
  isPlayer: boolean;
  lap: number;
  checkpointIndex: number;
  distanceOnTrack: number;
  rank: number;
  speed: number;
  heading: number;
  driftLevel: DriftLevel;
  boostTimerMs: number;
  stunTimerMs: number;
  itemSlot: ItemId | null;
  totalTimeMs: number;
  lapTimesMs: number[];
  finished: boolean;
  shieldTimerMs: number;
  position: {
    x: number;
    y: number;
  };
}

export interface HazardDef {
  id: string;
  type: 'oil' | 'pulse' | 'slowZone';
  x: number;
  y: number;
  radius: number;
  power: number;
}

export interface TrackDef {
  id: string;
  name: string;
  cupId: string;
  laps: number;
  length: number;
  checkpoints: Array<{ x: number; y: number; radius: number }>;
  aiPath: Array<{ x: number; y: number; speedHint: number }>;
  hazards: HazardDef[];
  itemBoxes: Array<{ x: number; y: number; respawnMs: number }>;
  startGrid: Array<{ x: number; y: number; heading: number }>;
  backgroundTheme: 'city' | 'ice' | 'volcano' | 'forest' | 'desert' | 'ocean' | 'space';
}

export interface RaceState {
  mode: GameMode;
  phase: RacePhase;
  trackId: string;
  drivers: DriverRuntime[];
  countdownMs: number;
  elapsedMs: number;
  playerId: string;
  difficulty: Difficulty;
}

export interface SaveData {
  version: number;
  unlockedRiders: string[];
  unlockedBikes: string[];
  clearedCups: string[];
  bestTimesByTrack: Record<string, number>;
  settings: {
    masterVolume: number;
    seVolume: number;
    bgmVolume: number;
    difficulty: Difficulty;
  };
}

export interface ItemDefinition {
  id: ItemId;
  name: string;
  category: 'attack' | 'defense' | 'boost' | 'jam';
  durationMs?: number;
  power: number;
}

export interface RaceInput {
  throttle: boolean;
  brake: boolean;
  turnLeft: boolean;
  turnRight: boolean;
  drift: boolean;
}

export interface LapUpdate {
  lapAdvanced: boolean;
  finished: boolean;
}

export interface GameFlowContext {
  mode: GameMode;
  difficulty: Difficulty;
  riderId: string;
  bikeId: string;
  cupId: string;
  trackId: string;
  roundIndex: number;
}

export interface RaceResult {
  finishedOrder: Array<{
    driverId: string;
    riderId: string;
    bikeId: string;
    rank: number;
    totalTimeMs: number;
    isPlayer: boolean;
  }>;
  flow: GameFlowContext;
}
