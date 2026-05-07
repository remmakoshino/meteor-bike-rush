import type { DriverRuntime, TrackDef } from '../types';
import { clamp, distanceSq } from '../utils/math';

export class CollisionSystem {
  private hazardCooldownByKey = new Map<string, number>();

  update(driver: DriverRuntime, track: TrackDef, dtMs: number): void {
    this.tickHazardCooldown(dtMs);
    this.applyTrackBoundary(driver, track);
    this.applyHazards(driver, track);
  }

  private tickHazardCooldown(dtMs: number): void {
    for (const [key, value] of this.hazardCooldownByKey) {
      const next = value - dtMs;
      if (next <= 0) {
        this.hazardCooldownByKey.delete(key);
      } else {
        this.hazardCooldownByKey.set(key, next);
      }
    }
  }

  private applyTrackBoundary(driver: DriverRuntime, track: TrackDef): void {
    const xs = track.aiPath.map((point) => point.x);
    const ys = track.aiPath.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;
    const rx = (maxX - minX) / 2;
    const ry = (maxY - minY) / 2;

    const nx = (driver.position.x - cx) / rx;
    const ny = (driver.position.y - cy) / ry;
    const radial = nx * nx + ny * ny;

    if (radial < 0.38 || radial > 1.22) {
      driver.speed *= 0.95;
    }

    if (radial > 1.4) {
      driver.position.x = clamp(driver.position.x, minX - 50, maxX + 50);
      driver.position.y = clamp(driver.position.y, minY - 50, maxY + 50);
      driver.speed *= 0.7;
    }
  }

  private applyHazards(driver: DriverRuntime, track: TrackDef): void {
    for (const hazard of track.hazards) {
      if (distanceSq(driver.position.x, driver.position.y, hazard.x, hazard.y) > hazard.radius * hazard.radius) {
        continue;
      }

      const cooldownKey = `${driver.driverId}_${hazard.id}`;
      const cooldown = this.hazardCooldownByKey.get(cooldownKey) ?? 0;
      if (cooldown > 0) {
        continue;
      }

      if (hazard.type === 'oil') {
        driver.speed *= 1 - hazard.power;
        driver.stunTimerMs = Math.max(driver.stunTimerMs, 280);
      } else if (hazard.type === 'slowZone') {
        driver.speed *= 1 - hazard.power * 0.7;
      } else {
        if (driver.shieldTimerMs <= 0) {
          driver.stunTimerMs = Math.max(driver.stunTimerMs, 450);
          driver.speed *= 0.75;
        }
      }

      this.hazardCooldownByKey.set(cooldownKey, 700);
    }
  }
}
