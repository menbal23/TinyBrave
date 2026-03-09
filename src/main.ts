import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { MapScene } from './scenes/MapScene';
import { BattleScene } from './scenes/BattleScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  pixelArt: true,
  zoom: 2,
  backgroundColor: '#1a1a2e',
  scene: [BootScene, MapScene, BattleScene],
  physics: {
    default: 'arcade',
    arcade: { gravity: { x: 0, y: 0 }, debug: false },
  },
};

new Phaser.Game(config);
