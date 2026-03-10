import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    const { width, height } = this.cameras.main;

    // Progress bar
    const progressBox = this.add.graphics();
    const progressBar = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add
      .text(width / 2, height / 2 - 50, 'Loading…', {
        fontSize: '16px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffd700, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    // Load placeholder assets
    this.load.spritesheet('player', 'assets/placeholder/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image('tiles', 'assets/placeholder/tileset.png');
  }

  create(): void {
    // Define player walk animations for each direction
    const animDefs = [
      { key: 'walk-down', frames: [0, 1, 2, 1] },
      { key: 'walk-up', frames: [12, 13, 14, 13] },
      { key: 'walk-left', frames: [4, 5, 6, 5] },
      { key: 'walk-right', frames: [8, 9, 10, 9] },
      { key: 'idle-down', frames: [1] },
      { key: 'idle-up', frames: [13] },
      { key: 'idle-left', frames: [5] },
      { key: 'idle-right', frames: [9] },
    ];

    animDefs.forEach(({ key, frames }) => {
      if (!this.anims.exists(key)) {
        this.anims.create({
          key,
          frames: this.anims.generateFrameNumbers('player', { frames }),
          frameRate: 8,
          repeat: -1,
        });
      }
    });

    this.scene.start('MapScene');
  }
}
