export type BattleAction = 'attack' | 'skill' | 'flee';

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
