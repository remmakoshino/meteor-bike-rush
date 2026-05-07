import type { BikeSpec, DriverRuntime, RaceInput, RiderSpec } from '../types';
import { clamp } from '../utils/math';

export class BikePhysics {
  update(driver: DriverRuntime, rider: RiderSpec, bike: BikeSpec, input: RaceInput, dtMs: number): void {
    if (driver.finished) {
      return;
    }

    const dt = dtMs / 1000;

    if (driver.stunTimerMs > 0) {
      driver.stunTimerMs = Math.max(0, driver.stunTimerMs - dtMs);
      driver.speed = Math.max(0, driver.speed - 260 * dt);
      return;
    }

    const acceleration = bike.stats.acceleration * 95;
    const drag = 70;
    const brakeForce = input.brake ? 240 : 0;
    const throttleForce = input.throttle ? acceleration : 0;
    const boostFactor = driver.boostTimerMs > 0 ? 1 + 0.26 * bike.stats.boostEfficiency : 1;
    const maxSpeed = bike.stats.maxSpeed * boostFactor;

    driver.speed += (throttleForce - drag - brakeForce) * dt;
    driver.speed = clamp(driver.speed, 0, maxSpeed);

    const turningInput = Number(input.turnRight) - Number(input.turnLeft);
    const turnBase = (bike.stats.handling * rider.baseSkill.handlingBonus * 1.7) / 10;
    const speedFactor = clamp(driver.speed / Math.max(1, bike.stats.maxSpeed), 0.2, 1.2);
    const driftBoost = input.drift ? 1.38 : 1;
    const steering = turningInput * turnBase * speedFactor * driftBoost;

    driver.heading += steering * dt;

    const dx = Math.cos(driver.heading) * driver.speed * dt;
    const dy = Math.sin(driver.heading) * driver.speed * dt;

    driver.position.x += dx;
    driver.position.y += dy;

    if (driver.boostTimerMs > 0) {
      driver.boostTimerMs = Math.max(0, driver.boostTimerMs - dtMs);
    }
    if (driver.shieldTimerMs > 0) {
      driver.shieldTimerMs = Math.max(0, driver.shieldTimerMs - dtMs);
    }
  }
}
