import type { DriverRuntime } from '../types';

export class BoostSystem {
  applyBoost(driver: DriverRuntime, durationMs: number, intensity = 1): void {
    driver.boostTimerMs = Math.max(driver.boostTimerMs, Math.floor(durationMs * intensity));
  }
}
