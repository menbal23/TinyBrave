import Phaser from 'phaser';
import { Player } from '../objects/Player';
import { BattleData } from '../types';

// Encounter rate: 1 in N steps
const ENCOUNTER_RATE = 8;

export class MapScene extends Phaser.Scene {
  private player!: Player;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private stepCount: number = 0;
  private isMoving: boolean = false;

  constructor() {
    super({ key: 'MapScene' });
  }

  preload(): void {
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/example.json');
    this.load.spritesheet('player', 'assets/sprites/player.png', {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  create(): void {
    // --- Tilemap ---
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('tileset', 'tiles');

    // --- Player ---
    this.player = new Player(this, 80, 80);
    this.add.existing(this.player);

    if (tileset) {
      const groundLayer = map.createLayer('Ground', tileset, 0, 0);
      if (groundLayer) {
        // Tile index 3 = wall (collides), tiles 1 & 2 are passable
        groundLayer.setCollisionByExclusion([-1, 1, 2]);
        this.physics.add.collider(this.player, groundLayer);
      }
    }

    // --- Camera ---
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);

    const mapWidth = (map.width ?? 10) * (map.tileWidth ?? 16);
    const mapHeight = (map.height ?? 10) * (map.tileHeight ?? 16);
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // --- Input ---
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };

    // --- HUD ---
    this.createHUD();

    // --- Fade in ---
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  private createHUD(): void {
    const hud = this.add.text(4, 4, 'HP: 20 / 20', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#00ff88',
    });
    hud.setScrollFactor(0);
    hud.setDepth(100);
  }

  update(): void {
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;
    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;

    const wasMoving = this.isMoving;
    this.player.move(up, down, left, right);
    this.isMoving = up || down || left || right;

    // Count steps for random encounter
    if (this.isMoving && !wasMoving) {
      this.stepCount++;
      if (this.stepCount >= ENCOUNTER_RATE) {
        this.stepCount = 0;
        if (Math.random() < 0.4) {
          this.triggerBattle();
        }
      }
    }
  }

  private triggerBattle(): void {
    this.cameras.main.flash(200, 255, 255, 255);
    this.time.delayedCall(250, () => {
      const battleData: BattleData = {
        enemyKey: 'slime',
        enemyName: 'Slime',
        enemyHp: 15,
        enemyMaxHp: 15,
        enemyAttack: 4,
        playerHp: 20,
        playerMaxHp: 20,
        playerAttack: 6,
      };
      this.scene.start('BattleScene', battleData);
    });
  }
}
