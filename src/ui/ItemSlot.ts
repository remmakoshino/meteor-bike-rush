import Phaser from 'phaser';

export class ItemSlot {
  private box: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    this.box = scene.add.rectangle(x, y, 190, 40, 0x0f172a, 0.8).setOrigin(0, 0).setStrokeStyle(2, 0x22d3ee, 0.8);
    this.label = scene.add.text(x + 10, y + 10, 'アイテム: なし', {
      fontSize: '16px',
      color: '#e2e8f0'
    });
  }

  setText(value: string): void {
    this.label.setText(`アイテム: ${value}`);
  }

  destroy(): void {
    this.box.destroy();
    this.label.destroy();
  }
}
