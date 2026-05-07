import type { DriftLevel, DriverRuntime } from '../types';

const LEVEL_1_MS = 550;
const LEVEL_2_MS = 1300;
const LEVEL_3_MS = 2200;

export class DriftSystem {
  private chargeByDriver = new Map<string, number>();

  update(driver: DriverRuntime, isDrifting: boolean, isTurning: boolean, dtMs: number): DriftLevel {
    const key = driver.driverId;
    const current = this.chargeByDriver.get(key) ?? 0;

    if (isDrifting && isTurning && driver.speed > 100) {
      const next = current + dtMs;
      this.chargeByDriver.set(key, next);

      if (next >= LEVEL_3_MS) {
        driver.driftLevel = 3;
      } else if (next >= LEVEL_2_MS) {
        driver.driftLevel = 2;
      } else if (next >= LEVEL_1_MS) {
        driver.driftLevel = 1;
      }
      return 0;
    }

    const released = driver.driftLevel;
    driver.driftLevel = 0;
    this.chargeByDriver.set(key, 0);
    return released;
  }
}
