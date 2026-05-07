import type { DriverRuntime } from '../types';

export class PositionSystem {
  update(drivers: DriverRuntime[]): DriverRuntime[] {
    const ordered = [...drivers].sort((a, b) => {
      if (a.finished && b.finished) {
        return a.totalTimeMs - b.totalTimeMs;
      }
      if (a.finished !== b.finished) {
        return a.finished ? -1 : 1;
      }
      if (a.lap !== b.lap) {
        return b.lap - a.lap;
      }
      if (a.checkpointIndex !== b.checkpointIndex) {
        return b.checkpointIndex - a.checkpointIndex;
      }
      if (a.distanceOnTrack !== b.distanceOnTrack) {
        return b.distanceOnTrack - a.distanceOnTrack;
      }
      return a.totalTimeMs - b.totalTimeMs;
    });

    ordered.forEach((driver, index) => {
      driver.rank = index + 1;
    });

    return ordered;
  }
}
