import Phaser from 'phaser';
import { RIDERS } from '../data/riders';
import type { GameFlowContext } from '../types';
import { createMenuButton } from './helpers';

export class RiderSelectScene extends Phaser.Scene {
  static readonly KEY = 'RiderSelectScene';

  constructor() {
    super(RiderSelectScene.KEY);
  }

  create(data: { flow: GameFlowContext }): void {
    const flow = data.flow;
    const { width } = this.scale;

    this.add.rectangle(width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x0f172a, 1);
    this.add.text(width / 2, 64, 'ライダー選択', { fontSize: '40px', color: '#f8fafc' }).setOrigin(0.5);

    RIDERS.forEach((rider, index) => {
      createMenuButton(this, width / 2, 140 + index * 58, `${rider.name} (${rider.weightClass})`, () => {
        this.scene.start('BikeSelectScene', {
          flow: {
            ...flow,
            riderId: rider.id
          }
        });
      }, 420, 48);
    });

    createMenuButton(this, width / 2, this.scale.height - 42, 'モード選択へ戻る', () => {
      this.scene.start('ModeSelectScene');
    }, 300, 42);
  }
}
