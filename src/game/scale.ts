import Phaser from 'phaser';

export function createScaleConfig(): Phaser.Types.Core.ScaleConfig {
  const isPortrait = window.innerHeight > window.innerWidth;
  const width = isPortrait ? 720 : 1280;
  const height = isPortrait ? 1280 : 720;

  return {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width,
    height,
    min: {
      width: 320,
      height: 480
    },
    max: {
      width: 1920,
      height: 1920
    }
  };
}
