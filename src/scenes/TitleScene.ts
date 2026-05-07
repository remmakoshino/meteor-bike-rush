import Phaser from 'phaser';
import { createMenuButton } from './helpers';

export class TitleScene extends Phaser.Scene {
  static readonly KEY = 'TitleScene';

  constructor() {
    super(TitleScene.KEY);
  }

  create(): void {
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x020617, 1);
    this.add.text(width / 2, height * 0.22, '流星バーストライダーズ', {
      fontSize: '58px',
      color: '#f8fafc',
      stroke: '#0f172a',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.add.text(width / 2, height * 0.31, 'バイク専用アーケードレース', {
      fontSize: '24px',
      color: '#67e8f9'
    }).setOrigin(0.5);

    createMenuButton(this, width / 2, height * 0.55, 'ゲーム開始', () => {
      this.scene.start('ModeSelectScene');
    });

    this.add.text(width / 2, height * 0.82, '操作: 矢印/WASD + Shift(ドリフト) + Space(アイテム)', {
      fontSize: '18px',
      color: '#94a3b8'
    }).setOrigin(0.5);
  }
}
