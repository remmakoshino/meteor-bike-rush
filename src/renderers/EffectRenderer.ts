import Phaser from 'phaser';

export class EffectRenderer {
  constructor(private scene: Phaser.Scene) {}

  showFloatingText(x: number, y: number, text: string, color = '#fde047'): void {
    const label = this.scene.add.text(x, y, text, {
      fontSize: '16px',
      color,
      stroke: '#111827',
      strokeThickness: 3
    });
    label.setOrigin(0.5);

    this.scene.tweens.add({
      targets: label,
      y: y - 36,
      alpha: 0,
      duration: 800,
      ease: 'Cubic.Out',
      onComplete: () => label.destroy()
    });
  }

  flash(color = 0xffffff, alpha = 0.2, duration = 120): void {
    const overlay = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
      color,
      alpha
    );
    overlay.setDepth(1000);

    this.scene.tweens.add({
      targets: overlay,
      alpha: 0,
      duration,
      onComplete: () => overlay.destroy()
    });
  }
}
