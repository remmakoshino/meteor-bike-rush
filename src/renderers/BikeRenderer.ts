import Phaser from 'phaser';

export class BikeRenderer {
  constructor(private scene: Phaser.Scene) {}

  createBike(x: number, y: number, color: number): Phaser.GameObjects.Container {
    const container = this.scene.add.container(x, y);

    const rearWheel = this.scene.add.circle(-9, 0, 4, 0x111827, 1);
    const frontWheel = this.scene.add.circle(10, 0, 4, 0x111827, 1);
    const body = this.scene.add.rectangle(0, 0, 22, 8, color, 1).setStrokeStyle(1, 0xe2e8f0, 0.6);
    const rider = this.scene.add.circle(-2, -6, 4.2, 0xf8fafc, 1);

    container.add([rearWheel, frontWheel, body, rider]);
    container.setSize(28, 16);

    return container;
  }
}
