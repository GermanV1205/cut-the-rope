import Phaser from "phaser";

// Aquí importaremos las escenas más adelante
// import BootScene from './scenes/BootScene';
// import MainMenu from './scenes/MainMenu';
// import GameScene from './scenes/GameScene';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "game-container", // El div donde vivirá el juego
  scale: {
    mode: Phaser.Scale.FIT, // Escala automáticamente manteniendo la proporción
    autoCenter: Phaser.Scale.CENTER_BOTH, // Centra el juego en la pantalla
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 }, // Gravedad necesaria para el estilo "Cut the Rope"
      debug: false, // Cambia a true para ver las "cajas" de colisión mientras programas
    },
  },
  scene: [
    // BootScene, MainMenu, GameScene
  ],
};

const game = new Phaser.Game(config);
