import Phaser from 'phaser';

export function createMenuButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  width = 320,
  height = 52
): Phaser.GameObjects.Container {
  const container = scene.add.container(x, y);
  const bg = scene.add.rectangle(0, 0, width, height, 0x0f172a, 0.9).setStrokeStyle(2, 0x38bdf8, 0.8);
  const text = scene.add.text(0, 0, label, {
    fontSize: '20px',
    color: '#e2e8f0'
  });
  text.setOrigin(0.5);

  const hit = scene.add.rectangle(0, 0, width, height, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
  hit.on('pointerover', () => bg.setFillStyle(0x1e293b, 0.95));
  hit.on('pointerout', () => bg.setFillStyle(0x0f172a, 0.9));
  hit.on('pointerdown', onClick);

  container.add([bg, text, hit]);
  return container;
}
