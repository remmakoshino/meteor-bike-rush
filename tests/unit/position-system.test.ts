import { describe, expect, it } from 'vitest';
import { PositionSystem } from '../../src/systems/PositionSystem';
import type { DriverRuntime } from '../../src/types';

function createDriver(id: string, lap: number, checkpointIndex: number, distanceOnTrack: number): DriverRuntime {
  return {
    driverId: id,
    riderId: 'r_akane',
    bikeId: 'b_comet',
    isPlayer: false,
    lap,
    checkpointIndex,
    distanceOnTrack,
    rank: 0,
    speed: 0,
    heading: 0,
    driftLevel: 0,
    boostTimerMs: 0,
    stunTimerMs: 0,
    itemSlot: null,
    totalTimeMs: 0,
    lapTimesMs: [],
    finished: false,
    shieldTimerMs: 0,
    position: { x: 0, y: 0 }
  };
}

describe('PositionSystem', () => {
  it('orders drivers by lap, checkpoint, and distance', () => {
    const system = new PositionSystem();

    const a = createDriver('a', 2, 3, 20);
    const b = createDriver('b', 2, 2, 70);
    const c = createDriver('c', 1, 7, 71);

    const ordered = system.update([b, c, a]);

    expect(ordered[0]?.driverId).toBe('a');
    expect(ordered[1]?.driverId).toBe('b');
    expect(ordered[2]?.driverId).toBe('c');
    expect(a.rank).toBe(1);
    expect(b.rank).toBe(2);
    expect(c.rank).toBe(3);
  });
});
