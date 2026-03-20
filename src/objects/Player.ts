import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private speed = 80;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setSize(12, 12);
  }

  move(up: boolean, down: boolean, left: boolean, right: boolean) {
    const body = this.body as Phaser.Physics.Arcade.Body;
    let vx = 0;
    let vy = 0;
    if (up) vy -= 1;
    if (down) vy += 1;
    if (left) vx -= 1;
    if (right) vx += 1;

    // normalize diagonal
    if (vx !== 0 && vy !== 0) {
      const inv = Math.SQRT1_2;
      vx *= inv;
      vy *= inv;
    }

    body.setVelocity(vx * this.speed, vy * this.speed);

    // animations (fallback to single-frame if not available)
    if (vx === 0 && vy === 0) {
      // idle
      if (this.anims.exists('idle-down')) this.anims.play('idle-down', true);
      else this.setFrame(1);
    } else {
      if (vy > 0) {
        if (this.anims.exists('walk-down')) this.anims.play('walk-down', true);
      } else if (vy < 0) {
        if (this.anims.exists('walk-up')) this.anims.play('walk-up', true);
      } else if (vx < 0) {
        if (this.anims.exists('walk-left')) this.anims.play('walk-left', true);
      } else if (vx > 0) {
        if (this.anims.exists('walk-right')) this.anims.play('walk-right', true);
      }
    }
  }
}
