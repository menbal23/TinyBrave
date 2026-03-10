import Phaser from 'phaser';

const TILE_SIZE = 16;
const MAP_COLS = 20;
const MAP_ROWS = 15;
const PLAYER_SPEED = 80;
// Minimum body velocity (px/s) considered as "moving" for animation purposes.
// Values below this threshold are treated as stationary (e.g. blocked by a wall).
const MOVEMENT_THRESHOLD = 0.5;

// Tile indices (matches columns in tileset.png)
const TILE_GRASS = 0;
const TILE_FLOWER = 3;

// Simple hand-crafted map layout (0=grass, 1=wall, 2=water, 3=flower)
// prettier-ignore
const MAP_LAYOUT: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 0, 0, 2, 2, 0, 0, 2, 0, 0, 1, 1, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 1],
  [1, 0, 0, 3, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 0, 0, 3, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1],
  [1, 0, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 1],
  [1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 3, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 3, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

type Direction = 'down' | 'up' | 'left' | 'right';

export class MapScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: {
    up: Phaser.Input.Keyboard.Key;
    down: Phaser.Input.Keyboard.Key;
    left: Phaser.Input.Keyboard.Key;
    right: Phaser.Input.Keyboard.Key;
  };
  private spaceKey!: Phaser.Input.Keyboard.Key;
  private fpsText!: Phaser.GameObjects.Text;
  private facingDir: Direction = 'down';

  constructor() {
    super({ key: 'MapScene' });
  }

  create(): void {
    const mapWidth = MAP_COLS * TILE_SIZE;
    const mapHeight = MAP_ROWS * TILE_SIZE;

    // Build tilemap programmatically
    const map = this.make.tilemap({
      data: MAP_LAYOUT,
      tileWidth: TILE_SIZE,
      tileHeight: TILE_SIZE,
    });

    const tileset = map.addTilesetImage('tiles', 'tiles', TILE_SIZE, TILE_SIZE, 0, 0);
    if (!tileset) throw new Error('Failed to load tileset');

    const groundLayer = map.createLayer(0, tileset, 0, 0);
    if (!groundLayer) throw new Error('Failed to create map layer');

    // Set collision on wall and water tiles (exclude grass and flower)
    groundLayer.setCollisionByExclusion([TILE_GRASS, TILE_FLOWER]);

    // Spawn player in a passable cell (col=2, row=1 = grass)
    this.player = this.physics.add.sprite(
      TILE_SIZE * 2 + TILE_SIZE / 2,
      TILE_SIZE * 1 + TILE_SIZE / 2,
      'player'
    );
    this.player.setCollideWorldBounds(true);
    // Hitbox: 10×10, offset to sit at the lower-centre of the 16×16 sprite (feet level)
    this.player.setBodySize(10, 10, false);
    this.player.setOffset(3, 5);

    // Tile collider
    this.physics.add.collider(this.player, groundLayer);

    // Camera
    this.cameras.main.setBounds(0, 0, mapWidth, mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Explicitly set physics world bounds to match the map
    this.physics.world.setBounds(0, 0, mapWidth, mapHeight);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = {
      up: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      down: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      left: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      right: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    // Reset to discard any key state carried over from the previous scene
    this.spaceKey.reset();

    // HUD — fixed to camera
    const cam = this.cameras.main;
    this.fpsText = this.add
      .text(4, 4, 'FPS: --', { fontSize: '8px', color: '#ffffff', backgroundColor: '#00000088' })
      .setScrollFactor(0)
      .setDepth(10);

    this.add
      .text(cam.width / 2, cam.height - 10, '[SPACE] Enter Battle', {
        fontSize: '8px',
        color: '#ffd700',
        backgroundColor: '#00000088',
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(10);

    // Start idle animation
    this.player.play('idle-down');
  }

  update(_time: number, delta: number): void {
    const vel = PLAYER_SPEED;
    let vx = 0;
    let vy = 0;

    const left = this.cursors.left.isDown || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const up = this.cursors.up.isDown || this.wasd.up.isDown;
    const down = this.cursors.down.isDown || this.wasd.down.isDown;

    if (left) {
      vx = -vel;
      this.facingDir = 'left';
    } else if (right) {
      vx = vel;
      this.facingDir = 'right';
    }

    if (up) {
      vy = -vel;
      this.facingDir = 'up';
    } else if (down) {
      vy = vel;
      this.facingDir = 'down';
    }

    // Normalise diagonal speed
    if (vx !== 0 && vy !== 0) {
      vx *= Math.SQRT1_2;
      vy *= Math.SQRT1_2;
    }

    this.player.setVelocity(vx, vy);

    // Play animation — use actual post-physics velocity so the walk cycle stops when
    // the player is blocked by a wall instead of playing in place.
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    const moving = Math.abs(body.velocity.x) > MOVEMENT_THRESHOLD || Math.abs(body.velocity.y) > MOVEMENT_THRESHOLD;
    const animKey = moving ? `walk-${this.facingDir}` : `idle-${this.facingDir}`;
    if (this.player.anims.currentAnim?.key !== animKey) {
      this.player.play(animKey, true);
    }

    // FPS counter
    const fps = Math.round(1000 / (delta || 16));
    this.fpsText.setText(`FPS: ${fps}`);

    // Transition to BattleScene
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.player.setVelocity(0, 0);
      this.scene.start('BattleScene');
    }
  }
}
