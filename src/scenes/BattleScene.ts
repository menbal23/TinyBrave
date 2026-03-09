import Phaser from 'phaser';

type BattleAction = 'Attack' | 'Magic' | 'Item' | 'Run';

interface Combatant {
  name: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
}

const ACTIONS: BattleAction[] = ['Attack', 'Magic', 'Item', 'Run'];
const FIRE_SPELL_MP_COST = 3;

export class BattleScene extends Phaser.Scene {
  private hero: Combatant = { name: 'Hero', hp: 40, maxHp: 40, mp: 10, maxMp: 10 };
  private enemy: Combatant = { name: 'Slime', hp: 20, maxHp: 20, mp: 0, maxMp: 0 };

  private selectedAction = 0;
  private actionTexts: Phaser.GameObjects.Text[] = [];
  private heroStatText!: Phaser.GameObjects.Text;
  private enemyStatText!: Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'BattleScene' });
  }

  create(): void {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // Dark background panel
    const bg = this.add.graphics();
    bg.fillStyle(0x0d0d1a, 1);
    bg.fillRect(0, 0, W, H);

    // Top border line
    this.add.graphics().lineStyle(1, 0xffd700).lineBetween(0, 1, W, 1);
    this.add.graphics().lineStyle(1, 0xffd700).lineBetween(0, H - 1, W, H - 1);

    // Title
    this.add
      .text(W / 2, 8, '⚔  BATTLE  ⚔', { fontSize: '10px', color: '#ffd700' })
      .setOrigin(0.5, 0);

    // Enemy area (top half)
    this.add.graphics().fillStyle(0x1a1a3e, 1).fillRect(4, 24, W - 8, 80);

    // Enemy placeholder sprite (coloured rect)
    this.add.graphics().fillStyle(0x44cc44, 1).fillRect(W / 2 - 12, 30, 24, 24);

    this.enemyStatText = this.add.text(4, 110, '', { fontSize: '8px', color: '#ccffcc' });
    this.updateEnemyStats();

    // Hero stats panel (bottom-left)
    this.add.graphics().fillStyle(0x1a1a3e, 1).fillRect(4, 140, 120, 50);
    this.heroStatText = this.add.text(8, 144, '', { fontSize: '8px', color: '#aaddff' });
    this.updateHeroStats();

    // Action menu (bottom-right)
    this.add.graphics().fillStyle(0x1a1a3e, 1).fillRect(128, 140, W - 132, 50);

    ACTIONS.forEach((action, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const text = this.add.text(134 + col * 80, 148 + row * 18, action, {
        fontSize: '8px',
        color: '#ffffff',
      });
      this.actionTexts.push(text);
    });

    // Message box
    this.add.graphics().fillStyle(0x111122, 1).fillRect(4, H - 28, W - 8, 24);
    this.messageText = this.add
      .text(W / 2, H - 16, 'What will Hero do?', { fontSize: '8px', color: '#ffffff' })
      .setOrigin(0.5, 0.5);

    // Input — handled via keyboard event listener below
    this.input.keyboard!.on('keydown', (event: KeyboardEvent) => {
      this.handleKeyDown(event.code);
    });

    this.highlightAction();
  }

  private updateHeroStats(): void {
    const h = this.hero;
    this.heroStatText.setText(
      `${h.name}\nHP: ${h.hp}/${h.maxHp}  MP: ${h.mp}/${h.maxMp}`
    );
  }

  private updateEnemyStats(): void {
    const e = this.enemy;
    this.enemyStatText.setText(`${e.name}  HP: ${e.hp}/${e.maxHp}`);
  }

  private highlightAction(): void {
    this.actionTexts.forEach((text, i) => {
      text.setColor(i === this.selectedAction ? '#ffd700' : '#ffffff');
      text.setText((i === this.selectedAction ? '▶ ' : '  ') + ACTIONS[i]);
    });
  }

  private handleKeyDown(code: string): void {
    if (code === 'ArrowLeft' || code === 'KeyA') {
      this.selectedAction = (this.selectedAction - 1 + ACTIONS.length) % ACTIONS.length;
      this.highlightAction();
    } else if (code === 'ArrowRight' || code === 'KeyD') {
      this.selectedAction = (this.selectedAction + 1) % ACTIONS.length;
      this.highlightAction();
    } else if (code === 'ArrowUp' || code === 'KeyW') {
      this.selectedAction = (this.selectedAction - 2 + ACTIONS.length) % ACTIONS.length;
      this.highlightAction();
    } else if (code === 'ArrowDown' || code === 'KeyS') {
      this.selectedAction = (this.selectedAction + 2) % ACTIONS.length;
      this.highlightAction();
    } else if (code === 'Space' || code === 'Enter') {
      this.executeAction(ACTIONS[this.selectedAction]);
    } else if (code === 'Escape') {
      this.scene.start('MapScene');
    }
  }

  private executeAction(action: BattleAction): void {
    switch (action) {
      case 'Attack': {
        const dmg = Phaser.Math.Between(4, 8);
        this.enemy.hp = Math.max(0, this.enemy.hp - dmg);
        this.messageText.setText(`Hero attacks! Deals ${dmg} damage.`);
        this.updateEnemyStats();
        if (this.enemy.hp === 0) {
          this.time.delayedCall(800, () => {
            this.messageText.setText('Enemy defeated! Returning to map…');
            this.time.delayedCall(1200, () => this.scene.start('MapScene'));
          });
        }
        break;
      }
      case 'Magic':
        if (this.hero.mp >= FIRE_SPELL_MP_COST) {
          const dmg = Phaser.Math.Between(6, 12);
          this.hero.mp -= FIRE_SPELL_MP_COST;
          this.enemy.hp = Math.max(0, this.enemy.hp - dmg);
          this.messageText.setText(`Hero casts Fire! Deals ${dmg} damage.`);
          this.updateHeroStats();
          this.updateEnemyStats();
        } else {
          this.messageText.setText('Not enough MP!');
        }
        break;
      case 'Item':
        this.messageText.setText('No items in inventory.');
        break;
      case 'Run':
        this.messageText.setText('Got away safely!');
        this.time.delayedCall(800, () => this.scene.start('MapScene'));
        break;
    }
  }
}
