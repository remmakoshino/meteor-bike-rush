import Phaser from 'phaser';
import type { GameFlowContext } from '../types';
import { BIKES } from '../data/bikes';
import { RIDERS } from '../data/riders';
import { TRACKS } from '../data/tracks';
import { createMenuButton } from './helpers';

export class ModeSelectScene extends Phaser.Scene {
  static readonly KEY = 'ModeSelectScene';

  constructor() {
    super(ModeSelectScene.KEY);
  }

  create(): void {
    const { width, height } = this.scale;
    this.add.rectangle(width / 2, height / 2, width, height, 0x08132a, 1);

    this.add.text(width / 2, 120, 'モード選択', { fontSize: '40px', color: '#f8fafc' }).setOrigin(0.5);

    const baseFlow: GameFlowContext = {
      mode: 'grandPrix',
      difficulty: 'normal',
      riderId: RIDERS[0]!.id,
      bikeId: BIKES[0]!.id,
      cupId: TRACKS[0]!.cupId,
      trackId: TRACKS[0]!.id,
      roundIndex: 0
    };

    createMenuButton(this, width / 2, 250, 'グランプリ', () => {
      this.scene.start('RiderSelectScene', {
        flow: { ...baseFlow, mode: 'grandPrix' as const }
      });
    }, 360, 60);

    createMenuButton(this, width / 2, 330, 'タイムアタック', () => {
      this.scene.start('RiderSelectScene', {
        flow: { ...baseFlow, mode: 'timeAttack' as const }
      });
    }, 360, 60);

    createMenuButton(this, width / 2, 430, 'タイトルへ戻る', () => {
      this.scene.start('TitleScene');
    }, 320, 52);
  }
}
