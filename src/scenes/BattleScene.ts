import Phaser from 'phaser';

export class BattleScene extends Phaser.Scene {
  private returnKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    const { width, height } = this.scale;

    // Battle background
    this.add.rectangle(0, 0, width, height, 0x1a1a2e).setOrigin(0, 0);

    // Title
    this.add.text(width / 2, height / 2 - 40, '⚔ BATTLE', {
      fontSize: '16px',
      color: '#f0c040',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, 'Turn-based battle (coming soon)', {
      fontSize: '8px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 30, 'Press ESC to return to map', {
      fontSize: '7px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.returnKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
  }

  update(): void {
    if (Phaser.Input.Keyboard.JustDown(this.returnKey)) {
      this.scene.start('MapScene');
    }
  }
}
