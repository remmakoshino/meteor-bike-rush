import Phaser from 'phaser';
import type { TrackDef } from '../types';

const THEME_COLORS: Record<TrackDef['backgroundTheme'], { bg: number; road: number; lane: number; hazard: number }> = {
  city: { bg: 0x0f172a, road: 0x1f2937, lane: 0x38bdf8, hazard: 0xf97316 },
  ice: { bg: 0x082f49, road: 0x164e63, lane: 0x7dd3fc, hazard: 0x0ea5e9 },
  volcano: { bg: 0x3f1d1d, road: 0x7f1d1d, lane: 0xfb7185, hazard: 0xf97316 },
  forest: { bg: 0x052e16, road: 0x14532d, lane: 0x86efac, hazard: 0xfacc15 },
  desert: { bg: 0x3f2f12, road: 0x78350f, lane: 0xfbbf24, hazard: 0xea580c },
  ocean: { bg: 0x082f49, road: 0x0369a1, lane: 0x67e8f9, hazard: 0x22d3ee },
  space: { bg: 0x020617, road: 0x1e293b, lane: 0xc084fc, hazard: 0xf43f5e }
};

export class TrackRenderer {
  private root: Phaser.GameObjects.Container;
  private itemBoxes: Phaser.GameObjects.Arc[] = [];

  constructor(private scene: Phaser.Scene) {
    this.root = new Phaser.GameObjects.Container(this.scene, 0, 0);
    scene.add.existing(this.root);
  }

  draw(track: TrackDef): Phaser.GameObjects.Arc[] {
    this.root.removeAll(true);
    this.itemBoxes = [];

    const colors = THEME_COLORS[track.backgroundTheme];
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(colors.bg, 1);
    graphics.fillRect(0, 0, this.scene.scale.width, this.scene.scale.height);

    const xs = track.aiPath.map((point) => point.x);
    const ys = track.aiPath.map((point) => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const rx = (maxX - minX) / 2;
    const ry = (maxY - minY) / 2;

    graphics.fillStyle(colors.road, 1);
    graphics.fillEllipse(centerX, centerY, (rx + 95) * 2, (ry + 95) * 2);

    graphics.fillStyle(colors.bg, 1);
    graphics.fillEllipse(centerX, centerY, (rx - 70) * 2, (ry - 70) * 2);

    graphics.lineStyle(3, colors.lane, 0.65);
    graphics.strokeEllipse(centerX, centerY, (rx + 10) * 2, (ry + 10) * 2);

    for (const checkpoint of track.checkpoints) {
      const marker = this.scene.add.circle(checkpoint.x, checkpoint.y, 4, 0xffffff, 0.2);
      this.root.add(marker);
    }

    for (const hazard of track.hazards) {
      const marker = this.scene.add.circle(hazard.x, hazard.y, hazard.radius, colors.hazard, 0.45);
      this.root.add(marker);
    }

    track.itemBoxes.forEach((box) => {
      const itemBox = this.scene.add.circle(box.x, box.y, 11, 0x22d3ee, 0.8);
      itemBox.setStrokeStyle(2, 0xe0f2fe, 1);
      this.itemBoxes.push(itemBox);
      this.root.add(itemBox);
    });

    this.root.add(graphics);
    this.root.sendToBack(graphics);

    return this.itemBoxes;
  }

  setItemBoxActive(index: number, active: boolean): void {
    const box = this.itemBoxes[index];
    if (!box) {
      return;
    }
    box.setAlpha(active ? 0.9 : 0.18);
  }

  destroy(): void {
    this.root.destroy(true);
  }
}
