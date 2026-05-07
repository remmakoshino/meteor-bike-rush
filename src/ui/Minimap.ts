import Phaser from 'phaser';
import type { DriverRuntime, TrackDef } from '../types';

export class Minimap {
  private graphics: Phaser.GameObjects.Graphics;
  private bounds: { minX: number; maxX: number; minY: number; maxY: number };

  constructor(private scene: Phaser.Scene, private track: TrackDef) {
    this.graphics = scene.add.graphics();

    const xs = track.aiPath.map((point) => point.x);
    const ys = track.aiPath.map((point) => point.y);
    this.bounds = {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }

  update(drivers: DriverRuntime[]): void {
    const mapX = this.scene.scale.width - 170;
    const mapY = this.scene.scale.height - 170;
    const mapW = 150;
    const mapH = 150;

    this.graphics.clear();
    this.graphics.fillStyle(0x020617, 0.72);
    this.graphics.fillRoundedRect(mapX, mapY, mapW, mapH, 10);
    this.graphics.lineStyle(2, 0x38bdf8, 0.8);

    this.track.aiPath.forEach((point, idx) => {
      const px = this.toMapX(point.x, mapX, mapW);
      const py = this.toMapY(point.y, mapY, mapH);
      if (idx === 0) {
        this.graphics.beginPath();
        this.graphics.moveTo(px, py);
      } else {
        this.graphics.lineTo(px, py);
      }
    });
    this.graphics.closePath();
    this.graphics.strokePath();

    for (const driver of drivers) {
      const px = this.toMapX(driver.position.x, mapX, mapW);
      const py = this.toMapY(driver.position.y, mapY, mapH);
      this.graphics.fillStyle(driver.isPlayer ? 0xfacc15 : 0xe2e8f0, 1);
      this.graphics.fillCircle(px, py, driver.isPlayer ? 4 : 3);
    }
  }

  destroy(): void {
    this.graphics.destroy();
  }

  private toMapX(x: number, mapX: number, mapW: number): number {
    return mapX + ((x - this.bounds.minX) / (this.bounds.maxX - this.bounds.minX)) * mapW;
  }

  private toMapY(y: number, mapY: number, mapH: number): number {
    return mapY + ((y - this.bounds.minY) / (this.bounds.maxY - this.bounds.minY)) * mapH;
  }
}
