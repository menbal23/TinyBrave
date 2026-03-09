import Phaser from 'phaser';

const SPEED = 80;

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);

    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDepth(10);

    // Create animations if they don't exist yet
    this.createAnimations(scene);
  }

  private createAnimations(scene: Phaser.Scene): void {
    const anims = scene.anims;

    // If spritesheet has enough frames, create walk animations.
    // Otherwise, fall back to showing a single frame.
    const frameCount = scene.textures.get('player').frameTotal - 1;

    if (frameCount >= 4) {
      // Assuming layout: row 0 = down, row 1 = up, row 2 = left, row 3 = right (4 frames each)
      const directions = [
        { key: 'walk_down', start: 0, end: 3 },
        { key: 'walk_up', start: 4, end: 7 },
        { key: 'walk_left', start: 8, end: 11 },
        { key: 'walk_right', start: 12, end: 15 },
      ];
      directions.forEach(({ key, start, end }) => {
        if (!anims.exists(key)) {
          anims.create({
            key,
            frames: anims.generateFrameNumbers('player', { start, end }),
            frameRate: 8,
            repeat: -1,
          });
        }
      });
    } else {
      // Minimal spritesheet — just show idle frame
      if (!anims.exists('idle')) {
        anims.create({
          key: 'idle',
          frames: [{ key: 'player', frame: 0 }],
          frameRate: 1,
          repeat: -1,
        });
      }
      this.play('idle');
    }
  }

  move(up: boolean, down: boolean, left: boolean, right: boolean): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setVelocity(0, 0);

    const hasFullAnims = this.scene.anims.exists('walk_down');

    if (left) {
      body.setVelocityX(-SPEED);
      if (hasFullAnims) this.play('walk_left', true);
    } else if (right) {
      body.setVelocityX(SPEED);
      if (hasFullAnims) this.play('walk_right', true);
    }

    if (up) {
      body.setVelocityY(-SPEED);
      if (hasFullAnims) this.play('walk_up', true);
    } else if (down) {
      body.setVelocityY(SPEED);
      if (hasFullAnims) this.play('walk_down', true);
    }

    // Normalize diagonal movement
    if ((left || right) && (up || down)) {
      body.velocity.normalize().scale(SPEED);
    }

    // Idle when no key is pressed
    if (!up && !down && !left && !right) {
      if (hasFullAnims) {
        this.stop();
        this.setFrame(0);
      }
    }
  }
}
