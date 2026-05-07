import { ITEM_DEFINITIONS, ITEM_WEIGHT_TABLE } from '../data/items';
import type { DriverRuntime, ItemId, TrackDef } from '../types';
import { clamp, distanceSq } from '../utils/math';
import { Rng } from '../utils/rng';

export class ItemSystem {
  private rng = new Rng();
  private lastItemByDriver = new Map<string, ItemId>();
  private itemBoxRespawnAt = new Map<number, number>();

  reset(track: TrackDef): void {
    this.itemBoxRespawnAt.clear();
    track.itemBoxes.forEach((_, index) => {
      this.itemBoxRespawnAt.set(index, 0);
    });
  }

  tryPickup(driver: DriverRuntime, rank: number, itemBoxIndex: number, track: TrackDef, nowMs: number): string | null {
    if (driver.itemSlot) {
      return null;
    }

    const availableAt = this.itemBoxRespawnAt.get(itemBoxIndex) ?? 0;
    if (nowMs < availableAt) {
      return null;
    }

    const rolled = this.rollItem(driver.driverId, rank);
    driver.itemSlot = rolled;
    const respawnMs = track.itemBoxes[itemBoxIndex]?.respawnMs ?? 3000;
    this.itemBoxRespawnAt.set(itemBoxIndex, nowMs + respawnMs);
    return `${ITEM_DEFINITIONS[rolled].name} を獲得`;
  }

  isItemBoxActive(itemBoxIndex: number, nowMs: number): boolean {
    const availableAt = this.itemBoxRespawnAt.get(itemBoxIndex) ?? 0;
    return nowMs >= availableAt;
  }

  useItem(user: DriverRuntime, allDrivers: DriverRuntime[]): string {
    const itemId = user.itemSlot;
    if (!itemId) {
      return 'アイテム未所持';
    }

    user.itemSlot = null;
    const others = allDrivers.filter((driver) => driver.driverId !== user.driverId);

    switch (itemId) {
      case 'sparkBolt': {
        const target = this.findNearestAhead(user, others);
        if (!target || target.shieldTimerMs > 0) {
          return 'スパークボルトは回避された';
        }
        target.stunTimerMs = Math.max(target.stunTimerMs, 850);
        target.speed *= 0.55;
        return 'スパークボルト命中';
      }
      case 'slipMist': {
        const target = this.findNearestBehind(user, others);
        if (!target || target.shieldTimerMs > 0) {
          return 'スリップミストは不発';
        }
        target.stunTimerMs = Math.max(target.stunTimerMs, 520);
        target.speed *= 0.6;
        return '後方ライダーを減速';
      }
      case 'pulseRing': {
        let hits = 0;
        for (const target of others) {
          if (target.shieldTimerMs > 0) {
            continue;
          }
          if (distanceSq(target.position.x, target.position.y, user.position.x, user.position.y) <= 170 * 170) {
            target.stunTimerMs = Math.max(target.stunTimerMs, 400);
            target.speed *= 0.7;
            hits += 1;
          }
        }
        return hits > 0 ? `パルスリングで ${hits} 台に命中` : 'パルスリングは空振り';
      }
      case 'fluxShield':
        user.shieldTimerMs = Math.max(user.shieldTimerMs, ITEM_DEFINITIONS.fluxShield.durationMs ?? 2500);
        return 'フラックスシールド展開';
      case 'reflectCore':
        user.shieldTimerMs = Math.max(user.shieldTimerMs, ITEM_DEFINITIONS.reflectCore.durationMs ?? 1800);
        return 'リフレクトコア起動';
      case 'cometBooster':
        user.boostTimerMs = Math.max(user.boostTimerMs, ITEM_DEFINITIONS.cometBooster.durationMs ?? 1200);
        return 'コメットブースター発動';
      case 'twinTurbo':
        user.boostTimerMs = Math.max(user.boostTimerMs, ITEM_DEFINITIONS.twinTurbo.durationMs ?? 2000);
        return 'ツインターボ発動';
      case 'overdrive':
        user.boostTimerMs = Math.max(user.boostTimerMs, ITEM_DEFINITIONS.overdrive.durationMs ?? 2500);
        return 'オーバードライブ発動';
      case 'gravityField': {
        let hits = 0;
        for (const target of others) {
          if (target.rank < user.rank) {
            target.speed *= 0.75;
            hits += 1;
          }
        }
        return hits > 0 ? `前方 ${hits} 台を重力場で減速` : '重力場は対象なし';
      }
      case 'noisePulse': {
        let hits = 0;
        for (const target of others) {
          if (Math.abs(target.rank - user.rank) <= 2) {
            target.stunTimerMs = Math.max(target.stunTimerMs, 300);
            hits += 1;
          }
        }
        return hits > 0 ? `ノイズパルスで ${hits} 台を撹乱` : 'ノイズパルスは不発';
      }
      default:
        return 'アイテム効果なし';
    }
  }

  private rollItem(driverId: string, rank: number): ItemId {
    const clampedRank = clamp(rank, 1, 8);
    const index = clampedRank - 1;

    const weighted = (Object.keys(ITEM_DEFINITIONS) as ItemId[]).map((id) => {
      let weight = ITEM_WEIGHT_TABLE[id][index]!;
      if (this.lastItemByDriver.get(driverId) === id) {
        weight *= 0.45;
      }
      return { id, weight };
    });

    const total = weighted.reduce((sum, item) => sum + item.weight, 0);
    let roll = this.rng.next() * total;

    for (const item of weighted) {
      roll -= item.weight;
      if (roll <= 0) {
        this.lastItemByDriver.set(driverId, item.id);
        return item.id;
      }
    }

    const fallback = weighted[weighted.length - 1]!.id;
    this.lastItemByDriver.set(driverId, fallback);
    return fallback;
  }

  private findNearestAhead(user: DriverRuntime, drivers: DriverRuntime[]): DriverRuntime | undefined {
    return drivers
      .filter((driver) => driver.rank < user.rank && !driver.finished)
      .sort((a, b) => b.rank - a.rank)[0];
  }

  private findNearestBehind(user: DriverRuntime, drivers: DriverRuntime[]): DriverRuntime | undefined {
    return drivers
      .filter((driver) => driver.rank > user.rank && !driver.finished)
      .sort((a, b) => a.rank - b.rank)[0];
  }
}
