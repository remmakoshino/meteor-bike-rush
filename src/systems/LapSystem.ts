import type { DriverRuntime, LapUpdate, TrackDef } from '../types';
import { distanceSq } from '../utils/math';

export class LapSystem {
  private lastLapTimeByDriver = new Map<string, number>();

  register(drivers: DriverRuntime[]): void {
    this.lastLapTimeByDriver.clear();
    for (const driver of drivers) {
      this.lastLapTimeByDriver.set(driver.driverId, 0);
    }
  }

  updateDriver(driver: DriverRuntime, track: TrackDef): LapUpdate {
    if (driver.finished) {
      return { lapAdvanced: false, finished: true };
    }

    const checkpoints = track.checkpoints;
    const nextCheckpoint = (driver.checkpointIndex + 1) % checkpoints.length;
    const checkpoint = checkpoints[nextCheckpoint]!;

    if (distanceSq(driver.position.x, driver.position.y, checkpoint.x, checkpoint.y) > checkpoint.radius * checkpoint.radius) {
      return { lapAdvanced: false, finished: false };
    }

    driver.checkpointIndex = nextCheckpoint;

    if (nextCheckpoint !== 0) {
      return { lapAdvanced: false, finished: false };
    }

    driver.lap += 1;
    const lastTime = this.lastLapTimeByDriver.get(driver.driverId) ?? 0;
    driver.lapTimesMs.push(driver.totalTimeMs - lastTime);
    this.lastLapTimeByDriver.set(driver.driverId, driver.totalTimeMs);

    if (driver.lap > track.laps) {
      driver.finished = true;
      return { lapAdvanced: true, finished: true };
    }

    return { lapAdvanced: true, finished: false };
  }
}
