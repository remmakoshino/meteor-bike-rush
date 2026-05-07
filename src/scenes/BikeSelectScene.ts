import Phaser from 'phaser';
import { BIKES } from '../data/bikes';
import type { GameFlowContext } from '../types';
import { createMenuButton } from './helpers';

export class BikeSelectScene extends Phaser.Scene {
  static readonly KEY = 'BikeSelectScene';

  constructor() {
    super(BikeSelectScene.KEY);
  }

  create(data: { flow: GameFlowContext }): void {
    const flow = data.flow;
    const { width } = this.scale;

    this.add.rectangle(width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x082f49, 1);
    this.add.text(width / 2, 64, 'バイク選択', { fontSize: '40px', color: '#f8fafc' }).setOrigin(0.5);

    BIKES.forEach((bike, index) => {
      createMenuButton(this, width / 2, 140 + index * 58, `${bike.name}  最高速:${bike.stats.maxSpeed}`, () => {
        this.scene.start('CupSelectScene', {
          flow: {
            ...flow,
            bikeId: bike.id
          }
        });
      }, 520, 48);
    });

    createMenuButton(this, width / 2, this.scale.height - 42, 'ライダー選択へ戻る', () => {
      this.scene.start('RiderSelectScene', { flow });
    }, 320, 42);
  }
}
