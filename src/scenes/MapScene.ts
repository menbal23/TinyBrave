import Phaser from 'phaser';

const TILE_SIZE = 16;
const MAP_COLS = 20;
const MAP_ROWS = 15;

// Simple tilemap: 0 = grass, 1 = water (impassable)
const MAP_DATA: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

const MAP_WIDTH = MAP_COLS * TILE_SIZE;
const MAP_HEIGHT = MAP_ROWS * TILE_SIZE;

const PLAYER_SPEED = 80;

export class MapScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private tileGraphics!: Phaser.GameObjects.Graphics;

  constructor() {
    super({ key: 'MapScene' });
  }

  create(): void {
    // Draw tilemap programmatically
    this.tileGraphics = this.add.graphics();
    this.drawTilemap();

    // Place player at center of map (walkable start position)
    this.player = this.add.image(TILE_SIZE * 2 + TILE_SIZE / 2, TILE_SIZE * 2 + TILE_SIZE / 2, 'player');
    this.player.setDepth(1);

    // Camera setup
    this.cameras.main.setBounds(0, 0, MAP_WIDTH, MAP_HEIGHT);
    this.cameras.main.startFollow(this.player, true);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // HUD hint
    const hint = this.add.text(4, 4, 'Arrow/WASD: Move  SPACE: Battle', {
      fontSize: '6px',
      color: '#ffffff',
    });
    hint.setScrollFactor(0).setDepth(10);
  }

  update(_time: number, delta: number): void {
    const speed = PLAYER_SPEED;
    const dt = delta / 1000;

    let dx = 0;
    let dy = 0;

    if (this.cursors.left.isDown || this.wasd.left.isDown) dx -= speed * dt;
    if (this.cursors.right.isDown || this.wasd.right.isDown) dx += speed * dt;
    if (this.cursors.up.isDown || this.wasd.up.isDown) dy -= speed * dt;
    if (this.cursors.down.isDown || this.wasd.down.isDown) dy += speed * dt;

    const nextX = Phaser.Math.Clamp(this.player.x + dx, TILE_SIZE / 2, MAP_WIDTH - TILE_SIZE / 2);
    const nextY = Phaser.Math.Clamp(this.player.y + dy, TILE_SIZE / 2, MAP_HEIGHT - TILE_SIZE / 2);

    // Collision: check tile at destination
    const col = Math.floor(nextX / TILE_SIZE);
    const row = Math.floor(nextY / TILE_SIZE);

    if (MAP_DATA[row]?.[col] !== 1) {
      this.player.x = nextX;
      this.player.y = nextY;
    }

    // Transition to BattleScene on SPACE
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('BattleScene');
    }
  }

  private drawTilemap(): void {
    for (let row = 0; row < MAP_ROWS; row++) {
      for (let col = 0; col < MAP_COLS; col++) {
        const tile = MAP_DATA[row][col];
        const x = col * TILE_SIZE;
        const y = row * TILE_SIZE;

        if (tile === 0) {
          // Grass: green
          this.tileGraphics.fillStyle(0x3a7d44, 1);
          this.tileGraphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          this.tileGraphics.lineStyle(1, 0x2e6235, 0.5);
          this.tileGraphics.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        } else {
          // Water / wall: dark blue
          this.tileGraphics.fillStyle(0x1a3a5c, 1);
          this.tileGraphics.fillRect(x, y, TILE_SIZE, TILE_SIZE);
          this.tileGraphics.lineStyle(1, 0x102840, 0.8);
          this.tileGraphics.strokeRect(x, y, TILE_SIZE, TILE_SIZE);
        }
      }
    }
  }
}
