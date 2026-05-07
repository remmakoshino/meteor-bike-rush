import Phaser from 'phaser';
import { createScaleConfig } from './scale';
import { BootScene } from '../scenes/BootScene';
import { TitleScene } from '../scenes/TitleScene';
import { ModeSelectScene } from '../scenes/ModeSelectScene';
import { RiderSelectScene } from '../scenes/RiderSelectScene';
import { BikeSelectScene } from '../scenes/BikeSelectScene';
import { CupSelectScene } from '../scenes/CupSelectScene';
import { RaceScene } from '../scenes/RaceScene';
import { ResultScene } from '../scenes/ResultScene';

export function createGameConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: 'game-container',
    backgroundColor: '#020617',
    scale: createScaleConfig(),
    scene: [BootScene, TitleScene, ModeSelectScene, RiderSelectScene, BikeSelectScene, CupSelectScene, RaceScene, ResultScene],
    physics: {
      default: 'arcade'
    }
  };
}
