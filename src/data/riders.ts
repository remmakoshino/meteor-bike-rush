import type { RiderSpec } from '../types';

export const RIDERS: RiderSpec[] = [
  { id: 'r_akane', name: '緋坂アカネ', weightClass: 'light', color: '#ef4444', baseSkill: { handlingBonus: 1.2, itemLuck: 1.1 } },
  { id: 'r_rei', name: '蒼崎レイ', weightClass: 'middle', color: '#38bdf8', baseSkill: { handlingBonus: 1.0, itemLuck: 1.0 } },
  { id: 'r_tsubasa', name: '天羽ツバサ', weightClass: 'light', color: '#f59e0b', baseSkill: { handlingBonus: 1.3, itemLuck: 1.05 } },
  { id: 'r_kuro', name: '黒鐵ジン', weightClass: 'heavy', color: '#a3a3a3', baseSkill: { handlingBonus: 0.8, itemLuck: 0.95 } },
  { id: 'r_luna', name: '月島ルナ', weightClass: 'middle', color: '#a855f7', baseSkill: { handlingBonus: 1.1, itemLuck: 1.2 } },
  { id: 'r_sora', name: '空野ハヤテ', weightClass: 'middle', color: '#22c55e', baseSkill: { handlingBonus: 1.0, itemLuck: 1.0 } },
  { id: 'r_neo', name: 'ネオ・ヴェイル', weightClass: 'heavy', color: '#f97316', baseSkill: { handlingBonus: 0.9, itemLuck: 1.15 } },
  { id: 'r_mio', name: '雫ミオ', weightClass: 'light', color: '#14b8a6', baseSkill: { handlingBonus: 1.25, itemLuck: 1.1 } }
];
