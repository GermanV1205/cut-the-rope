// src/main.js
import Phaser from "phaser";
import MainMenu from "./scenes/MainMenu";
import LevelSelector from "./scenes/LevelSelector";
import GameScene from "./scenes/GameScene";
import OptionsScene from "./scenes/OptionsScene";

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game-container",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },

  scene: [MainMenu, LevelSelector, GameScene, OptionsScene],
};

const game = new Phaser.Game(config);
