// Shared type definitions for TinyBrave

export interface BattleData {
  enemyKey: string;
  enemyName: string;
  enemyHp: number;
  enemyMaxHp: number;
  enemyAttack: number;
  playerHp: number;
  playerMaxHp: number;
  playerAttack: number;
}

export type BattleAction = 'attack' | 'skill' | 'flee';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface TilePosition {
  tileX: number;
  tileY: number;
}
