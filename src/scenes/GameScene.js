// src/scenes/GameScene.js
import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    this.add
      .text(400, 300, "Aquí irá el nivel del juego", {
        fontSize: "32px",
        color: "#fff",
      })
      .setOrigin(0.5);

    // Botón para volver al menú
    const backBtn = this.add
      .text(400, 500, "Volver al Menú", { fontSize: "24px", color: "#ff0000" })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("MainMenu"));
  }
}
