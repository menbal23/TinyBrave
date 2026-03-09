import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload(): void {
    // Load any menu-specific assets here
  }

  create(): void {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

    // Decorative stars (pixel dots)
    const starPositions = [
      { x: 20, y: 15 }, { x: 55, y: 30 }, { x: 90, y: 10 }, { x: 140, y: 25 },
      { x: 180, y: 8 },  { x: 220, y: 20 }, { x: 260, y: 35 }, { x: 300, y: 12 },
      { x: 35, y: 60 },  { x: 75, y: 50 },  { x: 200, y: 55 }, { x: 280, y: 45 },
    ];
    starPositions.forEach(({ x, y }) => {
      this.add.rectangle(x, y, 2, 2, 0xffffff);
    });

    // Title text
    this.add
      .text(width / 2, height / 2 - 60, 'TinyBrave', {
        fontFamily: 'monospace',
        fontSize: '28px',
        color: '#f8d878',
        stroke: '#7c4000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Subtitle
    this.add
      .text(width / 2, height / 2 - 30, '- Retro Pixel RPG -', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#a0a0c0',
      })
      .setOrigin(0.5);

    // Start button
    const startText = this.add
      .text(width / 2, height / 2 + 20, '▶  START GAME', {
        fontFamily: 'monospace',
        fontSize: '14px',
        color: '#ffffff',
        backgroundColor: '#3a3a6e',
        padding: { x: 12, y: 6 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    // Button hover effect
    startText.on('pointerover', () => {
      startText.setStyle({ color: '#f8d878', backgroundColor: '#5a5aae' });
    });
    startText.on('pointerout', () => {
      startText.setStyle({ color: '#ffffff', backgroundColor: '#3a3a6e' });
    });
    startText.on('pointerdown', () => {
      this.cameras.main.fadeOut(300, 0, 0, 0);
    });
    this.cameras.main.on('camerafadeoutcomplete', () => {
      this.scene.start('MapScene');
    });

    // Controls hint
    this.add
      .text(width / 2, height - 20, 'WASD / Arrow Keys to move', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#606080',
      })
      .setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(500, 0, 0, 0);
  }
}
