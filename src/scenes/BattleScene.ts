import Phaser from 'phaser';
import { BattleData, BattleAction } from '../types';

type BattlePhase = 'player_turn' | 'enemy_turn' | 'victory' | 'defeat' | 'fled';

export class BattleScene extends Phaser.Scene {
  private battleData!: BattleData;
  private playerHp!: number;
  private enemyHp!: number;

  private hpText!: Phaser.GameObjects.Text;
  private enemyHpText!: Phaser.GameObjects.Text;
  private logText!: Phaser.GameObjects.Text;
  private actionButtons: Phaser.GameObjects.Text[] = [];
  private phase: BattlePhase = 'player_turn';

  constructor() {
    super({ key: 'BattleScene' });
  }

  init(data: BattleData): void {
    this.battleData = data;
    this.playerHp = data.playerHp;
    this.enemyHp = data.enemyHp;
    this.phase = 'player_turn';
    this.actionButtons = [];
  }

  preload(): void {
    // Enemy placeholder sprite would be loaded here
  }

  create(): void {
    const { width, height } = this.scale;

    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x0d0d1a);

    // Divider line
    this.add.rectangle(width / 2, height / 2, width, 2, 0x444466);

    // --- Enemy area (top half) ---
    this.add
      .text(width / 2, 20, this.battleData.enemyName, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ff6060',
      })
      .setOrigin(0.5);

    // Enemy placeholder sprite (colored rectangle)
    const enemySprite = this.add.rectangle(width / 2, 70, 32, 32, 0x44cc44);
    this.add.rectangle(enemySprite.x - 8, enemySprite.y - 4, 6, 6, 0x000000);
    this.add.rectangle(enemySprite.x + 8, enemySprite.y - 4, 6, 6, 0x000000);

    this.enemyHpText = this.add
      .text(width / 2, 110, this.getEnemyHpString(), {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#00ff88',
      })
      .setOrigin(0.5);

    // --- Player info (middle) ---
    this.hpText = this.add
      .text(10, height / 2 + 10, this.getPlayerHpString(), {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#00ff88',
      });

    // --- Battle log ---
    this.logText = this.add
      .text(width / 2, height / 2 + 30, 'What will you do?', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: '#cccccc',
        wordWrap: { width: width - 20 },
      })
      .setOrigin(0.5);

    // --- Action buttons ---
    this.createActionButtons();

    // --- Fade in ---
    this.cameras.main.fadeIn(300, 0, 0, 0);
  }

  private createActionButtons(): void {
    const { width, height } = this.scale;
    const actions: { label: string; action: BattleAction }[] = [
      { label: '⚔  Attack', action: 'attack' },
      { label: '✨  Skill', action: 'skill' },
      { label: '🏃  Flee', action: 'flee' },
    ];

    const startX = width / 2 - 80;
    const y = height - 35;

    actions.forEach(({ label, action }, i) => {
      const btn = this.add
        .text(startX + i * 70, y, label, {
          fontFamily: 'monospace',
          fontSize: '9px',
          color: '#ffffff',
          backgroundColor: '#2a2a4e',
          padding: { x: 6, y: 4 },
        })
        .setInteractive({ useHandCursor: true });

      btn.on('pointerover', () => {
        btn.setStyle({ color: '#f8d878', backgroundColor: '#4a4a8e' });
      });
      btn.on('pointerout', () => {
        btn.setStyle({ color: '#ffffff', backgroundColor: '#2a2a4e' });
      });
      btn.on('pointerdown', () => {
        if (this.phase === 'player_turn') {
          this.handleAction(action);
        }
      });

      this.actionButtons.push(btn);
    });
  }

  private handleAction(action: BattleAction): void {
    this.phase = 'enemy_turn';
    this.setButtonsEnabled(false);

    switch (action) {
      case 'attack':
        this.playerAttack();
        break;
      case 'skill':
        this.playerSkill();
        break;
      case 'flee':
        this.playerFlee();
        break;
    }
  }

  private playerAttack(): void {
    const dmg = this.battleData.playerAttack + Phaser.Math.Between(-2, 2);
    this.enemyHp = Math.max(0, this.enemyHp - dmg);
    this.setLog(`You attack! ${this.battleData.enemyName} takes ${dmg} damage.`);
    this.enemyHpText.setText(this.getEnemyHpString());

    if (this.enemyHp <= 0) {
      this.time.delayedCall(800, () => this.victory());
    } else {
      this.time.delayedCall(800, () => this.enemyTurn());
    }
  }

  private playerSkill(): void {
    const dmg = Math.floor(this.battleData.playerAttack * 1.8) + Phaser.Math.Between(-1, 1);
    this.enemyHp = Math.max(0, this.enemyHp - dmg);
    this.setLog(`You use a skill! ${this.battleData.enemyName} takes ${dmg} damage!`);
    this.enemyHpText.setText(this.getEnemyHpString());

    if (this.enemyHp <= 0) {
      this.time.delayedCall(800, () => this.victory());
    } else {
      this.time.delayedCall(800, () => this.enemyTurn());
    }
  }

  private playerFlee(): void {
    const success = Math.random() < 0.6;
    if (success) {
      this.phase = 'fled';
      this.setLog('You fled from battle!');
      this.time.delayedCall(1200, () => {
        this.cameras.main.fadeOut(400, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('MapScene');
        });
      });
    } else {
      this.setLog('Could not escape!');
      this.time.delayedCall(800, () => this.enemyTurn());
    }
  }

  private enemyTurn(): void {
    const dmg = this.battleData.enemyAttack + Phaser.Math.Between(-1, 1);
    this.playerHp = Math.max(0, this.playerHp - dmg);
    this.setLog(`${this.battleData.enemyName} attacks! You take ${dmg} damage.`);
    this.hpText.setText(this.getPlayerHpString());

    if (this.playerHp <= 0) {
      this.time.delayedCall(800, () => this.defeat());
    } else {
      this.time.delayedCall(800, () => this.nextPlayerTurn());
    }
  }

  private nextPlayerTurn(): void {
    this.phase = 'player_turn';
    this.setLog('What will you do?');
    this.setButtonsEnabled(true);
  }

  private victory(): void {
    this.phase = 'victory';
    this.setLog(`Victory! ${this.battleData.enemyName} was defeated!`);
    this.time.delayedCall(1500, () => {
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MapScene');
      });
    });
  }

  private defeat(): void {
    this.phase = 'defeat';
    this.setLog('You were defeated... Game Over.');
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(600, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('MenuScene');
      });
    });
  }

  private setLog(msg: string): void {
    this.logText.setText(msg);
  }

  private setButtonsEnabled(enabled: boolean): void {
    this.actionButtons.forEach((btn) => {
      if (enabled) {
        btn.setInteractive({ useHandCursor: true });
      } else {
        btn.disableInteractive();
      }
      btn.setAlpha(enabled ? 1 : 0.5);
    });
  }

  private getPlayerHpString(): string {
    return `HP: ${this.playerHp} / ${this.battleData.playerMaxHp}`;
  }

  private getEnemyHpString(): string {
    return `HP: ${this.enemyHp} / ${this.battleData.enemyMaxHp}`;
  }
}
