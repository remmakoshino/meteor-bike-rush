import Phaser from 'phaser';
import { BIKES } from '../data/bikes';
import { RIDERS } from '../data/riders';
import type { RaceResult } from '../types';
import { formatMs } from '../utils/time';
import { createMenuButton } from './helpers';

export class ResultScene extends Phaser.Scene {
  static readonly KEY = 'ResultScene';

  constructor() {
    super(ResultScene.KEY);
  }

  create(data: { result: RaceResult }): void {
    const result = data.result;
    const { width, height } = this.scale;

    this.add.rectangle(width / 2, height / 2, width, height, 0x020617, 1);
    this.add.text(width / 2, 56, 'レース結果', { fontSize: '46px', color: '#f8fafc' }).setOrigin(0.5);

    let y = 120;
    for (const row of result.finishedOrder.slice(0, 8)) {
      const rider = RIDERS.find((item) => item.id === row.riderId)?.name ?? row.riderId;
      const bike = BIKES.find((item) => item.id === row.bikeId)?.name ?? row.bikeId;
      const lineColor = row.isPlayer ? '#fde047' : '#cbd5e1';

      this.add.text(width * 0.18, y, `${row.rank}位`, { fontSize: '24px', color: lineColor });
      this.add.text(width * 0.26, y, `${rider} / ${bike}`, { fontSize: '22px', color: lineColor });
      this.add.text(width * 0.72, y, formatMs(row.totalTimeMs), { fontSize: '22px', color: lineColor });
      y += 42;
    }

    createMenuButton(this, width / 2, height - 100, '同じコースでもう一度', () => {
      this.scene.start('RaceScene', { flow: result.flow });
    }, 360, 52);

    createMenuButton(this, width / 2, height - 40, 'タイトルへ戻る', () => {
      this.scene.start('TitleScene');
    }, 300, 42);
  }
}
