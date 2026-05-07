import Phaser from 'phaser';
import type { DriverRuntime } from '../types';
import { formatMs } from '../utils/time';
import { ItemSlot } from './ItemSlot';

export class HUD {
  private lapText: Phaser.GameObjects.Text;
  private rankText: Phaser.GameObjects.Text;
  private speedText: Phaser.GameObjects.Text;
  private timeText: Phaser.GameObjects.Text;
  private messageText: Phaser.GameObjects.Text;
  private countdownText: Phaser.GameObjects.Text;
  private itemSlot: ItemSlot;

  constructor(private scene: Phaser.Scene) {
    this.lapText = scene.add.text(16, 12, 'LAP 1/3', { fontSize: '24px', color: '#f8fafc' });
    this.rankText = scene.add.text(16, 44, '順位 1/8', { fontSize: '20px', color: '#fde047' });
    this.speedText = scene.add.text(16, 72, '速度 0 km/h', { fontSize: '18px', color: '#67e8f9' });
    this.timeText = scene.add.text(16, 98, 'タイム 00:00.00', { fontSize: '18px', color: '#e2e8f0' });
    this.messageText = scene.add.text(16, scene.scale.height - 50, '', {
      fontSize: '18px',
      color: '#c4b5fd',
      stroke: '#020617',
      strokeThickness: 4
    });
    this.countdownText = scene.add.text(scene.scale.width / 2, scene.scale.height / 2, '', {
      fontSize: '92px',
      color: '#fef08a',
      stroke: '#020617',
      strokeThickness: 8
    });
    this.countdownText.setOrigin(0.5);
    this.countdownText.setDepth(500);

    this.itemSlot = new ItemSlot(scene, scene.scale.width - 210, 12);
  }

  update(driver: DriverRuntime, elapsedMs: number, laps: number): void {
    this.lapText.setText(`LAP ${Math.min(driver.lap, laps)}/${laps}`);
    this.rankText.setText(`順位 ${driver.rank}/8`);
    this.speedText.setText(`速度 ${Math.round(driver.speed)} km/h`);
    this.timeText.setText(`タイム ${formatMs(elapsedMs)}`);
  }

  setItemLabel(text: string): void {
    this.itemSlot.setText(text);
  }

  showMessage(message: string): void {
    this.messageText.setText(message);
    this.scene.time.delayedCall(1500, () => {
      this.messageText.setText('');
    });
  }

  setCountdown(text: string): void {
    this.countdownText.setText(text);
  }

  destroy(): void {
    this.lapText.destroy();
    this.rankText.destroy();
    this.speedText.destroy();
    this.timeText.destroy();
    this.messageText.destroy();
    this.countdownText.destroy();
    this.itemSlot.destroy();
  }
}
