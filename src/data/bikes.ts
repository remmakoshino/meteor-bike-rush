import type { BikeSpec } from '../types';

export const BIKES: BikeSpec[] = [
  {
    id: 'b_comet',
    name: 'コメットV1',
    stats: { maxSpeed: 355, acceleration: 2.8, handling: 2.2, drift: 2.6, weight: 2.0, offroad: 1.2, boostEfficiency: 1.0 }
  },
  {
    id: 'b_nova',
    name: 'ノヴァスプリント',
    stats: { maxSpeed: 332, acceleration: 3.3, handling: 2.9, drift: 3.1, weight: 1.7, offroad: 1.4, boostEfficiency: 1.15 }
  },
  {
    id: 'b_ion',
    name: 'イオンエッジ',
    stats: { maxSpeed: 340, acceleration: 3.0, handling: 3.2, drift: 3.0, weight: 1.8, offroad: 1.3, boostEfficiency: 1.08 }
  },
  {
    id: 'b_bastion',
    name: 'バスティオンGT',
    stats: { maxSpeed: 362, acceleration: 2.5, handling: 2.0, drift: 2.2, weight: 2.7, offroad: 1.0, boostEfficiency: 0.95 }
  },
  {
    id: 'b_aurora',
    name: 'オーロラR',
    stats: { maxSpeed: 336, acceleration: 3.4, handling: 2.8, drift: 3.2, weight: 1.6, offroad: 1.5, boostEfficiency: 1.18 }
  },
  {
    id: 'b_titan',
    name: 'タイタンX',
    stats: { maxSpeed: 368, acceleration: 2.3, handling: 1.9, drift: 2.1, weight: 3.0, offroad: 0.9, boostEfficiency: 0.92 }
  }
];
