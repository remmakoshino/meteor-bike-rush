import type { Difficulty, DriverRuntime, RaceInput, TrackDef } from '../types';
import { wrapAngle } from '../utils/math';

export class AIDriverController {
  private nextPointByDriver = new Map<string, number>();

  buildInput(driver: DriverRuntime, track: TrackDef, difficulty: Difficulty): RaceInput {
    const current = this.nextPointByDriver.get(driver.driverId) ?? 0;
    const targetPoint = track.aiPath[current % track.aiPath.length]!;

    const dx = targetPoint.x - driver.position.x;
    const dy = targetPoint.y - driver.position.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 24) {
      this.nextPointByDriver.set(driver.driverId, (current + 1) % track.aiPath.length);
    }

    const desiredHeading = Math.atan2(dy, dx);
    const angleDiff = wrapAngle(desiredHeading - driver.heading);

    const difficultyBias = difficulty === 'expert' ? 0.95 : difficulty === 'hard' ? 1 : 1.08;
    const turnThreshold = 0.06 * difficultyBias;
    const sharpTurnThreshold = 0.75 * difficultyBias;

    const turnLeft = angleDiff < -turnThreshold;
    const turnRight = angleDiff > turnThreshold;
    const sharpTurn = Math.abs(angleDiff) > sharpTurnThreshold;

    const throttle = !sharpTurn || driver.speed < 175;
    const brake = sharpTurn && driver.speed > 210;
    const drift = sharpTurn && driver.speed > 120;

    return {
      throttle,
      brake,
      turnLeft,
      turnRight,
      drift
    };
  }
}
