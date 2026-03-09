import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    this.load.image('player', 'assets/player.png');
    this.load.image('tiles', 'assets/tiles.png');
  }

  create(): void {
    this.scene.start('MapScene');
  }
}
