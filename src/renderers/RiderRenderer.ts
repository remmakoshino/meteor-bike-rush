import Phaser from 'phaser';
import type { RiderSpec } from '../types';

export class RiderRenderer {
  constructor(private scene: Phaser.Scene) {}

  createPortrait(x: number, y: number, rider: RiderSpec, isSelected: boolean): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);
    const baseColor = Phaser.Display.Color.HexStringToColor(rider.color).color;

    const bg = this.scene.add.rectangle(0, 0, 180, 46, 0x0b1220, 0.85).setOrigin(0.5);
    const accent = this.scene.add.circle(-70, 0, 13, baseColor, 1);
    const label = this.scene.add.text(-48, -11, rider.name, {
      fontSize: '16px',
      color: '#f8fafc'
    });
    const meta = this.scene.add.text(-48, 8, `${rider.weightClass.toUpperCase()} / 運 ${rider.baseSkill.itemLuck.toFixed(2)}`, {
      fontSize: '11px',
      color: '#94a3b8'
    });

    if (isSelected) {
      bg.setStrokeStyle(2, 0xfbbf24, 0.95);
    }

    container.add([bg, accent, label, meta]);
    return container;
  }
}
