import Phaser from 'phaser';
import { CUPS_BY_ID, TRACKS } from '../data/tracks';
import type { GameFlowContext } from '../types';
import { createMenuButton } from './helpers';

export class CupSelectScene extends Phaser.Scene {
  static readonly KEY = 'CupSelectScene';

  constructor() {
    super(CupSelectScene.KEY);
  }

  create(data: { flow: GameFlowContext }): void {
    const flow = data.flow;
    const { width } = this.scale;

    this.add.rectangle(width / 2, this.scale.height / 2, this.scale.width, this.scale.height, 0x172554, 1);
    this.add.text(width / 2, 60, 'カップ・コース選択', { fontSize: '38px', color: '#f8fafc' }).setOrigin(0.5);

    const cupIds = Array.from(new Set(TRACKS.map((track) => track.cupId)));

    let y = 120;
    for (const cupId of cupIds) {
      const cupTracks = TRACKS.filter((track) => track.cupId === cupId);
      this.add.text(120, y - 16, CUPS_BY_ID[cupId]?.name ?? cupId, { fontSize: '24px', color: '#67e8f9' });

      cupTracks.forEach((track) => {
        createMenuButton(this, width / 2 + 80, y + 14, track.name, () => {
          this.scene.start('RaceScene', {
            flow: {
              ...flow,
              cupId,
              trackId: track.id,
              roundIndex: 0
            }
          });
        }, 460, 42);
        y += 52;
      });

      y += 18;
    }

    createMenuButton(this, width / 2, this.scale.height - 44, 'バイク選択へ戻る', () => {
      this.scene.start('BikeSelectScene', { flow });
    }, 300, 42);
  }
}
