import type { ItemDefinition, ItemId } from '../types';

export const ITEM_DEFINITIONS: Record<ItemId, ItemDefinition> = {
  sparkBolt: { id: 'sparkBolt', name: 'スパークボルト', category: 'attack', power: 1.1 },
  slipMist: { id: 'slipMist', name: 'スリップミスト', category: 'attack', power: 1.0 },
  pulseRing: { id: 'pulseRing', name: 'パルスリング', category: 'attack', power: 1.2 },
  fluxShield: { id: 'fluxShield', name: 'フラックスシールド', category: 'defense', durationMs: 3000, power: 1.0 },
  reflectCore: { id: 'reflectCore', name: 'リフレクトコア', category: 'defense', durationMs: 2200, power: 1.0 },
  cometBooster: { id: 'cometBooster', name: 'コメットブースター', category: 'boost', durationMs: 1400, power: 1.2 },
  twinTurbo: { id: 'twinTurbo', name: 'ツインターボ', category: 'boost', durationMs: 2000, power: 1.0 },
  overdrive: { id: 'overdrive', name: 'オーバードライブ', category: 'boost', durationMs: 2800, power: 1.35 },
  gravityField: { id: 'gravityField', name: 'グラビティフィールド', category: 'jam', durationMs: 2400, power: 1.1 },
  noisePulse: { id: 'noisePulse', name: 'ノイズパルス', category: 'jam', durationMs: 1800, power: 1.0 }
};

export const ITEM_WEIGHT_TABLE: Record<ItemId, [number, number, number, number, number, number, number, number]> = {
  sparkBolt: [2.5, 2.3, 2.2, 2.0, 1.8, 1.5, 1.2, 0.8],
  slipMist: [1.8, 1.8, 1.9, 2.0, 1.9, 1.7, 1.4, 1.0],
  pulseRing: [0.5, 0.7, 0.9, 1.1, 1.3, 1.5, 1.6, 1.8],
  fluxShield: [3.0, 2.7, 2.5, 2.2, 1.8, 1.4, 1.0, 0.8],
  reflectCore: [1.4, 1.5, 1.6, 1.5, 1.3, 1.1, 0.9, 0.7],
  cometBooster: [0.6, 0.9, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2],
  twinTurbo: [0.4, 0.7, 1.0, 1.3, 1.7, 2.1, 2.4, 2.8],
  overdrive: [0.1, 0.2, 0.4, 0.8, 1.3, 1.8, 2.5, 3.1],
  gravityField: [0.2, 0.3, 0.4, 0.6, 0.9, 1.4, 2.1, 2.6],
  noisePulse: [0.3, 0.3, 0.4, 0.6, 0.8, 1.2, 1.7, 2.2]
};
