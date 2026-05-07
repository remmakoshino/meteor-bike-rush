import { describe, expect, it } from 'vitest';
import { TRACKS } from '../../src/data/tracks';
import { ItemSystem } from '../../src/systems/ItemSystem';
import type { DriverRuntime } from '../../src/types';

function createDriver(id: string): DriverRuntime {
  return {
    driverId: id,
    riderId: 'r_akane',
    bikeId: 'b_comet',
    isPlayer: id === 'player',
    lap: 1,
    checkpointIndex: 0,
    distanceOnTrack: 0,
    rank: 8,
    speed: 160,
    heading: 0,
    driftLevel: 0,
    boostTimerMs: 0,
    stunTimerMs: 0,
    itemSlot: null,
    totalTimeMs: 1000,
    lapTimesMs: [],
    finished: false,
    shieldTimerMs: 0,
    position: { x: 0, y: 0 }
  };
}

describe('ItemSystem', () => {
  it('assigns an item when box is available', () => {
    const system = new ItemSystem();
    const track = TRACKS[0]!;
    const driver = createDriver('player');

    system.reset(track);
    const message = system.tryPickup(driver, 8, 0, track, 0);

    expect(message).not.toBeNull();
    expect(driver.itemSlot).not.toBeNull();
  });

  it('activates defensive item effects', () => {
    const system = new ItemSystem();
    const player = createDriver('player');
    const rival = createDriver('ai_1');

    player.itemSlot = 'fluxShield';
    const message = system.useItem(player, [player, rival]);

    expect(message).toContain('フラックスシールド');
    expect(player.shieldTimerMs).toBeGreaterThan(0);
  });
});
